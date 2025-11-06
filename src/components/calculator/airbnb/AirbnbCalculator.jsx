
import React, { useState, useCallback, useMemo } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import CountrySelector from "../CountrySelector";
import PropertyInputs from "./PropertyInputs";
import IncomeInputs from "./IncomeInputs";
import OperatingInputs from "./OperatingInputs";
import FinancingInputsAirbnb from "../long_term_lease/FinancingInputs";
import LegislativeNotes from "../LegislativeNotes";

export default function AirbnbCalculator({ projectData, onFieldChange, onBulkUpdate, language, countryPresets, t }) {
  const [isEstimatingRate, setIsEstimatingRate] = useState(false);

  // DISABLED TEMPORARILY - AI Rate Estimation
  const handleEstimateRate = useCallback(async () => {
    console.log("Rate estimation temporarily disabled");
  }, []);

  const ensureNumber = useCallback((value) => {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  }, []);

  const translations = {
      en: {
          accordion_property_details: "Property Details",
          accordion_income: "Income",
          accordion_operating_costs: "Operating Costs",
          accordion_financing: "Financing",
      },
      sk: {
          accordion_property_details: "Detaily nehnuteľnosti",
          accordion_income: "Príjmy",
          accordion_operating_costs: "Prevádzkové náklady",
          accordion_financing: "Financovanie",
      }
  };

  const t_calc = translations[language] || translations.en;

  const accordionItems = useMemo(() => [
    {
      value: "item-1",
      title: t_calc.accordion_property_details,
      content: <PropertyInputs 
        data={projectData.property_data || {}} 
        onChange={(updatedData) => onBulkUpdate('property_data', updatedData)} 
        language={language} 
        t={t} 
      />,
    },
    {
      value: "item-2",
      title: t_calc.accordion_income,
      content: <IncomeInputs
        data={projectData.income_data || {}}
        onChange={(updatedData) => onBulkUpdate('income_data', updatedData)}
        language={language}
        onEstimateRate={handleEstimateRate}
        isEstimatingRate={isEstimatingRate}
        t={t}
      />,
    },
    {
      value: "item-3",
      title: t_calc.accordion_operating_costs,
      content: <OperatingInputs 
        data={projectData.operating_data || {}} 
        onChange={(updatedData) => onBulkUpdate('operating_data', updatedData)} 
        language={language} 
        t={t} 
      />,
    },
    {
      value: "item-4",
      title: t_calc.accordion_financing,
      content: <FinancingInputsAirbnb
        data={projectData.financing_data || {}}
        purchasePrice={(ensureNumber(projectData.property_data?.purchase_price)) + (ensureNumber(projectData.property_data?.furnishing_cost)) + (ensureNumber(projectData.property_data?.acquisition_costs))}
        language={language}
        onChange={(updatedData) => onBulkUpdate("financing_data", updatedData)}
        t={t}
      />,
    },
  ], [t_calc, projectData, language, onBulkUpdate, handleEstimateRate, isEstimatingRate, ensureNumber, t]);

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
          <AccordionItem key={item.value} value={item.value} className="border rounded-lg bg-white">
            <AccordionTrigger className="px-6 text-base font-semibold">{item.title}</AccordionTrigger>
            <AccordionContent className="px-6 pb-6 border-t pt-6">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
       <LegislativeNotes preset={countryPresets?.find(p => p.country_code === projectData.country)} language={language} t={t} />
    </div>
  );
}
