import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
            interest_rate: "Interest Rate (%)",
            loan_term: "Loan Term (years)",
            total_investment: "Total Investment",
        },
        sk: {
            down_payment: "Vlastné zdroje (%)",
            interest_rate: "Úroková sadzba (%)",
            loan_term: "Doba splácania (roky)",
            total_investment: "Celková investícia",
        },
        pl: {
            down_payment: "Wkład własny (%)",
            interest_rate: "Stopa procentowa (%)",
            loan_term: "Okres kredytu (lata)",
            total_investment: "Całkowita inwestycja",
        },
        hu: {
            down_payment: "Önerő (%)",
            interest_rate: "Kamatláb (%)",
            loan_term: "Hitel futamideje (év)",
            total_investment: "Összes befektetés",
        },
        de: {
            down_payment: "Eigenkapital (%)",
            interest_rate: "Zinssatz (%)",
            loan_term: "Kreditlaufzeit (Jahre)",
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
                    <Label>{t.down_payment}</Label>
                    <Input
                        type="number"
                        step="0.1"
                        value={localData.down_payment_pct || 30}
                        onChange={(e) => handleChange('down_payment_pct', e.target.value)}
                    />
                </div>
                <div>
                    <Label>{t.interest_rate}</Label>
                    <Input
                        type="number"
                        step="0.01"
                        value={localData.interest_rate || 4.5}
                        onChange={(e) => handleChange('interest_rate', e.target.value)}
                    />
                </div>
                <div>
                    <Label>{t.loan_term}</Label>
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