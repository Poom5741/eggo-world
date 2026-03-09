# EggoWorld - Technical Specifications

## NFT Contract Specifications

### Egg NFT
- **Standard:** ERC-721
- **Name:** EggoWorld Egg
- **Symbol:** EGGOW
- **Supply:** Unlimited
- **Price:** 25 USDT
- **Minting:** With USDT payment
- **Metadata:** Egg visual assets, rarity

### Properties
```solidity
struct Egg {
    uint256 id;
    address owner;
    uint256 mintedAt;
    uint8 rarity; // 1-5
    string metadataURI;
}
```

### Food NFT
- **Standard:** ERC-721
- **Name:** EggoWorld Food
- **Symbol:** FOOD
- **Supply:** 1 per Egg NFT
- **Claimable:** With Egg NFT ownership
- **Utility:** 30-day membership validator

---

## Referral System

### Data Structure
```solidity
struct User {
    address wallet;
    address referrer; // Direct referrer
    uint256[] children; // Referred users
    uint256 membershipExpiry;
    uint256 totalEarnings;
}

mapping(address => User) public users;
```

### Commission Calculation
```solidity
function distributeCommission(uint256 saleAmount, address buyer) internal {
    address[] memory path = getReferrerPath(buyer); // Max 4 gens
    
    for (uint i = 0; i < path.length; i++) {
        if (i == 0) {
            // Gen1: 20%
            payout(path[i], saleAmount * 20 / 100);
        } else if (i <= 3) {
            // Gen2-4: 10% each
            payout(path[i], saleAmount * 10 / 100);
        }
    }
    
    // Remaining to project
    uint256 distributed = path.length > 0 ? 
        saleAmount * (20 + min(path.length - 1, 3) * 10) / 100 : 0;
    payout(projectWallet, saleAmount - distributed);
}
```

---

## Membership System

### Validation
```solidity
function hasValidMembership(address user) public view returns (bool) {
    return users[user].membershipExpiry > block.timestamp;
}

function extendMembership(address user, uint256 days) internal {
    users[user].membershipExpiry += days * 1 days;
}
```

### Check on Mint
```solidity
function mintEgg() external payable {
    require(msg.value == 25 * 1e6, "Wrong amount"); // 25 USDT (6 decimals)
    
    _mintEgg(msg.sender);
    _mintFood(msg.sender);
    extendMembership(msg.sender, 30);
    distributeCommission(msg.value, msg.sender);
}
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    wallet_address VARCHAR(42) PRIMARY KEY,
    referrer_address VARCHAR(42),
    membership_expiry TIMESTAMP,
    total_earnings DECIMAL(18,6),
    eggs_minted INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Referrals Table
```sql
CREATE TABLE referrals (
    id SERIAL PRIMARY KEY,
    referrer_address VARCHAR(42),
    referred_address VARCHAR(42),
    generation INT, -- 1-4
    commission_earned DECIMAL(18,6),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_address VARCHAR(42),
    type VARCHAR(20), -- 'mint', 'commission', 'extend'
    amount DECIMAL(18,6),
    tx_hash VARCHAR(66),
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## v0 UI Requirements for Login Page

### Page Structure
```
┌────────────────────────────────────┐
│         EggoWorld Logo          │
├────────────────────────────────────┤
│                                    │
│    "Welcome to EggoWorld"        │
│    "Buy Eggs, Earn Rewards"       │
│                                    │
│  ┌────────────────────────────┐   │
│  │  Connect Wallet (MetaMask) │   │
│  └────────────────────────────┘   │
│                                    │
│  └─ Have a referral code?          │
│      [ Enter Referral Code ]        │
│                                    │
│       ┌──────────┐  ┌──────────┐ │
│       │  Join    │  │  Learn   │ │
│       └──────────┘  └──────────┘ │
└────────────────────────────────────┘
```

### Features
- **Wallet Connect:** MetaMask, WalletConnect
- **Referral Input:** Optional referral code field
- **Validation:** Check valid referrer on chain
- **Redirect:** To dashboard after connection
- **Style:** Playful, egg-themed branding

### Assets Needed for v0
- Logo (SVG/PNG)
- Hero image (Egg collection)
- Button icons (Wallet)
- Background pattern

---

*Last updated: 2026-03-09*
