
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import KPICard from '../shared/KPICard';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import { currencyFormatter, percentFormatter } from '@/components/lib/formatters';
import { TrendingUp, TrendingDown, DollarSign, Target, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';

const COLORS = ['#003E7E', '#004C97', '#0066CC', '#0080FF', '#33A3FF', '#66BBFF', '#99D6FF'];

export default function ResultsDisplay({ results, currency = '€', language = 'en' }) {
    if (!results || !results.kpis) return null;

    const { kpis, cost_breakdown, revenue_breakdown } = results;

    const translations = {
        sk: {
            title: "Výsledky developmentu",
            overview: "Prehľad",
            charts: "Grafy",
            cashflow: "Cash Flow",
            kpis_title: "Kľúčové ukazovatele",
            total_project_costs: "Celkové náklady",
            total_project_costs_desc: "Všetky náklady vrátane financovania",
            gross_revenue: "Hrubé tržby",
            gross_revenue_desc: "Celkové príjmy z predaja",
            gross_profit: "Hrubý zisk",
            gross_profit_desc: "Tržby mínus náklady",
            profit_margin: "Zisková marža",
            profit_margin_desc: "Percento zisku z tržieb",
            developer_margin: "Marža developera",
            developer_margin_desc: "Čistý zisk ako % nákladov",
            return_on_cost: "Návratnosť nákladov",
            return_on_cost_desc: "ROC - zisk/náklady",
            equity_multiple: "Násobok kapitálu",
            equity_multiple_desc: "Koľkokrát sa vráti vlastný kapitál",
            irr: "IRR",
            irr_desc: "Vnútorná miera návratnosti",
            annualized_return: "Ročná návratnosť",
            annualized_return_desc: "Ročný výnos vlastného kapitálu",
            cost_breakdown: "Rozloženie nákladov",
            revenue_breakdown: "Rozloženie príjmov",
            key_metrics: "Kľúčové metriky",
            cost_per_m2: "Náklady/m²",
            revenue_per_m2: "Príjem/m²",
            profit_per_m2: "Zisk/m²",
            break_even_revenue: "Bod zvratu",
            break_even_percentage: "Bod zvratu %",
            project_duration: "Trvanie projektu",
            months: "mesiacov",
            cashflow_timeline: "Časová os Cash Flow",
            period: "Obdobie",
            costs: "Náklady",
            revenue: "Príjmy",
            cumulative_cashflow: "Kumulatívny Cash Flow",
        },
        en: {
            title: "Development Results",
            overview: "Overview",
            charts: "Charts",
            cashflow: "Cash Flow",
            kpis_title: "Key Performance Indicators",
            total_project_costs: "Total Costs",
            total_project_costs_desc: "All costs including financing",
            gross_revenue: "Gross Revenue",
            gross_revenue_desc: "Total sales revenue",
            gross_profit: "Gross Profit",
            gross_profit_desc: "Revenue minus costs",
            profit_margin: "Profit Margin",
            profit_margin_desc: "Profit as % of revenue",
            developer_margin: "Developer Margin",
            developer_margin_desc: "Net profit as % of cost",
            return_on_cost: "Return on Cost",
            return_on_cost_desc: "ROC - profit/cost",
            equity_multiple: "Equity Multiple",
            equity_multiple_desc: "How many times equity is returned",
            irr: "IRR",
            irr_desc: "Internal Rate of Return",
            annualized_return: "Annualized Return",
            annualized_return_desc: "Annual return on equity",
            cost_breakdown: "Cost Breakdown",
            revenue_breakdown: "Revenue Breakdown",
            key_metrics: "Key Metrics",
            cost_per_m2: "Cost/m²",
            revenue_per_m2: "Revenue/m²",
            profit_per_m2: "Profit/m²",
            break_even_revenue: "Break-Even",
            break_even_percentage: "Break-Even %",
            project_duration: "Project Duration",
            months: "months",
            cashflow_timeline: "Cash Flow Timeline",
            period: "Period",
            costs: "Costs",
            revenue: "Revenue",
            cumulative_cashflow: "Cumulative Cash Flow",
        },
        pl: {
            title: "Wyniki deweloperskie",
            overview: "Przegląd",
            charts: "Wykresy",
            cashflow: "Przepływ gotówki",
            kpis_title: "Kluczowe wskaźniki",
            total_project_costs: "Całkowite koszty",
            total_project_costs_desc: "Wszystkie koszty wraz z finansowaniem",
            gross_revenue: "Przychody brutto",
            gross_revenue_desc: "Całkowite przychody ze sprzedaży",
            gross_profit: "Zysk brutto",
            gross_profit_desc: "Przychody minus koszty",
            profit_margin: "Marża zysku",
            profit_margin_desc: "Zysk jako % przychodów",
            developer_margin: "Marża dewelopera",
            developer_margin_desc: "Zysk netto jako % kosztów",
            return_on_cost: "Zwrot z kosztów",
            return_on_cost_desc: "ROC - zysk/koszty",
            equity_multiple: "Mnożnik kapitału",
            equity_multiple_desc: "Ile razy zwraca się kapitał",
            irr: "IRR",
            irr_desc: "Wewnętrzna stopa zwrotu",
            annualized_return: "Roczny zwrot",
            annualized_return_desc: "Roczny zwrot z kapitału",
            cost_breakdown: "Podział kosztów",
            revenue_breakdown: "Podział przychodów",
            key_metrics: "Kluczowe metryki",
            cost_per_m2: "Koszt/m²",
            revenue_per_m2: "Przychód/m²",
            profit_per_m2: "Zysk/m²",
            break_even_revenue: "Próg rentowności",
            break_even_percentage: "Próg rentowności %",
            project_duration: "Czas trwania projektu",
            months: "miesiące",
            cashflow_timeline: "Oś czasu przepływu gotówki",
            period: "Okres",
            costs: "Koszty",
            revenue: "Przychody",
            cumulative_cashflow: "Skumulowany przepływ gotówki",
        },
        hu: {
            title: "Fejlesztési eredmények",
            overview: "Áttekintés",
            charts: "Grafikonok",
            cashflow: "Pénzáramlás",
            kpis_title: "Kulcs teljesítménymutatók",
            total_project_costs: "Összes költség",
            total_project_costs_desc: "Összes költség a finanszírozással együtt",
            gross_revenue: "Bruttó bevétel",
            gross_revenue_desc: "Összes értékesítési bevétel",
            gross_profit: "Bruttó nyereség",
            gross_profit_desc: "Bevétel mínusz költségek",
            profit_margin: "Profitmarzs",
            profit_margin_desc: "Nyereség mint a bevétel %-a",
            developer_margin: "Fejlesztői marzs",
            developer_margin_desc: "Nettó nyereség mint a költség %-a",
            return_on_cost: "Költség megtérülés",
            return_on_cost_desc: "ROC - nyereség/költség",
            equity_multiple: "Tőke szorzó",
            equity_multiple_desc: "Hányszor térül meg a tőke",
            irr: "IRR",
            irr_desc: "Belső megtérülési ráta",
            annualized_return: "Éves hozam",
            annualized_return_desc: "Éves tőkehozam",
            cost_breakdown: "Költségek részletezése",
            revenue_breakdown: "Bevételek részletezése",
            key_metrics: "Kulcs metrikák",
            cost_per_m2: "Költség/m²",
            revenue_per_m2: "Bevétel/m²",
            profit_per_m2: "Nyereség/m²",
            break_even_revenue: "Fedezeti pont",
            break_even_percentage: "Fedezeti pont %",
            project_duration: "Projekt időtartam",
            months: "hónap",
            cashflow_timeline: "Pénzáramlás idővonal",
            period: "Időszak",
            costs: "Költségek",
            revenue: "Bevétel",
            cumulative_cashflow: "Kumulatív pénzáramlás",
        },
        de: {
            title: "Entwicklungsergebnisse",
            overview: "Übersicht",
            charts: "Diagramme",
            cashflow: "Cashflow",
            kpis_title: "Leistungskennzahlen",
            total_project_costs: "Gesamtkosten",
            total_project_costs_desc: "Alle Kosten inkl. Finanzierung",
            gross_revenue: "Bruttoeinnahmen",
            gross_revenue_desc: "Gesamte Verkaufserlöse",
            gross_profit: "Bruttogewinn",
            gross_profit_desc: "Einnahmen minus Kosten",
            profit_margin: "Gewinnmarge",
            profit_margin_desc: "Gewinn als % der Einnahmen",
            developer_margin: "Entwicklermarge",
            developer_margin_desc: "Nettogewinn als % der Kosten",
            return_on_cost: "Kostenrendite",
            return_on_cost_desc: "ROC - Gewinn/Kosten",
            equity_multiple: "Eigenkapital-Multiplikator",
            equity_multiple_desc: "Wie oft wird das Eigenkapital zurückgegeben",
            irr: "IRR",
            irr_desc: "Interner Zinsfuß",
            annualized_return: "Jährliche Rendite",
            annualized_return_desc: "Jährliche Eigenkapitalrendite",
            cost_breakdown: "Kostenaufschlüsselung",
            revenue_breakdown: "Einnahmenaufschlüsselung",
            key_metrics: "Kennzahlen",
            cost_per_m2: "Kosten/m²",
            revenue_per_m2: "Einnahmen/m²",
            profit_per_m2: "Gewinn/m²",
            break_even_revenue: "Break-Even",
            break_even_percentage: "Break-Even %",
            project_duration: "Projektdauer",
            months: "Monate",
            cashflow_timeline: "Cashflow-Zeitachse",
            period: "Zeitraum",
            costs: "Kosten",
            revenue: "Einnahmen",
            cumulative_cashflow: "Kumulativer Cashflow",
        }
    };

    const t = translations[language] || translations.en;

    // Generate Cash Flow Timeline data (simplified - 4 phases)
    const cashFlowData = [
        { period: '1-6 ' + t.months, costs: -kpis.total_project_costs * 0.3, revenue: 0, cumulative: -kpis.total_project_costs * 0.3 },
        { period: '7-12 ' + t.months, costs: -kpis.total_project_costs * 0.4, revenue: kpis.gross_revenue * 0.2, cumulative: -kpis.total_project_costs * 0.7 + kpis.gross_revenue * 0.2 },
        { period: '13-18 ' + t.months, costs: -kpis.total_project_costs * 0.2, revenue: kpis.gross_revenue * 0.4, cumulative: -kpis.total_project_costs * 0.9 + kpis.gross_revenue * 0.6 },
        { period: '19-24 ' + t.months, costs: -kpis.total_project_costs * 0.1, revenue: kpis.gross_revenue * 0.4, cumulative: kpis.gross_profit }
    ];

    return (
        <div className="space-y-6">
            <Card className="shadow-premium border-primary/20">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                    <CardTitle className="text-2xl flex items-center gap-2">
                        <TrendingUp className="w-6 h-6" />
                        {t.title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-6">
                            <TabsTrigger value="overview">{t.overview}</TabsTrigger>
                            <TabsTrigger value="charts">{t.charts}</TabsTrigger>
                            <TabsTrigger value="cashflow">{t.cashflow}</TabsTrigger>
                        </TabsList>

                        {/* Overview Tab */}
                        <TabsContent value="overview" className="space-y-6">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Target className="w-5 h-5" />
                                {t.kpis_title}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <KPICard
                                    title={t.total_project_costs}
                                    value={currencyFormatter(kpis.total_project_costs, 'EUR', currency, 0)}
                                    icon={DollarSign}
                                    description={t.total_project_costs_desc}
                                />
                                <KPICard
                                    title={t.gross_revenue}
                                    value={currencyFormatter(kpis.gross_revenue, 'EUR', currency, 0)}
                                    icon={TrendingUp}
                                    description={t.gross_revenue_desc}
                                    trend="up"
                                />
                                <KPICard
                                    title={t.gross_profit}
                                    value={currencyFormatter(kpis.gross_profit, 'EUR', currency, 0)}
                                    icon={TrendingUp}
                                    description={t.gross_profit_desc}
                                    trend={kpis.gross_profit > 0 ? "up" : "down"}
                                />
                                <KPICard
                                    title={t.profit_margin}
                                    value={percentFormatter(kpis.profit_margin)}
                                    icon={Target}
                                    description={t.profit_margin_desc}
                                />
                                <KPICard
                                    title={t.developer_margin}
                                    value={percentFormatter(kpis.developer_margin)}
                                    icon={Target}
                                    description={t.developer_margin_desc}
                                />
                                <KPICard
                                    title={t.return_on_cost}
                                    value={percentFormatter(kpis.return_on_cost)}
                                    icon={TrendingUp}
                                    description={t.return_on_cost_desc}
                                />
                                <KPICard
                                    title={t.equity_multiple}
                                    value={`${kpis.equity_multiple?.toFixed(2)}x`}
                                    icon={TrendingUp}
                                    description={t.equity_multiple_desc}
                                />
                                <KPICard
                                    title={t.irr}
                                    value={percentFormatter(kpis.irr)}
                                    icon={TrendingUp}
                                    description={t.irr_desc}
                                />
                                <KPICard
                                    title={t.annualized_return}
                                    value={percentFormatter(kpis.annualized_return)}
                                    icon={TrendingUp}
                                    description={t.annualized_return_desc}
                                />
                            </div>

                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold mb-4">{t.key_metrics}</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                                    <div className="bg-muted/30 p-4 rounded-lg">
                                        <p className="text-sm text-muted-foreground mb-1">{t.cost_per_m2}</p>
                                        <p className="text-lg font-bold">{currencyFormatter(kpis.cost_per_m2, 'EUR', currency, 0)}</p>
                                    </div>
                                    <div className="bg-muted/30 p-4 rounded-lg">
                                        <p className="text-sm text-muted-foreground mb-1">{t.revenue_per_m2}</p>
                                        <p className="text-lg font-bold">{currencyFormatter(kpis.revenue_per_m2, 'EUR', currency, 0)}</p>
                                    </div>
                                    <div className="bg-muted/30 p-4 rounded-lg">
                                        <p className="text-sm text-muted-foreground mb-1">{t.profit_per_m2}</p>
                                        <p className="text-lg font-bold">{currencyFormatter(kpis.profit_per_m2, 'EUR', currency, 0)}</p>
                                    </div>
                                    <div className="bg-muted/30 p-4 rounded-lg">
                                        <p className="text-sm text-muted-foreground mb-1">{t.break_even_revenue}</p>
                                        <p className="text-lg font-bold">{currencyFormatter(kpis.break_even_revenue, 'EUR', currency, 0)}</p>
                                    </div>
                                    <div className="bg-muted/30 p-4 rounded-lg">
                                        <p className="text-sm text-muted-foreground mb-1">{t.break_even_percentage}</p>
                                        <p className="text-lg font-bold">{percentFormatter(kpis.break_even_percentage)}</p>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Charts Tab */}
                        <TabsContent value="charts" className="space-y-8">
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Cost Breakdown */}
                                {cost_breakdown && cost_breakdown.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                            <PieChartIcon className="w-5 h-5" />
                                            {t.cost_breakdown}
                                        </h3>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={cost_breakdown}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={80}
                                                    label
                                                >
                                                    {cost_breakdown.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip formatter={(value) => currencyFormatter(value, 'EUR', currency, 0)} />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}

                                {/* Revenue Breakdown */}
                                {revenue_breakdown && revenue_breakdown.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                            <BarChart3 className="w-5 h-5" />
                                            {t.revenue_breakdown}
                                        </h3>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={revenue_breakdown}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis tickFormatter={(value) => `${currency}${(value / 1000).toFixed(0)}k`} />
                                                <Tooltip formatter={(value) => currencyFormatter(value, 'EUR', currency, 0)} />
                                                <Bar dataKey="value" fill="#003E7E" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        {/* Cash Flow Tab */}
                        <TabsContent value="cashflow" className="space-y-6">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <TrendingUp className="w-5 h-5" />
                                {t.cashflow_timeline}
                            </h3>
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={cashFlowData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="period" />
                                    <YAxis tickFormatter={(value) => `${currency}${(value / 1000).toFixed(0)}k`} />
                                    <Tooltip formatter={(value) => currencyFormatter(value, 'EUR', currency, 0)} />
                                    <Legend />
                                    <Line type="monotone" dataKey="costs" stroke="#E53935" name={t.costs} strokeWidth={2} />
                                    <Line type="monotone" dataKey="revenue" stroke="#00B894" name={t.revenue} strokeWidth={2} />
                                    <Line type="monotone" dataKey="cumulative" stroke="#003E7E" name={t.cumulative_cashflow} strokeWidth={3} />
                                </LineChart>
                            </ResponsiveContainer>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
