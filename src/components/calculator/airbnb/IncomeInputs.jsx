import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
            occupancy: "Annual Occupancy Rate (%)",
            cleaning_fee: "Cleaning Fee (per stay)",
            extra_guest_fee: "Extra Guest Fee (per guest/night)",
            annual_revenue: "Estimated Annual Revenue",
        },
        sk: {
            nightly_rate: "Priemerná cena za noc",
            occupancy: "Ročná miera obsadenosti (%)",
            cleaning_fee: "Poplatok za upratovanie (za pobyt)",
            extra_guest_fee: "Poplatok za extra hosťa (za hosťa/noc)",
            annual_revenue: "Odhadovaný ročný príjem",
        },
        pl: {
            nightly_rate: "Średnia cena za noc",
            occupancy: "Roczny wskaźnik obłożenia (%)",
            cleaning_fee: "Opłata za sprzątanie (za pobyt)",
            extra_guest_fee: "Opłata za dodatkowego gościa (za gościa/noc)",
            annual_revenue: "Szacowany roczny przychód",
        },
        hu: {
            nightly_rate: "Átlagos éjszakai díj",
            occupancy: "Éves kihasználtság (%)",
            cleaning_fee: "Takarítási díj (tartózkodásonként)",
            extra_guest_fee: "Extra vendégdíj (vendégenként/éjszaka)",
            annual_revenue: "Becsült éves bevétel",
        },
        de: {
            nightly_rate: "Durchschnittlicher Übernachtungspreis",
            occupancy: "Jährliche Auslastung (%)",
            cleaning_fee: "Reinigungsgebühr (pro Aufenthalt)",
            extra_guest_fee: "Zusätzliche Gästegebühr (pro Gast/Nacht)",
            annual_revenue: "Geschätzter Jahresumsatz",
        }
    };

    const t = translations[language] || translations.en;

    const nightlyRate = localData.nightly_rate || 0;
    const occupancyPercentage = (localData.occupancy || 0) / 100;
    const annualRevenue = nightlyRate * 365 * occupancyPercentage;

    return (
        <div className="space-y-4">
            <div>
                <Label>{t.nightly_rate}</Label>
                <div className="flex gap-2">
                    <Input
                        type="number"
                        value={localData.nightly_rate || ''}
                        onChange={(e) => handleChange('nightly_rate', parseFloat(e.target.value) || 0)}
                        className="flex-1"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label>{t.occupancy}</Label>
                    <Input
                        type="number"
                        step="0.1"
                        value={localData.occupancy || 65}
                        onChange={(e) => handleChange('occupancy', parseFloat(e.target.value) || 0)}
                    />
                </div>
                <div>
                    <Label>{t.cleaning_fee}</Label>
                    <Input
                        type="number"
                        value={localData.cleaning_fee || 0}
                        onChange={(e) => handleChange('cleaning_fee', parseFloat(e.target.value) || 0)}
                    />
                </div>
            </div>

            <div>
                <Label>{t.extra_guest_fee}</Label>
                <Input
                    type="number"
                    value={localData.extra_guest_fee || 0}
                    onChange={(e) => handleChange('extra_guest_fee', parseFloat(e.target.value) || 0)}
                />
            </div>

            <div className="pt-4 border-t">
                <Label className="text-muted-foreground">{t.annual_revenue}</Label>
                <div className="text-2xl font-bold text-primary">€{Math.round(annualRevenue).toLocaleString()}</div>
            </div>
        </div>
    );
}