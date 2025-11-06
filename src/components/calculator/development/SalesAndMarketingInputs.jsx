
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function SalesAndMarketingInputs({ data, language, onChange }) {
  const t = { 
    sk: { 
      price: "Priemerná predajná cena (€/m² NSA)", 
      duration: "Dĺžka predaja (mesiace)",
      mkt_percent: "Náklady na marketing (%)",
      mkt_fixed: "Náklady na marketing (fixné) (€)",
      com_percent: "Provízia z predaja (%)",
      com_fixed: "Provízia z predaja (fixná) (€)",
      legal: "Právne služby a zmluvy (€)",
      other: "Ostatné náklady na predaj (€)"
    }, 
    en: { 
      price: "Average Sale Price (€/m² NSA)", 
      duration: "Sales Duration (months)",
      mkt_percent: "Marketing Costs (%)",
      mkt_fixed: "Marketing Costs (fixed) (€)",
      com_percent: "Sales Commission (%)",
      com_fixed: "Sales Commission (fixed) (€)",
      legal: "Legal Services & Contracts (€)",
      other: "Other Sales Costs (€)"
    } 
  }[language];
  
  const handleChange = (field, value) => {
    onChange({ [field]: parseFloat(value) || 0 });
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="space-y-2"><Label>{t.price}</Label><Input type="number" value={data.avg_sale_price_per_m2 || ""} onChange={(e) => handleChange('avg_sale_price_per_m2', e.target.value)} /></div>
      <div className="space-y-2"><Label>{t.duration}</Label><Input type="number" value={data.sales_duration_months || ""} onChange={(e) => handleChange('sales_duration_months', e.target.value)} /></div>
      <div className="space-y-2"><Label>{t.mkt_percent}</Label><Input type="number" value={data.marketingCostPercent || ""} onChange={(e) => handleChange('marketingCostPercent', e.target.value)} /></div>
      <div className="space-y-2"><Label>{t.mkt_fixed}</Label><Input type="number" value={data.marketingCostFixed || ""} onChange={(e) => handleChange('marketingCostFixed', e.target.value)} /></div>
      <div className="space-y-2"><Label>{t.com_percent}</Label><Input type="number" value={data.selling_costs_percent || ""} onChange={(e) => handleChange('selling_costs_percent', e.target.value)} /></div>
      <div className="space-y-2"><Label>{t.com_fixed}</Label><Input type="number" value={data.salesCommissionFixed || ""} onChange={(e) => handleChange('salesCommissionFixed', e.target.value)} /></div>
      <div className="space-y-2"><Label>{t.legal}</Label><Input type="number" value={data.legalServicesCost || ""} onChange={(e) => handleChange('legalServicesCost', e.target.value)} /></div>
      <div className="space-y-2"><Label>{t.other}</Label><Input type="number" value={data.otherSalesCosts || ""} onChange={(e) => handleChange('otherSalesCosts', e.target.value)} /></div>
    </div>
  );
}
