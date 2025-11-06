import React, { useCallback, useMemo } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import CountrySelector from "../CountrySelector";
import ProjectInfoInputs from "./ProjectInfoInputs";
import CostInputs from "./CostInputs";
import RevenueInputs from "./RevenueInputs";
import FinancingInputs from "./FinancingInputs";
import LegislativeNotes from "../LegislativeNotes";

export default function DevelopmentCalculator({ projectData, onBulkUpdate, language, countryPresets }) {
  const translations = {
    en: {
      project_info: "Project Information",
      costs: "Costs",
      revenue: "Revenue",
      financing: "Financing",
    },
    sk: {
      project_info: "Informácie o projekte",
      costs: "Náklady",
      revenue: "Tržby",
      financing: "Financovanie",
    },
    pl: {
      project_info: "Informacje o projekcie",
      costs: "Koszty",
      revenue: "Przychody",
      financing: "Finansowanie",
    },
    hu: {
      project_info: "Projekt információk",
      costs: "Költségek",
      revenue: "Bevételek",
      financing: "Finanszírozás",
    },
    de: {
      project_info: "Projektinformationen",
      costs: "Kosten",
      revenue: "Einnahmen",
      financing: "Finanzierung",
    }
  };

  const t = translations[language] || translations.en;

  // Calculate total costs and revenue for financing calculations
  const project_info = projectData.project_info_data || {};
  const cost_data = projectData.cost_data || {};
  const revenue_data = projectData.revenue_data || {};

  // Calculate totals for financing section
  const calculateTotalCosts = useCallback(() => {
    const num = (val) => parseFloat(val) || 0;
    
    // Land + Project
    const landAndProject = num(cost_data.land_and_project);
    
    // Implementation
    const gfaAbove = num(project_info.gfa_above);
    const gfaBelow = num(project_info.gfa_below);
    const pavedAreas = num(project_info.paved_areas);
    const greenTerrain = num(project_info.green_areas_terrain);
    const greenStructure = num(project_info.green_areas_structure);
    
    const aboveGround = gfaAbove * num(cost_data.above_ground_unit_price);
    const belowGround = gfaBelow * num(cost_data.below_ground_unit_price);
    const outdoor = pavedAreas * num(cost_data.outdoor_areas_unit_price);
    const greenT = greenTerrain * num(cost_data.greenery_terrain_unit_price);
    const greenS = greenStructure * num(cost_data.greenery_structure_unit_price);
    
    const implementationSubtotal = aboveGround + belowGround + outdoor + greenT + greenS;
    const engineeringNetworks = implementationSubtotal * 0.04;
    const totalImplementation = implementationSubtotal + engineeringNetworks;
    
    // Additional costs (percentages)
    const additionalBudget = totalImplementation * (0.035 + 0.03 + 0.035 + 0.01 + 0.015);
    
    // Other services
    const legalServices = totalImplementation * 0.005;
    const developmentFee = (num(project_info.sales_area_apartments) + 
                           num(project_info.sales_area_non_residential) + 
                           num(project_info.sales_area_balconies) + 
                           num(project_info.sales_area_gardens) + 
                           num(project_info.basement_area)) * num(cost_data.development_fee_per_m2);
    const otherFees = implementationSubtotal * 0.01;
    const totalOtherServices = legalServices + developmentFee + otherFees;
    
    // Reserve
    const reserve = totalImplementation * 0.05;
    
    return landAndProject + totalImplementation + additionalBudget + totalOtherServices + reserve;
  }, [project_info, cost_data]);

  const calculateTotalRevenue = useCallback(() => {
    const num = (val) => parseFloat(val) || 0;
    
    const apartments = num(project_info.sales_area_apartments) * num(revenue_data.apartments_unit_price);
    const nonRes = num(project_info.sales_area_non_residential) * num(revenue_data.non_residential_unit_price);
    const parkingIn = num(project_info.parking_indoor_count) * num(revenue_data.parking_indoor_unit_price);
    const parkingOut = num(project_info.parking_outdoor_count) * num(revenue_data.parking_outdoor_unit_price);
    const balconies = num(project_info.sales_area_balconies) * num(revenue_data.balconies_unit_price);
    const gardens = num(project_info.sales_area_gardens) * num(revenue_data.gardens_unit_price);
    const basements = num(project_info.basement_area) * num(revenue_data.basements_unit_price);
    const other = num(revenue_data.other_revenue);
    
    return apartments + nonRes + parkingIn + parkingOut + balconies + gardens + basements + other;
  }, [project_info, revenue_data]);

  const totalCosts = calculateTotalCosts();
  const totalRevenue = calculateTotalRevenue();

  const accordionItems = useMemo(() => [
    { 
      value: "item-1", 
      title: t.project_info, 
      content: <ProjectInfoInputs 
        data={project_info} 
        language={language} 
        onChange={(updatedData) => onBulkUpdate("project_info_data", updatedData)} 
      /> 
    },
    { 
      value: "item-2", 
      title: t.costs, 
      content: <CostInputs 
        data={cost_data}
        projectData={project_info}
        language={language} 
        onChange={(updatedData) => onBulkUpdate("cost_data", updatedData)} 
      /> 
    },
    { 
      value: "item-3", 
      title: t.revenue, 
      content: <RevenueInputs 
        data={revenue_data}
        projectData={project_info}
        language={language} 
        onChange={(updatedData) => onBulkUpdate("revenue_data", updatedData)} 
      /> 
    },
    { 
      value: "item-4", 
      title: t.financing, 
      content: <FinancingInputs 
        data={projectData.financing_data || {}}
        totalCosts={totalCosts}
        totalRevenue={totalRevenue}
        language={language} 
        onChange={(updatedData) => onBulkUpdate("financing_data", updatedData)} 
      /> 
    },
  ], [t, projectData, project_info, cost_data, revenue_data, totalCosts, totalRevenue, language, onBulkUpdate]);

  return (
    <div className="space-y-6">
        <CountrySelector
          projectData={projectData}
          onBulkUpdate={onBulkUpdate}
          countryPresets={countryPresets}
          language={language}
        />
        <Accordion type="multiple" defaultValue={['item-1']} className="w-full space-y-4">
          {accordionItems.map(item => (
            <AccordionItem key={item.value} value={item.value} className="border rounded-lg bg-white shadow-sm">
              <AccordionTrigger className="px-6 text-base font-semibold">{item.title}</AccordionTrigger>
              <AccordionContent className="px-6 pb-6 border-t pt-6">
                {item.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <LegislativeNotes preset={countryPresets?.find(p => p.country_code === projectData.country)} language={language} />
    </div>
  );
}