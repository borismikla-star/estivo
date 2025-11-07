import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Calculator, Sparkles } from "lucide-react";
import InfoTooltip from "../../shared/InfoTooltip";

export default function OpexInputs({ data, onChange, language = 'en', propertyData = {} }) {
    const [localData, setLocalData] = useState(data);
    const [autoMode, setAutoMode] = useState({
        property_tax: data.property_tax_auto !== false,
        insurance: data.insurance_auto !== false,
        maintenance: data.maintenance_auto !== false,
    });

    useEffect(() => {
        setLocalData(data);
    }, [data]);

    // Auto-calculate when property data changes and auto mode is enabled
    useEffect(() => {
        const price = propertyData.price || 0;
        if (price > 0) {
            const updates = {};
            
            // Property Tax: 0.1-0.5% of property value annually
            if (autoMode.property_tax) {
                updates.property_tax = price * 0.002; // 0.2% default
                updates.property_tax_auto = true;
            }
            
            // Insurance: 0.1-0.3% of property value annually
            if (autoMode.insurance) {
                updates.insurance = price * 0.002; // 0.2% default
                updates.insurance_auto = true;
            }
            
            // Maintenance: 1-2% of property value annually
            if (autoMode.maintenance) {
                updates.maintenance = price * 0.015; // 1.5% default
                updates.maintenance_auto = true;
            }
            
            if (Object.keys(updates).length > 0) {
                const updated = { ...localData, ...updates };
                setLocalData(updated);
                onChange(updated);
            }
        }
    }, [propertyData.price, autoMode.property_tax, autoMode.insurance, autoMode.maintenance]);

    const handleChange = (field, value) => {
        const updated = { 
            ...localData, 
            [field]: value,
            [`${field}_auto`]: false // Disable auto when manually changed
        };
        setLocalData(updated);
        onChange(updated);
        
        // Update auto mode state
        if (autoMode[field]) {
            setAutoMode(prev => ({ ...prev, [field]: false }));
        }
    };

    const toggleAutoMode = (field) => {
        const newAutoMode = { ...autoMode, [field]: !autoMode[field] };
        setAutoMode(newAutoMode);
        
        // If enabling auto mode, recalculate
        if (newAutoMode[field]) {
            const price = propertyData.price || 0;
            if (price > 0) {
                let autoValue = 0;
                if (field === 'property_tax') autoValue = price * 0.002;
                if (field === 'insurance') autoValue = price * 0.002;
                if (field === 'maintenance') autoValue = price * 0.015;
                
                const updated = { 
                    ...localData, 
                    [field]: autoValue,
                    [`${field}_auto`]: true
                };
                setLocalData(updated);
                onChange(updated);
            }
        }
    };

    const translations = {
        en: {
            title: "Operating Expenses (Annual)",
            auto_calculate: "Auto-calculate",
            property_tax: "Property Tax",
            property_tax_desc: "Annual property/real estate tax (auto: 0.2% of price)",
            insurance: "Property Insurance",
            insurance_desc: "Annual building and liability insurance (auto: 0.2% of price)",
            utilities: "Utilities",
            utilities_desc: "Water, electricity, gas if paid by owner",
            maintenance: "Repairs & Maintenance",
            maintenance_desc: "Annual repairs and upkeep (auto: 1.5% of price)",
            property_management: "Property Management Fee (%)",
            property_management_desc: "% of Effective Gross Income (typically 5-10%)",
            other_expenses: "Other Operating Expenses",
            other_expenses_desc: "Accounting, legal, HOA fees, etc.",
        },
        sk: {
            title: "Prevádzkové náklady (ročné)",
            auto_calculate: "Automatický výpočet",
            property_tax: "Daň z nehnuteľnosti",
            property_tax_desc: "Ročná daň z nehnuteľnosti (auto: 0.2% z ceny)",
            insurance: "Poistenie nehnuteľnosti",
            insurance_desc: "Ročné poistenie budovy a zodpovednosti (auto: 0.2% z ceny)",
            utilities: "Energie",
            utilities_desc: "Voda, elektrina, plyn ak platí majiteľ",
            maintenance: "Opravy a údržba",
            maintenance_desc: "Ročné opravy a údržba (auto: 1.5% z ceny)",
            property_management: "Správa nehnuteľnosti (%)",
            property_management_desc: "% z Efektívneho hrubého príjmu (typicky 5-10%)",
            other_expenses: "Ostatné prevádzkové náklady",
            other_expenses_desc: "Účtovníctvo, právne, poplatky HOA, atď.",
        },
        pl: {
            title: "Koszty operacyjne (roczne)",
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
        },
        hu: {
            title: "Működési költségek (éves)",
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
        },
        de: {
            title: "Betriebskosten (jährlich)",
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
        }
    };

    const t = translations[language] || translations.en;

    const AutoCalculateField = ({ field, label, description, value, placeholder = "0" }) => (
        <div>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Label>{label}</Label>
                    <InfoTooltip content={description} />
                </div>
                <div className="flex items-center gap-2">
                    <Switch
                        checked={autoMode[field]}
                        onCheckedChange={() => toggleAutoMode(field)}
                        className="data-[state=checked]:bg-primary"
                    />
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                        {autoMode[field] ? <Sparkles className="w-3 h-3 text-primary" /> : <Calculator className="w-3 h-3" />}
                        {t.auto_calculate}
                    </span>
                </div>
            </div>
            <div className="relative">
                <Input
                    type="number"
                    value={value || ''}
                    onChange={(e) => handleChange(field, parseFloat(e.target.value) || 0)}
                    placeholder={placeholder}
                    disabled={autoMode[field]}
                    className={autoMode[field] ? 'bg-primary/5 border-primary/30' : ''}
                />
                {autoMode[field] && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                    <strong>💡 Tip:</strong> Enable auto-calculate for typical market rates, or enter your specific costs manually.
                </p>
            </div>

            <AutoCalculateField
                field="property_tax"
                label={t.property_tax}
                description={t.property_tax_desc}
                value={localData.property_tax}
            />

            <AutoCalculateField
                field="insurance"
                label={t.insurance}
                description={t.insurance_desc}
                value={localData.insurance}
            />

            <AutoCalculateField
                field="maintenance"
                label={t.maintenance}
                description={t.maintenance_desc}
                value={localData.maintenance}
            />

            <div>
                <div className="flex items-center gap-2 mb-2">
                    <Label>{t.utilities}</Label>
                    <InfoTooltip content={t.utilities_desc} />
                </div>
                <Input
                    type="number"
                    value={localData.utilities || ''}
                    onChange={(e) => handleChange('utilities', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                />
            </div>

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

            <div>
                <div className="flex items-center gap-2 mb-2">
                    <Label>{t.other_expenses}</Label>
                    <InfoTooltip content={t.other_expenses_desc} />
                </div>
                <Input
                    type="number"
                    value={localData.other_expenses || ''}
                    onChange={(e) => handleChange('other_expenses', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                />
            </div>
        </div>
    );
}