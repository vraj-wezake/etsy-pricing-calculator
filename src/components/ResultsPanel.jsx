import InfoTooltip from './InfoTooltip';

export default function ResultsPanel({ results, inputs, currencySymbol, t }) {
  const fmt = (v) => (typeof v === 'number' ? v : 0).toFixed(2);

  const isEinzel = inputs.companyType === 'einzelunternehmer';
  const isKlein = inputs.companyType === 'kleinunternehmer';
  const showVatOnSales = isEinzel && (inputs.country === 'DE' || inputs.country === 'EU');
  const showVatOnPurchase = results.vatOnPurchase > 0;
  const showVatOnFees = isKlein;
  const profitPositive = results.profit > 0;
  const hasDiscount = inputs.discountPercent > 0;

  const productionCosts = results.totalPurchaseCost + results.vatOnPurchase;
  const vatOnSalesPercent = inputs.country === 'DE' ? 19 : 21;
  const vatOnPurchasePercent =
    inputs.country === 'CA'
      ? 15
      : inputs.country === 'AU'
        ? 10
        : inputs.country === 'DE'
          ? 19
          : 21;

  const withDiscountTitle = t.with_discount_label.replace('{discount}', String(inputs.discountPercent));
  const withDiscountSub = t.with_discount_sublabel.replace('{discount}', String(inputs.discountPercent));

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-coral-500 inline-block" /> {t.results_etsy_price_title}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-coral-50 border border-coral-100 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-500 mb-1 font-medium">{t.no_discount_label}</p>
            <p className="text-2xl font-bold text-coral-500">
              {currencySymbol}{fmt(results.etsyListingPriceNoDiscount)}
            </p>
            <p className="text-[10px] text-gray-400 mt-1">{t.no_discount_sublabel}</p>
          </div>
          <div className="bg-coral-50 border border-coral-100 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-500 mb-1 font-medium">
              {hasDiscount ? withDiscountTitle : t.enter_in_etsy_when_sale}
            </p>
            <p className="text-2xl font-bold text-coral-500">
              {currencySymbol}{fmt(results.etsyListingPriceWithDiscount)}
            </p>
            <p className="text-[10px] text-gray-400 mt-1">
              {hasDiscount ? withDiscountSub : t.no_discount_active}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-coral-500 inline-block" /> {t.price_breakdown_title}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
              {t.revenue_col}
            </h4>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">{t.item_price}</span>
                <span className="font-medium">{currencySymbol}{fmt(inputs.sellingPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t.shipping_price}</span>
                <span className="font-medium">{currencySymbol}{fmt(inputs.shippingPrice)}</span>
              </div>
              {hasDiscount && (
                <div className="flex justify-between text-red-500">
                  <span>{t.discount_line.replace('{percent}', String(inputs.discountPercent))}</span>
                  <span className="font-medium">
                    -{currencySymbol}{fmt(results.totalRevenue * inputs.discountPercent / 100)}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-1.5 border-t border-gray-200">
                <span className="font-semibold text-gray-900">{t.total_price}</span>
                <span className="font-bold text-gray-900">{currencySymbol}{fmt(results.totalRevenue)}</span>
              </div>
              {showVatOnSales && (
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {t.vat_on_sales} ({vatOnSalesPercent}%)
                    <InfoTooltip text={t.vat_on_sales_tooltip} />
                  </span>
                  <span className="font-medium">{currencySymbol}{fmt(results.vatOnSales)}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
              {t.etsy_fees_col}
            </h4>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">{t.listing_fee}</span>
                <span className="font-medium">{currencySymbol}{fmt(results.listingFee)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t.transaction_fee_with_percent}</span>
                <span className="font-medium">{currencySymbol}{fmt(results.transactionFee)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t.processing_fee}</span>
                <span className="font-medium">{currencySymbol}{fmt(results.processingFee)}</span>
              </div>
              {inputs.offsiteAds && (
                <div className="flex justify-between">
                  <span className="text-gray-600">{t.offsite_ads}</span>
                  <span className="font-medium">{currencySymbol}{fmt(results.offsiteAdsFee)}</span>
                </div>
              )}
              {showVatOnFees && (
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {t.vat_on_fees} (19%)
                    <InfoTooltip text={t.vat_on_fees_tooltip} />
                  </span>
                  <span className="font-medium">{currencySymbol}{fmt(results.vatOnEtsyFees)}</span>
                </div>
              )}
              <div className="flex justify-between pt-1.5 border-t border-gray-200">
                <span className="font-semibold text-gray-900">{t.total_fees}</span>
                <span className="font-bold text-gray-900">{currencySymbol}{fmt(results.totalEtsyFees)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
            {t.costs_col}
          </h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">{t.material_cost}</span>
              <span className="font-medium">{currencySymbol}{fmt(inputs.purchasePrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t.shipping_cost}</span>
              <span className="font-medium">{currencySymbol}{fmt(inputs.purchaseShipping)}</span>
            </div>
            {showVatOnPurchase && (
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {t.vat_on_purchase} ({vatOnPurchasePercent}%)
                  <InfoTooltip text={t.vat_on_purchase_tooltip} />
                </span>
                <span className="font-medium">{currencySymbol}{fmt(results.vatOnPurchase)}</span>
              </div>
            )}
          </div>
          <div className="flex justify-between pt-1.5 mt-1.5 border-t border-gray-200 text-sm">
            <span className="font-semibold text-gray-900">{t.total_costs}</span>
            <span className="font-bold text-gray-900">{currencySymbol}{fmt(productionCosts)}</span>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
          {t.profit_section}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div
            className={`rounded-xl p-3 text-center ${
              profitPositive ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}
          >
            <p className="text-xs text-gray-500 mb-1">{t.profit_per_sale}</p>
            <p className={`text-lg font-bold ${profitPositive ? 'text-green-600' : 'text-red-600'}`}>
              {currencySymbol}{fmt(results.profit)}
            </p>
          </div>
          <div
            className={`rounded-xl p-3 text-center ${
              profitPositive ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}
          >
            <p className="text-xs text-gray-500 mb-1">{t.profit_margin}</p>
            <p className={`text-lg font-bold ${profitPositive ? 'text-green-600' : 'text-red-600'}`}>
              {results.profitMargin}%
            </p>
          </div>
          <div
            className={`rounded-xl p-3 text-center ${
              profitPositive ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}
          >
            <p className="text-xs text-gray-500 mb-1">{t.monthly_profit}</p>
            <p className={`text-lg font-bold ${profitPositive ? 'text-green-600' : 'text-red-600'}`}>
              {currencySymbol}{fmt(results.profit * (inputs.monthlyUnits || 0))}
            </p>
          </div>
        </div>

        <p className="mt-2 text-[10px] text-gray-400 leading-relaxed">
          {t.tshirt_hint} · {t.sweater_hint}
        </p>

        {!profitPositive && (
          <p className="mt-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {t.loss_warning}
          </p>
        )}

        <p className="mt-2 text-[10px] text-gray-400 leading-relaxed">
          <strong>{t.disclaimer_prefix}</strong> {t.disclaimer}
        </p>
      </div>
    </div>
  );
}
