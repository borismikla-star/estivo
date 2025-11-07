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
            gross_income: "Gross Income",
            operating_expenses: "Operating Expenses",
            debt_service: "Debt Service",
            net_cash_flow: "Net Cash Flow",
            cumulative_cash_flow: "Cumulative Cash Flow",
        },
        sk: {
            title: "Detailný Cash Flow (10 rokov)",
            year: "Rok",
            gross_income: "Hrubý príjem",
            operating_expenses: "Prevádzkové náklady",
            debt_service: "Splátky úveru",
            net_cash_flow: "Čistý Cash Flow",
            cumulative_cash_flow: "Kumulatívny Cash Flow",
        },
        pl: {
            title: "Szczegółowy Cash Flow (10 lat)",
            year: "Rok",
            gross_income: "Dochód brutto",
            operating_expenses: "Koszty operacyjne",
            debt_service: "Obsługa długu",
            net_cash_flow: "Netto Cash Flow",
            cumulative_cash_flow: "Skumulowany Cash Flow",
        },
        hu: {
            title: "Részletes Cash Flow (10 év)",
            year: "Év",
            gross_income: "Bruttó bevétel",
            operating_expenses: "Működési költségek",
            debt_service: "Hitel törlesztés",
            net_cash_flow: "Nettó Cash Flow",
            cumulative_cash_flow: "Kumulatív Cash Flow",
        },
        de: {
            title: "Detaillierter Cash Flow (10 Jahre)",
            year: "Jahr",
            gross_income: "Bruttoeinnahmen",
            operating_expenses: "Betriebskosten",
            debt_service: "Schuldendienst",
            net_cash_flow: "Netto Cash Flow",
            cumulative_cash_flow: "Kumulativer Cash Flow",
        }
    };

    const t = translations[language] || translations.en;

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t.year}</TableHead>
                                <TableHead className="text-right">{t.gross_income}</TableHead>
                                <TableHead className="text-right">{t.operating_expenses}</TableHead>
                                <TableHead className="text-right">{t.debt_service}</TableHead>
                                <TableHead className="text-right font-bold">{t.net_cash_flow}</TableHead>
                                <TableHead className="text-right font-bold text-primary">{t.cumulative_cash_flow}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((row) => (
                                <TableRow key={row.year}>
                                    <TableCell className="font-medium">{row.year}</TableCell>
                                    <TableCell className="text-right">{currencyFormatter(row.gross_income || row.gross_revenue || 0, currency, currencySymbol, 0)}</TableCell>
                                    <TableCell className="text-right text-destructive">-{currencyFormatter(row.operating_expenses || 0, currency, currencySymbol, 0)}</TableCell>
                                    <TableCell className="text-right text-destructive">-{currencyFormatter(row.debt_service || 0, currency, currencySymbol, 0)}</TableCell>
                                    <TableCell className="text-right font-bold">
                                        <span className={row.net_cash_flow >= 0 ? 'text-green-600' : 'text-red-600'}>
                                            {currencyFormatter(row.net_cash_flow || 0, currency, currencySymbol, 0)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-primary">
                                        {currencyFormatter(row.cumulative_cash_flow || 0, currency, currencySymbol, 0)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}