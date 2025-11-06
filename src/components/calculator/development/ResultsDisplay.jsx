
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import KPICard from '../shared/KPICard';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import { currencyFormatter, percentFormatter } from '@/components/lib/formatters';
import { TrendingUp, TrendingDown, DollarSign, Target, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';
import InfoTooltip from '@/components/shared/InfoTooltip';

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
            total_project_costs_tooltip: "Súčet všetkých nákladov projektu: pozemok, výstavba, inžinierske siete, financovanie, rezerva a ostatné náklady.",
            gross_revenue: "Hrubé tržby",
            gross_revenue_desc: "Celkové príjmy z predaja",
            gross_revenue_tooltip: "Celkové očakávané tržby z predaja bytov, nebytových priestorov, parkovacích miest, balkónov, záhrad a pivníc.",
            gross_profit: "Hrubý zisk",
            gross_profit_desc: "Tržby mínus náklady",
            gross_profit_tooltip: "Rozdiel medzi celkovými tržbami a celkovými nákladmi projektu. Ukazuje absolútny zisk pred zdanením.",
            profit_margin: "Zisková marža",
            profit_margin_desc: "Percento zisku z tržieb",
            profit_margin_tooltip: "Zisk ako percento z celkových tržieb. Ukazuje, koľko percent z každého predaného eura zostáva ako zisk.",
            developer_margin: "Marža developera",
            developer_margin_desc: "Čistý zisk ako % nákladov",
            developer_margin_tooltip: "Zisk ako percento z celkových nákladov. Ukazuje efektivitu využitia investovaných prostriedkov.",
            return_on_cost: "Návratnosť nákladov",
            return_on_cost_desc: "ROC - zisk/náklady",
            return_on_cost_tooltip: "Return on Cost (ROC) - rovnaký ako marža developera, vyjadruje percento návratnosti investovaných nákladov.",
            equity_multiple: "Násobok kapitálu",
            equity_multiple_desc: "Koľkokrát sa vráti vlastný kapitál",
            equity_multiple_tooltip: "Ukazuje, koľkokrát sa vráti investovaný vlastný kapitál. Napr. 2.5x znamená, že dostanete 2.5-násobok svojej investície späť.",
            irr: "IRR",
            irr_desc: "Vnútorná miera návratnosti",
            irr_tooltip: "Internal Rate of Return - ročná percentuálna návratnosť investície zohľadňujúca časovú hodnotu peňazí a cash flow projektu.",
            annualized_return: "Ročná návratnosť",
            annualized_return_desc: "Ročný výnos vlastného kapitálu",
            annualized_return_tooltip: "Priemerná ročná návratnosť vlastného kapitálu prepočítaná na dobu trvania projektu.",
            cost_breakdown: "Rozloženie nákladov",
            revenue_breakdown: "Rozloženie príjmov",
            key_metrics: "Kľúčové mety",
            cost_per_m2: "Náklady/m²",
            cost_per_m2_tooltip: "Celkové náklady projektu vydelené celkovou predajnou plochou. Ukazuje priemernú cenu za m² nákladov.",
            revenue_per_m2: "Príjem/m²",
            revenue_per_m2_tooltip: "Celkové tržby vydelené celkovou predajnou plochou. Ukazuje priemernú predajnú cenu za m².",
            profit_per_m2: "Zisk/m²",
            profit_per_m2_tooltip: "Zisk vydelený celkovou predajnou plochou. Ukazuje, koľko zisku generuje každý m².",
            break_even_revenue: "Bod zvratu",
            break_even_revenue_tooltip: "Minimálna výška tržieb potrebná na pokrytie všetkých nákladov projektu. Pri tejto úrovni tržieb je zisk nulový.",
            break_even_percentage: "Bod zvratu %",
            break_even_percentage_tooltip: "Percento z plánovaných tržieb potrebné na pokrytie nákladov. Ukazuje, koľko % jednotiek je potrebné predať na break-even.",
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
            total_project_costs_tooltip: "Sum of all project costs: land, construction, engineering networks, financing, reserve and other costs.",
            gross_revenue: "Gross Revenue",
            gross_revenue_desc: "Total sales revenue",
            gross_revenue_tooltip: "Total expected revenue from sales of apartments, non-residential units, parking spaces, balconies, gardens and basements.",
            gross_profit: "Gross Profit",
            gross_profit_desc: "Revenue minus costs",
            gross_profit_tooltip: "Difference between total revenue and total project costs. Shows absolute profit before taxes.",
            profit_margin: "Profit Margin",
            profit_margin_desc: "Profit as % of revenue",
            profit_margin_tooltip: "Profit as percentage of total revenue. Shows how much of each euro sold remains as profit.",
            developer_margin: "Developer Margin",
            developer_margin_desc: "Net profit as % of cost",
            developer_margin_tooltip: "Profit as percentage of total costs. Shows efficiency of invested capital utilization.",
            return_on_cost: "Return on Cost",
            return_on_cost_desc: "ROC - profit/cost",
            return_on_cost_tooltip: "Return on Cost (ROC) - same as developer margin, expresses percentage return on invested costs.",
            equity_multiple: "Equity Multiple",
            equity_multiple_desc: "How many times equity is returned",
            equity_multiple_tooltip: "Shows how many times your invested equity is returned. E.g. 2.5x means you get 2.5 times your investment back.",
            irr: "IRR",
            irr_desc: "Internal Rate of Return",
            irr_tooltip: "Internal Rate of Return - annual percentage return considering time value of money and project cash flows.",
            annualized_return: "Annualized Return",
            annualized_return_desc: "Annual return on equity",
            annualized_return_tooltip: "Average annual return on equity calculated over the project duration.",
            cost_breakdown: "Cost Breakdown",
            revenue_breakdown: "Revenue Breakdown",
            key_metrics: "Key Metrics",
            cost_per_m2: "Cost/m²",
            cost_per_m2_tooltip: "Total project costs divided by total sales area. Shows average cost per m².",
            revenue_per_m2: "Revenue/m²",
            revenue_per_m2_tooltip: "Total revenue divided by total sales area. Shows average selling price per m².",
            profit_per_m2: "Profit/m2",
            profit_per_m2_tooltip: "Profit divided by total sales area. Shows how much profit each m² generates.",
            break_even_revenue: "Break-Even",
            break_even_revenue_tooltip: "Minimum revenue needed to cover all project costs. At this revenue level, profit is zero.",
            break_even_percentage: "Break-Even %",
            break_even_percentage_tooltip: "Percentage of planned revenue needed to cover costs. Shows what % of units need to be sold to break even.",
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
            total_project_costs_tooltip: "Suma wszystkich kosztów projektu: grunt, budowa, sieci inżynieryjne, finansowanie, rezerwa i inne koszty.",
            gross_revenue: "Przychody brutto",
            gross_revenue_desc: "Całkowite przychody ze sprzedaży",
            gross_revenue_tooltip: "Całkowite oczekiwane przychody ze sprzedaży mieszkań, lokali użytkowych, miejsc parkingowych, balkonów, ogrodów i piwnic.",
            gross_profit: "Zysk brutto",
            gross_profit_desc: "Przychody minus koszty",
            gross_profit_tooltip: "Różnica między całkowitymi przychodami a całkowitymi kosztami projektu. Pokazuje zysk absolutny przed opodatkowaniem.",
            profit_margin: "Marża zysku",
            profit_margin_desc: "Zysk jako % przychodów",
            profit_margin_tooltip: "Zysk jako procent całkowitych przychodów. Pokazuje, ile procent z każdego sprzedanego euro pozostaje jako zysk.",
            developer_margin: "Marża dewelopera",
            developer_margin_desc: "Zysk netto jako % kosztów",
            developer_margin_tooltip: "Zysk jako procent całkowitych kosztów. Pokazuje efektywność wykorzystania zainwestowanego kapitału.",
            return_on_cost: "Zwrot z kosztów",
            return_on_cost_desc: "ROC - zysk/koszty",
            return_on_cost_tooltip: "Return on Cost (ROC) - tak samo jak marża dewelopera, wyraża procentowy zwrot z zainwestowanych kosztów.",
            equity_multiple: "Mnożnik kapitału",
            equity_multiple_desc: "Ile razy zwraca się kapitał",
            equity_multiple_tooltip: "Pokazuje, ile razy zwraca się zainwestowany kapitał własny. Np. 2.5x oznacza, że otrzymasz 2.5 raza więcej niż zainwestowałeś.",
            irr: "IRR",
            irr_desc: "Wewnętrzna stopa zwrotu",
            irr_tooltip: "Internal Rate of Return - roczny procentowy zwrot uwzględniający wartość pieniądza w czasie i przepływy gotówki projektu.",
            annualized_return: "Roczny zwrot",
            annualized_return_desc: "Roczny zwrot z kapitału",
            annualized_return_tooltip: "Średni roczny zwrot z kapitału własnego obliczony na podstawie czasu trwania projektu.",
            cost_breakdown: "Podział kosztów",
            revenue_breakdown: "Podział przychodów",
            key_metrics: "Kluczowe metryki",
            cost_per_m2: "Koszt/m²",
            cost_per_m2_tooltip: "Całkowite koszty projektu podzielone przez całkowitą powierzchnię sprzedaży. Pokazuje średni koszt na m².",
            revenue_per_m2: "Przychód/m²",
            revenue_per_m2_tooltip: "Całkowite przychody podzielone przez całkowitą powierzchnię sprzedaży. Pokazuje średnią cenę sprzedaży na m².",
            profit_per_m2: "Zysk/m²",
            profit_per_m2_tooltip: "Zysk podzielony przez całkowitą powierzchnię sprzedaży. Pokazuje, ile zysku generuje każdy m².",
            break_even_revenue: "Próg rentowności",
            break_even_revenue_tooltip: "Minimalne przychody potrzebne do pokrycia wszystkich kosztów projektu. Przy tym poziomie przychodów zysk wynosi zero.",
            break_even_percentage: "Próg rentowności %",
            break_even_percentage_tooltip: "Procent planowanych przychodów potrzebny do pokrycia kosztów. Pokazuje, jaki % lokali należy sprzedać, aby osiągnąć próg rentowności.",
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
            total_project_costs_tooltip: "Összes projektköltség összege: telek, építés, mérnöki hálózatok, finanszírozás, tartalék és egyéb költségek.",
            gross_revenue: "Bruttó bevétel",
            gross_revenue_desc: "Összes értékesítési bevétel",
            gross_revenue_tooltip: "Várható összes bevétel lakások, nem lakás egységek, parkolóhelyek, erkélyek, kertek és pincék értékesítéséből.",
            gross_profit: "Bruttó nyereség",
            gross_profit_desc: "Bevétel mínusz költségek",
            gross_profit_tooltip: "Különbség az összes bevétel és az összes projektköltség között. Mutatja az abszolút nyereséget adózás előtt.",
            profit_margin: "Profitmarzs",
            profit_margin_desc: "Nyereség mint a bevétel %-a",
            profit_margin_tooltip: "Nyereség az összes bevétel százalékában. Mutatja, hogy minden eladott euróból mennyi marad nyereségként.",
            developer_margin: "Fejlesztői marzs",
            developer_margin_desc: "Nettó nyereség mint a költség %-a",
            developer_margin_tooltip: "Nyereség az összes költség százalékában. Mutatja a befektetett tőke felhasználásának hatékonyságát.",
            return_on_cost: "Költség megtérülés",
            return_on_cost_desc: "ROC - nyereség/költség",
            return_on_cost_tooltip: "Return on Cost (ROC) - ugyanaz, mint a fejlesztői marzs, százalékos megtérülést fejez ki a befektetett költségekre.",
            equity_multiple: "Tőke szorzó",
            equity_multiple_desc: "Hányszor térül meg a tőke",
            equity_multiple_tooltip: "Mutatja, hogy hányszor térül meg a befektetett saját tőke. Pl. 2.5x azt jelenti, hogy 2.5-szerese kapja vissza a befektetését.",
            irr: "IRR",
            irr_desc: "Belső megtérülési ráta",
            irr_tooltip: "Internal Rate of Return - éves százalékos hozam figyelembe véve a pénz időértékét és a projekt pénzáramait.",
            annualized_return: "Éves hozam",
            annualized_return_desc: "Éves tőkehozam",
            annualized_return_tooltip: "Átlagos éves saját tőke hozam a projekt időtartamára számítva.",
            cost_breakdown: "Költségek részletezése",
            revenue_breakdown: "Bevételek részletezése",
            key_metrics: "Kulcs metrikák",
            cost_per_m2: "Költség/m²",
            cost_per_m2_tooltip: "Összes projektköltség osztva az összes értékesítési területtel. Mutatja az átlagos költséget m²-enként.",
            revenue_per_m2: "Bevétel/m²",
            revenue_per_m2_tooltip: "Összes bevétel osztva az összes értékesítési területtel. Mutatja az átlagos eladási árat m²-enként.",
            profit_per_m2: "Nyereség/m²",
            profit_per_m2_tooltip: "Nyereség osztva az összes értékesítési területtel. Mutatja, hogy mennyi nyereséget termel minden m².",
            break_even_revenue: "Fedezeti pont",
            break_even_revenue_tooltip: "Minimális bevétel az összes projektköltség fedezéséhez. Ezen a bevételi szinten a nyereség nulla.",
            break_even_percentage: "Fedezeti pont %",
            break_even_percentage_tooltip: "A tervezett bevétel százaléka, amely szükséges a költségek fedezéséhez. Mutatja, hogy hány % egységet kell eladni a fedezeti ponthoz.",
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
            total_project_costs_tooltip: "Summe aller Projektkosten: Grundstück, Bau, technische Netze, Finanzierung, Reserve und sonstige Kosten.",
            gross_revenue: "Bruttoeinnahmen",
            gross_revenue_desc: "Gesamte Verkaufserlöse",
            gross_revenue_tooltip: "Erwartete Gesamteinnahmen aus dem Verkauf von Wohnungen, Gewerbeflächen, Parkplätzen, Balkonen, Gärten und Kellern.",
            gross_profit: "Bruttogewinn",
            gross_profit_desc: "Einnahmen minus Kosten",
            gross_profit_tooltip: "Differenz zwischen Gesamteinnahmen und Gesamtprojektkosten. Zeigt absoluten Gewinn vor Steuern.",
            profit_margin: "Gewinnmarge",
            profit_margin_desc: "Gewinn als % der Einnahmen",
            profit_margin_tooltip: "Gewinn als Prozentsatz der Gesamteinnahmen. Zeigt, wie viel von jedem verkauften Euro als Gewinn verbleibt.",
            developer_margin: "Entwicklermarge",
            developer_margin_desc: "Nettogewinn als % der Kosten",
            developer_margin_tooltip: "Gewinn als Prozentsatz der Gesamtkosten. Zeigt die Effizienz der Kapitalnutzung.",
            return_on_cost: "Kostenrendite",
            return_on_cost_desc: "ROC - Gewinn/Kosten",
            return_on_cost_tooltip: "Return on Cost (ROC) - gleich wie Entwicklermarge, drückt prozentuale Rendite der investierten Kosten aus.",
            equity_multiple: "Eigenkapital-Multiplikator",
            equity_multiple_desc: "Wie oft wird das Eigenkapital zurückgegeben",
            equity_multiple_tooltip: "Zeigt, wie oft Ihr investiertes Eigenkapital zurückkehrt. Z.B. 2.5x bedeutet, Sie erhalten das 2.5-fache Ihrer Investition zurück.",
            irr: "IRR",
            irr_desc: "Interner Zinsfuß",
            irr_tooltip: "Internal Rate of Return - jährliche prozentuale Rendite unter Berücksichtigung des Zeitwerts des Geldes und der Projekt-Cashflows.",
            annualized_return: "Jährliche Rendite",
            annualized_return_desc: "Jährliche Eigenkapitalrendite",
            annualized_return_tooltip: "Durchschnittliche jährliche Eigenkapitalrendite über die Projektdauer berechnet.",
            cost_breakdown: "Kostenaufschlüsselung",
            revenue_breakdown: "Einnahmenaufschlüsselung",
            key_metrics: "Kennzahlen",
            cost_per_m2: "Kosten/m²",
            cost_per_m2_tooltip: "Gesamtprojektkosten geteilt durch Gesamtverkaufsfläche. Zeigt durchschnittliche Kosten pro m².",
            revenue_per_m2: "Einnahmen/m²",
            revenue_per_m2_tooltip: "Gesamteinnahmen geteilt durch Gesamtverkaufsfläche. Zeigt durchschnittlichen Verkaufspreis pro m².",
            profit_per_m2: "Gewinn/m²",
            profit_per_m2_tooltip: "Gewinn geteilt durch Gesamtverkaufsfläche. Zeigt, wie viel Gewinn jeder m² generiert.",
            break_even_revenue: "Break-Even",
            break_even_revenue_tooltip: "Mindesteinnahmen zur Deckung aller Projektkosten. Bei diesem Einnahmenniveau ist der Gewinn null.",
            break_even_percentage: "Break-Even %",
            break_even_percentage_tooltip: "Prozentsatz der geplanten Einnahmen zur Kostendeckung. Zeigt, welcher % der Einheiten verkauft werden muss, um Break-Even zu erreichen.",
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
                                    tooltip={t.total_project_costs_tooltip}
                                />
                                <KPICard
                                    title={t.gross_revenue}
                                    value={currencyFormatter(kpis.gross_revenue, 'EUR', currency, 0)}
                                    icon={TrendingUp}
                                    description={t.gross_revenue_desc}
                                    trend="up"
                                    tooltip={t.gross_revenue_tooltip}
                                />
                                <KPICard
                                    title={t.gross_profit}
                                    value={currencyFormatter(kpis.gross_profit, 'EUR', currency, 0)}
                                    icon={TrendingUp}
                                    description={t.gross_profit_desc}
                                    trend={kpis.gross_profit > 0 ? "up" : "down"}
                                    tooltip={t.gross_profit_tooltip}
                                />
                                <KPICard
                                    title={t.profit_margin}
                                    value={percentFormatter(kpis.profit_margin)}
                                    icon={Target}
                                    description={t.profit_margin_desc}
                                    tooltip={t.profit_margin_tooltip}
                                />
                                <KPICard
                                    title={t.developer_margin}
                                    value={percentFormatter(kpis.developer_margin)}
                                    icon={Target}
                                    description={t.developer_margin_desc}
                                    tooltip={t.developer_margin_tooltip}
                                />
                                <KPICard
                                    title={t.return_on_cost}
                                    value={percentFormatter(kpis.return_on_cost)}
                                    icon={TrendingUp}
                                    description={t.return_on_cost_desc}
                                    tooltip={t.return_on_cost_tooltip}
                                />
                                <KPICard
                                    title={t.equity_multiple}
                                    value={`${kpis.equity_multiple?.toFixed(2)}x`}
                                    icon={TrendingUp}
                                    description={t.equity_multiple_desc}
                                    tooltip={t.equity_multiple_tooltip}
                                />
                                <KPICard
                                    title={t.irr}
                                    value={percentFormatter(kpis.irr)}
                                    icon={TrendingUp}
                                    description={t.irr_desc}
                                    tooltip={t.irr_tooltip}
                                />
                                <KPICard
                                    title={t.annualized_return}
                                    value={percentFormatter(kpis.annualized_return)}
                                    icon={TrendingUp}
                                    description={t.annualized_return_desc}
                                    tooltip={t.annualized_return_tooltip}
                                />
                            </div>

                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold mb-4">{t.key_metrics}</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                                    <div className="bg-muted/30 p-4 rounded-lg">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-sm text-muted-foreground">{t.cost_per_m2}</p>
                                            <InfoTooltip content={t.cost_per_m2_tooltip} />
                                        </div>
                                        <p className="text-lg font-bold">{currencyFormatter(kpis.cost_per_m2, 'EUR', currency, 0)}</p>
                                    </div>
                                    <div className="bg-muted/30 p-4 rounded-lg">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-sm text-muted-foreground">{t.revenue_per_m2}</p>
                                            <InfoTooltip content={t.revenue_per_m2_tooltip} />
                                        </div>
                                        <p className="text-lg font-bold">{currencyFormatter(kpis.revenue_per_m2, 'EUR', currency, 0)}</p>
                                    </div>
                                    <div className="bg-muted/30 p-4 rounded-lg">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-sm text-muted-foreground">{t.profit_per_m2}</p>
                                            <InfoTooltip content={t.profit_per_m2_tooltip} />
                                        </div>
                                        <p className="text-lg font-bold">{currencyFormatter(kpis.profit_per_m2, 'EUR', currency, 0)}</p>
                                    </div>
                                    <div className="bg-muted/30 p-4 rounded-lg">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-sm text-muted-foreground">{t.break_even_revenue}</p>
                                            <InfoTooltip content={t.break_even_revenue_tooltip} />
                                        </div>
                                        <p className="text-lg font-bold">{currencyFormatter(kpis.break_even_revenue, 'EUR', currency, 0)}</p>
                                    </div>
                                    <div className="bg-muted/30 p-4 rounded-lg">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-sm text-muted-foreground">{t.break_even_percentage}</p>
                                            <InfoTooltip content={t.break_even_percentage_tooltip} />
                                        </div>
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
