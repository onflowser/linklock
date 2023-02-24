import MainLayout from "../components/layouts/MainLayout";
import Profile from "./profile";
import { useRouter } from "next/router";
import UserProfile from "../components/UserProfile";
import { GetServerSideProps } from "next";

type Data = {};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const handleOrAddress = context.query.handle as string;
  // TODO: Adapt
  const data: Data = {  };
  return { props: { data } };
};

export default function OtherUserProfile({ data }: { data: Data }) {
  const router = useRouter();

  // TODO: prerender UserProfile component with above data ^
  return (
    <>
      {/* // TODO: Update */}
      {/*<MetaTags*/}
      {/*  title={`${name} (${address})`}*/}
      {/*  description={`${descPrefix}${description}`}*/}
      {/*/>*/}
      <UserProfile handleOrAddress={router.query.handle as string} />
    </>
  );
}

Profile.Layout = MainLayout;
