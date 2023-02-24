import { Modal } from "./Modal";
import ReactModal from "react-modal";
import styled from "styled-components";
import { useState } from "react";
import { PrimaryButton } from "../PrimaryButton";
import { TextArea } from "../inputs/Input";
import { toast } from "react-hot-toast";
import { useFcl } from "../../common/user-context";
import { useUserInfo } from "../../common/use-user-info";
import { getDomain } from "../../common/config";

type Props = ReactModal.Props;

const widgetVariants = ["coral", "light-violet", "main-dark", "violet"];

export function WidgetGenerationModal({ isOpen, ...props }: Props) {
  const { user } = useFcl();
  const { handle } = useUserInfo(user?.addr);
  const [selected, setSelected] = useState(-1);
  const [showSelection, setShowSelection] = useState(true);
  const widgets = widgetVariants.map(
    (name) => `/images/widgets/button-${name}.svg`
  );
  const generatedCode = `
    <a href="${getDomain()}/${handle}" target="_blank">
      <img alt="FlowTea" src="${getDomain()}${widgets[selected]}" />
    </a>
  `.trim();

  function onGenerateCode() {
    if (selected === -1) {
      toast.error("Select a widget variant!");
      return;
    }
    setShowSelection(false);
  }

  async function onCopyCode() {
    try {
      await navigator.clipboard.writeText(generatedCode);
      toast.success("Copied!");
    } catch (e) {
      toast.error("Failed to copy!");
    }
  }

  return (
    <Modal
      style={{
        content: {
          padding: 100,
          backgroundColor: "#F7F7F7",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        },
      }}
      isOpen={isOpen}
      {...props}
    >
      {showSelection ? (
        <>
          <h2>Select your website button</h2>
          <SelectContainer>
            {widgets.map((widget, index) => (
              <SelectItem
                key={index}
                selected={index === selected}
                onClick={() => setSelected(index)}
              >
                <WidgetImage src={widget} alt="Widget" />
              </SelectItem>
            ))}
          </SelectContainer>
          <PrimaryButton
            style={{ width: "100%", maxWidth: "unset" }}
            onClick={onGenerateCode}
          >
            Generate your widget
          </PrimaryButton>
        </>
      ) : (
        <>
          <h2>Copy code to your website</h2>
          <TextArea value={generatedCode} />
          <PrimaryButton
            style={{ width: "100%", maxWidth: "unset" }}
            onClick={onCopyCode}
          >
            Copy code
          </PrimaryButton>
        </>
      )}
    </Modal>
  );
}

const SelectContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-column-gap: 15px;
  grid-row-gap: 15px;
  margin: 50px 0;
`;

const SelectItem = styled.button<{ selected: boolean }>`
  border: 1px solid transparent;
  background: white;
  box-shadow: 4px 4px 10px #a3a3a346;
  border-radius: 4px;
  padding: 20px;
  cursor: pointer;
  ${({ selected, theme }) => selected && `border-color: ${theme.colors.pink}`};

  &:hover {
    border-color: ${({ theme }) => theme.colors.pink};
  }
`;

const WidgetImage = styled.img``;
