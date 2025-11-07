import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { currencyFormatter } from '@/components/lib/formatters';

export default function CashFlowTable({ data, currency = 'EUR', currencySymbol = '€', language = 'en' }) {
    if (!data || data.length === 0) return null;

    const translations = {
        en: {
            title: "Detailed Cash Flow (10 Years)",
            year: "Year",
            gross_income: "Income",
            operating_expenses: "OpEx",
            debt_service: "Debt",
            net_cash_flow: "Net CF",
            cumulative_cash_flow: "Cumulative",
        },
        sk: {
            title: "Detailný Cash Flow (10 rokov)",
            year: "Rok",
            gross_income: "Príjem",
            operating_expenses: "Náklady",
            debt_service: "Úver",
            net_cash_flow: "Čistý CF",
            cumulative_cash_flow: "Kumulatívny",
        },
        pl: {
            title: "Szczegółowy Cash Flow (10 lat)",
            year: "Rok",
            gross_income: "Przychód",
            operating_expenses: "Koszty",
            debt_service: "Dług",
            net_cash_flow: "Netto CF",
            cumulative_cash_flow: "Skumulowany",
        },
        hu: {
            title: "Részletes Cash Flow (10 év)",
            year: "Év",
            gross_income: "Bevétel",
            operating_expenses: "Költség",
            debt_service: "Hitel",
            net_cash_flow: "Nettó CF",
            cumulative_cash_flow: "Kumulatív",
        },
        de: {
            title: "Detaillierter Cash Flow (10 Jahre)",
            year: "Jahr",
            gross_income: "Einnahmen",
            operating_expenses: "Kosten",
            debt_service: "Schuld",
            net_cash_flow: "Netto CF",
            cumulative_cash_flow: "Kumulativ",
        }
    };

    const t = translations[language] || translations.en;

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto -mx-6 px-6">
                    <Table className="min-w-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-16">{t.year}</TableHead>
                                <TableHead className="text-right whitespace-nowrap">{t.gross_income}</TableHead>
                                <TableHead className="text-right whitespace-nowrap">{t.operating_expenses}</TableHead>
                                <TableHead className="text-right whitespace-nowrap">{t.debt_service}</TableHead>
                                <TableHead className="text-right font-bold whitespace-nowrap">{t.net_cash_flow}</TableHead>
                                <TableHead className="text-right font-bold text-primary whitespace-nowrap">{t.cumulative_cash_flow}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((row) => (
                                <TableRow key={row.year}>
                                    <TableCell className="font-medium">{row.year}</TableCell>
                                    <TableCell className="text-right whitespace-nowrap text-sm">{currencyFormatter(row.gross_income || row.gross_revenue || 0, currency, currencySymbol, 0)}</TableCell>
                                    <TableCell className="text-right text-destructive whitespace-nowrap text-sm">-{currencyFormatter(row.operating_expenses || 0, currency, currencySymbol, 0)}</TableCell>
                                    <TableCell className="text-right text-destructive whitespace-nowrap text-sm">-{currencyFormatter(row.debt_service || 0, currency, currencySymbol, 0)}</TableCell>
                                    <TableCell className="text-right font-bold whitespace-nowrap text-sm">
                                        <span className={row.net_cash_flow >= 0 ? 'text-green-600' : 'text-red-600'}>
                                            {currencyFormatter(row.net_cash_flow || 0, currency, currencySymbol, 0)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-primary whitespace-nowrap text-sm">
                                        {currencyFormatter(row.cumulative_cash_flow || 0, currency, currencySymbol, 0)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                
                {/* Mobile-friendly info */}
                <div className="mt-4 text-xs text-muted-foreground text-center md:hidden">
                    💡 Swipe left/right to see all columns
                </div>
            </CardContent>
        </Card>
    );
}