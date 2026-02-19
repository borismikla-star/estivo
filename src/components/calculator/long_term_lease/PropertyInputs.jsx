import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InfoTooltip from '../../shared/InfoTooltip';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { useVatHints } from '../VatInputBanner';

export default function PropertyInputs({ data, onChange, onEstimateRent, isEstimatingRent, language = 'en', isVatPayer = false }) {
    const [localData, setLocalData] = useState(data);
    const vatHints = useVatHints(language);

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
            purchase_price_tooltip: "Total amount you'll pay to purchase the property",
            property_size: "Property Size (m²)",
            property_size_tooltip: "Total living area of the property in square meters",
            monthly_rent: "Monthly Rent",
            monthly_rent_tooltip: "Expected monthly rental income from tenant",
            estimate_rent: "Estimate with AI",
            estimating: "Analyzing...",
            property_address: "Property Address",
            property_type: "Property Type",
            type_apartment: "Apartment",
            type_house: "House",
            type_commercial: "Commercial",
            bedrooms: "Number of Bedrooms",
            bedrooms_tooltip: "Total number of bedrooms in the property",
            bathrooms: "Number of Bathrooms",
            bathrooms_tooltip: "Total number of bathrooms in the property",
            year_built: "Year Built",
            year_built_tooltip: "Construction year of the property",
        },
        sk: {
            purchase_price: "Kúpna cena",
            purchase_price_tooltip: "Celková suma, ktorú zaplatíte za kúpu nehnuteľnosti",
            property_size: "Veľkosť nehnuteľnosti (m²)",
            property_size_tooltip: "Celková obytná plocha nehnuteľnosti v metroch štvorcových",
            monthly_rent: "Mesačný nájom",
            monthly_rent_tooltip: "Očakávaný mesačný príjem z prenájmu od nájomcu",
            estimate_rent: "Odhadnúť s AI",
            estimating: "Analyzujem...",
            property_address: "Adresa nehnuteľnosti",
            property_type: "Typ nehnuteľnosti",
            type_apartment: "Byt",
            type_house: "Dom",
            type_commercial: "Komerčné",
            bedrooms: "Počet spální",
            bedrooms_tooltip: "Celkový počet spální v nehnuteľnosti",
            bathrooms: "Počet kúpeľní",
            bathrooms_tooltip: "Celkový počet kúpeľní v nehnuteľnosti",
            year_built: "Rok výstavby",
            year_built_tooltip: "Rok výstavby nehnuteľnosti",
        },
        pl: {
            purchase_price: "Cena zakupu",
            purchase_price_tooltip: "Całkowita kwota, którą zapłacisz za zakup nieruchomości",
            property_size: "Rozmiar nieruchomości (m²)",
            property_size_tooltip: "Całkowita powierzchnia mieszkalna nieruchomości w metrach kwadratowych",
            monthly_rent: "Miesięczny czynsz",
            monthly_rent_tooltip: "Oczekiwany miesięczny dochód z wynajmu od najemcy",
            estimate_rent: "Oszacuj z AI",
            estimating: "Analizuję...",
            property_address: "Adres nieruchomości",
            property_type: "Typ nieruchomości",
            type_apartment: "Mieszkanie",
            type_house: "Dom",
            type_commercial: "Komercyjny",
            bedrooms: "Liczba sypialni",
            bedrooms_tooltip: "Całkowita liczba sypialni w nieruchomości",
            bathrooms: "Liczba łazienek",
            bathrooms_tooltip: "Całkowita liczba łazienek w nieruchomości",
            year_built: "Rok budowy",
            year_built_tooltip: "Rok budowy nieruchomości",
        },
        hu: {
            purchase_price: "Vételár",
            purchase_price_tooltip: "Teljes összeg, amelyet az ingatlan megvásárlásáért fizet",
            property_size: "Ingatlan mérete (m²)",
            property_size_tooltip: "Az ingatlan teljes lakóterülete négyzetméterben",
            monthly_rent: "Havi bérleti díj",
            monthly_rent_tooltip: "Várható havi bérleti bevétel a bérlőtől",
            estimate_rent: "Becslés AI-val",
            estimating: "Elemzés...",
            property_address: "Ingatlan címe",
            property_type: "Ingatlan típusa",
            type_apartment: "Lakás",
            type_house: "Ház",
            type_commercial: "Kereskedelmi",
            bedrooms: "Hálószobák száma",
            bedrooms_tooltip: "Az ingatlanban lévő hálószobák teljes száma",
            bathrooms: "Fürdőszobák száma",
            bathrooms_tooltip: "Az ingatlanban lévő fürdőszobák teljes száma",
            year_built: "Építési év",
            year_built_tooltip: "Az ingatlan építésének éve",
        },
        de: {
            purchase_price: "Kaufpreis",
            purchase_price_tooltip: "Gesamtbetrag, den Sie für den Kauf der Immobilie zahlen werden",
            property_size: "Immobiliengröße (m²)",
            property_size_tooltip: "Gesamte Wohnfläche der Immobilie in Quadratmetern",
            monthly_rent: "Monatliche Miete",
            monthly_rent_tooltip: "Erwartete monatliche Mieteinnahmen vom Mieter",
            estimate_rent: "Mit AI schätzen",
            estimating: "Analysiere...",
            property_address: "Immobilienadresse",
            property_type: "Immobilientyp",
            type_apartment: "Wohnung",
            type_house: "Haus",
            type_commercial: "Gewerbe",
            bedrooms: "Anzahl Schlafzimmer",
            bedrooms_tooltip: "Gesamtzahl der Schlafzimmer in der Immobilie",
            bathrooms: "Anzahl Badezimmer",
            bathrooms_tooltip: "Gesamtzahl der Badezimmer in der Immobilie",
            year_built: "Baujahr",
            year_built_tooltip: "Baujahr der Immobilie",
        }
    };

    const t = translations[language] || translations.en;

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Label htmlFor="purchase_price">{t.purchase_price}</Label>
                        <InfoTooltip content={t.purchase_price_tooltip} />
                    </div>
                    <Input
                        id="purchase_price"
                        type="number"
                        value={localData.purchase_price || ''}
                        onChange={(e) => handleChange('purchase_price', parseFloat(e.target.value) || 0)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                        {isVatPayer ? vatHints.hint_price_vat : vatHints.hint_price_no_vat}
                    </p>
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Label htmlFor="property_size">{t.property_size}</Label>
                        <InfoTooltip content={t.property_size_tooltip} />
                    </div>
                    <Input
                        id="property_size"
                        type="number"
                        value={localData.size_m2 || ''}
                        onChange={(e) => handleChange('size_m2', parseFloat(e.target.value) || 0)}
                    />
                </div>
            </div>

            <div>
                <div className="flex items-center gap-2 mb-2">
                    <Label htmlFor="monthly_rent">{t.monthly_rent}</Label>
                    <InfoTooltip content={t.monthly_rent_tooltip} />
                </div>
                <div className="flex gap-2">
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
                <p className="text-xs text-muted-foreground mt-1">{vatHints.hint_rent}</p>
                </div>
                </div>
                );
                }