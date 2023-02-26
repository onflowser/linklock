import { useGetMembershipInstances, useFlow } from "@membership/client";

export default function Index() {
  const { currentUser } = useFlow();
  const { data: memberships } = useGetMembershipInstances(currentUser?.address);
  return (
    <div>
      <h3>My memberships</h3>
      <pre>{JSON.stringify(memberships, null, 4)}</pre>
    </div>
  );
}
