import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
            purchase_price: "Purchase Price",
            property_size: "Property Size (m²)",
            bedrooms: "Number of Bedrooms",
            bathrooms: "Number of Bathrooms",
            max_guests: "Maximum Guests",
            furnishing_cost: "Furnishing & Setup Costs",
            furnishing_desc: "Furniture, appliances, linens, decor",
            acquisition_costs: "Acquisition Costs",
            acquisition_desc: "Transfer tax, legal fees, registration",
        },
        sk: {
            purchase_price: "Kúpna cena",
            property_size: "Veľkosť nehnuteľnosti (m²)",
            bedrooms: "Počet spální",
            bathrooms: "Počet kúpeľní",
            max_guests: "Maximálny počet hostí",
            furnishing_cost: "Náklady na zariadenie",
            furnishing_desc: "Nábytok, spotrebiče, posteľná bielizeň, výzdoba",
            acquisition_costs: "Transakčné náklady",
            acquisition_desc: "Daň z prevodu, právne poplatky, registrácia",
        },
        pl: {
            purchase_price: "Cena zakupu",
            property_size: "Rozmiar nieruchomości (m²)",
            bedrooms: "Liczba sypialni",
            bathrooms: "Liczba łazienek",
            max_guests: "Maksymalna liczba gości",
            furnishing_cost: "Koszty umeblowania",
            furnishing_desc: "Meble, urządzenia, pościel, dekoracje",
            acquisition_costs: "Koszty nabycia",
            acquisition_desc: "Podatek od transakcji, opłaty prawne, rejestracja",
        },
        hu: {
            purchase_price: "Vételár",
            property_size: "Ingatlan mérete (m²)",
            bedrooms: "Hálószobák száma",
            bathrooms: "Fürdőszobák száma",
            max_guests: "Maximum vendégek száma",
            furnishing_cost: "Bútorozási költségek",
            furnishing_desc: "Bútorok, készülékek, ágyneműk, díszítés",
            acquisition_costs: "Vásárlási költségek",
            acquisition_desc: "Illeték, jogi díjak, bejegyzés",
        },
        de: {
            purchase_price: "Kaufpreis",
            property_size: "Immobiliengröße (m²)",
            bedrooms: "Anzahl Schlafzimmer",
            bathrooms: "Anzahl Badezimmer",
            max_guests: "Maximale Gästeanzahl",
            furnishing_cost: "Möblierungskosten",
            furnishing_desc: "Möbel, Geräte, Bettwäsche, Dekoration",
            acquisition_costs: "Erwerbsnebenkosten",
            acquisition_desc: "Grunderwerbsteuer, Rechtsgebühren, Registrierung",
        }
    };

    const t = translations[language] || translations.en;

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label>{t.purchase_price}</Label>
                    <Input
                        type="number"
                        value={localData.purchase_price || ''}
                        onChange={(e) => handleChange('purchase_price', parseFloat(e.target.value) || 0)}
                    />
                </div>
                <div>
                    <Label>{t.property_size}</Label>
                    <Input
                        type="number"
                        value={localData.size_m2 || ''}
                        onChange={(e) => handleChange('size_m2', parseFloat(e.target.value) || 0)}
                    />
                </div>
                <div>
                    <Label>{t.bedrooms}</Label>
                    <Input
                        type="number"
                        value={localData.bedrooms || 1}
                        onChange={(e) => handleChange('bedrooms', parseInt(e.target.value) || 0)}
                    />
                </div>
                <div>
                    <Label>{t.bathrooms}</Label>
                    <Input
                        type="number"
                        value={localData.bathrooms || 1}
                        onChange={(e) => handleChange('bathrooms', parseInt(e.target.value) || 0)}
                    />
                </div>
                <div>
                    <Label>{t.max_guests}</Label>
                    <Input
                        type="number"
                        value={localData.max_guests || 2}
                        onChange={(e) => handleChange('max_guests', parseInt(e.target.value) || 0)}
                    />
                </div>
            </div>

            <div>
                <Label>{t.furnishing_cost}</Label>
                <p className="text-sm text-muted-foreground mb-2">{t.furnishing_desc}</p>
                <Input
                    type="number"
                    value={localData.furnishing_cost || 0}
                    onChange={(e) => handleChange('furnishing_cost', parseFloat(e.target.value) || 0)}
                />
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