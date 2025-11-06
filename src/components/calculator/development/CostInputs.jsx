import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { currencyFormatter } from '../../lib/formatters';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit3 } from 'lucide-react';

export default function CostInputs({ data, projectData, language, onChange }) {
  const translations = {
    sk: {
      title: "Nákladová časť",
      land_and_project: "Pozemok a projekt (€)",
      land_and_project_result: "Výsledok",
      implementation: "Realizácia",
      above_ground_unit: "Nadzemné podlažia",
      below_ground_unit: "Podzemné podlažia",
      outdoor_areas_unit: "Spevnené plochy",
      greenery_terrain_unit: "Zeleň na teréne",
      greenery_structure_unit: "Zeleň na konštrukcii",
      engineering_networks: "Inžinierske siete (4% z 2.1-2.5)",
      additional_costs: "Dodatočné náklady (percentá z realizácie)",
      project_management: "Riadenie projektu (3,5%)",
      site_equipment: "Zariadenie staveniska (3%)",
      project_activity: "Projektová činnosť (3,5%)",
      engineering_activity: "Inžinierska činnosť (1%)",
      technical_supervision: "Technický dozor (1,5%)",
      other_services: "Ostatné služby",
      legal_services: "Právne služby (0,5% z realizácie)",
      development_fee: "Developerská provízia",
      other_fees: "Ostatné poplatky (1% z 2.1-2.6)",
      reserve: "Rezerva (5% z realizácie)",
      result: "Výsledok",
      mode_auto: "Auto",
      mode_manual: "Manual",
      unit_price: "Jednotková cena (€/m²)",
      total_amount: "Celková suma (€)",
      area: "Plocha",
      manual_badge: "✏️ Manuálne",
      per_m2: "€/m²",
      count: "ks",
    },
    en: {
      title: "Cost Section",
      land_and_project: "Land and Project (€)",
      land_and_project_result: "Result",
      implementation: "Implementation",
      above_ground_unit: "Above Ground Floors",
      below_ground_unit: "Below Ground Floors",
      outdoor_areas_unit: "Paved Areas",
      greenery_terrain_unit: "Greenery on Terrain",
      greenery_structure_unit: "Greenery on Structure",
      engineering_networks: "Engineering Networks (4% of 2.1-2.5)",
      additional_costs: "Additional Costs (% of implementation)",
      project_management: "Project Management (3.5%)",
      site_equipment: "Site Equipment (3%)",
      project_activity: "Project Activity (3.5%)",
      engineering_activity: "Engineering Activity (1%)",
      technical_supervision: "Technical Supervision (1.5%)",
      other_services: "Other Services",
      legal_services: "Legal Services (0.5% of implementation)",
      development_fee: "Development Fee",
      other_fees: "Other Fees (1% of 2.1-2.6)",
      reserve: "Reserve (5% of implementation)",
      result: "Result",
      mode_auto: "Auto",
      mode_manual: "Manual",
      unit_price: "Unit Price (€/m²)",
      total_amount: "Total Amount (€)",
      area: "Area",
      manual_badge: "✏️ Manual",
      per_m2: "€/m²",
      count: "pcs",
    },
    pl: {
      title: "Część kosztowa",
      land_and_project: "Grunt i projekt (€)",
      land_and_project_result: "Wynik",
      implementation: "Realizacja",
      above_ground_unit: "Kondygnacje nadziemne",
      below_ground_unit: "Kondygnacje podziemne",
      outdoor_areas_unit: "Powierzchnie utwardzone",
      greenery_terrain_unit: "Zieleń na gruncie",
      greenery_structure_unit: "Zieleń na konstrukcji",
      engineering_networks: "Sieci inżynieryjne (4% z 2.1-2.5)",
      additional_costs: "Koszty dodatkowe (% z realizacji)",
      project_management: "Zarządzanie projektem (3,5%)",
      site_equipment: "Wyposażenie placu budowy (3%)",
      project_activity: "Działalność projektowa (3,5%)",
      engineering_activity: "Działalność inżynieryjna (1%)",
      technical_supervision: "Nadzór techniczny (1,5%)",
      other_services: "Inne usługi",
      legal_services: "Usługi prawne (0,5% z realizacji)",
      development_fee: "Prowizja deweloperska",
      other_fees: "Inne opłaty (1% z 2.1-2.6)",
      reserve: "Rezerwa (5% z realizacji)",
      result: "Wynik",
      mode_auto: "Auto",
      mode_manual: "Manual",
      unit_price: "Cena jednostkowa (€/m²)",
      total_amount: "Całkowita kwota (€)",
      area: "Powierzchnia",
      manual_badge: "✏️ Ręcznie",
      per_m2: "€/m²",
      count: "szt",
    },
    hu: {
      title: "Költség rész",
      land_and_project: "Telek és projekt (€)",
      land_and_project_result: "Eredmény",
      implementation: "Megvalósítás",
      above_ground_unit: "Földszint feletti szintek",
      below_ground_unit: "Földszint alatti szintek",
      outdoor_areas_unit: "Burkolt területek",
      greenery_terrain_unit: "Zöldterület terepen",
      greenery_structure_unit: "Zöldterület szerkezeten",
      engineering_networks: "Mérnöki hálózatok (4% 2.1-2.5-ből)",
      additional_costs: "További költségek (% megvalósításból)",
      project_management: "Projektmenedzsment (3,5%)",
      site_equipment: "Építési terület felszerelése (3%)",
      project_activity: "Projekttevékenység (3,5%)",
      engineering_activity: "Mérnöki tevékenység (1%)",
      technical_supervision: "Műszaki felügyelet (1,5%)",
      other_services: "Egyéb szolgáltatások",
      legal_services: "Jogi szolgáltatások (0,5% megvalósításból)",
      development_fee: "Fejlesztési díj",
      other_fees: "Egyéb díjak (1% 2.1-2.6-ból)",
      reserve: "Tartalék (5% megvalósításból)",
      result: "Eredmény",
      mode_auto: "Auto",
      mode_manual: "Kézi",
      unit_price: "Egységár (€/m²)",
      total_amount: "Teljes összeg (€)",
      area: "Terület",
      manual_badge: "✏️ Kézi",
      per_m2: "€/m²",
      count: "db",
    },
    de: {
      title: "Kostenteil",
      land_and_project: "Grundstück und Projekt (€)",
      land_and_project_result: "Ergebnis",
      implementation: "Umsetzung",
      above_ground_unit: "Oberirdische Geschosse",
      below_ground_unit: "Unterirdische Geschosse",
      outdoor_areas_unit: "Befestigte Flächen",
      greenery_terrain_unit: "Grün auf Gelände",
      greenery_structure_unit: "Grün auf Struktur",
      engineering_networks: "Ingenieurnetzwerke (4% von 2.1-2.5)",
      additional_costs: "Zusätzliche Kosten (% der Umsetzung)",
      project_management: "Projektmanagement (3,5%)",
      site_equipment: "Baustelleneinrichtung (3%)",
      project_activity: "Projekttätigkeit (3,5%)",
      engineering_activity: "Ingenieurtätigkeit (1%)",
      technical_supervision: "Technische Aufsicht (1,5%)",
      other_services: "Sonstige Dienstleistungen",
      legal_services: "Rechtsdienstleistungen (0,5% der Umsetzung)",
      development_fee: "Entwicklungsgebühr",
      other_fees: "Sonstige Gebühren (1% von 2.1-2.6)",
      reserve: "Reserve (5% der Umsetzung)",
      result: "Ergebnis",
      mode_auto: "Auto",
      mode_manual: "Manuell",
      unit_price: "Einheitspreis (€/m²)",
      total_amount: "Gesamtbetrag (€)",
      area: "Fläche",
      manual_badge: "✏️ Manuell",
      per_m2: "€/m²",
      count: "Stk",
    }
  };

  const t = translations[language] || translations.en;
  const safeData = data || {};
  const safeProjectData = projectData || {};

  // Calculate implementation costs based on mode
  const gfaAbove = safeProjectData.gfa_above || 0;
  const gfaBelow = safeProjectData.gfa_below || 0;
  const pavedAreas = safeProjectData.paved_areas || 0;
  const greenTerrain = safeProjectData.green_areas_terrain || 0;
  const greenStructure = safeProjectData.green_areas_structure || 0;
  
  const calculateCost = (prefix, area) => {
    const isManual = safeData[`${prefix}_manual_mode`];
    if (isManual) {
      return safeData[`${prefix}_manual_value`] || 0;
    }
    return area * (safeData[`${prefix}_unit_price`] || 0);
  };

  const aboveGroundCost = calculateCost('above_ground', gfaAbove);
  const belowGroundCost = calculateCost('below_ground', gfaBelow);
  const outdoorCost = calculateCost('outdoor_areas', pavedAreas);
  const greenTerrainCost = calculateCost('greenery_terrain', greenTerrain);
  const greenStructureCost = calculateCost('greenery_structure', greenStructure);
  
  const implementationSubtotal = aboveGroundCost + belowGroundCost + outdoorCost + greenTerrainCost + greenStructureCost;
  
  // Engineering networks - can also be manual
  const engineeringNetworks = safeData.engineering_networks_manual_mode 
    ? (safeData.engineering_networks_manual_value || 0)
    : implementationSubtotal * 0.04;
    
  const totalImplementation = implementationSubtotal + engineeringNetworks;

  // Additional costs
  const projectManagement = totalImplementation * 0.035;
  const siteEquipment = totalImplementation * 0.03;
  const projectActivity = totalImplementation * 0.035;
  const engineeringActivity = totalImplementation * 0.01;
  const technicalSupervision = totalImplementation * 0.015;

  // Other services
  const legalServices = totalImplementation * 0.005;
  
  // Development fee - can be per m² or total manual
  const totalSalesArea = (safeProjectData.sales_area_apartments || 0) + 
                         (safeProjectData.sales_area_non_residential || 0) + 
                         (safeProjectData.sales_area_balconies || 0) + 
                         (safeProjectData.sales_area_gardens || 0) + 
                         (safeProjectData.basement_area || 0);
  
  const developmentFee = safeData.development_fee_manual_mode
    ? (safeData.development_fee_manual_value || 0)
    : totalSalesArea * (safeData.development_fee_per_m2 || 0);
    
  const otherFees = implementationSubtotal * 0.01;

  // Reserve
  const reserve = totalImplementation * 0.05;

  const handleChange = (field, value) => {
    onChange({ ...safeData, [field]: parseFloat(value) || 0 });
  };

  const handleModeChange = (prefix, mode) => {
    onChange({ ...safeData, [`${prefix}_manual_mode`]: mode === 'manual' });
  };

  const renderCostItem = (prefix, label, area, unitLabel) => {
    const isManual = safeData[`${prefix}_manual_mode`];
    const cost = calculateCost(prefix, area);
    
    return (
      <div className="border rounded-lg p-4 bg-muted/10">
        <div className="flex items-center justify-between mb-3">
          <Label className="font-semibold flex items-center gap-2">
            {label}
            {isManual && <Badge variant="outline" className="text-xs">{t.manual_badge}</Badge>}
          </Label>
          <Select 
            value={isManual ? 'manual' : 'auto'} 
            onValueChange={(value) => handleModeChange(prefix, value)}
          >
            <SelectTrigger className="w-24 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">{t.mode_auto}</SelectItem>
              <SelectItem value="manual">{t.mode_manual}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {isManual ? (
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">{t.total_amount}</Label>
            <Input 
              type="number" 
              min="0"
              step="1000"
              value={safeData[`${prefix}_manual_value`] || ""} 
              onChange={(e) => handleChange(`${prefix}_manual_value`, e.target.value)} 
              className="font-semibold"
            />
          </div>
        ) : (
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">{t.unit_price}</Label>
            <Input 
              type="number" 
              min="0"
              step="10"
              value={safeData[`${prefix}_unit_price`] || ""} 
              onChange={(e) => handleChange(`${prefix}_unit_price`, e.target.value)} 
            />
            <div className="text-sm text-muted-foreground">
              {t.area}: {area.toLocaleString()} m²
            </div>
          </div>
        )}
        
        <div className="mt-3 pt-3 border-t">
          <p className="text-sm text-muted-foreground">{t.result}</p>
          <p className="text-lg font-bold text-primary">{currencyFormatter(cost, 'EUR', '€', 0)}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">{t.title}</h3>
      
      {/* Land and Project */}
      <div className="space-y-2">
        <Label htmlFor="land_and_project">{t.land_and_project}</Label>
        <Input 
          id="land_and_project"
          type="number" 
          min="0"
          step="1000"
          value={safeData.land_and_project || ""} 
          onChange={(e) => handleChange('land_and_project', e.target.value)} 
          className="font-semibold"
        />
        <p className="text-sm text-muted-foreground">{t.result}: {currencyFormatter(safeData.land_and_project || 0, 'EUR', '€', 2)}</p>
      </div>

      <div className="border-t pt-6">
        <h4 className="font-semibold mb-4">{t.implementation}</h4>
        <div className="space-y-4">
          {renderCostItem('above_ground', t.above_ground_unit, gfaAbove, t.per_m2)}
          {renderCostItem('below_ground', t.below_ground_unit, gfaBelow, t.per_m2)}
          {renderCostItem('outdoor_areas', t.outdoor_areas_unit, pavedAreas, t.per_m2)}
          {renderCostItem('greenery_terrain', t.greenery_terrain_unit, greenTerrain, t.per_m2)}
          {renderCostItem('greenery_structure', t.greenery_structure_unit, greenStructure, t.per_m2)}

          {/* Engineering Networks with manual option */}
          <div className="border rounded-lg p-4 bg-muted/10">
            <div className="flex items-center justify-between mb-3">
              <Label className="font-semibold flex items-center gap-2">
                {t.engineering_networks}
                {safeData.engineering_networks_manual_mode && <Badge variant="outline" className="text-xs">{t.manual_badge}</Badge>}
              </Label>
              <Select 
                value={safeData.engineering_networks_manual_mode ? 'manual' : 'auto'} 
                onValueChange={(value) => handleModeChange('engineering_networks', value)}
              >
                <SelectTrigger className="w-24 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">{t.mode_auto}</SelectItem>
                  <SelectItem value="manual">{t.mode_manual}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {safeData.engineering_networks_manual_mode ? (
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">{t.total_amount}</Label>
                <Input 
                  type="number" 
                  min="0"
                  step="1000"
                  value={safeData.engineering_networks_manual_value || ""} 
                  onChange={(e) => handleChange('engineering_networks_manual_value', e.target.value)} 
                  className="font-semibold"
                />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">4% z realizácie (2.1-2.5)</p>
            )}
            
            <div className="mt-3 pt-3 border-t">
              <p className="text-lg font-bold text-primary">{currencyFormatter(engineeringNetworks, 'EUR', '€', 0)}</p>
            </div>
          </div>

          <div className="p-4 bg-primary/10 rounded-lg">
            <p className="text-sm font-semibold">Total {t.implementation}</p>
            <p className="text-xl font-bold text-primary">{currencyFormatter(totalImplementation, 'EUR', '€', 2)}</p>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-semibold mb-2">{t.additional_costs}</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">{t.project_management}</span>
            <span className="font-semibold">{currencyFormatter(projectManagement, 'EUR', '€', 0)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">{t.site_equipment}</span>
            <span className="font-semibold">{currencyFormatter(siteEquipment, 'EUR', '€', 0)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">{t.project_activity}</span>
            <span className="font-semibold">{currencyFormatter(projectActivity, 'EUR', '€', 0)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">{t.engineering_activity}</span>
            <span className="font-semibold">{currencyFormatter(engineeringActivity, 'EUR', '€', 0)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">{t.technical_supervision}</span>
            <span className="font-semibold">{currencyFormatter(technicalSupervision, 'EUR', '€', 0)}</span>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-semibold mb-4">{t.other_services}</h4>
        <div className="space-y-4">
          <div className="p-3 bg-muted/20 rounded">
            <p className="text-sm text-muted-foreground mb-1">{t.legal_services}</p>
            <p className="font-semibold">{currencyFormatter(legalServices, 'EUR', '€', 2)}</p>
          </div>

          {/* Development Fee with manual option */}
          <div className="border rounded-lg p-4 bg-muted/10">
            <div className="flex items-center justify-between mb-3">
              <Label className="font-semibold flex items-center gap-2">
                {t.development_fee}
                {safeData.development_fee_manual_mode && <Badge variant="outline" className="text-xs">{t.manual_badge}</Badge>}
              </Label>
              <Select 
                value={safeData.development_fee_manual_mode ? 'manual' : 'auto'} 
                onValueChange={(value) => handleModeChange('development_fee', value)}
              >
                <SelectTrigger className="w-24 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">{t.mode_auto}</SelectItem>
                  <SelectItem value="manual">{t.mode_manual}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {safeData.development_fee_manual_mode ? (
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">{t.total_amount}</Label>
                <Input 
                  type="number" 
                  min="0"
                  step="1000"
                  value={safeData.development_fee_manual_value || ""} 
                  onChange={(e) => handleChange('development_fee_manual_value', e.target.value)} 
                  className="font-semibold"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">{t.unit_price}</Label>
                <Input 
                  type="number" 
                  min="0"
                  step="10"
                  value={safeData.development_fee_per_m2 || ""} 
                  onChange={(e) => handleChange('development_fee_per_m2', e.target.value)} 
                />
                <div className="text-sm text-muted-foreground">
                  {t.area}: {totalSalesArea.toLocaleString()} m²
                </div>
              </div>
            )}
            
            <div className="mt-3 pt-3 border-t">
              <p className="text-lg font-bold text-primary">{currencyFormatter(developmentFee, 'EUR', '€', 0)}</p>
            </div>
          </div>

          <div className="p-3 bg-muted/20 rounded">
            <p className="text-sm text-muted-foreground mb-1">{t.other_fees}</p>
            <p className="font-semibold">{currencyFormatter(otherFees, 'EUR', '€', 2)}</p>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
          <p className="text-sm font-semibold mb-1">{t.reserve}</p>
          <p className="text-lg font-bold">{currencyFormatter(reserve, 'EUR', '€', 2)}</p>
        </div>
      </div>
    </div>
  );
}