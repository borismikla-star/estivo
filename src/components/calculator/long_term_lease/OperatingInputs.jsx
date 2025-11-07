import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
<parameter name="input">import { Switch } from "@/components/ui/switch";
import { Calculator, Sparkles } from "lucide-react";
import InfoTooltip from "../../shared/InfoTooltip";

export default function OperatingInputs({ data, onChange, language = 'en', purchasePrice = 0, annualRent = 0 }) {
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
            
            // Property Tax: 0.1-0.5% of property value annually
            if (autoMode.property_tax) {
                updates.property_tax = (purchasePrice * 0.002) / 100; // 0.2% as percentage for calculation
                updates.property_tax_auto = true;
            }
            
            // Insurance: €300-800 annually for typical residential
            if (autoMode.insurance) {
                updates.insurance = purchasePrice > 300000 ? 70 : 40; // monthly
                updates.insurance_auto = true;
            }
            
            // Maintenance: 1% of property value annually
            if (autoMode.maintenance) {
                updates.maintenance = 1; // 1% of property value
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
            if (field === 'property_tax') autoValue = (purchasePrice * 0.002) / 100;
            if (field === 'insurance') autoValue = purchasePrice > 300000 ? 70 : 40;
            if (field === 'maintenance') autoValue = 1;
            
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
            property_tax: "Property Tax",
            property_tax_desc: "Annual property tax (auto: 0.2% of purchase price)",
            insurance: "Property Insurance",
            insurance_desc: "Monthly insurance (auto: €40-70/month based on property value)",
            hoa_fees: "HOA/Common Fees",
            hoa_desc: "Monthly common area fees",
            maintenance: "Maintenance Reserve",
            maintenance_desc: "Annual maintenance (auto: 1% of property value)",
            vacancy_rate: "Expected Vacancy Rate (%)",
            vacancy_desc: "Expected percentage of time property is vacant (typical: 5%)",
            property_mgmt: "Property Management Fee",
            property_mgmt_desc: "% of annual rent (typical: 5-10%)",
            utilities: "Utilities",
            utilities_desc: "Monthly utilities if paid by owner",
            other_expenses: "Other Annual Expenses",
            other_desc: "HOA, legal, accounting, etc.",
        },
        sk: {
            title: "Prevádzkové náklady",
            auto_calculate: "Auto",
            property_tax: "Daň z nehnuteľnosti",
            property_tax_desc: "Ročná daň (auto: 0.2% z kúpnej ceny)",
            insurance: "Poistenie",
            insurance_desc: "Mesačné poistenie (auto: €40-70/mesiac podľa hodnoty)",
            hoa_fees: "Spoločné poplatky",
            hoa_desc: "Mesačné poplatky za spoločné priestory",
            maintenance: "Rezerva na údržbu",
            maintenance_desc: "Ročná údržba (auto: 1% z hodnoty nehnuteľnosti)",
            vacancy_rate: "Očakávaná neobsadenosť (%)",
            vacancy_desc: "Očakávané % času keď je nehnuteľnosť prázdna (typicky: 5%)",
            property_mgmt: "Správa nehnuteľnosti",
            property_mgmt_desc: "% z ročného nájmu (typicky: 5-10%)",
            utilities: "Energie",
            utilities_desc: "Mesačné energie ak platí vlastník",
            other_expenses: "Ostatné ročné náklady",
            other_desc: "HOA, právne, účtovníctvo, atď.",
        },
        pl: {
            title: "Koszty operacyjne",
            auto_calculate: "Auto",
            property_tax: "Podatek od nieruchomości",
            property_tax_desc: "Roczny podatek (auto: 0.2% ceny zakupu)",
            insurance: "Ubezpieczenie",
            insurance_desc: "Miesięczne ubezpieczenie (auto: €40-70/m-c w zależności od wartości)",
            hoa_fees: "Opłaty wspólne",
            hoa_desc: "Miesięczne opłaty za części wspólne",
            maintenance: "Rezerwa na konserwację",
            maintenance_desc: "Roczna konserwacja (auto: 1% wartości nieruchomości)",
            vacancy_rate: "Oczekiwany wskaźnik pustostanów (%)",
            vacancy_desc: "Oczekiwany % czasu gdy nieruchomość jest pusta (typowo: 5%)",
            property_mgmt: "Zarządzanie nieruchomością",
            property_mgmt_desc: "% z rocznego czynszu (typowo: 5-10%)",
            utilities: "Media",
            utilities_desc: "Miesięczne media jeśli płaci właściciel",
            other_expenses: "Inne roczne koszty",
            other_desc: "HOA, prawne, księgowość, itp.",
        },
        hu: {
            title: "Működési költségek",
            auto_calculate: "Auto",
            property_tax: "Ingatlanadó",
            property_tax_desc: "Éves adó (auto: 0.2% a vételárból)",
            insurance: "Biztosítás",
            insurance_desc: "Havi biztosítás (auto: €40-70/hó érték alapján)",
            hoa_fees: "Közös költség",
            hoa_desc: "Havi közös terület díjak",
            maintenance: "Karbantartási tartalék",
            maintenance_desc: "Éves karbantartás (auto: 1% ingatlan értékből)",
            vacancy_rate: "Várható üresedési arány (%)",
            vacancy_desc: "Várható % idő amikor az ingatlan üres (tipikusan: 5%)",
            property_mgmt: "Ingatlankezelés",
            property_mgmt_desc: "% éves bérleti díjból (tipikusan: 5-10%)",
            utilities: "Közművek",
            utilities_desc: "Havi közművek ha a tulajdonos fizeti",
            other_expenses: "Egyéb éves költségek",
            other_desc: "HOA, jogi, könyvelés, stb.",
        },
        de: {
            title: "Betriebskosten",
            auto_calculate: "Auto",
            property_tax: "Grundsteuer",
            property_tax_desc: "Jährliche Steuer (auto: 0.2% des Kaufpreises)",
            insurance: "Versicherung",
            insurance_desc: "Monatliche Versicherung (auto: €40-70/Monat je nach Wert)",
            hoa_fees: "Hausgeld",
            hoa_desc: "Monatliche Gemeinschaftskosten",
            maintenance: "Instandhaltungsrücklage",
            maintenance_desc: "Jährliche Instandhaltung (auto: 1% des Immobilienwerts)",
            vacancy_rate: "Erwartete Leerstandsquote (%)",
            vacancy_desc: "Erwarteter % der Zeit wenn Immobilie leer steht (typisch: 5%)",
            property_mgmt: "Hausverwaltung",
            property_mgmt_desc: "% der Jahresmiete (typisch: 5-10%)",
            utilities: "Nebenkosten",
            utilities_desc: "Monatliche Nebenkosten wenn vom Eigentümer bezahlt",
            other_expenses: "Sonstige jährliche Kosten",
            other_desc: "HOA, Rechtsberatung, Buchhaltung, usw.",
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
                    <strong>💡 Tip:</strong> Enable auto-calculate for typical market rates, or enter your specific costs manually.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AutoCalculateField
                    field="property_tax"
                    label={t.property_tax}
                    description={t.property_tax_desc}
                    value={localData.property_tax}
                    step="0.001"
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
                        <Label>{t.hoa_fees}</Label>
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
                        <Label>{t.vacancy_rate}</Label>
                        <InfoTooltip content={t.vacancy_desc} />
                    </div>
                    <div className="relative">
                        <Input
                            type="number"
                            step="0.1"
                            value={localData.vacancy_rate || 5}
                            onChange={(e) => handleChange('vacancy_rate', e.target.value)}
                            placeholder="5"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
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
                            placeholder="0"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
                    </div>
                </div>

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
                            placeholder="0"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€/mo</span>
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