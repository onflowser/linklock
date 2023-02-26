import MainLayout from "../../components/layouts/MainLayout";
import UserProfile, { UserProfileProps } from "../../components/UserProfile";
import { GetServerSideProps } from "next";
import { DomainsService } from "@membership/domains";
import MetaTags from "../../components/MetaTags";
import { handleQueryParamKey } from "../../common/utils";

type HandlePageProps = UserProfileProps;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const nameOrAddress = context.query[handleQueryParamKey] as string;
  const nameInfo = await new DomainsService().getNameInfo(nameOrAddress);
  const isAddress = nameOrAddress.startsWith("0x");
  if (!isAddress && !nameInfo) {
    return {
      notFound: true,
    };
  }
  const props: HandlePageProps = {
    address: nameInfo?.address ?? nameOrAddress,
    // Remove undefined variables to avoid Next.js error
    nameInfo: nameInfo ? JSON.parse(JSON.stringify(nameInfo)) : null,
  };
  return { props };
};

export default function UserProfilePage({
  nameInfo,
  address,
}: UserProfileProps) {
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

UserProfilePage.Layout = MainLayout;
