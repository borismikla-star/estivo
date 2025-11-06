
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InfoTooltip from '@/components/shared/InfoTooltip';

export default function ProjectInfoInputs({ data, language, onChange }) {
  const translations = {
    sk: {
      title: "Informácie o projekte",
      entity_type: "Typ subjektu",
      entity_type_fo: "Fyzická osoba (FO)",
      entity_type_po: "Právnická osoba (PO)",
      vat_payer: "Platca DPH",
      vat_payer_tooltip: "Označte, ak ste registrovaný platca DPH. Platcovia DPH môžu odpočítať vstupnú DPH z nákladov.",
      vat_payer_yes: "Áno, som platca DPH",
      vat_payer_no: "Nie, nie som platca DPH",
      land_info: "Informácie o pozemku",
      total_land_area: "Celková výmera pozemku (m²)", // Modified text
      total_land_area_tooltip: "Celková rozloha pozemku určeného na výstavbu",
      building_area: "Zastavaná plocha (m²)",
      building_area_tooltip: "Plocha pozemku pokrytá budovou",
      gross_floor_area: "Hrubá podlažná plocha (HPP)",
      gfa_above: "HPP nadzemné podlažia (m²)",
      gfa_above_tooltip: "Hrubá podlažná plocha všetkých nadzemných podlaží",
      gfa_below: "HPP podzemné podlažia (m²)",
      gfa_below_tooltip: "Hrubá podlažná plocha všetkých podzemných podlaží",
      net_floor_area: "Čistá podlažná plocha (ČPP)",
      nfa_above: "ČPP nadzemné podlažia (m²)",
      nfa_above_tooltip: "Čistá úžitková plocha nadzemných podlaží",
      nfa_below: "ČPP podzemné podlažia (m²)",
      nfa_below_tooltip: "Čistá úžitková plocha podzemných podlaží",
      sales_areas: "Predajné plochy",
      sales_area_apartments: "Byty (m²)", // Modified text
      sales_area_apartments_tooltip: "Celková predajná plocha bytov",
      sales_area_non_residential: "Nebytové priestory (m²)", // Modified text
      sales_area_non_residential_tooltip: "Celková predajná plocha nebytových priestorov (obchody, kancelárie)",
      sales_area_balconies: "Balkóny (m²)", // Modified text
      sales_area_balconies_tooltip: "Celková predajná plocha balkónov a terás",
      sales_area_gardens: "Predzáhradky (m²)", // Modified text
      sales_area_gardens_tooltip: "Celková predajná plocha záhrad",
      parking: "Parkovanie",
      parking_indoor_count: "Kryté parkovacie miesta (ks)", // Modified text
      parking_indoor_count_tooltip: "Počet parkovacích miest v garáži/podzemí",
      parking_outdoor_count: "Vonkajšie parkovacie miesta (ks)", // Modified text
      parking_outdoor_count_tooltip: "Počet vonkajších parkovacích miest",
      other_areas: "Ostatné plochy",
      paved_areas: "Spevnené plochy (m²)",
      paved_areas_tooltip: "Plocha chodníkov, príjazdových ciest a spevnených plôch",
      green_areas_terrain: "Zeleň na teréne (m²)",
      green_areas_terrain_tooltip: "Plocha zelene na úrovni terénu",
      green_areas_structure: "Zeleň na konštrukcii (m²)",
      green_areas_structure_tooltip: "Plocha zelene na strechách alebo konštrukciách",
      basement_area: "Pivnice (m²)", // Modified text
      basement_area_tooltip: "Celková plocha pivničných priestorov/skladov",
    },
    en: {
      title: "Project Information",
      entity_type: "Entity Type",
      entity_type_fo: "Individual (FO)",
      entity_type_po: "Company (PO)",
      vat_payer: "VAT Payer",
      vat_payer_tooltip: "Check if you are registered as VAT payer. VAT payers can deduct input VAT from costs.",
      vat_payer_yes: "Yes, I am VAT payer",
      vat_payer_no: "No, I am not VAT payer",
      land_info: "Land Information",
      total_land_area: "Total Land Area (m²)",
      total_land_area_tooltip: "Total area of land designated for development",
      building_area: "Building Footprint (m²)",
      building_area_tooltip: "Area of land covered by the building",
      gross_floor_area: "Gross Floor Area (GFA)",
      gfa_above: "GFA Above Ground (m²)",
      gfa_above_tooltip: "Gross Floor Area of all above-ground floors",
      gfa_below: "GFA Below Ground (m²)",
      gfa_below_tooltip: "Gross Floor Area of all below-ground floors",
      net_floor_area: "Net Floor Area (NFA)",
      nfa_above: "NFA Above Ground (m²)",
      nfa_above_tooltip: "Net Floor Area of above-ground floors",
      nfa_below: "NFA Below Ground (m²)",
      nfa_below_tooltip: "Net Floor Area of below-ground floors",
      sales_areas: "Sales Areas",
      sales_area_apartments: "Apartments (m²)", // Modified text
      sales_area_apartments_tooltip: "Total saleable area of apartments",
      sales_area_non_residential: "Non-Residential (m²)", // Modified text
      sales_area_non_residential_tooltip: "Total saleable area of commercial spaces (shops, offices)",
      sales_area_balconies: "Balconies (m²)", // Modified text
      sales_area_balconies_tooltip: "Total saleable area of balconies and terraces",
      sales_area_gardens: "Gardens (m²)", // Modified text
      sales_area_gardens_tooltip: "Total saleable area of gardens",
      parking: "Parking",
      parking_indoor_count: "Indoor Parking Spaces (pcs)", // Modified text
      parking_indoor_count_tooltip: "Number of parking spaces in garage/basement",
      parking_outdoor_count: "Outdoor Parking Spaces (pcs)", // Modified text
      parking_outdoor_count_tooltip: "Number of outdoor parking spaces",
      other_areas: "Other Areas",
      paved_areas: "Paved Areas (m²)",
      paved_areas_tooltip: "Area of sidewalks, driveways, and paved surfaces",
      green_areas_terrain: "Greenery on Terrain (m²)",
      green_areas_terrain_tooltip: "Area of greenery at ground level",
      green_areas_structure: "Greenery on Structure (m²)",
      green_areas_structure_tooltip: "Area of greenery on roofs or structures",
      basement_area: "Basements (m²)", // Modified text
      basement_area_tooltip: "Total area of basement storage units",
    },
    pl: {
      title: "Informacje o projekcie",
      entity_type: "Typ podmiotu",
      entity_type_fo: "Osoba fizyczna (FO)",
      entity_type_po: "Osoba prawna (PO)",
      vat_payer: "Płatnik VAT",
      vat_payer_tooltip: "Zaznacz, jeśli jesteś zarejestrowanym płatnikiem VAT. Płatnicy VAT mogą odliczyć naliczony VAT od kosztów.",
      vat_payer_yes: "Tak, jestem płatnikiem VAT",
      vat_payer_no: "Nie, nie jestem płatnikiem VAT",
      land_info: "Informacje o działce",
      total_land_area: "Całkowita powierzchnia działki (m²)",
      total_land_area_tooltip: "Całkowita powierzchnia działki przeznaczona pod zabudowę",
      building_area: "Powierzchnia zabudowy (m²)",
      building_area_tooltip: "Powierzchnia działki zajęta przez budynek",
      gross_floor_area: "Powierzchnia użytkowa brutto (GFA)",
      gfa_above: "Powierzchnia brutto naziemna (m²)",
      gfa_above_tooltip: "Powierzchnia użytkowa brutto wszystkich kondygnacji naziemnych",
      gfa_below: "Powierzchnia brutto podziemna (m²)",
      gfa_below_tooltip: "Powierzchnia użytkowa brutto wszystkich kondygnacji podziemnych",
      nfa_above: "Powierzchnia netto naziemna (m²)",
      nfa_above_tooltip: "Powierzchnia użytkowa netto kondygnacji naziemnych",
      nfa_below: "Powierzchnia netto podziemna (m²)",
      nfa_below_tooltip: "Powierzchnia użytkowa netto kondygnacji podziemnych",
      sales_areas: "Powierzchnie sprzedaży",
      sales_area_apartments: "Mieszkania (m²)", // Modified text
      sales_area_apartments_tooltip: "Całkowita powierzchnia sprzedaży mieszkań",
      sales_area_non_residential: "Lokale użytkowe (m²)", // Modified text
      sales_area_non_residential_tooltip: "Całkowita powierzchnia sprzedaży lokali użytkowych (sklepy, biura)",
      sales_area_balconies: "Balkony (m²)", // Modified text
      sales_area_balconies_tooltip: "Całkowita powierzchnia sprzedaży balkonów i tarasów",
      sales_area_gardens: "Ogrody (m²)", // Modified text
      sales_area_gardens_tooltip: "Całkowita powierzchnia sprzedaży ogrodów",
      parking: "Parking",
      parking_indoor_count: "Miejsca parkingowe kryty (szt.)",
      parking_indoor_count_tooltip: "Liczba miejsc parkingowych w garażu/piwnicy",
      parking_outdoor_count: "Miejsca parkingowe zewnętrzne (szt.)",
      parking_outdoor_count_tooltip: "Liczba zewnętrznych miejsc parkingowych",
      other_areas: "Pozostałe powierzchnie",
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
      entity_type: "Jogalany típusa",
      entity_type_fo: "Magánszemély (FO)",
      entity_type_po: "Jogi személy (PO)",
      vat_payer: "ÁFA fizető",
      vat_payer_tooltip: "Jelölje be, ha regisztrált ÁFA fizető. Az ÁFA fizetők levonhatják a bemeneti ÁFÁ-t a költségekből.",
      vat_payer_yes: "Igen, ÁFA fizető vagyok",
      vat_payer_no: "Nem, nem vagyok ÁFA fizető",
      land_info: "Telek információk",
      total_land_area: "Teljes telek terület (m²)",
      total_land_area_tooltip: "A fejlesztésre kijelölt telek teljes területe",
      building_area: "Beépített terület (m²)",
      building_area_tooltip: "Az épület által lefedett területnek",
      gross_floor_area: "Bruttó alapterület (GFA)",
      gfa_above: "Bruttó alapterület föld felett (m²)",
      gfa_above_tooltip: "Összes föld feletti szint bruttó alapterülete",
      gfa_below: "Bruttó alapterület föld alatt (m²)",
      gfa_below_tooltip: "Összes föld alatti szint bruttó alapterülete",
      nfa_above: "Nettó alapterület föld felett (m²)",
      nfa_above_tooltip: "Föld feletti szintek nettó alapterülete",
      nfa_below: "Nettó alapterület föld alatt (m²)",
      nfa_below_tooltip: "Föld alatti szintek nettó alapterülete",
      sales_areas: "Eladási területek",
      sales_area_apartments: "Lakások (m²)", // Modified text
      sales_area_apartments_tooltip: "Lakások összes eladható területe",
      sales_area_non_residential: "Nem lakás célú (m²)", // Modified text
      sales_area_non_residential_tooltip: "Kereskedelmi helyiségek összes eladható területe (üzletek, irodák)",
      sales_area_balconies: "Erkélyek (m²)", // Modified text
      sales_area_balconies_tooltip: "Erkélyek és teraszok összes eladható területe",
      sales_area_gardens: "Kertek (m²)", // Modified text
      sales_area_gardens_tooltip: "Kertek összes eladható területe",
      parking: "Parkolás",
      parking_indoor_count: "Fedett parkolóhelyek (db)",
      parking_indoor_count_tooltip: "Parkolóhelyek száma garázsban/pincében",
      parking_outdoor_count: "Kültéri parkolóhelyek (db)",
      parking_outdoor_count_tooltip: "Kültéri parkolóhelyek száma",
      other_areas: "Egyéb területek",
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
      entity_type: "Rechtspersönlichkeit",
      entity_type_fo: "Natürliche Person (FO)",
      entity_type_po: "Juristische Person (PO)",
      vat_payer: "Umsatzsteuerpflichtig",
      vat_payer_tooltip: "Ankreuzen, wenn Sie als Umsatzsteuerpflichtiger registriert sind. Umsatzsteuerpflichtige können die Vorsteuer von den Kosten abziehen.",
      vat_payer_yes: "Ja, ich bin umsatzsteuerpflichtig",
      vat_payer_no: "Nein, ich bin nicht umsatzsteuerpflichtig",
      land_info: "Grundstücksinformationen",
      total_land_area: "Gesamtgrundstücksfläche (m²)",
      total_land_area_tooltip: "Gesamtfläche des für die Entwicklung vorgesehenen Grundstücks",
      building_area: "Bebauungsfläche (m²)",
      building_area_tooltip: "Vom Gebäude bedeckte Fläche",
      gross_floor_area: "Bruttogeschossfläche (BGF)",
      gfa_above: "Bruttogeschossfläche oberirdisch (m²)",
      gfa_above_tooltip: "Bruttogeschossfläche aller oberirdischen Geschosse",
      gfa_below: "Bruttogeschossfläche unterirdisch (m²)",
      gfa_below_tooltip: "Bruttogeschossfläche aller unterirdischen Geschosse",
      nfa_above: "Nettogeschossfläche oberirdisch (m²)",
      nfa_above_tooltip: "Nettogeschossfläche der oberirdischen Geschosse",
      nfa_below: "Nettogeschossfläche unterirdisch (m²)",
      nfa_below_tooltip: "Nettogeschossfläche der unterirdischen Geschosse",
      sales_areas: "Verkaufsflächen",
      sales_area_apartments: "Wohnungen (m²)", // Modified text
      sales_area_apartments_tooltip: "Gesamte verkäufliche Fläche der Wohnungen",
      sales_area_non_residential: "Gewerbeflächen (m²)", // Modified text
      sales_area_non_residential_tooltip: "Gesamte verkäufliche Fläche von Gewerbeflächen (Geschäfte, Büros)",
      sales_area_balconies: "Balkone (m²)", // Modified text
      sales_area_balconies_tooltip: "Gesamte verkäufliche Fläche von Balkonen und Terrassen",
      sales_area_gardens: "Gärten (m²)", // Modified text
      sales_area_gardens_tooltip: "Gesamte verkäufliche Fläche von Gärten",
      parking: "Parken",
      parking_indoor_count: "Überdachte Parkplätze (Anz.)",
      parking_indoor_count_tooltip: "Anzahl der Parkplätze in Garage/Keller",
      parking_outdoor_count: "Außenparkplätze (Anz.)",
      parking_outdoor_count_tooltip: "Anzahl der Außenparkplätze",
      other_areas: "Weitere Flächen",
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
    onChange({ ...safeData, [field]: value });
  };

  const handleNumberChange = (field, value) => {
    // Convert to float, or null if the input is empty
    handleChange(field, value === '' ? null : parseFloat(value));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">{t.title}</h3>
      
      {/* Entity Type Selection */}
      <div className="space-y-4 p-4 bg-muted/20 rounded-lg border border-border">
        <div className="space-y-2">
          <Label className="text-base font-semibold">{t.entity_type}</Label>
          <div className="flex gap-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="entity_type"
                value="FO"
                checked={safeData.entity_type === 'FO'}
                onChange={(e) => handleChange('entity_type', e.target.value)}
                className="w-4 h-4 text-primary"
              />
              <span>{t.entity_type_fo}</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="entity_type"
                value="PO"
                checked={safeData.entity_type === 'PO'}
                onChange={(e) => handleChange('entity_type', e.target.value)}
                className="w-4 h-4 text-primary"
              />
              <span>{t.entity_type_po}</span>
            </label>
          </div>
        </div>

        {/* VAT Payer Checkbox */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center gap-2">
            <Label className="text-base font-semibold">{t.vat_payer}</Label>
            <InfoTooltip content={t.vat_payer_tooltip} />
          </div>
          <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-muted/30 transition-colors">
            <input
              type="checkbox"
              checked={safeData.vat_payer || false} // Ensure checked prop always gets a boolean
              onChange={(e) => handleChange('vat_payer', e.target.checked)}
              className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
            />
            <span className="text-sm font-medium">
              {safeData.vat_payer ? t.vat_payer_yes : t.vat_payer_no}
            </span>
          </label>
        </div>
      </div>

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
            onChange={(e) => handleNumberChange('total_land_area', e.target.value)} 
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
            onChange={(e) => handleNumberChange('building_area', e.target.value)} 
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
            onChange={(e) => handleNumberChange('gfa_above', e.target.value)} 
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
            onChange={(e) => handleNumberChange('gfa_below', e.target.value)} 
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
            onChange={(e) => handleNumberChange('nfa_above', e.target.value)} 
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
            onChange={(e) => handleNumberChange('nfa_below', e.target.value)} 
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
            onChange={(e) => handleNumberChange('sales_area_apartments', e.target.value)} 
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
            onChange={(e) => handleNumberChange('sales_area_non_residential', e.target.value)} 
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
            onChange={(e) => handleNumberChange('sales_area_balconies', e.target.value)} 
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
            onChange={(e) => handleNumberChange('sales_area_gardens', e.target.value)} 
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
            onChange={(e) => handleNumberChange('parking_indoor_count', e.target.value)} 
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
            onChange={(e) => handleNumberChange('parking_outdoor_count', e.target.value)} 
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
            onChange={(e) => handleNumberChange('paved_areas', e.target.value)} 
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
            onChange={(e) => handleNumberChange('green_areas_terrain', e.target.value)} 
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
            onChange={(e) => handleNumberChange('green_areas_structure', e.target.value)} 
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
            onChange={(e) => handleNumberChange('basement_area', e.target.value)} 
          />
        </div>
      </div>
    </div>
  );
}
