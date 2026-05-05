# RealToken Hardcoded Data Audit
## Converting from Static Mockup to Dynamic Architecture

This document catalogs every hardcoded value, mock function, and simulated behavior in the RealToken application, mapping each to its required Hyperledger Fabric implementation.

---

## 🎯 Executive Summary

**Current State**: Bloomberg Terminal UI with complete mock data layer  
**Target State**: Dynamic blockchain-connected application  
**Integration Point**: `ChainClient` interface in `src/app/data/chainClient.ts`  
**Primary Mock Source**: `devFixture` in `src/app/data/devFixture.ts`

---

## 📊 Core Data Layer (Priority: CRITICAL)

### 1. devFixture.ts - Complete Mock Dataset
**Location**: `src/app/data/devFixture.ts`  
**Lines**: 1-166 (entire file)

**Hardcoded Data**:
- **Properties Array** (lines 9-161): 5 mock properties with complete metadata
  - `PROP-00418-BRK`: Sterling Place, Brooklyn
  - `PROP-00311-QNS`: 59th Ave, Elmhurst
  - `PROP-00550-QNS`: 33rd St, Astoria
  - `PROP-00201-MAN`: W 110th St, Manhattan
  - `PROP-00077-BX`: Grand Concourse, Bronx

- **Portfolio Array** (lines 162-165): 2 mock positions
  - 42 shares of PROP-00418-BRK
  - 18 shares of PROP-00201-MAN

- **Identity Object** (lines 4-7):
  ```typescript
  mspId: "BuyerOrgMSP"
  org: "BuyerOrg"
  wallet: "0x4A7F..."
  role: "verified.buyer"
  capabilities: ["read.listings", "trade.fractional", "withdraw.earnings"]
  ```

- **Network Status** (implied in chainClient):
  ```typescript
  blockHeight: 184203
  channel: "real-estate-channel"
  ```

**Real Implementation Required**:
```typescript
// Replace devFixture with Hyperledger Fabric SDK calls
import { Gateway, Network, Contract } from 'fabric-network';

async function listProperties(): Promise<Property[]> {
  const contract = await getContract('realtoken');
  const result = await contract.evaluateTransaction('QueryAllProperties');
  return JSON.parse(result.toString());
}

async function getPortfolio(address: string): Promise<PortfolioPosition[]> {
  const contract = await getContract('realtoken');
  const result = await contract.evaluateTransaction('GetPortfolio', address);
  return JSON.parse(result.toString());
}

async function getClientIdentity(): Promise<Identity> {
  const gateway = await connectToFabric();
  const identity = gateway.getIdentity();
  return {
    mspId: identity.mspId,
    wallet: identity.credentials.certificate,
    // ... extract from X.509 cert
  };
}
```

---

### 2. chainClient.ts - Mock Implementation
**Location**: `src/app/data/chainClient.ts`  
**Lines**: 35-76

**Hardcoded Behaviors**:
- **180ms Delay Simulation** (line 11):
  ```typescript
  function delay() {
    return new Promise((resolve) => setTimeout(resolve, 180));
  }
  ```

- **All Methods Return devFixture**:
  - `getClientIdentity()` → `devFixture` identity
  - `listProperties()` → `devFixture.properties`
  - `queryProperty(id)` → filtered `devFixture.properties`
  - `getPortfolio()` → `devFixture.portfolio`

- **Mock Transaction Hash Generation** (line 75):
  ```typescript
  return { success: true, txHash: cryptoId(64) };
  ```

**Real Implementation Required**:
```typescript
class FabricChainClient implements ChainClient {
  private gateway: Gateway;
  private contract: Contract;

  async connect(connectionProfile: string, walletPath: string) {
    this.gateway = new Gateway();
    await this.gateway.connect(connectionProfile, {
      wallet: await Wallets.newFileSystemWallet(walletPath),
      identity: 'user1',
      discovery: { enabled: true, asLocalhost: true }
    });
    const network = await this.gateway.getNetwork('real-estate-channel');
    this.contract = network.getContract('realtoken');
  }

  async listProperties(): Promise<Property[]> {
    const result = await this.contract.evaluateTransaction('QueryAllProperties');
    return JSON.parse(result.toString());
  }

  async transferFractionalOwnership(params: TransferParams): Promise<{ success: boolean; txHash: string }> {
    // Submit transaction (write to ledger)
    const result = await this.contract.submitTransaction(
      'TransferShares',
      params.assetId,
      params.seller,
      params.buyer,
      params.shares.toString()
    );
    return {
      success: true,
      txHash: result.toString() // Real transaction ID from Fabric
    };
  }
}
```

---

## 💰 Financial Calculations (Priority: HIGH)

### 3. ClaimableEarnings.tsx - Dividend Calculation
**Location**: `src/app/components/bloomberg/ClaimableEarnings.tsx`

**Hardcoded Data**:
- **Dividend Rate** (line 243):
  ```typescript
  const cumulativeDividendPerShare = 0.0823; // Mock: $0.0823 per share
  ```

- **Debt Adjustment** (line 244):
  ```typescript
  const debtAdjustment = 0; // No prior withdrawals
  ```

- **Mock Transaction Hash** (lines 283-287):
  ```typescript
  function generateMockTxHash(): string {
    return "0x" + Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
  }
  ```

- **Transaction Delay Simulation** (lines 30-36):
  ```typescript
  await sleep(1500);  // User signature simulation
  await sleep(2500);  // Blockchain confirmation simulation
  ```

**Real Implementation Required**:
```typescript
// Smart contract query for cumulative dividend
async function calculateEarnings(portfolio: any[]) {
  const contract = await getContract('realtoken');
  
  // Query cumulative dividend per share from smart contract
  const cumulativeDivResult = await contract.evaluateTransaction(
    'GetCumulativeDividendPerShare'
  );
  const cumulativeDividendPerShare = parseFloat(cumulativeDivResult.toString());
  
  // Query user's debt adjustment (prior withdrawals)
  const userAddress = await getCurrentUserAddress();
  const debtResult = await contract.evaluateTransaction(
    'GetDividendDebt',
    userAddress
  );
  const debtAdjustment = parseFloat(debtResult.toString());
  
  const totalShares = portfolio.reduce((sum, p) => sum + p.shares, 0);
  const totalAccrued = totalShares * cumulativeDividendPerShare - debtAdjustment;
  
  return { totalAccrued, cumulativeDividendPerShare, debtAdjustment, ... };
}

// Real withdrawal transaction
async function handleWithdraw() {
  const contract = await getContract('realtoken');
  
  // Submit withdrawal transaction
  const result = await contract.submitTransaction('WithdrawDividends');
  const receipt = JSON.parse(result.toString());
  
  return {
    txHash: receipt.transactionId,
    amount: receipt.amount,
    timestamp: receipt.timestamp
  };
}
```

---

### 4. YieldCalculator.tsx - APY Projections
**Location**: `src/app/components/bloomberg/YieldCalculator.tsx`

**Hardcoded Data**:
- **Dividend Per Share** (line 28):
  ```typescript
  const annualDividendPerShare = 0.0823 * 12; // $0.0823/month
  ```

- **Mock Yield Calculation Comment** (line 27):
  ```typescript
  // Mock yield metrics (in real app, fetch from smart contract)
  ```

**Real Implementation Required**:
```typescript
async function getYieldMetrics(assetId?: string) {
  const contract = await getContract('realtoken');
  
  // Query historical dividend data from smart contract
  const dividendHistoryResult = await contract.evaluateTransaction(
    'GetDividendHistory',
    assetId || 'ALL',
    '12' // Last 12 months
  );
  const dividendHistory = JSON.parse(dividendHistoryResult.toString());
  
  // Calculate actual APY from historical data
  const annualDividendPerShare = dividendHistory.reduce(
    (sum, month) => sum + month.dividendPerShare, 
    0
  );
  
  // Query current asset value for yield calculation
  const valueResult = await contract.evaluateTransaction(
    'GetAssetValue',
    assetId || portfolio.map(p => p.assetId).join(',')
  );
  const totalValue = parseFloat(valueResult.toString());
  
  const apy = (annualDividendPerShare * totalShares / totalValue) * 100;
  
  return { apy, annualDividendPerShare, totalValue };
}
```

---

### 5. FinancialTerminal.tsx - Portfolio Performance
**Location**: `src/app/components/bloomberg/FinancialTerminal.tsx`

**Hardcoded Data**:
- **Dividend Rate** (line 26):
  ```typescript
  const claimableEarnings = totalShares * 0.0823; // Mock dividend rate
  ```

- **30-Day Historical Data Generation** (lines 28-37):
  ```typescript
  const historicalData = Array.from({ length: 30 }, (_, i) => {
    const baseValue = totalValue * 0.8; // Start at 80% of current
    const growth = (totalValue - baseValue) * (i / 29);
    const noise = Math.sin(i * 0.5) * (totalValue * 0.02);
    return {
      day: i + 1,
      value: baseValue + growth + noise,
    };
  });
  ```

**Real Implementation Required**:
```typescript
async function getPortfolioHistory(days: number = 30) {
  const contract = await getContract('realtoken');
  
  // Query portfolio value snapshots from ledger
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const historyResult = await contract.evaluateTransaction(
    'GetPortfolioHistory',
    await getCurrentUserAddress(),
    startDate.toISOString(),
    new Date().toISOString()
  );
  
  const history = JSON.parse(historyResult.toString());
  
  // Transform to chart format
  return history.map((snapshot, i) => ({
    day: i + 1,
    value: snapshot.totalValue,
    timestamp: snapshot.timestamp
  }));
}
```

---

## 🏢 Property Details (Priority: MEDIUM)

### 6. PropertyDetails3D.tsx - Asset Data
**Location**: `src/app/components/bloomberg/PropertyDetails3D.tsx`

**Hardcoded Data**:
- **Mock Ownership Distribution** (lines 18-22):
  ```typescript
  const ownershipData = [
    { name: "You", value: 150, color: "#6366f1" },
    { name: "Investors", value: 8500, color: "#94a3b8" },
    { name: "Available", value: 1350, color: "#e2e8f0" },
  ];
  ```

- **Mock Price History** (lines 25-28):
  ```typescript
  const priceHistory = Array.from({ length: 90 }, (_, i) => ({
    day: i,
    price: property.totalValuation / 10000 + Math.sin(i * 0.1) * 50 + i * 2,
  }));
  ```

**Real Implementation Required**:
```typescript
async function getOwnershipDistribution(assetId: string) {
  const contract = await getContract('realtoken');
  
  // Query actual ownership breakdown
  const ownershipResult = await contract.evaluateTransaction(
    'GetOwnershipDistribution',
    assetId
  );
  const ownership = JSON.parse(ownershipResult.toString());
  
  return [
    { name: "You", value: ownership.yourShares, color: "#6366f1" },
    { name: "Investors", value: ownership.otherInvestors, color: "#94a3b8" },
    { name: "Available", value: ownership.availableShares, color: "#e2e8f0" }
  ];
}

async function getPriceHistory(assetId: string, days: number = 90) {
  const contract = await getContract('realtoken');
  
  const historyResult = await contract.evaluateTransaction(
    'GetPriceHistory',
    assetId,
    days.toString()
  );
  
  return JSON.parse(historyResult.toString());
}
```

---

### 7. PropertyNavigator.tsx - Yield Display
**Location**: `src/app/components/bloomberg/PropertyNavigator.tsx`

**Hardcoded Data**:
- **Mock Yield Percentage** (line 93):
  ```typescript
  <span className="font-mono text-[10px]">
    {(Math.random() * 10 + 2).toFixed(1)}%
  </span>
  ```

**Real Implementation Required**:
```typescript
// Add yield to Property type from smart contract
interface Property {
  // ... existing fields
  currentYield: number; // Actual APY from smart contract
}

// In PropertyCard component
<span className="font-mono text-[10px]">
  {property.currentYield.toFixed(1)}%
</span>
```

---

## 🔒 Trust & Verification (Priority: MEDIUM)

### 8. ChainOfTrust.tsx - Trust Score System
**Location**: `src/app/components/bloomberg/ChainOfTrust.tsx`

**Hardcoded Data**:
- **Mock Trust Metrics** (lines 43-68):
  ```typescript
  const trustMetrics: TrustMetric[] = [
    { category: "On-Chain History", score: 92, weight: 0.4, status: "excellent" },
    { category: "Identity Verification", score: 95, weight: 0.3, status: "excellent" },
    { category: "Dispute Resolution", score: 78, weight: 0.2, status: "good" },
    { category: "Community Reputation", score: 85, weight: 0.1, status: "excellent" },
  ];
  ```

- **Mock Historical Owners** (lines 75-94):
  ```typescript
  const historicalOwners: HistoricalOwner[] = [
    { address: "0x1a2b...3c4d", name: "Greenfield Properties LLC", period: "2020 - 2022" },
    { address: "0x5e6f...7g8h", name: "Urban Development Corp", period: "2022 - 2024" },
    { address: address, name: "Current Owner", period: "2024 - Present" },
  ];
  ```

**Real Implementation Required**:
```typescript
async function getTrustScore(address: string) {
  const contract = await getContract('realtoken');
  
  // Query on-chain trust metrics
  const metricsResult = await contract.evaluateTransaction(
    'GetTrustMetrics',
    address
  );
  const metrics = JSON.parse(metricsResult.toString());
  
  return {
    onChainHistory: calculateOnChainScore(metrics.transactionCount, metrics.volumeTraded),
    identityVerification: metrics.kycLevel, // From identity contract
    disputeResolution: metrics.disputeScore,
    communityReputation: metrics.averageRating
  };
}

async function getOwnershipHistory(assetId: string) {
  const contract = await getContract('realtoken');
  
  // Query historical ownership from ledger
  const historyResult = await contract.evaluateTransaction(
    'GetOwnershipHistory',
    assetId
  );
  
  return JSON.parse(historyResult.toString());
}
```

---

## 🌐 Network & System Status (Priority: LOW)

### 9. CommandSidebar.tsx - Network Status
**Location**: `src/app/components/bloomberg/CommandSidebar.tsx`

**Hardcoded Data**:
- **Network Status Simulation** (lines 40-45):
  ```typescript
  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkOnline((prev) => (Math.random() > 0.1 ? true : prev));
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  ```

- **Hardcoded Network Version** (line 190):
  ```typescript
  <div className="font-mono text-[9px] text-neutral-500 whitespace-nowrap">
    Fabric v2.5.10
  </div>
  ```

**Real Implementation Required**:
```typescript
// WebSocket connection for real-time network status
async function monitorNetworkStatus() {
  const wsUrl = 'ws://peer0.org1.example.com:7053/chaincode-events';
  const ws = new WebSocket(wsUrl);
  
  ws.on('message', (data) => {
    const event = JSON.parse(data.toString());
    if (event.type === 'BLOCK') {
      setNetworkOnline(true);
      updateBlockHeight(event.blockNumber);
    }
  });
  
  ws.on('error', () => {
    setNetworkOnline(false);
  });
}

// Query network version from peer
async function getNetworkInfo() {
  const gateway = await connectToFabric();
  const network = await gateway.getNetwork('real-estate-channel');
  const channel = network.getChannel();
  
  const channelInfo = await channel.queryInfo();
  
  return {
    blockHeight: channelInfo.height.toNumber(),
    fabricVersion: channelInfo.fabricVersion,
    channelName: channel.getName()
  };
}
```

---

## 📡 Real-Time Updates (Priority: HIGH)

### 10. Missing: Block Event Listeners
**Current State**: No real-time updates  
**Required**: WebSocket event listeners for blockchain events

**Implementation Required**:
```typescript
// Event listener for dividend distributions
async function subscribeToEvents() {
  const contract = await getContract('realtoken');
  
  // Listen for DividendDistributed events
  await contract.addContractListener('DividendDistributed', (event) => {
    const payload = JSON.parse(event.payload.toString());
    
    // Update UI with new dividend data
    updateDividendData({
      assetId: payload.assetId,
      amountPerShare: payload.amountPerShare,
      timestamp: payload.timestamp
    });
  });
  
  // Listen for OwnershipTransferred events
  await contract.addContractListener('OwnershipTransferred', (event) => {
    const payload = JSON.parse(event.payload.toString());
    
    // Refresh portfolio if user involved
    if (payload.buyer === currentUserAddress || payload.seller === currentUserAddress) {
      refreshPortfolio();
    }
    
    // Update property ownership data
    refreshPropertyData(payload.assetId);
  });
  
  // Listen for PropertyListed events
  await contract.addContractListener('PropertyListed', (event) => {
    const payload = JSON.parse(event.payload.toString());
    
    // Add new property to market listings
    addPropertyToMarket(payload);
  });
}
```

---

## 🔄 Transaction Simulation (Priority: MEDIUM)

### 11. TransactionLifecycle.tsx
**Location**: `src/app/components/bloomberg/TransactionLifecycle.tsx`

**Current State**: Mock WebSocket simulation with hardcoded stage progression

**Real Implementation Required**:
```typescript
// Subscribe to escrow contract events
async function monitorEscrowTransaction(escrowId: string) {
  const contract = await getContract('escrow');
  
  const listener = async (event) => {
    const payload = JSON.parse(event.payload.toString());
    
    if (payload.escrowId === escrowId) {
      switch (event.eventName) {
        case 'DepositLocked':
          updateStage('deposit', 'completed');
          break;
        case 'TermsApproved':
          updateStage('terms', 'completed', {
            approved: payload.approvalCount,
            required: payload.requiredApprovals
          });
          break;
        case 'KeysReleased':
          updateStage('keys', 'completed');
          break;
        case 'FundsDistributed':
          updateStage('funds', 'completed');
          break;
      }
    }
  };
  
  await contract.addContractListener('EscrowEvent', listener);
}
```

---

## 📋 Implementation Roadmap

### Phase 1: Core Data Layer (Week 1-2)
- [ ] Set up Hyperledger Fabric SDK integration
- [ ] Replace `devFixture` with real `FabricChainClient`
- [ ] Implement connection management and error handling
- [ ] Add environment config for connection profiles

### Phase 2: Financial Data (Week 3-4)
- [ ] Implement dividend calculation smart contract queries
- [ ] Connect withdrawal functionality to blockchain
- [ ] Add historical price/value data queries
- [ ] Implement yield calculation from on-chain data

### Phase 3: Real-Time Events (Week 5-6)
- [ ] Set up WebSocket event listeners
- [ ] Implement block event subscriptions
- [ ] Add auto-refresh on ownership changes
- [ ] Monitor network status from peer

### Phase 4: Trust & Verification (Week 7-8)
- [ ] Query trust scores from identity contract
- [ ] Fetch ownership history from ledger
- [ ] Implement KYC verification checks
- [ ] Add dispute resolution tracking

### Phase 5: Testing & Optimization (Week 9-10)
- [ ] End-to-end testing with test network
- [ ] Performance optimization for queries
- [ ] Error handling and retry logic
- [ ] Production deployment preparation

---

## 🛠️ Required Smart Contract Functions

The following smart contract functions need to exist on the Hyperledger Fabric chaincode:

### Property Management
- `QueryAllProperties() -> Property[]`
- `GetProperty(assetId: string) -> Property`
- `GetOwnershipDistribution(assetId: string) -> OwnershipData`
- `GetPriceHistory(assetId: string, days: number) -> PricePoint[]`

### Portfolio Management
- `GetPortfolio(address: string) -> PortfolioPosition[]`
- `GetPortfolioHistory(address: string, startDate: string, endDate: string) -> ValueSnapshot[]`
- `TransferShares(assetId: string, seller: string, buyer: string, shares: number) -> TxReceipt`

### Dividend System
- `GetCumulativeDividendPerShare() -> number`
- `GetDividendDebt(address: string) -> number`
- `WithdrawDividends() -> TxReceipt`
- `GetDividendHistory(assetId: string, months: number) -> DividendRecord[]`

### Trust & Identity
- `GetTrustMetrics(address: string) -> TrustData`
- `GetOwnershipHistory(assetId: string) -> OwnershipRecord[]`
- `GetKYCLevel(address: string) -> number`

### Events
- `DividendDistributed`
- `OwnershipTransferred`
- `PropertyListed`
- `EscrowEvent`

---

## 📊 Data Flow Architecture

```
┌─────────────────┐
│   React UI      │
│  (Bloomberg)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  useChain Hooks │
│  (React Query)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  ChainClient    │ ← INTEGRATION POINT
│  Interface      │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌─────────┐ ┌──────────────┐
│devFixture│ │FabricClient  │
│(MOCK)   │ │(PRODUCTION)  │
└─────────┘ └──────┬───────┘
                   │
                   ▼
           ┌───────────────┐
           │ Fabric SDK    │
           │ (Gateway)     │
           └───────┬───────┘
                   │
                   ▼
           ┌───────────────┐
           │ Peer Nodes    │
           │ (Blockchain)  │
           └───────────────┘
```

---

## ✅ Success Criteria

The conversion from static mockup to dynamic architecture is complete when:

1. **Zero Mock Data**: No `devFixture` references in production build
2. **Real-Time Updates**: UI updates automatically when blockchain state changes
3. **Accurate Calculations**: All financial metrics come from smart contract queries
4. **Transaction Verification**: All transactions have verifiable on-chain receipts
5. **Network Monitoring**: Live network status from actual peer connections
6. **Error Handling**: Graceful handling of network failures and retries
7. **Performance**: Query responses under 2 seconds for common operations
8. **Security**: Proper wallet integration and transaction signing

---

## 📝 Configuration Template

Create `.env` file for Fabric connection:

```bash
# Hyperledger Fabric Configuration
FABRIC_NETWORK_PROFILE=/path/to/connection-org1.json
FABRIC_WALLET_PATH=/path/to/wallet
FABRIC_USER_ID=user1
FABRIC_CHANNEL_NAME=real-estate-channel
FABRIC_CHAINCODE_NAME=realtoken

# Network Endpoints
PEER_ENDPOINT=grpc://peer0.org1.example.com:7051
ORDERER_ENDPOINT=grpc://orderer.example.com:7050
CA_ENDPOINT=https://ca.org1.example.com:7054

# WebSocket Event Hub
EVENT_HUB_WS=ws://peer0.org1.example.com:7053
```

---

## 🎓 Resources

- [Hyperledger Fabric Node SDK](https://hyperledger.github.io/fabric-sdk-node/)
- [Fabric Gateway API](https://hyperledger-fabric.readthedocs.io/en/latest/gateway.html)
- [Event Handling Guide](https://hyperledger-fabric.readthedocs.io/en/latest/peer_event_services.html)
- [Smart Contract Best Practices](https://hyperledger-fabric.readthedocs.io/en/latest/developapps/smartcontract.html)

---

**Last Updated**: 2026-05-05  
**Document Version**: 1.0  
**Audit Status**: Complete
