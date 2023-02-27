import React from "react";
import styled from "@emotion/styled";

export const UnstyledButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  transition: 0.2s ease-in-out all;
  &:hover {
    transform: scale(1.05);
  }
`;
