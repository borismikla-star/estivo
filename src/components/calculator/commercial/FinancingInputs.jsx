import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import InfoTooltip from "../../shared/InfoTooltip";

export default function FinancingInputs({ data, onChange, totalInvestment, language = 'en' }) {
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
            down_payment: "Down Payment (%)",
            down_payment_desc: "Percentage of total investment paid upfront (typical: 30-40%)",
            interest_rate: "Interest Rate (%)",
            interest_rate_desc: "Annual interest rate on the loan (typical: 4-6%)",
            loan_term: "Loan Term (years)",
            loan_term_desc: "Number of years to repay the loan (typical: 15-30 years)",
            total_investment: "Total Investment",
        },
        sk: {
            down_payment: "Vlastné zdroje (%)",
            down_payment_desc: "Percento celkovej investície zaplatené vopred (typicky: 30-40%)",
            interest_rate: "Úroková sadzba (%)",
            interest_rate_desc: "Ročná úroková sadzba úveru (typicky: 4-6%)",
            loan_term: "Doba splácania (roky)",
            loan_term_desc: "Počet rokov na splatenie úveru (typicky: 15-30 rokov)",
            total_investment: "Celková investícia",
        },
        pl: {
            down_payment: "Wkład własny (%)",
            down_payment_desc: "Procent całkowitej inwestycji wpłacony z góry (zazwyczaj: 30-40%)",
            interest_rate: "Stopa procentowa (%)",
            interest_rate_desc: "Roczna stopa procentowa kredytu (zazwyczaj: 4-6%)",
            loan_term: "Okres kredytu (lata)",
            loan_term_desc: "Liczba lat na spłatę kredytu (zazwyczaj: 15-30 lat)",
            total_investment: "Całkowita inwestycja",
        },
        hu: {
            down_payment: "Önerő (%)",
            down_payment_desc: "A teljes befektetés előre fizetett százaléka (tipikusan: 30-40%)",
            interest_rate: "Kamatláb (%)",
            interest_rate_desc: "Éves kamatláb a hitelen (tipikusan: 4-6%)",
            loan_term: "Hitel futamideje (év)",
            loan_term_desc: "Évek száma a hitel visszafizetéséhez (tipikusan: 15-30 év)",
            total_investment: "Összes befektetés",
        },
        de: {
            down_payment: "Eigenkapital (%)",
            down_payment_desc: "Prozentsatz der Gesamtinvestition, der im Voraus gezahlt wird (typisch: 30-40%)",
            interest_rate: "Zinssatz (%)",
            interest_rate_desc: "Jährlicher Zinssatz für das Darlehen (typisch: 4-6%)",
            loan_term: "Kreditlaufzeit (Jahre)",
            loan_term_desc: "Anzahl der Jahre zur Rückzahlung des Kredits (typisch: 15-30 Jahre)",
            total_investment: "Gesamtinvestition",
        }
    };

    const t = translations[language] || translations.en;

    return (
        <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">{t.total_investment}</p>
                <p className="text-2xl font-bold">€{totalInvestment.toLocaleString()}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Label>{t.down_payment}</Label>
                        <InfoTooltip content={t.down_payment_desc} />
                    </div>
                    <Input
                        type="number"
                        step="0.1"
                        value={localData.down_payment_pct || 30}
                        onChange={(e) => handleChange('down_payment_pct', e.target.value)}
                    />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Label>{t.interest_rate}</Label>
                        <InfoTooltip content={t.interest_rate_desc} />
                    </div>
                    <Input
                        type="number"
                        step="0.01"
                        value={localData.interest_rate || 4.5}
                        onChange={(e) => handleChange('interest_rate', e.target.value)}
                    />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Label>{t.loan_term}</Label>
                        <InfoTooltip content={t.loan_term_desc} />
                    </div>
                    <Input
                        type="number"
                        value={localData.loan_term || 20}
                        onChange={(e) => handleChange('loan_term', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}