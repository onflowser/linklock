import LoginLayout from "../../../components/layouts/LoginLayout";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { Input } from "../../../components/inputs/Input";
import { useRouter } from "next/router";
import MetaTags from "../../../components/MetaTags";
import {
  FlowService,
  useFlow,
  useGetMembershipDefinitionsByAdmin,
} from "@membership/client";
import { useFormik } from "formik";
import { MembershipDefinition } from "@membership/flow/index";
import { useEffect } from "react";

export default function MembershipSettings() {
  const flowService = FlowService.create();
  const { currentUser } = useFlow();
  const router = useRouter();
  const { id: membershipId } = router.query;
  const { data: membershipDefinitions } = useGetMembershipDefinitionsByAdmin(
    currentUser?.address
  );
  const membershipDefinition = membershipDefinitions?.find(
    (definition) => definition.id === membershipId
  );
  const { values, setValues, handleChange, setFieldValue, submitForm } =
    useFormik<Omit<MembershipDefinition, "id">>({
      initialValues: {
        name: "",
        description: "",
        thumbnail: "",
        // TODO: Enable metadata editing
        expirationInterval: "",
        maxSupply: "",
        requirement: {
          price: "",
          contractAddress: "0xf3fcd2c1a78f5eee",
          contractName: "FlowRequirement",
        },
      },
      onSubmit: (values) => {
        flowService
          .createMembership(values)
          .then(() => router.replace(`/${currentUser?.address}`));
      },
    });

  useEffect(() => {
    if (membershipDefinition) {
      setValues(membershipDefinition);
    }
  }, [setValues, membershipDefinition]);

  return (
    <>
      <MetaTags title="Profile settings" />
      <div className="profile-settings">
        <h3>Membership settings</h3>

        {/* TODO: Add option to upload profile photo? */}

        <div className="profile-fields">
          <Input
            label="Name"
            name="name"
            value={values.name}
            disabled={false}
            onChange={handleChange}
          />
          <Input
            label="Description"
            name="description"
            value={values.description}
            onChange={handleChange}
          />
          <Input
            label="Thumbnail URL"
            name="thumbnail"
            value={values.thumbnail}
            onChange={handleChange}
          />
          <Input
            label="Expiration (in days)"
            name="expiration"
            value={millisecondsToDays(values.expirationInterval)}
            onChange={(e) =>
              setFieldValue(
                "expirationInterval",
                daysToMilliseconds(e.target.value)
              )
            }
          />
          <Input
            label="Supply"
            name="maxSupply"
            value={values.maxSupply}
            onChange={handleChange}
          />
          <Input
            label="Price (FLOW)"
            name="requirement.price"
            value={values.requirement.price}
            onChange={handleChange}
          />
        </div>

        <PrimaryButton
          style={{
            marginTop: 50,
            width: "100%",
            maxWidth: "unset",
          }}
          onClick={submitForm}
        >
          Save
        </PrimaryButton>
      </div>
    </>
  );
}

const millisecondsInDay = 24 * 60 * 60 * 1000;

function millisecondsToDays(milliseconds: string) {
  return +milliseconds / millisecondsInDay;
}

function daysToMilliseconds(days: string) {
  return +days * millisecondsInDay;
}

MembershipSettings.Layout = LoginLayout;
