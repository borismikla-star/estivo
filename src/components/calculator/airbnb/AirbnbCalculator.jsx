import React, { useState, useCallback, useMemo } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import CountrySelector from "../CountrySelector";
import PropertyInputs from "./PropertyInputs";
import IncomeInputs from "./IncomeInputs";
import OperatingInputs from "./OperatingInputs";
import FinancingInputsAirbnb from "../long_term_lease/FinancingInputs";
import LegislativeNotes from "../LegislativeNotes";
import VatInputBanner from "../VatInputBanner";
import InfoTooltip from "../../shared/InfoTooltip";

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
          entity_type: "Entity Type",
          entity_type_fo: "Individual (FO)",
          entity_type_fo_rental: "Individual – Rental (FO)",
          entity_type_fo_business: "Individual – Business (FO)",
          entity_type_po: "Legal Entity (PO)",
          entity_type_tooltip: "Choose entity type – affects tax and levy calculations",
          vat_payer: "VAT Payer",
          vat_payer_tooltip: "If you are a VAT payer, VAT on investment costs can be reclaimed",
          vat_rate: "VAT Rate (%)",
      },
      sk: {
          accordion_property_details: "Detaily nehnuteľnosti",
          accordion_income: "Príjmy",
          accordion_operating_costs: "Prevádzkové náklady",
          accordion_financing: "Financovanie",
          entity_type: "Typ subjektu",
          entity_type_fo: "Fyzická osoba (FO)",
          entity_type_fo_rental: "FO – prenájom (§6 ods.3)",
          entity_type_fo_business: "FO – podnikanie (SZČO)",
          entity_type_po: "Právnická osoba (PO)",
          entity_type_tooltip: "Typ subjektu ovplyvňuje výpočet dane a odvodov",
          vat_payer: "Platca DPH",
          vat_payer_tooltip: "Ak ste platca DPH, DPH z investičných nákladov je možné odpočítať",
          vat_rate: "Sadzba DPH (%)",
      },
      pl: {
          accordion_property_details: "Szczegóły nieruchomości",
          accordion_income: "Dochody",
          accordion_operating_costs: "Koszty operacyjne",
          accordion_financing: "Finansowanie",
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
          accordion_income: "Bevétel",
          accordion_operating_costs: "Működési költségek",
          accordion_financing: "Finanszírozás",
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
          accordion_income: "Einkommen",
          accordion_operating_costs: "Betriebskosten",
          accordion_financing: "Finanzierung",
          entity_type: "Rechtsform",
          entity_type_fo: "Natürliche Person (FO)",
          entity_type_po: "Juristische Person (PO)",
          entity_type_tooltip: "Wählen Sie zwischen natürlicher Person (FO) oder juristischer Person (PO) - beeinflusst Steuerberechnungen",
          vat_payer: "Umsatzsteuerpflichtig",
          vat_payer_tooltip: "Als Umsatzsteuerpflichtiger kann die Umsatzsteuer auf Investitionskosten erstattet werden",
          vat_rate: "MwSt-Satz (%)",
      }
  };

  const t_calc = translations[language] || translations.en;

  const handleEntityTypeChange = useCallback((value) => {
    onBulkUpdate('entity_type', value);
  }, [onBulkUpdate]);

  const handleVatPayerChange = useCallback((checked) => {
    onBulkUpdate('operating_data', { ...projectData.operating_data, is_vat_payer: checked });
  }, [onBulkUpdate, projectData.operating_data]);

  const handleVatRateChange = useCallback((value) => {
    onBulkUpdate('operating_data', { ...projectData.operating_data, vat_rate: parseFloat(value) || 0 });
  }, [onBulkUpdate, projectData.operating_data]);

  const accordionItems = useMemo(() => [
    {
      value: "item-1",
      title: t_calc.accordion_property_details,
      content: <PropertyInputs 
        data={projectData.property_data || {}} 
        onChange={(updatedData) => onBulkUpdate('property_data', updatedData)} 
        language={language}
        isVatPayer={projectData.operating_data?.is_vat_payer === true}
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
        purchasePrice={ensureNumber(projectData.property_data?.purchase_price)}
        isVatPayer={projectData.operating_data?.is_vat_payer === true}
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
        purchasePrice={projectData.property_data?.purchase_price || 0}
        grossRevenue={(ensureNumber(projectData.income_data?.avg_nightly_rate)) * 365 * ((ensureNumber(projectData.income_data?.occupancy_rate)) / 100)}
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

  const isSK = projectData.country === 'SK';

  // Get current entity type label
  const currentEntityLabel = projectData.entity_type === 'PO'
    ? t_calc.entity_type_po
    : projectData.entity_type === 'FO_business'
    ? (t_calc.entity_type_fo_business || 'FO – Business')
    : projectData.entity_type === 'FO_rental'
    ? (t_calc.entity_type_fo_rental || 'FO – Rental')
    : t_calc.entity_type_fo;

  return (
     <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CountrySelector
          projectData={projectData}
          onBulkUpdate={onBulkUpdate}
          countryPresets={countryPresets}
          language={language}
        />
        
        <div>
          <Label className="mb-2 block">{t_calc.entity_type}</Label>
          <Select 
            value={projectData.entity_type || (isSK ? 'FO_business' : 'FO')} 
            onValueChange={handleEntityTypeChange}
          >
            <SelectTrigger>
              <SelectValue>{currentEntityLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {isSK ? (
                <>
                  <SelectItem value="FO_rental">{t_calc.entity_type_fo_rental || 'FO – Rental'}</SelectItem>
                  <SelectItem value="FO_business">{t_calc.entity_type_fo_business || 'FO – Business'}</SelectItem>
                  <SelectItem value="PO">{t_calc.entity_type_po}</SelectItem>
                </>
              ) : (
                <>
                  <SelectItem value="FO">{t_calc.entity_type_fo}</SelectItem>
                  <SelectItem value="PO">{t_calc.entity_type_po}</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">{t_calc.entity_type_tooltip}</p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label>{t_calc.vat_payer}</Label>
              <InfoTooltip content={t_calc.vat_payer_tooltip} />
            </div>
            <Switch
              checked={projectData.operating_data?.is_vat_payer !== false}
              onCheckedChange={handleVatPayerChange}
            />
          </div>
          {projectData.operating_data?.is_vat_payer && (
            <div>
              <Label className="mb-1 block text-sm">{t_calc.vat_rate}</Label>
              <Input
                type="number"
                step="0.1"
                value={projectData.operating_data?.vat_rate ?? (projectData.country === 'SK' ? 20 : 21)}
                onChange={(e) => handleVatRateChange(e.target.value)}
                placeholder="20"
              />
            </div>
          )}
        </div>
      </div>

      <VatInputBanner isVatPayer={projectData.operating_data?.is_vat_payer === true} language={language} />

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