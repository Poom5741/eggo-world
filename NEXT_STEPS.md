# EggoWorld - Next Steps

## ✅ Project Structure Created

```
projects/eggoworld/
├── README.md       # Project overview & flowchart
├── board/
│   └── BOARD.md    # Kanban board (Sprint 1 ready)
├── docs/
│   └── specs.md    # Technical specs (contracts, DB, v0)
├── design/          # (empty - for v0 exports)
├── contracts/       # (empty - for Solidity files)
└── README.md        # This file
```

---

## 🎯 Sprint 1: Discovery + Login Page

**Dates:** Mar 9 - Mar 16, 2026
**Points:** 26 total

### To Do Stories:

| ID | Story | Points |
|----|-------|--------|
| S1-01 | Define NFT contract structure | 5 |
| S1-02 | Design referral tree data model | 3 |
| S1-03 | Document USDT payment flow | 3 |
| **S1-04** | **Generate login page with v0** | **8** |
| S1-05 | Set up GitHub repo | 2 |
| S1-06 | Create v0 project | 2 |
| S1-07 | Deploy login UI preview | 3 |

---

## 🚨 Questions Before Starting

1. **Blockchain choice:** Which chain for USDT?
   - Polygon (low fees, USDT widely used)
   - Arbitrum (growing ecosystem)
   - BSC (cheap, popular for NFTs)
   
2. **Egg NFT assets:** Do you have Egg visuals for v0?
   - Need logo, hero image, backgrounds
   - Or should we use placeholder/mock?

2. **v0 access:** Do you have v0.ai account?
   - Need API key or browser access
   - AI generates UI from prompts

3. **Repo setup:** Should I create GitHub repo manually?
   - `gh` CLI not installed
   - Can do it via browser or I can install `gh`

---

## 💡 Suggested Workflow

### Option A: v0 First (UI-First Approach)
1. Generate login page with v0
2. Export React/Next.js code
3. Integrate wallet connection
4. Build backend to match UI

### Option B: Contract First (Blockchain-First)
1. Write Solidity contracts
2. Test referral logic locally
3. Build UI to match contract functions
4. Connect frontend to contract

**Recommendation:** Option A (v0 first) since that's your priority!

---

## 📝 Quick Start Commands

```bash
# Navigate to project
cd /home/node/clawd/projects/eggoworld

# View board
cat board/BOARD.md

# View specs
cat docs/specs.md

# Create GitHub repo (manual)
# 1. Go to github.com/new
# 2. Repo name: eggoworld
# 3. Clone: git clone git@github.com:Poom5741/eggoworld.git
# 4. Copy files over
```

---

## 🎨 v0 Prompt for Login Page

```
Create a playful NFT membership login page for "EggoWorld".

Features:
- Wallet connect button (MetaMask, WalletConnect)
- Referral code input field (optional)
- Hero section with egg collection imagery
- "Welcome to EggoWorld" headline
- "Buy Eggs, Earn Rewards" subheadline
- CTA buttons: "Join", "Learn More"

Style:
- Playful, egg-themed branding
- Soft pastels (yellow, orange, blue)
- Rounded UI elements
- Mobile-responsive
```

---

*Ready to start when you answer the questions above!*
