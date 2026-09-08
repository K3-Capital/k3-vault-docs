# Subgraph

K3 publishes a subgraph indexing the vault's request, epoch, and price events on Ethereum mainnet.

```text
Endpoint (public, unauthenticated):
https://api.goldsky.com/api/public/project_cmr0amyn6hg6t01yg8uf1cgrv/subgraphs/erc7540-mainnet/1.0.0/gn
```

> **Caveats** — This is an integration endpoint, not a contractual SLA: availability, latency, and the schema may change between versions (note the versioned `1.0.0` path — pin it). It is documented here from the **live schema** as observed on 2026-09-08; no schema source repository is currently linked. It does not index every vault event (e.g. `OperatorSet` is absent — read event logs for that).

## Querying

Standard GraphQL over POST:

```ts
const SUBGRAPH_URL =
  "https://api.goldsky.com/api/public/project_cmr0amyn6hg6t01yg8uf1cgrv/subgraphs/erc7540-mainnet/1.0.0/gn";

async function gql<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch(SUBGRAPH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}
```

Pagination uses `first`/`skip` (max page size 1000), `orderBy`/`orderDirection`, `where` filters, and `block` for historical queries. **Note**: single-entity queries (`epochPrice(id:)`, `epochDeposits(id:)`) take an `id` argument; the **list** queries for `EpochDeposits`, `EpochRedeems`, and `UserSuppliedAssets` are exposed under the `*_collection` suffix (`epochDeposits_collection`, `epochRedeems_collection`, `userSuppliedAssets_collection`) — plain `epochDeposits(...)` does not exist.

## Entities

| Entity | Key fields | Notes |
|---|---|---|
| `DepositRequest` | `controller, owner, requestId, sender, assets, blockNumber, blockTimestamp, transactionHash` | One per `requestDeposit` event |
| `RedeemRequest` | `controller, owner, requestId, sender, shares, blockTimestamp, …` | One per `requestRedeem` event |
| `EpochDeposits` | `id, requestId, controller, totalAssets, requestCount, blockNumber, blockTimestamp` | Per-controller aggregate per epoch |
| `EpochRedeems` | `id, requestId, controller, totalShares, requestCount, …` | Per-controller aggregate per epoch |
| `UserSuppliedAssets` | `id, controller, suppliedAssets, blockTimestamp` | Running per-controller supply (can be negative after redemptions) |
| `EpochClosed` | `epochId, nextEpochId, totalDepositAssets, totalRedeemShares, blockTimestamp, …` | One per closed epoch |
| `EpochPrice` | `epochId, navSnapshot, totalSupplySnapshot, sharePrice, blockTimestamp, transactionHash` | One per settled epoch — the price history |

Amounts are in base units: 8 decimals for both cbBTC and `k3cbBTC`. `sharePrice` is a high-precision decimal string (BigDecimal).

## Example queries (all verified against the live endpoint)

**Latest epoch prices:**

```graphql
{
  epochPrices(first: 3, orderBy: epochId, orderDirection: desc) {
    epochId navSnapshot totalSupplySnapshot sharePrice blockTimestamp transactionHash
  }
}
```

**A user's deposit requests (by controller):**

```graphql
{
  depositRequests(
    first: 20, orderBy: blockTimestamp, orderDirection: desc,
    where: { controller: "0x4352cc849b33a936ad93bb109afdec1c89653b4f" }
  ) {
    requestId assets blockNumber blockTimestamp transactionHash
  }
}
```

**Per-controller epoch aggregates:**

```graphql
{
  epochDeposits_collection(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
    id requestId controller totalAssets requestCount blockTimestamp
  }
}
```

**Running user supply:**

```graphql
{
  userSuppliedAssets_collection(first: 10) { id controller suppliedAssets blockTimestamp }
}
```

**Indexing head:**

```graphql
{ _meta { block { number } deployment hasIndexingErrors } }
```

## Share price history

`EpochPrice` gives one price point per settled epoch. A share-price chart is a simple series of `(blockTimestamp, sharePrice)`:

```ts
const { epochPrices } = await gql<{ epochPrices: EpochPrice[] }>(`
  query PriceHistory($first: Int!, $skip: Int!) {
    epochPrices(first: $first, skip: $skip,
                orderBy: epochId, orderDirection: asc) {
      epochId sharePrice blockTimestamp
    }
  }`, { first: 1000, skip: 0 });

// points: epochPrices.map(p => ({ t: p.blockTimestamp * 1000, price: Number(p.sharePrice) }))
```

The subgraph stops at share-price history. Deriving APR, yield, or TVL figures from it is deliberately out of scope for these docs — the NAV snapshot embeds the smart account's off-chain valuation, and any annualized figure would depend on epoch cadence assumptions we do not document.
