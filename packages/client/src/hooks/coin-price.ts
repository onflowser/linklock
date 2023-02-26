import useSWR from "swr";

type CoinPrice = {
  usd: number;
  usd_24h_change: number;
};

type CoinPriceLookup = {
  [key: string]: CoinPrice;
};

/**
 * Uses CoinGecko API to fetch the current price of FLOW.
 * Refer to: https://www.coingecko.com/en/api/documentation
 */
export function useFlowPrice() {
  const fetcher = () =>
    // @ts-ignore
    fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=flow&vs_currencies=usd&include_24hr_change=true"
    )
      .then((res: any) => res.json())
      .then((price: CoinPriceLookup) => price.flow);
  // Disable polling to save on API rate limits.
  return useSWR<CoinPrice>("flow-price", fetcher, { refreshInterval: 0 });
}

export function useFlowToUsd(flowAmount: number) {
  const { data: flowPrice } = useFlowPrice();
  return flowPrice ? +flowPrice.usd * flowAmount : undefined;
}

export function formatFlowCoins(num: string) {
  const rounded = Math.round(Number(num) * 100) / 100;
  return parseFloat(rounded.toString()).toFixed(2);
}
