import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { currencyFormatter } from '../../lib/formatters';

export default function CostInputs({ data, projectData, language, onChange }) {
  const translations = {
    sk: {
      title: "Nákladová časť",
      land_and_project: "Pozemok a projekt (€)",
      land_and_project_result: "Výsledok",
      implementation: "Realizácia",
      above_ground_unit: "Nadzemné podlažia - jednotková cena (€/m²)",
      below_ground_unit: "Podzemné podlažia - jednotková cena (€/m²)",
      outdoor_areas_unit: "Spevnené plochy - jednotková cena (€/m²)",
      greenery_terrain_unit: "Zeleň na teréne - jednotková cena (€/m²)",
      greenery_structure_unit: "Zeleň na konštrukcii - jednotková cena (€/m²)",
      engineering_networks: "Inžinierske siete (4% z 2.1-2.5)",
      additional_costs: "Dodatočné náklady (percentá z realizácie)",
      project_management: "Riadenie projektu (3,5%)",
      site_equipment: "Zariadenie staveniska (3%)",
      project_activity: "Projektová činnosť (3,5%)",
      engineering_activity: "Inžinierska činnosť (1%)",
      technical_supervision: "Technický dozor (1,5%)",
      other_services: "Ostatné služby",
      legal_services: "Právne služby (0,5% z realizácie)",
      development_fee: "Developerská provízia (€/m²)",
      other_fees: "Ostatné poplatky (1% z 2.1-2.6)",
      reserve: "Rezerva (5% z realizácie)",
      result: "Výsledok",
    },
    en: {
      title: "Cost Section",
      land_and_project: "Land and Project (€)",
      land_and_project_result: "Result",
      implementation: "Implementation",
      above_ground_unit: "Above Ground Floors - Unit Price (€/m²)",
      below_ground_unit: "Below Ground Floors - Unit Price (€/m²)",
      outdoor_areas_unit: "Paved Areas - Unit Price (€/m²)",
      greenery_terrain_unit: "Greenery on Terrain - Unit Price (€/m²)",
      greenery_structure_unit: "Greenery on Structure - Unit Price (€/m²)",
      engineering_networks: "Engineering Networks (4% of 2.1-2.5)",
      additional_costs: "Additional Costs (% of implementation)",
      project_management: "Project Management (3.5%)",
      site_equipment: "Site Equipment (3%)",
      project_activity: "Project Activity (3.5%)",
      engineering_activity: "Engineering Activity (1%)",
      technical_supervision: "Technical Supervision (1.5%)",
      other_services: "Other Services",
      legal_services: "Legal Services (0.5% of implementation)",
      development_fee: "Development Fee (€/m²)",
      other_fees: "Other Fees (1% of 2.1-2.6)",
      reserve: "Reserve (5% of implementation)",
      result: "Result",
    },
    pl: {
      title: "Część kosztowa",
      land_and_project: "Grunt i projekt (€)",
      land_and_project_result: "Wynik",
      implementation: "Realizacja",
      above_ground_unit: "Kondygnacje nadziemne - cena jednostkowa (€/m²)",
      below_ground_unit: "Kondygnacje podziemne - cena jednostkowa (€/m²)",
      outdoor_areas_unit: "Powierzchnie utwardzone - cena jednostkowa (€/m²)",
      greenery_terrain_unit: "Zieleń na gruncie - cena jednostkowa (€/m²)",
      greenery_structure_unit: "Zieleń na konstrukcji - cena jednostkowa (€/m²)",
      engineering_networks: "Sieci inżynieryjne (4% z 2.1-2.5)",
      additional_costs: "Koszty dodatkowe (% z realizacji)",
      project_management: "Zarządzanie projektem (3,5%)",
      site_equipment: "Wyposażenie placu budowy (3%)",
      project_activity: "Działalność projektowa (3,5%)",
      engineering_activity: "Działalność inżynieryjna (1%)",
      technical_supervision: "Nadzór techniczny (1,5%)",
      other_services: "Inne usługi",
      legal_services: "Usługi prawne (0,5% z realizacji)",
      development_fee: "Prowizja deweloperska (€/m²)",
      other_fees: "Inne opłaty (1% z 2.1-2.6)",
      reserve: "Rezerwa (5% z realizacji)",
      result: "Wynik",
    },
    hu: {
      title: "Költség rész",
      land_and_project: "Telek és projekt (€)",
      land_and_project_result: "Eredmény",
      implementation: "Megvalósítás",
      above_ground_unit: "Földszint feletti szintek - egységár (€/m²)",
      below_ground_unit: "Földszint alatti szintek - egységár (€/m²)",
      outdoor_areas_unit: "Burkolt területek - egységár (€/m²)",
      greenery_terrain_unit: "Zöldterület terepen - egységár (€/m²)",
      greenery_structure_unit: "Zöldterület szerkezeten - egységár (€/m²)",
      engineering_networks: "Mérnöki hálózatok (4% 2.1-2.5-ből)",
      additional_costs: "További költségek (% megvalósításból)",
      project_management: "Projektmenedzsment (3,5%)",
      site_equipment: "Építési terület felszerelése (3%)",
      project_activity: "Projekttevékenység (3,5%)",
      engineering_activity: "Mérnöki tevékenység (1%)",
      technical_supervision: "Műszaki felügyelet (1,5%)",
      other_services: "Egyéb szolgáltatások",
      legal_services: "Jogi szolgáltatások (0,5% megvalósításból)",
      development_fee: "Fejlesztési díj (€/m²)",
      other_fees: "Egyéb díjak (1% 2.1-2.6-ból)",
      reserve: "Tartalék (5% megvalósításból)",
      result: "Eredmény",
    },
    de: {
      title: "Kostenteil",
      land_and_project: "Grundstück und Projekt (€)",
      land_and_project_result: "Ergebnis",
      implementation: "Umsetzung",
      above_ground_unit: "Oberirdische Geschosse - Einheitspreis (€/m²)",
      below_ground_unit: "Unterirdische Geschosse - Einheitspreis (€/m²)",
      outdoor_areas_unit: "Befestigte Flächen - Einheitspreis (€/m²)",
      greenery_terrain_unit: "Grün auf Gelände - Einheitspreis (€/m²)",
      greenery_structure_unit: "Grün auf Struktur - Einheitspreis (€/m²)",
      engineering_networks: "Ingenieurnetzwerke (4% von 2.1-2.5)",
      additional_costs: "Zusätzliche Kosten (% der Umsetzung)",
      project_management: "Projektmanagement (3,5%)",
      site_equipment: "Baustelleneinrichtung (3%)",
      project_activity: "Projekttätigkeit (3,5%)",
      engineering_activity: "Ingenieurtätigkeit (1%)",
      technical_supervision: "Technische Aufsicht (1,5%)",
      other_services: "Sonstige Dienstleistungen",
      legal_services: "Rechtsdienstleistungen (0,5% der Umsetzung)",
      development_fee: "Entwicklungsgebühr (€/m²)",
      other_fees: "Sonstige Gebühren (1% von 2.1-2.6)",
      reserve: "Reserve (5% der Umsetzung)",
      result: "Ergebnis",
    }
  };

  const t = translations[language] || translations.en;
  const safeData = data || {};
  const safeProjectData = projectData || {};

  // Calculate implementation costs
  const gfaAbove = safeProjectData.gfa_above || 0;
  const gfaBelow = safeProjectData.gfa_below || 0;
  const pavedAreas = safeProjectData.paved_areas || 0;
  const greenTerrain = safeProjectData.green_areas_terrain || 0;
  const greenStructure = safeProjectData.green_areas_structure || 0;
  
  const aboveGroundCost = gfaAbove * (safeData.above_ground_unit_price || 0);
  const belowGroundCost = gfaBelow * (safeData.below_ground_unit_price || 0);
  const outdoorCost = pavedAreas * (safeData.outdoor_areas_unit_price || 0);
  const greenTerrainCost = greenTerrain * (safeData.greenery_terrain_unit_price || 0);
  const greenStructureCost = greenStructure * (safeData.greenery_structure_unit_price || 0);
  
  const implementationSubtotal = aboveGroundCost + belowGroundCost + outdoorCost + greenTerrainCost + greenStructureCost;
  const engineeringNetworks = implementationSubtotal * 0.04;
  const totalImplementation = implementationSubtotal + engineeringNetworks;

  // Additional costs
  const projectManagement = totalImplementation * 0.035;
  const siteEquipment = totalImplementation * 0.03;
  const projectActivity = totalImplementation * 0.035;
  const engineeringActivity = totalImplementation * 0.01;
  const technicalSupervision = totalImplementation * 0.015;

  // Other services
  const legalServices = totalImplementation * 0.005;
  const totalSalesArea = (safeProjectData.sales_area_apartments || 0) + 
                         (safeProjectData.sales_area_non_residential || 0) + 
                         (safeProjectData.sales_area_balconies || 0) + 
                         (safeProjectData.sales_area_gardens || 0) + 
                         (safeProjectData.basement_area || 0);
  const developmentFee = totalSalesArea * (safeData.development_fee_per_m2 || 0);
  const otherFees = implementationSubtotal * 0.01;

  // Reserve
  const reserve = totalImplementation * 0.05;

  const handleChange = (field, value) => {
    onChange({ ...safeData, [field]: parseFloat(value) || 0 });
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
          value={safeData.land_and_project || ""} 
          onChange={(e) => handleChange('land_and_project', e.target.value)} 
          className="font-semibold"
        />
        <p className="text-sm text-muted-foreground">{t.result}: {currencyFormatter(safeData.land_and_project || 0, 'EUR', '€', 2)}</p>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-semibold mb-4">{t.implementation}</h4>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="above_ground">{t.above_ground_unit}</Label>
            <Input 
              id="above_ground"
              type="number" 
              min="0"
              value={safeData.above_ground_unit_price || ""} 
              onChange={(e) => handleChange('above_ground_unit_price', e.target.value)} 
            />
            <p className="text-sm text-muted-foreground">{t.result}: {currencyFormatter(aboveGroundCost, 'EUR', '€', 2)}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="below_ground">{t.below_ground_unit}</Label>
            <Input 
              id="below_ground"
              type="number" 
              min="0"
              value={safeData.below_ground_unit_price || ""} 
              onChange={(e) => handleChange('below_ground_unit_price', e.target.value)} 
            />
            <p className="text-sm text-muted-foreground">{t.result}: {currencyFormatter(belowGroundCost, 'EUR', '€', 2)}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="outdoor_areas">{t.outdoor_areas_unit}</Label>
            <Input 
              id="outdoor_areas"
              type="number" 
              min="0"
              value={safeData.outdoor_areas_unit_price || ""} 
              onChange={(e) => handleChange('outdoor_areas_unit_price', e.target.value)} 
            />
            <p className="text-sm text-muted-foreground">{t.result}: {currencyFormatter(outdoorCost, 'EUR', '€', 2)}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="greenery_terrain">{t.greenery_terrain_unit}</Label>
            <Input 
              id="greenery_terrain"
              type="number" 
              min="0"
              value={safeData.greenery_terrain_unit_price || ""} 
              onChange={(e) => handleChange('greenery_terrain_unit_price', e.target.value)} 
            />
            <p className="text-sm text-muted-foreground">{t.result}: {currencyFormatter(greenTerrainCost, 'EUR', '€', 2)}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="greenery_structure">{t.greenery_structure_unit}</Label>
            <Input 
              id="greenery_structure"
              type="number" 
              min="0"
              value={safeData.greenery_structure_unit_price || ""} 
              onChange={(e) => handleChange('greenery_structure_unit_price', e.target.value)} 
            />
            <p className="text-sm text-muted-foreground">{t.result}: {currencyFormatter(greenStructureCost, 'EUR', '€', 2)}</p>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-sm font-semibold">{t.engineering_networks}</p>
            <p className="text-lg font-bold">{currencyFormatter(engineeringNetworks, 'EUR', '€', 2)}</p>
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

          <div className="space-y-2">
            <Label htmlFor="dev_fee">{t.development_fee}</Label>
            <Input 
              id="dev_fee"
              type="number" 
              min="0"
              value={safeData.development_fee_per_m2 || ""} 
              onChange={(e) => handleChange('development_fee_per_m2', e.target.value)} 
            />
            <p className="text-sm text-muted-foreground">{t.result}: {currencyFormatter(developmentFee, 'EUR', '€', 2)}</p>
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