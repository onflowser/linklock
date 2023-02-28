import { useRouter } from "next/router";
import { useState } from "react";
import { MembershipCheckout } from "@membership/react";
import { AccountOwnershipProof } from "@membership/react/src/providers/flow.provider";

export default function AuthenticationHandler() {
  const router = useRouter();
  const { adminAddress, membershipDefinitionId, callbackUrl } = router.query;
  const [isOpenModal, setIsOpenModal] = useState(true);

  const closeModal = () => {
    setIsOpenModal(false);
  };

  if (typeof adminAddress !== "string") {
    return "Invalid admin address";
  }

  if (typeof membershipDefinitionId !== "string") {
    return "Invalid membership definition ID";
  }

  if (typeof callbackUrl !== "string") {
    return "Callback URL not provided";
  }

  function onAuthorizationComplete(proof: AccountOwnershipProof) {
    window.location.replace(
      `${callbackUrl}?signature=${JSON.stringify(proof.signature)}&message=${
        proof.message
      }`
    );
  }

  return (
    <MembershipCheckout
      isOpenModal={isOpenModal}
      onRequestClose={closeModal}
      requestAuthorization
      onAuthorizationComplete={onAuthorizationComplete}
      membershipDefinitionId={+membershipDefinitionId}
      adminAddress={adminAddress}
    />
  );
}
