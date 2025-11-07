import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Calculator, Sparkles } from "lucide-react";
import InfoTooltip from "../../shared/InfoTooltip";

export default function IncomeInputs({ data, onChange, language = 'en', propertyData = {} }) {
    const [localData, setLocalData] = useState(data);
    const [autoMode, setAutoMode] = useState(data.annual_rent_auto !== false);

    useEffect(() => {
        setLocalData(data);
    }, [data]);

    // Auto-calculate annual rent when property data changes
    useEffect(() => {
        if (autoMode && propertyData.rentable_area_m2 > 0) {
            const propertyType = propertyData.property_type || 'office';
            
            // Market rates per m² per year by property type
            const ratePerM2 = {
                office: 150,      // €150/m²/year
                retail: 200,      // €200/m²/year
                industrial: 80,   // €80/m²/year
                mixed: 150        // €150/m²/year
            };
            
            const rate = ratePerM2[propertyType] || 150;
            const calculatedRent = propertyData.rentable_area_m2 * rate;
            
            if (calculatedRent !== localData.annual_rent) {
                const updated = { 
                    ...localData, 
                    annual_rent: calculatedRent,
                    annual_rent_auto: true
                };
                setLocalData(updated);
                onChange(updated);
            }
        }
    }, [propertyData.rentable_area_m2, propertyData.property_type, autoMode]);

    const handleChange = (field, value) => {
        const updated = { 
            ...localData, 
            [field]: value,
            ...(field === 'annual_rent' && { annual_rent_auto: false })
        };
        setLocalData(updated);
        onChange(updated);
        
        if (field === 'annual_rent' && autoMode) {
            setAutoMode(false);
        }
    };

    const toggleAutoMode = () => {
        const newAutoMode = !autoMode;
        setAutoMode(newAutoMode);
        
        if (newAutoMode && propertyData.rentable_area_m2 > 0) {
            const propertyType = propertyData.property_type || 'office';
            const ratePerM2 = {
                office: 150,
                retail: 200,
                industrial: 80,
                mixed: 150
            };
            const rate = ratePerM2[propertyType] || 150;
            const calculatedRent = propertyData.rentable_area_m2 * rate;
            
            const updated = { 
                ...localData, 
                annual_rent: calculatedRent,
                annual_rent_auto: true
            };
            setLocalData(updated);
            onChange(updated);
        }
    };

    const translations = {
        en: {
            annual_rent: "Annual Base Rent",
            annual_rent_desc: "Total annual rental income from all tenants",
            annual_rent_auto_desc: "Auto-calculated based on rentable area and property type",
            auto_calculate: "Auto-calculate",
            rent_escalation: "Annual Rent Escalation (%)",
            rent_escalation_desc: "Yearly rent increase percentage",
            cam_reimbursements: "CAM Reimbursements (annual)",
            cam_desc: "Common Area Maintenance costs passed to tenants",
            other_reimbursements: "Other Reimbursements (annual)",
            other_reimbursements_desc: "Utilities, insurance, or other recoverable expenses",
            other_income: "Other Income (annual)",
            other_income_desc: "Parking, signage, or other revenue",
            vacancy_rate: "Vacancy Rate (%)",
            vacancy_desc: "Expected percentage of vacant space",
            rate_info: "Market rates: Office €150/m²/year, Retail €200/m²/year, Industrial €80/m²/year",
        },
        sk: {
            annual_rent: "Ročné základné nájomné",
            annual_rent_desc: "Celkový ročný príjem z nájmov od všetkých nájomcov",
            annual_rent_auto_desc: "Automaticky vypočítané na základe prenajímateľnej plochy a typu nehnuteľnosti",
            auto_calculate: "Automatický výpočet",
            rent_escalation: "Ročné zvýšenie nájmu (%)",
            rent_escalation_desc: "Percentuálne ročné zvýšenie nájmu",
            cam_reimbursements: "Náhrady za správu (ročne)",
            cam_desc: "Náklady na správu spoločných priestorov hradené nájomcami",
            other_reimbursements: "Ostatné náhrady (ročne)",
            other_reimbursements_desc: "Energie, poistenie alebo iné vymáhateľné náklady",
            other_income: "Ostatné príjmy (ročne)",
            other_income_desc: "Parkovanie, reklama alebo iné príjmy",
            vacancy_rate: "Miera neobsadenosti (%)",
            vacancy_desc: "Očakávané percento neobsadených priestorov",
            rate_info: "Trhové sadzby: Kancelárie €150/m²/rok, Obchody €200/m²/rok, Priemysel €80/m²/rok",
        },
        pl: {
            annual_rent: "Roczny czynsz bazowy",
            annual_rent_desc: "Całkowity roczny dochód z najmu od wszystkich najemców",
            annual_rent_auto_desc: "Automatycznie obliczone na podstawie powierzchni do wynajęcia i typu nieruchomości",
            auto_calculate: "Automatyczne obliczanie",
            rent_escalation: "Roczny wzrost czynszu (%)",
            rent_escalation_desc: "Procentowy roczny wzrost czynszu",
            cam_reimbursements: "Zwroty kosztów zarządzania (rocznie)",
            cam_desc: "Koszty utrzymania części wspólnych pokrywane przez najemców",
            other_reimbursements: "Inne zwroty (rocznie)",
            other_reimbursements_desc: "Media, ubezpieczenie lub inne zwracane koszty",
            other_income: "Inne dochody (rocznie)",
            other_income_desc: "Parking, reklama lub inne przychody",
            vacancy_rate: "Wskaźnik pustostanów (%)",
            vacancy_desc: "Oczekiwany procent pustych powierzchni",
            rate_info: "Stawki rynkowe: Biura €150/m²/rok, Handel €200/m²/rok, Przemysł €80/m²/rok",
        },
        hu: {
            annual_rent: "Éves alap bérleti díj",
            annual_rent_desc: "Összes éves bérleti bevétel minden bérlőtől",
            annual_rent_auto_desc: "Automatikusan számítva bérelhető terület és ingatlan típus alapján",
            auto_calculate: "Automatikus számítás",
            rent_escalation: "Éves bérleti díj emelés (%)",
            rent_escalation_desc: "Százalékos éves bérleti díj növekedés",
            cam_reimbursements: "Közös költségek megtérítése (éves)",
            cam_desc: "Közös területek karbantartási költségei, melyeket a bérlők fizetnek",
            other_reimbursements: "Egyéb megtérítések (éves)",
            other_reimbursements_desc: "Közművek, biztosítás vagy más visszatéríthető költségek",
            other_income: "Egyéb bevétel (éves)",
            other_income_desc: "Parkolás, reklám vagy más bevétel",
            vacancy_rate: "Üresedési arány (%)",
            vacancy_desc: "Várható üres terület százaléka",
            rate_info: "Piaci árak: Iroda €150/m²/év, Kereskedelem €200/m²/év, Ipari €80/m²/év",
        },
        de: {
            annual_rent: "Jährliche Grundmiete",
            annual_rent_desc: "Gesamter jährlicher Mietertrag von allen Mietern",
            annual_rent_auto_desc: "Automatisch berechnet basierend auf vermietbarer Fläche und Immobilientyp",
            auto_calculate: "Automatische Berechnung",
            rent_escalation: "Jährliche Mietsteigerung (%)",
            rent_escalation_desc: "Prozentuale jährliche Mieterhöhung",
            cam_reimbursements: "Nebenkostenerstattungen (jährlich)",
            cam_desc: "Gemeinschaftskostenkosten, die auf Mieter umgelegt werden",
            other_reimbursements: "Sonstige Erstattungen (jährlich)",
            other_reimbursements_desc: "Nebenkosten, Versicherung oder andere erstattungsfähige Ausgaben",
            other_income: "Sonstige Einnahmen (jährlich)",
            other_income_desc: "Parkplatz, Werbung oder andere Einnahmen",
            vacancy_rate: "Leerstandsquote (%)",
            vacancy_desc: "Erwarteter Prozentsatz leerstehender Flächen",
            rate_info: "Marktpreise: Büro €150/m²/Jahr, Einzelhandel €200/m²/Jahr, Industrie €80/m²/Jahr",
        }
    };

    const t = translations[language] || translations.en;

    return (
        <div className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                    <strong>💡 {t.rate_info}</strong>
                </p>
            </div>

            <div>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Label>{t.annual_rent}</Label>
                        <InfoTooltip content={autoMode ? t.annual_rent_auto_desc : t.annual_rent_desc} />
                    </div>
                    <div className="flex items-center gap-2">
                        <Switch
                            checked={autoMode}
                            onCheckedChange={toggleAutoMode}
                            className="data-[state=checked]:bg-primary"
                        />
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            {autoMode ? <Sparkles className="w-3 h-3 text-primary" /> : <Calculator className="w-3 h-3" />}
                            {t.auto_calculate}
                        </span>
                    </div>
                </div>
                <div className="relative">
                    <Input
                        type="number"
                        value={localData.annual_rent || ''}
                        onChange={(e) => handleChange('annual_rent', parseFloat(e.target.value) || 0)}
                        disabled={autoMode}
                        className={autoMode ? 'bg-primary/5 border-primary/30' : ''}
                    />
                    {autoMode && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Label>{t.rent_escalation}</Label>
                        <InfoTooltip content={t.rent_escalation_desc} />
                    </div>
                    <Input
                        type="number"
                        step="0.1"
                        value={localData.rent_escalation_percent || ''}
                        onChange={(e) => handleChange('rent_escalation_percent', parseFloat(e.target.value) || 2)}
                        placeholder="2.0"
                    />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Label>{t.vacancy_rate}</Label>
                        <InfoTooltip content={t.vacancy_desc} />
                    </div>
                    <Input
                        type="number"
                        step="0.1"
                        value={localData.vacancy_rate || ''}
                        onChange={(e) => handleChange('vacancy_rate', parseFloat(e.target.value) || 5)}
                        placeholder="5"
                    />
                </div>
            </div>

            <div className="border-t pt-4">
                <h4 className="font-semibold mb-3 text-sm">Reimbursements & Other Income</h4>
                <div className="space-y-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Label>{t.cam_reimbursements}</Label>
                            <InfoTooltip content={t.cam_desc} />
                        </div>
                        <Input
                            type="number"
                            value={localData.cam_reimbursements || ''}
                            onChange={(e) => handleChange('cam_reimbursements', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                        />
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Label>{t.other_reimbursements}</Label>
                            <InfoTooltip content={t.other_reimbursements_desc} />
                        </div>
                        <Input
                            type="number"
                            value={localData.other_reimbursements || ''}
                            onChange={(e) => handleChange('other_reimbursements', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                        />
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Label>{t.other_income}</Label>
                            <InfoTooltip content={t.other_income_desc} />
                        </div>
                        <Input
                            type="number"
                            value={localData.other_income || ''}
                            onChange={(e) => handleChange('other_income', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}