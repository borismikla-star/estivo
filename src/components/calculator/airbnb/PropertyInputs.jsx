import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InfoTooltip from '../../shared/InfoTooltip';
import { useVatHints } from '../VatInputBanner';

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
            purchase_price_tooltip: "Total amount you'll pay to purchase the property",
            property_size: "Property Size (m²)",
            property_size_tooltip: "Total living area of the property in square meters",
            bedrooms: "Number of Bedrooms",
            bedrooms_tooltip: "Total number of bedrooms - affects pricing and guest capacity",
            bathrooms: "Number of Bathrooms",
            bathrooms_tooltip: "Total number of bathrooms - important for guest comfort",
            max_guests: "Maximum Guests",
            max_guests_tooltip: "Maximum number of guests allowed - affects pricing strategy",
            furnishing_cost: "Furnishing & Setup Costs",
            furnishing_tooltip: "Furniture, appliances, linens, kitchen supplies, decor - everything needed for Airbnb",
            acquisition_costs: "Acquisition Costs",
            acquisition_tooltip: "Transfer tax, legal fees, notary fees, registration costs",
        },
        sk: {
            purchase_price: "Kúpna cena",
            purchase_price_tooltip: "Celková suma, ktorú zaplatíte za kúpu nehnuteľnosti",
            property_size: "Veľkosť nehnuteľnosti (m²)",
            property_size_tooltip: "Celková obytná plocha nehnuteľnosti v metroch štvorcových",
            bedrooms: "Počet spální",
            bedrooms_tooltip: "Celkový počet spální - ovplyvňuje cenu a kapacitu hostí",
            bathrooms: "Počet kúpeľní",
            bathrooms_tooltip: "Celkový počet kúpeľní - dôležité pre pohodlie hostí",
            max_guests: "Maximálny počet hostí",
            max_guests_tooltip: "Maximálny povolený počet hostí - ovplyvňuje cenovú stratégiu",
            furnishing_cost: "Náklady na zariadenie",
            furnishing_tooltip: "Nábytok, spotrebiče, posteľná bielizeň, kuchynské potreby, výzdoba - všetko potrebné pre Airbnb",
            acquisition_costs: "Transakčné náklady",
            acquisition_tooltip: "Daň z prevodu, právne poplatky, notárske poplatky, poplatky za registráciu",
        },
        pl: {
            purchase_price: "Cena zakupu",
            purchase_price_tooltip: "Całkowita kwota, którą zapłacisz za zakup nieruchomości",
            property_size: "Rozmiar nieruchomości (m²)",
            property_size_tooltip: "Całkowita powierzchnia mieszkalna nieruchomości w metrach kwadratowych",
            bedrooms: "Liczba sypialni",
            bedrooms_tooltip: "Całkowita liczba sypialni - wpływa na cenę i pojemność gości",
            bathrooms: "Liczba łazienek",
            bathrooms_tooltip: "Całkowita liczba łazienek - ważna dla komfortu gości",
            max_guests: "Maksymalna liczba gości",
            max_guests_tooltip: "Maksymalna dozwolona liczba gości - wpływa na strategię cenową",
            furnishing_cost: "Koszty umeblowania",
            furnishing_tooltip: "Meble, urządzenia, pościel, przybory kuchenne, dekoracje - wszystko potrzebne do Airbnb",
            acquisition_costs: "Koszty nabycia",
            acquisition_tooltip: "Podatek od transakcji, opłaty prawne, notarialne, koszty rejestracji",
        },
        hu: {
            purchase_price: "Vételár",
            purchase_price_tooltip: "Teljes összeg, amelyet az ingatlan megvásárlásáért fizet",
            property_size: "Ingatlan mérete (m²)",
            property_size_tooltip: "Az ingatlan teljes lakóterülete négyzetméterben",
            bedrooms: "Hálószobák száma",
            bedrooms_tooltip: "Hálószobák száma összesen - befolyásolja az árat és a vendégkapacitást",
            bathrooms: "Fürdőszobák száma",
            bathrooms_tooltip: "Fürdőszobák száma összesen - fontos a vendégek kényelme szempontjából",
            max_guests: "Maximum vendégek száma",
            max_guests_tooltip: "Engedélyezett vendégek maximális száma - befolyásolja az árstratégiát",
            furnishing_cost: "Bútorozási költségek",
            furnishing_tooltip: "Bútorok, készülékek, ágyneműk, konyhai kellékek, díszítés - minden, ami az Airbnb-hez szükséges",
            acquisition_costs: "Vásárlási költségek",
            acquisition_tooltip: "Illeték, jogi díjak, közjegyzői díjak, bejegyzési költségek",
        },
        de: {
            purchase_price: "Kaufpreis",
            purchase_price_tooltip: "Gesamtbetrag, den Sie für den Kauf der Immobilie zahlen werden",
            property_size: "Immobiliengröße (m²)",
            property_size_tooltip: "Gesamte Wohnfläche der Immobilie in Quadratmetern",
            bedrooms: "Anzahl Schlafzimmer",
            bedrooms_tooltip: "Gesamtzahl der Schlafzimmer - beeinflusst Preis und Gästekapazität",
            bathrooms: "Anzahl Badezimmer",
            bathrooms_tooltip: "Gesamtzahl der Badezimmer - wichtig für Gästekomfort",
            max_guests: "Maximale Gästeanzahl",
            max_guests_tooltip: "Maximal erlaubte Gästeanzahl - beeinflusst Preisstrategie",
            furnishing_cost: "Möblierungskosten",
            furnishing_tooltip: "Möbel, Geräte, Bettwäsche, Küchenutensilien, Dekoration - alles Nötige für Airbnb",
            acquisition_costs: "Erwerbsnebenkosten",
            acquisition_tooltip: "Grunderwerbsteuer, Rechtsgebühren, Notargebühren, Registrierungskosten",
        }
    };

    const t = translations[language] || translations.en;

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Label>{t.purchase_price}</Label>
                        <InfoTooltip content={t.purchase_price_tooltip} />
                    </div>
                    <Input
                        type="number"
                        value={localData.purchase_price || ''}
                        onChange={(e) => handleChange('purchase_price', parseFloat(e.target.value) || 0)}
                    />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Label>{t.property_size}</Label>
                        <InfoTooltip content={t.property_size_tooltip} />
                    </div>
                    <Input
                        type="number"
                        value={localData.size_m2 || ''}
                        onChange={(e) => handleChange('size_m2', parseFloat(e.target.value) || 0)}
                    />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Label>{t.bedrooms}</Label>
                        <InfoTooltip content={t.bedrooms_tooltip} />
                    </div>
                    <Input
                        type="number"
                        value={localData.bedrooms || 1}
                        onChange={(e) => handleChange('bedrooms', parseInt(e.target.value) || 0)}
                    />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Label>{t.bathrooms}</Label>
                        <InfoTooltip content={t.bathrooms_tooltip} />
                    </div>
                    <Input
                        type="number"
                        value={localData.bathrooms || 1}
                        onChange={(e) => handleChange('bathrooms', parseInt(e.target.value) || 0)}
                    />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Label>{t.max_guests}</Label>
                        <InfoTooltip content={t.max_guests_tooltip} />
                    </div>
                    <Input
                        type="number"
                        value={localData.max_guests || 2}
                        onChange={(e) => handleChange('max_guests', parseInt(e.target.value) || 0)}
                    />
                </div>
            </div>

            <div>
                <div className="flex items-center gap-2 mb-2">
                    <Label>{t.furnishing_cost}</Label>
                    <InfoTooltip content={t.furnishing_tooltip} />
                </div>
                <Input
                    type="number"
                    value={localData.furnishing_cost || 0}
                    onChange={(e) => handleChange('furnishing_cost', parseFloat(e.target.value) || 0)}
                />
            </div>

            <div>
                <div className="flex items-center gap-2 mb-2">
                    <Label>{t.acquisition_costs}</Label>
                    <InfoTooltip content={t.acquisition_tooltip} />
                </div>
                <Input
                    type="number"
                    value={localData.acquisition_costs || 0}
                    onChange={(e) => handleChange('acquisition_costs', parseFloat(e.target.value) || 0)}
                />
            </div>
        </div>
    );
}