import LoginLayout from "../components/layouts/LoginLayout";
import { PrimaryButton } from "../components/PrimaryButton";
import { Input } from "../components/inputs/Input";
import { useRouter } from "next/router";
import { useState } from "react";
import { useUserInfo } from "../common/use-user-info";
import MetaTags from "../components/MetaTags";
import { RichTextEditor } from "../components/inputs/RichTextEditor";
import { useFlow } from "@membership/client";

export default function Settings() {
  const router = useRouter();
  const {currentUser} = useFlow()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handle: liveHandle } = useUserInfo(currentUser?.address);
  const { query } = useRouter();
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
        <h3>Create your profile</h3>

        {/* TODO: add profile photo functionality */}
        {/*<img src="/images/add-profile-photo.svg" alt=""/>*/}
        {/*<p>Drop image to change photo</p>*/}

        <div className="profile-fields">
          {/* Hide the input if user is not signed in. */}
          {currentUser?.address&& (
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

Settings.Layout = LoginLayout;
