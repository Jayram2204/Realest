import { useCallback, useEffect, useState } from "react";
import { chainClient } from "../data/chainClient";
import type {
  AbacCapability,
  FabricIdentity,
  NetworkStatus,
  OrgType,
  PortfolioPosition,
  Property,
  PropertySummary,
} from "../types/chain";

type AsyncState<T> = { data: T | null; loading: boolean; error: Error | null };

function useAsync<T>(fn: () => Promise<T>, deps: unknown[]): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: true, error: null });
  useEffect(() => {
    let cancelled = false;
    setState({ data: null, loading: true, error: null });
    fn()
      .then((data) => !cancelled && setState({ data, loading: false, error: null }))
      .catch((error) => !cancelled && setState({ data: null, loading: false, error: error as Error }));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return state;
}

export const useIdentity = () => useAsync<FabricIdentity>(() => chainClient.getClientIdentity(), []);
export const useNetworkStatus = () => useAsync<NetworkStatus>(() => chainClient.getNetworkStatus(), []);
export const useCapabilities = (org: OrgType | undefined) =>
  useAsync<AbacCapability[]>(() => (org ? chainClient.getCapabilities(org) : Promise.resolve([])), [org]);
export const useProperties = () => useAsync<PropertySummary[]>(() => chainClient.listProperties(), []);
export const useProperty = (id: string) => useAsync<Property | null>(() => chainClient.queryProperty(id), [id]);
export const usePortfolio = () => useAsync<PortfolioPosition[]>(() => chainClient.getPortfolio(), []);

export function useTransferShares() {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<{ txHash: string; blockHeight: number } | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const submit = useCallback(async (assetId: string, shares: number) => {
    setPending(true);
    setError(null);
    try {
      const r = await chainClient.transferFractionalOwnership(assetId, shares);
      setResult(r);
      return r;
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setPending(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { submit, pending, result, error, reset };
}
