import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function OperatingInputs({ data, onChange, language = 'en' }) {
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
            utilities: "Utilities (monthly)",
            utilities_desc: "Electricity, water, gas, internet",
            cleaning: "Cleaning Cost per Stay",
            cleaning_desc: "Professional cleaning between guests",
            supplies: "Supplies & Consumables (monthly)",
            supplies_desc: "Toiletries, coffee, cleaning products",
            property_tax: "Property Tax (annual)",
            insurance: "Short-Term Rental Insurance (annual)",
            maintenance: "Maintenance Reserve (% of revenue)",
            platform_fees: "Platform Fees (% of revenue)",
            platform_desc: "Airbnb, Booking.com commissions",
            property_mgmt: "Property Management (% of revenue)",
            other_costs: "Other Monthly Costs",
        },
        sk: {
            utilities: "Energie (mesačne)",
            utilities_desc: "Elektrina, voda, plyn, internet",
            cleaning: "Náklady na upratovanie za pobyt",
            cleaning_desc: "Profesionálne upratovanie medzi hosťami",
            supplies: "Spotrebný materiál (mesačne)",
            supplies_desc: "Toaletné potreby, káva, čistiace prostriedky",
            property_tax: "Daň z nehnuteľnosti (ročne)",
            insurance: "Poistenie krátkodobého prenájmu (ročne)",
            maintenance: "Rezerva na údržbu (% z príjmov)",
            platform_fees: "Poplatky platforiem (% z príjmov)",
            platform_desc: "Provízie Airbnb, Booking.com",
            property_mgmt: "Správa nehnuteľnosti (% z príjmov)",
            other_costs: "Ostatné mesačné náklady",
        },
        pl: {
            utilities: "Media (miesięcznie)",
            utilities_desc: "Prąd, woda, gaz, internet",
            cleaning: "Koszt sprzątania za pobyt",
            cleaning_desc: "Profesjonalne sprzątanie między gośćmi",
            supplies: "Materiały eksploatacyjne (miesięcznie)",
            supplies_desc: "Przybory toaletowe, kawa, środki czyszczące",
            property_tax: "Podatek od nieruchomości (rocznie)",
            insurance: "Ubezpieczenie najmu krótkoterminowego (rocznie)",
            maintenance: "Rezerwa na konserwację (% z przychodów)",
            platform_fees: "Opłaty platformy (% z przychodów)",
            platform_desc: "Prowizje Airbnb, Booking.com",
            property_mgmt: "Zarządzanie nieruchomością (% z przychodów)",
            other_costs: "Inne miesięczne koszty",
        },
        hu: {
            utilities: "Közművek (havonta)",
            utilities_desc: "Villany, víz, gáz, internet",
            cleaning: "Takarítási költség tartózkodásonként",
            cleaning_desc: "Professzionális takarítás vendégek között",
            supplies: "Fogyóeszközök (havonta)",
            supplies_desc: "Higiéniai cikkek, kávé, tisztítószerek",
            property_tax: "Ingatlanadó (évente)",
            insurance: "Rövid távú bérleti biztosítás (évente)",
            maintenance: "Karbantartási tartalék (% bevételből)",
            platform_fees: "Platform díjak (% bevételből)",
            platform_desc: "Airbnb, Booking.com jutalékok",
            property_mgmt: "Ingatlankezelés (% bevételből)",
            other_costs: "Egyéb havi költségek",
        },
        de: {
            utilities: "Nebenkosten (monatlich)",
            utilities_desc: "Strom, Wasser, Gas, Internet",
            cleaning: "Reinigungskosten pro Aufenthalt",
            cleaning_desc: "Professionelle Reinigung zwischen Gästen",
            supplies: "Verbrauchsmaterial (monatlich)",
            supplies_desc: "Toilettenartikel, Kaffee, Reinigungsmittel",
            property_tax: "Grundsteuer (jährlich)",
            insurance: "Kurzzeitvermietungsversicherung (jährlich)",
            maintenance: "Instandhaltungsrücklage (% der Einnahmen)",
            platform_fees: "Plattformgebühren (% der Einnahmen)",
            platform_desc: "Airbnb, Booking.com Provisionen",
            property_mgmt: "Hausverwaltung (% der Einnahmen)",
            other_costs: "Sonstige monatliche Kosten",
        }
    };

    const t = translations[language] || translations.en;

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label>{t.utilities}</Label>
                    <p className="text-sm text-muted-foreground mb-2">{t.utilities_desc}</p>
                    <Input
                        type="number"
                        value={localData.utilities || 0}
                        onChange={(e) => handleChange('utilities', e.target.value)}
                    />
                </div>
                <div>
                    <Label>{t.cleaning}</Label>
                    <p className="text-sm text-muted-foreground mb-2">{t.cleaning_desc}</p>
                    <Input
                        type="number"
                        value={localData.cleaning_cost_per_stay || 0}
                        onChange={(e) => handleChange('cleaning_cost_per_stay', e.target.value)}
                    />
                </div>
                <div>
                    <Label>{t.supplies}</Label>
                    <p className="text-sm text-muted-foreground mb-2">{t.supplies_desc}</p>
                    <Input
                        type="number"
                        value={localData.supplies || 0}
                        onChange={(e) => handleChange('supplies', e.target.value)}
                    />
                </div>
                <div>
                    <Label>{t.property_tax}</Label>
                    <Input
                        type="number"
                        value={localData.property_tax || 0}
                        onChange={(e) => handleChange('property_tax', e.target.value)}
                    />
                </div>
                <div>
                    <Label>{t.insurance}</Label>
                    <Input
                        type="number"
                        value={localData.insurance || 0}
                        onChange={(e) => handleChange('insurance', e.target.value)}
                    />
                </div>
                <div>
                    <Label>{t.maintenance}</Label>
                    <Input
                        type="number"
                        step="0.1"
                        value={localData.maintenance || 5}
                        onChange={(e) => handleChange('maintenance', e.target.value)}
                    />
                </div>
                <div>
                    <Label>{t.platform_fees}</Label>
                    <p className="text-sm text-muted-foreground mb-2">{t.platform_desc}</p>
                    <Input
                        type="number"
                        step="0.1"
                        value={localData.platform_fees || 15}
                        onChange={(e) => handleChange('platform_fees', e.target.value)}
                    />
                </div>
                <div>
                    <Label>{t.property_mgmt}</Label>
                    <Input
                        type="number"
                        step="0.1"
                        value={localData.property_management_fee || 0}
                        onChange={(e) => handleChange('property_management_fee', e.target.value)}
                    />
                </div>
                <div>
                    <Label>{t.other_costs}</Label>
                    <Input
                        type="number"
                        value={localData.other_costs || 0}
                        onChange={(e) => handleChange('other_costs', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}