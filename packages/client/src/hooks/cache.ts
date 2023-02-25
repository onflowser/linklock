import { FlowService } from "../services/flow.service";
import useSWR from "swr";

export function useFlowBalance(address: string | undefined) {
  const flowService = FlowService.create();
  return useSWR(
    () => (address ? `flow-balance/${address}` : null),
    () => (address ? flowService.getFlowBalance(address) : undefined)
  );
}

export function useGetMembershipDefinitionsByAdmin(
  adminAddress: string | undefined
) {
  const flowService = FlowService.create();
  return useSWR(
    () => (adminAddress ? `membership-definitions/${adminAddress}` : null),
    () =>
      adminAddress
        ? flowService.getMembershipDefinitionsByAdmin(adminAddress)
        : undefined
  );
}

export function useGetMemberships(address: string | undefined) {
  const flowService = FlowService.create();
  return useSWR(
    () => (address ? `membership/${address}` : null),
    () => (address ? flowService.getMembershipsByAccount(address) : undefined)
  );
}
