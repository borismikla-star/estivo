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
            rental_income: "Rental Income",
            operating_expenses: "Operating Expenses",
            debt_service: "Debt Service",
            net_cash_flow: "Net Cash Flow",
        },
        sk: {
            title: "Detailný Cash Flow (10 rokov)",
            year: "Rok",
            rental_income: "Príjmy z nájmu",
            operating_expenses: "Prevádzkové náklady",
            debt_service: "Splátky úveru",
            net_cash_flow: "Čistý Cash Flow",
        },
        pl: {
            title: "Szczegółowy Cash Flow (10 lat)",
            year: "Rok",
            rental_income: "Dochody z najmu",
            operating_expenses: "Koszty operacyjne",
            debt_service: "Obsługa długu",
            net_cash_flow: "Netto Cash Flow",
        },
        hu: {
            title: "Részletes Cash Flow (10 év)",
            year: "Év",
            rental_income: "Bérleti bevételek",
            operating_expenses: "Működési költségek",
            debt_service: "Hitel törlesztés",
            net_cash_flow: "Nettó Cash Flow",
        },
        de: {
            title: "Detaillierter Cash Flow (10 Jahre)",
            year: "Jahr",
            rental_income: "Mieteinnahmen",
            operating_expenses: "Betriebskosten",
            debt_service: "Schuldendienst",
            net_cash_flow: "Netto Cash Flow",
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
                                <TableHead className="text-right">{t.rental_income}</TableHead>
                                <TableHead className="text-right">{t.operating_expenses}</TableHead>
                                <TableHead className="text-right">{t.debt_service}</TableHead>
                                <TableHead className="text-right font-bold">{t.net_cash_flow}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className="text-right">{currencyFormatter(row.rentalIncome || 0, currency, currencySymbol)}</TableCell>
                                    <TableCell className="text-right text-destructive">{currencyFormatter(row.operatingExpenses || 0, currency, currencySymbol)}</TableCell>
                                    <TableCell className="text-right text-destructive">{currencyFormatter(row.debtService || 0, currency, currencySymbol)}</TableCell>
                                    <TableCell className="text-right font-bold">{currencyFormatter(row.cashFlow || 0, currency, currencySymbol)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}