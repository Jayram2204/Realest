export type OrgType = "GovOrg" | "SellerOrg" | "BuyerOrg";
export type PropertyStatus = "PENDING" | "VERIFIED" | "LISTED" | "SOLD_OUT";
export type TxEventType = "GENESIS" | "MINT" | "APPRAISE" | "VERIFY" | "LIST" | "SALE" | "TRANSFER";

export interface FabricIdentity {
  mspId: string;
  org: OrgType;
  wallet: string;
  abacAttributes: string[];
  role: string;
}

export interface NetworkStatus {
  peerId: string;
  connected: boolean;
  latencyMs: number;
  blockHeight: number;
  channel: string;
  chaincode: string;
}

export interface PropertyImage {
  id: string;
  url: string;
  alt: string;
}

export interface FractionalMath {
  totalValuation: number;
  currency: string;
  pricePerShare: number;
  totalShares: number;
  availableShares: number;
  estApy: number;
  yieldFrequency: string;
  minInvestment: number;
}

export interface TxEvent {
  id: string;
  type: TxEventType;
  timestamp: string;
  actorMsp: string;
  actorRole: string;
  meta: string;
  txHash: string;
  blockHeight: number;
}

export interface PropertySummary {
  assetId: string;
  title: string;
  district: string;
  zip: string;
  status: PropertyStatus;
  mintTxHash: string;
  pricePerShare: number;
  availableShares: number;
  totalShares: number;
  totalValuation: number;
  estApy: number;
  thumbnailUrl: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
}

export interface Property extends PropertySummary {
  description: string;
  mintedAt: string;
  blockHeight: number;
  channel: string;
  metadataCid: string;
  images: PropertyImage[];
  math: FractionalMath;
  history: TxEvent[];
}

export interface PortfolioPosition {
  assetId: string;
  title: string;
  shares: number;
  pricePerShare: number;
  currentValue: number;
  pctOwned: number;
}

export type AbacCapability = "MINT_ASSET" | "VERIFY_ASSET" | "LIST_ASSET" | "PURCHASE_SHARES" | "AUDIT_LEDGER";
