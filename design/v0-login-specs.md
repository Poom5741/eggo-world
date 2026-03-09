# v0 UI Requirements for Login Page

## Assets Available ✅

### Logo
- **Image:** EggoWorld logo (cracked egg with robot, cat, purple creature, coins inside)
- **Colors:** Blue top, yellow bottom
- **Background:** Dark blue-to-orange gradient
- **Style:** Playful, character-filled

### Visual Assets for v0
```
1. Logo: Cracked egg with characters (you provided)
2. Hero image: Same logo (enlarged for hero section)
3. Background: Dark blue → Orange gradient
4. Character badges: Robot, cat, purple creature, coins (extracted?)
```

---

## Page Structure

```
┌────────────────────────────────────────────┐
│        [Logo: Cracked Egg]            │
│        "EggoWorld"                   │
├────────────────────────────────────────────┤
│                                          │
│    "Welcome to EggoWorld!"            │
│    "Buy Eggs. Earn Rewards.          │
│     Build Your Collection."            │
│                                          │
│  ┌────────────────────────────────┐     │
│  │                              │     │
│  │   🤖 MetaMask Wallet         │     │
│  │   [ Connect Wallet ]          │     │
│  │                              │     │
│  │   or                           │     │
│  │   🔗 WalletConnect            │     │
│  │                              │     │
│  └────────────────────────────────┘     │
│                                          │
│  🎁 Have a referral code?              │
│  ┌────────────────────────────────┐     │
│  │ [ Enter Referral Code...    ]  │     │
│  └────────────────────────────────┘     │
│                                          │
│  ┌────────────┐  ┌────────────┐      │
│  │  🚀 Join   │  │  📚 Learn  │      │
│  └────────────┘  └────────────┘      │
│                                          │
│  👥 2,456 members have joined!         │
└────────────────────────────────────────────┘
```

---

## Color Palette

Based on your logo:

```css
:root {
    /* From logo gradient */
    --bg-dark-blue: #0f172a;
    --bg-orange: #f97316;
    
    /* Egg colors */
    --egg-blue: #3b82f6;
    --egg-yellow: #fbbf24;
    
    /* Accent colors */
    --accent-purple: #a855f7;
    --accent-green: #22c55e;
    
    /* UI */
    --text-primary: #f1f5f9;
    --text-secondary: #94a3b8;
    --button-primary: #3b82f6;
    --button-hover: #2563eb;
    --input-bg: #1e293b;
    --input-border: #334155;
}
```

---

## v0 Prompt (Updated with Logo)

```
Create a playful NFT membership login page for "EggoWorld".

## Brand Assets
- Logo: Cracked egg with characters (robot, cat, purple creature, coins)
- Colors: Blue top, yellow bottom on egg
- Background: Dark blue to orange gradient
- Style: Playful, kid-friendly, character-driven

## Features Required
1. Hero section with logo (cracked egg with characters)
2. Headline: "Welcome to EggoWorld!"
3. Subheadline: "Buy Eggs. Earn Rewards. Build Your Collection."
4. Wallet connect section:
   - MetaMask button (🤖)
   - WalletConnect option (🔗)
5. Referral code input (optional):
   - Label: "Have a referral code?"
   - Input field: Enter Referral Code
6. CTA buttons:
   - "Join" (🚀) - Primary action
   - "Learn More" (📚) - Secondary
7. Social proof: "👥 2,456 members have joined!"

## Design Style
- Playful, egg-themed branding
- Use logo colors (blue, yellow, orange, purple)
- Rounded UI elements (buttons, inputs)
- Mobile-responsive
- Dark theme (match logo background gradient)
- Soft shadows and hover effects

## Tech Stack
- React/Next.js
- Tailwind CSS
- Ethers.js or wagmi for wallet connect

Export clean, production-ready React code.
```

---

## Implementation Notes

### Extract Logo Characters
If possible, separate the characters from logo for reuse:
- Robot ( mascot )
- Cat ( pet mascot )
- Purple creature ( rare character )
- Coins ( reward indicator )

### Responsive Design
- **Desktop:** Logo centered, wallet buttons side-by-side
- **Mobile:** Stack vertically, larger touch targets
- **Breakpoint:** 768px

### Wallet Connect States
```
┌─ Disconnected ─┐   ┌─ Connecting ─┐   ┌─ Connected ─┐
│ Connect Wallet  │ → │ Connecting... │ → │ 0x1234...   │
└───────────────┘   └──────────────┘   └──────────────┘
```

### Referral Code Validation
- Check length (6-12 chars)
- Verify referrer exists on chain
- Show error if invalid
- Auto-store referrer after connection

---

## Next Steps

1. **Generate with v0:** Use the updated prompt above
2. **Export code:** Get React/Next.js files
3. **Add to project:** Copy to `/projects/eggoworld/design/`
4. **Set up wallet:**
   - Install wagmi or ethers.js
   - Configure MetaMask
   - Add WalletConnect
5. **Test local:**
   - `npm install && npm run dev`
   - Test wallet connect flow
6. **Deploy preview:** Vercel or Netlify

---

*Assets updated: 2026-03-09*
*Status: Ready for v0 generation*
