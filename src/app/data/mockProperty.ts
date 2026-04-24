import type { FabricIdentity, NavAction, NetworkStatus, OrgType, Property } from "../types/chain";

export const mockIdentity: FabricIdentity = {
  mspId: "",
  walletShort: "",
  abacVerified: false,
  role: "",
};

export const mockNetwork: NetworkStatus = {
  peerId: "",
  connected: false,
  latencyMs: 0,
  blockHeight: 0,
  channel: "",
  chaincodeVersion: "",
};

export const mockNavByOrg: Record<OrgType, NavAction[]> = {
  GovOrg: [],
  BuyerOrg: [],
};

export const mockProperty: Property | null = null;
