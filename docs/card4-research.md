# 🎯 Card #4: Generate Login Page with v0

## Deep Research & Implementation Guide

**Priority:** HIGH | **Points:** 8 | **Status:** In Progress

---

## 📋 Story Details

**Title:** Generate login page with v0  
**Description:** Create world-class NFT membership login page for EggoWorld using v0.ai  
**Acceptance Criteria:**
- [ ] Wallet connect (MetaMask, WalletConnect)
- [ ] Referral code input field
- [ ] EggoWorld branding (logo, colors, characters)
- [ ] Mobile responsive
- [ ] Production-ready React/Next.js code
- [ ] Deployed preview URL

---

## 🎨 Brand Assets

### Logo (Provided)
- **Image:** Cracked egg with characters inside
- **Characters:** Robot 🤖, Cat 🐱, Purple Creature 👾, Coins 🪙
- **Colors:** Blue top (#3B82F6), Yellow bottom (#FBBF24)
- **Background:** Dark blue → Orange gradient

### Color Palette
```css
:root {
  /* Primary */
  --egg-blue: #3B82F6;
  --egg-yellow: #FBBF24;
  
  /* Gradient */
  --bg-dark: #0F172A;
  --bg-orange: #F97316;
  
  /* Accents */
  --creature-purple: #A855F7;
  --coin-green: #22C55E;
  
  /* UI */
  --text-primary: #F1F5F9;
  --text-secondary: #94A3B8;
  --button-primary: #3B82F6;
  --button-hover: #2563EB;
  --input-bg: #1E293B;
  --input-border: #334155;
}
```

---

## 🔍 Competitive Research

### Top NFT Project Login Pages

| Project | Key Features | Why It Works |
|---------|--------------|--------------|
| **Bored Ape YC** | Simple wallet connect, clean UI | Minimal friction |
| **Azuki** | Anime aesthetic, strong branding | Memorable visual identity |
| **Pudgy Penguins** | Playful, character-driven | Matches brand personality |
| **Doodles** | Colorful, fun animations | Engaging experience |

### Key Takeaways for EggoWorld:
1. **Character-driven design** (like Pudgy Penguins)
2. **Playful but professional** balance
3. **One-click wallet connect** (reduce friction)
4. **Clear value proposition** above the fold
5. **Social proof** (member count, testimonials)

---

## 🧩 Recommended Components

### 1. Wallet Connection

**Library:** `wagmi` + `viem` (modern, lightweight)

```bash
npm install wagmi viem @tanstack/react-query
```

**Component:**
```tsx
// components/WalletConnect.tsx
import { useConnect, useDisconnect, useAccount } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect()

  if (isConnected) {
    return (
      <div className="wallet-connected">
        <span>🟢 {address?.slice(0, 6)}...{address?.slice(-4)}</span>
        <button onClick={disconnect}>Disconnect</button>
      </div>
    )
  }

  return (
    <button onClick={() => connect()}>
      🦊 Connect MetaMask
    </button>
  )
}
```

**Alternative:** `Rainbow Kit` (pre-built UI)
```bash
npm install @rainbow-me/rainbowkit
```

---

### 2. Referral Code Input

**Component:**
```tsx
// components/ReferralInput.tsx
import { useState } from 'react'

export function ReferralInput({ onSubmit }: { onSubmit: (code: string) => void }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const validateCode = async (code: string) => {
    setLoading(true)
    // Call API to verify referrer exists
    const response = await fetch(`/api/verify-referral?code=${code}`)
    const data = await response.json()
    
    if (!data.valid) {
      setError('Invalid referral code')
      setLoading(false)
      return false
    }
    
    setLoading(false)
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const isValid = await validateCode(code)
    if (isValid) {
      onSubmit(code)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="referral-form">
      <label>
        🎁 Have a referral code?
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="ENTER CODE"
          maxLength={12}
          className={error ? 'error' : ''}
        />
      </label>
      {error && <span className="error-message">{error}</span>}
      <button type="submit" disabled={loading}>
        {loading ? 'Verifying...' : 'Apply Code'}
      </button>
    </form>
  )
}
```

---

### 3. Hero Section with Logo

**Component:**
```tsx
// components/Hero.tsx
import Image from 'next/image'

export function Hero() {
  return (
    <div className="hero">
      <div className="logo-container">
        <Image
          src="/logo-eggoworld.svg"
          alt="EggoWorld Logo"
          width={200}
          height={200}
          priority
        />
      </div>
      <h1>Welcome to EggoWorld!</h1>
      <p className="tagline">
        Buy Eggs. Earn Rewards. Build Your Collection.
      </p>
      <div className="social-proof">
        <span>👥 2,456 members have joined!</span>
      </div>
    </div>
  )
}
```

---

### 4. Character Showcase

**Component:**
```tsx
// components/CharacterShowcase.tsx
const characters = [
  { name: 'Robot', emoji: '🤖', rarity: 'Common' },
  { name: 'Cat', emoji: '🐱', rarity: 'Uncommon' },
  { name: 'Purple Creature', emoji: '👾', rarity: 'Rare' },
  { name: 'Coins', emoji: '🪙', rarity: 'Legendary' },
]

export function CharacterShowcase() {
  return (
    <div className="character-showcase">
      <h3>Collect Them All!</h3>
      <div className="characters-grid">
        {characters.map((char) => (
          <div key={char.name} className={`character-card ${char.rarity.toLowerCase()}`}>
            <span className="emoji">{char.emoji}</span>
            <span className="name">{char.name}</span>
            <span className="rarity">{char.rarity}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## 🏗️ Full Page Structure

```tsx
// app/page.tsx
import { Hero } from '@/components/Hero'
import { WalletConnect } from '@/components/WalletConnect'
import { ReferralInput } from '@/components/ReferralInput'
import { CharacterShowcase } from '@/components/CharacterShowcase'

export default function HomePage() {
  const handleReferralSubmit = (code: string) => {
    // Store referral code in localStorage or session
    localStorage.setItem('referralCode', code)
    // Redirect to dashboard or minting page
    window.location.href = '/dashboard'
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-orange-600">
      <div className="container mx-auto px-4 py-8">
        <Hero />
        
        <div className="wallet-section">
          <WalletConnect />
        </div>
        
        <div className="referral-section">
          <ReferralInput onSubmit={handleReferralSubmit} />
        </div>
        
        <div className="cta-section">
          <button className="btn-primary">🚀 Join Now</button>
          <button className="btn-secondary">📚 Learn More</button>
        </div>
        
        <CharacterShowcase />
      </div>
    </main>
  )
}
```

---

## 🎨 Tailwind CSS Styling

```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --egg-blue: #3B82F6;
  --egg-yellow: #FBBF24;
  --bg-dark: #0F172A;
  --bg-orange: #F97316;
}

.hero {
  @apply text-center mb-12;
}

.hero h1 {
  @apply text-5xl font-bold text-white mb-4;
}

.tagline {
  @apply text-xl text-slate-300 mb-6;
}

.wallet-section {
  @apply max-w-md mx-auto mb-8;
}

.wallet-connect-btn {
  @apply w-full bg-blue-500 hover:bg-blue-600 text-white 
         font-bold py-4 px-6 rounded-xl transition-all
         flex items-center justify-center gap-3;
}

.referral-form {
  @apply max-w-md mx-auto mb-8;
}

.referral-form input {
  @apply w-full bg-slate-800 border border-slate-600 
         text-white rounded-lg px-4 py-3 mt-2
         focus:outline-none focus:border-blue-500;
}

.cta-section {
  @apply flex gap-4 justify-center mb-12;
}

.btn-primary {
  @apply bg-blue-500 hover:bg-blue-600 text-white 
         font-bold py-3 px-8 rounded-xl transition-all;
}

.btn-secondary {
  @apply bg-slate-700 hover:bg-slate-600 text-white 
         font-bold py-3 px-8 rounded-xl transition-all;
}

.character-showcase {
  @apply max-w-2xl mx-auto;
}

.characters-grid {
  @apply grid grid-cols-2 md:grid-cols-4 gap-4;
}

.character-card {
  @apply bg-slate-800 rounded-xl p-4 text-center
         border-2 border-transparent;
}

.character-card.common { border-color: #94A3B8; }
.character-card.uncommon { border-color: #22C55E; }
.character-card.rare { border-color: #3B82F6; }
.character-card.legendary { border-color: #FBBF24; }
```

---

## 🚀 v0.ai Prompt (Optimized)

```
Create a world-class NFT membership login page for "EggoWorld".

## Brand Identity
- Logo: Cracked egg with 4 characters (robot 🤖, cat 🐱, purple creature 👾, coins 🪙)
- Colors: Blue (#3B82F6), Yellow (#FBBF24), Orange gradient (#F97316)
- Style: Playful, character-driven, Web3 aesthetic
- Background: Dark blue to orange gradient

## Required Components

### 1. Hero Section
- Large logo centered at top
- Headline: "Welcome to EggoWorld!"
- Subheadline: "Buy Eggs. Earn Rewards. Build Your Collection."
- Social proof: "👥 2,456 members have joined!"

### 2. Wallet Connection
- MetaMask button (primary)
- WalletConnect option (secondary)
- Connected state shows: "🟢 0x1234...abcd"
- Disconnect button when connected

### 3. Referral Code Input
- Label: "🎁 Have a referral code?"
- Input field with uppercase auto-conversion
- "Apply Code" button
- Error state for invalid codes
- Success state with checkmark

### 4. CTA Buttons
- "🚀 Join Now" (primary, blue)
- "📚 Learn More" (secondary, gray)

### 5. Character Showcase
- Grid of 4 character cards
- Each shows: emoji, name, rarity badge
- Rarity colors: Common (gray), Uncommon (green), Rare (blue), Legendary (yellow)

## Technical Requirements
- React/Next.js 14 with App Router
- Tailwind CSS for styling
- Responsive design (mobile-first)
- Dark theme
- Smooth animations on hover
- Production-ready code
- Export as clean components

## Design Notes
- Rounded corners (xl or 2xl)
- Soft shadows
- Gradient backgrounds
- Playful emoji usage
- Clear visual hierarchy
- Accessible (ARIA labels)
```

---

## 📦 Package Dependencies

```json
{
  "dependencies": {
    "next": "14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "wagmi": "^1.4.0",
    "viem": "^1.10.0",
    "@tanstack/react-query": "^5.0.0",
    "@rainbow-me/rainbowkit": "^1.3.0",
    "tailwindcss": "^3.4.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "typescript": "^5.0.0"
  }
}
```

---

## 🎯 Implementation Checklist

- [ ] Set up Next.js 14 project
- [ ] Install wagmi + viem for wallet connect
- [ ] Configure Tailwind CSS with EggoWorld colors
- [ ] Create Hero component with logo
- [ ] Create WalletConnect component
- [ ] Create ReferralInput component
- [ ] Create CharacterShowcase component
- [ ] Build main page layout
- [ ] Add responsive design
- [ ] Test on mobile devices
- [ ] Deploy to Vercel
- [ ] Share preview URL

---

## 🔗 Reference Examples

1. **v0 Examples:** https://v0.dev/examples
2. **Rainbow Kit:** https://rainbowkit.com/
3. **wagmi Docs:** https://wagmi.sh/
4. **Tailwind UI:** https://tailwindui.com/

---

**Ready to generate with v0! Copy the prompt above and paste into v0.ai**
