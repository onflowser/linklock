import { IoMdClose } from "react-icons/io";
import ReactModal from "react-modal";
import { SizedBox } from "./SizedBox";
import { UnstyledButton } from "./UnstyledButton";
import { colors } from "../theme";

export type CenterModalProps = ReactModal.Props & {
  title?: string;
  contentPadding?: number;
  shouldShowCloseIcon?: boolean;
  zIndex?: number;
  maxWidth?: number | string;
  maxHeight?: number | string;
};

export function CenterModal({
  title,
  children,
  contentPadding = 15,
  shouldShowCloseIcon = true,
  zIndex = 10,
  maxWidth = "100%",
  maxHeight = "100%",
  ...reactModalProps
}: CenterModalProps) {
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
          maxWidth: "90vw",
          maxHeight: "90vh",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: colors.white,
          border: "none",
          overflow: "scroll",
          borderRadius: 10,
          color: "white",
          ...reactModalProps.style?.content,
          zIndex: 100,
        },
      }}
    >
      <div style={{ padding: contentPadding }}>
        <div className="flex items-start justify-between">
          <UnstyledButton onClick={reactModalProps.onRequestClose}>
            <IoMdClose size={20} />
          </UnstyledButton>
        </div>
        <SizedBox height={20} />
        {children}
      </div>
    </ReactModal>
  );
}
