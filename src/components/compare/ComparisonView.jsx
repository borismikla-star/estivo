import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Home, Package, Building, LineChart, X } from 'lucide-react';
import { currencyFormatter, percentFormatter } from '../lib/formatters';

const typeDetails = {
  long_term_lease: { icon: Home, color: "bg-blue-100 text-blue-800" },
  airbnb: { icon: Package, color: "bg-sky-100 text-sky-800" },
  commercial: { icon: Building, color: "bg-slate-200 text-slate-800" },
  development: { icon: LineChart, color: "bg-amber-100 text-amber-800" },
};

const MetricRow = ({ label, values, highlight = false }) => (
    <div className={`grid grid-cols-4 gap-4 py-3 border-b border-border ${highlight ? 'bg-accent/10' : ''}`}>
        <div className="font-medium text-foreground">{label}</div>
        {values.map((value, idx) => (
            <div key={idx} className="text-right text-foreground">{value}</div>
        ))}
    </div>
);

export default function ComparisonView({ projects, language = 'en', user, onRemove }) {
    const translations = {
        en: {
            comparison: "Project Comparison",
            project_info: "Project Information",
            name: "Name",
            type: "Type",
            country: "Country",
            entity: "Entity Type",
            metric: "Metric", // Kept for existing table structure
            key_metrics: "Key Financial Metrics",
            investment: "Total Investment",
            equity: "Equity Required",
            roi: "ROI",
            roi_label_rental: "ROI (10 yr.)",
            roi_label_dev: "Return on Cost",
            irr: "IRR",
            cashflow: "Annual Cashflow",
            cash_on_cash: "Cash-on-Cash Return",
            cap_rate: "Cap Rate",
            payback: "Payback Period",
            property_details: "Property Details",
            price: "Purchase Price",
            rent: "Annual Rent",
            noi: "Net Operating Income",
            profit: "Gross Profit",
            net_profit: "Net Profit",
            long_term_lease: "Long-Term Lease",
            commercial: "Commercial",
            airbnb: "Short-Term Rental",
            development: "Development",
        },
        sk: {
            comparison: "Porovnanie projektov",
            project_info: "Informácie o projekte",
            name: "Názov",
            type: "Typ",
            country: "Krajina",
            entity: "Typ entity",
            metric: "Metrika", // Kept for existing table structure
            key_metrics: "Kľúčové finančné ukazovatele",
            investment: "Celková investícia",
            equity: "Potrebný vlastný kapitál",
            roi: "ROI",
            roi_label_rental: "ROI (10 r.)",
            roi_label_dev: "Návratnosť na nákladoch",
            irr: "IRR",
            cashflow: "Ročný cashflow",
            cash_on_cash: "Cash-on-Cash Return",
            cap_rate: "Cap Rate",
            payback: "Doba návratnosti",
            property_details: "Detaily nehnuteľnosti",
            price: "Kúpna cena",
            rent: "Ročný nájom",
            noi: "Čistý prevádzkový príjem",
            profit: "Hrubý zisk",
            net_profit: "Čistý zisk",
            long_term_lease: "Dlhodobý prenájom",
            commercial: "Komerčný",
            airbnb: "Krátky prenájom",
            development: "Development",
        },
        pl: {
            comparison: "Porównanie projektów",
            project_info: "Informacje o projekcie",
            name: "Nazwa",
            type: "Typ",
            country: "Kraj",
            entity: "Typ podmiotu",
            metric: "Metryka", // Kept for existing table structure
            key_metrics: "Kluczowe wskaźniki finansowe",
            investment: "Całkowita inwestycja",
            equity: "Wymagany kapitał własny",
            roi: "ROI",
            irr: "IRR",
            cashflow: "Roczny przepływ gotówki",
            cash_on_cash: "Zwrot gotówki",
            cap_rate: "Cap Rate",
            payback: "Okres zwrotu",
            property_details: "Szczegóły nieruchomości",
            price: "Cena zakupu",
            rent: "Roczny czynsz",
            noi: "Dochód operacyjny netto",
            long_term_lease: "Najem długoterminowy",
            commercial: "Komercyjny",
            airbnb: "Najem krótkoterminowy",
            development: "Deweloperski",
        },
        hu: {
            comparison: "Projektek összehasonlítása",
            project_info: "Projekt információk",
            name: "Név",
            type: "Típus",
            country: "Ország",
            entity: "Entitás típusa",
            metric: "Metrika", // Kept for existing table structure
            key_metrics: "Kulcsfontosságú pénzügyi mutatók",
            investment: "Teljes befektetés",
            equity: "Szükséges saját tőke",
            roi: "ROI",
            irr: "IRR",
            cashflow: "Éves pénzforgalom",
            cash_on_cash: "Készpénz megtérülés",
            cap_rate: "Cap Rate",
            payback: "Megtérülési idő",
            property_details: "Ingatlan részletei",
            price: "Vételár",
            rent: "Éves bérleti díj",
            noi: "Nettó működési bevétel",
            long_term_lease: "Hosszú távú bérlés",
            commercial: "Kereskedelmi",
            airbnb: "Rövid távú bérlés",
            development: "Fejlesztés",
        },
        de: {
            comparison: "Projektvergleich",
            project_info: "Projektinformationen",
            name: "Name",
            type: "Typ",
            country: "Land",
            entity: "Entitätstyp",
            metric: "Metrik", // Kept for existing table structure
            key_metrics: "Wichtige Finanzkennzahlen",
            investment: "Gesamtinvestition",
            equity: "Erforderliches Eigenkapital",
            roi: "ROI",
            irr: "IRR",
            cashflow: "Jährlicher Cashflow",
            cash_on_cash: "Cash-on-Cash Rendite",
            cap_rate: "Cap Rate",
            payback: "Amortisationszeit",
            property_details: "Objektdetails",
            price: "Kaufpreis",
            rent: "Jährliche Miete",
            noi: "Nettobetriebseinkommen",
            long_term_lease: "Langzeitmiete",
            commercial: "Gewerblich",
            airbnb: "Kurzzeitvermietung",
            development: "Entwicklung",
        }
    };

    const t = translations[language] || translations.en;

    const currency = (val) => currencyFormatter(val, 'EUR', '€', 0);
    const isDev = (p) => p.type === 'development';

    const metrics = [
        {
            key: 'total_investment',
            label: t.investment,
            formatter: currency,
            accessor: (p) => isDev(p)
                ? (p.results?.kpis?.total_project_costs || 0)
                : (p.results?.kpis?.total_investment || 0),
        },
        {
            key: 'equity_required',
            label: t.equity,
            formatter: currency,
            accessor: (p) => isDev(p)
                ? (p.results?.kpis?.own_resources || 0)
                : (p.results?.kpis?.total_equity || 0),
        },
        {
            key: 'annual_cashflow',
            label: t.cashflow,
            formatter: currency,
            accessor: (p) => isDev(p)
                ? (p.results?.kpis?.gross_profit || 0)
                : (p.results?.kpis?.annual_cash_flow || 0),
            labelFn: (p) => isDev(p) ? t.profit : t.cashflow,
        },
        {
            key: 'roi',
            label: t.roi,
            formatter: percentFormatter,
            accessor: (p) => isDev(p)
                ? (p.results?.kpis?.return_on_cost ?? 0)
                : (p.results?.kpis?.roi_10_year ?? p.results?.kpis?.roi ?? 0),
            labelFn: (p) => isDev(p) ? t.roi_label_dev : t.roi_label_rental,
        },
        {
            key: 'irr',
            label: t.irr,
            formatter: (val) => val === null || val === undefined ? '—' : percentFormatter(val),
            accessor: (p) => p.results?.kpis?.irr ?? null,
        },
        {
            key: 'cash_on_cash',
            label: t.cash_on_cash,
            formatter: percentFormatter,
            accessor: (p) => isDev(p) ? null : (p.results?.kpis?.cash_on_cash_return ?? 0),
        },
        {
            key: 'cap_rate',
            label: t.cap_rate,
            formatter: percentFormatter,
            accessor: (p) => isDev(p) ? null : (p.results?.kpis?.cap_rate ?? 0),
        },
        {
            key: 'noi',
            label: t.noi,
            formatter: currency,
            accessor: (p) => isDev(p)
                ? (p.results?.kpis?.net_profit ?? 0)
                : (p.results?.kpis?.net_operating_income ?? 0),
            labelFn: (p) => isDev(p) ? t.net_profit : t.noi,
        },
        {
            key: 'payback',
            label: t.payback,
            formatter: (val) => val === null || val === undefined ? '—' : val === '>10' ? '>10 r.' : `${val} r.`,
            accessor: (p) => isDev(p) ? null : (p.results?.kpis?.payback_period ?? null),
        },
    ];

    return (
        <Card className="shadow-premium border-border">
            <CardHeader>
                <CardTitle>{t.comparison}</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px] font-semibold">{t.metric}</TableHead>
                            {projects.map(p => {
                                const TypeIcon = typeDetails[p.type]?.icon || Home;
                                return (
                                    <TableHead key={p.id} className="text-center">
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col items-start">
                                                <span className="font-semibold text-foreground">{p.name}</span>
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <TypeIcon className="h-3 w-3" />
                                                    {t[p.type]}
                                                </span>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onRemove(p.id)}>
                                                <X className="h-4 w-4 text-muted-foreground" />
                                            </Button>
                                        </div>
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {metrics.map(metric => (
                            <TableRow key={metric.key}>
                                <TableCell className="font-medium text-muted-foreground">
                                    {metric.label}
                                </TableCell>
                                {projects.map(p => {
                                    const val = metric.accessor(p);
                                    return (
                                        <TableCell key={p.id} className="text-center font-bold text-lg text-primary">
                                            {val === null || val === undefined ? '—' : metric.formatter(val)}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}