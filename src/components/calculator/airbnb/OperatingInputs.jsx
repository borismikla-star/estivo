import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calculator, Sparkles } from "lucide-react";
import InfoTooltip from "../../shared/InfoTooltip";

// Auto value calculators: (purchasePrice, grossRevenue) => value
const AUTO_DEFAULTS = {
    property_tax:    (p, r) => 0.2,                                      // % of price
    insurance:       (p, r) => p > 300000 ? 90 : 60,                    // €/month
    maintenance:     (p, r) => 1.5,                                      // % of price
    utilities:       (p, r) => Math.round(p > 200000 ? 130 : 90),       // €/month
    cleaning_cost_per_stay: (p, r) => Math.round(p > 200000 ? 70 : 50), // €/stay
    supplies:        (p, r) => Math.round(p > 200000 ? 60 : 40),        // €/month
    hoa:             (p, r) => 0,                                        // €/month
    property_management: (p, r) => 20,                                   // % of gross revenue
    other_expenses:  (p, r) => Math.round(p * 0.002),                   // €/year
};

export default function OperatingInputs({ data, onChange, language = 'en', purchasePrice = 0, grossRevenue = 0 }) {
    const [localData, setLocalData] = useState(() => {
        const init = { ...data };
        Object.keys(AUTO_DEFAULTS).forEach(field => {
            if (init[`${field}_auto`] !== false) init[`${field}_auto`] = true;
        });
        return init;
    });

    useEffect(() => {
        setLocalData(prev => {
            const merged = { ...prev, ...data };
            Object.keys(AUTO_DEFAULTS).forEach(field => {
                merged[`${field}_auto`] = prev[`${field}_auto`] !== undefined ? prev[`${field}_auto`] : true;
            });
            return merged;
        });
    }, [data]);

    // Recalculate auto fields when purchase price changes
    useEffect(() => {
        if (purchasePrice <= 0) return;
        setLocalData(prev => {
            const updates = {};
            Object.entries(AUTO_DEFAULTS).forEach(([field, fn]) => {
                if (prev[`${field}_auto`] === true) {
                    updates[field] = fn(purchasePrice, grossRevenue);
                }
            });
            if (Object.keys(updates).length === 0) return prev;
            const updated = { ...prev, ...updates };
            onChange(updated);
            return updated;
        });
    }, [purchasePrice, grossRevenue]);

    const handleChange = (field, value) => {
        setLocalData(prev => {
            const updated = { ...prev, [field]: parseFloat(value) || 0, [`${field}_auto`]: false };
            onChange(updated);
            return updated;
        });
    };

    const toggleAuto = (field) => {
        setLocalData(prev => {
            const nowAuto = prev[`${field}_auto`] !== true;
            let updated;
            if (nowAuto) {
                const autoVal = AUTO_DEFAULTS[field](purchasePrice, grossRevenue);
                updated = { ...prev, [field]: autoVal, [`${field}_auto`]: true };
            } else {
                updated = { ...prev, [`${field}_auto`]: false };
            }
            onChange(updated);
            return updated;
        });
    };

    const translations = {
        en: {
            auto_calculate: "Auto",
            autoCalculateTip: "Tip: Enable auto-calculate for typical Airbnb costs, or enter your specific expenses manually.",
            utilities: "Utilities",
            utilities_desc: "Monthly: electricity, water, gas, internet (auto: €90-130/month)",
            cleaning: "Cleaning Cost per Stay",
            cleaning_desc: "Professional cleaning between guests (auto: €50-70/stay)",
            supplies: "Supplies & Consumables",
            supplies_desc: "Monthly: toiletries, coffee, cleaning products (auto: €40-60/month)",
            property_tax: "Property Tax",
            property_tax_desc: "Annual property tax (auto: 0.2% of purchase price)",
            insurance: "Short-Term Rental Insurance",
            insurance_desc: "Monthly STR insurance (auto: €60-90/month)",
            maintenance: "Maintenance Reserve",
            maintenance_desc: "Annual maintenance (auto: 1.5% of property value)",
            hoa: "HOA Fees",
            hoa_desc: "Monthly homeowners association fees (auto: €0 – enter if applicable)",
            property_mgmt: "Property Management",
            property_mgmt_desc: "% of gross revenue (auto: 20% – typical for Airbnb)",
            other_expenses: "Other Annual Expenses",
            other_desc: "Licenses, permits, accounting, etc. (auto: 0.2% of purchase price)",
            per_month: "/mo",
            per_year: "/year",
            per_stay: "/stay",
        },
        sk: {
            auto_calculate: "Auto",
            autoCalculateTip: "Tip: Zapnite automatické výpočty pre typické náklady Airbnb alebo zadajte vlastné náklady manuálne.",
            utilities: "Energie",
            utilities_desc: "Mesačne: elektrina, voda, plyn, internet (auto: €90-130/mesiac)",
            cleaning: "Náklady na upratovanie za pobyt",
            cleaning_desc: "Profesionálne upratovanie medzi hosťami (auto: €50-70/pobyt)",
            supplies: "Spotrebný materiál",
            supplies_desc: "Mesačne: toaletné potreby, káva, čistiace prostriedky (auto: €40-60/mesiac)",
            property_tax: "Daň z nehnuteľnosti",
            property_tax_desc: "Ročná daň (auto: 0.2% z kúpnej ceny)",
            insurance: "Poistenie STR",
            insurance_desc: "Mesačné poistenie krátkodobého prenájmu (auto: €60-90/mesiac)",
            maintenance: "Rezerva na údržbu",
            maintenance_desc: "Ročná údržba (auto: 1.5% z hodnoty nehnuteľnosti)",
            hoa: "Poplatky HOA",
            hoa_desc: "Mesačné poplatky združenia vlastníkov (auto: €0 – zadajte ak platí)",
            property_mgmt: "Správa nehnuteľnosti",
            property_mgmt_desc: "% z hrubých príjmov (auto: 20% – typicky pre Airbnb)",
            other_expenses: "Ostatné ročné náklady",
            other_desc: "Licencie, povolenia, účtovníctvo, atď. (auto: 0.2% z kúpnej ceny)",
            per_month: "/mes",
            per_year: "/rok",
            per_stay: "/pobyt",
        },
        pl: {
            auto_calculate: "Auto",
            autoCalculateTip: "Tip: Włącz automatyczne obliczenia dla typowych kosztów Airbnb lub wprowadź swoje koszty ręcznie.",
            utilities: "Media",
            utilities_desc: "Miesięcznie: prąd, woda, gaz, internet (auto: €90-130/m-c)",
            cleaning: "Koszt sprzątania za pobyt",
            cleaning_desc: "Profesjonalne sprzątanie między gośćmi (auto: €50-70/pobyt)",
            supplies: "Materiały eksploatacyjne",
            supplies_desc: "Miesięcznie: przybory toaletowe, kawa, środki czyszczące (auto: €40-60/m-c)",
            property_tax: "Podatek od nieruchomości",
            property_tax_desc: "Roczny podatek (auto: 0.2% ceny zakupu)",
            insurance: "Ubezpieczenie STR",
            insurance_desc: "Miesięczne ubezpieczenie najmu krótkoterminowego (auto: €60-90/m-c)",
            maintenance: "Rezerwa na konserwację",
            maintenance_desc: "Roczna konserwacja (auto: 1.5% wartości nieruchomości)",
            hoa: "Opłaty HOA",
            hoa_desc: "Miesięczne opłaty stowarzyszenia właścicieli (auto: €0 – wpisz jeśli dotyczy)",
            property_mgmt: "Zarządzanie",
            property_mgmt_desc: "% z przychodów brutto (auto: 20% – typowo dla Airbnb)",
            other_expenses: "Inne roczne koszty",
            other_desc: "Licencje, pozwolenia, księgowość, itp. (auto: 0.2% ceny zakupu)",
            per_month: "/mies",
            per_year: "/rok",
            per_stay: "/pobyt",
        },
        hu: {
            auto_calculate: "Auto",
            autoCalculateTip: "Tip: Engedélyezze az automatikus számítást a tipikus Airbnb költségekhez, vagy adja meg saját költségeit manuálisan.",
            utilities: "Közművek",
            utilities_desc: "Havonta: villany, víz, gáz, internet (auto: €90-130/hó)",
            cleaning: "Takarítási költség tartózkodásonként",
            cleaning_desc: "Professzionális takarítás vendégek között (auto: €50-70/tartózkodás)",
            supplies: "Fogyóeszközök",
            supplies_desc: "Havonta: higiéniai cikkek, kávé, tisztítószerek (auto: €40-60/hó)",
            property_tax: "Ingatlanadó",
            property_tax_desc: "Éves adó (auto: 0.2% a vételárból)",
            insurance: "STR biztosítás",
            insurance_desc: "Havi rövid távú bérleti biztosítás (auto: €60-90/hó)",
            maintenance: "Karbantartási tartalék",
            maintenance_desc: "Éves karbantartás (auto: 1.5% ingatlan értékből)",
            hoa: "HOA díjak",
            hoa_desc: "Havi társasházi díjak (auto: €0 – adja meg ha vonatkozik)",
            property_mgmt: "Ingatlankezelés",
            property_mgmt_desc: "% bruttó bevételből (auto: 20% – Airbnb-nél tipikus)",
            other_expenses: "Egyéb éves költségek",
            other_desc: "Engedélyek, könyvelés, stb. (auto: 0.2% vételárból)",
            per_month: "/hó",
            per_year: "/év",
            per_stay: "/tartózkodás",
        },
        de: {
            auto_calculate: "Auto",
            autoCalculateTip: "Tipp: Aktivieren Sie die automatische Berechnung für typische Airbnb-Kosten oder geben Sie Ihre spezifischen Ausgaben manuell ein.",
            utilities: "Nebenkosten",
            utilities_desc: "Monatlich: Strom, Wasser, Gas, Internet (auto: €90-130/Monat)",
            cleaning: "Reinigungskosten pro Aufenthalt",
            cleaning_desc: "Professionelle Reinigung zwischen Gästen (auto: €50-70/Aufenthalt)",
            supplies: "Verbrauchsmaterial",
            supplies_desc: "Monatlich: Toilettenartikel, Kaffee, Reinigungsmittel (auto: €40-60/Monat)",
            property_tax: "Grundsteuer",
            property_tax_desc: "Jährliche Steuer (auto: 0.2% des Kaufpreises)",
            insurance: "STR Versicherung",
            insurance_desc: "Monatliche Kurzzeitvermietungsversicherung (auto: €60-90/Monat)",
            maintenance: "Instandhaltungsrücklage",
            maintenance_desc: "Jährliche Instandhaltung (auto: 1.5% des Immobilienwerts)",
            hoa: "HOA Gebühren",
            hoa_desc: "Monatliche Gebühren der Eigentümergemeinschaft (auto: €0 – falls zutreffend eingeben)",
            property_mgmt: "Hausverwaltung",
            property_mgmt_desc: "% des Bruttoumsatzes (auto: 20% – typisch für Airbnb)",
            other_expenses: "Sonstige jährliche Kosten",
            other_desc: "Lizenzen, Genehmigungen, Buchhaltung, usw. (auto: 0.2% des Kaufpreises)",
            per_month: "/Mon",
            per_year: "/Jahr",
            per_stay: "/Aufenthalt",
        }
    };

    const t = translations[language] || translations.en;

    const AutoField = ({ field, label, description, value, placeholder = "0", step = "1", suffix = "" }) => {
        const isAuto = localData[`${field}_auto`] === true;
        return (
            <div>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Label>{label}</Label>
                        <InfoTooltip content={description} />
                    </div>
                    <div className="flex items-center gap-2">
                        <Switch
                            checked={isAuto}
                            onCheckedChange={() => toggleAuto(field)}
                            className="data-[state=checked]:bg-primary"
                        />
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            {isAuto ? <Sparkles className="w-3 h-3 text-primary" /> : <Calculator className="w-3 h-3" />}
                            {t.auto_calculate}
                        </span>
                    </div>
                </div>
                <div className="relative">
                    <Input
                        type="number"
                        step={step}
                        value={value ?? ''}
                        onChange={(e) => handleChange(field, e.target.value)}
                        placeholder={placeholder}
                        disabled={isAuto}
                        className={isAuto ? 'bg-primary/5 border-primary/30' : ''}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        {isAuto ? <Sparkles className="w-4 h-4 text-primary animate-pulse" /> : suffix}
                    </span>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                    <strong>💡 {t.autoCalculateTip}</strong>
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AutoField field="utilities" label={t.utilities} description={t.utilities_desc}
                    value={localData.utilities} placeholder="100" suffix={`€${t.per_month}`} />

                <AutoField field="cleaning_cost_per_stay" label={t.cleaning} description={t.cleaning_desc}
                    value={localData.cleaning_cost_per_stay} placeholder="60" suffix={`€${t.per_stay}`} />

                <AutoField field="supplies" label={t.supplies} description={t.supplies_desc}
                    value={localData.supplies} placeholder="50" suffix={`€${t.per_month}`} />

                <AutoField field="property_tax" label={t.property_tax} description={t.property_tax_desc}
                    value={localData.property_tax} placeholder="0.2" step="0.01" suffix="%" />

                <AutoField field="insurance" label={t.insurance} description={t.insurance_desc}
                    value={localData.insurance} placeholder="60" suffix={`€${t.per_month}`} />

                <AutoField field="maintenance" label={t.maintenance} description={t.maintenance_desc}
                    value={localData.maintenance} placeholder="1.5" step="0.01" suffix="%" />

                <AutoField field="hoa" label={t.hoa} description={t.hoa_desc}
                    value={localData.hoa} placeholder="0" suffix={`€${t.per_month}`} />

                <AutoField field="property_management" label={t.property_mgmt} description={t.property_mgmt_desc}
                    value={localData.property_management} placeholder="20" step="0.1" suffix="%" />
            </div>

            <AutoField field="other_expenses" label={t.other_expenses} description={t.other_desc}
                value={localData.other_expenses} placeholder="0" suffix={`€${t.per_year}`} />
        </div>
    );
}