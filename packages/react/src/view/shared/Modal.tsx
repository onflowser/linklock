import { IoMdClose } from "react-icons/io";
import ReactModal from "react-modal";
import { UnstyledButton } from "./UnstyledButton";
import { colors } from "../../theme";
import styled from "@emotion/styled";

export type CenterModalProps = ReactModal.Props & {
  title?: string;
  shouldShowCloseIcon?: boolean;
  zIndex?: number;
  maxWidth?: number | string;
  maxHeight?: number | string;
  setIsOpenModal?: () => void;
};


export function CenterModal({
  title,
  children,
  shouldShowCloseIcon = true,
  zIndex = 10,
  maxWidth = "525px",
  maxHeight = "100%",
  setIsOpenModal,
  ...reactModalProps
}: CenterModalProps) {

  const isMobile = window.matchMedia("(max-width: 480px)").matches;

  return (
    <ReactModal
      {...reactModalProps}
      style={{
        overlay: {
          backgroundColor: "rgba(0,0,0,.5)",
          margin: -40,
          zIndex,
          ...reactModalProps.style?.overlay,
        },
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          maxWidth: isMobile ? '80%' : maxWidth,
          minWidth: isMobile ? '80%' : maxWidth,
          maxHeight: isMobile ? '80%' :maxHeight,
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: colors.white,
          border: "none",
          padding: 0,
          paddingTop: "40px",
          overflow: "scroll",
          borderRadius: 10,
          color: "black",
          zIndex: 100,
        },
      }}
    >
      <div>
        <CloseButton onClick={reactModalProps.onRequestClose}>
          <IoMdClose size={20} />
        </CloseButton>
        {children}
      </div>
    </ReactModal>
  );
}

const CloseButton = styled(UnstyledButton)`
  position: absolute;
  top: 40px;
  right: 20px;
`;
