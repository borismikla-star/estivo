import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import InfoTooltip from '../../shared/InfoTooltip';

export default function InitialCostsInputs({ data, onChange, language = 'en' }) {
    const [localData, setLocalData] = useState(data);

    useEffect(() => {
        setLocalData(data);
    }, [data]);

    const handleChange = (field, value) => {
        const updated = { ...localData, [field]: parseFloat(value) || 0 };
        setLocalData(updated);
        onChange(updated);
    };

    const translations = {
        en: {
            acquisition_costs: "Acquisition Costs",
            acquisition_tooltip: "Transfer tax, notary fees, registration fees, legal fees",
            renovation: "Renovation/Repair Costs",
            renovation_tooltip: "Initial improvements and repairs before renting out the property",
            furnishing: "Furnishing Costs",
            furnishing_tooltip: "Furniture, appliances, and equipment if property needs to be furnished",
            other_costs: "Other Initial Costs",
            other_tooltip: "Any additional upfront expenses (inspection, moving costs, etc.)",
        },
        sk: {
            acquisition_costs: "Transakčné náklady",
            acquisition_tooltip: "Daň z prevodu, notárske poplatky, poplatky za registráciu, právne poplatky",
            renovation: "Náklady na rekonštrukciu",
            renovation_tooltip: "Počiatočné úpravy a opravy pred prenájmom nehnuteľnosti",
            furnishing: "Náklady na zariadenie",
            furnishing_tooltip: "Nábytok, spotrebiče a vybavenie, ak je potrebné zariadiť nehnuteľnosť",
            other_costs: "Ostatné počiatočné náklady",
            other_tooltip: "Akékoľvek ďalšie vstupné výdavky (inšpekcia, náklady na sťahovanie, atď.)",
        },
        pl: {
            acquisition_costs: "Koszty nabycia",
            acquisition_tooltip: "Podatek od transakcji, opłaty notarialne, opłaty rejestracyjne, opłaty prawne",
            renovation: "Koszty renowacji/naprawy",
            renovation_tooltip: "Początkowe ulepszenia i naprawy przed wynajmem nieruchomości",
            furnishing: "Koszty umeblowania",
            furnishing_tooltip: "Meble, urządzenia i wyposażenie, jeśli nieruchomość wymaga umeblowania",
            other_costs: "Inne koszty początkowe",
            other_tooltip: "Wszelkie dodatkowe wydatki z góry (inspekcja, koszty przeprowadzki, itp.)",
        },
        hu: {
            acquisition_costs: "Vásárlási költségek",
            acquisition_tooltip: "Illeték, közjegyzői díjak, bejegyzési díjak, jogi díjak",
            renovation: "Felújítási/javítási költségek",
            renovation_tooltip: "Kezdeti fejlesztések és javítások a bérbeadás előtt",
            furnishing: "Bútorozási költségek",
            furnishing_tooltip: "Bútorok, készülékek és felszerelés, ha az ingatlan bútorozást igényel",
            other_costs: "Egyéb kezdeti költségek",
            other_tooltip: "Bármilyen további előzetes kiadás (szemle, költözködési költségek stb.)",
        },
        de: {
            acquisition_costs: "Erwerbsnebenkosten",
            acquisition_tooltip: "Grunderwerbsteuer, Notargebühren, Grundbuchgebühren, Rechtsgebühren",
            renovation: "Renovierungs-/Reparaturkosten",
            renovation_tooltip: "Anfängliche Verbesserungen und Reparaturen vor Vermietung der Immobilie",
            furnishing: "Möblierungskosten",
            furnishing_tooltip: "Möbel, Geräte und Ausstattung, falls die Immobilie möbliert werden muss",
            other_costs: "Sonstige Anfangskosten",
            other_tooltip: "Alle zusätzlichen Vorabkosten (Inspektion, Umzugskosten usw.)",
        }
    };

    const t = translations[language] || translations.en;

    return (
        <div className="space-y-4">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <Label>{t.acquisition_costs}</Label>
                    <InfoTooltip content={t.acquisition_tooltip} />
                </div>
                <Input
                    type="number"
                    value={localData.acquisition_costs || 0}
                    onChange={(e) => handleChange('acquisition_costs', e.target.value)}
                />
            </div>
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <Label>{t.renovation}</Label>
                    <InfoTooltip content={t.renovation_tooltip} />
                </div>
                <Input
                    type="number"
                    value={localData.renovation_costs || 0}
                    onChange={(e) => handleChange('renovation_costs', e.target.value)}
                />
            </div>
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <Label>{t.furnishing}</Label>
                    <InfoTooltip content={t.furnishing_tooltip} />
                </div>
                <Input
                    type="number"
                    value={localData.furnishing_costs || 0}
                    onChange={(e) => handleChange('furnishing_costs', e.target.value)}
                />
            </div>
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <Label>{t.other_costs}</Label>
                    <InfoTooltip content={t.other_tooltip} />
                </div>
                <Input
                    type="number"
                    value={localData.other_initial_costs || 0}
                    onChange={(e) => handleChange('other_initial_costs', e.target.value)}
                />
            </div>
        </div>
    );
}