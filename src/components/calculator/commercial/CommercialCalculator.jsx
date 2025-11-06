import React, { useCallback, useMemo } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import CountrySelector from "../CountrySelector";
import PropertyInputs from "./PropertyInputs";
import IncomeInputs from "./IncomeInputs";
import OpexInputs from "./OpexInputs";
import FinancingInputs from "./FinancingInputs";
import AssumptionsInputs from "./AssumptionsInputs";
import LegislativeNotes from "../LegislativeNotes";


export default function CommercialCalculator({ projectData, onBulkUpdate, language, countryPresets, t }) {

  const handleCountryChange = useCallback((country, entityType) => {
    onBulkUpdate('property_data', { 
      ...projectData.property_data,
      country: country,
      entity_type: entityType
    });
  }, [projectData, onBulkUpdate]);

  const translations = {
      en: {
          accordion_property_details: "Property Details",
          income: "Income",
          opex: "Operating Expenses",
          financing: "Financing",
          assumptions: "Assumptions",
      },
      sk: {
          accordion_property_details: "Detaily nehnuteľnosti",
          income: "Príjmy",
          opex: "Prevádzkové náklady",
          financing: "Financovanie",
          assumptions: "Predpoklady",
      }
  };

  const t_calc = translations[language] || translations.en;

  const accordionItems = useMemo(() => [
    { 
      value: "item-1", 
      title: t_calc.accordion_property_details, 
      content: <PropertyInputs 
        data={projectData.property_data || {}} 
        language={language} 
        onChange={(updatedData) => onBulkUpdate("property_data", updatedData)} 
        t={t} 
      /> 
    },
    { 
      value: "item-2", 
      title: t_calc.income, 
      content: <IncomeInputs 
        data={projectData.income_data || {}} 
        language={language} 
        onChange={(updatedData) => onBulkUpdate("income_data", updatedData)} 
        t={t} 
      /> 
    },
    { 
      value: "item-3", 
      title: t_calc.opex, 
      content: <OpexInputs 
        data={projectData.opex_data || {}} 
        language={language} 
        onChange={(updatedData) => onBulkUpdate("opex_data", updatedData)} 
        t={t} 
      /> 
    },
    { 
      value: "item-4", 
      title: t_calc.financing, 
      content: <FinancingInputs 
        data={projectData.financing_data || {}} 
        totalInvestment={(projectData.property_data?.price || 0) + (projectData.property_data?.acquisition_costs || 0)} 
        language={language} 
        onChange={(updatedData) => onBulkUpdate("financing_data", updatedData)} 
        t={t} 
      /> 
    },
    { 
      value: "item-5", 
      title: t_calc.assumptions, 
      content: <AssumptionsInputs 
        data={projectData.assumptions_data || {}} 
        language={language} 
        onChange={(updatedData) => onBulkUpdate("assumptions_data", updatedData)} 
        t={t} 
      /> 
    },
  ], [t_calc, projectData, language, onBulkUpdate]);

  return (
    <div className="space-y-6">
      <CountrySelector
        projectData={projectData}
        onBulkUpdate={onBulkUpdate}
        countryPresets={countryPresets}
        language={language}
      />
      <Accordion type="multiple" defaultValue={['item-1', 'item-2']} className="w-full space-y-4">
          {accordionItems.map(item => (
            <AccordionItem key={item.value} value={item.value} className="border rounded-lg bg-white shadow-sm">
              <AccordionTrigger className="px-6 text-base font-semibold">{item.title}</AccordionTrigger>
              <AccordionContent className="px-6 pb-6 border-t pt-6">
                {item.content}
              </AccordionContent>
            </AccordionItem>
          ))}
      </Accordion>
      <LegislativeNotes preset={countryPresets.find(p => p.country_code === projectData.country)} language={language} t={t} />
    </div>
  );
}