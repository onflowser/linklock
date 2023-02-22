import { MembershipCheckout, MembershipProvider } from "ui/src";

export default function Web() {
  return (
    <MembershipProvider>
      <MembershipCheckout />
    </MembershipProvider>
  );
}
