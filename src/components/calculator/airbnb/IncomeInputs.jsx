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
            nights: "nights",
            per_month: "/mo",
            platform_fee_rate: "Platform Fee Rate (%)",
            platform_fee_tooltip: "Airbnb/Booking.com host fee (typically 3-5%)",
            revenue_growth_rate: "Annual Revenue Growth (%)",
            revenue_growth_tooltip: "Expected yearly increase in nightly rates and revenue",
            comparable_long_term_rent: "Comparable Long-Term Rent (monthly)",
            comparable_long_term_tooltip: "What this property would rent for on long-term basis - for comparison",
            annual_revenue: "Estimated Annual Revenue",
            annual_revenue_tooltip: "Projected gross annual revenue based on nightly rate and occupancy",
        },
        sk: {
            nightly_rate: "Priemerná cena za noc",
            nightly_rate_tooltip: "Vaša priemerná cena za noc (zohľadnite sezónne výkyvy a víkendové/pracovné dni)",
            occupancy: "Ročná miera obsadenosti (%)",
            occupancy_tooltip: "Percento obsadených nocí za rok (70% je bežné pre úspešné Airbnb nehnuteľnosti)",
            avg_length_of_stay: "Priemerná dĺžka pobytu (noci)",
            avg_length_tooltip: "Typický počet nocí, ktoré hostia zostanú (ovplyvňuje frekvenciu upratovania)",
            nights: "nocí",
            per_month: "/mes",
            platform_fee_rate: "Poplatok platformy (%)",
            platform_fee_tooltip: "Poplatok Airbnb/Booking.com pre hostiteľa (typicky 3-5%)",
            revenue_growth_rate: "Ročný rast príjmov (%)",
            revenue_growth_tooltip: "Očakávaný ročný nárast cien za noc a príjmov",
            comparable_long_term_rent: "Porovnateľný dlhodobý nájom (mesačne)",
            comparable_long_term_tooltip: "Za koľko by sa táto nehnuteľnosť prenajala dlhodobo - pre porovnanie",
            annual_revenue: "Odhadovaný ročný príjem",
            annual_revenue_tooltip: "Odhadovaný hrubý ročný príjem na základe ceny za noc a obsadenosti",
        },
        pl: {
            nightly_rate: "Średnia cena za noc",
            nightly_rate_tooltip: "Średnia cena za noc (uwzględnij wahania sezonowe i stawki weekendowe/robocze)",
            occupancy: "Roczny wskaźnik obłożenia (%)",
            occupancy_tooltip: "Procent zarezerwowanych nocy w roku (70% jest typowe dla udanych nieruchomości Airbnb)",
            avg_length_of_stay: "Średnia długość pobytu (noce)",
            avg_length_tooltip: "Typowa liczba nocy, które goście spędzają (wpływa na częstotliwość sprzątania)",
            nights: "nocy",
            per_month: "/mies",
            platform_fee_rate: "Opłata platformy (%)",
            platform_fee_tooltip: "Opłata gospodarza Airbnb/Booking.com (zazwyczaj 3-5%)",
            revenue_growth_rate: "Roczny wzrost przychodów (%)",
            revenue_growth_tooltip: "Oczekiwany roczny wzrost cen za noc i przychodów",
            comparable_long_term_rent: "Porównywalny długoterminowy czynsz (miesięczny)",
            comparable_long_term_tooltip: "Za ile ta nieruchomość wynajmowałaby się długoterminowo - do porównania",
            annual_revenue: "Szacowany roczny przychód",
            annual_revenue_tooltip: "Przewidywany roczny przychód brutto na podstawie ceny za noc i obłożenia",
        },
        hu: {
            nightly_rate: "Átlagos éjszakai díj",
            nightly_rate_tooltip: "Átlagos éjszakai ár (vegye figyelembe a szezonális eltéréseket és a hétvégi/hétköznapi árakat)",
            occupancy: "Éves kihasználtság (%)",
            occupancy_tooltip: "A lefoglalt éjszakák százaléka évente (70% jellemző a sikeres Airbnb ingatlanoknál)",
            avg_length_of_stay: "Átlagos tartózkodási idő (éjszaka)",
            avg_length_tooltip: "Vendégek jellemző éjszakák száma (befolyásolja a takarítás gyakoriságát)",
            nights: "éjszaka",
            per_month: "/hó",
            platform_fee_rate: "Platform díj (%)",
            platform_fee_tooltip: "Airbnb/Booking.com házigazda díj (jellemzően 3-5%)",
            revenue_growth_rate: "Éves bevételnövekedés (%)",
            revenue_growth_tooltip: "Várható éves növekedés az éjszakai árakban és bevételekben",
            comparable_long_term_rent: "Összehasonlítható hosszú távú bérleti díj (havi)",
            comparable_long_term_tooltip: "Mennyiért bérelhető lenne ez az ingatlan hosszú távon - összehasonlításhoz",
            annual_revenue: "Becsült éves bevétel",
            annual_revenue_tooltip: "Várható éves bruttó bevétel az éjszakai ár és kihasználtság alapján",
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
            annual_revenue: "Geschätzter Jahresumsatz",
            annual_revenue_tooltip: "Prognostizierter jährlicher Bruttoumsatz basierend auf Übernachtungspreis und Auslastung",
            nights: "Nächte",
            per_month: "/Mon",
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
                    <div className="relative">
                        <Input
                            type="number"
                            value={localData.avg_nightly_rate || ''}
                            onChange={(e) => handleChange('avg_nightly_rate', parseFloat(e.target.value) || 0)}
                            placeholder="80"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€</span>
                    </div>
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Label>{t.occupancy}</Label>
                        <InfoTooltip content={t.occupancy_tooltip} />
                    </div>
                    <div className="relative">
                        <Input
                            type="number"
                            step="0.1"
                            value={localData.occupancy_rate || 70}
                            onChange={(e) => handleChange('occupancy_rate', parseFloat(e.target.value) || 0)}
                            placeholder="70"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Label>{t.avg_length_of_stay}</Label>
                        <InfoTooltip content={t.avg_length_tooltip} />
                    </div>
                    <div className="relative">
                        <Input
                            type="number"
                            value={localData.avg_length_of_stay || 3}
                            onChange={(e) => handleChange('avg_length_of_stay', parseFloat(e.target.value) || 1)}
                            placeholder="3"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{t.nights}</span>
                    </div>
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Label>{t.platform_fee_rate}</Label>
                        <InfoTooltip content={t.platform_fee_tooltip} />
                    </div>
                    <div className="relative">
                        <Input
                            type="number"
                            step="0.1"
                            value={localData.platform_fee_rate || 3}
                            onChange={(e) => handleChange('platform_fee_rate', parseFloat(e.target.value) || 0)}
                            placeholder="3"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Label>{t.revenue_growth_rate}</Label>
                        <InfoTooltip content={t.revenue_growth_tooltip} />
                    </div>
                    <div className="relative">
                        <Input
                            type="number"
                            step="0.1"
                            value={localData.revenue_growth_rate || 3}
                            onChange={(e) => handleChange('revenue_growth_rate', parseFloat(e.target.value) || 0)}
                            placeholder="3"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
                    </div>
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Label>{t.comparable_long_term_rent}</Label>
                        <InfoTooltip content={t.comparable_long_term_tooltip} />
                    </div>
                    <div className="relative">
                        <Input
                            type="number"
                            value={localData.comparable_long_term_rent || ''}
                            onChange={(e) => handleChange('comparable_long_term_rent', parseFloat(e.target.value) || 0)}
                            placeholder="1000"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€{t.per_month}</span>
                    </div>
                </div>
            </div>

            {/* Estimated Annual Revenue Display */}
            {nightlyRate > 0 && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Label className="text-green-800 font-semibold">{t.annual_revenue}</Label>
                            <InfoTooltip content={t.annual_revenue_tooltip} />
                        </div>
                        <div className="text-2xl font-bold text-green-700">
                            €{Math.round(annualRevenue).toLocaleString()}
                        </div>
                    </div>
                    <div className="text-xs text-green-600 mt-1">
                        {nightlyRate.toLocaleString()}€ × 365 {t.nights} × {(occupancyPercentage * 100).toFixed(0)}% occupancy
                    </div>
                </div>
            )}
        </div>
    );
}