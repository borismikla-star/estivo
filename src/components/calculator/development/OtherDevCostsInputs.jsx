
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function OtherDevCostsInputs({ data, language, onChange }) {
  const t = { 
    sk: { 
      management: "Projektový manažment (€)",
      contingency: "Prevádzková rezerva (%)"
    }, 
    en: { 
      management: "Project Management (€)",
      contingency: "Operational Contingency (%)"
    } 
  }[language];

  const handleChange = (field, value) => {
    onChange({ [field]: parseFloat(value) || 0 });
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label>{t.management}</Label>
        <Input type="number" value={data.projectManagementCost || ""} onChange={(e) => handleChange('projectManagementCost', e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>{t.contingency}</Label>
        <Input type="number" value={data.operationalContingencyPercent || ""} onChange={(e) => handleChange('operationalContingencyPercent', e.target.value)} />
      </div>
    </div>
  );
}
