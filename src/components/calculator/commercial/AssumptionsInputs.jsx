import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function AssumptionsInputs({ data, onChange, language = 'en' }) {
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
            holding_period: "Holding Period (years)",
            holding_desc: "How long you plan to hold the property",
            annual_appreciation: "Annual Property Appreciation (%)",
            appreciation_desc: "Expected yearly increase in property value",
            rent_growth: "Annual Rent Growth (%)",
            rent_growth_desc: "Expected yearly rent increase",
            exit_cap_rate: "Exit Cap Rate (%)",
            exit_cap_desc: "Cap rate assumption for property sale",
            discount_rate: "Discount Rate for NPV (%)",
            discount_desc: "Your required rate of return",
        },
        sk: {
            holding_period: "Doba držby (roky)",
            holding_desc: "Ako dlho plánujete držať nehnuteľnosť",
            annual_appreciation: "Ročná apreciácia nehnuteľnosti (%)",
            appreciation_desc: "Očakávaný ročný nárast hodnoty nehnuteľnosti",
            rent_growth: "Ročný rast nájmu (%)",
            rent_growth_desc: "Očakávaný ročný nárast nájmu",
            exit_cap_rate: "Výstupný Cap Rate (%)",
            exit_cap_desc: "Predpoklad Cap Rate pri predaji nehnuteľnosti",
            discount_rate: "Diskontná sadzba pre NPV (%)",
            discount_desc: "Vaša požadovaná miera návratnosti",
        },
        pl: {
            holding_period: "Okres utrzymywania (lata)",
            holding_desc: "Jak długo planujesz utrzymywać nieruchomość",
            annual_appreciation: "Roczny wzrost wartości nieruchomości (%)",
            appreciation_desc: "Oczekiwany roczny wzrost wartości nieruchomości",
            rent_growth: "Roczny wzrost czynszu (%)",
            rent_growth_desc: "Oczekiwany roczny wzrost czynszu",
            exit_cap_rate: "Współczynnik kapitalizacji wyjścia (%)",
            exit_cap_desc: "Założenie Cap Rate przy sprzedaży nieruchomości",
            discount_rate: "Stopa dyskontowa dla NPV (%)",
            discount_desc: "Twoja wymagana stopa zwrotu",
        },
        hu: {
            holding_period: "Tartási időszak (év)",
            holding_desc: "Mennyi ideig tervezi tartani az ingatlant",
            annual_appreciation: "Éves ingatlanértékelés (%)",
            appreciation_desc: "Várható éves növekedés az ingatlan értékében",
            rent_growth: "Éves bérleti díj növekedés (%)",
            rent_growth_desc: "Várható éves bérleti díj növekedés",
            exit_cap_rate: "Kilépési Cap Rate (%)",
            exit_cap_desc: "Cap Rate feltételezés az ingatlan eladásánál",
            discount_rate: "Diszkontráta az NPV-hez (%)",
            discount_desc: "Az Ön által megkövetelt megtérülési ráta",
        },
        de: {
            holding_period: "Haltedauer (Jahre)",
            holding_desc: "Wie lange Sie die Immobilie halten möchten",
            annual_appreciation: "Jährliche Wertsteigerung (%)",
            appreciation_desc: "Erwartete jährliche Wertsteigerung der Immobilie",
            rent_growth: "Jährliches Mietwachstum (%)",
            rent_growth_desc: "Erwartete jährliche Mieterhöhung",
            exit_cap_rate: "Exit Cap Rate (%)",
            exit_cap_desc: "Cap Rate Annahme für Immobilienverkauf",
            discount_rate: "Diskontsatz für NPV (%)",
            discount_desc: "Ihre geforderte Rendite",
        }
    };

    const t = translations[language] || translations.en;

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label>{t.holding_period}</Label>
                    <p className="text-sm text-muted-foreground mb-2">{t.holding_desc}</p>
                    <Input
                        type="number"
                        value={localData.holding_period || 10}
                        onChange={(e) => handleChange('holding_period', e.target.value)}
                    />
                </div>
                <div>
                    <Label>{t.annual_appreciation}</Label>
                    <p className="text-sm text-muted-foreground mb-2">{t.appreciation_desc}</p>
                    <Input
                        type="number"
                        step="0.1"
                        value={localData.annual_appreciation || 2}
                        onChange={(e) => handleChange('annual_appreciation', e.target.value)}
                    />
                </div>
                <div>
                    <Label>{t.rent_growth}</Label>
                    <p className="text-sm text-muted-foreground mb-2">{t.rent_growth_desc}</p>
                    <Input
                        type="number"
                        step="0.1"
                        value={localData.rent_growth || 2}
                        onChange={(e) => handleChange('rent_growth', e.target.value)}
                    />
                </div>
                <div>
                    <Label>{t.exit_cap_rate}</Label>
                    <p className="text-sm text-muted-foreground mb-2">{t.exit_cap_desc}</p>
                    <Input
                        type="number"
                        step="0.01"
                        value={localData.exit_cap_rate || 6}
                        onChange={(e) => handleChange('exit_cap_rate', e.target.value)}
                    />
                </div>
                <div>
                    <Label>{t.discount_rate}</Label>
                    <p className="text-sm text-muted-foreground mb-2">{t.discount_desc}</p>
                    <Input
                        type="number"
                        step="0.1"
                        value={localData.discount_rate || 8}
                        onChange={(e) => handleChange('discount_rate', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}