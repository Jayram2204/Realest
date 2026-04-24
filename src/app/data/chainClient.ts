import type {
  AbacCapability,
  FabricIdentity,
  NetworkStatus,
  OrgType,
  PortfolioPosition,
  Property,
  PropertySummary,
  TxEvent,
} from "../types/chain";
import { devFixture } from "./devFixture";

export interface ChainClient {
  getClientIdentity(): Promise<FabricIdentity>;
  getNetworkStatus(): Promise<NetworkStatus>;
  getCapabilities(org: OrgType): Promise<AbacCapability[]>;
  listProperties(): Promise<PropertySummary[]>;
  queryProperty(assetId: string): Promise<Property | null>;
  getPropertyHistory(assetId: string): Promise<TxEvent[]>;
  getPortfolio(): Promise<PortfolioPosition[]>;
  transferFractionalOwnership(
    assetId: string,
    shares: number,
  ): Promise<{ txHash: string; blockHeight: number }>;
}

const delay = <T,>(v: T, ms = 180) => new Promise<T>((r) => setTimeout(() => r(v), ms));

export const chainClient: ChainClient = {
  getClientIdentity: () => delay(devFixture.identity),
  getNetworkStatus: () => delay(devFixture.network),
  getCapabilities: (org) => delay(devFixture.capabilities[org]),
  listProperties: () => delay(devFixture.properties.map(toSummary)),
  queryProperty: (assetId) =>
    delay(devFixture.properties.find((p) => p.assetId === assetId) ?? null),
  getPropertyHistory: (assetId) =>
    delay(devFixture.properties.find((p) => p.assetId === assetId)?.history ?? []),
  getPortfolio: () => delay(devFixture.portfolio),
  transferFractionalOwnership: (_assetId, _shares) =>
    delay({ txHash: "0x" + cryptoId(64), blockHeight: devFixture.network.blockHeight + 1 }, 900),
};

function toSummary(p: Property): PropertySummary {
  return {
    assetId: p.assetId,
    title: p.title,
    district: p.district,
    zip: p.zip,
    status: p.status,
    mintTxHash: p.mintTxHash,
    pricePerShare: p.pricePerShare,
    availableShares: p.availableShares,
    totalShares: p.totalShares,
    totalValuation: p.totalValuation,
    estApy: p.estApy,
    thumbnailUrl: p.thumbnailUrl,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    sqft: p.sqft,
  };
}

function cryptoId(n: number) {
  const chars = "0123456789abcdef";
  let s = "";
  for (let i = 0; i < n; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}
