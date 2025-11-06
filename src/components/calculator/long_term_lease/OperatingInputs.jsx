import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
            property_tax: "Property Tax (annual)",
            insurance: "Property Insurance (annual)",
            hoa_fees: "HOA/Common Fees (monthly)",
            maintenance: "Maintenance Reserve (% of rent)",
            vacancy_rate: "Expected Vacancy Rate (%)",
            property_mgmt: "Property Management Fee (% of rent)",
            utilities: "Utilities (if paid by owner, monthly)",
        },
        sk: {
            property_tax: "Daň z nehnuteľnosti (ročne)",
            insurance: "Poistenie nehnuteľnosti (ročne)",
            hoa_fees: "Spoločné poplatky (mesačne)",
            maintenance: "Rezerva na údržbu (% z nájmu)",
            vacancy_rate: "Očakávaná miera neobsadenosti (%)",
            property_mgmt: "Správa nehnuteľnosti (% z nájmu)",
            utilities: "Energie (ak platí vlastník, mesačne)",
        },
        pl: {
            property_tax: "Podatek od nieruchomości (rocznie)",
            insurance: "Ubezpieczenie nieruchomości (rocznie)",
            hoa_fees: "Opłaty wspólne (miesięcznie)",
            maintenance: "Rezerwa na konserwację (% z czynszu)",
            vacancy_rate: "Oczekiwany wskaźnik pustostanów (%)",
            property_mgmt: "Zarządzanie nieruchomością (% z czynszu)",
            utilities: "Media (jeśli płaci właściciel, miesięcznie)",
        },
        hu: {
            property_tax: "Ingatlanadó (évente)",
            insurance: "Ingatlanbiztosítás (évente)",
            hoa_fees: "Közös költség (havonta)",
            maintenance: "Karbantartási tartalék (% bérleti díjból)",
            vacancy_rate: "Várható üresedési arány (%)",
            property_mgmt: "Ingatlankezelési díj (% bérleti díjból)",
            utilities: "Közművek (ha a tulajdonos fizeti, havonta)",
        },
        de: {
            property_tax: "Grundsteuer (jährlich)",
            insurance: "Gebäudeversicherung (jährlich)",
            hoa_fees: "Hausgeld/Nebenkosten (monatlich)",
            maintenance: "Instandhaltungsrücklage (% der Miete)",
            vacancy_rate: "Erwartete Leerstandsquote (%)",
            property_mgmt: "Hausverwaltungsgebühr (% der Miete)",
            utilities: "Nebenkosten (falls vom Eigentümer bezahlt, monatlich)",
        }
    };

    const t = translations[language] || translations.en;

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label>{t.property_tax}</Label>
                    <Input
                        type="number"
                        step="0.01"
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
                        value={localData.maintenance || 0}
                        onChange={(e) => handleChange('maintenance', e.target.value)}
                    />
                </div>
                <div>
                    <Label>{t.hoa_fees}</Label>
                    <Input
                        type="number"
                        value={localData.hoa_fees || 0}
                        onChange={(e) => handleChange('hoa_fees', e.target.value)}
                    />
                </div>
                <div>
                    <Label>{t.vacancy_rate}</Label>
                    <Input
                        type="number"
                        step="0.1"
                        value={localData.vacancy_rate || 5}
                        onChange={(e) => handleChange('vacancy_rate', e.target.value)}
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
                    <Label>{t.utilities}</Label>
                    <Input
                        type="number"
                        value={localData.utilities || 0}
                        onChange={(e) => handleChange('utilities', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}