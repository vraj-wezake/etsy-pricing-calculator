import {
  LISTING_FEE,
  TRANSACTION_FEE_RATE,
  PROCESSING_FEE_RATE,
  PROCESSING_FEE_FIXED,
  OFFSITE_ADS_RATE,
  VAT_RATES,
  ETSY_FEES_VAT_RATE,
} from './constants.js';

/**
 * All formulas derived from etsy_pricing_calculator_english.xlsx
 *
 * KEY DIFFERENCES FROM NAIVE IMPLEMENTATION (verified against Excel):
 *
 * 1. Etsy listing price for Einzelunternehmer DE/EU:
 *    VAT is calculated on (sellingPrice + shippingPrice), not just sellingPrice.
 *    Excel: B8 = B4 + B6*19/100  where B6 = sellingPrice + shippingPrice
 *    So: etsyListingPrice = sellingPrice + (sellingPrice + shippingPrice) * vatRate
 *
 * 2. Profit for Einzelunternehmer:
 *    VAT on sales is NOT subtracted from profit. It's a pass-through —
 *    collected from customer on top and forwarded to government.
 *    Excel: profit = totalRevenue - totalCosts  (no vatOnSales deduction)
 *    Note from Excel: "The VAT on PURCHASES at Printify is refunded by the tax office"
 *
 * 3. Etsy fees always calculated on pre-VAT total (sellingPrice + shippingPrice)
 */
export function calculate(inputs) {
  const {
    country,
    companyType,
    sellingPrice,
    shippingPrice,
    purchasePrice,
    purchaseShipping,
    discountPercent,
    offsiteAds,
  } = inputs;

  const isEinzel = companyType === 'einzelunternehmer';
  const isKlein = companyType === 'kleinunternehmer';
  const vatRate = VAT_RATES[country] || 0;
  const germanVatRate = VAT_RATES.DE;
  const euVatRate = VAT_RATES.EU;
  const canadaVatRate = VAT_RATES.CA;
  const australiaVatRate = VAT_RATES.AU;

  // Step 1: Total purchase cost (what user pays Printify)
  const totalPurchaseCost = purchasePrice + purchaseShipping;

  // Step 2: Total revenue (seller's base price + shipping, pre-VAT)
  // Excel: B6 = SUM(B4:B5) = sellingPrice + shippingPrice
  const totalRevenue = sellingPrice + shippingPrice;

  // Step 3: VAT on selling price
  // Einzelunternehmer DE/EU: VAT on totalRevenue, collected from customer and passed to govt
  // Excel Germany: B7 = B6 * 19/100
  // This is NOT a cost — it's collected on top and forwarded
  let vatOnSales = 0;
  if (isEinzel) {
    if (country === 'DE') vatOnSales = totalRevenue * germanVatRate;
    else if (country === 'EU') vatOnSales = totalRevenue * euVatRate;
  }

  // Step 4: VAT on purchase from print provider
  // Einzelunternehmer DE/EU: NO VAT on purchase (refunded by tax office per Excel note)
  // Einzelunternehmer CA: 15% GST on purchase (Excel Canada: B12 = B11*15/100)
  // Einzelunternehmer AU: 10% GST on purchase (Excel Australia: B10 = B9*10/100)
  // Kleinunternehmer DE: 19% on purchase (can't deduct — real cost)
  // Kleinunternehmer EU: 21% on purchase
  // Kleinunternehmer US: no VAT on purchase
  // Kleinunternehmer CA: 15% on purchase
  // Kleinunternehmer AU: 10% on purchase
  let vatOnPurchase = 0;
  if (isEinzel) {
    if (country === 'CA') vatOnPurchase = totalPurchaseCost * canadaVatRate;
    else if (country === 'AU') vatOnPurchase = totalPurchaseCost * australiaVatRate;
  } else {
    if (country === 'DE') vatOnPurchase = totalPurchaseCost * germanVatRate;
    else if (country === 'EU') vatOnPurchase = totalPurchaseCost * euVatRate;
    else if (country === 'CA') vatOnPurchase = totalPurchaseCost * canadaVatRate;
    else if (country === 'AU') vatOnPurchase = totalPurchaseCost * australiaVatRate;
  }

  // Step 5: Etsy fees — always based on totalRevenue (pre-VAT)
  // Excel: B14 = B6*6.5%, B15 = B6*4%+0.30
  const listingFee = LISTING_FEE;
  const transactionFee = totalRevenue * TRANSACTION_FEE_RATE;
  const processingFee = totalRevenue * PROCESSING_FEE_RATE + PROCESSING_FEE_FIXED;
  const offsiteAdsFee = offsiteAds ? totalRevenue * OFFSITE_ADS_RATE : 0;

  // Step 6: VAT on Etsy fees
  // Kleinunternehmer (all countries): 19% on all Etsy fees (Etsy is German-based)
  // Einzelunternehmer: never (they deduct input VAT)
  let vatOnEtsyFees = 0;
  if (isKlein) {
    const rawFees = listingFee + transactionFee + processingFee + offsiteAdsFee;
    vatOnEtsyFees = rawFees * ETSY_FEES_VAT_RATE;
  }

  // Step 7: Total costs
  // Excel Germany Einzelunternehmer: B17 = SUM(B12:B16)
  //   = purchaseCost + listingFee + transactionFee + processingFee + offsiteAds
  // For Klein: add vatOnPurchase and vatOnEtsyFees
  // For CA/AU Einzel: add vatOnPurchase
  const totalEtsyFees = listingFee + transactionFee + processingFee + offsiteAdsFee + vatOnEtsyFees;
  const totalCosts = totalPurchaseCost + vatOnPurchase + totalEtsyFees;

  // Step 8: Profit
  // Excel: B18 = B6 - B17 (revenue minus costs, NO vatOnSales deduction)
  // For Einzelunternehmer, VAT on sales is pass-through: collected from customer, given to govt
  // The seller's actual revenue is totalRevenue (the base price they set)
  const profit = totalRevenue - totalCosts;
  const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

  // Step 9: Etsy listing price (what user types into Etsy)
  // Excel Germany: B8 = B4 + B7 = sellingPrice + (sellingPrice+shippingPrice)*0.19
  // Excel Europe:  B8 = B4 + B7 = sellingPrice + (sellingPrice+shippingPrice)*0.21
  // Excel USA:     no VAT, listing price = sellingPrice
  // Excel Canada:  no VAT on selling, listing price = sellingPrice
  // Excel Australia: no VAT on selling, listing price = sellingPrice
  // Kleinunternehmer: never add VAT to selling price
  let etsyListingPriceNoDiscount;
  if (isEinzel && (country === 'DE' || country === 'EU')) {
    etsyListingPriceNoDiscount = sellingPrice + totalRevenue * vatRate;
  } else {
    etsyListingPriceNoDiscount = sellingPrice;
  }

  // Step 10: Discount adjustment
  // Excel: B11 = B8*100/(100-B10)
  let etsyListingPriceWithDiscount;
  if (discountPercent > 0 && discountPercent < 100) {
    etsyListingPriceWithDiscount = etsyListingPriceNoDiscount * 100 / (100 - discountPercent);
  } else {
    etsyListingPriceWithDiscount = etsyListingPriceNoDiscount;
  }

  // Customer-facing total (what customer actually pays)
  // Excel Germany: B9 = B6 + B7 = totalRevenue + vatOnSales
  const customerTotal = totalRevenue + vatOnSales;

  const r = (v) => Math.round(v * 100) / 100;

  return {
    etsyListingPriceNoDiscount: r(etsyListingPriceNoDiscount),
    etsyListingPriceWithDiscount: r(etsyListingPriceWithDiscount),
    profit: r(profit),
    profitMargin: Math.round(profitMargin * 10) / 10,

    totalRevenue: r(totalRevenue),
    customerTotal: r(customerTotal),
    vatOnSales: r(vatOnSales),
    totalPurchaseCost: r(totalPurchaseCost),
    vatOnPurchase: r(vatOnPurchase),
    purchaseCostWithVat: r(totalPurchaseCost + vatOnPurchase),
    listingFee: r(listingFee),
    transactionFee: r(transactionFee),
    processingFee: r(processingFee),
    offsiteAdsFee: r(offsiteAdsFee),
    vatOnEtsyFees: r(vatOnEtsyFees),
    totalEtsyFees: r(totalEtsyFees),
    totalCosts: r(totalCosts),
  };
}
