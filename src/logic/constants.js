// Etsy fee constants (same for all countries)
export const LISTING_FEE = 0.18;
export const TRANSACTION_FEE_RATE = 0.065;
export const PROCESSING_FEE_RATE = 0.04;
export const PROCESSING_FEE_FIXED = 0.30;
export const OFFSITE_ADS_RATE = 0.15;

// VAT rates by country (from Excel sheets)
export const VAT_RATES = {
  DE: 0.19,
  EU: 0.21,
  US: 0,
  CA: 0.15,
  AU: 0.10,
};

// Etsy fees VAT rate is always 19% (Etsy is based in Germany)
export const ETSY_FEES_VAT_RATE = 0.19;

export const COUNTRIES = [
  { code: 'DE', label: 'Germany', flag: '🇩🇪', currency: '€' },
  { code: 'EU', label: 'Europe', flag: '🇪🇺', currency: '€' },
  { code: 'US', label: 'United States', flag: '🇺🇸', currency: '$' },
  { code: 'CA', label: 'Canada', flag: '🇨🇦', currency: '$' },
  { code: 'AU', label: 'Australia', flag: '🇦🇺', currency: '$' },
];

export const COMPANY_TYPES = [
  {
    value: 'einzelunternehmer',
    label: 'Einzelunternehmer',
    tooltip: 'You charge VAT to your customers and pass it to the government. Most common for established sellers.',
  },
  {
    value: 'kleinunternehmer',
    label: 'Kleinunternehmer',
    tooltip: 'You do NOT charge VAT on sales. You pay VAT when purchasing from your print provider. Best for beginners under €22,000/year revenue.',
  },
];

export const DEFAULT_INPUTS = {
  country: 'DE',
  companyType: 'einzelunternehmer',
  sellingPrice: 15.99,
  shippingPrice: 4.99,
  purchasePrice: 8.67,
  purchaseShipping: 3.30,
  discountPercent: 0,
  offsiteAds: false,
  desiredMargin: 30,
  monthlyUnits: 10,
};
