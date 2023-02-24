import { theme } from "../common/theme";

type Size = number | string | "xs" | "sm" | "md" | "lg" | "xl";

type Props = {
  width?: Size;
  height?: Size;
};

function getSize(value?: Size) {
  switch (value) {
    case "xs":
      return theme.gutter.xs;
    case "sm":
      return theme.gutter.sm;
    case "md":
      return theme.gutter.md;
    case "lg":
      return theme.gutter.lg;
    case "xl":
      return theme.gutter.xl;
    default:
      return value;
  }
}

export function Spacing({ width, height = theme.gutter.md }: Props) {
  return <div style={{ width: getSize(width), height: getSize(height) }} />;
}
