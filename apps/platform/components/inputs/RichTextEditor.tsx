import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import styled from "styled-components";
import { MDEditorProps } from "@uiw/react-md-editor";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

type Props = MDEditorProps & {
  label?: string;
};

export function RichTextEditor({ label, ...props }: Props) {
  return (
    <Container>
      {label && <h6>{label}</h6>}
      <Editor {...props} />
    </Container>
  );
}

const Container = styled.div``;

const Editor = styled(MDEditor)`
  background-color: #fff;
  border-radius: 10px;
  color: var(--main-dark-color);
  margin-bottom: 20px;
  overflow: hidden;
  .w-md-editor-toolbar {
    padding: 5px 10px;
  }
  .w-md-editor-text {
    padding: 18px;
  }
  * {
    font-size: 16px;
  }
`;
