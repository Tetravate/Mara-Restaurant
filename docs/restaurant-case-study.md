# Tetravate Case Study: Restaurant Digital Experience

**Studio:** Tetravate  
**Tagline:** From Thought to Thing.  
**Project Type:** Self-Initiated Concept  
**Year:** 2026  
**Client Concept:** MĀRA - Modern Indian Dining (Coimbatore, Tamil Nadu)  
**Architecture:** Multi-Page Art-Directed Web Application  
**Capabilities:** UI/UX Design · Full-Stack Frontend Engineering · Design Systems · Accessibility  

---

## 1. Executive Summary

Most contemporary restaurant websites fail at fundamental visitor tasks: discovering dishes, assessing the dining atmosphere, checking operating hours, and securing a table without friction. They often rely on slow PDF menus, deceptive "instant booking" claims that lack real-time table sync, and overdesigned visual effects that distract from the food.

For **MĀRA**, a fictional premium contemporary restaurant in Coimbatore, Tetravate designed and built an art-directed, multi-page digital experience rooted in **quiet confidence**, **editorial elegance**, and **human-centric hospitality UX**.

---

## 2. Multi-Page Information Architecture

Rather than dumping all content onto a single endless landing page, MĀRA is structured across dedicated routes:

- `/` (Home): Cinematic introduction, brand philosophy, dominant signature dish showcase, restaurant experience storytelling, menu preview list, atmosphere immersion, private dining preview, and reservation call-to-action.
- `/menu` (Our Menu): Comprehensive web menu with sticky category navigation (Starters, Soups, Mains, Breads, Rice, Desserts, Drinks), live debounced search, dietary filters (Vegetarian, Vegan, Non-Veg, Gluten-Free, Under ₹400), and dish detail triggers.
- `/dish/:slug` (Dish Detail): Deep-linked culinary view with preparation techniques, ingredient provenance, spice ratings, pairing recommendations, and direct WhatsApp enquiry.
- `/our-story` (Our Story): Magazine editorial layout detailing philosophy, farm-to-table sourcing from the Western Ghats and Kongu plains, kitchen craft over wood embers, and Executive Chef Arjun Menon's profile and quote.
- `/gallery` (Atmosphere & Craft): Asymmetric masonry photography gallery across Food, Space, People, Kitchen, and Details with an accessible fullscreen Lightbox supporting keyboard navigation.
- `/private-dining` (Private Dining & Celebrations): Dedicated event planning suite for intimate gatherings of 8 to 24 guests with interactive party size slider and tailored WhatsApp event enquiry builder.
- `/reservations` (Table Reservations): Split-layout reservation suite with real-time field validation, past-date prevention, and a truthful "Reservation Request Received" receipt state with WhatsApp bridge.
- `/contact` (Location & Inquiries): Detailed arrival guide on Race Course Road, opening hours, direct contacts, and Google Maps deep linking.

---

## 3. Target Users & The «8 to 80 Principle»

The website is designed for a broad audience:
- **First-time diners and couples** looking for ambiance, signature creations, and price transparency.
- **Families and multi-generational groups** needing clear dietary indicators (vegetarian segregation, spice levels, nut allergies).
- **Tourists and business travelers** checking opening hours, location, and travel times from Coimbatore airport or railway.
- **Elderly guests** who require high-contrast text, clear font sizes, predictable navigation, and direct phone contact.
- **Young adults** who prefer rapid WhatsApp inquiries over phone calls.

> **The 8 to 80 Principle:**  
> If an 8-year-old child can intuitively understand the food categories and explore dishes, and an 80-year-old grandparent can comfortably read the typography and request a table without confusion, the user experience is successful.

---

## 4. Design Philosophy & Visual Identity

### Quiet Confidence
Rather than shouting with aggressive animations or flashy 3D gimmicks, MĀRA's design exudes warmth, authenticity, and understated luxury.

- **Warm Sand Canvas:** `#FAF8F5` creates an inviting, clean surface reminiscent of unbleached linen and stone.
- **Deep Grounding Charcoal:** `#1B1714` (Charcoal Clove) provides crisp, readable contrast exceeding WCAG AA requirements (ratio > 11:1).
- **Sunlit Terracotta Accent:** `#C45B28` draws purposeful attention to primary reservation actions and signature dish tags.
- **Muted Saffron & Herb Sage:** `#D49B44` and `#4A6B53` convey spice nuance and vegetarian distinction.

### Typography Hierarchy
- **Headings:** *Playfair Display* (Editorial serif expressing culinary heritage and craftsmanship).
- **Body & Controls:** *Plus Jakarta Sans* (Humanist sans-serif offering maximum legibility on high-DPI mobile screens).

---

## 5. Technical Implementation & Quality

- **Framework:** React 18, React Router v7, TypeScript
- **Styling:** Tailwind CSS with custom design tokens
- **Build System:** Vite 6 with sub-second HMR and optimized tree-shaking
- **Icons:** Lucide React (accessible, crisp vector SVG)
- **Accessibility:** Semantic HTML5, full keyboard focus rings, WCAG AA compliance, and `prefers-reduced-motion` respect
- **SEO:** Schema.org `Restaurant` JSON-LD structured data, OpenGraph cards, canonical tags, and descriptive image alt attributes

---

## 6. Outcome & Portfolio Takeaway

This project demonstrates Tetravate's philosophy: **"From Thought to Thing."**  
It proves that a restaurant website can be art-directed, functional, and commercially potent without relying on generic single-page templates or overwhelming feature bloat.
