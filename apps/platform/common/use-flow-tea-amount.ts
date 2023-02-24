/**
 * Utility function that converts FlowTea's to FLOW.
 */
import { useFlowPrice } from "./use-flow-price";
import { round } from "./utils";

const FLOW_TEA_IN_USD = 5; // 1 FlowTea = 5$

export function useFlowTeaAmount(flowTeaAmount: number) {
  const { data, mutate } = useFlowPrice();
  const flowUsdPrice = data?.usd ?? 0;
  const flowAmount = round((FLOW_TEA_IN_USD / flowUsdPrice) * flowTeaAmount, 2);
  const usdAmount = round(flowAmount * flowUsdPrice, 2);
  return { flowAmount, usdAmount, flowUsdPrice, refresh: mutate };
}
