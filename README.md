# 🛋️ MODERN. | Premium Furniture Catalog

A high-end, immersive digital brochure built with **Next.js 16 (App Router)**, **Tailwind CSS v4**, and **Framer Motion**.

## ✨ Features
- **Immersive Spreads**: Multi-page layout with high-fidelity lifestyle imagery.
- **Interactive Hotspots**: Visual anchors on images that reveal product specs.
- **Lead Generation**: Integrated inquiry forms for direct customer engagement.
- **Micro-Animations**: Sophisticated motion design using `framer-motion`.
- **SEO Optimized**: Fully responsive with proper metadata and semantic HTML.

## 🚀 One-Click Deployment

This project is optimized for **Vercel**.

1. Push this code to a GitHub repository.
2. Connect your repo to [Vercel](https://vercel.com).
3. Vercel will automatically detect the Next.js project and deploy it.

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the catalog.

## 📂 Customization Guide

### Adding Products
Modify the `CATALOG_SPREADS` array in `src/components/Catalog.tsx`. 

Each spread requires:
- `image`: Path to the room lifestyle shot.
- `hotspot`: Relative coordinates `{x, y}` as percentages (e.g., `"45%"`) to position the interaction point.

### Styling
The design system is managed via [Tailwind CSS v4](src/app/globals.css). You can adjust brand colors and typography in the `@theme` block.

## 📜 Metadata
- **Framework**: Next.js (App Router)
- **Icons**: Lucide React
- **Animation**: Framer Motion
- **Styling**: Tailwind CSS v4
