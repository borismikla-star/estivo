import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';
import InfoTooltip from '@/components/shared/InfoTooltip';

// Market benchmarks by project type and region
// Sources: European real estate market averages (2023-2025)
const BENCHMARKS = {
    long_term_lease: {
        SK: { cap_rate: [4.5, 6.5], gross_yield: [5.0, 7.5], cash_on_cash: [3.0, 6.0], dscr: [1.2, 1.8] },
        CZ: { cap_rate: [4.0, 6.0], gross_yield: [4.5, 7.0], cash_on_cash: [2.5, 5.5], dscr: [1.2, 1.8] },
        PL: { cap_rate: [5.0, 7.5], gross_yield: [5.5, 8.5], cash_on_cash: [3.5, 7.0], dscr: [1.2, 1.8] },
        HU: { cap_rate: [5.0, 7.5], gross_yield: [5.5, 8.0], cash_on_cash: [3.0, 6.5], dscr: [1.2, 1.8] },
        AT: { cap_rate: [3.0, 5.0], gross_yield: [3.5, 5.5], cash_on_cash: [1.5, 4.0], dscr: [1.2, 1.8] },
        DE: { cap_rate: [3.0, 5.0], gross_yield: [3.5, 5.5], cash_on_cash: [1.5, 4.0], dscr: [1.2, 1.8] },
        DEFAULT: { cap_rate: [4.5, 6.5], gross_yield: [5.0, 7.5], cash_on_cash: [3.0, 6.0], dscr: [1.2, 1.8] },
    },
    airbnb: {
        SK: { cap_rate: [5.5, 8.5], gross_yield: [8.0, 14.0], cash_on_cash: [5.0, 10.0], dscr: [1.2, 1.8] },
        CZ: { cap_rate: [5.0, 8.0], gross_yield: [7.5, 13.0], cash_on_cash: [4.5, 9.5], dscr: [1.2, 1.8] },
        PL: { cap_rate: [6.0, 9.5], gross_yield: [9.0, 15.0], cash_on_cash: [5.5, 11.0], dscr: [1.2, 1.8] },
        HU: { cap_rate: [6.0, 9.5], gross_yield: [8.5, 14.0], cash_on_cash: [5.0, 10.5], dscr: [1.2, 1.8] },
        DEFAULT: { cap_rate: [5.5, 8.5], gross_yield: [8.0, 14.0], cash_on_cash: [5.0, 10.0], dscr: [1.2, 1.8] },
    },
    commercial: {
        SK: { cap_rate: [5.5, 8.0], gross_yield: [6.0, 9.0], cash_on_cash: [4.0, 7.5], dscr: [1.25, 2.0] },
        CZ: { cap_rate: [5.0, 7.5], gross_yield: [5.5, 8.5], cash_on_cash: [3.5, 7.0], dscr: [1.25, 2.0] },
        PL: { cap_rate: [6.0, 9.0], gross_yield: [6.5, 10.0], cash_on_cash: [4.5, 8.5], dscr: [1.25, 2.0] },
        HU: { cap_rate: [6.0, 9.0], gross_yield: [6.5, 9.5], cash_on_cash: [4.5, 8.5], dscr: [1.25, 2.0] },
        DEFAULT: { cap_rate: [5.5, 8.0], gross_yield: [6.0, 9.0], cash_on_cash: [4.0, 7.5], dscr: [1.25, 2.0] },
    },
    development: {
        SK: { profit_margin: [15, 25], return_on_cost: [18, 30], developer_margin: [20, 35] },
        CZ: { profit_margin: [15, 25], return_on_cost: [18, 30], developer_margin: [20, 35] },
        PL: { profit_margin: [18, 28], return_on_cost: [20, 35], developer_margin: [22, 38] },
        HU: { profit_margin: [18, 28], return_on_cost: [20, 35], developer_margin: [22, 38] },
        DEFAULT: { profit_margin: [15, 25], return_on_cost: [18, 30], developer_margin: [20, 35] },
    },
};

const TRANSLATIONS = {
    en: {
        title: "Market Benchmarks",
        tooltip: "Compares your project's key metrics against typical market ranges for this asset type and region.",
        belowMarket: "Below market",
        inRange: "In range",
        aboveMarket: "Above market",
        cap_rate: "Cap Rate",
        gross_yield: "Gross Yield",
        cash_on_cash: "Cash-on-Cash",
        dscr: "DSCR",
        profit_margin: "Profit Margin",
        return_on_cost: "Return on Cost",
        developer_margin: "Developer Margin",
        marketRange: "Market range",
        yourValue: "Your project",
    },
    sk: {
        title: "Trhové benchmarky",
        tooltip: "Porovnáva kľúčové metriky vášho projektu s typickými trhovými hodnotami pre daný typ aktíva a región.",
        belowMarket: "Pod trhom",
        inRange: "V rozsahu",
        aboveMarket: "Nad trhom",
        cap_rate: "Cap Rate",
        gross_yield: "Hrubý výnos",
        cash_on_cash: "Cash-on-Cash",
        dscr: "DSCR",
        profit_margin: "Zisková marža",
        return_on_cost: "Návratnosť nákladov",
        developer_margin: "Marža developera",
        marketRange: "Trhový rozsah",
        yourValue: "Váš projekt",
    },
    pl: {
        title: "Benchmarki rynkowe",
        tooltip: "Porównuje kluczowe wskaźniki projektu z typowymi wartościami rynkowymi dla danego typu aktywów i regionu.",
        belowMarket: "Poniżej rynku",
        inRange: "W zakresie",
        aboveMarket: "Powyżej rynku",
        cap_rate: "Cap Rate",
        gross_yield: "Stopa brutto",
        cash_on_cash: "Cash-on-Cash",
        dscr: "DSCR",
        profit_margin: "Marża zysku",
        return_on_cost: "Zwrot z kosztów",
        developer_margin: "Marża dewelopera",
        marketRange: "Zakres rynkowy",
        yourValue: "Twój projekt",
    },
    hu: {
        title: "Piaci benchmarkok",
        tooltip: "Összehasonlítja a projekt kulcsmutatóit a tipikus piaci értéktartományokkal az adott eszköztípus és régió alapján.",
        belowMarket: "Piac alatt",
        inRange: "Tartományon belül",
        aboveMarket: "Piac felett",
        cap_rate: "Cap Rate",
        gross_yield: "Bruttó hozam",
        cash_on_cash: "Cash-on-Cash",
        dscr: "DSCR",
        profit_margin: "Profitmarzs",
        return_on_cost: "Költség megtérülés",
        developer_margin: "Fejlesztői marzs",
        marketRange: "Piaci tartomány",
        yourValue: "Az Ön projektje",
    },
    de: {
        title: "Markt-Benchmarks",
        tooltip: "Vergleicht die Schlüsselkennzahlen Ihres Projekts mit typischen Marktbereichen für diesen Anlagetyp und diese Region.",
        belowMarket: "Unter Markt",
        inRange: "Im Bereich",
        aboveMarket: "Über Markt",
        cap_rate: "Cap Rate",
        gross_yield: "Bruttorendite",
        cash_on_cash: "Cash-on-Cash",
        dscr: "DSCR",
        profit_margin: "Gewinnmarge",
        return_on_cost: "Kostenrendite",
        developer_margin: "Entwicklermarge",
        marketRange: "Marktbereich",
        yourValue: "Ihr Projekt",
    },
};

const BenchmarkBar = ({ label, value, min, max, unit = '%', t }) => {
    if (value == null) return null;

    const isBelow = value < min;
    const isAbove = value > max;
    const inRange = !isBelow && !isAbove;

    // Position of value within extended range (min*0.5 to max*1.5)
    const rangeStart = min * 0.5;
    const rangeEnd = max * 1.5;
    const totalSpan = rangeEnd - rangeStart;
    const valuePct = Math.min(100, Math.max(0, ((value - rangeStart) / totalSpan) * 100));
    const minPct = ((min - rangeStart) / totalSpan) * 100;
    const maxPct = ((max - rangeStart) / totalSpan) * 100;

    const statusColor = inRange ? 'text-emerald-600' : isAbove ? 'text-emerald-600' : 'text-amber-600';
    const statusBg = inRange ? 'bg-emerald-50 border-emerald-200' : isAbove ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200';
    const StatusIcon = inRange ? Minus : isAbove ? TrendingUp : TrendingDown;
    const statusLabel = inRange ? t.inRange : isAbove ? t.aboveMarket : t.belowMarket;

    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{label}</span>
                <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${statusBg} ${statusColor}`}>
                    <StatusIcon className="w-3 h-3" />
                    <span>{value.toFixed(unit === 'x' ? 2 : 1)}{unit}</span>
                </div>
            </div>
            <div className="relative h-4 bg-muted rounded-full overflow-hidden">
                {/* Market range highlight */}
                <div
                    className="absolute top-0 h-full bg-primary/15 rounded-full"
                    style={{ left: `${minPct}%`, width: `${maxPct - minPct}%` }}
                />
                {/* Value marker */}
                <div
                    className={`absolute top-0.5 w-3 h-3 rounded-full border-2 border-white shadow-sm transition-all ${inRange || isAbove ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    style={{ left: `calc(${valuePct}% - 6px)` }}
                />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
                <span>{t.marketRange}: {min.toFixed(1)}–{max.toFixed(1)}{unit}</span>
                <span className={`font-medium ${statusColor}`}>{statusLabel}</span>
            </div>
        </div>
    );
};

export default function BenchmarkContext({ results, projectType, country, language = 'en' }) {
    const t = TRANSLATIONS[language] || TRANSLATIONS.en;

    if (!results?.kpis) return null;

    const typeMap = BENCHMARKS[projectType];
    if (!typeMap) return null;

    const benchmarks = typeMap[country] || typeMap.DEFAULT;
    if (!benchmarks) return null;

    const kpis = results.kpis;

    // Build metrics list based on project type
    let metrics = [];

    if (projectType === 'development') {
        metrics = [
            benchmarks.profit_margin && { key: 'profit_margin', label: t.profit_margin, value: kpis.profit_margin, range: benchmarks.profit_margin, unit: '%' },
            benchmarks.return_on_cost && { key: 'return_on_cost', label: t.return_on_cost, value: kpis.return_on_cost, range: benchmarks.return_on_cost, unit: '%' },
            benchmarks.developer_margin && { key: 'developer_margin', label: t.developer_margin, value: kpis.developer_margin, range: benchmarks.developer_margin, unit: '%' },
        ].filter(Boolean);
    } else {
        metrics = [
            benchmarks.cap_rate && { key: 'cap_rate', label: t.cap_rate, value: kpis.cap_rate, range: benchmarks.cap_rate, unit: '%' },
            benchmarks.gross_yield && { key: 'gross_yield', label: t.gross_yield, value: kpis.gross_yield_before_tax ?? kpis.gross_yield, range: benchmarks.gross_yield, unit: '%' },
            benchmarks.cash_on_cash && { key: 'cash_on_cash', label: t.cash_on_cash, value: kpis.cash_on_cash_return, range: benchmarks.cash_on_cash, unit: '%' },
            benchmarks.dscr && kpis.dscr != null && { key: 'dscr', label: t.dscr, value: kpis.dscr, range: benchmarks.dscr, unit: 'x' },
        ].filter(Boolean);
    }

    // Filter out metrics where value is null/undefined
    metrics = metrics.filter(m => m.value != null);

    if (metrics.length === 0) return null;

    return (
        <Card className="border border-border shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    {t.title}
                    <InfoTooltip info={t.tooltip} />
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {metrics.map(m => (
                    <BenchmarkBar
                        key={m.key}
                        label={m.label}
                        value={m.value}
                        min={m.range[0]}
                        max={m.range[1]}
                        unit={m.unit}
                        t={t}
                    />
                ))}
            </CardContent>
        </Card>
    );
}