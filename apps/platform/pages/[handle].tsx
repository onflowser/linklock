import MainLayout from "../components/layouts/MainLayout";
import Profile from "./profile";
import UserProfile, { UserProfileProps } from "../components/UserProfile";
import { GetServerSideProps } from "next";
import { DomainsService } from "@membership/domains";
import MetaTags from "../components/MetaTags";

type HandlePageProps = UserProfileProps;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const nameOrAddress = context.query.handle as string;
  const nameInfo = await new DomainsService().getNameInfo(nameOrAddress)
  const isAddress = nameOrAddress.startsWith("0x")
  if (!isAddress && !nameInfo) {
    return {
      notFound: true
    }
  }
  const props: HandlePageProps = {
    address:nameInfo?.address ?? nameOrAddress,
    // Remove undefined variables to avoid Next.js error
    nameInfo: JSON.parse(JSON.stringify(nameInfo))
  }
  return { props };
};

export default function OtherUserProfile({ nameInfo, address }: UserProfileProps) {
  return (
    <>
      <MetaTags
        title={nameInfo?.name ?? address}
        description={nameInfo?.description}
      />
      <UserProfile address={address} nameInfo={nameInfo} />
    </>
  );
}

Profile.Layout = MainLayout;