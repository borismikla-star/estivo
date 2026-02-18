import React, { useState, useCallback, useMemo } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import InfoTooltip from "../../shared/InfoTooltip";
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
          entity_type: "Entity Type",
          entity_type_fo: "Individual (FO)",
          entity_type_po: "Legal Entity (PO)",
          entity_type_tooltip: "Choose between Individual (FO) or Legal Entity (PO) - affects tax calculations",
          vat_payer: "VAT Payer",
          vat_payer_tooltip: "If you are a VAT payer, VAT on investment costs can be reclaimed",
          vat_rate: "VAT Rate (%)",
      },
      sk: {
          accordion_property_details: "Detaily nehnuteľnosti",
          accordion_financing: "Financovanie",
          accordion_initial_costs: "Počiatočné náklady",
          accordion_operating_costs: "Prevádzkové náklady a predpoklady",
          entity_type: "Typ subjektu",
          entity_type_fo: "Fyzická osoba (FO)",
          entity_type_po: "Právnická osoba (PO)",
          entity_type_tooltip: "Vyberte medzi fyzickou osobou (FO) alebo právnickou osobou (PO) - ovplyvňuje daňové výpočty",
          vat_payer: "Platca DPH",
          vat_payer_tooltip: "Ak ste platca DPH, DPH z investičných nákladov je možné odpočítať",
          vat_rate: "Sadzba DPH (%)",
      },
      pl: {
          accordion_property_details: "Szczegóły nieruchomości",
          accordion_financing: "Finansowanie",
          accordion_initial_costs: "Koszty początkowe",
          accordion_operating_costs: "Koszty operacyjne i założenia",
          entity_type: "Typ podmiotu",
          entity_type_fo: "Osoba fizyczna (FO)",
          entity_type_po: "Osoba prawna (PO)",
          entity_type_tooltip: "Wybierz między osobą fizyczną (FO) a osobą prawną (PO) - wpływa na obliczenia podatkowe",
          vat_payer: "Podatnik VAT",
          vat_payer_tooltip: "Jeśli jesteś podatnikiem VAT, VAT od kosztów inwestycji można odliczyć",
          vat_rate: "Stawka VAT (%)",
      },
      hu: {
          accordion_property_details: "Ingatlan részletei",
          accordion_financing: "Finanszírozás",
          accordion_initial_costs: "Kezdeti költségek",
          accordion_operating_costs: "Működési költségek és feltételezések",
          entity_type: "Entitás típusa",
          entity_type_fo: "Magánszemély (FO)",
          entity_type_po: "Jogi személy (PO)",
          entity_type_tooltip: "Válasszon magánszemély (FO) vagy jogi személy (PO) között - befolyásolja az adószámításokat",
          vat_payer: "ÁFA fizető",
          vat_payer_tooltip: "Ha ÁFA fizető, a befektetési költségek ÁFÁja visszaigényelhető",
          vat_rate: "ÁFA kulcs (%)",
      },
      de: {
          accordion_property_details: "Immobiliendetails",
          accordion_financing: "Finanzierung",
          accordion_initial_costs: "Anfangskosten",
          accordion_operating_costs: "Betriebskosten & Annahmen",
          entity_type: "Rechtsform",
          entity_type_fo: "Natürliche Person (FO)",
          entity_type_po: "Juristische Person (PO)",
          entity_type_tooltip: "Wählen Sie zwischen natürlicher Person (FO) oder juristischer Person (PO) - beeinflusst Steuerberechnungen",
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

  const handleEntityTypeChange = useCallback((value) => {
    onBulkUpdate('entity_type', value);
  }, [onBulkUpdate]);

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
          purchasePrice={projectData.property_data?.purchase_price || 0}
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
          purchasePrice={projectData.property_data?.purchase_price || 0}
          annualRent={(projectData.property_data?.monthly_rent || 0) * 12}
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
            <p className="text-xs text-muted-foreground mt-1">{t_calc.entity_type_tooltip}</p>
          </div>
        </div>

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