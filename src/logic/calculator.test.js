import { calculate } from './calculator.js';

const TOLERANCE = 0.02;
let failures = 0;
let total = 0;

function assertApprox(actual, expected, label, tolerance = TOLERANCE) {
  total += 1;
  const ok = Math.abs(actual - expected) <= tolerance;
  if (ok) {
    console.log(`PASS | ${label} | actual=${actual} expected=${expected} tol=${tolerance}`);
  } else {
    failures += 1;
    console.log(`FAIL | ${label} | actual=${actual} expected=${expected} tol=${tolerance}`);
  }
}

function assertTrue(condition, label, details = '') {
  total += 1;
  if (condition) {
    console.log(`PASS | ${label}${details ? ` | ${details}` : ''}`);
  } else {
    failures += 1;
    console.log(`FAIL | ${label}${details ? ` | ${details}` : ''}`);
  }
}

function runScenario(name, inputs, expected) {
  console.log(`\n=== ${name} ===`);
  const result = calculate(inputs);
  for (const [key, value] of Object.entries(expected)) {
    assertApprox(result[key], value, `${name} -> ${key}`);
  }
  return result;
}

// ---------------------------------------------------------------------------
// GERMANY (DE) — Einzelunternehmer
// ---------------------------------------------------------------------------
const deEinzelBase = {
  sellingPrice: 15.99,
  shippingPrice: 4.99,
  purchasePrice: 12.98,
  purchaseShipping: 0,
  discountPercent: 0,
  offsiteAds: false,
  country: 'DE',
  companyType: 'einzelunternehmer',
};

const deEinzel = runScenario('GERMANY (DE) — Einzelunternehmer', deEinzelBase, {
  totalRevenue: 20.98,
  vatOnSales: 3.99,
  vatOnPurchase: 0,
  vatOnEtsyFees: 0,
  listingFee: 0.18,
  transactionFee: 1.36,
  processingFee: 1.14,
  totalCosts: 15.66,
  profit: 5.32,
  etsyListingPriceNoDiscount: 19.98,
});

runScenario(
  'GERMANY (DE) — Einzelunternehmer (40% discount)',
  { ...deEinzelBase, discountPercent: 40 },
  {
    etsyListingPriceNoDiscount: 19.98,
    etsyListingPriceWithDiscount: 33.30,
  },
);

// ---------------------------------------------------------------------------
// USA (US) — Einzelunternehmer
// ---------------------------------------------------------------------------
const usEinzelBase = {
  sellingPrice: 16.69,
  shippingPrice: 4.99,
  purchasePrice: 13.0,
  purchaseShipping: 0,
  discountPercent: 0,
  offsiteAds: false,
  country: 'US',
  companyType: 'einzelunternehmer',
};

const usEinzel = runScenario('USA (US) — Einzelunternehmer', usEinzelBase, {
  totalRevenue: 21.68,
  vatOnSales: 0,
  vatOnPurchase: 0,
  vatOnEtsyFees: 0,
  listingFee: 0.18,
  transactionFee: 1.41,
  processingFee: 1.17,
  totalCosts: 15.76,
  profit: 5.92,
  etsyListingPriceNoDiscount: 16.69,
});

runScenario(
  'USA (US) — Einzelunternehmer (40% discount)',
  { ...usEinzelBase, discountPercent: 40 },
  {
    etsyListingPriceNoDiscount: 16.69,
    etsyListingPriceWithDiscount: 27.82,
  },
);

// ---------------------------------------------------------------------------
// CANADA (CA) — Einzelunternehmer
// ---------------------------------------------------------------------------
const caEinzelBase = {
  sellingPrice: 34.99,
  shippingPrice: 4.99,
  purchasePrice: 23.92,
  purchaseShipping: 0,
  discountPercent: 0,
  offsiteAds: false,
  country: 'CA',
  companyType: 'einzelunternehmer',
};

const caEinzel = runScenario('CANADA (CA) — Einzelunternehmer', caEinzelBase, {
  totalRevenue: 39.98,
  vatOnSales: 0,
  vatOnPurchase: 3.59,
  vatOnEtsyFees: 0,
  listingFee: 0.18,
  transactionFee: 2.6,
  processingFee: 1.9,
  totalCosts: 32.19,
  profit: 7.79,
  etsyListingPriceNoDiscount: 34.99,
});

runScenario(
  'CANADA (CA) — Einzelunternehmer (20% discount)',
  { ...caEinzelBase, discountPercent: 20 },
  {
    etsyListingPriceNoDiscount: 34.99,
    etsyListingPriceWithDiscount: 43.74,
  },
);

// ---------------------------------------------------------------------------
// AUSTRALIA (AU) — Einzelunternehmer
// ---------------------------------------------------------------------------
const auEinzelBase = {
  sellingPrice: 34.99,
  shippingPrice: 4.99,
  purchasePrice: 26.36,
  purchaseShipping: 0,
  discountPercent: 0,
  offsiteAds: false,
  country: 'AU',
  companyType: 'einzelunternehmer',
};

const auEinzel = runScenario('AUSTRALIA (AU) — Einzelunternehmer', auEinzelBase, {
  totalRevenue: 39.98,
  vatOnSales: 0,
  vatOnPurchase: 2.64,
  vatOnEtsyFees: 0,
  listingFee: 0.18,
  transactionFee: 2.6,
  processingFee: 1.9,
  totalCosts: 33.67,
  profit: 6.31,
  etsyListingPriceNoDiscount: 34.99,
});

runScenario(
  'AUSTRALIA (AU) — Einzelunternehmer (20% discount)',
  { ...auEinzelBase, discountPercent: 20 },
  {
    etsyListingPriceNoDiscount: 34.99,
    etsyListingPriceWithDiscount: 43.74,
  },
);

// ---------------------------------------------------------------------------
// EUROPE (EU) — Einzelunternehmer
// ---------------------------------------------------------------------------
const euEinzelBase = {
  sellingPrice: 17.99,
  shippingPrice: 4.99,
  purchasePrice: 14.76,
  purchaseShipping: 0,
  discountPercent: 0,
  offsiteAds: false,
  country: 'EU',
  companyType: 'einzelunternehmer',
};

const euEinzel = runScenario('EUROPE (EU) — Einzelunternehmer', euEinzelBase, {
  totalRevenue: 22.98,
  vatOnSales: 4.83,
  vatOnPurchase: 0,
  vatOnEtsyFees: 0,
  listingFee: 0.18,
  transactionFee: 1.49,
  processingFee: 1.22,
  totalCosts: 17.65,
  profit: 5.33,
  etsyListingPriceNoDiscount: 22.82,
});

runScenario(
  'EUROPE (EU) — Einzelunternehmer (20% discount)',
  { ...euEinzelBase, discountPercent: 20 },
  {
    etsyListingPriceNoDiscount: 22.82,
    etsyListingPriceWithDiscount: 28.53,
  },
);

// ---------------------------------------------------------------------------
// KLEINUNTERNEHMER TESTS (derived logic checks)
// ---------------------------------------------------------------------------
const deKlein = calculate({ ...deEinzelBase, companyType: 'kleinunternehmer' });
console.log('\n=== GERMANY (DE) — Kleinunternehmer ===');
assertApprox(deKlein.etsyListingPriceNoDiscount, 15.99, 'DE Klein -> etsyListingPriceNoDiscount');
assertApprox(deKlein.vatOnSales, 0, 'DE Klein -> vatOnSales');
assertApprox(deKlein.vatOnPurchase, 2.47, 'DE Klein -> vatOnPurchase');
assertApprox(deKlein.vatOnEtsyFees, 0.51, 'DE Klein -> vatOnEtsyFees');
assertTrue(deKlein.profit < deEinzel.profit, 'DE Klein -> profit lower than DE Einzel', `${deKlein.profit} < ${deEinzel.profit}`);

const usKlein = calculate({ ...usEinzelBase, companyType: 'kleinunternehmer' });
console.log('\n=== USA (US) — Kleinunternehmer ===');
assertApprox(usKlein.etsyListingPriceNoDiscount, 16.69, 'US Klein -> etsyListingPriceNoDiscount');
assertApprox(usKlein.vatOnSales, 0, 'US Klein -> vatOnSales');
assertApprox(usKlein.vatOnPurchase, 0, 'US Klein -> vatOnPurchase');
assertApprox(usKlein.vatOnEtsyFees, 0.51, 'US Klein -> vatOnEtsyFees');
assertTrue(usKlein.profit < usEinzel.profit, 'US Klein -> profit lower than US Einzel', `${usKlein.profit} < ${usEinzel.profit}`);

const caKlein = calculate({ ...caEinzelBase, companyType: 'kleinunternehmer' });
console.log('\n=== CANADA (CA) — Kleinunternehmer ===');
assertApprox(caKlein.etsyListingPriceNoDiscount, 34.99, 'CA Klein -> etsyListingPriceNoDiscount');
assertApprox(caKlein.vatOnPurchase, 3.59, 'CA Klein -> vatOnPurchase');
assertApprox(caKlein.vatOnEtsyFees, 0.51, 'CA Klein -> vatOnEtsyFees');
assertTrue(caKlein.profit < caEinzel.profit, 'CA Klein -> profit lower than CA Einzel', `${caKlein.profit} < ${caEinzel.profit}`);

const auKlein = calculate({ ...auEinzelBase, companyType: 'kleinunternehmer' });
console.log('\n=== AUSTRALIA (AU) — Kleinunternehmer ===');
assertApprox(auKlein.etsyListingPriceNoDiscount, 34.99, 'AU Klein -> etsyListingPriceNoDiscount');
assertApprox(auKlein.vatOnPurchase, 2.64, 'AU Klein -> vatOnPurchase');
assertApprox(auKlein.vatOnEtsyFees, 0.51, 'AU Klein -> vatOnEtsyFees');
assertTrue(auKlein.profit < auEinzel.profit, 'AU Klein -> profit lower than AU Einzel', `${auKlein.profit} < ${auEinzel.profit}`);

const euKlein = calculate({ ...euEinzelBase, companyType: 'kleinunternehmer' });
console.log('\n=== EUROPE (EU) — Kleinunternehmer ===');
assertApprox(euKlein.etsyListingPriceNoDiscount, 17.99, 'EU Klein -> etsyListingPriceNoDiscount');
assertApprox(euKlein.vatOnSales, 0, 'EU Klein -> vatOnSales');
assertApprox(euKlein.vatOnPurchase, 3.1, 'EU Klein -> vatOnPurchase');
assertApprox(euKlein.vatOnEtsyFees, 0.51, 'EU Klein -> vatOnEtsyFees');
assertTrue(euKlein.profit < euEinzel.profit, 'EU Klein -> profit lower than EU Einzel', `${euKlein.profit} < ${euEinzel.profit}`);

// ---------------------------------------------------------------------------
// EDGE CASES
// ---------------------------------------------------------------------------
console.log('\n=== EDGE CASES ===');

const deAdsOn = calculate({ ...deEinzelBase, offsiteAds: true });
assertApprox(deAdsOn.offsiteAdsFee, 3.15, 'Edge -> DE Einzel offsiteAdsFee');
assertTrue(deAdsOn.profit < 5.32, 'Edge -> DE Einzel profit lower than 5.32', `${deAdsOn.profit} < 5.32`);

const lossScenario = calculate({
  sellingPrice: 5.0,
  shippingPrice: 0,
  purchasePrice: 12.98,
  purchaseShipping: 0,
  discountPercent: 0,
  offsiteAds: false,
  country: 'DE',
  companyType: 'einzelunternehmer',
});
assertTrue(lossScenario.profit < 0, 'Edge -> loss scenario profit negative', `profit=${lossScenario.profit}`);
assertTrue(lossScenario.profitMargin < 0, 'Edge -> loss scenario profitMargin negative', `margin=${lossScenario.profitMargin}`);

const zeroScenario = calculate({
  sellingPrice: 0,
  shippingPrice: 0,
  purchasePrice: 0,
  purchaseShipping: 0,
  discountPercent: 0,
  offsiteAds: false,
  country: 'DE',
  companyType: 'einzelunternehmer',
});

for (const [key, value] of Object.entries(zeroScenario)) {
  const isValidNumber = typeof value === 'number' && Number.isFinite(value);
  assertTrue(isValidNumber, `Edge -> zero inputs valid number for ${key}`, `value=${value}`);
}
assertApprox(zeroScenario.processingFee, 0.3, 'Edge -> zero inputs processingFee fixed');

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
console.log('\n=== TEST SUMMARY ===');
console.log(`Total assertions: ${total}`);
console.log(`Failures: ${failures}`);
console.log(`Result: ${failures === 0 ? 'PASS' : 'FAIL'}`);

if (failures > 0) {
  process.exitCode = 1;
}
