export type AuthHandlerProps = {
  adminAddress: string;
  membershipDefinitionId: string;
  callbackUrl: string;
};

export function buildAuthHandlerUrl(props: AuthHandlerProps) {
  const { adminAddress, membershipDefinitionId, callbackUrl } = props;
  return (
    `http://localhost:3000/` +
    `?adminAddress=${adminAddress}` +
    `&membershipDefinitionId=${membershipDefinitionId}` +
    `&callbackUrl=${callbackUrl}`
  );
}
