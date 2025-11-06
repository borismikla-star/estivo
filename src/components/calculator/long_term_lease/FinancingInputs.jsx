
import React, { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function FinancingInputs({ data, purchasePrice, onChange, language = 'en' }) {
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
            down_payment: "Down Payment (%)",
            interest_rate: "Interest Rate (%)",
            loan_term: "Loan Term (years)",
            monthly_payment: "Est. Monthly Payment",
        },
        sk: {
            down_payment: "Vlastné zdroje (%)",
            interest_rate: "Úroková sadzba (%)",
            loan_term: "Doba splácania (roky)",
            monthly_payment: "Odh. mesačná splátka",
        },
        pl: {
            down_payment: "Wkład własny (%)",
            interest_rate: "Stopa procentowa (%)",
            loan_term: "Okres kredytu (lata)",
            monthly_payment: "Szac. miesięczna rata",
        },
        hu: {
            down_payment: "Önerő (%)",
            interest_rate: "Kamatláb (%)",
            loan_term: "Hitel futamideje (év)",
            monthly_payment: "Becsült havi törlesztés",
        },
        de: {
            down_payment: "Eigenkapital (%)",
            interest_rate: "Zinssatz (%)",
            loan_term: "Kreditlaufzeit (Jahre)",
            monthly_payment: "Gesch. monatliche Rate",
        }
    };

    const t = translations[language] || translations.en;

    // Calculate derived values
    // Note: The input field for down payment percentage still uses 'down_payment_pct' in localData,
    // so we derive from that. The label for it uses 'down_payment' from translations.
    const downPaymentPct = Number(localData.down_payment_pct) || 20;
    const loanTerm = Number(localData.loan_term) || 30;
    const interestRate = Number(localData.interest_rate) || 0; // Default to 0 interest rate

    const loanAmount = purchasePrice * (1 - downPaymentPct / 100);

    // Calculate monthly payment
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    let monthlyPayment = 0;

    if (loanAmount > 0 && numberOfPayments > 0) {
        if (monthlyInterestRate > 0) {
            monthlyPayment = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
                            (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
        } else {
            // If interest rate is 0, monthly payment is simply loan amount divided by number of payments
            monthlyPayment = loanAmount / numberOfPayments;
        }
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    {/* Updated label key from t.down_payment_pct to t.down_payment */}
                    <Label>{t.down_payment}</Label>
                    <Input
                        type="number"
                        value={localData.down_payment_pct || 20}
                        onChange={(e) => handleChange('down_payment_pct', parseFloat(e.target.value) || 0)}
                    />
                </div>
                <div className="space-y-2">
                    <Label>{t.loan_term}</Label>
                    <Input
                        type="number"
                        value={localData.loan_term || 30}
                        onChange={(e) => handleChange('loan_term', parseInt(e.target.value) || 0)}
                    />
                </div>
                <div className="space-y-2">
                    <Label>{t.interest_rate}</Label>
                    <Input
                        type="number"
                        step="0.1"
                        value={localData.interest_rate || 0}
                        onChange={(e) => handleChange('interest_rate', parseFloat(e.target.value) || 0)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                    {/* Note: 'loan_amount' key is no longer in translations object as per outline. 
                        This label will now render an empty string. */}
                    <Label className="text-muted-foreground">{t.loan_amount}</Label>
                    <div className="text-2xl font-bold">€{Math.round(loanAmount).toLocaleString()}</div>
                </div>
                <div>
                    <Label className="text-muted-foreground">{t.monthly_payment}</Label>
                    <div className="text-2xl font-bold">€{Math.round(monthlyPayment).toLocaleString()}</div>
                </div>
            </div>
        </div>
    );
}
