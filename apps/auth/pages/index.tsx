import { useRouter } from "next/router";
import { useState } from "react";
import { SignatureRequest } from "@membership/react";

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
    <SignatureRequest
      isOpenModal={isOpenModal}
      onCloseModal={closeModal}
      setIsOpenModal={setIsOpenModal}
      callbackUrl={callbackUrl}
      membershipDefinitionId={+membershipDefinitionId}
      adminAddress={adminAddress}
    />
  );
}
