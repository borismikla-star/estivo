import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import InfoTooltip from "../../shared/InfoTooltip";

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
            rentable_area: "Rentable/Leasable Area (m²)",
            rentable_area_desc: "Actual area that can be leased to tenants",
            property_type: "Property Type",
            type_office: "Office",
            type_retail: "Retail",
            type_industrial: "Industrial/Warehouse",
            type_mixed: "Mixed Use",
            acquisition_costs: "Acquisition Costs",
            acquisition_desc: "Transfer tax, legal fees, etc.",
            number_of_units: "Number of Units/Tenants",
            number_of_units_desc: "Total rental units or tenant spaces",
            avg_lease_term: "Average Lease Term (years)",
            avg_lease_term_desc: "Typical lease duration for commercial tenants",
        },
        sk: {
            price: "Kúpna cena",
            size: "Celková plocha (m²)",
            rentable_area: "Prenajímateľná plocha (m²)",
            rentable_area_desc: "Skutočná plocha, ktorú je možné prenajať nájomcom",
            property_type: "Typ nehnuteľnosti",
            type_office: "Kancelárske",
            type_retail: "Obchodné",
            type_industrial: "Priemyselné/Sklad",
            type_mixed: "Zmiešané využitie",
            acquisition_costs: "Transakčné náklady",
            acquisition_desc: "Daň z prevodu, právne poplatky, atď.",
            number_of_units: "Počet jednotiek/nájomcov",
            number_of_units_desc: "Celkový počet prenajímateľných priestorov",
            avg_lease_term: "Priemerná dĺžka nájmu (roky)",
            avg_lease_term_desc: "Typická dĺžka nájomnej zmluvy pre komerčných nájomcov",
        },
        pl: {
            price: "Cena zakupu",
            size: "Całkowita powierzchnia (m²)",
            rentable_area: "Powierzchnia do wynajęcia (m²)",
            rentable_area_desc: "Rzeczywista powierzchnia możliwa do wynajęcia najemcom",
            property_type: "Typ nieruchomości",
            type_office: "Biurowy",
            type_retail: "Handlowy",
            type_industrial: "Przemysłowy/Magazyn",
            type_mixed: "Użytek mieszany",
            acquisition_costs: "Koszty nabycia",
            acquisition_desc: "Podatek od transakcji, opłaty prawne, itp.",
            number_of_units: "Liczba lokali/najemców",
            number_of_units_desc: "Całkowita liczba przestrzeni do wynajęcia",
            avg_lease_term: "Średni okres najmu (lata)",
            avg_lease_term_desc: "Typowy okres trwania umowy dla najemców komercyjnych",
        },
        hu: {
            price: "Vételár",
            size: "Teljes terület (m²)",
            rentable_area: "Bérelhető terület (m²)",
            rentable_area_desc: "Tényleges terület, amely bérbe adható bérlőknek",
            property_type: "Ingatlan típusa",
            type_office: "Iroda",
            type_retail: "Kereskedelmi",
            type_industrial: "Ipari/Raktár",
            type_mixed: "Vegyes használat",
            acquisition_costs: "Vásárlási költségek",
            acquisition_desc: "Illeték, jogi díjak, stb.",
            number_of_units: "Egységek/bérlők száma",
            number_of_units_desc: "Összes bérelhető helyiség",
            avg_lease_term: "Átlagos bérleti idő (év)",
            avg_lease_term_desc: "Tipikus bérleti szerződés időtartama kereskedelmi bérlőknél",
        },
        de: {
            price: "Kaufpreis",
            size: "Gesamtfläche (m²)",
            rentable_area: "Vermietbare Fläche (m²)",
            rentable_area_desc: "Tatsächliche Fläche, die an Mieter vermietet werden kann",
            property_type: "Immobilientyp",
            type_office: "Büro",
            type_retail: "Einzelhandel",
            type_industrial: "Industrie/Lager",
            type_mixed: "Mischnutzung",
            acquisition_costs: "Erwerbsnebenkosten",
            acquisition_desc: "Grunderwerbsteuer, Rechtsgebühren, usw.",
            number_of_units: "Anzahl der Einheiten/Mieter",
            number_of_units_desc: "Gesamtzahl der vermietbaren Räume",
            avg_lease_term: "Durchschnittliche Mietdauer (Jahre)",
            avg_lease_term_desc: "Typische Mietvertragsdauer für Gewerbemieter",
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Label>{t.rentable_area}</Label>
                        <InfoTooltip content={t.rentable_area_desc} />
                    </div>
                    <Input
                        type="number"
                        value={localData.rentable_area_m2 || ''}
                        onChange={(e) => handleChange('rentable_area_m2', parseFloat(e.target.value) || 0)}
                        placeholder={localData.size_m2 ? (localData.size_m2 * 0.85).toFixed(0) : '0'}
                    />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Label>{t.number_of_units}</Label>
                        <InfoTooltip content={t.number_of_units_desc} />
                    </div>
                    <Input
                        type="number"
                        value={localData.number_of_units || ''}
                        onChange={(e) => handleChange('number_of_units', parseInt(e.target.value) || 1)}
                        placeholder="1"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <div className="flex items-center gap-2 mb-2">
                        <Label>{t.avg_lease_term}</Label>
                        <InfoTooltip content={t.avg_lease_term_desc} />
                    </div>
                    <Input
                        type="number"
                        value={localData.avg_lease_term_years || ''}
                        onChange={(e) => handleChange('avg_lease_term_years', parseFloat(e.target.value) || 5)}
                        placeholder="5"
                    />
                </div>
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