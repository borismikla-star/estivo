
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function LandInputs({ data, language, onChange }) {
  const t = { 
    sk: { 
      land_price: "Kúpna cena pozemku (€)", 
      land_size: "Celková plocha pozemku (m²)", 
      cadastral_fee: "Poplatok za kataster (€)",
      land_tax: "Daň z nehnuteľnosti za pozemok (€)",
      other_costs: "Ostatné náklady na pozemok (€)", // Changed key
      demolition: "Náklady na demoláciu (€)",
      land_preparation: "Náklady na prípravu územia (€)", // Changed key
      connection_points: "Náklady na prípojný bod (€)", // Changed key
      land_valuation: "Znalecský posudok (€)", // Changed key
    }, 
    en: { 
      land_price: "Land Purchase Price (€)", 
      land_size: "Total Land Area (m²)",
      cadastral_fee: "Cadastral Fee (€)",
      land_tax: "Land Property Tax (€)",
      other_costs: "Other Land Costs (€)", // Changed key
      demolition: "Demolition Costs (€)",
      land_preparation: "Land Preparation Costs (€)", // Changed key
      connection_points: "Connection Point Costs (€)", // Changed key
      land_valuation: "Land Valuation (€)", // Changed key
    },
    pl: {
      land_price: "Cena zakupu gruntu (€)",
      land_size: "Całkowita powierzchnia gruntu (m²)",
      cadastral_fee: "Opłata katastralna (€)",
      land_tax: "Podatek od nieruchomości gruntowej (€)",
      other_costs: "Inne koszty związane z gruntem (€)", // Changed key
      demolition: "Koszty rozbiórki (€)",
      land_preparation: "Koszty przygotowania terenu (€)", // Changed key
      connection_points: "Koszty punktu przyłączeniowego (€)", // Changed key
      land_valuation: "Wycena gruntu (€)", // Changed key
    },
    hu: {
      land_price: "Telek vételára (€)",
      land_size: "Teljes telekterület (m²)",
      cadastral_fee: "Kataszteri díj (€)",
      land_tax: "Telekadó (€)",
      other_costs: "Egyéb telekköltségek (€)", // Changed key
      demolition: "Bontási költségek (€)",
      land_preparation: "Terület-előkészítési költségek (€)", // Changed key
      connection_points: "Csatlakozási pont költségei (€)", // Changed key
      land_valuation: "Földértékelés (€)", // Changed key
    },
    de: {
      land_price: "Grundstückskaufpreis (€)",
      land_size: "Gesamtgrundstücksfläche (m²)",
      cadastral_fee: "Katastergebühr (€)",
      land_tax: "Grundsteuer (€)",
      other_costs: "Sonstige Grundstückskosten (€)", // Changed key
      demolition: "Abrisskosten (€)",
      land_preparation: "Grundstücksvorbereitungskosten (€)", // Changed key
      connection_points: "Anschlusspunktkosten (€)", // Changed key
      land_valuation: "Grundstücksbewertung (€)", // Changed key
    },
    it: {
      land_price: "Prezzo di acquisto del terreno (€)",
      land_size: "Superficie totale del terreno (m²)",
      cadastral_fee: "Tassa catastale (€)",
      land_tax: "Imposta immobiliare sul terreno (€)",
      other_costs: "Altre spese per il terreno (€)", // Changed key
      demolition: "Costi di demolizione (€)",
      land_preparation: "Costi di preparazione del terreno (€)", // Changed key
      connection_points: "Costi del punto di connessione (€)", // Changed key
      land_valuation: "Valutazione del terreno (€)", // Changed key
    },
    es: {
      land_price: "Precio de compra del terreno (€)",
      land_size: "Superficie total del terreno (m²)",
      cadastral_fee: "Tasa catastral (€)",
      land_tax: "Impuesto sobre bienes inmuebles del terreno (€)",
      other_costs: "Otros costos del terreno (€)", // Changed key
      demolition: "Costos de demolición (€)",
      land_preparation: "Costos de preparación del terreno (€)", // Changed key
      connection_points: "Costos del punto de conexión (€)", // Changed key
      land_valuation: "Valoración del terreno (€)", // Changed key
    },
    fr: { // Updated entirely based on outline
        land_plot: "Terrain",
        land_price: "Prix du terrain (€)", // Added euro symbol for consistency
        land_size: "Superficie du terrain (m²)",
        cadastral_fee: "Frais cadastraux (€)", // Added euro symbol for consistency
        land_tax: "Taxe foncière (€)", // Added euro symbol for consistency
        other_costs: "Autres coûts liés au terrain (€)",
        demolition: "Coûts de démolition (€)",
        land_preparation: "Préparation du terrain (€)", // Added euro symbol for consistency
        connection_points: "Points de raccordement (€)", // Added euro symbol for consistency
        land_valuation: "Évaluation du terrain (€)" // Added euro symbol for consistency
    }
  }[language];

  // Safety guard to prevent crashes if data is undefined
  const safeData = data || {};

  const handleChange = (field, value) => {
    onChange({ [field]: parseFloat(value) || 0 });
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="space-y-2">
        <Label>{t.land_price}</Label>
        <Input type="number" value={safeData.land_price || ""} onChange={(e) => handleChange('land_price', e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>{t.land_size}</Label>
        <Input type="number" value={safeData.land_size_m2 || ""} onChange={(e) => handleChange('land_size_m2', e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>{t.demolition}</Label>
        <Input type="number" value={safeData.demolitionCosts || ""} onChange={(e) => handleChange('demolitionCosts', e.target.value)} />
      </div>
       <div className="space-y-2">
        <Label>{t.land_preparation}</Label> {/* Updated label key */}
        <Input type="number" value={safeData.landPreparationCosts || ""} onChange={(e) => handleChange('landPreparationCosts', e.target.value)} />
      </div>
       <div className="space-y-2">
        <Label>{t.connection_points}</Label> {/* Updated label key */}
        <Input type="number" value={safeData.connectionPointCosts || ""} onChange={(e) => handleChange('connectionPointCosts', e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>{t.land_valuation}</Label> {/* Updated label key */}
        <Input type="number" value={safeData.landValuation || ""} onChange={(e) => handleChange('landValuation', e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>{t.cadastral_fee}</Label>
        <Input type="number" value={safeData.cadastralFee || ""} onChange={(e) => handleChange('cadastralFee', e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>{t.land_tax}</Label>
        <Input type="number" value={safeData.landTax || ""} onChange={(e) => handleChange('landTax', e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>{t.other_costs}</Label> {/* Updated label key */}
        <Input type="number" value={safeData.otherLandCosts || ""} onChange={(e) => handleChange('otherLandCosts', e.target.value)} />
      </div>
    </div>
  );
}
