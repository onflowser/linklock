import useSWR from "swr";

type CoinPrice = {
  [key: string]: {
    usd: number;
    usd_24h_change: number;
  };
};

/**
 * Uses CoinGecko API to fetch the current price of FLOW.
 * Refer to: https://www.coingecko.com/en/api/documentation
 */
export function useFlowPrice() {
  const fetcher = () =>
    fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=flow&vs_currencies=usd&include_24hr_change=true"
    )
      .then((res) => res.json())
      .then((price: CoinPrice) => price.flow);
  // Disable polling to save on API rate limits.
  return useSWR("flow-price", fetcher, { refreshInterval: 0 });
}
