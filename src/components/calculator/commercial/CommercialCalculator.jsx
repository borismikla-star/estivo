import React, { useCallback, useMemo } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import CountrySelector from "../CountrySelector";
import PropertyInputs from "./PropertyInputs";
import IncomeInputs from "./IncomeInputs";
import OpexInputs from "./OpexInputs";
import CapExInputs from "./CapExInputs";
import FinancingInputs from "./FinancingInputs";
import AssumptionsInputs from "./AssumptionsInputs";
import LegislativeNotes from "../LegislativeNotes";


export default function CommercialCalculator({ projectData, onBulkUpdate, language, countryPresets, t }) {

  const translations = {
      en: {
          accordion_property_details: "Property Details",
          income: "Income & Reimbursements",
          opex: "Operating Expenses",
          capex: "Capital Expenditures (CapEx)",
          financing: "Financing",
          assumptions: "Assumptions & Tax Settings",
          entity_type: "Entity Type",
          entity_type_fo: "Individual (FO)",
          entity_type_po: "Legal Entity (PO)",
      },
      sk: {
          accordion_property_details: "Detaily nehnuteľnosti",
          income: "Príjmy a náhrady",
          opex: "Prevádzkové náklady",
          capex: "Kapitálové výdavky (CapEx)",
          financing: "Financovanie",
          assumptions: "Predpoklady a daňové nastavenia",
          entity_type: "Typ subjektu",
          entity_type_fo: "Fyzická osoba (FO)",
          entity_type_po: "Právnická osoba (PO)",
      },
      pl: {
          accordion_property_details: "Szczegóły nieruchomości",
          income: "Dochody i zwroty",
          opex: "Koszty operacyjne",
          capex: "Wydatki kapitałowe (CapEx)",
          financing: "Finansowanie",
          assumptions: "Założenia i ustawienia podatkowe",
          entity_type: "Typ podmiotu",
          entity_type_fo: "Osoba fizyczna (FO)",
          entity_type_po: "Osoba prawna (PO)",
      },
      hu: {
          accordion_property_details: "Ingatlan részletek",
          income: "Bevételek és megtérítések",
          opex: "Működési költségek",
          capex: "Tőkekiadások (CapEx)",
          financing: "Finanszírozás",
          assumptions: "Feltételezések és adóbeállítások",
          entity_type: "Entitás típusa",
          entity_type_fo: "Magánszemély (FO)",
          entity_type_po: "Jogi személy (PO)",
      },
      de: {
          accordion_property_details: "Immobiliendetails",
          income: "Einnahmen und Erstattungen",
          opex: "Betriebskosten",
          capex: "Investitionsausgaben (CapEx)",
          financing: "Finanzierung",
          assumptions: "Annahmen & Steuereinstellungen",
          entity_type: "Rechtsform",
          entity_type_fo: "Natürliche Person (FO)",
          entity_type_po: "Juristische Person (PO)",
      }
  };

  const t_calc = translations[language] || translations.en;

  const handleEntityTypeChange = useCallback((value) => {
    onBulkUpdate('entity_type', value);
  }, [onBulkUpdate]);

  const currentCountryPreset = countryPresets?.find(p => p.country_code === projectData.country);

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
        propertyData={projectData.property_data || {}}
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
        propertyData={projectData.property_data || {}}
        language={language} 
        onChange={(updatedData) => onBulkUpdate("opex_data", updatedData)} 
        t={t} 
      /> 
    },
    { 
      value: "item-4", 
      title: t_calc.capex, 
      content: <CapExInputs 
        data={projectData.capex_data || {}} 
        propertyData={projectData.property_data || {}}
        language={language} 
        onChange={(updatedData) => onBulkUpdate("capex_data", updatedData)} 
        t={t} 
      /> 
    },
    { 
      value: "item-5", 
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
      value: "item-6", 
      title: t_calc.assumptions, 
      content: <AssumptionsInputs 
        data={projectData.assumptions_data || {}} 
        language={language} 
        countryPreset={currentCountryPreset}
        onChange={(updatedData) => onBulkUpdate("assumptions_data", updatedData)} 
        t={t} 
      /> 
    },
  ], [t_calc, projectData, language, onBulkUpdate, t, currentCountryPreset]);

  // Get current entity type label
  const currentEntityLabel = projectData.entity_type === 'PO' ? t_calc.entity_type_po : t_calc.entity_type_fo;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CountrySelector
          projectData={projectData}
          onBulkUpdate={onBulkUpdate}
          countryPresets={countryPresets}
          language={language}
        />
        
        <div>
          <Label className="mb-2 block">{t_calc.entity_type}</Label>
          <Select 
            value={projectData.entity_type || 'FO'} 
            onValueChange={handleEntityTypeChange}
          >
            <SelectTrigger>
              <SelectValue>{currentEntityLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FO">{t_calc.entity_type_fo}</SelectItem>
              <SelectItem value="PO">{t_calc.entity_type_po}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

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