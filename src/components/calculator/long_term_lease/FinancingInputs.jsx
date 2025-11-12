import React, { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InfoTooltip from '../../shared/InfoTooltip';

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
            down_payment_tooltip: "Percentage of purchase price you'll pay upfront (typically 20-30%)",
            interest_rate: "Interest Rate (%)",
            interest_rate_tooltip: "Annual interest rate on your mortgage loan",
            loan_term: "Loan Term (years)",
            loan_term_tooltip: "Duration of the mortgage loan (typically 20-30 years)",
            monthly_payment: "Est. Monthly Payment",
            loan_amount: "Loan Amount",
        },
        sk: {
            down_payment: "Vlastné zdroje (%)",
            down_payment_tooltip: "Percento kúpnej ceny, ktoré zaplatíte vopred (typicky 20-30%)",
            interest_rate: "Úroková sadzba (%)",
            interest_rate_tooltip: "Ročná úroková sadzba vášho hypotekárneho úveru",
            loan_term: "Doba splácania (roky)",
            loan_term_tooltip: "Trvanie hypotekárneho úveru (typicky 20-30 rokov)",
            monthly_payment: "Odh. mesačná splátka",
            loan_amount: "Výška úveru",
        },
        pl: {
            down_payment: "Wkład własny (%)",
            down_payment_tooltip: "Procent ceny zakupu, który zapłacisz z góry (zazwyczaj 20-30%)",
            interest_rate: "Stopa procentowa (%)",
            interest_rate_tooltip: "Roczna stopa procentowa kredytu hipotecznego",
            loan_term: "Okres kredytu (lata)",
            loan_term_tooltip: "Czas trwania kredytu hipotecznego (zazwyczaj 20-30 lat)",
            monthly_payment: "Szac. miesięczna rata",
            loan_amount: "Kwota kredytu",
        },
        hu: {
            down_payment: "Önerő (%)",
            down_payment_tooltip: "A vételár százaléka, amelyet előre fizet (jellemzően 20-30%)",
            interest_rate: "Kamatláb (%)",
            interest_rate_tooltip: "Jelzáloghitel éves kamatlába",
            loan_term: "Hitel futamideje (év)",
            loan_term_tooltip: "A jelzáloghitel időtartama (jellemzően 20-30 év)",
            monthly_payment: "Becsült havi törlesztés",
            loan_amount: "Hitel összege",
        },
        de: {
            down_payment: "Eigenkapital (%)",
            down_payment_tooltip: "Prozentsatz des Kaufpreises, den Sie im Voraus zahlen (typischerweise 20-30%)",
            interest_rate: "Zinssatz (%)",
            interest_rate_tooltip: "Jährlicher Zinssatz Ihres Hypothekendarlehens",
            loan_term: "Kreditlaufzeit (Jahre)",
            loan_term_tooltip: "Laufzeit des Hypothekendarlehens (typischerweise 20-30 Jahre)",
            monthly_payment: "Gesch. monatliche Rate",
            loan_amount: "Darlehensbetrag",
        }
    };

    const t = translations[language] || translations.en;

    // Calculate derived values
    const downPaymentPct = Number(localData.down_payment_percent) || 20;
    const loanTerm = Number(localData.loan_term) || 30;
    const interestRate = Number(localData.interest_rate) || 0;

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
            monthlyPayment = loanAmount / numberOfPayments;
        }
    }

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
                </div>
            </div>
        </div>
    );
}