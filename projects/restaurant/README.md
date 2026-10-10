# MĀRA: Modern Indian Dining | Tetravate Portfolio Build

> **A self-initiated portfolio project by Tetravate**  
> *«From Thought to Thing.»*

MĀRA is a production-quality, multi-page digital restaurant experience designed for a contemporary Indian restaurant located on Race Course Road, Coimbatore, Tamil Nadu.

Rather than acting as a generic template or single-page landing page, this project represents an art-directed intersection of **Branding + Multi-Page UX + Accessible Web Engineering + Business Conversion Strategy**.

---

## 🌟 Multi-Page Routes & Highlights

1. **`/` (Home):**
   - Cinematic Hero with live opening status (`Coimbatore · Open today · 12 PM - 11 PM`).
   - Asymmetric introduction (*«Rooted in the familiar. Reimagined for today.»*).
   - Dominant editorial signature dish showcase (*Charred Paneer*).
   - Restaurant experience visual storytelling (Ingredients, Kitchen, Dining Room, Hospitality).
   - List-based menu preview with price rows.
   - Full-bleed atmosphere visual (*«Come for the food. Stay for the feeling.»*).
   - Private dining teaser & reservation call-to-action.

2. **`/menu` (Our Menu):**
   - 7 categories with sticky navigation on desktop and horizontal scroll on mobile.
   - Real-time debounced live search across dishes and ingredients.
   - Dietary filters (`VEG`, `NON-VEG`, `GLUTEN-FREE`, `Under ₹400`).
   - Refined row items with direct links to `/dish/:slug` and WhatsApp inquiries.

3. **`/dish/:slug` (Dish Detail):**
   - Deep culinary inspection with preparation techniques, key ingredients, spice levels, and sommelier pairing notes.

4. **`/our-story` (Our Story):**
   - Magazine editorial layout detailing philosophy, farm-to-table sourcing, open wood-ember craft, and Executive Chef Arjun Menon's profile.

5. **`/gallery` (Atmosphere & Craft):**
   - Asymmetric masonry grid across Food, Space, People, Kitchen, and Details with accessible fullscreen Lightbox.

6. **`/private-dining` (Private Dining):**
   - Dedicated celebration section with interactive party size selector (8–24 guests) and contextual WhatsApp event enquiry builder.

7. **`/reservations` (Table Reservations):**
   - Split layout with atmosphere visual and validated reservation request workflow (preventing past dates, validating contact numbers, enforcing guest limits).
   - Truthful *«Reservation Request Received»* receipt state with WhatsApp bridge and phone fallback.

8. **`/contact` (Location & Inquiries):**
   - Central Coimbatore arrival guide, opening hours breakdown, direct phone dialer, and Google Maps deep link.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, React Router v7, TypeScript
- **Styling:** Tailwind CSS with custom design tokens
- **Icons:** Lucide React (accessible vector SVG)
- **Build Tool:** Vite 6
- **SEO & Schema:** JSON-LD `Restaurant` Schema, OpenGraph, Canonical metadata

---

## 🚀 Getting Started

### Installation & Development

```bash
# Install dependencies
npm install

# Start local development server (port 3000)
npm run dev

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📄 Case Study

Read the full design and business rationale in [docs/restaurant-case-study.md](../../docs/restaurant-case-study.md).

---

## ✒️ Attribution & Credits

- **Studio:** Tetravate (*From Thought to Thing.*)
- **Concept:** MĀRA - Modern Indian Dining
