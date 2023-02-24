import ReactModal from "react-modal";
import { theme } from "../../common/theme";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    borderRadius: theme.gutter.md,
    border: "none",
  },
  overlay: {
    backdropFilter: "blur(10px) brightness(0.5)",
    background: "none",
    zIndex: 100,
  },
};

export function Modal(props: ReactModal.Props) {
  return (
    <ReactModal
      {...props}
      closeTimeoutMS={500}
      style={{
        content: { ...customStyles.content, ...props.style?.content },
        overlay: { ...customStyles.overlay, ...props.style?.overlay },
      }}
    />
  );
}
