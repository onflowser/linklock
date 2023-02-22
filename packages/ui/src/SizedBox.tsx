export type SizedBoxProps = {
  width?: number;
  height?: number;
};

export function SizedBox(props: SizedBoxProps) {
  return (
    <div style={{ ...props, maxWidth: props.width, maxHeight: props.height }} />
  );
}
