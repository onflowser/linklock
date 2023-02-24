import MainLayout from "../components/layouts/MainLayout";
import Profile from "./profile";
import UserProfile, { UserProfileProps } from "../components/UserProfile";
import { GetServerSideProps } from "next";
import { DomainsService } from "@membership/domains";

type HandlePageProps = UserProfileProps;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const nameOrAddress = context.query.handle as string;
  const nameInfo = await new DomainsService().lookupNameInfo(nameOrAddress)
  const props: HandlePageProps = {
    address: nameInfo?.find?.address ?? nameInfo?.flowns?.owner ?? nameOrAddress,
    nameInfo
  }
  return { props };
};

export default function OtherUserProfile({ nameInfo, address }: UserProfileProps) {
  // TODO: prerender UserProfile component with above data ^
  return (
    <>
      {/* // TODO: Update */}
      {/*<MetaTags*/}
      {/*  title={`${name} (${address})`}*/}
      {/*  description={`${descPrefix}${description}`}*/}
      {/*/>*/}
      <UserProfile address={address} nameInfo={nameInfo} />
    </>
  );
}

Profile.Layout = MainLayout;
