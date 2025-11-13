import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calculator, Sparkles } from "lucide-react";
import InfoTooltip from "../../shared/InfoTooltip";

export default function OperatingInputs({ data, onChange, language = 'en', purchasePrice = 0, grossRevenue = 0 }) {
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
        if (purchasePrice > 0) {
            const updates = {};
            
            // Property Tax: 0.2% of property value annually
            if (autoMode.property_tax) {
                updates.property_tax = 0.2; // 0.2% (stored as percentage number)
                updates.property_tax_auto = true;
            }
            
            // Insurance: Higher for STR (€500-1200 annually)
            if (autoMode.insurance) {
                updates.insurance = purchasePrice > 300000 ? 90 : 60; // monthly
                updates.insurance_auto = true;
            }
            
            // Maintenance: 1.5% for Airbnb (higher turnover)
            if (autoMode.maintenance) {
                updates.maintenance = 1.5; // 1.5% of property value
                updates.maintenance_auto = true;
            }
            
            if (Object.keys(updates).length > 0) {
                const updated = { ...localData, ...updates };
                setLocalData(updated);
                onChange(updated);
            }
        }
    }, [purchasePrice, autoMode.property_tax, autoMode.insurance, autoMode.maintenance]);

    const handleChange = (field, value) => {
        const updated = { 
            ...localData, 
            [field]: parseFloat(value) || 0,
            [`${field}_auto`]: false
        };
        setLocalData(updated);
        onChange(updated);
        
        if (autoMode[field]) {
            setAutoMode(prev => ({ ...prev, [field]: false }));
        }
    };

    const toggleAutoMode = (field) => {
        const newAutoMode = { ...autoMode, [field]: !autoMode[field] };
        setAutoMode(newAutoMode);
        
        if (newAutoMode[field] && purchasePrice > 0) {
            let autoValue = 0;
            if (field === 'property_tax') autoValue = 0.2; // 0.2%
            if (field === 'insurance') autoValue = purchasePrice > 300000 ? 90 : 60;
            if (field === 'maintenance') autoValue = 1.5; // 1.5%
            
            const updated = { 
                ...localData, 
                [field]: autoValue,
                [`${field}_auto`]: true
            };
            setLocalData(updated);
            onChange(updated);
        }
    };

    const translations = {
        en: {
            title: "Operating Expenses",
            auto_calculate: "Auto",
            utilities: "Utilities",
            utilities_desc: "Monthly: electricity, water, gas, internet (auto: €80-150/month)",
            cleaning: "Cleaning Cost per Stay",
            cleaning_desc: "Professional cleaning between guests (typical: €40-80)",
            supplies: "Supplies & Consumables",
            supplies_desc: "Monthly: toiletries, coffee, cleaning products",
            property_tax: "Property Tax",
            property_tax_desc: "Annual property tax (auto: 0.2% of purchase price)",
            insurance: "Short-Term Rental Insurance",
            insurance_desc: "Monthly STR insurance (auto: €60-90/month)",
            maintenance: "Maintenance Reserve",
            maintenance_desc: "Annual maintenance (auto: 1.5% of property value)",
            hoa: "HOA Fees",
            hoa_desc: "Monthly homeowners association fees",
            property_mgmt: "Property Management",
            property_mgmt_desc: "% of gross revenue (typical: 15-25% for Airbnb)",
            other_expenses: "Other Annual Expenses",
            other_desc: "Licenses, permits, accounting, etc.",
        },
        sk: {
            title: "Prevádzkové náklady",
            auto_calculate: "Auto",
            utilities: "Energie",
            utilities_desc: "Mesačne: elektrina, voda, plyn, internet (auto: €80-150/mesiac)",
            cleaning: "Náklady na upratovanie za pobyt",
            cleaning_desc: "Profesionálne upratovanie medzi hosťami (typicky: €40-80)",
            supplies: "Spotrebný materiál",
            supplies_desc: "Mesačne: toaletné potreby, káva, čistiace prostriedky",
            property_tax: "Daň z nehnuteľnosti",
            property_tax_desc: "Ročná daň (auto: 0.2% z kúpnej ceny)",
            insurance: "Poistenie STR",
            insurance_desc: "Mesačné poistenie krátkodobého prenájmu (auto: €60-90/mesiac)",
            maintenance: "Rezerva na údržbu",
            maintenance_desc: "Ročná údržba (auto: 1.5% z hodnoty nehnuteľnosti)",
            hoa: "Poplatky HOA",
            hoa_desc: "Mesačné poplatky združenia vlastníkov",
            property_mgmt: "Správa nehnuteľnosti",
            property_mgmt_desc: "% z hrubých príjmov (typicky: 15-25% pre Airbnb)",
            other_expenses: "Ostatné ročné náklady",
            other_desc: "Licencie, povolenia, účtovníctvo, atď.",
        },
        pl: {
            title: "Koszty operacyjne",
            auto_calculate: "Auto",
            utilities: "Media",
            utilities_desc: "Miesięcznie: prąd, woda, gaz, internet (auto: €80-150/m-c)",
            cleaning: "Koszt sprzątania za pobyt",
            cleaning_desc: "Profesjonalne sprzątanie między gośćmi (typowo: €40-80)",
            supplies: "Materiały eksploatacyjne",
            supplies_desc: "Miesięcznie: przybory toaletowe, kawa, środki czyszczące",
            property_tax: "Podatek od nieruchomości",
            property_tax_desc: "Roczny podatek (auto: 0.2% ceny zakupu)",
            insurance: "Ubezpieczenie STR",
            insurance_desc: "Miesięczne ubezpieczenie najmu krótkoterminowego (auto: €60-90/m-c)",
            maintenance: "Rezerwa na konserwację",
            maintenance_desc: "Roczna konserwacja (auto: 1.5% wartości nieruchomości)",
            hoa: "Opłaty HOA",
            hoa_desc: "Miesięczne opłaty stowarzyszenia właścicieli",
            property_mgmt: "Zarządzanie",
            property_mgmt_desc: "% z przychodów brutto (typowo: 15-25% dla Airbnb)",
            other_expenses: "Inne roczne koszty",
            other_desc: "Licencje, pozwolenia, księgowość, itp.",
        },
        hu: {
            title: "Működési költségek",
            auto_calculate: "Auto",
            utilities: "Közművek",
            utilities_desc: "Havonta: villany, víz, gáz, internet (auto: €80-150/hó)",
            cleaning: "Takarítási költség tartózkodásonként",
            cleaning_desc: "Professzionális takarítás vendégek között (tipikusan: €40-80)",
            supplies: "Fogyóeszközök",
            supplies_desc: "Havonta: higiéniai cikkek, kávé, tisztítószerek",
            property_tax: "Ingatlanadó",
            property_tax_desc: "Éves adó (auto: 0.2% a vételárból)",
            insurance: "STR biztosítás",
            insurance_desc: "Havi rövid távú bérleti biztosítás (auto: €60-90/hó)",
            maintenance: "Karbantartási tartalék",
            maintenance_desc: "Éves karbantartás (auto: 1.5% ingatlan értékből)",
            hoa: "HOA díjak",
            hoa_desc: "Havi társasházi díjak",
            property_mgmt: "Ingatlankezelés",
            property_mgmt_desc: "% bruttó bevételből (tipikusan: 15-25% Airbnb-nél)",
            other_expenses: "Egyéb éves költségek",
            other_desc: "Engedélyek, könyvelés, stb.",
        },
        de: {
            title: "Betriebskosten",
            auto_calculate: "Auto",
            utilities: "Nebenkosten",
            utilities_desc: "Monatlich: Strom, Wasser, Gas, Internet (auto: €80-150/Monat)",
            cleaning: "Reinigungskosten pro Aufenthalt",
            cleaning_desc: "Professionelle Reinigung zwischen Gästen (typisch: €40-80)",
            supplies: "Verbrauchsmaterial",
            supplies_desc: "Monatlich: Toilettenartikel, Kaffee, Reinigungsmittel",
            property_tax: "Grundsteuer",
            property_tax_desc: "Jährliche Steuer (auto: 0.2% des Kaufpreises)",
            insurance: "STR Versicherung",
            insurance_desc: "Monatliche Kurzzeitvermietungsversicherung (auto: €60-90/Monat)",
            maintenance: "Instandhaltungsrücklage",
            maintenance_desc: "Jährliche Instandhaltung (auto: 1.5% des Immobilienwerts)",
            hoa: "HOA Gebühren",
            hoa_desc: "Monatliche Gebühren der Eigentümergemeinschaft",
            property_mgmt: "Hausverwaltung",
            property_mgmt_desc: "% des Bruttoumsatzes (typisch: 15-25% für Airbnb)",
            other_expenses: "Sonstige jährliche Kosten",
            other_desc: "Lizenzen, Genehmigungen, Buchhaltung, usw.",
        }
    };

    const t = translations[language] || translations.en;

    const AutoCalculateField = ({ field, label, description, value, placeholder = "0", step = "0.01", suffix = "" }) => (
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
                    step={step}
                    value={value || ''}
                    onChange={(e) => handleChange(field, e.target.value)}
                    placeholder={placeholder}
                    disabled={autoMode[field]}
                    className={autoMode[field] ? 'bg-primary/5 border-primary/30' : ''}
                />
                {autoMode[field] && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                    </div>
                )}
                {suffix && <span className="absolute right-10 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{suffix}</span>}
            </div>
        </div>
    );

    return (
        <div className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                    <strong>💡 Tip:</strong> Enable auto-calculate for typical Airbnb costs, or enter your specific expenses manually.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Label>{t.utilities}</Label>
                        <InfoTooltip content={t.utilities_desc} />
                    </div>
                    <div className="relative">
                        <Input
                            type="number"
                            value={localData.utilities || 0}
                            onChange={(e) => handleChange('utilities', e.target.value)}
                            placeholder="100"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€/mo</span>
                    </div>
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Label>{t.cleaning}</Label>
                        <InfoTooltip content={t.cleaning_desc} />
                    </div>
                    <div className="relative">
                        <Input
                            type="number"
                            value={localData.cleaning_cost_per_stay || 0}
                            onChange={(e) => handleChange('cleaning_cost_per_stay', e.target.value)}
                            placeholder="60"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€/stay</span>
                    </div>
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Label>{t.supplies}</Label>
                        <InfoTooltip content={t.supplies_desc} />
                    </div>
                    <div className="relative">
                        <Input
                            type="number"
                            value={localData.supplies || 0}
                            onChange={(e) => handleChange('supplies', e.target.value)}
                            placeholder="50"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€/mo</span>
                    </div>
                </div>

                <AutoCalculateField
                    field="property_tax"
                    label={t.property_tax}
                    description={t.property_tax_desc}
                    value={localData.property_tax}
                    step="0.01"
                    suffix="%"
                />

                <AutoCalculateField
                    field="insurance"
                    label={t.insurance}
                    description={t.insurance_desc}
                    value={localData.insurance}
                    suffix="€/mo"
                />

                <AutoCalculateField
                    field="maintenance"
                    label={t.maintenance}
                    description={t.maintenance_desc}
                    value={localData.maintenance}
                    suffix="%"
                />

                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Label>{t.hoa}</Label>
                        <InfoTooltip content={t.hoa_desc} />
                    </div>
                    <div className="relative">
                        <Input
                            type="number"
                            value={localData.hoa || 0}
                            onChange={(e) => handleChange('hoa', e.target.value)}
                            placeholder="0"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€/mo</span>
                    </div>
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Label>{t.property_mgmt}</Label>
                        <InfoTooltip content={t.property_mgmt_desc} />
                    </div>
                    <div className="relative">
                        <Input
                            type="number"
                            step="0.1"
                            value={localData.property_management || 0}
                            onChange={(e) => handleChange('property_management', e.target.value)}
                            placeholder="20"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
                    </div>
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Label>{t.other_expenses}</Label>
                        <InfoTooltip content={t.other_desc} />
                    </div>
                    <div className="relative">
                        <Input
                            type="number"
                            value={localData.other_expenses || 0}
                            onChange={(e) => handleChange('other_expenses', e.target.value)}
                            placeholder="0"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€/year</span>
                    </div>
                </div>
            </div>
        </div>
    );
}