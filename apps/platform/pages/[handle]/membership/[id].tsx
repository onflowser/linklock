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
import { MembershipDefinition } from "@membership/protocol";
import { useEffect } from "react";
import { daysToSeconds, secondsToDays } from "@membership/client";

export default function MembershipSettings() {
  const flowService = FlowService.create();
  const { currentUser } = useFlow();
  const { mutate: refetchMembershipDefinitions } =
    useGetMembershipDefinitionsByAdmin(currentUser?.address);
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
      onSubmit: async (values) => {
        await flowService.setupMembershipDefinitionCollection();
        await flowService.createMembership(values);
        await refetchMembershipDefinitions();
        await router.back();
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
        <h1>New membership settings</h1>

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
            value={secondsToDays(+values.expirationInterval)}
            onChange={(e) =>
              setFieldValue(
                "expirationInterval",
                daysToSeconds(+e.target.value)
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
