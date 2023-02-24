import Link from "next/link";
import { ReactNode } from "react";
import { useFlow } from "ui/src/providers/flow.provider";
import { FlowService } from "ui";

export type LayoutProps = {
  children: ReactNode;
};

const flowService = FlowService.create();

export function Layout(props: LayoutProps) {
  const { currentUser } = useFlow();
  return (
    <div>
      <nav>
        <Link href="/">Memberships</Link>
        <Link href="/claim">Claim</Link>
        <Link href="/admin">Admin</Link>
        {currentUser ? (
          <button onClick={flowService.unAuthenticate}>Logout</button>
        ) : (
          <button onClick={flowService.authenticate}>Login</button>
        )}
        <p>Current user: {currentUser?.address}</p>
      </nav>

      {props.children}
    </div>
  );
}
