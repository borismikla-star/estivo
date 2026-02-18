import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Calculator, Sparkles } from "lucide-react";
import InfoTooltip from "../../shared/InfoTooltip";

// Auto value calculators: (purchasePrice, annualRent) => value
const AUTO_DEFAULTS = {
    property_tax:       (p, r) => 0.2,
    insurance:          (p, r) => p > 300000 ? 70 : 40,
    maintenance:        (p, r) => 1,
    hoa:                (p, r) => 0,
    vacancy_rate:       (p, r) => 5,
    property_management:(p, r) => 8,
    utilities:          (p, r) => 0,
    other_expenses:     (p, r) => Math.round(p * 0.002),
};

export default function OperatingInputs({ data, onChange, language = 'en', purchasePrice = 0, annualRent = 0 }) {
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

    // Recalculate auto fields when purchase price or rent changes
    useEffect(() => {
        if (purchasePrice <= 0) return;
        setLocalData(prev => {
            const updates = {};
            Object.entries(AUTO_DEFAULTS).forEach(([field, fn]) => {
                if (prev[`${field}_auto`] === true) {
                    updates[field] = fn(purchasePrice, annualRent);
                    updates[`${field}_auto`] = true;
                }
            });
            if (Object.keys(updates).length === 0) return prev;
            const updated = { ...prev, ...updates };
            onChange(updated);
            return updated;
        });
    }, [purchasePrice, annualRent]);

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
                const autoVal = AUTO_DEFAULTS[field](purchasePrice, annualRent);
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
            autoCalculateTip: "Tip: Enable auto-calculate for typical market rates, or enter your specific costs manually.",
            property_tax: "Property Tax",
            property_tax_desc: "Annual property tax (auto: 0.2% of purchase price)",
            insurance: "Property Insurance",
            insurance_desc: "Monthly insurance (auto: €40-70/month based on property value)",
            hoa_fees: "HOA/Common Fees",
            hoa_desc: "Monthly common area fees (auto: €0 – enter if applicable)",
            maintenance: "Maintenance Reserve",
            maintenance_desc: "Annual maintenance (auto: 1% of property value)",
            vacancy_rate: "Expected Vacancy Rate (%)",
            vacancy_desc: "Expected % of time property is vacant (auto: 5%)",
            property_mgmt: "Property Management Fee",
            property_mgmt_desc: "% of annual rent (auto: 8% – typical for long-term)",
            utilities: "Utilities",
            utilities_desc: "Monthly utilities if paid by owner (auto: €0 – usually tenant pays)",
            other_expenses: "Other Annual Expenses",
            other_desc: "Legal, accounting, etc. (auto: 0.2% of purchase price)",
            per_month: "/mo",
            per_year: "/year",
        },
        sk: {
            auto_calculate: "Auto",
            autoCalculateTip: "Tip: Zapnite automatické výpočty pre typické trhové sadzby alebo zadajte vlastné náklady manuálne.",
            property_tax: "Daň z nehnuteľnosti",
            property_tax_desc: "Ročná daň (auto: 0.2% z kúpnej ceny)",
            insurance: "Poistenie",
            insurance_desc: "Mesačné poistenie (auto: €40-70/mesiac podľa hodnoty)",
            hoa_fees: "Spoločné poplatky",
            hoa_desc: "Mesačné poplatky za spoločné priestory (auto: €0 – zadajte ak platí)",
            maintenance: "Rezerva na údržbu",
            maintenance_desc: "Ročná údržba (auto: 1% z hodnoty nehnuteľnosti)",
            vacancy_rate: "Očakávaná neobsadenosť (%)",
            vacancy_desc: "Očakávané % času keď je nehnuteľnosť prázdna (auto: 5%)",
            property_mgmt: "Správa nehnuteľnosti",
            property_mgmt_desc: "% z ročného nájmu (auto: 8% – typicky dlhodobý nájom)",
            utilities: "Energie",
            utilities_desc: "Mesačné energie ak platí vlastník (auto: €0 – zvyčajne platí nájomník)",
            other_expenses: "Ostatné ročné náklady",
            other_desc: "Právne, účtovníctvo, atď. (auto: 0.2% z kúpnej ceny)",
            per_month: "/mes",
            per_year: "/rok",
        },
        pl: {
            auto_calculate: "Auto",
            autoCalculateTip: "Tip: Włącz automatyczne obliczenia dla typowych stawek rynkowych lub wprowadź swoje koszty ręcznie.",
            property_tax: "Podatek od nieruchomości",
            property_tax_desc: "Roczny podatek (auto: 0.2% ceny zakupu)",
            insurance: "Ubezpieczenie",
            insurance_desc: "Miesięczne ubezpieczenie (auto: €40-70/m-c w zależności od wartości)",
            hoa_fees: "Opłaty wspólne",
            hoa_desc: "Miesięczne opłaty za części wspólne (auto: €0 – wpisz jeśli dotyczy)",
            maintenance: "Rezerwa na konserwację",
            maintenance_desc: "Roczna konserwacja (auto: 1% wartości nieruchomości)",
            vacancy_rate: "Oczekiwany wskaźnik pustostanów (%)",
            vacancy_desc: "Oczekiwany % czasu gdy nieruchomość jest pusta (auto: 5%)",
            property_mgmt: "Zarządzanie nieruchomością",
            property_mgmt_desc: "% z rocznego czynszu (auto: 8% – typowo długoterminowy)",
            utilities: "Media",
            utilities_desc: "Miesięczne media jeśli płaci właściciel (auto: €0 – zwykle lokator płaci)",
            other_expenses: "Inne roczne koszty",
            other_desc: "Prawne, księgowość, itp. (auto: 0.2% ceny zakupu)",
            per_month: "/mies",
            per_year: "/rok",
        },
        hu: {
            auto_calculate: "Auto",
            autoCalculateTip: "Tip: Engedélyezze az automatikus számítást a tipikus piaci árakhoz, vagy adja meg saját költségeit manuálisan.",
            property_tax: "Ingatlanadó",
            property_tax_desc: "Éves adó (auto: 0.2% a vételárból)",
            insurance: "Biztosítás",
            insurance_desc: "Havi biztosítás (auto: €40-70/hó érték alapján)",
            hoa_fees: "Közös költség",
            hoa_desc: "Havi közös terület díjak (auto: €0 – adja meg ha vonatkozik)",
            maintenance: "Karbantartási tartalék",
            maintenance_desc: "Éves karbantartás (auto: 1% ingatlan értékből)",
            vacancy_rate: "Várható üresedési arány (%)",
            vacancy_desc: "Várható % idő amikor az ingatlan üres (auto: 5%)",
            property_mgmt: "Ingatlankezelés",
            property_mgmt_desc: "% éves bérleti díjból (auto: 8% – hosszú távú tipikus)",
            utilities: "Közművek",
            utilities_desc: "Havi közművek ha a tulajdonos fizeti (auto: €0 – általában bérlő fizeti)",
            other_expenses: "Egyéb éves költségek",
            other_desc: "Jogi, könyvelés, stb. (auto: 0.2% vételárból)",
            per_month: "/hó",
            per_year: "/év",
        },
        de: {
            auto_calculate: "Auto",
            autoCalculateTip: "Tipp: Aktivieren Sie die automatische Berechnung für typische Marktpreise oder geben Sie Ihre spezifischen Kosten manuell ein.",
            property_tax: "Grundsteuer",
            property_tax_desc: "Jährliche Steuer (auto: 0.2% des Kaufpreises)",
            insurance: "Versicherung",
            insurance_desc: "Monatliche Versicherung (auto: €40-70/Monat je nach Wert)",
            hoa_fees: "Hausgeld",
            hoa_desc: "Monatliche Gemeinschaftskosten (auto: €0 – falls zutreffend eingeben)",
            maintenance: "Instandhaltungsrücklage",
            maintenance_desc: "Jährliche Instandhaltung (auto: 1% des Immobilienwerts)",
            vacancy_rate: "Erwartete Leerstandsquote (%)",
            vacancy_desc: "Erwarteter % der Zeit wenn Immobilie leer steht (auto: 5%)",
            property_mgmt: "Hausverwaltung",
            property_mgmt_desc: "% der Jahresmiete (auto: 8% – typisch Langzeitmiete)",
            utilities: "Nebenkosten",
            utilities_desc: "Monatliche Nebenkosten wenn vom Eigentümer bezahlt (auto: €0 – meist Mieter zahlt)",
            other_expenses: "Sonstige jährliche Kosten",
            other_desc: "Rechtsberatung, Buchhaltung, usw. (auto: 0.2% des Kaufpreises)",
            per_month: "/Mon",
            per_year: "/Jahr",
        }
    };

    const t = translations[language] || translations.en;

    const AutoField = ({ field, label, description, value, placeholder = "0", step = "0.01", suffix = "" }) => {
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
                <AutoField field="property_tax" label={t.property_tax} description={t.property_tax_desc}
                    value={localData.property_tax} placeholder="0.2" step="0.01" suffix="%" />

                <AutoField field="insurance" label={t.insurance} description={t.insurance_desc}
                    value={localData.insurance} placeholder="40" step="1" suffix={`€${t.per_month}`} />

                <AutoField field="maintenance" label={t.maintenance} description={t.maintenance_desc}
                    value={localData.maintenance} placeholder="1" step="0.01" suffix="%" />

                <AutoField field="hoa" label={t.hoa_fees} description={t.hoa_desc}
                    value={localData.hoa} placeholder="0" step="1" suffix={`€${t.per_month}`} />

                <AutoField field="vacancy_rate" label={t.vacancy_rate} description={t.vacancy_desc}
                    value={localData.vacancy_rate} placeholder="5" step="0.1" suffix="%" />

                <AutoField field="property_management" label={t.property_mgmt} description={t.property_mgmt_desc}
                    value={localData.property_management} placeholder="8" step="0.1" suffix="%" />

                <AutoField field="utilities" label={t.utilities} description={t.utilities_desc}
                    value={localData.utilities} placeholder="0" step="1" suffix={`€${t.per_month}`} />

                <AutoField field="other_expenses" label={t.other_expenses} description={t.other_desc}
                    value={localData.other_expenses} placeholder="0" step="1" suffix={`€${t.per_year}`} />
            </div>
        </div>
    );
}