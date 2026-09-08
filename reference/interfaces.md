# Interfaces

Every signature below is verified against the contract sources. Human-readable ABI fragments suitable for wagmi/viem.

## IEpochStagedERC7540Vault

Source: `src/IEpochStagedERC7540Vault.sol`.

```text
interface IEpochStagedERC7540Vault {
    // Epoch state
    function currentEpochId() external view returns (uint40);
    function frozenEpochId() external view returns (uint40);
    function staging() external view returns (address);

    // Deposits
    function requestDeposit(uint256 assets, address controller, address owner) external returns (uint256 requestId);
    function pendingDepositRequest(uint256 requestId, address controller) external view returns (uint256 pendingAssets);
    function claimableDepositRequest(uint256 requestId, address controller) external view returns (uint256 claimableAssets);

    // Redemptions
    function requestRedeem(uint256 shares, address controller, address owner) external returns (uint256 requestId);
    function pendingRedeemRequest(uint256 requestId, address controller) external view returns (uint256 pendingShares);
    function claimableRedeemRequest(uint256 requestId, address controller) external view returns (uint256 claimableShares);

    // Operators
    function setOperator(address operator, bool approved) external returns (bool);
    function isOperator(address controller, address operator) external view returns (bool status);

    // Settlement (smart account only)
    function closeEpoch() external returns (uint40 closedEpochId, uint40 nextEpochId);
    function settleEpoch(uint40 epochId, uint256 navSnapshot) external;
}
```

## Full human-readable ABI (integrator surface on the proxy)

```ts
export const VAULT_ABI = [
  // ERC-7540 async deposit
  "function requestDeposit(uint256 assets, address controller, address owner) returns (uint256 requestId)",
  "function pendingDepositRequest(uint256 requestId, address controller) view returns (uint256 pendingAssets)",
  "function claimableDepositRequest(uint256 requestId, address controller) view returns (uint256 claimableAssets)",
  "function deposit(uint256 assets, address receiver, address controller) returns (uint256 shares)",
  "function mint(uint256 shares, address receiver, address controller) returns (uint256 assets)",
  // ERC-7540 async redeem
  "function requestRedeem(uint256 shares, address controller, address owner) returns (uint256 requestId)",
  "function pendingRedeemRequest(uint256 requestId, address controller) view returns (uint256 pendingShares)",
  "function claimableRedeemRequest(uint256 requestId, address controller) view returns (uint256 claimableShares)",
  "function redeem(uint256 shares, address receiver, address controller) returns (uint256 assets)",
  "function withdraw(uint256 assets, address receiver, address controller) returns (uint256 shares)",
  // ERC-7540 operator
  "function setOperator(address operator, bool approved) returns (bool success)",
  "function isOperator(address controller, address operator) view returns (bool status)",
  // ERC-4626
  "function asset() view returns (address)",
  "function totalAssets() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function maxDeposit(address controller) view returns (uint256)",
  "function maxMint(address controller) view returns (uint256)",
  "function maxWithdraw(address controller) view returns (uint256)",
  "function maxRedeem(address controller) view returns (uint256)",
  "function previewDeposit(uint256 assets) view returns (uint256)",
  "function previewMint(uint256 shares) view returns (uint256)",
  "function previewWithdraw(uint256 assets) view returns (uint256)",
  "function previewRedeem(uint256 shares) view returns (uint256)",
  "function convertToAssets(uint256 shares) view returns (uint256)",
  "function convertToShares(uint256 assets) view returns (uint256)",
  // ERC-20 (standard signatures omitted for brevity: transfer, approve, allowance, transferFrom, decimals, name, symbol)
  // ERC-7575
  "function share() view returns (address)",
  "function vault(address asset_) view returns (address)",
  // Epoch & vault state
  "function currentEpochId() view returns (uint40)",
  "function frozenEpochId() view returns (uint40)",
  "function staging() view returns (address)",
  "function assetSurplus() view returns (uint256)",
  "function redeemClaimReserves() view returns (uint256)",
  "function smartAccount() view returns (address)",
  "function paused() view returns (bool)",
  // Settlement preview
  "function previewSettlement(uint256 navSnapshot, uint256 totalSupplySnapshot, uint256 totalDepositAssets, uint256 totalRedeemShares) view returns (uint256 depositShares, uint256 redeemAssets)",
  // Admin (owner / pauser only)
  "function closeEpoch() returns (uint40 closedEpochId, uint40 nextEpochId)",
  "function settleEpoch(uint40 epochId, uint256 navSnapshot)",
  "function pause()",
  "function unpause()",
  "function setSmartAccount(address smartAccount_)",
  "function rescue(address token, uint256 amount)",
  "function rescueStagedToken(address token, uint256 amount)",
] as const;
```

## IEpochSettlementPreview

```text
interface IEpochSettlementPreview {
    function previewSettlement(
        uint256 navSnapshot,
        uint256 totalSupplySnapshot,
        uint256 totalDepositAssets,
        uint256 totalRedeemShares
    ) external view returns (uint256 depositShares, uint256 redeemAssets);
}
```

## Deltas from stock ERC-4626

- `preview*` revert (`SA__AsyncOnly`) — pricing is only defined at settlement; use `max*`/`claimable*` instead.
- `max*` return claim capacity (0 when nothing claimable), not deposit/withdraw caps.
- `totalAssets()` reflects settled state (`activeAssets`), not the live token balance.
- Additional async entrypoints: `requestDeposit`, `requestRedeem`, `pending*Request`, `claimable*Request`, operator controls, `closeEpoch`/`settleEpoch`.
