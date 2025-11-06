import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { currencyFormatter, percentFormatter } from '../../lib/formatters';
import KPICard from '../shared/KPICard';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

export default function DevelopmentResults({ results, currency = '€', language = 'en' }) {
    if (!results || !results.kpis) return null;

    const { kpis, cost_breakdown, revenue_breakdown } = results;

    const translations = {
        en: {
            financial_overview: "Financial Overview",
            investment_summary: "Investment Summary",
            profitability: "Profitability Analysis",
            per_m2_metrics: "Per M² Metrics",
            developer_returns: "Developer Returns",
            risk_analysis: "Risk Analysis",
            project_areas: "Project Areas",
            efficiency_ratios: "Efficiency Ratios",
            cost_breakdown: "Cost Breakdown",
            revenue_breakdown: "Revenue Breakdown",
            
            // KPIs
            total_costs: "Total Project Costs",
            own_resources: "Own Resources",
            bank_resources: "Bank Resources",
            financing_costs: "Financing Costs",
            gross_revenue: "Gross Revenue",
            net_revenue: "Net Revenue",
            gross_profit: "Gross Profit",
            net_profit: "Net Profit",
            profit_margin: "Profit Margin",
            developer_margin: "Developer's Margin",
            return_on_cost: "Return on Cost",
            equity_multiple: "Equity Multiple",
            annualized_return: "Annualized Return",
            irr: "IRR (Internal Rate of Return)",
            project_duration: "Project Duration",
            cost_per_m2: "Total Cost per m²",
            land_cost_per_m2: "Land Cost per m²",
            construction_cost_per_m2: "Construction Cost per m²",
            revenue_per_m2: "Revenue per m²",
            profit_per_m2: "Profit per m²",
            break_even: "Break-Even Revenue",
            break_even_pct: "Break-Even %",
            land_uplift: "Land Value Uplift",
            land_uplift_pct: "Land Value Uplift %",
            total_gfa: "Total GFA",
            total_nfa: "Total NFA",
            total_sales_area: "Total Sales Area",
            total_land: "Total Land Area",
            gfa_to_land: "GFA to Land Ratio",
            nfa_to_gfa: "NFA to GFA Ratio",
            sales_to_gfa: "Sales to GFA Ratio",
            months: "months",
            years: "years",
        },
        sk: {
            financial_overview: "Finančný prehľad",
            investment_summary: "Súhrn investície",
            profitability: "Analýza ziskovosti",
            per_m2_metrics: "Metriky na m²",
            developer_returns: "Výnosy developera",
            risk_analysis: "Analýza rizík",
            project_areas: "Plochy projektu",
            efficiency_ratios: "Ukazovatele efektívnosti",
            cost_breakdown: "Rozdelenie nákladov",
            revenue_breakdown: "Rozdelenie príjmov",
            
            // KPIs
            total_costs: "Celkové náklady projektu",
            own_resources: "Vlastné zdroje",
            bank_resources: "Bankové zdroje",
            financing_costs: "Náklady na financovanie",
            gross_revenue: "Hrubé tržby",
            net_revenue: "Čisté tržby",
            gross_profit: "Hrubý zisk",
            net_profit: "Čistý zisk",
            profit_margin: "Zisková marža",
            developer_margin: "Marža developera",
            return_on_cost: "Návratnosť nákladov",
            equity_multiple: "Násobok kapitálu",
            annualized_return: "Ročná návratnosť",
            irr: "IRR (Vnútorná miera návratnosti)",
            project_duration: "Trvanie projektu",
            cost_per_m2: "Celkové náklady na m²",
            land_cost_per_m2: "Náklady na pozemok na m²",
            construction_cost_per_m2: "Náklady na výstavbu na m²",
            revenue_per_m2: "Príjem na m²",
            profit_per_m2: "Zisk na m²",
            break_even: "Bod zvratu - tržby",
            break_even_pct: "Bod zvratu %",
            land_uplift: "Zhodnotenie pozemku",
            land_uplift_pct: "Zhodnotenie pozemku %",
            total_gfa: "Celková HPP",
            total_nfa: "Celková ČÚP",
            total_sales_area: "Celková predajná plocha",
            total_land: "Celková plocha pozemku",
            gfa_to_land: "Pomer HPP k pozemku",
            nfa_to_gfa: "Pomer ČÚP k HPP",
            sales_to_gfa: "Pomer predajnej plochy k HPP",
            months: "mesiacov",
            years: "rokov",
        },
        pl: {
            financial_overview: "Przegląd finansowy",
            investment_summary: "Podsumowanie inwestycji",
            profitability: "Analiza rentowności",
            per_m2_metrics: "Metryki na m²",
            developer_returns: "Zwroty dewelopera",
            risk_analysis: "Analiza ryzyka",
            project_areas: "Obszary projektu",
            efficiency_ratios: "Wskaźniki efektywności",
            cost_breakdown: "Podział kosztów",
            revenue_breakdown: "Podział przychodów",
            
            // KPIs
            total_costs: "Całkowite koszty projektu",
            own_resources: "Własne zasoby",
            bank_resources: "Zasoby bankowe",
            financing_costs: "Koszty finansowania",
            gross_revenue: "Przychody brutto",
            net_revenue: "Przychody netto",
            gross_profit: "Zysk brutto",
            net_profit: "Zysk netto",
            profit_margin: "Marża zysku",
            developer_margin: "Marża dewelopera",
            return_on_cost: "Zwrot z kosztów",
            equity_multiple: "Mnożnik kapitału",
            annualized_return: "Roczny zwrot",
            irr: "IRR (Wewnętrzna stopa zwrotu)",
            project_duration: "Czas trwania projektu",
            cost_per_m2: "Całkowity koszt na m²",
            land_cost_per_m2: "Koszt gruntu na m²",
            construction_cost_per_m2: "Koszt budowy na m²",
            revenue_per_m2: "Przychód na m²",
            profit_per_m2: "Zysk na m²",
            break_even: "Próg rentowności - przychody",
            break_even_pct: "Próg rentowności %",
            land_uplift: "Wzrost wartości gruntu",
            land_uplift_pct: "Wzrost wartości gruntu %",
            total_gfa: "Całkowita powierzchnia brutto",
            total_nfa: "Całkowita powierzchnia netto",
            total_sales_area: "Całkowita powierzchnia sprzedaży",
            total_land: "Całkowita powierzchnia działki",
            gfa_to_land: "Stosunek GFA do działki",
            nfa_to_gfa: "Stosunek NFA do GFA",
            sales_to_gfa: "Stosunek sprzedaży do GFA",
            months: "miesięcy",
            years: "lat",
        },
        hu: {
            financial_overview: "Pénzügyi áttekintés",
            investment_summary: "Befektetési összefoglaló",
            profitability: "Jövedelmezőségi elemzés",
            per_m2_metrics: "M² mutatók",
            developer_returns: "Fejlesztői hozamok",
            risk_analysis: "Kockázatelemzés",
            project_areas: "Projekt területek",
            efficiency_ratios: "Hatékonysági mutatók",
            cost_breakdown: "Költségek megoszlása",
            revenue_breakdown: "Bevételek megoszlása",
            
            // KPIs
            total_costs: "Teljes projektköltség",
            own_resources: "Saját források",
            bank_resources: "Banki források",
            financing_costs: "Finanszírozási költségek",
            gross_revenue: "Bruttó bevétel",
            net_revenue: "Nettó bevétel",
            gross_profit: "Bruttó nyereség",
            net_profit: "Nettó nyereség",
            profit_margin: "Profitmarzs",
            developer_margin: "Fejlesztői marzs",
            return_on_cost: "Költség megtérülés",
            equity_multiple: "Tőke szorzó",
            annualized_return: "Éves hozam",
            irr: "IRR (Belső megtérülési ráta)",
            project_duration: "Projekt időtartama",
            cost_per_m2: "Teljes költség m²-enként",
            land_cost_per_m2: "Telek költség m²-enként",
            construction_cost_per_m2: "Építési költség m²-enként",
            revenue_per_m2: "Bevétel m²-enként",
            profit_per_m2: "Nyereség m²-enként",
            break_even: "Megtérülési pont - bevétel",
            break_even_pct: "Megtérülési pont %",
            land_uplift: "Telek értéknövekedés",
            land_uplift_pct: "Telek értéknövekedés %",
            total_gfa: "Teljes bruttó terület",
            total_nfa: "Teljes nettó terület",
            total_sales_area: "Teljes értékesítési terület",
            total_land: "Teljes telek terület",
            gfa_to_land: "GFA - telek arány",
            nfa_to_gfa: "NFA - GFA arány",
            sales_to_gfa: "Értékesítés - GFA arány",
            months: "hónap",
            years: "év",
        },
        de: {
            financial_overview: "Finanzübersicht",
            investment_summary: "Investitionszusammenfassung",
            profitability: "Rentabilitätsanalyse",
            per_m2_metrics: "Pro M² Kennzahlen",
            developer_returns: "Entwicklerrenditen",
            risk_analysis: "Risikoanalyse",
            project_areas: "Projektflächen",
            efficiency_ratios: "Effizienzkennzahlen",
            cost_breakdown: "Kostenaufschlüsselung",
            revenue_breakdown: "Umsatzaufschlüsselung",
            
            // KPIs
            total_costs: "Gesamtprojektkosten",
            own_resources: "Eigenmittel",
            bank_resources: "Bankmittel",
            financing_costs: "Finanzierungskosten",
            gross_revenue: "Bruttoeinnahmen",
            net_revenue: "Nettoeinnahmen",
            gross_profit: "Bruttogewinn",
            net_profit: "Nettogewinn",
            profit_margin: "Gewinnmarge",
            developer_margin: "Entwicklermarge",
            return_on_cost: "Kostenrendite",
            equity_multiple: "Eigenkapital-Multiplikator",
            annualized_return: "Jährliche Rendite",
            irr: "IRR (Interner Zinsfuß)",
            project_duration: "Projektdauer",
            cost_per_m2: "Gesamtkosten pro m²",
            land_cost_per_m2: "Grundstückskosten pro m²",
            construction_cost_per_m2: "Baukosten pro m²",
            revenue_per_m2: "Einnahmen pro m²",
            profit_per_m2: "Gewinn pro m²",
            break_even: "Break-Even Umsatz",
            break_even_pct: "Break-Even %",
            land_uplift: "Grundstückswertsteigerung",
            land_uplift_pct: "Grundstückswertsteigerung %",
            total_gfa: "Gesamte Bruttogeschossfläche",
            total_nfa: "Gesamte Nettogeschossfläche",
            total_sales_area: "Gesamte Verkaufsfläche",
            total_land: "Gesamte Grundstücksfläche",
            gfa_to_land: "BGF zu Grundstück Verhältnis",
            nfa_to_gfa: "NGF zu BGF Verhältnis",
            sales_to_gfa: "Verkauf zu BGF Verhältnis",
            months: "Monate",
            years: "Jahre",
        }
    };

    const t = translations[language] || translations.en;

    // Safe number formatter
    const safeNum = (value) => {
        const num = Number(value);
        return isNaN(num) ? 0 : num;
    };

    return (
        <div className="space-y-6">
            {/* Key Performance Indicators */}
            <Card>
                <CardHeader>
                    <CardTitle>{t.financial_overview}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        <KPICard
                            label={t.gross_profit}
                            value={currencyFormatter(safeNum(kpis.gross_profit), 'EUR', currency, 0)}
                            variant={safeNum(kpis.gross_profit) > 0 ? 'success' : 'danger'}
                        />
                        <KPICard
                            label={t.profit_margin}
                            value={percentFormatter(safeNum(kpis.profit_margin))}
                            variant={safeNum(kpis.profit_margin) > 15 ? 'success' : 'warning'}
                        />
                        <KPICard
                            label={t.return_on_cost}
                            value={percentFormatter(safeNum(kpis.return_on_cost))}
                            variant={safeNum(kpis.return_on_cost) > 20 ? 'success' : 'warning'}
                        />
                        <KPICard
                            label={t.equity_multiple}
                            value={`${safeNum(kpis.equity_multiple).toFixed(2)}x`}
                            variant={safeNum(kpis.equity_multiple) > 1.5 ? 'success' : 'warning'}
                        />
                        <KPICard
                            label={t.irr}
                            value={percentFormatter(safeNum(kpis.irr))}
                            variant={safeNum(kpis.irr) > 15 ? 'success' : 'warning'}
                        />
                        <KPICard
                            label={t.developer_margin}
                            value={percentFormatter(safeNum(kpis.developer_margin))}
                            variant={safeNum(kpis.developer_margin) > 20 ? 'success' : 'warning'}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Investment Summary */}
            <Card>
                <CardHeader>
                    <CardTitle>{t.investment_summary}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <KPICard
                            label={t.total_costs}
                            value={currencyFormatter(safeNum(kpis.total_project_costs), 'EUR', currency, 0)}
                        />
                        <KPICard
                            label={t.own_resources}
                            value={currencyFormatter(safeNum(kpis.own_resources), 'EUR', currency, 0)}
                        />
                        <KPICard
                            label={t.bank_resources}
                            value={currencyFormatter(safeNum(kpis.bank_resources), 'EUR', currency, 0)}
                        />
                        <KPICard
                            label={t.gross_revenue}
                            value={currencyFormatter(safeNum(kpis.gross_revenue), 'EUR', currency, 0)}
                        />
                    </div>
                    <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">{t.project_duration}</p>
                        <p className="text-lg font-semibold">
                            {safeNum(kpis.project_duration_months).toFixed(0)} {t.months} 
                            ({safeNum(kpis.project_duration_years).toFixed(1)} {t.years})
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Per M² Metrics */}
            <Card>
                <CardHeader>
                    <CardTitle>{t.per_m2_metrics}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        <KPICard
                            label={t.cost_per_m2}
                            value={currencyFormatter(safeNum(kpis.cost_per_m2), 'EUR', currency, 0)}
                        />
                        <KPICard
                            label={t.construction_cost_per_m2}
                            value={currencyFormatter(safeNum(kpis.construction_cost_per_m2), 'EUR', currency, 0)}
                        />
                        <KPICard
                            label={t.revenue_per_m2}
                            value={currencyFormatter(safeNum(kpis.revenue_per_m2), 'EUR', currency, 0)}
                        />
                        <KPICard
                            label={t.profit_per_m2}
                            value={currencyFormatter(safeNum(kpis.profit_per_m2), 'EUR', currency, 0)}
                            variant={safeNum(kpis.profit_per_m2) > 0 ? 'success' : 'danger'}
                        />
                        <KPICard
                            label={t.land_cost_per_m2}
                            value={currencyFormatter(safeNum(kpis.land_cost_per_m2), 'EUR', currency, 0)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Risk Analysis */}
            <Card>
                <CardHeader>
                    <CardTitle>{t.risk_analysis}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <KPICard
                            label={t.break_even}
                            value={currencyFormatter(safeNum(kpis.break_even_revenue), 'EUR', currency, 0)}
                        />
                        <KPICard
                            label={t.break_even_pct}
                            value={percentFormatter(safeNum(kpis.break_even_percentage))}
                            variant={safeNum(kpis.break_even_percentage) < 80 ? 'success' : 'warning'}
                        />
                        <KPICard
                            label={t.land_uplift}
                            value={currencyFormatter(safeNum(kpis.land_value_uplift), 'EUR', currency, 0)}
                        />
                        <KPICard
                            label={t.land_uplift_pct}
                            value={percentFormatter(safeNum(kpis.land_value_uplift_percent))}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Project Areas & Efficiency */}
            <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{t.project_areas}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-border">
                                <span className="text-muted-foreground">{t.total_land}</span>
                                <span className="font-semibold">{safeNum(kpis.total_land_area).toLocaleString()} m²</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-border">
                                <span className="text-muted-foreground">{t.total_gfa}</span>
                                <span className="font-semibold">{safeNum(kpis.total_gfa).toLocaleString()} m²</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-border">
                                <span className="text-muted-foreground">{t.total_nfa}</span>
                                <span className="font-semibold">{safeNum(kpis.total_nfa).toLocaleString()} m²</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-muted-foreground">{t.total_sales_area}</span>
                                <span className="font-semibold">{safeNum(kpis.total_sales_area).toLocaleString()} m²</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t.efficiency_ratios}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-border">
                                <span className="text-muted-foreground">{t.gfa_to_land}</span>
                                <span className="font-semibold">{safeNum(kpis.gfa_to_land_ratio).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-border">
                                <span className="text-muted-foreground">{t.nfa_to_gfa}</span>
                                <span className="font-semibold">{percentFormatter(safeNum(kpis.nfa_to_gfa_ratio))}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-muted-foreground">{t.sales_to_gfa}</span>
                                <span className="font-semibold">{percentFormatter(safeNum(kpis.sales_to_gfa_ratio))}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            {cost_breakdown && cost_breakdown.length > 0 && (
                <div className="grid lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t.cost_breakdown}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={400}>
                                <PieChart>
                                    <Pie
                                        data={cost_breakdown}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, value }) => `${name}: ${currencyFormatter(value, 'EUR', currency, 0)}`}
                                        outerRadius={120}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {cost_breakdown.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => currencyFormatter(value, 'EUR', currency, 0)} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {revenue_breakdown && revenue_breakdown.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>{t.revenue_breakdown}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={400}>
                                    <PieChart>
                                        <Pie
                                            data={revenue_breakdown}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, value }) => `${name}: ${currencyFormatter(value, 'EUR', currency, 0)}`}
                                            outerRadius={120}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {revenue_breakdown.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => currencyFormatter(value, 'EUR', currency, 0)} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
}