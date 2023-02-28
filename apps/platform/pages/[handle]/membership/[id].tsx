import { PrimaryButton } from "../../../components/PrimaryButton";
import { Input } from "../../../components/inputs/Input";
import { useRouter } from "next/router";
import MetaTags from "../../../components/MetaTags";
import {
  ServiceRegistry,
  useFlow,
  useGetMembershipDefinitionsByAdmin,
  daysToSeconds,
  secondsToDays,
} from "@membership/react";
import { useFormik } from "formik";
import { MembershipDefinition } from "@membership/protocol";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { TransactionResult } from "@membership/client";

export default function MembershipSettings() {
  const { membershipService } = ServiceRegistry.create();
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
        // TODO: Enable metadata editing?
        expirationInterval: "",
        maxSupply: "",
        requirement: {
          price: "",
          contractAddress: membershipService.getDefaultContractAddress(
            membershipService.config.network
          ),
          contractName: "FlowRequirement",
        },
      },
      onSubmit: async (values) => {
        await toast.promise(
          membershipService.setupMembershipDefinitionCollection(),
          {
            error: (result: TransactionResult) =>
              `Failed to setup NFT collection: ${result.error?.message}`,
            loading: "Setting up your NFT collection",
            success: "NFT collection is ready to go!",
          }
        );
        await toast.promise(membershipService.createMembership(values), {
          error: (result: TransactionResult) =>
            `Failed to create membership: ${result.error?.message}`,
          loading: "Creating membership...",
          success: "Membership created!",
        });
        refetchMembershipDefinitions();
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
