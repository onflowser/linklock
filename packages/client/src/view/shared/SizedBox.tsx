export type SizedBoxProps = {
  width?: number;
  height?: number;
  backgroundColor?: string;
  inline?: boolean;
};

export function SizedBox(props: SizedBoxProps) {
  return (
    <div
      style={{
        ...props,
        maxWidth: props.width,
        maxHeight: props.height,
        display: props.inline ? "inline-block" : "block",
      }}
    />
  );
}
