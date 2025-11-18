import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { currencyFormatter } from '../../lib/formatters';
import InfoTooltip from '../shared/InfoTooltip';
import { Sparkles } from 'lucide-react';

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
      additional_costs: "Dodatočné náklady",
      additional_costs_subtitle: "(percentá z realizácie)",
      project_management: "Riadenie projektu",
      project_management_default: "(3,5%)",
      site_equipment: "Zariadenie staveniska",
      site_equipment_default: "(3%)",
      project_activity: "Projektová činnosť",
      project_activity_default: "(3,5%)",
      engineering_activity: "Inžinierska činnosť",
      engineering_activity_default: "(1%)",
      technical_supervision: "Technický dozor",
      technical_supervision_default: "(1,5%)",
      other_services: "Ostatné služby",
      legal_services: "Právne služby",
      legal_services_default: "(0,5% z realizácie)",
      development_fee: "Developerská provízia",
      other_fees: "Ostatné poplatky",
      other_fees_default: "(1% z 2.1-2.6)",
      reserve: "Rezerva",
      reserve_default: "(5% z realizácie)",
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
      additional_costs: "Additional Costs",
      additional_costs_subtitle: "(% of implementation)",
      project_management: "Project Management",
      project_management_default: "(3.5%)",
      site_equipment: "Site Equipment",
      site_equipment_default: "(3%)",
      project_activity: "Project Activity",
      project_activity_default: "(3.5%)",
      engineering_activity: "Engineering Activity",
      engineering_activity_default: "(1%)",
      technical_supervision: "Technical Supervision",
      technical_supervision_default: "(1.5%)",
      other_services: "Other Services",
      legal_services: "Legal Services",
      legal_services_default: "(0.5% of implementation)",
      development_fee: "Development Fee",
      other_fees: "Other Fees",
      other_fees_default: "(1% of 2.1-2.6)",
      reserve: "Reserve",
      reserve_default: "(5% of implementation)",
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
      additional_costs: "Koszty dodatkowe",
      additional_costs_subtitle: "(% z realizacji)",
      project_management: "Zarządzanie projektem",
      project_management_default: "(3,5%)",
      site_equipment: "Wyposażenie placu budowy",
      site_equipment_default: "(3%)",
      project_activity: "Działalność projektowa",
      project_activity_default: "(3,5%)",
      engineering_activity: "Działalność inżynieryjna",
      engineering_activity_default: "(1%)",
      technical_supervision: "Nadzór techniczny",
      technical_supervision_default: "(1,5%)",
      other_services: "Inne usługi",
      legal_services: "Usługi prawne",
      legal_services_default: "(0,5% z realizacji)",
      development_fee: "Prowizja deweloperska",
      other_fees: "Inne opłaty",
      other_fees_default: "(1% z 2.1-2.6)",
      reserve: "Rezerwa",
      reserve_default: "(5% z realizacji)",
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
      additional_costs: "További költségek",
      additional_costs_subtitle: "(% megvalósításból)",
      project_management: "Projektmenedzsment",
      project_management_default: "(3,5%)",
      site_equipment: "Építési terület felszerelése",
      site_equipment_default: "(3%)",
      project_activity: "Projekttevékenység",
      project_activity_default: "(3,5%)",
      engineering_activity: "Mérnöki tevékenység",
      engineering_activity_default: "(1%)",
      technical_supervision: "Műszaki felügyelet",
      technical_supervision_default: "(1,5%)",
      other_services: "Egyéb szolgáltatások",
      legal_services: "Jogi szolgáltatások",
      legal_services_default: "(0,5% megvalósításból)",
      development_fee: "Fejlesztési díj",
      other_fees: "Egyéb díjak",
      other_fees_default: "(1% 2.1-2.6-ból)",
      reserve: "Tartalék",
      reserve_default: "(5% megvalósításból)",
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
      additional_costs: "Zusätzliche Kosten",
      additional_costs_subtitle: "(% der Umsetzung)",
      project_management: "Projektmanagement",
      project_management_default: "(3,5%)",
      site_equipment: "Baustelleneinrichtung",
      site_equipment_default: "(3%)",
      project_activity: "Projekttätigkeit",
      project_activity_default: "(3,5%)",
      engineering_activity: "Ingenieurtätigkeit",
      engineering_activity_default: "(1%)",
      technical_supervision: "Technische Aufsicht",
      technical_supervision_default: "(1,5%)",
      other_services: "Sonstige Dienstleistungen",
      legal_services: "Rechtsdienstleistungen",
      legal_services_default: "(0,5% der Umsetzung)",
      development_fee: "Entwicklungsgebühr",
      other_fees: "Sonstige Gebühren",
      other_fees_default: "(1% von 2.1-2.6)",
      reserve: "Reserve",
      reserve_default: "(5% der Umsetzung)",
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

  // DEBUG LOGGING
  React.useEffect(() => {
    console.log('[CostInputs] Rendered with projectData:', {
      has_projectData: !!projectData,
      projectData_keys: projectData ? Object.keys(projectData) : [],
      sales_area_apartments: projectData?.sales_area_apartments,
      total_land_area: projectData?.total_land_area,
      gfa_above: projectData?.gfa_above
    });
  }, [projectData]);

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

  // Additional costs - with manual mode support
  const projectManagement = safeData.project_management_manual_mode
    ? (safeData.project_management_manual_value || 0)
    : totalImplementation * 0.035;
    
  const siteEquipment = safeData.site_equipment_manual_mode
    ? (safeData.site_equipment_manual_value || 0)
    : totalImplementation * 0.03;
    
  const projectActivity = safeData.project_activity_manual_mode
    ? (safeData.project_activity_manual_value || 0)
    : totalImplementation * 0.035;
    
  const engineeringActivity = safeData.engineering_activity_manual_mode
    ? (safeData.engineering_activity_manual_value || 0)
    : totalImplementation * 0.01;
    
  const technicalSupervision = safeData.technical_supervision_manual_mode
    ? (safeData.technical_supervision_manual_value || 0)
    : totalImplementation * 0.015;

  // Other services - with manual mode support
  const legalServices = safeData.legal_services_manual_mode
    ? (safeData.legal_services_manual_value || 0)
    : totalImplementation * 0.005;
  
  // Development fee - can be per m² or total manual
  const totalSalesArea = (safeProjectData.sales_area_apartments || 0) + 
                         (safeProjectData.sales_area_non_residential || 0) + 
                         (safeProjectData.sales_area_balconies || 0) + 
                         (safeProjectData.sales_area_gardens || 0) + 
                         (safeProjectData.basement_area || 0);
  
  const developmentFee = safeData.development_fee_manual_mode
    ? (safeData.development_fee_manual_value || 0)
    : totalSalesArea * (safeData.development_fee_per_m2 || 0);
    
  const otherFees = safeData.other_fees_manual_mode
    ? (safeData.other_fees_manual_value || 0)
    : implementationSubtotal * 0.01;

  // Reserve - with manual mode support
  const reserve = safeData.reserve_manual_mode
    ? (safeData.reserve_manual_value || 0)
    : totalImplementation * 0.05;

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
  
  const renderSimpleCostItem = (prefix, label, defaultLabel) => {
    const isManual = safeData[`${prefix}_manual_mode`];
    
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
          <p className="text-sm text-muted-foreground">{defaultLabel}</p>
        )}
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

      <div className="border-t pt-6">
        <h4 className="font-semibold mb-4">{t.additional_costs} <span className="text-sm text-muted-foreground font-normal">{t.additional_costs_subtitle}</span></h4>
        <div className="space-y-4">
          {renderSimpleCostItem('project_management', t.project_management, t.project_management_default)}
          <div className="text-sm text-muted-foreground text-right -mt-2">
            {t.result}: <span className="font-semibold text-foreground">{currencyFormatter(projectManagement, 'EUR', '€', 0)}</span>
          </div>
          
          {renderSimpleCostItem('site_equipment', t.site_equipment, t.site_equipment_default)}
          <div className="text-sm text-muted-foreground text-right -mt-2">
            {t.result}: <span className="font-semibold text-foreground">{currencyFormatter(siteEquipment, 'EUR', '€', 0)}</span>
          </div>
          
          {renderSimpleCostItem('project_activity', t.project_activity, t.project_activity_default)}
          <div className="text-sm text-muted-foreground text-right -mt-2">
            {t.result}: <span className="font-semibold text-foreground">{currencyFormatter(projectActivity, 'EUR', '€', 0)}</span>
          </div>
          
          {renderSimpleCostItem('engineering_activity', t.engineering_activity, t.engineering_activity_default)}
          <div className="text-sm text-muted-foreground text-right -mt-2">
            {t.result}: <span className="font-semibold text-foreground">{currencyFormatter(engineeringActivity, 'EUR', '€', 0)}</span>
          </div>
          
          {renderSimpleCostItem('technical_supervision', t.technical_supervision, t.technical_supervision_default)}
          <div className="text-sm text-muted-foreground text-right -mt-2">
            {t.result}: <span className="font-semibold text-foreground">{currencyFormatter(technicalSupervision, 'EUR', '€', 0)}</span>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h4 className="font-semibold mb-4">{t.other_services}</h4>
        <div className="space-y-4">
          {renderSimpleCostItem('legal_services', t.legal_services, t.legal_services_default)}
          <div className="text-sm text-muted-foreground text-right -mt-2">
            {t.result}: <span className="font-semibold text-foreground">{currencyFormatter(legalServices, 'EUR', '€', 0)}</span>
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

          {renderSimpleCostItem('other_fees', t.other_fees, t.other_fees_default)}
          <div className="text-sm text-muted-foreground text-right -mt-2">
            {t.result}: <span className="font-semibold text-foreground">{currencyFormatter(otherFees, 'EUR', '€', 0)}</span>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        {renderSimpleCostItem('reserve', t.reserve, t.reserve_default)}
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg mt-4">
          <p className="text-sm font-semibold mb-1">{t.result}</p>
          <p className="text-lg font-bold">{currencyFormatter(reserve, 'EUR', '€', 2)}</p>
        </div>
      </div>
    </div>
  );
}