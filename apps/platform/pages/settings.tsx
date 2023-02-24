import LoginLayout from "../components/layouts/LoginLayout";
import { PrimaryButton } from "../components/PrimaryButton";
import { Input, TextArea } from "../components/inputs/Input";
import { useFcl } from "../common/user-context";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { isValidWebsiteUrl, wait } from "../common/utils";
import { useUserInfo } from "../common/use-user-info";
import MetaTags from "../components/MetaTags";
import { RichTextEditor } from "../components/inputs/RichTextEditor";

export default function Settings() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    update,
    updateEmail,
    user,
    isRegistered,
    info,
    fetchCurrentUserInfo,
  } = useFcl();
  const { handle: liveHandle } = useUserInfo(user?.addr);
  const { query } = useRouter();
  const [handle, setHandle] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");

  useEffect(() => {
    if (!isRegistered) {
      setHandle(query.handle as string);
    }
  }, [isRegistered, query]);

  useEffect(() => {
    if (info) {
      setName(info.name);
      setWebsiteUrl(info.websiteUrl);
      setDescription(info.description);
    }
    if (liveHandle) {
      setHandle(liveHandle);
    }
  }, [liveHandle, info]);

  async function onRegister() {
    if (!handle) {
      toast.error("Please enter your handle!");
      return;
    }
    try {
      await register(handle, name, websiteUrl, description);
      while (true) {
        await wait(500);
        if (await fetchCurrentUserInfo()) {
          break;
        }
      }
      await router.replace("/profile");
      toast.success("Registered!");
    } catch (e: any) {
      toast.error(e.toString());
    }
  }

  async function onUpdate() {
    try {
      await update(name, websiteUrl, description);
      toast.success("Info updated!");
    } catch (e: any) {
      toast.error(e.toString());
    }
  }

  async function onUpdateEmail() {
    try {
      await updateEmail(email);
      toast.success("Email updated!");
    } catch (e: any) {
      toast.error(`Failed to update email: ${e.message}`);
    }
  }

  function isInfoChanged() {
    return [
      [info?.name, name],
      [info?.description, description],
      [info?.websiteUrl, websiteUrl],
    ].some(([previous, current]) => previous !== current);
  }

  function isEmailChanged() {
    return email !== "";
  }

  async function onSubmit() {
    let errors = [];
    if (!name) {
      errors.push("Name is missing!");
    }
    if (!description) {
      errors.push("About is missing!");
    }
    if (websiteUrl && !isValidWebsiteUrl(websiteUrl)) {
      toast.error(
        "Please enter a valid website URL! (e.g. https://your-domain.com)"
      );
      return;
    }
    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      return;
    }
    setIsSubmitting(true);
    try {
      if (!isRegistered) {
        await onRegister();
      } else if (isInfoChanged()) {
        await onUpdate();
      } else {
        toast("Info unchanged!");
      }

      if (isEmailChanged()) {
        await onUpdateEmail();
      }
    } finally {
      setIsSubmitting(false);
    }
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
        {!isRegistered && <h3>Create your profile</h3>}

        {/* TODO: add profile photo functionality */}
        {/*<img src="/images/add-profile-photo.svg" alt=""/>*/}
        {/*<p>Drop image to change photo</p>*/}

        <div className="profile-fields">
          {/* Hide the input if user is not signed in. */}
          {user?.addr && (
            <Input
              label="Address"
              placeholder="Address"
              value={user?.addr}
              disabled
            />
          )}
          <Input
            label="Handle"
            placeholder="flowtea.me/your-handle"
            value={handle}
            disabled={isRegistered}
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
          {isRegistered ? "Save" : "Continue"}
        </PrimaryButton>
      </div>
    </>
  );
}

Settings.Layout = LoginLayout;
