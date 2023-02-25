import { ReactNode } from "react";

export type ExternalLinkProps = {
  href: string;
  children?: ReactNode | string;
}

export function ExternalLink(props: ExternalLinkProps) {
  return (
    <a
      target="_blank"
      href={props.href}
      rel="noreferrer"
    >
      {props.children ?? props.href}
    </a>
  )
}
