
import React, { useState, useCallback, useMemo } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import CountrySelector from "../CountrySelector";
import PropertyInputs from "./PropertyInputs";
import FinancingInputs from "./FinancingInputs";
import InitialCostsInputs from "./InitialCostsInputs";
import OperatingInputs from "./OperatingInputs";
import LegislativeNotes from "../LegislativeNotes";

export default function LongTermLeaseCalculator({ projectData, onFieldChange, onBulkUpdate, language, user, countryPresets, t }) {
  const [isEstimatingRent, setIsEstimatingRent] = useState(false);

  const translations = {
      en: {
          accordion_property_details: "Property Details",
          accordion_financing: "Financing",
          accordion_initial_costs: "Initial Costs",
          accordion_operating_costs: "Operating Costs & Assumptions",
      },
      sk: {
          accordion_property_details: "Detaily nehnuteľnosti",
          accordion_financing: "Financovanie",
          accordion_initial_costs: "Počiatočné náklady",
          accordion_operating_costs: "Prevádzkové náklady a predpoklady",
      },
      pl: {
          accordion_property_details: "Szczegóły nieruchomości",
          accordion_financing: "Finansowanie",
          accordion_initial_costs: "Koszty początkowe",
          accordion_operating_costs: "Koszty operacyjne i założenia",
      },
      hu: {
          accordion_property_details: "Ingatlan részletei",
          accordion_financing: "Finanszírozás",
          accordion_initial_costs: "Kezdeti költségek",
          accordion_operating_costs: "Működési költségek és feltételezések",
      },
      de: {
          accordion_property_details: "Immobiliendetails",
          accordion_financing: "Finanzierung",
          accordion_initial_costs: "Anfangskosten",
          accordion_operating_costs: "Betriebskosten & Annahmen",
      }
  };

  const t_calc = translations[language] || translations.en;

  // DISABLED TEMPORARILY - AI Rent Estimation
  const handleEstimateRent = useCallback(async () => {
    console.log("Rent estimation temporarily disabled");
  }, []);

  const handleCountryChange = useCallback((country, entityType) => {
    onBulkUpdate('property_data', { 
      ...projectData.property_data,
      country: country,
      entity_type: entityType
    });
  }, [projectData, onBulkUpdate]);

  const accordionItems = useMemo(() => [
    {
      value: "item-1",
      title: t_calc.accordion_property_details,
      content: (
        <PropertyInputs
          data={projectData.property_data || {}}
          language={language}
          onChange={(updatedData) => onBulkUpdate('property_data', updatedData)}
          onEstimateRent={handleEstimateRent}
          isEstimatingRent={isEstimatingRent}
          t={t_calc}
        />
      ),
    },
    {
      value: "item-2",
      title: t_calc.accordion_financing,
      content: (
        <FinancingInputs
          data={projectData.financing_data || {}}
          purchasePrice={projectData.property_data?.purchase_price || 0}
          language={language}
          onChange={(updatedData) => onBulkUpdate('financing_data', updatedData)}
          t={t_calc}
        />
      ),
    },
    {
      value: "item-3",
      title: t_calc.accordion_initial_costs,
      content: (
        <InitialCostsInputs
          data={projectData.initial_costs_data || {}}
          language={language}
          onChange={(updatedData) => onBulkUpdate('initial_costs_data', updatedData)}
          t={t_calc}
        />
      ),
    },
    {
      value: "item-4",
      title: t_calc.accordion_operating_costs,
      content: (
        <OperatingInputs
          data={projectData.operating_data || {}}
          countryPreset={countryPresets?.find(p => p.country_code === projectData.country)}
          language={language}
          onChange={(updatedData) => onBulkUpdate('operating_data', updatedData)}
          t={t_calc}
        />
      ),
    },
  ], [
    t_calc,
    projectData,
    language,
    onBulkUpdate,
    handleEstimateRent,
    isEstimatingRent,
    countryPresets
  ]);


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
            <AccordionItem key={item.value} value={item.value} className="border border-border rounded-lg bg-background/50 shadow-sm">
              <AccordionTrigger className="px-6 text-base font-semibold hover:no-underline">{item.title}</AccordionTrigger>
              <AccordionContent className="px-6 pb-6 border-t border-border pt-6">
                {item.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <LegislativeNotes preset={countryPresets?.find(p => p.country_code === projectData.country)} language={language} t={t} />
    </div>
  );
}
