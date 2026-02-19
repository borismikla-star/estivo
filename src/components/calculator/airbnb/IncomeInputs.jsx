import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Sparkles, Calculator } from "lucide-react";
import InfoTooltip from '../../shared/InfoTooltip';
import { useVatHints } from '../VatInputBanner';

// Auto defaults
const AUTO_DEFAULTS = {
    platform_fee_rate: (purchasePrice, avgNightlyRate, occupancyRate) => 3,
    revenue_growth_rate: (purchasePrice, avgNightlyRate, occupancyRate) => 3,
    comparable_long_term_rent: (purchasePrice, avgNightlyRate, occupancyRate) => Math.round(purchasePrice * 0.004),
};

export default function IncomeInputs({ data, onChange, language = 'en', purchasePrice = 0 }) {
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

    // Recalculate auto fields when inputs change
    useEffect(() => {
        const avgNightlyRate = localData.avg_nightly_rate || 0;
        const occupancyRate = localData.occupancy_rate || 70;
        setLocalData(prev => {
            const updates = {};
            Object.entries(AUTO_DEFAULTS).forEach(([field, fn]) => {
                if (prev[`${field}_auto`] === true) {
                    updates[field] = fn(purchasePrice, avgNightlyRate, occupancyRate);
                }
            });
            if (Object.keys(updates).length === 0) return prev;
            const updated = { ...prev, ...updates };
            onChange(updated);
            return updated;
        });
    }, [purchasePrice, localData.avg_nightly_rate, localData.occupancy_rate]);

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
                const autoVal = AUTO_DEFAULTS[field](purchasePrice, prev.avg_nightly_rate || 0, prev.occupancy_rate || 70);
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
            nightly_rate: "Average Nightly Rate (excl. VAT)",
            nightly_rate_tooltip: "Enter the price per night excluding VAT – i.e. the net amount guests pay before platform fees are deducted. Short-term rental (Airbnb) is generally VAT-exempt in most countries, so this is typically the full price guests see. If you are a VAT payer, enter the net amount without VAT.",
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
            auto_calculate: "Auto",
        },
        sk: {
            nightly_rate: "Priemerná cena za noc (bez DPH)",
            nightly_rate_tooltip: "Zadajte cenu za noc bez DPH – teda čistú sumu, ktorú hostia platia pred odpočítaním poplatkov platformy. Krátkodobý prenájom (Airbnb) je vo väčšine krajín oslobodený od DPH. Ak ste platca DPH, zadajte sumu bez DPH.",
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
            auto_calculate: "Auto",
        },
        pl: {
            nightly_rate: "Średnia cena za noc (bez VAT)",
            nightly_rate_tooltip: "Podaj cenę za noc bez VAT – kwotę netto, którą płacą goście przed potrąceniem opłat platformy. Krótkoterminowy wynajem (Airbnb) jest zazwyczaj zwolniony z VAT. Jeśli jesteś podatnikiem VAT, podaj kwotę netto.",
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
            auto_calculate: "Auto",
        },
        hu: {
            nightly_rate: "Átlagos éjszakai díj (ÁFA nélkül)",
            nightly_rate_tooltip: "Adja meg az éjszakai árat ÁFA nélkül – a vendégek által fizetett nettó összeget a platform díjak levonása előtt. A rövid távú bérbeadás (Airbnb) általában ÁFA-mentes. Ha ÁFA fizető, adja meg a nettó összeget.",
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
            auto_calculate: "Auto",
        },
        de: {
            nightly_rate: "Durchschnittlicher Übernachtungspreis (netto)",
            nightly_rate_tooltip: "Geben Sie den Preis pro Nacht ohne MwSt. ein – den Nettobetrag, den Gäste vor Plattformgebühren zahlen. Kurzfristige Vermietung (Airbnb) ist in den meisten Ländern von der MwSt. befreit. Falls Sie umsatzsteuerpflichtig sind, geben Sie den Nettobetrag an.",
            occupancy: "Jährliche Auslastung (%)",
            occupancy_tooltip: "Prozentsatz der gebuchten Nächte pro Jahr (70% ist üblich für erfolgreiche Airbnb-Immobilien)",
            avg_length_of_stay: "Durchschnittliche Aufenthaltsdauer (Nächte)",
            avg_length_tooltip: "Typische Anzahl der Nächte, die Gäste bleiben (beeinflusst Reinigungshäufigkeit)",
            nights: "Nächte",
            per_month: "/Mon",
            platform_fee_rate: "Plattformgebühr (%)",
            platform_fee_tooltip: "Airbnb/Booking.com Gastgebergebühr (typischerweise 3-5%)",
            revenue_growth_rate: "Jährliches Umsatzwachstum (%)",
            revenue_growth_tooltip: "Erwartete jährliche Steigerung der Übernachtungspreise und Einnahmen",
            comparable_long_term_rent: "Vergleichbare Langzeitmiete (monatlich)",
            comparable_long_term_tooltip: "Wofür diese Immobilie langfristig vermietet würde - zum Vergleich",
            annual_revenue: "Geschätzter Jahresumsatz",
            annual_revenue_tooltip: "Prognostizierter jährlicher Bruttoumsatz basierend auf Übernachtungspreis und Auslastung",
            auto_calculate: "Auto",
        }
    };

    const t = translations[language] || translations.en;

    const nightlyRate = localData.avg_nightly_rate || 0;
    const occupancyPercentage = (localData.occupancy_rate || 0) / 100;
    const annualRevenue = nightlyRate * 365 * occupancyPercentage;

    const AutoField = ({ field, label, tooltip, value, placeholder, suffix, step = "0.1" }) => {
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
                        step={step}
                        value={value ?? ''}
                        onChange={(e) => handleChange(field, e.target.value)}
                        placeholder={placeholder}
                        disabled={isAuto}
                        className={isAuto ? 'bg-primary/5 border-primary/30' : ''}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        {isAuto ? <Sparkles className="w-4 h-4 text-primary animate-pulse" /> : suffix}
                    </span>
                </div>
            </div>
        );
    };

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
                            onChange={(e) => setLocalData(prev => {
                                const updated = { ...prev, avg_nightly_rate: parseFloat(e.target.value) || 0 };
                                onChange(updated);
                                return updated;
                            })}
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
                            onChange={(e) => setLocalData(prev => {
                                const updated = { ...prev, occupancy_rate: parseFloat(e.target.value) || 0 };
                                onChange(updated);
                                return updated;
                            })}
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
                            onChange={(e) => setLocalData(prev => {
                                const updated = { ...prev, avg_length_of_stay: parseFloat(e.target.value) || 1 };
                                onChange(updated);
                                return updated;
                            })}
                            placeholder="3"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{t.nights}</span>
                    </div>
                </div>

                <AutoField
                    field="platform_fee_rate"
                    label={t.platform_fee_rate}
                    tooltip={t.platform_fee_tooltip}
                    value={localData.platform_fee_rate}
                    placeholder="3"
                    suffix="%"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AutoField
                    field="revenue_growth_rate"
                    label={t.revenue_growth_rate}
                    tooltip={t.revenue_growth_tooltip}
                    value={localData.revenue_growth_rate}
                    placeholder="3"
                    suffix="%"
                />

                <AutoField
                    field="comparable_long_term_rent"
                    label={t.comparable_long_term_rent}
                    tooltip={t.comparable_long_term_tooltip}
                    value={localData.comparable_long_term_rent}
                    placeholder="1000"
                    suffix={`€${t.per_month}`}
                    step="1"
                />
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