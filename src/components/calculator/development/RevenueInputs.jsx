
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { currencyFormatter } from '../../lib/formatters';

export default function RevenueInputs({ data, projectData, language, onChange }) {
  const translations = {
    sk: {
      title: "Príjmová časť",
      apartments_unit: "Byty - jednotková cena (€/m²)",
      non_residential_unit: "Nebytové priestory - jednotková cena (€/m²)",
      parking_indoor_unit: "Kryté parkovacie státia - jednotková cena (€/ks)",
      parking_outdoor_unit: "Vonkajšie parkovacie státia - jednotková cena (€/ks)",
      balconies_unit: "Balkóny/Loggie/Terasy - jednotková cena (€/m²)",
      gardens_unit: "Predzáhradky - jednotková cena (€/m²)",
      basements_unit: "Pivnice - jednotková cena (€/m²)",
      other_revenue: "Ostatné príjmy (€)",
      result: "Výsledok",
    },
    en: {
      title: "Revenue Section",
      apartments_unit: "Apartments - Unit Price (€/m²)",
      non_residential_unit: "Non-Residential - Unit Price (€/m²)",
      parking_indoor_unit: "Interior Parking - Unit Price (€/pcs)",
      parking_outdoor_unit: "Exterior Parking - Unit Price (€/pcs)",
      balconies_unit: "Balconies/Loggias/Terraces - Unit Price (€/m²)",
      gardens_unit: "Front Gardens - Unit Price (€/m²)",
      basements_unit: "Basements - Unit Price (€/m²)",
      other_revenue: "Other Revenue (€)",
      result: "Result",
    },
    pl: {
      title: "Część przychodowa",
      apartments_unit: "Mieszkania - cena jednostkowa (€/m²)",
      non_residential_unit: "Lokale użytkowe - cena jednostkowa (€/m²)",
      parking_indoor_unit: "Miejsca parkingowe kryte - cena jednostkowa (€/szt.)",
      parking_outdoor_unit: "Miejsca parkingowe zewnętrzne - cena jednostkowa (€/szt.)",
      balconies_unit: "Balkony/Loggie/Tarasy - cena jednostkowa (€/m²)",
      gardens_unit: "Ogródki - cena jednostkowa (€/m²)",
      basements_unit: "Piwnice - cena jednostkowa (€/m²)",
      other_revenue: "Inne przychody (€)",
      result: "Wynik",
    },
    hu: {
      title: "Bevételi szakasz",
      apartments_unit: "Lakások - egységár (€/m²)",
      non_residential_unit: "Nem lakás célú - egységár (€/m²)",
      parking_indoor_unit: "Fedett parkolók - egységár (€/db)",
      parking_outdoor_unit: "Kültéri parkolók - egységár (€/db)",
      balconies_unit: "Erkélyek/Loggiák/Teraszok - egységár (€/m²)",
      gardens_unit: "Előkertek - egységár (€/m²)",
      basements_unit: "Pincék - egységár (€/m²)",
      other_revenue: "Egyéb bevétel (€)",
      result: "Eredmény",
    },
    de: {
      title: "Ertragsabschnitt",
      apartments_unit: "Wohnungen - Einheitspreis (€/m²)",
      non_residential_unit: "Gewerbe - Einheitspreis (€/m²)",
      parking_indoor_unit: "Überdachte Parkplätze - Einheitspreis (€/Stk.)",
      parking_outdoor_unit: "Außenparkplätze - Einheitspreis (€/Stk.)",
      balconies_unit: "Balkone/Loggien/Terrassen - Einheitspreis (€/m²)",
      gardens_unit: "Vorgärten - Einheitspreis (€/m²)",
      basements_unit: "Keller - Einheitspreis (€/m²)",
      other_revenue: "Sonstige Einnahmen (€)",
      result: "Ergebnis",
    }
  };

  const t = translations[language] || translations.en;
  const safeData = data || {};
  const safeProjectData = projectData || {};

  const apartmentsRevenue = (safeProjectData.sales_area_apartments || 0) * (safeData.apartments_unit_price || 0);
  const nonResidentialRevenue = (safeProjectData.sales_area_non_residential || 0) * (safeData.non_residential_unit_price || 0);
  const parkingIndoorRevenue = (safeProjectData.parking_indoor_count || 0) * (safeData.parking_indoor_unit_price || 0);
  const parkingOutdoorRevenue = (safeProjectData.parking_outdoor_count || 0) * (safeData.parking_outdoor_unit_price || 0);
  const balconiesRevenue = (safeProjectData.sales_area_balconies || 0) * (safeData.balconies_unit_price || 0);
  const gardensRevenue = (safeProjectData.sales_area_gardens || 0) * (safeData.gardens_unit_price || 0);
  const basementsRevenue = (safeProjectData.basement_area || 0) * (safeData.basements_unit_price || 0);

  const handleChange = (field, value) => {
    onChange({ ...safeData, [field]: parseFloat(value) || 0 });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">{t.title}</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>{t.apartments_unit}</Label>
          <Input 
            type="number" 
            value={safeData.apartments_unit_price || ""} 
            onChange={(e) => handleChange('apartments_unit_price', e.target.value)} 
          />
          <p className="text-sm text-muted-foreground">{t.result}: {currencyFormatter(apartmentsRevenue, 'EUR', '€', 2)}</p>
        </div>

        <div className="space-y-2">
          <Label>{t.non_residential_unit}</Label>
          <Input 
            type="number" 
            value={safeData.non_residential_unit_price || ""} 
            onChange={(e) => handleChange('non_residential_unit_price', e.target.value)} 
          />
          <p className="text-sm text-muted-foreground">{t.result}: {currencyFormatter(nonResidentialRevenue, 'EUR', '€', 2)}</p>
        </div>

        <div className="space-y-2">
          <Label>{t.parking_indoor_unit}</Label>
          <Input 
            type="number" 
            value={safeData.parking_indoor_unit_price || ""} 
            onChange={(e) => handleChange('parking_indoor_unit_price', e.target.value)} 
          />
          <p className="text-sm text-muted-foreground">{t.result}: {currencyFormatter(parkingIndoorRevenue, 'EUR', '€', 2)}</p>
        </div>

        <div className="space-y-2">
          <Label>{t.parking_outdoor_unit}</Label>
          <Input 
            type="number" 
            value={safeData.parking_outdoor_unit_price || ""} 
            onChange={(e) => handleChange('parking_outdoor_unit_price', e.target.value)} 
          />
          <p className="text-sm text-muted-foreground">{t.result}: {currencyFormatter(parkingOutdoorRevenue, 'EUR', '€', 2)}</p>
        </div>

        <div className="space-y-2">
          <Label>{t.balconies_unit}</Label>
          <Input 
            type="number" 
            value={safeData.balconies_unit_price || ""} 
            onChange={(e) => handleChange('balconies_unit_price', e.target.value)} 
          />
          <p className="text-sm text-muted-foreground">{t.result}: {currencyFormatter(balconiesRevenue, 'EUR', '€', 2)}</p>
        </div>

        <div className="space-y-2">
          <Label>{t.gardens_unit}</Label>
          <Input 
            type="number" 
            value={safeData.gardens_unit_price || ""} 
            onChange={(e) => handleChange('gardens_unit_price', e.target.value)} 
          />
          <p className="text-sm text-muted-foreground">{t.result}: {currencyFormatter(gardensRevenue, 'EUR', '€', 2)}</p>
        </div>

        <div className="space-y-2">
          <Label>{t.basements_unit}</Label>
          <Input 
            type="number" 
            value={safeData.basements_unit_price || ""} 
            onChange={(e) => handleChange('basements_unit_price', e.target.value)} 
          />
          <p className="text-sm text-muted-foreground">{t.result}: {currencyFormatter(basementsRevenue, 'EUR', '€', 2)}</p>
        </div>

        <div className="space-y-2">
          <Label>{t.other_revenue}</Label>
          <Input 
            type="number" 
            value={safeData.other_revenue || ""} 
            onChange={(e) => handleChange('other_revenue', e.target.value)} 
            placeholder="0"
          />
          <p className="text-sm text-muted-foreground">{t.result}: {currencyFormatter(safeData.other_revenue || 0, 'EUR', '€', 2)}</p>
        </div>
      </div>
    </div>
  );
}
