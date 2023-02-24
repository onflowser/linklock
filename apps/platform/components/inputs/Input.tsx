import styled from "styled-components";
import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type Props = {
  label?: string;
  placeholder?: string;
};

export function Input({
  label,
  placeholder,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & Props) {
  return (
    <Container>
      {label && <h6>{label}</h6>}
      <input
        className="white-field"
        name={label}
        type="text"
        placeholder={placeholder}
        {...props}
      />
    </Container>
  );
}

export function TextArea({
  label,
  placeholder,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & Props) {
  return (
    <Container>
      <h6>{label}</h6>
      <textarea
        className="white-field"
        name={label}
        rows={4}
        placeholder={placeholder}
        {...props}
      />
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  .white-field,
  .white-field-bottom,
  .white-field-100 {
    background-color: #fff;
    border: solid 1px #d9d9d9;
    border-radius: 10px 10px 10px 10px;
    font-size: 16px;
    color: var(--main-dark-color);
    margin-bottom: 20px;
    padding: 18px;
  }

  .white-field-100 {
    width: 100%;
  }

  ::placeholder {
    color: var(--placeholder-text-color);
  }

  .white-field h5,
  .white-field-bottom h5 {
    font-weight: 400;
  }

  .white-field-bottom {
    margin-bottom: 50px;
  }
`;
