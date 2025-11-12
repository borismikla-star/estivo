import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InfoTooltip from '../../shared/InfoTooltip';

export default function IncomeInputs({ data, onChange, language = 'en' }) {
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
            nightly_rate: "Average Nightly Rate",
            nightly_rate_tooltip: "Your average price per night (consider seasonal variations and weekday/weekend rates)",
            occupancy: "Annual Occupancy Rate (%)",
            occupancy_tooltip: "Percentage of nights booked per year (70% is common for successful Airbnb properties)",
            avg_length_of_stay: "Average Length of Stay (nights)",
            avg_length_tooltip: "Typical number of nights guests stay (affects cleaning frequency)",
            platform_fee_rate: "Platform Fee Rate (%)",
            platform_fee_tooltip: "Airbnb/Booking.com host fee (typically 3-5%)",
            revenue_growth_rate: "Annual Revenue Growth (%)",
            revenue_growth_tooltip: "Expected yearly increase in nightly rates and revenue",
            comparable_long_term_rent: "Comparable Long-Term Rent (monthly)",
            comparable_long_term_tooltip: "What this property would rent for on long-term basis - for comparison",
            cleaning_fee: "Cleaning Fee (per stay)",
            extra_guest_fee: "Extra Guest Fee (per guest/night)",
            annual_revenue: "Estimated Annual Revenue",
        },
        sk: {
            nightly_rate: "Priemerná cena za noc",
            nightly_rate_tooltip: "Vaša priemerná cena za noc (zohľadnite sezónne výkyvy a víkendové/pracovné dni)",
            occupancy: "Ročná miera obsadenosti (%)",
            occupancy_tooltip: "Percento obsadených nocí za rok (70% je bežné pre úspešné Airbnb nehnuteľnosti)",
            avg_length_of_stay: "Priemerná dĺžka pobytu (noci)",
            avg_length_tooltip: "Typický počet nocí, ktoré hostia zostanú (ovplyvňuje frekvenciu upratovania)",
            platform_fee_rate: "Poplatok platformy (%)",
            platform_fee_tooltip: "Poplatok Airbnb/Booking.com pre hostiteľa (typicky 3-5%)",
            revenue_growth_rate: "Ročný rast príjmov (%)",
            revenue_growth_tooltip: "Očakávaný ročný nárast cien za noc a príjmov",
            comparable_long_term_rent: "Porovnateľný dlhodobý nájom (mesačne)",
            comparable_long_term_tooltip: "Za koľko by sa táto nehnuteľnosť prenajala dlhodobo - pre porovnanie",
            cleaning_fee: "Poplatok za upratovanie (za pobyt)",
            extra_guest_fee: "Poplatok za extra hosťa (za hosťa/noc)",
            annual_revenue: "Odhadovaný ročný príjem",
        },
        pl: {
            nightly_rate: "Średnia cena za noc",
            nightly_rate_tooltip: "Średnia cena za noc (uwzględnij wahania sezonowe i stawki weekendowe/robocze)",
            occupancy: "Roczny wskaźnik obłożenia (%)",
            occupancy_tooltip: "Procent zarezerwowanych nocy w roku (70% jest typowe dla udanych nieruchomości Airbnb)",
            avg_length_of_stay: "Średnia długość pobytu (noce)",
            avg_length_tooltip: "Typowa liczba nocy, które goście spędzają (wpływa na częstotliwość sprzątania)",
            platform_fee_rate: "Opłata platformy (%)",
            platform_fee_tooltip: "Opłata gospodarza Airbnb/Booking.com (zazwyczaj 3-5%)",
            revenue_growth_rate: "Roczny wzrost przychodów (%)",
            revenue_growth_tooltip: "Oczekiwany roczny wzrost cen za noc i przychodów",
            comparable_long_term_rent: "Porównywalny długoterminowy czynsz (miesięczny)",
            comparable_long_term_tooltip: "Za ile ta nieruchomość wynajmowałaby się długoterminowo - do porównania",
            cleaning_fee: "Opłata za sprzątanie (za pobyt)",
            extra_guest_fee: "Opłata za dodatkowego gościa (za gościa/noc)",
            annual_revenue: "Szacowany roczny przychód",
        },
        hu: {
            nightly_rate: "Átlagos éjszakai díj",
            nightly_rate_tooltip: "Átlagos éjszakai ár (vegye figyelembe a szezonális eltéréseket és a hétvégi/hétköznapi árakat)",
            occupancy: "Éves kihasználtság (%)",
            occupancy_tooltip: "A lefoglalt éjszakák százaléka évente (70% jellemző a sikeres Airbnb ingatlanoknál)",
            avg_length_of_stay: "Átlagos tartózkodási idő (éjszaka)",
            avg_length_tooltip: "Vendégek jellemző éjszakák száma (befolyásolja a takarítás gyakoriságát)",
            platform_fee_rate: "Platform díj (%)",
            platform_fee_tooltip: "Airbnb/Booking.com házigazda díj (jellemzően 3-5%)",
            revenue_growth_rate: "Éves bevételnövekedés (%)",
            revenue_growth_tooltip: "Várható éves növekedés az éjszakai árakban és bevételekben",
            comparable_long_term_rent: "Összehasonlítható hosszú távú bérleti díj (havi)",
            comparable_long_term_tooltip: "Mennyiért bérelhető lenne ez az ingatlan hosszú távon - összehasonlításhoz",
            cleaning_fee: "Takarítási díj (tartózkodásonként)",
            extra_guest_fee: "Extra vendégdíj (vendégenként/éjszaka)",
            annual_revenue: "Becsült éves bevétel",
        },
        de: {
            nightly_rate: "Durchschnittlicher Übernachtungspreis",
            nightly_rate_tooltip: "Ihr durchschnittlicher Preis pro Nacht (berücksichtigen Sie saisonale Schwankungen und Wochenend-/Wochentagsraten)",
            occupancy: "Jährliche Auslastung (%)",
            occupancy_tooltip: "Prozentsatz der gebuchten Nächte pro Jahr (70% ist üblich für erfolgreiche Airbnb-Immobilien)",
            avg_length_of_stay: "Durchschnittliche Aufenthaltsdauer (Nächte)",
            avg_length_tooltip: "Typische Anzahl der Nächte, die Gäste bleiben (beeinflusst Reinigungshäufigkeit)",
            platform_fee_rate: "Plattformgebühr (%)",
            platform_fee_tooltip: "Airbnb/Booking.com Gastgebergebühr (typischerweise 3-5%)",
            revenue_growth_rate: "Jährliches Umsatzwachstum (%)",
            revenue_growth_tooltip: "Erwartete jährliche Steigerung der Übernachtungspreise und Einnahmen",
            comparable_long_term_rent: "Vergleichbare Langzeitmiete (monatlich)",
            comparable_long_term_tooltip: "Wofür diese Immobilie langfristig vermietet würde - zum Vergleich",
            cleaning_fee: "Reinigungsgebühr (pro Aufenthalt)",
            extra_guest_fee: "Zusätzliche Gästegebühr (pro Gast/Nacht)",
            annual_revenue: "Geschätzter Jahresumsatz",
        }
    };

    const t = translations[language] || translations.en;

    const nightlyRate = localData.avg_nightly_rate || 0;
    const occupancyPercentage = (localData.occupancy_rate || 0) / 100;
    const annualRevenue = nightlyRate * 365 * occupancyPercentage;

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Label>{t.nightly_rate}</Label>
                        <InfoTooltip content={t.nightly_rate_tooltip} />
                    </div>
                    <Input
                        type="number"
                        value={localData.avg_nightly_rate || ''}
                        onChange={(e) => handleChange('avg_nightly_rate', parseFloat(e.target.value) || 0)}
                    />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Label>{t.occupancy}</Label>
                        <InfoTooltip content={t.occupancy_tooltip} />
                    </div>
                    <Input
                        type="number"
                        step="0.1"
                        value={localData.occupancy_rate || 70}
                        onChange={(e) => handleChange('occupancy_rate', parseFloat(e.target.value) || 0)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Label>{t.avg_length_of_stay}</Label>
                        <InfoTooltip content={t.avg_length_tooltip} />
                    </div>
                    <Input
                        type="number"
                        value={localData.avg_length_of_stay || 3}
                        onChange={(e) => handleChange('avg_length_of_stay', parseFloat(e.target.value) || 1)}
                        placeholder="3"
                    />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Label>{t.platform_fee_rate}</Label>
                        <InfoTooltip content={t.platform_fee_tooltip} />
                    </div>
                    <Input
                        type="number"
                        step="0.1"
                        value={localData.platform_fee_rate || 3}
                        onChange={(e) => handleChange('platform_fee_rate', parseFloat(e.target.value) || 0)}
                        placeholder="3"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Label>{t.revenue_growth_rate}</Label>
                        <InfoTooltip content={t.revenue_growth_tooltip} />
                    </div>
                    <Input
                        type="number"
                        step="0.1"
                        value={localData.revenue_growth_rate || 3}
                        onChange={(e) => handleChange('revenue_growth_rate', parseFloat(e.target.value) || 0)}
                        placeholder="3"
                    />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Label>{t.comparable_long_term_rent}</Label>
                        <InfoTooltip content={t.comparable_long_term_tooltip} />
                    </div>
                    <Input
                        type="number"
                        value={localData.comparable_long_term_rent || ''}
                        onChange={(e) => handleChange('comparable_long_term_rent', parseFloat(e.target.value) || 0)}
                        placeholder="1000"
                    />
                </div>
            </div>

            <div className="pt-4 border-t">
                <Label className="text-muted-foreground">{t.annual_revenue}</Label>
                <div className="text-2xl font-bold text-primary">€{Math.round(annualRevenue).toLocaleString()}</div>
            </div>
        </div>
    );
}