# GitHub Projects Manual Sync Guide

## Problem

GitHub Issues exist in `eggo-world` repo but NOT appearing in project board.

---

## Current Issues (7 total)

| # | Title |
|---|-------|
| #1 | S1-01: Define NFT contract structure |
| #2 | S1-02: Design referral tree data model |
| #3 | S1-03: Document USDT payment flow |
| #4 | S1-04: Generate login page with v0 |
| #6 | S1-05: Set up GitHub repo |
| #7 | S1-06: Create v0 project |
| #8 | S1-07: Deploy login UI preview |

---

## Solution: Manual Project Setup

### Step 1: Go to GitHub Projects

**URL:** https://github.com/users/Poom5741/projects

### Step 2: Create New Project for EggoWorld

1. Click "New project"
2. **Project name:** `EggoWorld`
3. **Description:** `NFT Membership System with Multi-Level Commission`
4. **Visibility:** Public (recommended) or Private
5. **Link repository:** Search and select `Poom5741/eggo-world`
6. **Template:** None (or "Kanban")
7. **Create project**

### Step 3: Configure Board Columns

After creating, set up columns:

**Column 1: Backlog**
- Filter: Labels → `Backlog`

**Column 2: To Do**
- Filter: Labels → `To Do`

**Column 3: In Progress**
- Filter: Labels → `In Progress`

**Column 4: Review**
- Filter: Labels → `Review`

**Column 5: Done**
- Filter: Labels → `Done`

### Step 4: Issues Should Appear

All 7 issues (#1-#4, #6-#8) will auto-appear as cards in the correct columns based on their labels.

---

## Alternative: Use Issues Directly

If Projects is buggy, you can manage via Issues page:

**URL:** https://github.com/Poom5741/eggo-world/issues

This shows all Sprint 1 stories with their labels:
- Sprint 1 (all issues)
- To Do / In Progress / Done (move by changing labels)
- Points (view in labels)

---

**Create new project manually - Projects API seems to have an issue!**
