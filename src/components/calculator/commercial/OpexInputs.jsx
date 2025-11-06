import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function OpexInputs({ data, onChange, language = 'en' }) {
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
            insurance: "Insurance (annual)",
            maintenance: "Maintenance & Repairs (annual)",
            property_mgmt: "Property Management Fee (% of gross income)",
            utilities: "Utilities (if owner pays, annual)",
            other_opex: "Other Operating Expenses (annual)",
        },
        sk: {
            property_tax: "Daň z nehnuteľnosti (ročne)",
            insurance: "Poistenie (ročne)",
            maintenance: "Údržba a opravy (ročne)",
            property_mgmt: "Správa nehnuteľnosti (% z hrubého príjmu)",
            utilities: "Energie (ak platí vlastník, ročne)",
            other_opex: "Ostatné prevádzkové náklady (ročne)",
        },
        pl: {
            property_tax: "Podatek od nieruchomości (rocznie)",
            insurance: "Ubezpieczenie (rocznie)",
            maintenance: "Konserwacja i naprawy (rocznie)",
            property_mgmt: "Zarządzanie nieruchomością (% z dochodu brutto)",
            utilities: "Media (jeśli płaci właściciel, rocznie)",
            other_opex: "Inne koszty operacyjne (rocznie)",
        },
        hu: {
            property_tax: "Ingatlanadó (évente)",
            insurance: "Biztosítás (évente)",
            maintenance: "Karbantartás és javítások (évente)",
            property_mgmt: "Ingatlankezelési díj (% bruttó bevételből)",
            utilities: "Közművek (ha a tulajdonos fizeti, évente)",
            other_opex: "Egyéb működési költségek (évente)",
        },
        de: {
            property_tax: "Grundsteuer (jährlich)",
            insurance: "Versicherung (jährlich)",
            maintenance: "Instandhaltung & Reparaturen (jährlich)",
            property_mgmt: "Hausverwaltung (% des Bruttoeinkommens)",
            utilities: "Nebenkosten (falls Eigentümer zahlt, jährlich)",
            other_opex: "Sonstige Betriebskosten (jährlich)",
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
                <div>
                    <Label>{t.other_opex}</Label>
                    <Input
                        type="number"
                        value={localData.other_opex || 0}
                        onChange={(e) => handleChange('other_opex', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}