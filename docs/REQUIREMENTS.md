_Last updated: April 2026_

# Etsy Pricing Calculator - Requirements

This document is the product requirements reference for the current implementation.  
It should be updated whenever features, UX, or behavior change.

## Project Overview

The Etsy Pricing Calculator is a single-page frontend tool that helps Etsy print-on-demand sellers calculate profitable listing prices and understand their real profit after Etsy fees and VAT/tax effects.

The app is designed for sellers who use Printify production costs and need country-specific VAT handling.

## Target Users

- German Etsy print-on-demand sellers
- Sellers using Printify for product fulfillment
- Users comparing profitability across multiple target markets

## Supported Countries

- Germany (`DE`)
- Europe (`EU`)
- United States (`US`)
- Canada (`CA`)
- Australia (`AU`)

## Supported Company Types

- `einzelunternehmer`
- `kleinunternehmer`

## Language Support

- English (`en`)
- German (`de`)
- Initial language is auto-detected from browser locale (`navigator.language`)
- User can switch language with header toggle (`EN` / `DE`)
- Selected language persists via `localStorage` key `etsy-lang`

## Core User Problems Solved

1. **"What price do I enter in my Etsy listing?"**  
   The app shows both listing price without discount and listing price with discount.

2. **"How much profit will I make after all fees and taxes?"**  
   The app shows revenue, Etsy fees, VAT rows, costs, profit per sale, and margin.

## Feature List

- Live calculation on every input change
- Country selector with 5 options
- Company type toggle with explanatory tooltips
- Item price + shipping price inputs
- Discount toggle and discount percent input
- Correct discount-aware Etsy listing price output
- Printify product cost + shipping cost inputs
- Etsy fee display:
  - listing fee
  - transaction fee
  - processing fee
  - offsite ads toggle
- Desired profit margin slider
- Monthly projected sales input
- Results panel:
  - Etsy listing price (no discount + with discount)
  - full breakdown (revenue, fees, costs, VAT rows)
  - profit per sale + profit margin with positive/negative styling
- Monthly projection summary:
  - projected sales
  - gross revenue
  - total costs
  - total Etsy fees
  - net monthly income
  - margin
- Loss warning when profit is negative
- EN/DE language toggle with persistence
- Mobile responsive layout (single-column under 768px)

## Non-Functional Requirements

- Pure frontend app (no backend)
- No database
- No authentication
- All business calculations are centralized in `src/logic/calculator.js`
- UI components contain no calculation formulas
- Monetary outputs are rounded to 2 decimals
- App runs with:
  - `npm install`
  - `npm run dev`

