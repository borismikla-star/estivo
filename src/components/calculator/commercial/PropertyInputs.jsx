import React, { useState, useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Calculator } from "lucide-react";
import InfoTooltip from "../../shared/InfoTooltip";

export default function PropertyInputs({ data, onChange, language = 'en' }) {
    const [autoMode, setAutoMode] = useState(data.rentable_area_auto !== false);
    
    // Track last calculated values to prevent unnecessary updates
    const lastCalculatedTotalAreaRef = useRef(null);
    const lastCalculatedRentableAreaRef = useRef(null);

    // Sync autoMode when data changes from parent
    useEffect(() => {
        if (data.rentable_area_auto !== undefined && data.rentable_area_auto !== autoMode) {
            setAutoMode(data.rentable_area_auto);
        }
    }, [data.rentable_area_auto, autoMode]);

    // Auto-calculate rentable area when total area changes
    useEffect(() => {
        const totalArea = data.size_m2;
        const currentRentableArea = data.rentable_area_m2;
        
        console.log('[PropertyInputs] Checking for rentable area calculation', {
            autoMode,
            totalArea,
            currentRentableArea,
            lastCalculatedTotalArea: lastCalculatedTotalAreaRef.current,
            lastCalculatedRentableArea: lastCalculatedRentableAreaRef.current
        });
        
        if (!autoMode) {
            console.log('[PropertyInputs] Auto mode is OFF, skipping');
            return;
        }
        
        if (!totalArea || totalArea <= 0) {
            console.log('[PropertyInputs] No total area yet, skipping');
            return;
        }
        
        // Check if we need to recalculate
        const totalAreaChanged = lastCalculatedTotalAreaRef.current !== totalArea;
        const neverCalculated = lastCalculatedTotalAreaRef.current === null;
        
        if (!totalAreaChanged && !neverCalculated) {
            console.log('[PropertyInputs] No relevant changes, skipping calculation');
            return;
        }
        
        // Calculate rentable area as 85% of total area (15% less for common areas, corridors, etc.)
        const calculatedRentableArea = Math.round(totalArea * 0.85);
        
        // Only update if the calculated value is different from current
        if (calculatedRentableArea === currentRentableArea && calculatedRentableArea === lastCalculatedRentableAreaRef.current) {
            console.log('[PropertyInputs] Calculated rentable area matches current, skipping update');
            lastCalculatedTotalAreaRef.current = totalArea;
            return;
        }
        
        console.log('[PropertyInputs] AUTO-CALCULATING rentable area:', {
            totalArea,
            calculatedRentableArea,
            percentage: 85,
            reason: neverCalculated ? 'first calculation' : 'total area changed'
        });
        
        // Update tracking refs BEFORE calling onChange
        lastCalculatedTotalAreaRef.current = totalArea;
        lastCalculatedRentableAreaRef.current = calculatedRentableArea;
        
        // CRITICAL: Update the data and call onChange immediately
        onChange({ 
            ...data, 
            rentable_area_m2: calculatedRentableArea,
            rentable_area_auto: true
        });
    }, [data.size_m2, autoMode, data.rentable_area_m2, data, onChange]);

    const handleChange = (field, value) => {
        const updated = { 
            ...data, 
            [field]: value,
            ...(field === 'rentable_area_m2' && { rentable_area_auto: false })
        };
        
        if (field === 'rentable_area_m2') {
            setAutoMode(false);
            // Clear tracking so manual input takes precedence
            lastCalculatedTotalAreaRef.current = null;
            lastCalculatedRentableAreaRef.current = null;
        }
        
        onChange(updated);
    };

    const toggleAutoMode = () => {
        const newAutoMode = !autoMode;
        setAutoMode(newAutoMode);
        
        if (newAutoMode) {
            // Calculate immediately when enabling auto mode
            if (data.size_m2 > 0) {
                const calculatedRentableArea = Math.round(data.size_m2 * 0.85);
                
                console.log('[PropertyInputs] Toggle ON - calculating rentable area:', calculatedRentableArea);
                
                // Update tracking
                lastCalculatedTotalAreaRef.current = data.size_m2;
                lastCalculatedRentableAreaRef.current = calculatedRentableArea;
                
                onChange({ 
                    ...data, 
                    rentable_area_m2: calculatedRentableArea,
                    rentable_area_auto: true
                });
            } else {
                onChange({ 
                    ...data, 
                    rentable_area_auto: true
                });
            }
        } else {
            // When disabling, clear tracking and just update the flag
            lastCalculatedTotalAreaRef.current = null;
            lastCalculatedRentableAreaRef.current = null;
            onChange({ 
                ...data, 
                rentable_area_auto: false
            });
        }
    };

    const translations = {
        en: {
            price: "Purchase Price",
            size: "Total Area (m²)",
            rentable_area: "Rentable/Leasable Area (m²)",
            rentable_area_desc: "Actual area that can be leased to tenants (auto: 85% of total area)",
            rentable_area_manual_desc: "Actual area that can be leased to tenants",
            auto_calculate: "Auto-calculate",
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
            tip: "Tip: Rentable area is typically 85% of total area (15% for common spaces).",
        },
        sk: {
            price: "Kúpna cena",
            size: "Celková plocha (m²)",
            rentable_area: "Prenajímateľná plocha (m²)",
            rentable_area_desc: "Skutočná plocha, ktorú je možné prenajať nájomcom (auto: 85% z celkovej plochy)",
            rentable_area_manual_desc: "Skutočná plocha, ktorú je možné prenajať nájomcom",
            auto_calculate: "Automatický výpočet",
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
            tip: "Tip: Prenajímateľná plocha je typicky 85% z celkovej plochy (15% pre spoločné priestory).",
        },
        pl: {
            price: "Cena zakupu",
            size: "Całkowita powierzchnia (m²)",
            rentable_area: "Powierzchnia do wynajęcia (m²)",
            rentable_area_desc: "Rzeczywista powierzchnia możliwa do wynajęcia najemcom (auto: 85% całkowitej)",
            rentable_area_manual_desc: "Rzeczywista powierzchnia możliwa do wynajęcia najemcom",
            auto_calculate: "Automatyczne obliczanie",
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
            tip: "Wskazówka: Powierzchnia do wynajęcia to zazwyczaj 85% całkowitej powierzchni (15% na części wspólne).",
        },
        hu: {
            price: "Vételár",
            size: "Teljes terület (m²)",
            rentable_area: "Bérelhető terület (m²)",
            rentable_area_desc: "Tényleges terület, amely bérbe adható bérlőknek (auto: 85% a teljes területből)",
            rentable_area_manual_desc: "Tényleges terület, amely bérbe adható bérlőknek",
            auto_calculate: "Automatikus számítás",
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
            tip: "Tipp: A bérelhető terület jellemzően 85% a teljes területből (15% közös helyiségek).",
        },
        de: {
            price: "Kaufpreis",
            size: "Gesamtfläche (m²)",
            rentable_area: "Vermietbare Fläche (m²)",
            rentable_area_desc: "Tatsächliche Fläche, die an Mieter vermietet werden kann (auto: 85% der Gesamtfläche)",
            rentable_area_manual_desc: "Tatsächliche Fläche, die an Mieter vermietet werden kann",
            auto_calculate: "Automatische Berechnung",
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
            tip: "Tipp: Die vermietbare Fläche beträgt typischerweise 85% der Gesamtfläche (15% für Gemeinschaftsflächen).",
        }
    };

    const t = translations[language] || translations.en;

    return (
        <div className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                    <strong>💡 {t.tip}</strong>
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label>{t.price}</Label>
                    <Input
                        type="number"
                        value={data.price || ''}
                        onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                    />
                </div>
                <div>
                    <Label>{t.size}</Label>
                    <Input
                        type="number"
                        value={data.size_m2 || ''}
                        onChange={(e) => handleChange('size_m2', parseFloat(e.target.value) || 0)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <Label>{t.rentable_area}</Label>
                            <InfoTooltip content={autoMode ? t.rentable_area_desc : t.rentable_area_manual_desc} />
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch
                                checked={autoMode}
                                onCheckedChange={toggleAutoMode}
                                className="data-[state=checked]:bg-primary"
                            />
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                {autoMode ? <Sparkles className="w-3 h-3 text-primary" /> : <Calculator className="w-3 h-3" />}
                                {t.auto_calculate}
                            </span>
                        </div>
                    </div>
                    <div className="relative">
                        <Input
                            type="number"
                            value={data.rentable_area_m2 || ''}
                            onChange={(e) => handleChange('rentable_area_m2', parseFloat(e.target.value) || 0)}
                            disabled={autoMode}
                            className={autoMode ? 'bg-primary/5 border-primary/30' : ''}
                            placeholder={data.size_m2 ? Math.round(data.size_m2 * 0.85).toString() : '0'}
                        />
                        {autoMode && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Label>{t.number_of_units}</Label>
                        <InfoTooltip content={t.number_of_units_desc} />
                    </div>
                    <Input
                        type="number"
                        value={data.number_of_units || ''}
                        onChange={(e) => handleChange('number_of_units', parseInt(e.target.value) || 1)}
                        placeholder="1"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label>{t.property_type}</Label>
                    <Select
                        value={data.property_type || 'office'}
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
                        value={data.avg_lease_term_years || ''}
                        onChange={(e) => handleChange('avg_lease_term_years', parseFloat(e.target.value) || 5)}
                        placeholder="5"
                    />
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                        <Label>{t.acquisition_costs}</Label>
                        <InfoTooltip content={t.acquisition_desc} />
                    </div>
                    <div className="flex items-center gap-2">
                        <Switch
                            checked={data.acquisition_costs_auto !== false}
                            onCheckedChange={(checked) => {
                                if (checked) {
                                    const auto = Math.round((data.price || 0) * 0.04);
                                    onChange({ ...data, acquisition_costs: auto, acquisition_costs_auto: true });
                                } else {
                                    onChange({ ...data, acquisition_costs_auto: false });
                                }
                            }}
                            className="data-[state=checked]:bg-primary"
                        />
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            {data.acquisition_costs_auto !== false ? <Sparkles className="w-3 h-3 text-primary" /> : <Calculator className="w-3 h-3" />}
                            {t.auto_calculate}
                        </span>
                    </div>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{data.acquisition_costs_auto !== false ? t.acquisition_auto_desc : t.acquisition_desc}</p>
                <div className="relative">
                    <Input
                        type="number"
                        value={data.acquisition_costs || 0}
                        onChange={(e) => handleChange('acquisition_costs', parseFloat(e.target.value) || 0)}
                        disabled={data.acquisition_costs_auto !== false}
                        className={data.acquisition_costs_auto !== false ? 'bg-primary/5 border-primary/30' : ''}
                    />
                    {data.acquisition_costs_auto !== false && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}