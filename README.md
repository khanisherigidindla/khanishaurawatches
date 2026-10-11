# AURA — Brand Watches

I built this because buying a watch in India felt broken. Inflated MRPs, stock photos that never match the real piece, and prices that change shop to shop. So I made the store I wished existed — every listing carries the exact photograph, the full reference name, and the real street price.

## What this is

A watch store. Real brands — Rolex, Omega, Patek Philippe, Cartier, Seiko, Titan, Casio and more. Around 120+ luxury references plus budget-friendly picks starting a few hundred rupees. Prices are in INR and reflect what I tracked as Jan-2026 India street levels including duties where they apply.

## How it works

- Land on the homepage, you get the turntable film and the full catalogue underneath. Search by brand or model, filter by brand chip.
- Each card shows the exact photo, reference number, movement and case size, and the price. Hit "Add to cart" or "Details" for the full spec sheet (dial, strap, metal, water resistance, power reserve, glass, warranty).
- Cart slides in from the right. Checkout is 4 steps — your details, delivery address, review, then payment.
- Payment is UPI or Cash on Delivery. UPI asks for your UPI id, then shows an OTP screen. It's a demo setup, so the master OTP is **123456** — or honestly any 6-digit number works. I put that note right on the screen so nobody gets stuck.
- Orders get saved locally with an order number (AUR-xxxxx), and you can track them with a printable receipt.

## Accounts

First time here, you sign up. After that you just log in with the same email and password — I keep it in localStorage so it remembers you. There's also an admin login (admin@gmail.com) that opens the admin page with the product and order tables.

Wishlist and notifications start empty. Nothing is pre-added. Whatever you save is yours.

## Running it

```bash
npm install
npm run dev
```

Open http://localhost:3000/dashboard — the root (/) just redirects there.

No env vars needed. Payments run in sandbox/simulator mode out of the box. If you ever wire real Razorpay or Stripe keys, copy `.env.example` to `.env.local` and fill them in. Never commit that file — it's already in `.gitignore`.

## Deploying

Zero config — nothing to set up.

1. Push this repo to GitHub.
2. Vercel: https://vercel.com/new → Import → select this repo. It auto-detects Next.js and runs `npm run build`. Done.
3. Netlify: https://app.netlify.com/start → Import → select this repo. It auto-detects Next.js. Done.

No env vars are required: payments run in sandbox mode out of the box. If you ever wire real Razorpay or Stripe keys, copy `.env.example` to `.env.local` and fill them in — that file is already git-ignored.

## Tech I used

Next.js 14 (app router), TypeScript, Tailwind, Zustand with persist for cart/auth/wishlist, Framer Motion + GSAP for the scroll animations, Lenis for smooth scrolling. Watch turntable is 50 JPG frames played like a film. Nothing fancy on the backend — orders and carts live in localStorage with a Supabase sync helper if you configure it later.

## Project layout

- `app/dashboard` — homepage (hero + catalogue + grails)
- `app/watches` — full catalogue, `app/watches/[slug]` — detail + spec sheet
- `app/checkout` — 4-step checkout with OTP, `app/demo-bank` — demo bank page
- `app/login`, `app/register` — auth, `app/admin` — admin tables
- `components/watch` — WatchCard, cinematic showcase, 360 viewer
- `components/navigation` — Navbar, Footer, bottom tab bar for mobile
- `lib/data` — realWatches, budget lists, watchDetails (spec enrichment)
- `lib/store` — cart, user, wishlist (all persisted)

## Notes

Mobile has a bottom tab bar (Home / Shop / Saved / Bag / Account) so it feels like an app. Desktop gets the full 4-column grid up to 4K. The space animation still lives at `/space` if you want to see it, but it's not linked anywhere in the store flow.

