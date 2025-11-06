import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InfoTooltip from '@/components/shared/InfoTooltip';

export default function ProjectInfoInputs({ data, language, onChange }) {
  const translations = {
    sk: {
      title: "Informácie o projekte",
      total_land_area: "Celková plocha pozemku (m²)",
      total_land_area_tooltip: "Celková rozloha pozemku určeného na výstavbu",
      building_area: "Zastavaná plocha (m²)",
      building_area_tooltip: "Plocha pozemku pokrytá budovou",
      gfa_above: "HPP nadzemné podlažia (m²)",
      gfa_above_tooltip: "Hrubá podlažná plocha všetkých nadzemných podlaží",
      gfa_below: "HPP podzemné podlažia (m²)",
      gfa_below_tooltip: "Hrubá podlažná plocha všetkých podzemných podlaží",
      nfa_above: "ČÚP nadzemné podlažia (m²)",
      nfa_above_tooltip: "Čistá úžitková plocha nadzemných podlaží",
      nfa_below: "ČÚP podzemné podlažia (m²)",
      nfa_below_tooltip: "Čistá úžitková plocha podzemných podlaží",
      sales_area_apartments: "Predajná plocha - byty (m²)",
      sales_area_apartments_tooltip: "Celková predajná plocha bytov",
      sales_area_non_residential: "Predajná plocha - nebytové priestory (m²)",
      sales_area_non_residential_tooltip: "Celková predajná plocha nebytových priestorov (obchody, kancelárie)",
      sales_area_balconies: "Predajná plocha - balkóny/terasy (m²)",
      sales_area_balconies_tooltip: "Celková predajná plocha balkónov a terás",
      sales_area_gardens: "Predajná plocha - záhrady (m²)",
      sales_area_gardens_tooltip: "Celková predajná plocha záhrad",
      parking_indoor_count: "Počet kryté parkovacie miesta",
      parking_indoor_count_tooltip: "Počet parkovacích miest v garáži/podzemí",
      parking_outdoor_count: "Počet vonkajšie parkovacie miesta",
      parking_outdoor_count_tooltip: "Počet vonkajších parkovacích miest",
      paved_areas: "Spevnené plochy (m²)",
      paved_areas_tooltip: "Plocha chodníkov, príjazdových ciest a spevnených plôch",
      green_areas_terrain: "Zeleň na teréne (m²)",
      green_areas_terrain_tooltip: "Plocha zelene na úrovni terénu",
      green_areas_structure: "Zeleň na konštrukcii (m²)",
      green_areas_structure_tooltip: "Plocha zelene na strechách alebo konštrukciách",
      basement_area: "Pivničné priestory (m²)",
      basement_area_tooltip: "Celková plocha pivničných priestorov/skladov",
    },
    en: {
      title: "Project Information",
      total_land_area: "Total Land Area (m²)",
      total_land_area_tooltip: "Total area of land designated for development",
      building_area: "Building Footprint (m²)",
      building_area_tooltip: "Area of land covered by the building",
      gfa_above: "GFA Above Ground (m²)",
      gfa_above_tooltip: "Gross Floor Area of all above-ground floors",
      gfa_below: "GFA Below Ground (m²)",
      gfa_below_tooltip: "Gross Floor Area of all below-ground floors",
      nfa_above: "NFA Above Ground (m²)",
      nfa_above_tooltip: "Net Floor Area of above-ground floors",
      nfa_below: "NFA Below Ground (m²)",
      nfa_below_tooltip: "Net Floor Area of below-ground floors",
      sales_area_apartments: "Sales Area - Apartments (m²)",
      sales_area_apartments_tooltip: "Total saleable area of apartments",
      sales_area_non_residential: "Sales Area - Non-Residential (m²)",
      sales_area_non_residential_tooltip: "Total saleable area of commercial spaces (shops, offices)",
      sales_area_balconies: "Sales Area - Balconies/Terraces (m²)",
      sales_area_balconies_tooltip: "Total saleable area of balconies and terraces",
      sales_area_gardens: "Sales Area - Gardens (m²)",
      sales_area_gardens_tooltip: "Total saleable area of gardens",
      parking_indoor_count: "Indoor Parking Spaces (qty)",
      parking_indoor_count_tooltip: "Number of parking spaces in garage/basement",
      parking_outdoor_count: "Outdoor Parking Spaces (qty)",
      parking_outdoor_count_tooltip: "Number of outdoor parking spaces",
      paved_areas: "Paved Areas (m²)",
      paved_areas_tooltip: "Area of sidewalks, driveways, and paved surfaces",
      green_areas_terrain: "Greenery on Terrain (m²)",
      green_areas_terrain_tooltip: "Area of greenery at ground level",
      green_areas_structure: "Greenery on Structure (m²)",
      green_areas_structure_tooltip: "Area of greenery on roofs or structures",
      basement_area: "Basement Storage (m²)",
      basement_area_tooltip: "Total area of basement storage units",
    },
    pl: {
      title: "Informacje o projekcie",
      total_land_area: "Całkowita powierzchnia działki (m²)",
      total_land_area_tooltip: "Całkowita powierzchnia działki przeznaczonej pod zabudowę",
      building_area: "Powierzchnia zabudowy (m²)",
      building_area_tooltip: "Powierzchnia działki zajęta przez budynek",
      gfa_above: "Powierzchnia brutto naziemna (m²)",
      gfa_above_tooltip: "Powierzchnia użytkowa brutto wszystkich kondygnacji naziemnych",
      gfa_below: "Powierzchnia brutto podziemna (m²)",
      gfa_below_tooltip: "Powierzchnia użytkowa brutto wszystkich kondygnacji podziemnych",
      nfa_above: "Powierzchnia netto naziemna (m²)",
      nfa_above_tooltip: "Powierzchnia użytkowa netto kondygnacji naziemnych",
      nfa_below: "Powierzchnia netto podziemna (m²)",
      nfa_below_tooltip: "Powierzchnia użytkowa netto kondygnacji podziemnych",
      sales_area_apartments: "Powierzchnia sprzedaży - mieszkania (m²)",
      sales_area_apartments_tooltip: "Całkowita powierzchnia sprzedaży mieszkań",
      sales_area_non_residential: "Powierzchnia sprzedaży - lokale użytkowe (m²)",
      sales_area_non_residential_tooltip: "Całkowita powierzchnia sprzedaży lokali użytkowych (sklepy, biura)",
      sales_area_balconies: "Powierzchnia sprzedaży - balkony/tarasy (m²)",
      sales_area_balconies_tooltip: "Całkowita powierzchnia sprzedaży balkonów i tarasów",
      sales_area_gardens: "Powierzchnia sprzedaży - ogrody (m²)",
      sales_area_gardens_tooltip: "Całkowita powierzchnia sprzedaży ogrodów",
      parking_indoor_count: "Miejsca parkingowe kryty (szt.)",
      parking_indoor_count_tooltip: "Liczba miejsc parkingowych w garażu/piwnicy",
      parking_outdoor_count: "Miejsca parkingowe zewnętrzne (szt.)",
      parking_outdoor_count_tooltip: "Liczba zewnętrznych miejsc parkingowych",
      paved_areas: "Powierzchnie utwardzone (m²)",
      paved_areas_tooltip: "Powierzchnia chodników, podjazdów i utwardzonych nawierzchni",
      green_areas_terrain: "Zieleń na gruncie (m²)",
      green_areas_terrain_tooltip: "Powierzchnia zieleni na poziomie gruntu",
      green_areas_structure: "Zieleń na konstrukcji (m²)",
      green_areas_structure_tooltip: "Powierzchnia zieleni na dachach lub konstrukcjach",
      basement_area: "Piwnice (m²)",
      basement_area_tooltip: "Całkowita powierzchnia piwnic/komórek lokatorskich",
    },
    hu: {
      title: "Projekt információk",
      total_land_area: "Teljes telek terület (m²)",
      total_land_area_tooltip: "A fejlesztésre kijelölt telek teljes területe",
      building_area: "Beépített terület (m²)",
      building_area_tooltip: "Az épület által lefedett területnek",
      gfa_above: "Bruttó alapterület föld felett (m²)",
      gfa_above_tooltip: "Összes föld feletti szint bruttó alapterülete",
      gfa_below: "Bruttó alapterület föld alatt (m²)",
      gfa_below_tooltip: "Összes föld alatti szint bruttó alapterülete",
      nfa_above: "Nettó alapterület föld felett (m²)",
      nfa_above_tooltip: "Föld feletti szintek nettó alapterülete",
      nfa_below: "Nettó alapterület föld alatt (m²)",
      nfa_below_tooltip: "Föld alatti szintek nettó alapterülete",
      sales_area_apartments: "Eladási terület - lakások (m²)",
      sales_area_apartments_tooltip: "Lakások összes eladható területe",
      sales_area_non_residential: "Eladási terület - nem lakás (m²)",
      sales_area_non_residential_tooltip: "Kereskedelmi helyiségek összes eladható területe (üzletek, irodák)",
      sales_area_balconies: "Eladási terület - erkélyek/teraszok (m²)",
      sales_area_balconies_tooltip: "Erkélyek és teraszok összes eladható területe",
      sales_area_gardens: "Eladási terület - kertek (m²)",
      sales_area_gardens_tooltip: "Kertek összes eladható területe",
      parking_indoor_count: "Fedett parkolóhelyek (db)",
      parking_indoor_count_tooltip: "Parkolóhelyek száma garázsban/pincében",
      parking_outdoor_count: "Kültéri parkolóhelyek (db)",
      parking_outdoor_count_tooltip: "Kültéri parkolóhelyek száma",
      paved_areas: "Burkolt területek (m²)",
      paved_areas_tooltip: "Járdák, felhajtók és burkolt felületek területe",
      green_areas_terrain: "Zöldterület terepen (m²)",
      green_areas_terrain_tooltip: "Földszinti zöldterület területe",
      green_areas_structure: "Zöldterület szerkezeten (m²)",
      green_areas_structure_tooltip: "Tetőkön vagy szerkezeteken lévő zöldterület területe",
      basement_area: "Pinceterület (m²)",
      basement_area_tooltip: "Pincék/tárolók teljes területe",
    },
    de: {
      title: "Projektinformationen",
      total_land_area: "Gesamtgrundstücksfläche (m²)",
      total_land_area_tooltip: "Gesamtfläche des für die Entwicklung vorgesehenen Grundstücks",
      building_area: "Bebauungsfläche (m²)",
      building_area_tooltip: "Vom Gebäude bedeckte Fläche",
      gfa_above: "Bruttogeschossfläche oberirdisch (m²)",
      gfa_above_tooltip: "Bruttogeschossfläche aller oberirdischen Geschosse",
      gfa_below: "Bruttogeschossfläche unterirdisch (m²)",
      gfa_below_tooltip: "Bruttogeschossfläche aller unterirdischen Geschosse",
      nfa_above: "Nettogeschossfläche oberirdisch (m²)",
      nfa_above_tooltip: "Nettogeschossfläche der oberirdischen Geschosse",
      nfa_below: "Nettogeschossfläche unterirdisch (m²)",
      nfa_below_tooltip: "Nettogeschossfläche der unterirdischen Geschosse",
      sales_area_apartments: "Verkaufsfläche - Wohnungen (m²)",
      sales_area_apartments_tooltip: "Gesamte verkäufliche Fläche der Wohnungen",
      sales_area_non_residential: "Verkaufsfläche - Gewerbe (m²)",
      sales_area_non_residential_tooltip: "Gesamte verkäufliche Fläche von Gewerbeflächen (Geschäfte, Büros)",
      sales_area_balconies: "Verkaufsfläche - Balkone/Terrassen (m²)",
      sales_area_balconies_tooltip: "Gesamte verkäufliche Fläche von Balkonen und Terrassen",
      sales_area_gardens: "Verkaufsfläche - Gärten (m²)",
      sales_area_gardens_tooltip: "Gesamte verkäufliche Fläche von Gärten",
      parking_indoor_count: "Überdachte Parkplätze (Anz.)",
      parking_indoor_count_tooltip: "Anzahl der Parkplätze in Garage/Keller",
      parking_outdoor_count: "Außenparkplätze (Anz.)",
      parking_outdoor_count_tooltip: "Anzahl der Außenparkplätze",
      paved_areas: "Befestigte Flächen (m²)",
      paved_areas_tooltip: "Fläche von Gehwegen, Zufahrten und befestigten Oberflächen",
      green_areas_terrain: "Grünflächen auf Gelände (m²)",
      green_areas_terrain_tooltip: "Grünfläche auf Bodenniveau",
      green_areas_structure: "Grünflächen auf Struktur (m²)",
      green_areas_structure_tooltip: "Grünfläche auf Dächern oder Strukturen",
      basement_area: "Kellerräume (m²)",
      basement_area_tooltip: "Gesamtfläche der Kellerräume/Abstellräume",
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
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="total_land_area" className="flex items-center gap-2">
            {t.total_land_area} <span className="text-destructive">*</span>
            <InfoTooltip content={t.total_land_area_tooltip} />
          </Label>
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
          <Label htmlFor="building_area" className="flex items-center gap-2">
            {t.building_area}
            <InfoTooltip content={t.building_area_tooltip} />
          </Label>
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
          <Label htmlFor="gfa_above" className="flex items-center gap-2">
            {t.gfa_above} <span className="text-destructive">*</span>
            <InfoTooltip content={t.gfa_above_tooltip} />
          </Label>
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
          <Label htmlFor="gfa_below" className="flex items-center gap-2">
            {t.gfa_below}
            <InfoTooltip content={t.gfa_below_tooltip} />
          </Label>
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
          <Label htmlFor="nfa_above" className="flex items-center gap-2">
            {t.nfa_above}
            <InfoTooltip content={t.nfa_above_tooltip} />
          </Label>
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
          <Label htmlFor="nfa_below" className="flex items-center gap-2">
            {t.nfa_below}
            <InfoTooltip content={t.nfa_below_tooltip} />
          </Label>
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
          <Label htmlFor="sales_area_apartments" className="flex items-center gap-2">
            {t.sales_area_apartments} <span className="text-destructive">*</span>
            <InfoTooltip content={t.sales_area_apartments_tooltip} />
          </Label>
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
          <Label htmlFor="sales_area_non_residential" className="flex items-center gap-2">
            {t.sales_area_non_residential}
            <InfoTooltip content={t.sales_area_non_residential_tooltip} />
          </Label>
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
          <Label htmlFor="sales_area_balconies" className="flex items-center gap-2">
            {t.sales_area_balconies}
            <InfoTooltip content={t.sales_area_balconies_tooltip} />
          </Label>
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
          <Label htmlFor="sales_area_gardens" className="flex items-center gap-2">
            {t.sales_area_gardens}
            <InfoTooltip content={t.sales_area_gardens_tooltip} />
          </Label>
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
          <Label htmlFor="parking_indoor_count" className="flex items-center gap-2">
            {t.parking_indoor_count}
            <InfoTooltip content={t.parking_indoor_count_tooltip} />
          </Label>
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
          <Label htmlFor="parking_outdoor_count" className="flex items-center gap-2">
            {t.parking_outdoor_count}
            <InfoTooltip content={t.parking_outdoor_count_tooltip} />
          </Label>
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
          <Label htmlFor="paved_areas" className="flex items-center gap-2">
            {t.paved_areas}
            <InfoTooltip content={t.paved_areas_tooltip} />
          </Label>
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
          <Label htmlFor="green_areas_terrain" className="flex items-center gap-2">
            {t.green_areas_terrain}
            <InfoTooltip content={t.green_areas_terrain_tooltip} />
          </Label>
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
          <Label htmlFor="green_areas_structure" className="flex items-center gap-2">
            {t.green_areas_structure}
            <InfoTooltip content={t.green_areas_structure_tooltip} />
          </Label>
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
          <Label htmlFor="basement_area" className="flex items-center gap-2">
            {t.basement_area}
            <InfoTooltip content={t.basement_area_tooltip} />
          </Label>
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