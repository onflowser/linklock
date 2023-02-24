import UserProfile from "../components/UserProfile";
import { useFcl } from "../common/user-context";
import { useEffect } from "react";
import { useRouter } from "next/router";
import MainLayout from "../components/layouts/MainLayout";
import { toast } from "react-hot-toast";
import MetaTags from "../components/MetaTags";

export default function Profile() {
  const router = useRouter();
  const { user, isLoggedIn, isLoadingUserInfo, isRegistered } = useFcl();

  useEffect(() => {
    if (isLoggedIn !== undefined && !isLoggedIn) {
      router.replace("/").then(() => {
        toast.error("Login to access your profile!");
      });
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (user && isLoggedIn && !isLoadingUserInfo && !isRegistered) {
      router.replace("/settings").then(() => {
        toast.error("You need to register first!");
      });
    }
  }, [isLoggedIn, isRegistered, isLoadingUserInfo]);

  return (
    <>
      <MetaTags title="Your FlowTea profile" />
      <UserProfile userId={user?.addr} />
    </>
  );
}

Profile.Layout = MainLayout;
