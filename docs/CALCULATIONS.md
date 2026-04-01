_Last updated: April 2026_

# Etsy Pricing Calculator - Calculation Reference

This document explains the pricing logic used in `src/logic/calculator.js` in plain language.  
It should be updated whenever calculation behavior changes.

## Overview

The calculator provides two key outputs:

1. **What to enter in Etsy**  
   - `etsyListingPriceNoDiscount`
   - `etsyListingPriceWithDiscount`

2. **Expected profitability per sale**  
   - `profit`
   - `profitMargin`

Why both outputs matter:

- Sellers need the correct Etsy listing value to handle VAT and discounts.
- Sellers need a clear view of net profit after Printify costs, Etsy fees, and VAT effects.

## Etsy Fee Constants

- **Listing Fee**: `0.18` fixed per listing
- **Transaction Fee**: `6.5%` of total selling price (`item + shipping`)
- **Processing Fee**: `4%` of total selling price + `0.30` fixed
- **Offsite Ads Fee**: `15%` of total selling price (only if enabled)

## VAT Rules Matrix (10 combinations)

| Country | Company Type | VAT on selling price | VAT on Printify purchase | VAT on Etsy fees |
|---|---|---|---|---|
| DE | Einzelunternehmer | Yes, 19% | No (refunded / not counted as cost) | No |
| EU | Einzelunternehmer | Yes, 21% | No (refunded / not counted as cost) | No |
| US | Einzelunternehmer | No | No | No |
| CA | Einzelunternehmer | No | Yes, 15% | No |
| AU | Einzelunternehmer | No | Yes, 10% | No |
| DE | Kleinunternehmer | No | Yes, 19% | Yes, 19% |
| EU | Kleinunternehmer | No | Yes, 21% | Yes, 19% |
| US | Kleinunternehmer | No | No | Yes, 19% |
| CA | Kleinunternehmer | No | Yes, 15% | Yes, 19% |
| AU | Kleinunternehmer | No | Yes, 10% | Yes, 19% |

## Step-by-Step Walkthrough (as in `calculator.js`)

Example scenario used below (Germany, Einzelunternehmer):

- `sellingPrice = 15.99`
- `shippingPrice = 4.99`
- `purchasePrice = 12.98`
- `purchaseShipping = 0`
- `discountPercent = 0`
- `offsiteAds = false`

### Step 1 - Total purchase cost

- Plain English: Add product cost and Printify shipping cost.
- Code notation: `totalPurchaseCost = purchasePrice + purchaseShipping`
- Example: `12.98 + 0 = 12.98`

### Step 2 - Total revenue

- Plain English: Add item price and customer shipping.
- Code notation: `totalRevenue = sellingPrice + shippingPrice`
- Example: `15.99 + 4.99 = 20.98`

### Step 3 - VAT on selling price

- Plain English: For Einzelunternehmer in DE/EU, VAT is collected from customer on revenue.
- Code notation (DE/EU only): `vatOnSales = totalRevenue * vatRate`
- Example (DE 19%): `20.98 * 0.19 = 3.9862` -> `3.99`

### Step 4 - VAT on purchase

- Plain English: Apply purchase VAT by country/type rule.
- Code notation: conditional by `country` + `companyType`
- Example (DE Einzelunternehmer): `0` (purchase VAT is not treated as cost here)

### Step 5 - Etsy fees

- Plain English: Compute listing + transaction + processing + optional offsite ads.
- Code notation:
  - `listingFee = 0.18`
  - `transactionFee = totalRevenue * 0.065`
  - `processingFee = totalRevenue * 0.04 + 0.30`
  - `offsiteAdsFee = offsiteAds ? totalRevenue * 0.15 : 0`
- Example:
  - Listing: `0.18`
  - Transaction: `20.98 * 0.065 = 1.3637` -> `1.36`
  - Processing: `20.98 * 0.04 + 0.30 = 1.1392` -> `1.14`
  - Offsite Ads: `0`

### Step 6 - VAT on Etsy fees

- Plain English: For Kleinunternehmer, Etsy fees get 19% VAT.
- Code notation: `vatOnEtsyFees = (listing + transaction + processing + offsiteAds) * 0.19`
- Example (DE Einzelunternehmer): `0`

### Step 7 - Total costs

- Plain English: Add purchase cost + purchase VAT + all Etsy fees.
- Code notation:
  - `totalEtsyFees = listingFee + transactionFee + processingFee + offsiteAdsFee + vatOnEtsyFees`
  - `totalCosts = totalPurchaseCost + vatOnPurchase + totalEtsyFees`
- Example:
  - `totalEtsyFees = 0.18 + 1.3637 + 1.1392 + 0 + 0 = 2.6829`
  - `totalCosts = 12.98 + 0 + 2.6829 = 15.6629` -> `15.66`

### Step 8 - Profit and margin

- Plain English: Profit is revenue minus total costs; margin is profit divided by revenue.
- Code notation:
  - `profit = totalRevenue - totalCosts`
  - `profitMargin = (profit / totalRevenue) * 100` (if revenue > 0)
- Example:
  - `profit = 20.98 - 15.6629 = 5.3171` -> `5.32`
  - `profitMargin = 5.3171 / 20.98 * 100 = 25.34%` -> `25.3%` (1 decimal in output)

### Step 9 - Etsy listing price (no discount)

- Plain English:
  - DE/EU Einzelunternehmer adds VAT-aware adjustment to listing field
  - Other cases use `sellingPrice` directly
- Code notation:
  - DE/EU Einzel: `etsyListingPriceNoDiscount = sellingPrice + totalRevenue * vatRate`
  - Else: `etsyListingPriceNoDiscount = sellingPrice`
- Example (DE Einzel):
  - `15.99 + 20.98 * 0.19 = 19.9762` -> `19.98`

### Step 10 - Etsy listing price (with discount)

- Plain English: Increase listing value so Etsy can apply discount and still land on desired sale price.
- Code notation:
  - `etsyListingPriceWithDiscount = etsyListingPriceNoDiscount * 100 / (100 - discountPercent)`
  - If no valid discount, same as no-discount price
- Example with `40%`:
  - `19.9762 * 100 / 60 = 33.2937` -> `33.29`

## Verified Einzelunternehmer Results (Excel-aligned)

| Country | Selling | Shipping | Purchase | Etsy Listing | Profit | Margin |
|---|---:|---:|---:|---:|---:|---:|
| Germany (DE) | 15.99 | 4.99 | 12.98 | 19.98 | 5.32 | 25.4% |
| Europe (EU) | 17.99 | 4.99 | 14.76 | 22.82 | 5.33 | 23.2% |
| USA (US) | 16.69 | 4.99 | 13.00 | 16.69 | 5.92 | 27.3% |
| Canada (CA) | 34.99 | 4.99 | 23.92 | 34.99 | 7.79 | 19.5% |
| Australia (AU) | 34.99 | 4.99 | 26.36 | 34.99 | 6.31 | 15.8% |

