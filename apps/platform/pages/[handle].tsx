import MainLayout from "../components/layouts/MainLayout";
import Profile from "./profile";
import { useRouter } from "next/router";
import UserProfile from "../components/UserProfile";
import { GetServerSideProps } from "next";
import {
  FlowTeaInfo,
  getAddress,
  getHandle,
  getInfo,
  isUserIdAddress,
} from "../common/fcl-service";
import MetaTags from "../components/MetaTags";
import { config } from "../common/config";

type Donations = {
  to: any[];
  from: any[];
};

type Data = FlowTeaInfo & {
  handle: string;
  address: string;
  donations: Donations;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const userId = context.query.handle as string;
  const isAddress = isUserIdAddress(userId);
  const address = isAddress
    ? userId
    : await getAddress(userId).catch(() => null);
  if (!address) {
    return {
      notFound: true,
    };
  }
  const handle = isAddress
    ? await getHandle(address).catch(() => null)
    : userId;
  if (!handle) {
    return {
      notFound: true,
    };
  }

  const info = await getInfo(address).catch(() => null);
  if (!info) {
    return {
      notFound: true,
    };
  }
  const donations: Donations = await fetch(
    config.apiHost + `/users/${address}/donations`
  )
    .then((res) => res.json())
    .catch(() => []);
  const data: Data = {
    ...info,
    handle,
    address,
    donations,
  };
  return { props: { data } };
};

export default function OtherUserProfile({ data }: { data: Data }) {
  const { donations, name, description, address } = data;
  const router = useRouter();

  // TODO: prerender UserProfile component with above data ^
  const hasAnyDonations = donations.to.length > 0 || donations.from.length > 0;
  const descPrefix = hasAnyDonations
    ? `${name} received ${donations.to.length} and given ${donations.from.length} donations. `
    : "";
  return (
    <>
      <MetaTags
        title={`${name} (${address})`}
        description={`${descPrefix}${description}`}
      />
      <UserProfile userId={router.query.handle as string} />
    </>
  );
}

Profile.Layout = MainLayout;
