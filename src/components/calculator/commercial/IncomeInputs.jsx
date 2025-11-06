import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function IncomeInputs({ data, onChange, language = 'en' }) {
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
            base_rent: "Base Rent (€/m²/month)",
            base_rent_desc: "Net rent per square meter per month",
            service_charges: "Service Charges (€/m²/month)",
            service_charges_desc: "Additional charges passed to tenant",
            parking_income: "Parking Income (monthly)",
            parking_desc: "Total monthly parking revenue",
            other_income: "Other Income (monthly)",
            other_desc: "Signage, antennas, etc.",
            vacancy_rate: "Expected Vacancy Rate (%)",
            vacancy_desc: "Expected percentage of vacant space",
        },
        sk: {
            base_rent: "Základný nájom (€/m²/mesiac)",
            base_rent_desc: "Čistý nájom na meter štvorcový mesačne",
            service_charges: "Servisné poplatky (€/m²/mesiac)",
            service_charges_desc: "Dodatočné poplatky prenesené na nájomcu",
            parking_income: "Príjem z parkovania (mesačne)",
            parking_desc: "Celkový mesačný príjem z parkovania",
            other_income: "Ostatné príjmy (mesačne)",
            other_desc: "Reklamy, antény, atď.",
            vacancy_rate: "Očakávaná miera neobsadenosti (%)",
            vacancy_desc: "Očakávané percento neobsadeného priestoru",
        },
        pl: {
            base_rent: "Czynsz podstawowy (€/m²/miesiąc)",
            base_rent_desc: "Czynsz netto za metr kwadratowy miesięcznie",
            service_charges: "Opłaty za usługi (€/m²/miesiąc)",
            service_charges_desc: "Dodatkowe opłaty przekazywane najemcy",
            parking_income: "Dochód z parkingu (miesięcznie)",
            parking_desc: "Całkowity miesięczny przychód z parkingu",
            other_income: "Inne dochody (miesięcznie)",
            other_desc: "Reklamy, anteny, itp.",
            vacancy_rate: "Oczekiwany wskaźnik pustostanów (%)",
            vacancy_desc: "Oczekiwany procent wolnej powierzchni",
        },
        hu: {
            base_rent: "Alapbérleti díj (€/m²/hó)",
            base_rent_desc: "Nettó bérleti díj négyzetméterenként havonta",
            service_charges: "Szolgáltatási díjak (€/m²/hó)",
            service_charges_desc: "Bérlőnek továbbszámlázott díjak",
            parking_income: "Parkolási bevétel (havonta)",
            parking_desc: "Teljes havi parkolási bevétel",
            other_income: "Egyéb bevétel (havonta)",
            other_desc: "Reklám, antennák, stb.",
            vacancy_rate: "Várható üresedési arány (%)",
            vacancy_desc: "Várható üres terület százaléka",
        },
        de: {
            base_rent: "Grundmiete (€/m²/Monat)",
            base_rent_desc: "Nettomiete pro Quadratmeter monatlich",
            service_charges: "Nebenkosten (€/m²/Monat)",
            service_charges_desc: "An Mieter weiterberechnete Kosten",
            parking_income: "Parkeinnahmen (monatlich)",
            parking_desc: "Gesamte monatliche Parkeinnahmen",
            other_income: "Sonstige Einnahmen (monatlich)",
            other_desc: "Werbung, Antennen, usw.",
            vacancy_rate: "Erwartete Leerstandsquote (%)",
            vacancy_desc: "Erwarteter Prozentsatz leerstehender Fläche",
        }
    };

    const t = translations[language] || translations.en;

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label>{t.base_rent}</Label>
                    <p className="text-sm text-muted-foreground mb-2">{t.base_rent_desc}</p>
                    <Input
                        type="number"
                        step="0.01"
                        value={localData.base_rent_per_m2 || 0}
                        onChange={(e) => handleChange('base_rent_per_m2', e.target.value)}
                    />
                </div>
                <div>
                    <Label>{t.service_charges}</Label>
                    <p className="text-sm text-muted-foreground mb-2">{t.service_charges_desc}</p>
                    <Input
                        type="number"
                        step="0.01"
                        value={localData.service_charges_per_m2 || 0}
                        onChange={(e) => handleChange('service_charges_per_m2', e.target.value)}
                    />
                </div>
                <div>
                    <Label>{t.parking_income}</Label>
                    <p className="text-sm text-muted-foreground mb-2">{t.parking_desc}</p>
                    <Input
                        type="number"
                        value={localData.parking_income || 0}
                        onChange={(e) => handleChange('parking_income', e.target.value)}
                    />
                </div>
                <div>
                    <Label>{t.other_income}</Label>
                    <p className="text-sm text-muted-foreground mb-2">{t.other_desc}</p>
                    <Input
                        type="number"
                        value={localData.other_income || 0}
                        onChange={(e) => handleChange('other_income', e.target.value)}
                    />
                </div>
                <div>
                    <Label>{t.vacancy_rate}</Label>
                    <p className="text-sm text-muted-foreground mb-2">{t.vacancy_desc}</p>
                    <Input
                        type="number"
                        step="0.1"
                        value={localData.vacancy_rate || 5}
                        onChange={(e) => handleChange('vacancy_rate', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}