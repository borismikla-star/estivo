import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Sparkles, Calculator } from "lucide-react";
import InfoTooltip from "../../shared/InfoTooltip";

export default function CapExInputs({ data, onChange, language = 'en' }) {
    const [localData, setLocalData] = useState(data);

    useEffect(() => {
        setLocalData(data);
    }, [data]);

    const handleChange = (field, value) => {
        const updated = { ...localData, [field]: value };
        setLocalData(updated);
        onChange(updated);
    };

    const translations = {
        en: {
            title: "Capital Expenditures (CapEx)",
            info_text: "Set aside annual reserves for major repairs and tenant improvements. Critical for commercial properties.",
            capex_reserve_percent: "CapEx Reserve (% of NOI)",
            capex_reserve_desc: "Annual reserve for major repairs and replacements (typically 5-15%)",
            roof_replacement: "Roof Replacement Reserve (annual)",
            roof_desc: "Set aside for roof replacement every 20-30 years",
            hvac_replacement: "HVAC Replacement Reserve (annual)",
            hvac_desc: "Set aside for HVAC system replacement every 15-20 years",
            tenant_improvements: "Tenant Improvement Reserve (annual)",
            tenant_improvements_desc: "Budget for tenant buildouts and renovations",
            total_annual_capex: "Total Annual CapEx",
            specific_reserves: "Specific Reserves (Optional)",
        },
        sk: {
            title: "Kapitálové výdavky (CapEx)",
            info_text: "Odložte ročné rezervy na väčšie opravy a úpravy priestorov. Kľúčové pre komerčné nehnuteľnosti.",
            capex_reserve_percent: "Rezerva CapEx (% z NOI)",
            capex_reserve_desc: "Ročná rezerva na väčšie opravy a výmeny (typicky 5-15%)",
            roof_replacement: "Rezerva na výmenu strechy (ročne)",
            roof_desc: "Odkladanie na výmenu strechy každých 20-30 rokov",
            hvac_replacement: "Rezerva na výmenu HVAC (ročne)",
            hvac_desc: "Odkladanie na výmenu klimatizácie každých 15-20 rokov",
            tenant_improvements: "Rezerva na úpravy priestorov (ročne)",
            tenant_improvements_desc: "Rozpočet na úpravy priestorov pre nájomcov",
            total_annual_capex: "Celkový ročný CapEx",
            specific_reserves: "Špecifické rezervy (voliteľné)",
        },
        pl: {
            title: "Wydatki kapitałowe (CapEx)",
            info_text: "Odłóż roczne rezerwy na poważne naprawy i ulepszenia dla najemców. Kluczowe dla nieruchomości komercyjnych.",
            capex_reserve_percent: "Rezerwa CapEx (% NOI)",
            capex_reserve_desc: "Roczna rezerwa na poważne naprawy i wymiany (zazwyczaj 5-15%)",
            roof_replacement: "Rezerwa na wymianę dachu (rocznie)",
            roof_desc: "Odkładanie na wymianę dachu co 20-30 lat",
            hvac_replacement: "Rezerwa na wymianę HVAC (rocznie)",
            hvac_desc: "Odkładanie na wymianę klimatyzacji co 15-20 lat",
            tenant_improvements: "Rezerwa na ulepszenia dla najemców (rocznie)",
            tenant_improvements_desc: "Budżet na adaptacje i remonty dla najemców",
            total_annual_capex: "Całkowity roczny CapEx",
            specific_reserves: "Szczególne rezerwy (opcjonalnie)",
        },
        hu: {
            title: "Tőkekiadások (CapEx)",
            info_text: "Tegyél félre éves tartalékokat nagyobb javításokra és bérlői fejlesztésekre. Kritikus kereskedelmi ingatlanoknál.",
            capex_reserve_percent: "CapEx tartalék (NOI %-a)",
            capex_reserve_desc: "Éves tartalék nagyobb javításokra és cserékre (általában 5-15%)",
            roof_replacement: "Tetőcsere tartalék (éves)",
            roof_desc: "Félretétel tetőcserére 20-30 évente",
            hvac_replacement: "HVAC csere tartalék (éves)",
            hvac_desc: "Félretétel klímarendszer cseréjére 15-20 évente",
            tenant_improvements: "Bérlői fejlesztések tartaléka (éves)",
            tenant_improvements_desc: "Költségvetés bérlői átalakításokra és felújításokra",
            total_annual_capex: "Összes éves CapEx",
            specific_reserves: "Különleges tartalékok (opcionális)",
        },
        de: {
            title: "Investitionsausgaben (CapEx)",
            info_text: "Legen Sie jährliche Rücklagen für größere Reparaturen und Mieterausbauten an. Kritisch für Gewerbeimmobilien.",
            capex_reserve_percent: "CapEx-Rücklage (% des NOI)",
            capex_reserve_desc: "Jährliche Rücklage für größere Reparaturen und Austausch (normalerweise 5-15%)",
            roof_replacement: "Dachaustausch-Rücklage (jährlich)",
            roof_desc: "Rückstellung für Dachaustausch alle 20-30 Jahre",
            hvac_replacement: "HVAC-Austausch-Rücklage (jährlich)",
            hvac_desc: "Rückstellung für Klimaanlagenaustausch alle 15-20 Jahre",
            tenant_improvements: "Mieterausbau-Rücklage (jährlich)",
            tenant_improvements_desc: "Budget für Mieterausbauten und Renovierungen",
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