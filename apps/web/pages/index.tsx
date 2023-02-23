import { MembershipCheckout, MembershipProvider } from "ui/src";
import { useState } from "react";

export default function Web() {
  const [communityAddress, setCommunityAddress] = useState<string>();
  const [isOpenModal, setIsOpenModal] = useState(true);
  return (
    <MembershipProvider>
      <h3>Claim membership</h3>
      <input onChange={(e) => setCommunityAddress(e.target.value)} />
      {communityAddress && (
        <MembershipCheckout
          isOpenModal={isOpenModal}
          onCloseModal={() => setIsOpenModal(false)}
          communityAddress={communityAddress}
        />
      )}
    </MembershipProvider>
  );
}
