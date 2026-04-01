import InfoTooltip from './InfoTooltip';
import { COUNTRIES } from '../logic/constants';

function NumberInput({ label, value, onChange, tooltip, prefix, min = 0, max, step = '0.01', disabled = false }) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {tooltip && <InfoTooltip text={tooltip} />}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{prefix}</span>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={`w-full min-h-[44px] border border-gray-300 rounded-lg py-2.5 text-sm focus:ring-2 focus:ring-coral-500 focus:border-coral-500 outline-none transition ${
            prefix ? 'pl-7 pr-3' : 'px-3'
          } ${disabled ? 'bg-gray-100 text-gray-500' : 'bg-white'}`}
        />
      </div>
    </div>
  );
}

export default function InputPanel({ inputs, onChange, onReset, currencySymbol, t, countryLabel }) {
  const update = (field) => (value) => onChange({ ...inputs, [field]: value });

  const companyTypes = [
    { value: 'einzelunternehmer', label: t.einzelunternehmer, tooltip: t.einzelunternehmer_tooltip },
    { value: 'kleinunternehmer', label: t.kleinunternehmer, tooltip: t.kleinunternehmer_tooltip },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-coral-500 inline-block" /> {t.product_details_section}
        </h3>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t.country_label}
            <InfoTooltip text={t.country_tooltip} />
          </label>
          <select
            value={inputs.country}
            onChange={(e) => onChange({ ...inputs, country: e.target.value })}
            className="w-full min-h-[44px] border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-coral-500 focus:border-coral-500 outline-none"
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {countryLabel(c.code)}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">{t.company_type_label}</label>
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            {companyTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => onChange({ ...inputs, companyType: type.value })}
                className={`flex-1 min-h-[44px] py-2 px-2 text-xs font-medium rounded-md transition-all ${
                  inputs.companyType === type.value
                    ? 'bg-white text-coral-500 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {type.label}
                <InfoTooltip text={type.tooltip} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-coral-500 inline-block" /> {t.revenue_section}
        </h3>
        <NumberInput
          label={t.item_price}
          value={inputs.sellingPrice}
          onChange={update('sellingPrice')}
          prefix={currencySymbol}
          tooltip={t.item_price_tooltip}
        />
        <NumberInput
          label={t.shipping_price}
          value={inputs.shippingPrice}
          onChange={update('shippingPrice')}
          prefix={currencySymbol}
          tooltip={t.shipping_price_tooltip}
        />

        <div className="mb-3">
          <div className="flex items-center justify-between mb-1 min-h-[44px]">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              {t.discount_label}
              <InfoTooltip text={t.discount_tooltip} />
              {inputs.discountPercent > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold text-white bg-red-500 rounded">
                  {t.sale_badge}
                </span>
              )}
            </label>
            <label className="relative inline-flex items-center cursor-pointer min-h-[44px] min-w-[44px] justify-end">
              <input
                type="checkbox"
                checked={inputs.discountPercent > 0}
                onChange={(e) => onChange({ ...inputs, discountPercent: e.target.checked ? 20 : 0 })}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-200 border border-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-coral-500 rounded-full peer peer-checked:bg-coral-500 peer-checked:border-coral-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:shadow-sm after:transition-all" />
            </label>
          </div>
          {inputs.discountPercent > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-500">{t.discount_percent_label}</span>
              <input
                type="number"
                value={inputs.discountPercent}
                onChange={(e) => {
                  let val = parseFloat(e.target.value) || 0;
                  if (val > 80) val = 80;
                  if (val < 0) val = 0;
                  onChange({ ...inputs, discountPercent: val });
                }}
                min={0}
                max={80}
                step={1}
                className="w-20 min-h-[44px] border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-coral-500 focus:border-coral-500 outline-none"
              />
              <span className="text-xs text-gray-400">%</span>
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-coral-500 inline-block" /> {t.cost_section}
        </h3>
        <NumberInput
          label={t.printify_product_cost}
          value={inputs.purchasePrice}
          onChange={update('purchasePrice')}
          prefix={currencySymbol}
          tooltip={t.printify_product_tooltip}
        />
        <NumberInput
          label={t.printify_shipping_cost}
          value={inputs.purchaseShipping}
          onChange={update('purchaseShipping')}
          prefix={currencySymbol}
          tooltip={t.printify_shipping_tooltip}
        />
        <div className="flex items-center justify-between px-3 py-2.5 min-h-[44px] bg-gray-50 rounded-lg text-sm">
          <span className="text-gray-600">{t.total_production_cost}</span>
          <span className="font-semibold text-gray-900">
            {currencySymbol}{(inputs.purchasePrice + inputs.purchaseShipping).toFixed(2)}
          </span>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-coral-500 inline-block" /> {t.etsy_fees_section}
        </h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between items-center min-h-[36px]">
            <span>{t.listing_fee}</span>
            <span className="font-medium">
              {currencySymbol}0.18
            </span>
          </div>
          <div className="flex justify-between items-center min-h-[36px]">
            <span>{t.transaction_fee}</span>
            <span className="font-medium">6.5%</span>
          </div>
          <div className="flex justify-between items-center min-h-[36px]">
            <span>{t.processing_fee}</span>
            <span className="font-medium">{t.processing_fee_display.replace('{symbol}', currencySymbol)}</span>
          </div>
          <div className="flex items-center justify-between gap-2 min-h-[44px]">
            <span className="flex items-center gap-1">
              {t.offsite_ads}
              <InfoTooltip text={t.offsite_ads_tooltip} />
            </span>
            <div className="flex items-center gap-2">
              {inputs.offsiteAds && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold text-white bg-coral-500 rounded">
                  {t.offsite_ads_percent}
                </span>
              )}
              <label className="relative inline-flex items-center cursor-pointer min-h-[44px] min-w-[44px] justify-end">
                <input
                  type="checkbox"
                  checked={inputs.offsiteAds}
                  onChange={(e) => onChange({ ...inputs, offsiteAds: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 border border-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-coral-500 rounded-full peer peer-checked:bg-coral-500 peer-checked:border-coral-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:shadow-sm after:transition-all" />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-coral-500 inline-block" /> {t.profit_settings_section}
        </h3>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t.desired_margin}
            <InfoTooltip text={t.desired_margin_tooltip} />
          </label>
          <div className="flex items-center gap-3 min-h-[44px]">
            <input
              type="range"
              min={0}
              max={80}
              value={inputs.desiredMargin}
              onChange={(e) => onChange({ ...inputs, desiredMargin: parseFloat(e.target.value) })}
              className="flex-1 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-coral-500"
            />
            <span className="text-sm font-semibold text-gray-700 w-10 text-right">{inputs.desiredMargin}%</span>
          </div>
        </div>
        <NumberInput
          label={t.monthly_sales}
          value={inputs.monthlyUnits}
          onChange={update('monthlyUnits')}
          step="1"
          tooltip={t.monthly_sales_tooltip}
        />
      </div>

      <p className="text-xs text-gray-400 text-center pt-1">{t.live_results_hint}</p>

      <div className="pt-2">
        <button
          type="button"
          onClick={onReset}
          className="w-full min-h-[44px] py-2.5 px-4 border border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition"
        >
          {t.reset_button}
        </button>
      </div>
    </div>
  );
}
