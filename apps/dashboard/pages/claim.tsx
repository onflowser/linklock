import { MembershipCheckout } from "@membership/client";
import { useState } from "react";

export default function ClaimMembership() {
  const [communityAddress, setCommunityAddress] = useState<string>();
  const [isOpenModal, setIsOpenModal] = useState(false);
  return (
    <div>
      <h3>Claim membership</h3>
      <input onChange={(e) => setCommunityAddress(e.target.value)} />
      <button onClick={() => setIsOpenModal(true)}>Claim</button>
      {communityAddress && (
        <MembershipCheckout
          isOpenModal={isOpenModal}
          onCloseModal={() => setIsOpenModal(false)}
          communityAddress={communityAddress}
        />
      )}
    </div>
  );
}
