import "@uiw/react-markdown-preview/markdown.css";
import { MarkdownPreviewProps } from "@uiw/react-markdown-preview";
import styled from "styled-components";
import dynamic from "next/dynamic";

const Markdown = dynamic(() => import("@uiw/react-markdown-preview"), {
  ssr: false,
});

type Props = MarkdownPreviewProps;

export function MarkdownPreview({ ...props }: Props) {
  return (
    <Container>
      <Markdown {...props} />
    </Container>
  );
}

const Container = styled.div`
  * {
    background-color: transparent !important;
    font-family: "Poppins", sans-serif;
  }
`;
