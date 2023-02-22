import { FlowService } from "../services/flow.service";
import useSWR from "swr";

export function useFlowBalance(address: string | undefined) {
  const flowService = FlowService.create();
  return useSWR(
    () => (address ? `flow-balance/${address}` : null),
    () => (address ? flowService.getFlowBalance(address) : undefined)
  );
}
