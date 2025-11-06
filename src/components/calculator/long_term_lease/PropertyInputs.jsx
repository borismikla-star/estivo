
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InfoTooltip from '@/components/shared/InfoTooltip';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';

export default function PropertyInputs({ data, onChange, onEstimateRent, isEstimatingRent, language = 'en' }) {
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
            monthly_rent: "Monthly Rent",
            estimate_rent: "Estimate with AI",
            estimating: "Analyzing...",
            property_address: "Property Address",
            property_type: "Property Type",
            type_apartment: "Apartment",
            type_house: "House",
            type_commercial: "Commercial",
            bedrooms: "Number of Bedrooms",
            bathrooms: "Number of Bathrooms",
            year_built: "Year Built",
        },
        sk: {
            purchase_price: "Kúpna cena",
            property_size: "Veľkosť nehnuteľnosti (m²)",
            monthly_rent: "Mesačný nájom",
            estimate_rent: "Odhadnúť s AI",
            estimating: "Analyzujem...",
            property_address: "Adresa nehnuteľnosti",
            property_type: "Typ nehnuteľnosti",
            type_apartment: "Byt",
            type_house: "Dom",
            type_commercial: "Komerčné",
            bedrooms: "Počet spální",
            bathrooms: "Počet kúpeľní",
            year_built: "Rok výstavby",
        },
        pl: {
            purchase_price: "Cena zakupu",
            property_size: "Rozmiar nieruchomości (m²)",
            monthly_rent: "Miesięczny czynsz",
            estimate_rent: "Oszacuj z AI",
            estimating: "Analizuję...",
            property_address: "Adres nieruchomości",
            property_type: "Typ nieruchomości",
            type_apartment: "Mieszkanie",
            type_house: "Dom",
            type_commercial: "Komercyjny",
            bedrooms: "Liczba sypialni",
            bathrooms: "Liczba łazienek",
            year_built: "Rok budowy",
        },
        hu: {
            purchase_price: "Vételár",
            property_size: "Ingatlan mérete (m²)",
            monthly_rent: "Havi bérleti díj",
            estimate_rent: "Becslés AI-val",
            estimating: "Elemzés...",
            property_address: "Ingatlan címe",
            property_type: "Ingatlan típusa",
            type_apartment: "Lakás",
            type_house: "Ház",
            type_commercial: "Kereskedelmi",
            bedrooms: "Hálószobák száma",
            bathrooms: "Fürdőszobák száma",
            year_built: "Építési év",
        },
        de: {
            purchase_price: "Kaufpreis",
            property_size: "Immobiliengröße (m²)",
            monthly_rent: "Monatliche Miete",
            estimate_rent: "Mit AI schätzen",
            estimating: "Analysiere...",
            property_address: "Immobilienadresse",
            property_type: "Immobilientyp",
            type_apartment: "Wohnung",
            type_house: "Haus",
            type_commercial: "Gewerbe",
            bedrooms: "Anzahl Schlafzimmer",
            bathrooms: "Anzahl Badezimmer",
            year_built: "Baujahr",
        }
    };

    const t = translations[language] || translations.en;

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="purchase_price">{t.purchase_price}</Label>
                    <Input
                        id="purchase_price"
                        type="number"
                        value={localData.purchase_price || ''}
                        onChange={(e) => handleChange('purchase_price', parseFloat(e.target.value) || 0)}
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label htmlFor="property_size">{t.property_size}</Label>
                    <Input
                        id="property_size"
                        type="number"
                        value={localData.size_m2 || ''}
                        onChange={(e) => handleChange('size_m2', parseFloat(e.target.value) || 0)}
                        className="mt-1"
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="monthly_rent">{t.monthly_rent}</Label>
                <div className="flex gap-2 mt-1">
                    <Input
                        id="monthly_rent"
                        type="number"
                        value={localData.monthly_rent || ''}
                        onChange={(e) => handleChange('monthly_rent', parseFloat(e.target.value) || 0)}
                        className="flex-1"
                    />
                    {/* AI Estimate button disabled for now */}
                    {/*
                    <Button
                        onClick={onEstimateRent}
                        disabled={isEstimatingRent}
                        variant="outline"
                    >
                        {isEstimatingRent ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t.estimating}
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                {t.estimate_rent}
                            </>
                        )}
                    </Button>
                    */}
                </div>
            </div>
        </div>
    );
}
