
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function ConstructionInputs({ data, language, onChange }) {
  const t = { 
    sk: { 
      gfa: "Hrubá podlažná plocha (GFA) (m²)",
      nsa: "Čistá predajná plocha (NSA) (m²)",
      built_area: "Celková zastavaná plocha (m²)",
      cost_gfa: "Stavebné náklady (€/m² GFA)", 
      connections: "Náklady na prípojky (€)",
      landscaping: "Sadové úpravy a terén (€)",
      other: "Ostatné stavebné náklady (€)",
      contingency: "Stavebná rezerva (%)", 
      duration: "Dĺžka výstavby (mesiace)" 
    }, 
    en: { 
      gfa: "Gross Floor Area (GFA) (m²)",
      nsa: "Net Saleable Area (NSA) (m²)",
      built_area: "Total Built-up Area (m²)",
      cost_gfa: "Construction Cost (€/m² GFA)", 
      connections: "Connections Cost (€)",
      landscaping: "Landscaping & Terrain (€)",
      other: "Other Construction Costs (€)",
      contingency: "Construction Contingency (%)", 
      duration: "Construction Duration (months)" 
    } 
  }[language];

  const handleChange = (field, value) => {
    onChange({ [field]: parseFloat(value) || 0 });
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="space-y-2"><Label>{t.gfa}</Label><Input type="number" value={data.buildable_area_m2 || ""} onChange={(e) => handleChange('buildable_area_m2', e.target.value)} /></div>
      <div className="space-y-2"><Label>{t.nsa}</Label><Input type="number" value={data.netSaleableArea || ""} onChange={(e) => handleChange('netSaleableArea', e.target.value)} /></div>
      <div className="space-y-2"><Label>{t.built_area}</Label><Input type="number" value={data.totalBuiltUpArea || ""} onChange={(e) => handleChange('totalBuiltUpArea', e.target.value)} /></div>
      <div className="space-y-2"><Label>{t.cost_gfa}</Label><Input type="number" value={data.construction_cost_per_m2 || ""} onChange={(e) => handleChange('construction_cost_per_m2', e.target.value)} /></div>
      <div className="space-y-2"><Label>{t.connections}</Label><Input type="number" value={data.connectionsCost || ""} onChange={(e) => handleChange('connectionsCost', e.target.value)} /></div>
      <div className="space-y-2"><Label>{t.landscaping}</Label><Input type="number" value={data.landscapingCost || ""} onChange={(e) => handleChange('landscapingCost', e.target.value)} /></div>
      <div className="space-y-2"><Label>{t.other}</Label><Input type="number" value={data.otherConstructionCosts || ""} onChange={(e) => handleChange('otherConstructionCosts', e.target.value)} /></div>
      <div className="space-y-2"><Label>{t.contingency}</Label><Input type="number" value={data.contingency_percent || ""} onChange={(e) => handleChange('contingency_percent', e.target.value)} /></div>
      <div className="space-y-2"><Label>{t.duration}</Label><Input type="number" value={data.construction_duration_months || ""} onChange={(e) => handleChange('construction_duration_months', e.target.value)} /></div>
    </div>
  );
}
