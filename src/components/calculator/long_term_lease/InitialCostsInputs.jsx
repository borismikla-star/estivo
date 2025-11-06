import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
            acquisition_costs: "Acquisition Costs (€)",
            acquisition_desc: "Transfer tax, notary, registration fees",
            renovation: "Renovation/Repair Costs (€)",
            renovation_desc: "Initial improvements before renting",
            furnishing: "Furnishing Costs (€)",
            furnishing_desc: "If property needs furniture",
            other_costs: "Other Initial Costs (€)",
            other_desc: "Any additional upfront expenses",
        },
        sk: {
            acquisition_costs: "Transakčné náklady (€)",
            acquisition_desc: "Daň z prevodu, notár, registrácia",
            renovation: "Náklady na rekonštrukciu (€)",
            renovation_desc: "Počiatočné úpravy pred prenájmom",
            furnishing: "Náklady na zariadenie (€)",
            furnishing_desc: "Ak nehnuteľnosť potrebuje nábytok",
            other_costs: "Ostatné počiatočné náklady (€)",
            other_desc: "Akékoľvek ďalšie vstupné náklady",
        },
        pl: {
            acquisition_costs: "Koszty nabycia (€)",
            acquisition_desc: "Podatek od transakcji, notariusz, opłaty rejestracyjne",
            renovation: "Koszty renowacji/naprawy (€)",
            renovation_desc: "Początkowe ulepszenia przed wynajmem",
            furnishing: "Koszty umeblowania (€)",
            furnishing_desc: "Jeśli nieruchomość wymaga mebli",
            other_costs: "Inne koszty początkowe (€)",
            other_desc: "Wszelkie dodatkowe wydatki z góry",
        },
        hu: {
            acquisition_costs: "Vásárlási költségek (€)",
            acquisition_desc: "Illeték, közjegyző, bejegyzési díjak",
            renovation: "Felújítási/javítási költségek (€)",
            renovation_desc: "Kezdeti fejlesztések a bérbeadás előtt",
            furnishing: "Bútorozási költségek (€)",
            furnishing_desc: "Ha az ingatlan bútort igényel",
            other_costs: "Egyéb kezdeti költségek (€)",
            other_desc: "Bármilyen további előzetes kiadás",
        },
        de: {
            acquisition_costs: "Erwerbsnebenkosten (€)",
            acquisition_desc: "Grunderwerbsteuer, Notar, Grundbucheintrag",
            renovation: "Renovierungs-/Reparaturkosten (€)",
            renovation_desc: "Anfängliche Verbesserungen vor Vermietung",
            furnishing: "Möblierungskosten (€)",
            furnishing_desc: "Falls Immobilie Möbel benötigt",
            other_costs: "Sonstige Anfangskosten (€)",
            other_desc: "Alle zusätzlichen Vorabkosten",
        }
    };

    const t = translations[language] || translations.en;

    return (
        <div className="space-y-4">
            <div>
                <Label>{t.acquisition_costs}</Label>
                <p className="text-sm text-muted-foreground mb-2">{t.acquisition_desc}</p>
                <Input
                    type="number"
                    value={localData.acquisition_costs || 0}
                    onChange={(e) => handleChange('acquisition_costs', e.target.value)}
                />
            </div>
            <div>
                <Label>{t.renovation}</Label>
                <p className="text-sm text-muted-foreground mb-2">{t.renovation_desc}</p>
                <Input
                    type="number"
                    value={localData.renovation_costs || 0}
                    onChange={(e) => handleChange('renovation_costs', e.target.value)}
                />
            </div>
            <div>
                <Label>{t.furnishing}</Label>
                <p className="text-sm text-muted-foreground mb-2">{t.furnishing_desc}</p>
                <Input
                    type="number"
                    value={localData.furnishing_costs || 0}
                    onChange={(e) => handleChange('furnishing_costs', e.target.value)}
                />
            </div>
            <div>
                <Label>{t.other_costs}</Label>
                <p className="text-sm text-muted-foreground mb-2">{t.other_desc}</p>
                <Input
                    type="number"
                    value={localData.other_initial_costs || 0}
                    onChange={(e) => handleChange('other_initial_costs', e.target.value)}
                />
            </div>
        </div>
    );
}