import { FlowService } from "../services/flow.service";
import useSWR from "swr";

export function useFlowBalance(address: string | undefined) {
  const flowService = FlowService.create();
  return useSWR(
    () => (address ? `flow-balance/${address}` : null),
    () => (address ? flowService.getFlowBalance(address) : undefined)
  );
}

export function useGetMembershipDefinition(address: string | undefined) {
  const flowService = FlowService.create();
  return useSWR(
    () => (address ? `membership-definition/${address}` : null),
    () => (address ? flowService.getMembershipDefinition(address) : undefined)
  );
}

export function useGetMembership(address: string | undefined) {
  const flowService = FlowService.create();
  return useSWR(
      () => (address ? `membership/${address}` : null),
      () => (address ? flowService.getMembership(address) : undefined)
  );
}
