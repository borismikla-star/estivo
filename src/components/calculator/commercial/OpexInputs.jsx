import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Calculator, Sparkles } from "lucide-react";
import InfoTooltip from "../../shared/InfoTooltip";

const AUTO_RATES = {
    property_tax: 0.002,
    insurance: 0.002,
    maintenance: 0.015,
    utilities: 0.005,
    other_expenses: 0.003,
};

export default function OpexInputs({ data, onChange, language = 'en', propertyData = {} }) {
    const [localData, setLocalData] = useState(() => {
        // On first load, default _auto to true unless explicitly set to false
        const init = { ...data };
        Object.keys(AUTO_RATES).forEach(field => {
            if (init[`${field}_auto`] !== false) {
                init[`${field}_auto`] = true;
            }
        });
        return init;
    });

    useEffect(() => {
        // Merge new data but ALWAYS keep _auto flags from prev state (never overwrite from data)
        setLocalData(prev => {
            const merged = { ...prev, ...data };
            // Restore _auto flags from prev (they are local UI state, not stored in data)
            Object.keys(AUTO_RATES).forEach(field => {
                merged[`${field}_auto`] = prev[`${field}_auto`] !== undefined ? prev[`${field}_auto`] : true;
            });
            return merged;
        });
    }, [data]);

    // Auto-calculate when price changes for fields in auto mode
    useEffect(() => {
        const price = propertyData.price || 0;
        if (price <= 0) return;
        setLocalData(prev => {
            const updates = {};
            Object.keys(AUTO_RATES).forEach(field => {
                if (prev[`${field}_auto`] === true) {
                    updates[field] = price * AUTO_RATES[field];
                }
            });
            if (Object.keys(updates).length === 0) return prev;
            const updated = { ...prev, ...updates };
            onChange(updated);
            return updated;
        });
    }, [propertyData.price]);

    const handleChange = (field, value) => {
        setLocalData(prev => {
            const updated = { ...prev, [field]: value, [`${field}_auto`]: false };
            onChange(updated);
            return updated;
        });
    };

    const toggleAutoMode = (field) => {
        setLocalData(prev => {
            const currentlyAuto = prev[`${field}_auto`] === true;
            let updated;
            if (currentlyAuto) {
                updated = { ...prev, [`${field}_auto`]: false };
            } else {
                const price = propertyData.price || 0;
                const autoValue = price * (AUTO_RATES[field] || 0);
                updated = { ...prev, [field]: autoValue, [`${field}_auto`]: true };
            }
            onChange(updated);
            return updated;
        });
    };

    const translations = {
        en: {
            auto_calculate: "Auto-calculate",
            property_tax: "Property Tax",
            property_tax_desc: "Annual property/real estate tax (auto: 0.2% of price)",
            insurance: "Property Insurance",
            insurance_desc: "Annual building and liability insurance (auto: 0.2% of price)",
            utilities: "Utilities",
            utilities_desc: "Water, electricity, gas if paid by owner (auto: 0.5% of price)",
            maintenance: "Repairs & Maintenance",
            maintenance_desc: "Annual repairs and upkeep (auto: 1.5% of price)",
            property_management: "Property Management Fee (%)",
            property_management_desc: "% of Effective Gross Income (typically 5-10%)",
            other_expenses: "Other Operating Expenses",
            other_expenses_desc: "Accounting, legal, HOA fees, etc. (auto: 0.3% of price)",
            tip: "Tip: Enable auto-calculate for typical market rates, or enter your specific costs manually.",
        },
        sk: {
            auto_calculate: "Automatický výpočet",
            property_tax: "Daň z nehnuteľnosti",
            property_tax_desc: "Ročná daň z nehnuteľnosti (auto: 0.2% z ceny)",
            insurance: "Poistenie nehnuteľnosti",
            insurance_desc: "Ročné poistenie budovy a zodpovednosti (auto: 0.2% z ceny)",
            utilities: "Energie",
            utilities_desc: "Voda, elektrina, plyn ak platí majiteľ (auto: 0.5% z ceny)",
            maintenance: "Opravy a údržba",
            maintenance_desc: "Ročné opravy a údržba (auto: 1.5% z ceny)",
            property_management: "Správa nehnuteľnosti (%)",
            property_management_desc: "% z Efektívneho hrubého príjmu (typicky 5-10%)",
            other_expenses: "Ostatné prevádzkové náklady",
            other_expenses_desc: "Účtovníctvo, právne, poplatky HOA, atď. (auto: 0.3% z ceny)",
            tip: "Tip: Zapnite automatický výpočet pre typické trhové sadzby alebo zadajte vlastné náklady manuálne.",
        },
        pl: {
            auto_calculate: "Automatyczne obliczanie",
            property_tax: "Podatek od nieruchomości",
            property_tax_desc: "Roczny podatek od nieruchomości (auto: 0.2% ceny)",
            insurance: "Ubezpieczenie nieruchomości",
            insurance_desc: "Roczne ubezpieczenie budynku i odpowiedzialności (auto: 0.2% ceny)",
            utilities: "Media",
            utilities_desc: "Woda, prąd, gaz jeśli płaci właściciel",
            maintenance: "Naprawy i konserwacja",
            maintenance_desc: "Roczne naprawy i konserwacja (auto: 1.5% ceny)",
            property_management: "Zarządzanie (%)",
            property_management_desc: "% Efektywnego Dochodu Brutto (zazwyczaj 5-10%)",
            other_expenses: "Inne koszty operacyjne",
            other_expenses_desc: "Księgowość, prawne, opłaty HOA, itp.",
            tip: "Wskazówka: Włącz automatyczne obliczanie dla typowych stawek rynkowych lub wprowadź własne koszty ręcznie.",
        },
        hu: {
            auto_calculate: "Automatikus számítás",
            property_tax: "Ingatlanadó",
            property_tax_desc: "Éves ingatlanadó (auto: 0.2% az árból)",
            insurance: "Ingatlan biztosítás",
            insurance_desc: "Éves épület- és felelősségbiztosítás (auto: 0.2% az árból)",
            utilities: "Közművek",
            utilities_desc: "Víz, villany, gáz ha a tulajdonos fizeti",
            maintenance: "Javítások és karbantartás",
            maintenance_desc: "Éves javítások és karbantartás (auto: 1.5% az árból)",
            property_management: "Ingatlankezelés (%)",
            property_management_desc: "% az Effektív Bruttó Bevételből (általában 5-10%)",
            other_expenses: "Egyéb működési költségek",
            other_expenses_desc: "Könyvelés, jogi, társasházi díjak, stb.",
            tip: "Tipp: Engedélyezze az automatikus számítást a tipikus piaci árakhoz, vagy adja meg saját költségeit manuálisan.",
        },
        de: {
            auto_calculate: "Automatische Berechnung",
            property_tax: "Grundsteuer",
            property_tax_desc: "Jährliche Grundsteuer (auto: 0.2% des Preises)",
            insurance: "Gebäudeversicherung",
            insurance_desc: "Jährliche Gebäude- und Haftpflichtversicherung (auto: 0.2% des Preises)",
            utilities: "Nebenkosten",
            utilities_desc: "Wasser, Strom, Gas wenn vom Eigentümer bezahlt",
            maintenance: "Reparaturen & Instandhaltung",
            maintenance_desc: "Jährliche Reparaturen und Instandhaltung (auto: 1.5% des Preises)",
            property_management: "Hausverwaltung (%)",
            property_management_desc: "% des Effektiven Bruttoeinkommens (normalerweise 5-10%)",
            other_expenses: "Sonstige Betriebskosten",
            other_expenses_desc: "Buchhaltung, Rechtsberatung, HOA-Gebühren, usw.",
            tip: "Tipp: Aktivieren Sie die automatische Berechnung für typische Marktpreise oder geben Sie Ihre spezifischen Kosten manuell ein.",
        }
    };

    const t = translations[language] || translations.en;

    const renderAutoField = (field, label, description, value) => {
        const auto = localData[`${field}_auto`] === true;
        return (
            <div key={field}>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Label>{label}</Label>
                        <InfoTooltip content={description} />
                    </div>
                    <div className="flex items-center gap-2">
                        <Switch
                            checked={auto}
                            onCheckedChange={() => toggleAutoMode(field)}
                            className="data-[state=checked]:bg-primary"
                        />
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            {auto ? <Sparkles className="w-3 h-3 text-primary" /> : <Calculator className="w-3 h-3" />}
                            {t.auto_calculate}
                        </span>
                    </div>
                </div>
                <div className="relative">
                    <Input
                        type="number"
                        value={value || ''}
                        onChange={(e) => handleChange(field, parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        disabled={auto}
                        className={auto ? 'bg-primary/5 border-primary/30' : ''}
                    />
                    {auto && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                    <strong>💡 {t.tip}</strong>
                </p>
            </div>

            {renderAutoField("property_tax", t.property_tax, t.property_tax_desc, localData.property_tax)}
            {renderAutoField("insurance", t.insurance, t.insurance_desc, localData.insurance)}
            {renderAutoField("maintenance", t.maintenance, t.maintenance_desc, localData.maintenance)}
            {renderAutoField("utilities", t.utilities, t.utilities_desc, localData.utilities)}

            <div>
                <div className="flex items-center gap-2 mb-2">
                    <Label>{t.property_management}</Label>
                    <InfoTooltip content={t.property_management_desc} />
                </div>
                <Input
                    type="number"
                    step="0.1"
                    value={localData.property_management || ''}
                    onChange={(e) => handleChange('property_management', parseFloat(e.target.value) || 0)}
                    placeholder="5"
                />
            </div>

            {renderAutoField("other_expenses", t.other_expenses, t.other_expenses_desc, localData.other_expenses)}
        </div>
    );
}