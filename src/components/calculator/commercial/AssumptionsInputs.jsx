import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Sparkles, Calculator } from "lucide-react";
import InfoTooltip from "../../shared/InfoTooltip";

export default function AssumptionsInputs({ data, onChange, language = 'en', countryPreset }) {
    const [localData, setLocalData] = useState(data);

    useEffect(() => {
        setLocalData(data);
    }, [data]);

    const handleChange = (field, value) => {
        const updated = { ...localData, [field]: value };
        setLocalData(updated);
        onChange(updated);
    };

    const handleNumberChange = (field, value) => {
        const updated = { ...localData, [field]: parseFloat(value) || 0, [`${field}_auto`]: false };
        setLocalData(updated);
        onChange(updated);
    };

    const toggleAuto = (field, autoValue) => {
        const isAuto = localData[`${field}_auto`] !== false;
        if (isAuto) {
            const updated = { ...localData, [`${field}_auto`]: false };
            setLocalData(updated);
            onChange(updated);
        } else {
            const updated = { ...localData, [field]: autoValue, [`${field}_auto`]: true };
            setLocalData(updated);
            onChange(updated);
        }
    };

    // Auto-set exit_cap_rate and discount_rate from country preset when preset changes
    useEffect(() => {
        if (!countryPreset) return;
        const updates = {};
        if (localData.exit_cap_rate_auto !== false) {
            updates.exit_cap_rate = countryPreset.npv_discount_rate || 6;
            updates.exit_cap_rate_auto = true;
        }
        if (localData.discount_rate_auto !== false) {
            updates.discount_rate = countryPreset.npv_discount_rate || 8;
            updates.discount_rate_auto = true;
        }
        if (Object.keys(updates).length > 0) {
            const updated = { ...localData, ...updates };
            setLocalData(updated);
            onChange(updated);
        }
    }, [countryPreset?.country_code]);

    const translations = {
        en: {
            tax_section: "Tax Settings",
            vat_payer: "VAT Payer",
            vat_payer_tooltip: "Check if you are registered as VAT payer. VAT payers can deduct input VAT from costs, which affects net investment amounts and cash flows.",
            vat_payer_yes: "Yes, I am VAT payer",
            vat_payer_no: "No, I am not VAT payer",
            vat_rate: "VAT Rate (%)",
            vat_rate_tooltip: "Standard VAT rate in your country (automatically set based on country selection)",
            investment_section: "Investment Assumptions",
            holding_period: "Holding Period (years)",
            holding_desc: "How long you plan to hold the property",
            annual_appreciation: "Annual Property Appreciation (%)",
            appreciation_desc: "Expected yearly increase in property value",
            rent_growth: "Annual Rent Growth (%)",
            rent_growth_desc: "Expected yearly rent increase",
            exit_cap_rate: "Exit Cap Rate (%)",
            exit_cap_desc: "Cap rate assumption for property sale (auto: from country preset)",
            discount_rate: "Discount Rate for NPV (%)",
            discount_desc: "Your required rate of return (auto: from country preset)",
            auto_calculate: "Auto",
        },
        sk: {
            tax_section: "Daňové nastavenia",
            vat_payer: "Platca DPH",
            vat_payer_tooltip: "Označte, ak ste registrovaný platca DPH. Platcovia DPH môžu odpočítať vstupnú DPH z nákladov, čo ovplyvňuje čisté investičné sumy a cash flow.",
            vat_payer_yes: "Áno, som platca DPH",
            vat_payer_no: "Nie, nie som platca DPH",
            vat_rate: "Sadzba DPH (%)",
            vat_rate_tooltip: "Štandardná sadzba DPH vo vašej krajine (automaticky nastavená podľa výberu krajiny)",
            investment_section: "Investičné predpoklady",
            holding_period: "Doba držby (roky)",
            holding_desc: "Ako dlho plánujete držať nehnuteľnosť",
            annual_appreciation: "Ročná apreciácia nehnuteľnosti (%)",
            appreciation_desc: "Očakávaný ročný nárast hodnoty nehnuteľnosti",
            rent_growth: "Ročný rast nájmu (%)",
            rent_growth_desc: "Očakávaný ročný nárast nájmu",
            exit_cap_rate: "Výstupný Cap Rate (%)",
            exit_cap_desc: "Predpoklad Cap Rate pri predaji nehnuteľnosti (auto: z predvoľby krajiny)",
            discount_rate: "Diskontná sadzba pre NPV (%)",
            discount_desc: "Vaša požadovaná miera návratnosti (auto: z predvoľby krajiny)",
            auto_calculate: "Auto",
        },
        pl: {
            tax_section: "Ustawienia podatkowe",
            vat_payer: "Płatnik VAT",
            vat_payer_tooltip: "Zaznacz, jeśli jesteś zarejestrowanym płatnikiem VAT.",
            vat_payer_yes: "Tak, jestem płatnikiem VAT",
            vat_payer_no: "Nie, nie jestem płatnikiem VAT",
            vat_rate: "Stawka VAT (%)",
            vat_rate_tooltip: "Standardowa stawka VAT w Twoim kraju",
            investment_section: "Założenia inwestycyjne",
            holding_period: "Okres utrzymywania (lata)",
            holding_desc: "Jak długo planujesz utrzymywać nieruchomość",
            annual_appreciation: "Roczny wzrost wartości (%)",
            appreciation_desc: "Oczekiwany roczny wzrost wartości nieruchomości",
            rent_growth: "Roczny wzrost czynszu (%)",
            rent_growth_desc: "Oczekiwany roczny wzrost czynszu",
            exit_cap_rate: "Współczynnik kapitalizacji wyjścia (%)",
            exit_cap_desc: "Założenie Cap Rate przy sprzedaży (auto: z ustawień kraju)",
            discount_rate: "Stopa dyskontowa dla NPV (%)",
            discount_desc: "Twoja wymagana stopa zwrotu (auto: z ustawień kraju)",
            auto_calculate: "Auto",
        },
        hu: {
            tax_section: "Adóbeállítások",
            vat_payer: "ÁFA fizető",
            vat_payer_tooltip: "Jelölje be, ha regisztrált ÁFA fizető.",
            vat_payer_yes: "Igen, ÁFA fizető vagyok",
            vat_payer_no: "Nem, nem vagyok ÁFA fizető",
            vat_rate: "ÁFA kulcs (%)",
            vat_rate_tooltip: "Szabványos ÁFA kulcs az országban",
            investment_section: "Befektetési feltételezések",
            holding_period: "Tartási időszak (év)",
            holding_desc: "Mennyi ideig tervezi tartani az ingatlant",
            annual_appreciation: "Éves értéknövekedés (%)",
            appreciation_desc: "Várható éves növekedés az ingatlan értékében",
            rent_growth: "Éves bérleti díj növekedés (%)",
            rent_growth_desc: "Várható éves bérleti díj növekedés",
            exit_cap_rate: "Kilépési Cap Rate (%)",
            exit_cap_desc: "Cap Rate feltételezés az eladáshoz (auto: ország beállítás)",
            discount_rate: "Diszkontráta az NPV-hez (%)",
            discount_desc: "Az Ön által megkövetelt megtérülési ráta (auto: ország beállítás)",
            auto_calculate: "Auto",
        },
        de: {
            tax_section: "Steuereinstellungen",
            vat_payer: "Umsatzsteuerpflichtig",
            vat_payer_tooltip: "Ankreuzen, wenn Sie als Umsatzsteuerpflichtiger registriert sind.",
            vat_payer_yes: "Ja, ich bin umsatzsteuerpflichtig",
            vat_payer_no: "Nein, ich bin nicht umsatzsteuerpflichtig",
            vat_rate: "Umsatzsteuersatz (%)",
            vat_rate_tooltip: "Standard-Umsatzsteuersatz in Ihrem Land",
            investment_section: "Investitionsannahmen",
            holding_period: "Haltedauer (Jahre)",
            holding_desc: "Wie lange Sie die Immobilie halten möchten",
            annual_appreciation: "Jährliche Wertsteigerung (%)",
            appreciation_desc: "Erwartete jährliche Wertsteigerung der Immobilie",
            rent_growth: "Jährliches Mietwachstum (%)",
            rent_growth_desc: "Erwartete jährliche Mieterhöhung",
            exit_cap_rate: "Exit Cap Rate (%)",
            exit_cap_desc: "Cap Rate Annahme für Immobilienverkauf (auto: Ländereinstellung)",
            discount_rate: "Diskontsatz für NPV (%)",
            discount_desc: "Ihre geforderte Rendite (auto: Ländereinstellung)",
            auto_calculate: "Auto",
        }
    };

    const t = translations[language] || translations.en;
    const vatRate = countryPreset?.vat_rate || 20;

    const AutoField = ({ field, label, desc, step = "0.1", defaultVal, autoValue }) => {
        const isAuto = localData[`${field}_auto`] !== false;
        return (
            <div>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Label>{label}</Label>
                        <InfoTooltip content={desc} />
                    </div>
                    <div className="flex items-center gap-2">
                        <Switch
                            checked={isAuto}
                            onCheckedChange={() => toggleAuto(field, autoValue)}
                            className="data-[state=checked]:bg-primary"
                        />
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            {isAuto ? <Sparkles className="w-3 h-3 text-primary" /> : <Calculator className="w-3 h-3" />}
                            {t.auto_calculate}
                        </span>
                    </div>
                </div>
                <div className="relative">
                    <Input
                        type="number"
                        step={step}
                        value={localData[field] ?? defaultVal}
                        onChange={(e) => handleNumberChange(field, e.target.value)}
                        disabled={isAuto}
                        className={isAuto ? 'bg-primary/5 border-primary/30' : ''}
                    />
                    {isAuto && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Tax Settings Section */}
            <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-base font-semibold text-foreground">{t.tax_section}</h4>

                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Label className="text-sm font-semibold">{t.vat_payer}</Label>
                        <InfoTooltip content={t.vat_payer_tooltip} />
                    </div>
                    <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg bg-white hover:bg-blue-50/50 transition-colors border border-blue-100">
                        <input
                            type="checkbox"
                            checked={localData.vat_payer || false}
                            onChange={(e) => handleChange('vat_payer', e.target.checked)}
                            className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
                        />
                        <span className="text-sm font-medium">
                            {localData.vat_payer ? t.vat_payer_yes : t.vat_payer_no}
                        </span>
                    </label>
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Label>{t.vat_rate}</Label>
                        <InfoTooltip content={t.vat_rate_tooltip} />
                    </div>
                    <Input
                        type="number"
                        step="0.1"
                        value={vatRate}
                        disabled
                        className="bg-gray-50"
                    />
                </div>
            </div>

            {/* Investment Assumptions Section */}
            <div className="space-y-4">
                <h4 className="text-base font-semibold text-foreground">{t.investment_section}</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Label>{t.holding_period}</Label>
                            <InfoTooltip content={t.holding_desc} />
                        </div>
                        <Input
                            type="number"
                            value={localData.holding_period ?? 10}
                            onChange={(e) => handleNumberChange('holding_period', e.target.value)}
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Label>{t.annual_appreciation}</Label>
                            <InfoTooltip content={t.appreciation_desc} />
                        </div>
                        <Input
                            type="number"
                            step="0.1"
                            value={localData.annual_appreciation ?? 2}
                            onChange={(e) => handleNumberChange('annual_appreciation', e.target.value)}
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Label>{t.rent_growth}</Label>
                            <InfoTooltip content={t.rent_growth_desc} />
                        </div>
                        <Input
                            type="number"
                            step="0.1"
                            value={localData.rent_growth ?? 2}
                            onChange={(e) => handleNumberChange('rent_growth', e.target.value)}
                        />
                    </div>

                    {/* Exit Cap Rate – with auto switch */}
                    <AutoField
                        field="exit_cap_rate"
                        label={t.exit_cap_rate}
                        desc={t.exit_cap_desc}
                        step="0.01"
                        defaultVal={6}
                        autoValue={countryPreset?.npv_discount_rate || 6}
                    />

                    {/* Discount Rate – with auto switch */}
                    <AutoField
                        field="discount_rate"
                        label={t.discount_rate}
                        desc={t.discount_desc}
                        step="0.1"
                        defaultVal={8}
                        autoValue={countryPreset?.npv_discount_rate || 8}
                    />
                </div>
            </div>
        </div>
    );
}