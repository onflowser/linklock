import UserProfile from "../components/UserProfile";
import { useRouter } from "next/router";
import MainLayout from "../components/layouts/MainLayout";
import MetaTags from "../components/MetaTags";
import { useFlow } from "@membership/client";

export default function Profile() {
  const router = useRouter();
  const { currentUser, isLoggedIn} = useFlow();

  // TODO: Redirect / show message if user not registered / logged in

  return (
    <>
      <MetaTags title="Your FlowTea profile" />
      <UserProfile handleOrAddress={currentUser?.address} />
    </>
  );
}

Profile.Layout = MainLayout;
