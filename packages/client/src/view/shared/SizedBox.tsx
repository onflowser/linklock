export type SizedBoxProps = {
  width?: number;
  height?: number;
  backgroundColor?: string;
};

export function SizedBox(props: SizedBoxProps) {
  return (
    <div style={{ ...props, maxWidth: props.width, maxHeight: props.height }} />
  );
}
