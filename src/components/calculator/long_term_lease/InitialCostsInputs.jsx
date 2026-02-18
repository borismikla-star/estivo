import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Calculator, Sparkles } from "lucide-react";
import InfoTooltip from '../../shared/InfoTooltip';

// Auto value calculators: (purchasePrice) => value
const AUTO_DEFAULTS = {
    acquisition_costs:  (p) => Math.round(p * 0.04),  // 4% of purchase price
    renovation_costs:   (p) => Math.round(p * 0.05),  // 5% of purchase price
    furnishing_costs:   (p) => 0,                      // typically unfurnished
    other_initial_costs:(p) => Math.round(p * 0.005), // 0.5%
};

export default function InitialCostsInputs({ data, onChange, language = 'en', purchasePrice = 0 }) {
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

    useEffect(() => {
        if (purchasePrice <= 0) return;
        setLocalData(prev => {
            const updates = {};
            Object.entries(AUTO_DEFAULTS).forEach(([field, fn]) => {
                if (prev[`${field}_auto`] === true) {
                    updates[field] = fn(purchasePrice);
                    updates[`${field}_auto`] = true;
                }
            });
            if (Object.keys(updates).length === 0) return prev;
            const updated = { ...prev, ...updates };
            onChange(updated);
            return updated;
        });
    }, [purchasePrice]);

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
                const autoVal = AUTO_DEFAULTS[field](purchasePrice);
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
            autoCalculateTip: "Tip: Enable auto-calculate for typical costs, or enter your specific values manually.",
            acquisition_costs: "Acquisition Costs",
            acquisition_tooltip: "Transfer tax, notary fees, registration fees, legal fees (auto: 4% of purchase price)",
            renovation: "Renovation/Repair Costs",
            renovation_tooltip: "Initial improvements and repairs before renting (auto: 5% of purchase price)",
            furnishing: "Furnishing Costs",
            furnishing_tooltip: "Furniture, appliances and equipment (auto: €0 – long-term usually unfurnished)",
            other_costs: "Other Initial Costs",
            other_tooltip: "Inspection, moving costs, etc. (auto: 0.5% of purchase price)",
        },
        sk: {
            auto_calculate: "Auto",
            autoCalculateTip: "Tip: Zapnite automatické výpočty pre typické náklady alebo zadajte vlastné hodnoty manuálne.",
            acquisition_costs: "Transakčné náklady",
            acquisition_tooltip: "Daň z prevodu, notárske poplatky, poplatky za registráciu, právne poplatky (auto: 4% z kúpnej ceny)",
            renovation: "Náklady na rekonštrukciu",
            renovation_tooltip: "Počiatočné úpravy a opravy pred prenájmom (auto: 5% z kúpnej ceny)",
            furnishing: "Náklady na zariadenie",
            furnishing_tooltip: "Nábytok, spotrebiče a vybavenie (auto: €0 – dlhodobý nájom zvyčajne nezariadený)",
            other_costs: "Ostatné počiatočné náklady",
            other_tooltip: "Inšpekcia, náklady na sťahovanie, atď. (auto: 0.5% z kúpnej ceny)",
        },
        pl: {
            auto_calculate: "Auto",
            autoCalculateTip: "Tip: Włącz automatyczne obliczenia dla typowych kosztów lub wprowadź własne wartości ręcznie.",
            acquisition_costs: "Koszty nabycia",
            acquisition_tooltip: "Podatek od transakcji, opłaty notarialne, rejestracyjne, prawne (auto: 4% ceny zakupu)",
            renovation: "Koszty renowacji/naprawy",
            renovation_tooltip: "Początkowe ulepszenia i naprawy przed wynajmem (auto: 5% ceny zakupu)",
            furnishing: "Koszty umeblowania",
            furnishing_tooltip: "Meble, urządzenia i wyposażenie (auto: €0 – długoterminowy zwykle nieumeblowany)",
            other_costs: "Inne koszty początkowe",
            other_tooltip: "Inspekcja, koszty przeprowadzki, itp. (auto: 0.5% ceny zakupu)",
        },
        hu: {
            auto_calculate: "Auto",
            autoCalculateTip: "Tip: Engedélyezze az automatikus számítást a tipikus költségekhez, vagy adja meg saját értékeit manuálisan.",
            acquisition_costs: "Vásárlási költségek",
            acquisition_tooltip: "Illeték, közjegyzői díjak, bejegyzési díjak, jogi díjak (auto: 4% vételárból)",
            renovation: "Felújítási/javítási költségek",
            renovation_tooltip: "Kezdeti fejlesztések és javítások a bérbeadás előtt (auto: 5% vételárból)",
            furnishing: "Bútorozási költségek",
            furnishing_tooltip: "Bútorok, készülékek és felszerelés (auto: €0 – hosszú távú általában bútorozatlan)",
            other_costs: "Egyéb kezdeti költségek",
            other_tooltip: "Szemle, költözési költségek stb. (auto: 0.5% vételárból)",
        },
        de: {
            auto_calculate: "Auto",
            autoCalculateTip: "Tipp: Aktivieren Sie die automatische Berechnung für typische Kosten oder geben Sie Ihre eigenen Werte manuell ein.",
            acquisition_costs: "Erwerbsnebenkosten",
            acquisition_tooltip: "Grunderwerbsteuer, Notargebühren, Grundbuchgebühren, Rechtsgebühren (auto: 4% des Kaufpreises)",
            renovation: "Renovierungs-/Reparaturkosten",
            renovation_tooltip: "Anfängliche Verbesserungen und Reparaturen vor Vermietung (auto: 5% des Kaufpreises)",
            furnishing: "Möblierungskosten",
            furnishing_tooltip: "Möbel, Geräte und Ausstattung (auto: €0 – Langzeitmiete meist unmöbliert)",
            other_costs: "Sonstige Anfangskosten",
            other_tooltip: "Inspektion, Umzugskosten usw. (auto: 0.5% des Kaufpreises)",
        }
    };

    const t = translations[language] || translations.en;

    const AutoField = ({ field, label, tooltip, value }) => {
        const isAuto = localData[`${field}_auto`] === true;
        return (
            <div>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Label>{label}</Label>
                        <InfoTooltip content={tooltip} />
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
                        value={value ?? ''}
                        onChange={(e) => handleChange(field, e.target.value)}
                        placeholder="0"
                        disabled={isAuto}
                        className={isAuto ? 'bg-primary/5 border-primary/30' : ''}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        {isAuto ? <Sparkles className="w-4 h-4 text-primary animate-pulse" /> : '€'}
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
                <AutoField field="acquisition_costs" label={t.acquisition_costs} tooltip={t.acquisition_tooltip} value={localData.acquisition_costs} />
                <AutoField field="renovation_costs" label={t.renovation} tooltip={t.renovation_tooltip} value={localData.renovation_costs} />
                <AutoField field="furnishing_costs" label={t.furnishing} tooltip={t.furnishing_tooltip} value={localData.furnishing_costs} />
                <AutoField field="other_initial_costs" label={t.other_costs} tooltip={t.other_tooltip} value={localData.other_initial_costs} />
            </div>
        </div>
    );
}