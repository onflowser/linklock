import LoginLayout from "../../../components/layouts/LoginLayout";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { Input } from "../../../components/inputs/Input";
import { useRouter } from "next/router";
import { useState } from "react";
import MetaTags from "../../../components/MetaTags";
import { RichTextEditor } from "../../../components/inputs/RichTextEditor";
import {
  useFlow,
  useGetMembershipDefinitionsByAdmin,
} from "@membership/client";
import { Avatar } from "../../../components/Avatar";

export default function MembershipSettings() {
  const { currentUser } = useFlow();
  const { query } = useRouter();
  const { id: membershipId } = query;
  const { data: membershipDefinitions } = useGetMembershipDefinitionsByAdmin(
    currentUser?.address
  );
  const membershipDefinition = membershipDefinitions?.find(
    (definition) => definition.id === membershipId
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [handle, setHandle] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");

  async function onSubmit() {
    // TODO: Adapt
  }

  function onFormatWebsiteUrl() {
    if (websiteUrl && !websiteUrl.startsWith("http")) {
      setWebsiteUrl(`https://${websiteUrl}`);
    }
  }

  return (
    <>
      <MetaTags title="Profile settings" />
      <div className="profile-settings">
        <h3>Membership settings</h3>

        {/* TODO: add profile photo functionality */}
        <Avatar imageUrl={membershipDefinition?.thumbnail} />

        <div className="profile-fields">
          {/* Hide the input if user is not signed in. */}
          {currentUser?.address && (
            <Input
              label="Address"
              placeholder="Address"
              value={currentUser.address}
              disabled
            />
          )}
          {/* // TODO: Adapt */}
          <Input
            label="Handle"
            placeholder="flowtea.me/your-handle"
            value={handle}
            disabled={false}
            onInput={(e) => setHandle(e.currentTarget.value)}
          />
          <Input
            label="Name"
            placeholder="Name"
            value={name}
            onInput={(e) => setName(e.currentTarget.value)}
          />
          <Input
            label="Email"
            placeholder="Email"
            type="email"
            value={email}
            onInput={(e) => setEmail(e.currentTarget.value)}
          />
          <Input
            label="Website"
            placeholder="Your website URL"
            type="url"
            value={websiteUrl}
            onInput={(e) => setWebsiteUrl(e.currentTarget.value)}
            onBlur={onFormatWebsiteUrl}
          />
          <RichTextEditor
            label="About"
            preview="edit"
            placeholder="Hello! I just created Buy me a Flow tea profile..."
            value={description}
            onChange={(md) => setDescription(md || "")}
          />
        </div>

        <PrimaryButton
          style={{
            marginTop: 50,
            width: "100%",
            maxWidth: "unset",
          }}
          isLoading={isSubmitting}
          onClick={onSubmit}
        >
          Save
        </PrimaryButton>
      </div>
    </>
  );
}

MembershipSettings.Layout = LoginLayout;
