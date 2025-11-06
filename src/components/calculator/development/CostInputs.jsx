
import React, { useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { currencyFormatter } from '../../lib/formatters';

export default function CostInputs({ data, projectData, language, onChange }) {
  const translations = {
    sk: {
      title: "Nákladová časť",
      land_purchase: "1. Kúpa projektu - Pozemok + projekt (€)",
      implementation: "2. Realizácia",
      above_ground_unit: "2.1. Nadzemné podlažia - jednotková cena (€/m²)",
      below_ground_unit: "2.2. Podzemné podlažia - jednotková cena (€/m²)",
      outdoor_areas_unit: "2.3. Vonkajšie plochy - jednotková cena (€/m²)",
      green_terrain_unit: "2.4. Zeleň na teréne - jednotková cena (€/m²)",
      green_structure_unit: "2.5. Zeleň na konštrukcii - jednotková cena (€/m²)",
      engineering_networks: "2.6. Inžinierske siete (4% z 2.1-2.5)",
      additional_costs: "3. Ďalšie rozpočtové náklady",
      project_management: "3.1. Projektový manažment a development (3.5%)",
      site_equipment: "3.2. Zariadenie staveniska (3%)",
      project_activity: "3.3. Projekčná činnosť (3.5%)",
      engineering_activity: "3.4. Inžinierska činnosť (1%)",
      supervision: "3.5. Stavebný/Technický dozor, BOZP (1.5%)",
      sales_commission: "3.6. Predaj - náklady/provízie (2% z tržieb)",
      marketing: "3.7. Marketing - reklama a propagácia (0.8% z tržieb)",
      other_services: "4. Ostatné služby",
      legal_services: "4.1. Právne služby (0.5%)",
      development_fee_unit: "4.2. Development fee - jednotková cena (€/m²)",
      other_fees: "4.3. Ostatné poplatky/povolenia/odtlačky (1% z 2.1-2.6)",
      reserve: "5. Rezerva",
      implementation_reserve: "5.1. Rezerva na realizačné náklady (5%)",
      result: "Výsledok",
    },
    en: {
      title: "Cost Section",
      land_purchase: "1. Project Purchase - Land + Project (€)",
      implementation: "2. Implementation",
      above_ground_unit: "2.1. Above Ground Floors - Unit Price (€/m²)",
      below_ground_unit: "2.2. Below Ground Floors - Unit Price (€/m²)",
      outdoor_areas_unit: "2.3. Outdoor Areas - Unit Price (€/m²)",
      green_terrain_unit: "2.4. Greenery on Terrain - Unit Price (€/m²)",
      green_structure_unit: "2.5. Greenery on Structure - Unit Price (€/m²)",
      engineering_networks: "2.6. Engineering Networks (4% of 2.1-2.5)",
      additional_costs: "3. Additional Budget Costs",
      project_management: "3.1. Project Management and Development (3.5%)",
      site_equipment: "3.2. Site Equipment (3%)",
      project_activity: "3.3. Project Activity (3.5%)",
      engineering_activity: "3.4. Engineering Activity (1%)",
      supervision: "3.5. Construction/Technical Supervision, OHS (1.5%)",
      sales_commission: "3.6. Sales - Costs/Commissions (2% of revenue)",
      marketing: "3.7. Marketing - Advertising and Promotion (0.8% of revenue)",
      other_services: "4. Other Services",
      legal_services: "4.1. Legal Services (0.5%)",
      development_fee_unit: "4.2. Development Fee - Unit Price (€/m²)",
      other_fees: "4.3. Other Fees/Permits/Footprints (1% of 2.1-2.6)",
      reserve: "5. Reserve",
      implementation_reserve: "5.1. Reserve for Implementation Costs (5%)",
      result: "Result",
    },
    pl: {
      title: "Część kosztowa",
      land_purchase: "1. Zakup projektu - Działka + projekt (€)",
      implementation: "2. Realizacja",
      above_ground_unit: "2.1. Kondygnacje nadziemne - cena jednostkowa (€/m²)",
      below_ground_unit: "2.2. Kondygnacje podziemne - cena jednostkowa (€/m²)",
      outdoor_areas_unit: "2.3. Powierzchnie zewnętrzne - cena jednostkowa (€/m²)",
      green_terrain_unit: "2.4. Zieleń na gruncie - cena jednostkowa (€/m²)",
      green_structure_unit: "2.5. Zieleń na konstrukcji - cena jednostkowa (€/m²)",
      engineering_networks: "2.6. Sieci inżynieryjne (4% z 2.1-2.5)",
      additional_costs: "3. Dodatkowe koszty budżetowe",
      project_management: "3.1. Zarządzanie projektem i deweloperką (3.5%)",
      site_equipment: "3.2. Urządzenie placu budowy (3%)",
      project_activity: "3.3. Działalność projektowa (3.5%)",
      engineering_activity: "3.4. Działalność inżynieryjna (1%)",
      supervision: "3.5. Nadzór budowlany/techniczny, BHP (1.5%)",
      other_services: "4. Inne usługi",
      legal_services: "4.1. Usługi prawne (0.5%)",
      development_fee_unit: "4.2. Opłata deweloperska - cena jednostkowa (€/m²)",
      other_fees: "4.3. Inne opłaty/pozwolenia/odciski (1% z 2.1-2.6)",
      reserve: "5. Rezerwa",
      implementation_reserve: "5.1. Rezerwa na koszty realizacji (5%)",
      result: "Wynik",
    },
    hu: {
      title: "Költségszakasz",
      land_purchase: "1. Projekt vásárlás - Telek + projekt (€)",
      implementation: "2. Megvalósítás",
      above_ground_unit: "2.1. Földfeletti szintek - egységár (€/m²)",
      below_ground_unit: "2.2. Földalatti szintek - egységár (€/m²)",
      outdoor_areas_unit: "2.3. Kültéri területek - egységár (€/m²)",
      green_terrain_unit: "2.4. Zöldterület terepen - egységár (€/m²)",
      green_structure_unit: "2.5. Zöldterület szerkezeten - egységár (€/m²)",
      engineering_networks: "2.6. Mérnöki hálózatok (4% 2.1-2.5-ből)",
      additional_costs: "3. További költségvetési költségek",
      project_management: "3.1. Projektmenedzsment és fejlesztés (3.5%)",
      site_equipment: "3.2. Építési terület berendezése (3%)",
      project_activity: "3.3. Tervezési tevékenység (3.5%)",
      engineering_activity: "3.4. Mérnöki tevékenység (1%)",
      supervision: "3.5. Építési/műszaki felügyelet, munkavédelem (1.5%)",
      other_services: "4. Egyéb szolgáltatások",
      legal_services: "4.1. Jogi szolgáltatások (0.5%)",
      development_fee_unit: "4.2. Fejlesztési díj - egységár (€/m²)",
      other_fees: "4.3. Egyéb díjak/engedélyek/lenyomatok (1% 2.1-2.6-ből)",
      reserve: "5. Tartalék",
      implementation_reserve: "5.1. Tartalék megvalósítási költségekre (5%)",
      result: "Eredmény",
    },
    de: {
      title: "Kostenabschnitt",
      land_purchase: "1. Projektkauf - Grundstück + Projekt (€)",
      implementation: "2. Umsetzung",
      above_ground_unit: "2.1. Oberirdische Geschosse - Einheitspreis (€/m²)",
      below_ground_unit: "2.2. Unterirdische Geschosse - Einheitspreis (€/m²)",
      outdoor_areas_unit: "2.3. Außenbereiche - Einheitspreis (€/m²)",
      green_terrain_unit: "2.4. Grünflächen auf Terrain - Einheitspreis (€/m²)",
      green_structure_unit: "2.5. Grünflächen auf Konstruktion - Einheitspreis (€/m²)",
      engineering_networks: "2.6. Ingenieurnetzwerke (4% von 2.1-2.5)",
      additional_costs: "3. Zusätzliche Budgetkosten",
      project_management: "3.1. Projektmanagement und Entwicklung (3.5%)",
      site_equipment: "3.2. Baustelleneinrichtung (3%)",
      project_activity: "3.3. Planungstätigkeit (3.5%)",
      engineering_activity: "3.4. Ingenieurtätigkeit (1%)",
      supervision: "3.5. Bau-/technische Aufsicht, Arbeitsschutz (1.5%)",
      other_services: "4. Sonstige Dienstleistungen",
      legal_services: "4.1. Rechtsdienstleistungen (0.5%)",
      development_fee_unit: "4.2. Entwicklungsgebühr - Einheitspreis (€/m²)",
      other_fees: "4.3. Sonstige Gebühren/Genehmigungen/Abdrücke (1% von 2.1-2.6)",
      reserve: "5. Reserve",
      implementation_reserve: "5.1. Reserve für Umsetzungskosten (5%)",
      result: "Ergebnis",
    }
  };

  const t = translations[language] || translations.en;
  const safeData = data || {};
  const safeProjectData = projectData || {};

  // Get project areas for calculations
  const gfaAbove = safeProjectData.gfa_above || 0;
  const gfaBelow = safeProjectData.gfa_below || 0;
  const pavedAreas = safeProjectData.paved_areas || 0;
  const greenTerrain = safeProjectData.green_areas_terrain || 0;
  const greenStructure = safeProjectData.green_areas_structure || 0;
  const salesAreaApartments = safeProjectData.sales_area_apartments || 0;

  // Calculate implementation costs
  const aboveGroundCost = gfaAbove * (safeData.above_ground_unit_price || 0);
  const belowGroundCost = gfaBelow * (safeData.below_ground_unit_price || 0);
  const outdoorAreasCost = pavedAreas * (safeData.outdoor_areas_unit_price || 0);
  const greenTerrainCost = greenTerrain * (safeData.green_terrain_unit_price || 0);
  const greenStructureCost = greenStructure * (safeData.green_structure_unit_price || 0);
  
  const totalImplementationBase = aboveGroundCost + belowGroundCost + outdoorAreasCost + greenTerrainCost + greenStructureCost;
  const engineeringNetworks = totalImplementationBase * 0.04;
  const totalImplementation = totalImplementationBase + engineeringNetworks;

  // Calculate additional costs (based on total implementation)
  const projectManagement = totalImplementation * 0.035;
  const siteEquipment = totalImplementation * 0.03;
  const projectActivity = totalImplementation * 0.035;
  const engineeringActivity = totalImplementation * 0.01;
  const supervision = totalImplementation * 0.015;
  
  const totalAdditionalCosts = projectManagement + siteEquipment + projectActivity + engineeringActivity + supervision;

  // Other services
  const legalServices = totalImplementation * 0.005;
  const developmentFee = salesAreaApartments * (safeData.development_fee_unit_price || 0);
  const otherFees = totalImplementation * 0.01;
  
  const totalOtherServices = legalServices + developmentFee + otherFees;

  // Reserve
  const implementationReserve = totalImplementation * 0.05;

  const handleChange = (field, value) => {
    onChange({ ...safeData, [field]: parseFloat(value) || 0 });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">{t.title}</h3>
      
      {/* 1. Land Purchase */}
      <div className="space-y-2">
        <Label className="text-base font-semibold">{t.land_purchase}</Label>
        <Input 
          type="number" 
          value={safeData.land_plus_project || ""} 
          onChange={(e) => handleChange('land_plus_project', e.target.value)} 
        />
      </div>

      {/* 2. Implementation */}
      <div className="space-y-4 border-t pt-4">
        <h4 className="text-base font-semibold text-foreground">{t.implementation}</h4>
        
        <div className="space-y-2">
          <Label>{t.above_ground_unit}</Label>
          <Input 
            type="number" 
            value={safeData.above_ground_unit_price || ""} 
            onChange={(e) => handleChange('above_ground_unit_price', e.target.value)} 
          />
          <p className="text-sm text-muted-foreground">{t.result}: {currencyFormatter(aboveGroundCost, 'EUR', '€', 2)}</p>
        </div>

        <div className="space-y-2">
          <Label>{t.below_ground_unit}</Label>
          <Input 
            type="number" 
            value={safeData.below_ground_unit_price || ""} 
            onChange={(e) => handleChange('below_ground_unit_price', e.target.value)} 
          />
          <p className="text-sm text-muted-foreground">{t.result}: {currencyFormatter(belowGroundCost, 'EUR', '€', 2)}</p>
        </div>

        <div className="space-y-2">
          <Label>{t.outdoor_areas_unit}</Label>
          <Input 
            type="number" 
            value={safeData.outdoor_areas_unit_price || ""} 
            onChange={(e) => handleChange('outdoor_areas_unit_price', e.target.value)} 
          />
          <p className="text-sm text-muted-foreground">{t.result}: {currencyFormatter(outdoorAreasCost, 'EUR', '€', 2)}</p>
        </div>

        <div className="space-y-2">
          <Label>{t.green_terrain_unit}</Label>
          <Input 
            type="number" 
            value={safeData.green_terrain_unit_price || ""} 
            onChange={(e) => handleChange('green_terrain_unit_price', e.target.value)} 
          />
          <p className="text-sm text-muted-foreground">{t.result}: {currencyFormatter(greenTerrainCost, 'EUR', '€', 2)}</p>
        </div>

        <div className="space-y-2">
          <Label>{t.green_structure_unit}</Label>
          <Input 
            type="number" 
            value={safeData.green_structure_unit_price || ""} 
            onChange={(e) => handleChange('green_structure_unit_price', e.target.value)} 
          />
          <p className="text-sm text-muted-foreground">{t.result}: {currencyFormatter(greenStructureCost, 'EUR', '€', 2)}</p>
        </div>

        <div className="bg-muted p-3 rounded-lg">
          <Label>{t.engineering_networks}</Label>
          <p className="text-lg font-semibold text-foreground">{currencyFormatter(engineeringNetworks, 'EUR', '€', 2)}</p>
        </div>
      </div>

      {/* 3. Additional Budget Costs */}
      <div className="space-y-4 border-t pt-4">
        <h4 className="text-base font-semibold text-foreground">{t.additional_costs}</h4>
        
        <div className="bg-muted p-3 rounded-lg space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">{t.project_management}</span>
            <span className="font-semibold">{currencyFormatter(projectManagement, 'EUR', '€', 2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">{t.site_equipment}</span>
            <span className="font-semibold">{currencyFormatter(siteEquipment, 'EUR', '€', 2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">{t.project_activity}</span>
            <span className="font-semibold">{currencyFormatter(projectActivity, 'EUR', '€', 2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">{t.engineering_activity}</span>
            <span className="font-semibold">{currencyFormatter(engineeringActivity, 'EUR', '€', 2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">{t.supervision}</span>
            <span className="font-semibold">{currencyFormatter(supervision, 'EUR', '€', 2)}</span>
          </div>
        </div>
      </div>

      {/* 4. Other Services */}
      <div className="space-y-4 border-t pt-4">
        <h4 className="text-base font-semibold text-foreground">{t.other_services}</h4>
        
        <div className="bg-muted p-3 rounded-lg space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">{t.legal_services}</span>
            <span className="font-semibold">{currencyFormatter(legalServices, 'EUR', '€', 2)}</span>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm">{t.development_fee_unit}</Label>
            <Input 
              type="number" 
              value={safeData.development_fee_unit_price || ""} 
              onChange={(e) => handleChange('development_fee_unit_price', e.target.value)} 
            />
            <p className="text-sm">{t.result}: {currencyFormatter(developmentFee, 'EUR', '€', 2)}</p>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm">{t.other_fees}</span>
            <span className="font-semibold">{currencyFormatter(otherFees, 'EUR', '€', 2)}</span>
          </div>
        </div>
      </div>

      {/* 5. Reserve */}
      <div className="space-y-4 border-t pt-4">
        <h4 className="text-base font-semibold text-foreground">{t.reserve}</h4>
        
        <div className="bg-muted p-3 rounded-lg">
          <div className="flex justify-between">
            <span className="text-sm">{t.implementation_reserve}</span>
            <span className="font-semibold">{currencyFormatter(implementationReserve, 'EUR', '€', 2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
