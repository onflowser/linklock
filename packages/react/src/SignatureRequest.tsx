import { CenterModal } from "./view/shared/Modal";
import { useFlow } from "./providers/flow.provider";
import "./styles/reset.scss";

export type SignatureRequestProps = {
  adminAddress: string;
  membershipDefinitionId: number;
  callbackUrl: string;
  isOpenModal: boolean;
  onCloseModal: () => void;
  setIsOpenModal: (state: boolean) => void;
};

export function SignatureRequest({
  adminAddress,
  membershipDefinitionId,
  callbackUrl,
  isOpenModal,
  setIsOpenModal,
  onCloseModal,
}: SignatureRequestProps) {
  const { currentUser, login, getAccountOwnershipProof } = useFlow();

  function onRequestClose() {
    onCloseModal();
  }

  async function onAuthenticate() {
    await login();
    const proof = await getAccountOwnershipProof();
    // TODO: Use url building library
    window.location.replace(
      `${callbackUrl}?signature=${JSON.stringify(proof.signature)}&message=${
        proof.message
      }`
    );
  }

  // TODO: Show membership status, etc...
  return (
    <CenterModal isOpen={isOpenModal} onRequestClose={onRequestClose}>
      <button onClick={onAuthenticate}>Authenticate</button>
    </CenterModal>
  );
}
