import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InfoTooltip from '@/components/shared/InfoTooltip';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const TRANSLATIONS = {
    en: {
        title: "Sensitivity Analysis",
        description: "Shows how a ±10% change in key variables impacts IRR (Internal Rate of Return). Base IRR is the value from your current calculation.",
        tooltip: "Each row shows the IRR when a variable changes by ±10%. Green indicates improvement, red indicates decline.",
        variable: "Variable",
        minus10: "−10%",
        plus10: "+10%",
        baseIrr: "Base IRR",
        irrChange: "IRR Change",
        rent: "Rent / Nightly Rate",
        occupancy: "Occupancy",
        purchasePrice: "Purchase Price",
        exitCapRate: "Exit Cap Rate (+0.5%)",
        interestRate: "Interest Rate (+1%)",
        salePrice: "Sale Price",
        constructionCost: "Construction Cost",
        noLoan: "N/A (no loan)",
        noExit: "N/A",
    },
    sk: {
        title: "Analýza citlivosti",
        description: "Zobrazuje, ako zmena kľúčových premenných o ±10 % ovplyvní IRR (vnútornú mieru návratnosti). Základné IRR zodpovedá aktuálnemu výpočtu.",
        tooltip: "Každý riadok ukazuje IRR, keď sa premenná zmení o ±10%. Zelená znamená zlepšenie, červená znamená pokles.",
        variable: "Premenná",
        minus10: "−10%",
        plus10: "+10%",
        baseIrr: "Základné IRR",
        irrChange: "Zmena IRR",
        rent: "Nájom / Cena za noc",
        occupancy: "Obsadenosť",
        purchasePrice: "Kúpna cena",
        exitCapRate: "Exit Cap Rate (+0,5 %)",
        interestRate: "Úroková sadzba (+1 %)",
        salePrice: "Predajná cena",
        constructionCost: "Náklady výstavby",
        noLoan: "N/A (bez úveru)",
        noExit: "N/A",
    },
    pl: {
        title: "Analiza wrażliwości",
        description: "Pokazuje, jak zmiana kluczowych zmiennych o ±10% wpływa na IRR. Bazowe IRR odpowiada bieżącemu obliczeniu.",
        tooltip: "Każdy wiersz pokazuje IRR, gdy zmienna zmienia się o ±10%. Zielony oznacza poprawę, czerwony oznacza spadek.",
        variable: "Zmienna",
        minus10: "−10%",
        plus10: "+10%",
        baseIrr: "Bazowe IRR",
        irrChange: "Zmiana IRR",
        rent: "Czynsz / Stawka nocna",
        occupancy: "Obłożenie",
        purchasePrice: "Cena zakupu",
        exitCapRate: "Exit Cap Rate (+0,5%)",
        interestRate: "Stopa procentowa (+1%)",
        salePrice: "Cena sprzedaży",
        constructionCost: "Koszty budowy",
        noLoan: "N/A (bez kredytu)",
        noExit: "N/A",
    },
    hu: {
        title: "Érzékenységi elemzés",
        description: "Megmutatja, hogyan befolyásolja a kulcsváltozók ±10%-os változása az IRR-t. Az alap IRR a jelenlegi számításból származik.",
        tooltip: "Minden sor az IRR-t mutatja, amikor egy változó ±10%-kal változik. Zöld javulást jelent, piros visszaesést.",
        variable: "Változó",
        minus10: "−10%",
        plus10: "+10%",
        baseIrr: "Alap IRR",
        irrChange: "IRR változás",
        rent: "Bérleti díj / Éjszakai díj",
        occupancy: "Foglaltság",
        purchasePrice: "Vételár",
        exitCapRate: "Exit Cap Rate (+0,5%)",
        interestRate: "Kamatláb (+1%)",
        salePrice: "Eladási ár",
        constructionCost: "Építési költségek",
        noLoan: "N/A (nincs hitel)",
        noExit: "N/A",
    },
    de: {
        title: "Sensitivitätsanalyse",
        description: "Zeigt, wie eine ±10%-Änderung der Schlüsselvariablen den IRR beeinflusst. Basis-IRR entspricht der aktuellen Berechnung.",
        tooltip: "Jede Zeile zeigt den IRR, wenn sich eine Variable um ±10% ändert. Grün deutet auf Verbesserung hin, rot auf Rückgang.",
        variable: "Variable",
        minus10: "−10%",
        plus10: "+10%",
        baseIrr: "Basis-IRR",
        irrChange: "IRR-Änderung",
        rent: "Miete / Nachtpreis",
        occupancy: "Belegung",
        purchasePrice: "Kaufpreis",
        exitCapRate: "Exit Cap Rate (+0,5%)",
        interestRate: "Zinssatz (+1%)",
        salePrice: "Verkaufspreis",
        constructionCost: "Baukosten",
        noLoan: "N/A (kein Darlehen)",
        noExit: "N/A",
    },
};

const DeltaCell = ({ base, value }) => {
    if (value === null || value === undefined || base === null || base === undefined) {
        return <span className="text-muted-foreground text-xs">N/A</span>;
    }
    const delta = value - base;
    const absVal = Math.abs(delta).toFixed(1);

    if (Math.abs(delta) < 0.05) {
        return (
            <span className="flex items-center gap-1 text-muted-foreground text-xs font-medium justify-end">
                <Minus className="w-3 h-3" />
                {value.toFixed(1)}%
            </span>
        );
    }
    if (delta > 0) {
        return (
            <span className="flex items-center gap-1 text-emerald-600 text-xs font-semibold justify-end">
                <TrendingUp className="w-3 h-3" />
                {value.toFixed(1)}% <span className="text-emerald-500 font-normal">(+{absVal}pp)</span>
            </span>
        );
    }
    return (
        <span className="flex items-center gap-1 text-red-500 text-xs font-semibold justify-end">
            <TrendingDown className="w-3 h-3" />
            {value.toFixed(1)}% <span className="text-red-400 font-normal">(−{absVal}pp)</span>
        </span>
    );
};

export default function SensitivityAnalysis({ sensitivityData, language = 'en' }) {
    const t = TRANSLATIONS[language] || TRANSLATIONS.en;

    if (!sensitivityData || sensitivityData.length === 0) return null;

    // Detect if new format (with irr values) or legacy format (with change numbers)
    const isNewFormat = sensitivityData[0] && 'irr_minus10' in sensitivityData[0];

    if (!isNewFormat) {
        // Legacy bar-chart format — render compact list (kept for backwards compat)
        return null;
    }

    const baseIrr = sensitivityData[0]?.base_irr ?? null;

    return (
        <Card className="border border-border shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                    {t.title}
                    <InfoTooltip info={t.description} />
                </CardTitle>
                {baseIrr !== null && (
                    <p className="text-sm text-muted-foreground">
                        {t.baseIrr}: <span className="font-semibold text-foreground">{baseIrr.toFixed(1)}%</span>
                    </p>
                )}
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-muted/40">
                                <th className="text-left px-4 py-2 font-medium text-muted-foreground">{t.variable}</th>
                                <th className="text-right px-4 py-2 font-medium text-muted-foreground">{t.minus10}</th>
                                <th className="text-right px-4 py-2 font-medium text-muted-foreground">{t.plus10}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sensitivityData.map((row, i) => (
                                <tr key={i} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                                    <td className="px-4 py-2.5 font-medium text-foreground">{row.label}</td>
                                    <td className="px-4 py-2.5 text-right">
                                        <DeltaCell base={baseIrr} value={row.irr_minus10} />
                                    </td>
                                    <td className="px-4 py-2.5 text-right">
                                        <DeltaCell base={baseIrr} value={row.irr_plus10} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}