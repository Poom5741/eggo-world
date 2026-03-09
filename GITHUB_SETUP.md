# GitHub Repository Setup

## Option 1: Create Repo in Browser

**Go to:** https://github.com/new

**Settings:**
- Repository name: `eggoworld`
- Description: `EggoWorld - NFT Membership System with Multi-Level Commission. Buy Egg NFTs, get 30-day membership, earn referral rewards.`
- Visibility: ✅ Public
- Initialize: ❌ No (we'll push existing files)

**After creation:**

```bash
# Navigate to project
cd /home/node/clawd/projects/eggoworld

# Initialize git
git init
git add .
git commit -m "Initial commit: Project setup, specs, and Kanban board"

# Add remote
git remote add origin git@github.com:Poom5741/eggoworld.git

# Push
git push -u origin main
```

---

## Option 2: Create with CLI (After Auth)

**First, authenticate in browser:**
```bash
gh auth login --web
```

**Then create repo:**
```bash
cd /home/node/clawd/projects/eggoworld
gh repo create eggoworld --public \
  --description "EggoWorld - NFT Membership System with Multi-Level Commission" \
  --source=. \
  --gitignore=node,env
```

---

## GitHub Projects Integration

**After repo is created, link to project board:**

1. Go to: https://github.com/Poom5741/projects/4
2. Add repository: `Poom5741/eggoworld`
3. Create issues for Sprint 1 stories

---

## Files to Push

```
eggoworld/
├── README.md              # Project overview
├── PROJECT_SUMMARY.md     # Quick status
├── NEXT_STEPS.md         # Questions + workflow
├── board/
│   └── BOARD.md          # Kanban board
├── docs/
│   └── specs.md          # Technical specs
└── design/
    └── v0-login-specs.md # UI specifications
```

---

## Next Steps

1. **Create repository** (Option 1 or 2 above)
2. **Push files** with git commands
3. **Link to GitHub Projects** for Kanban tracking
4. **Enable GitHub Issues** for Sprint 1 stories

---

*Ready to create repo!*
