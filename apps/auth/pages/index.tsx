import { MembershipCheckout } from "@membership/react";
import { useRouter } from "next/router";
import { useState } from "react";

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

  return (
    <MembershipCheckout
      isOpenModal={isOpenModal}
      onCloseModal={closeModal}
      setIsOpenModal={setIsOpenModal}
      membershipDefinitionId={+membershipDefinitionId}
      adminAddress={adminAddress}
    />
  );
}
