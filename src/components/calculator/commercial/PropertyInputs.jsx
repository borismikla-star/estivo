import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PropertyInputs({ data, onChange, language = 'en' }) {
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
            price: "Purchase Price",
            size: "Total Area (m²)",
            property_type: "Property Type",
            type_office: "Office",
            type_retail: "Retail",
            type_industrial: "Industrial/Warehouse",
            type_mixed: "Mixed Use",
            acquisition_costs: "Acquisition Costs",
            acquisition_desc: "Transfer tax, legal fees, etc.",
        },
        sk: {
            price: "Kúpna cena",
            size: "Celková plocha (m²)",
            property_type: "Typ nehnuteľnosti",
            type_office: "Kancelárske",
            type_retail: "Obchodné",
            type_industrial: "Priemyselné/Sklad",
            type_mixed: "Zmiešané využitie",
            acquisition_costs: "Transakčné náklady",
            acquisition_desc: "Daň z prevodu, právne poplatky, atď.",
        },
        pl: {
            price: "Cena zakupu",
            size: "Całkowita powierzchnia (m²)",
            property_type: "Typ nieruchomości",
            type_office: "Biurowy",
            type_retail: "Handlowy",
            type_industrial: "Przemysłowy/Magazyn",
            type_mixed: "Użytek mieszany",
            acquisition_costs: "Koszty nabycia",
            acquisition_desc: "Podatek od transakcji, opłaty prawne, itp.",
        },
        hu: {
            price: "Vételár",
            size: "Teljes terület (m²)",
            property_type: "Ingatlan típusa",
            type_office: "Iroda",
            type_retail: "Kereskedelmi",
            type_industrial: "Ipari/Raktár",
            type_mixed: "Vegyes használat",
            acquisition_costs: "Vásárlási költségek",
            acquisition_desc: "Illeték, jogi díjak, stb.",
        },
        de: {
            price: "Kaufpreis",
            size: "Gesamtfläche (m²)",
            property_type: "Immobilientyp",
            type_office: "Büro",
            type_retail: "Einzelhandel",
            type_industrial: "Industrie/Lager",
            type_mixed: "Mischnutzung",
            acquisition_costs: "Erwerbsnebenkosten",
            acquisition_desc: "Grunderwerbsteuer, Rechtsgebühren, usw.",
        }
    };

    const t = translations[language] || translations.en;

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label>{t.price}</Label>
                    <Input
                        type="number"
                        value={localData.price || ''}
                        onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                    />
                </div>
                <div>
                    <Label>{t.size}</Label>
                    <Input
                        type="number"
                        value={localData.size_m2 || ''}
                        onChange={(e) => handleChange('size_m2', parseFloat(e.target.value) || 0)}
                    />
                </div>
            </div>

            <div>
                <Label>{t.property_type}</Label>
                <Select
                    value={localData.property_type || 'office'}
                    onValueChange={(value) => handleChange('property_type', value)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="office">{t.type_office}</SelectItem>
                        <SelectItem value="retail">{t.type_retail}</SelectItem>
                        <SelectItem value="industrial">{t.type_industrial}</SelectItem>
                        <SelectItem value="mixed">{t.type_mixed}</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label>{t.acquisition_costs}</Label>
                <p className="text-sm text-muted-foreground mb-2">{t.acquisition_desc}</p>
                <Input
                    type="number"
                    value={localData.acquisition_costs || 0}
                    onChange={(e) => handleChange('acquisition_costs', parseFloat(e.target.value) || 0)}
                />
            </div>
        </div>
    );
}