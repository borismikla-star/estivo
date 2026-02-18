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
        const updated = { ...localData, [field]: parseFloat(value) || 0 };
        setLocalData(updated);
        onChange(updated);
    };

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
            exit_cap_desc: "Cap rate assumption for property sale",
            discount_rate: "Discount Rate for NPV (%)",
            discount_desc: "Your required rate of return",
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
            exit_cap_desc: "Predpoklad Cap Rate pri predaji nehnuteľnosti",
            discount_rate: "Diskontná sadzba pre NPV (%)",
            discount_desc: "Vaša požadovaná miera návratnosti",
        },
        pl: {
            tax_section: "Ustawienia podatkowe",
            vat_payer: "Płatnik VAT",
            vat_payer_tooltip: "Zaznacz, jeśli jesteś zarejestrowanym płatnikiem VAT. Płatnicy VAT mogą odliczyć naliczony VAT od kosztów, co wpływa na kwoty inwestycji netto i przepływy pieniężne.",
            vat_payer_yes: "Tak, jestem płatnikiem VAT",
            vat_payer_no: "Nie, nie jestem płatnikiem VAT",
            vat_rate: "Stawka VAT (%)",
            vat_rate_tooltip: "Standardowa stawka VAT w Twoim kraju (automatycznie ustawiona na podstawie wyboru kraju)",
            investment_section: "Założenia inwestycyjne",
            holding_period: "Okres utrzymywania (lata)",
            holding_desc: "Jak długo planujesz utrzymywać nieruchomość",
            annual_appreciation: "Roczny wzrost wartości nieruchomości (%)",
            appreciation_desc: "Oczekiwany roczny wzrost wartości nieruchomości",
            rent_growth: "Roczny wzrost czynszu (%)",
            rent_growth_desc: "Oczekiwany roczny wzrost czynszu",
            exit_cap_rate: "Współczynnik kapitalizacji wyjścia (%)",
            exit_cap_desc: "Założenie Cap Rate przy sprzedaży nieruchomości",
            discount_rate: "Stopa dyskontowa dla NPV (%)",
            discount_desc: "Twoja wymagana stopa zwrotu",
        },
        hu: {
            tax_section: "Adóbeállítások",
            vat_payer: "ÁFA fizető",
            vat_payer_tooltip: "Jelölje be, ha regisztrált ÁFA fizető. Az ÁFA fizetők levonhatják a bemeneti ÁFÁ-t a költségekből, ami befolyásolja a nettó befektetési összegeket és a cash flow-t.",
            vat_payer_yes: "Igen, ÁFA fizető vagyok",
            vat_payer_no: "Nem, nem vagyok ÁFA fizető",
            vat_rate: "ÁFA kulcs (%)",
            vat_rate_tooltip: "Szabványos ÁFA kulcs az országban (automatikusan beállítva az ország kiválasztása alapján)",
            investment_section: "Befektetési feltételezések",
            holding_period: "Tartási időszak (év)",
            holding_desc: "Mennyi ideig tervezi tartani az ingatlant",
            annual_appreciation: "Éves ingatlanértékelés (%)",
            appreciation_desc: "Várható éves növekedés az ingatlan értékében",
            rent_growth: "Éves bérleti díj növekedés (%)",
            rent_growth_desc: "Várható éves bérleti díj növekedés",
            exit_cap_rate: "Kilépési Cap Rate (%)",
            exit_cap_desc: "Cap Rate feltételezés az ingatlan eladásánál",
            discount_rate: "Diszkontráta az NPV-hez (%)",
            discount_desc: "Az Ön által megkövetelt megtérülési ráta",
        },
        de: {
            tax_section: "Steuereinstellungen",
            vat_payer: "Umsatzsteuerpflichtig",
            vat_payer_tooltip: "Ankreuzen, wenn Sie als Umsatzsteuerpflichtiger registriert sind. Umsatzsteuerpflichtige können die Vorsteuer von den Kosten abziehen, was die Nettoinvestitionsbeträge und Cashflows beeinflusst.",
            vat_payer_yes: "Ja, ich bin umsatzsteuerpflichtig",
            vat_payer_no: "Nein, ich bin nicht umsatzsteuerpflichtig",
            vat_rate: "Umsatzsteuersatz (%)",
            vat_rate_tooltip: "Standard-Umsatzsteuersatz in Ihrem Land (automatisch auf Basis der Länderauswahl festgelegt)",
            investment_section: "Investitionsannahmen",
            holding_period: "Haltedauer (Jahre)",
            holding_desc: "Wie lange Sie die Immobilie halten möchten",
            annual_appreciation: "Jährliche Wertsteigerung (%)",
            appreciation_desc: "Erwartete jährliche Wertsteigerung der Immobilie",
            rent_growth: "Jährliches Mietwachstum (%)",
            rent_growth_desc: "Erwartete jährliche Mieterhöhung",
            exit_cap_rate: "Exit Cap Rate (%)",
            exit_cap_desc: "Cap Rate Annahme für Immobilienverkauf",
            discount_rate: "Diskontsatz für NPV (%)",
            discount_desc: "Ihre geforderte Rendite",
        }
    };

    const t = translations[language] || translations.en;

    // Get VAT rate from country preset
    const vatRate = countryPreset?.vat_rate || 20;

    return (
        <div className="space-y-6">
            {/* Tax Settings Section */}
            <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-base font-semibold text-foreground">{t.tax_section}</h4>
                
                {/* VAT Payer Checkbox */}
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

                {/* VAT Rate (readonly, from country preset) */}
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
                            value={localData.holding_period || 10}
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
                            value={localData.annual_appreciation || 2}
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
                            value={localData.rent_growth || 2}
                            onChange={(e) => handleNumberChange('rent_growth', e.target.value)}
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Label>{t.exit_cap_rate}</Label>
                            <InfoTooltip content={t.exit_cap_desc} />
                        </div>
                        <Input
                            type="number"
                            step="0.01"
                            value={localData.exit_cap_rate || 6}
                            onChange={(e) => handleNumberChange('exit_cap_rate', e.target.value)}
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Label>{t.discount_rate}</Label>
                            <InfoTooltip content={t.discount_desc} />
                        </div>
                        <Input
                            type="number"
                            step="0.1"
                            value={localData.discount_rate || 8}
                            onChange={(e) => handleNumberChange('discount_rate', e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}