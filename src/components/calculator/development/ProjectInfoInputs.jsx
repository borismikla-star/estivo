
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function ProjectInfoInputs({ data, language, onChange }) {
  const translations = {
    sk: {
      title: "Základné údaje projektu",
      total_land_area: "Celková plocha pozemku (m²)",
      building_area: "Zastavaná plocha (m²)",
      gfa_above: "Hrubá podlažná plocha nadzemných podlaží (m²)",
      gfa_below: "Hrubá podlažná plocha podzemných podlaží (m²)",
      nfa_above: "Čistá úžitková plocha nadzemných podlaží (m²)",
      nfa_below: "Čistá úžitková plocha podzemných podlaží (m²)",
      sales_area_apartments: "Predajná plocha bytov (m²)",
      sales_area_non_residential: "Predajná plocha nebytových priestorov (m²)",
      sales_area_balconies: "Predajná plocha balkónov/lodžií/terás (m²)",
      sales_area_gardens: "Predajná plocha predzáhradiek (m²)",
      parking_indoor_count: "Kryté parkovacie státia (ks)",
      parking_outdoor_count: "Vonkajšie parkovacie státia (ks)",
      paved_areas: "Spevnené plochy (m²)",
      green_areas_terrain: "Zelené plochy na teréne (m²)",
      green_areas_structure: "Zelené plochy na konštrukcii (m²)",
      basement_area: "Plocha pivníc (m²)",
    },
    en: {
      title: "Basic Project Data",
      total_land_area: "Total Land Area (m²)",
      building_area: "Building Area (m²)",
      gfa_above: "Gross Floor Area Above Ground (m²)",
      gfa_below: "Gross Floor Area Below Ground (m²)",
      nfa_above: "Net Usable Area Above Ground (m²)",
      nfa_below: "Net Usable Area Below Ground (m²)",
      sales_area_apartments: "Sales Area of Apartments (m²)",
      sales_area_non_residential: "Sales Area of Non-Residential Premises (m²)",
      sales_area_balconies: "Sales Area of Balconies/Loggias/Terraces (m²)",
      sales_area_gardens: "Sales Area of Front Gardens (m²)",
      parking_indoor_count: "Interior Parking Spaces (pcs)",
      parking_outdoor_count: "Exterior Parking Spaces (pcs)",
      paved_areas: "Paved Areas (m²)",
      green_areas_terrain: "Green Areas on Terrain (m²)",
      green_areas_structure: "Green Areas on Structure (m²)",
      basement_area: "Basement Area (m²)",
    },
    pl: {
      title: "Podstawowe dane projektu",
      total_land_area: "Całkowita powierzchnia działki (m²)",
      building_area: "Powierzchnia zabudowy (m²)",
      gfa_above: "Powierzchnia brutto nadziemna (m²)",
      gfa_below: "Powierzchnia brutto podziemna (m²)",
      nfa_above: "Powierzchnia użytkowa nadziemna (m²)",
      nfa_below: "Powierzchnia użytkowa podziemna (m²)",
      sales_area_apartments: "Powierzchnia sprzedaży mieszkań (m²)",
      sales_area_non_residential: "Powierzchnia sprzedaży lokali użytkowych (m²)",
      sales_area_balconies: "Powierzchnia sprzedaży balkonów/loggi/tarasów (m²)",
      sales_area_gardens: "Powierzchnia sprzedaży ogródków (m²)",
      parking_indoor_count: "Miejsca parkingowe kryte (szt.)",
      parking_outdoor_count: "Miejsca parkingowe zewnętrzne (szt.)",
      paved_areas: "Powierzchnie utwardzone (m²)",
      green_areas_terrain: "Tereny zielone na gruncie (m²)",
      green_areas_structure: "Tereny zielone na konstrukcji (m²)",
      basement_area: "Powierzchnia piwnic (m²)",
    },
    hu: {
      title: "Alapvető projekt adatok",
      total_land_area: "Teljes telekterület (m²)",
      building_area: "Beépített terület (m²)",
      gfa_above: "Bruttó alapterület földszint felett (m²)",
      gfa_below: "Bruttó alapterület földszint alatt (m²)",
      nfa_above: "Nettó hasznos terület földszint felett (m²)",
      nfa_below: "Nettó hasznos terület földszint alatt (m²)",
      sales_area_apartments: "Lakások eladási területe (m²)",
      sales_area_non_residential: "Nem lakás célú helyiségek eladási területe (m²)",
      sales_area_balconies: "Erkélyek/loggiák/teraszok eladási területe (m²)",
      sales_area_gardens: "Előkertek eladási területe (m²)",
      parking_indoor_count: "Fedett parkolóhelyek (db)",
      parking_outdoor_count: "Kültéri parkolóhelyek (db)",
      paved_areas: "Burkolt területek (m²)",
      green_areas_terrain: "Zöldterületek terepen (m²)",
      green_areas_structure: "Zöldterületek szerkezeten (m²)",
      basement_area: "Pinceterület (m²)",
    },
    de: {
      title: "Grundlegende Projektdaten",
      total_land_area: "Gesamte Grundstücksfläche (m²)",
      building_area: "Bebaute Fläche (m²)",
      gfa_above: "Brutto-Grundfläche oberirdisch (m²)",
      gfa_below: "Brutto-Grundfläche unterirdisch (m²)",
      nfa_above: "Netto-Nutzfläche oberirdisch (m²)",
      nfa_below: "Netto-Nutzfläche unterirdisch (m²)",
      sales_area_apartments: "Verkaufsfläche Wohnungen (m²)",
      sales_area_non_residential: "Verkaufsfläche Gewerbe (m²)",
      sales_area_balconies: "Verkaufsfläche Balkone/Loggien/Terrassen (m²)",
      sales_area_gardens: "Verkaufsfläche Vorgärten (m²)",
      parking_indoor_count: "Überdachte Stellplätze (Stk.)",
      parking_outdoor_count: "Außenstellplätze (Stk.)",
      paved_areas: "Befestigte Flächen (m²)",
      green_areas_terrain: "Grünflächen auf Terrain (m²)",
      green_areas_structure: "Grünflächen auf Konstruktion (m²)",
      basement_area: "Kellerfläche (m²)",
    }
  };

  const t = translations[language] || translations.en;
  const safeData = data || {};

  const handleChange = (field, value) => {
    onChange({ ...safeData, [field]: parseFloat(value) || 0 });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">{t.title}</h3>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="total_land_area">{t.total_land_area} <span className="text-destructive">*</span></Label>
          <Input 
            id="total_land_area"
            type="number" 
            min="0"
            step="0.01"
            value={safeData.total_land_area || ""} 
            onChange={(e) => handleChange('total_land_area', e.target.value)} 
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="building_area">{t.building_area}</Label>
          <Input 
            id="building_area"
            type="number" 
            min="0"
            step="0.01"
            value={safeData.building_area || ""} 
            onChange={(e) => handleChange('building_area', e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gfa_above">{t.gfa_above} <span className="text-destructive">*</span></Label>
          <Input 
            id="gfa_above"
            type="number" 
            min="0"
            step="0.01"
            value={safeData.gfa_above || ""} 
            onChange={(e) => handleChange('gfa_above', e.target.value)} 
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gfa_below">{t.gfa_below}</Label>
          <Input 
            id="gfa_below"
            type="number" 
            min="0"
            step="0.01"
            value={safeData.gfa_below || ""} 
            onChange={(e) => handleChange('gfa_below', e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nfa_above">{t.nfa_above}</Label>
          <Input 
            id="nfa_above"
            type="number" 
            min="0"
            step="0.01"
            value={safeData.nfa_above || ""} 
            onChange={(e) => handleChange('nfa_above', e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nfa_below">{t.nfa_below}</Label>
          <Input 
            id="nfa_below"
            type="number" 
            min="0"
            step="0.01"
            value={safeData.nfa_below || ""} 
            onChange={(e) => handleChange('nfa_below', e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sales_area_apartments">{t.sales_area_apartments} <span className="text-destructive">*</span></Label>
          <Input 
            id="sales_area_apartments"
            type="number" 
            min="0"
            step="0.01"
            value={safeData.sales_area_apartments || ""} 
            onChange={(e) => handleChange('sales_area_apartments', e.target.value)} 
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sales_area_non_residential">{t.sales_area_non_residential}</Label>
          <Input 
            id="sales_area_non_residential"
            type="number" 
            min="0"
            step="0.01"
            value={safeData.sales_area_non_residential || ""} 
            onChange={(e) => handleChange('sales_area_non_residential', e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sales_area_balconies">{t.sales_area_balconies}</Label>
          <Input 
            id="sales_area_balconies"
            type="number" 
            min="0"
            step="0.01"
            value={safeData.sales_area_balconies || ""} 
            onChange={(e) => handleChange('sales_area_balconies', e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sales_area_gardens">{t.sales_area_gardens}</Label>
          <Input 
            id="sales_area_gardens"
            type="number" 
            min="0"
            step="0.01"
            value={safeData.sales_area_gardens || ""} 
            onChange={(e) => handleChange('sales_area_gardens', e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="parking_indoor_count">{t.parking_indoor_count}</Label>
          <Input 
            id="parking_indoor_count"
            type="number" 
            min="0"
            step="1"
            value={safeData.parking_indoor_count || ""} 
            onChange={(e) => handleChange('parking_indoor_count', e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="parking_outdoor_count">{t.parking_outdoor_count}</Label>
          <Input 
            id="parking_outdoor_count"
            type="number" 
            min="0"
            step="1"
            value={safeData.parking_outdoor_count || ""} 
            onChange={(e) => handleChange('parking_outdoor_count', e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="paved_areas">{t.paved_areas}</Label>
          <Input 
            id="paved_areas"
            type="number" 
            min="0"
            step="0.01"
            value={safeData.paved_areas || ""} 
            onChange={(e) => handleChange('paved_areas', e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="green_areas_terrain">{t.green_areas_terrain}</Label>
          <Input 
            id="green_areas_terrain"
            type="number" 
            min="0"
            step="0.01"
            value={safeData.green_areas_terrain || ""} 
            onChange={(e) => handleChange('green_areas_terrain', e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="green_areas_structure">{t.green_areas_structure}</Label>
          <Input 
            id="green_areas_structure"
            type="number" 
            min="0"
            step="0.01"
            value={safeData.green_areas_structure || ""} 
            onChange={(e) => handleChange('green_areas_structure', e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="basement_area">{t.basement_area}</Label>
          <Input 
            id="basement_area"
            type="number" 
            min="0"
            step="0.01"
            value={safeData.basement_area || ""} 
            onChange={(e) => handleChange('basement_area', e.target.value)} 
          />
        </div>
      </div>
    </div>
  );
}
