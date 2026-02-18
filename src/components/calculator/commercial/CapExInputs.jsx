import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Sparkles, Calculator } from "lucide-react";
import InfoTooltip from "../../shared/InfoTooltip";

export default function CapExInputs({ data, onChange, language = 'en', propertyData = {} }) {
    const [localData, setLocalData] = useState(data);

    useEffect(() => {
        setLocalData(data);
    }, [data]);

    const handleChange = (field, value) => {
        const updated = { ...localData, [field]: value, [`${field}_auto`]: false };
        setLocalData(updated);
        onChange(updated);
    };

    const autoCalc = (field, value) => {
        const updated = { ...localData, [field]: value, [`${field}_auto`]: true };
        setLocalData(updated);
        onChange(updated);
    };

    const toggleAuto = (field, computeFn) => {
        const isAuto = localData[`${field}_auto`] !== false;
        if (!isAuto) {
            autoCalc(field, computeFn());
        } else {
            const updated = { ...localData, [`${field}_auto`]: false };
            setLocalData(updated);
            onChange(updated);
        }
    };

    const price = propertyData.price || 0;

    // Auto-recalculate when price changes
    useEffect(() => {
        if (price <= 0) return;
        const updates = {};
        if (localData.roof_replacement_auto !== false) { updates.roof_replacement = Math.round(price * 0.003); updates.roof_replacement_auto = true; }
        if (localData.hvac_replacement_auto !== false) { updates.hvac_replacement = Math.round(price * 0.002); updates.hvac_replacement_auto = true; }
        if (localData.tenant_improvements_auto !== false) { updates.tenant_improvements = Math.round(price * 0.005); updates.tenant_improvements_auto = true; }
        if (Object.keys(updates).length > 0) {
            const updated = { ...localData, ...updates };
            setLocalData(updated);
            onChange(updated);
        }
    }, [price]);

    const AutoCapexField = ({ field, label, desc, computeFn }) => {
        const isAuto = localData[`${field}_auto`] !== false;
        return (
            <div>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Label>{label}</Label>
                        <InfoTooltip content={desc} />
                    </div>
                    <div className="flex items-center gap-2">
                        <Switch checked={isAuto} onCheckedChange={() => toggleAuto(field, computeFn)} className="data-[state=checked]:bg-primary" />
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            {isAuto ? <Sparkles className="w-3 h-3 text-primary" /> : <Calculator className="w-3 h-3" />}
                            {t.auto_calculate}
                        </span>
                    </div>
                </div>
                <div className="relative">
                    <Input
                        type="number"
                        value={localData[field] || ''}
                        onChange={(e) => handleChange(field, parseFloat(e.target.value) || 0)}
                        disabled={isAuto}
                        className={isAuto ? 'bg-primary/5 border-primary/30' : ''}
                        placeholder="0"
                    />
                    {isAuto && <div className="absolute right-3 top-1/2 -translate-y-1/2"><Sparkles className="w-4 h-4 text-primary animate-pulse" /></div>}
                </div>
            </div>
        );
    };

    const translations = {
        en: {
            title: "Capital Expenditures (CapEx)",
            info_text: "Set aside annual reserves for major repairs and tenant improvements. Critical for commercial properties.",
            auto_calculate: "Auto-calculate",
            capex_reserve_percent: "CapEx Reserve (% of NOI)",
            capex_reserve_desc: "Annual reserve for major repairs and replacements (typically 5-15%)",
            roof_replacement: "Roof Replacement Reserve (annual)",
            roof_desc: "Set aside for roof replacement every 20-30 years (auto: 0.3% of price)",
            hvac_replacement: "HVAC Replacement Reserve (annual)",
            hvac_desc: "Set aside for HVAC system replacement every 15-20 years (auto: 0.2% of price)",
            tenant_improvements: "Tenant Improvement Reserve (annual)",
            tenant_improvements_desc: "Budget for tenant buildouts and renovations (auto: 0.5% of price)",
            total_annual_capex: "Total Annual CapEx",
            specific_reserves: "Specific Reserves (Optional)",
        },
        sk: {
            title: "Kapitálové výdavky (CapEx)",
            info_text: "Odložte ročné rezervy na väčšie opravy a úpravy priestorov. Kľúčové pre komerčné nehnuteľnosti.",
            auto_calculate: "Automatický výpočet",
            capex_reserve_percent: "Rezerva CapEx (% z NOI)",
            capex_reserve_desc: "Ročná rezerva na väčšie opravy a výmeny (typicky 5-15%)",
            roof_replacement: "Rezerva na výmenu strechy (ročne)",
            roof_desc: "Odkladanie na výmenu strechy každých 20-30 rokov (auto: 0.3% z ceny)",
            hvac_replacement: "Rezerva na výmenu HVAC (ročne)",
            hvac_desc: "Odkladanie na výmenu klimatizácie každých 15-20 rokov (auto: 0.2% z ceny)",
            tenant_improvements: "Rezerva na úpravy priestorov (ročne)",
            tenant_improvements_desc: "Rozpočet na úpravy priestorov pre nájomcov (auto: 0.5% z ceny)",
            total_annual_capex: "Celkový ročný CapEx",
            specific_reserves: "Špecifické rezervy (voliteľné)",
        },
        pl: {
            title: "Wydatki kapitałowe (CapEx)",
            info_text: "Odłóż roczne rezerwy na poważne naprawy i ulepszenia dla najemców. Kluczowe dla nieruchomości komercyjnych.",
            auto_calculate: "Automatyczne obliczanie",
            capex_reserve_percent: "Rezerwa CapEx (% NOI)",
            capex_reserve_desc: "Roczna rezerwa na poważne naprawy i wymiany (zazwyczaj 5-15%)",
            roof_replacement: "Rezerwa na wymianę dachu (rocznie)",
            roof_desc: "Odkładanie na wymianę dachu co 20-30 lat (auto: 0.3% ceny)",
            hvac_replacement: "Rezerwa na wymianę HVAC (rocznie)",
            hvac_desc: "Odkładanie na wymianę klimatyzacji co 15-20 lat (auto: 0.2% ceny)",
            tenant_improvements: "Rezerwa na ulepszenia dla najemców (rocznie)",
            tenant_improvements_desc: "Budżet na adaptacje i remonty dla najemców (auto: 0.5% ceny)",
            total_annual_capex: "Całkowity roczny CapEx",
            specific_reserves: "Szczególne rezerwy (opcjonalnie)",
        },
        hu: {
            title: "Tőkekiadások (CapEx)",
            info_text: "Tegyél félre éves tartalékokat nagyobb javításokra és bérlői fejlesztésekre. Kritikus kereskedelmi ingatlanoknál.",
            auto_calculate: "Automatikus számítás",
            capex_reserve_percent: "CapEx tartalék (NOI %-a)",
            capex_reserve_desc: "Éves tartalék nagyobb javításokra és cserékre (általában 5-15%)",
            roof_replacement: "Tetőcsere tartalék (éves)",
            roof_desc: "Félretétel tetőcserére 20-30 évente (auto: 0.3% az árból)",
            hvac_replacement: "HVAC csere tartalék (éves)",
            hvac_desc: "Félretétel klímarendszer cseréjére 15-20 évente (auto: 0.2% az árból)",
            tenant_improvements: "Bérlői fejlesztések tartaléka (éves)",
            tenant_improvements_desc: "Költségvetés bérlői átalakításokra és felújításokra (auto: 0.5% az árból)",
            total_annual_capex: "Összes éves CapEx",
            specific_reserves: "Különleges tartalékok (opcionális)",
        },
        de: {
            title: "Investitionsausgaben (CapEx)",
            info_text: "Legen Sie jährliche Rücklagen für größere Reparaturen und Mieterausbauten an. Kritisch für Gewerbeimmobilien.",
            auto_calculate: "Automatische Berechnung",
            capex_reserve_percent: "CapEx-Rücklage (% des NOI)",
            capex_reserve_desc: "Jährliche Rücklage für größere Reparaturen und Austausch (normalerweise 5-15%)",
            roof_replacement: "Dachaustausch-Rücklage (jährlich)",
            roof_desc: "Rückstellung für Dachaustausch alle 20-30 Jahre (auto: 0.3% des Preises)",
            hvac_replacement: "HVAC-Austausch-Rücklage (jährlich)",
            hvac_desc: "Rückstellung für Klimaanlagenaustausch alle 15-20 Jahre (auto: 0.2% des Preises)",
            tenant_improvements: "Mieterausbau-Rücklage (jährlich)",
            tenant_improvements_desc: "Budget für Mieterausbauten und Renovierungen (auto: 0.5% des Preises)",
            total_annual_capex: "Gesamte jährliche CapEx",
            specific_reserves: "Besondere Rücklagen (optional)",
        }
    };

    const t = translations[language] || translations.en;

    const totalCapEx = (localData.roof_replacement || 0) + 
                       (localData.hvac_replacement || 0) + 
                       (localData.tenant_improvements || 0);

    return (
        <div className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                    <strong>ℹ️ {t.title}:</strong> {t.info_text}
                </p>
            </div>

            <div>
                <div className="flex items-center gap-2 mb-2">
                    <Label>{t.capex_reserve_percent}</Label>
                    <InfoTooltip content={t.capex_reserve_desc} />
                </div>
                <Input
                    type="number"
                    step="0.1"
                    value={localData.capex_reserve_percent || ''}
                    onChange={(e) => handleChange('capex_reserve_percent', parseFloat(e.target.value) || 0)}
                    placeholder="10"
                />
            </div>

            <div className="border-t pt-4">
                <h4 className="font-semibold mb-3 text-sm">{t.specific_reserves}</h4>
                <div className="space-y-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Label>{t.roof_replacement}</Label>
                            <InfoTooltip content={t.roof_desc} />
                        </div>
                        <Input
                            type="number"
                            value={localData.roof_replacement || ''}
                            onChange={(e) => handleChange('roof_replacement', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                        />
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Label>{t.hvac_replacement}</Label>
                            <InfoTooltip content={t.hvac_desc} />
                        </div>
                        <Input
                            type="number"
                            value={localData.hvac_replacement || ''}
                            onChange={(e) => handleChange('hvac_replacement', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                        />
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Label>{t.tenant_improvements}</Label>
                            <InfoTooltip content={t.tenant_improvements_desc} />
                        </div>
                        <Input
                            type="number"
                            value={localData.tenant_improvements || ''}
                            onChange={(e) => handleChange('tenant_improvements', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                        />
                    </div>
                </div>
            </div>

            {totalCapEx > 0 && (
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold">{t.total_annual_capex}:</span>
                        <span className="text-lg font-bold text-primary">€{totalCapEx.toLocaleString()}</span>
                    </div>
                </div>
            )}
        </div>
    );
}