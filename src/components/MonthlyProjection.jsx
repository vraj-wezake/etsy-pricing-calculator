export default function MonthlyProjection({ results, inputs, currencySymbol, t }) {
  const fmt = (v) => (typeof v === 'number' ? v : 0).toFixed(2);

  const units = inputs.monthlyUnits || 0;
  const grossRevenue = results.totalRevenue * units;
  const totalCosts = results.totalCosts * units;
  const netIncome = results.profit * units;
  const margin = results.profitMargin;
  const netPositive = netIncome > 0;

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-coral-500 inline-block" /> {t.monthly_section}
      </h3>
      <div className="bg-gray-50 rounded-xl p-4 max-[480px]:p-3">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 text-center">
          {t.monthly_summary}
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-sm">
          <div className="min-h-[44px] flex flex-col justify-center">
            <p className="text-gray-500 text-xs mb-1">{t.projected_sales}</p>
            <p className="font-bold text-gray-900">
              {units} {t.units_suffix}
            </p>
          </div>
          <div className="min-h-[44px] flex flex-col justify-center">
            <p className="text-gray-500 text-xs mb-1">{t.gross_revenue}</p>
            <p className="font-bold text-gray-900">
              {currencySymbol}
              {fmt(grossRevenue)}
            </p>
          </div>
          <div className="min-h-[44px] flex flex-col justify-center">
            <p className="text-gray-500 text-xs mb-1">{t.total_costs_label}</p>
            <p className="font-bold text-gray-900">
              {currencySymbol}
              {fmt(totalCosts)}
            </p>
          </div>
          <div className="min-h-[44px] flex flex-col justify-center">
            <p className="text-gray-500 text-xs mb-1">{t.total_etsy_fees}</p>
            <p className="font-bold text-gray-900">
              {currencySymbol}
              {fmt(results.totalEtsyFees * units)}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-200 grid grid-cols-2 gap-3 text-center">
          <div className="min-h-[44px] flex flex-col justify-center">
            <p className="text-gray-500 text-xs mb-1">{t.net_monthly_income}</p>
            <p className={`text-lg font-bold ${netPositive ? 'text-green-600' : 'text-red-600'}`}>
              {currencySymbol}
              {fmt(netIncome)}
            </p>
          </div>
          <div className="min-h-[44px] flex flex-col justify-center">
            <p className="text-gray-500 text-xs mb-1">{t.profit_margin}</p>
            <p className={`text-lg font-bold ${netPositive ? 'text-green-600' : 'text-red-600'}`}>
              {margin}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
