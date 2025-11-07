
import React from 'react';
import { currencyFormatter, percentFormatter } from '../../lib/formatters';
import ResultsHeader from '../ResultsHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import KPICard from '../shared/KPICard';
import CashFlowTable from '../shared/CashFlowTable';
import CashFlowChart from '../shared/CashFlowChart';
import EquityBuildupChart from '../shared/EquityBuildupChart';
import ExpenseBreakdownChart from '../shared/ExpenseBreakdownChart';

export default function LongTermLeaseResults({ results, currency = 'EUR', language = 'en' }) {
    if (!results || !results.kpis) {
        return null;
    }

    const kpis = results.kpis;
    const currencySymbol = currency === 'EUR' ? '€' : currency;

    const translations = {
        en: {
            overview: "Overview",
            details: "Details",
            projections: "10-Year Projections",
            // KPIs
            total_investment: "Total Investment",
            total_investment_desc: "Purchase price + all initial costs",
            roi: "10-Year ROI",
            roi_desc: "Total return after 10 years",
            cash_on_cash: "Cash-on-Cash Return",
            cash_on_cash_desc: "Annual return on equity",
            payback_period: "Payback Period",
            payback_period_desc: "Years to recover investment",
            cap_rate: "Cap Rate",
            cap_rate_desc: "Net income / Purchase price",
            dscr: "Debt Service Coverage",
            dscr_desc: "NOI / Annual debt payment",
            annual_cash_flow: "Annual Cash Flow",
            annual_cash_flow_desc: "Yearly net profit",
            monthly_cash_flow: "Monthly Cash Flow",
            monthly_cash_flow_desc: "Average monthly profit",
            noi: "Net Operating Income",
            noi_desc: "Annual income minus operating expenses",
            year_10_equity: "Year 10 Equity",
            year_10_equity_desc: "Estimated equity after 10 years",
        },
        sk: {
            overview: "Prehľad",
            details: "Detaily",
            projections: "10-ročné projekcie",
            // KPIs
            total_investment: "Celková investícia",
            total_investment_desc: "Kúpna cena + všetky počiatočné náklady",
            roi: "10-ročné ROI",
            roi_desc: "Celková návratnosť po 10 rokoch",
            cash_on_cash: "Cash-on-Cash návratnosť",
            cash_on_cash_desc: "Ročná návratnosť vlastného kapitálu",
            payback_period: "Doba návratnosti",
            payback_period_desc: "Roky na vrátenie investície",
            cap_rate: "Cap Rate",
            cap_rate_desc: "Čistý príjem / Kúpna cena",
            dscr: "Pokrytie dlhovej služby",
            dscr_desc: "NOI / Ročná splátka dlhu",
            annual_cash_flow: "Ročný Cash Flow",
            annual_cash_flow_desc: "Ročný čistý zisk",
            monthly_cash_flow: "Mesačný Cash Flow",
            monthly_cash_flow_desc: "Priemerný mesačný zisk",
            noi: "Čistý prevádzkový príjem",
            noi_desc: "Ročný príjem mínus prevádzkové náklady",
            year_10_equity: "Vlastný kapitál po 10 rokoch",
            year_10_equity_desc: "Odhadovaný vlastný kapitál po 10 rokoch",
        },
        pl: {
            overview: "Przegląd",
            details: "Szczegóły",
            projections: "Projekcje 10-letnie",
            // KPIs
            total_investment: "Całkowita inwestycja",
            total_investment_desc: "Cena zakupu + wszystkie koszty początkowe",
            roi: "10-letni ROI",
            roi_desc: "Całkowity zwrot po 10 latach",
            cash_on_cash: "Zwrot Cash-on-Cash",
            cash_on_cash_desc: "Roczny zwrot z kapitału własnego",
            payback_period: "Okres zwrotu",
            payback_period_desc: "Lata do odzyskania inwestycji",
            cap_rate: "Cap Rate",
            cap_rate_desc: "Dochód netto / Cena zakupu",
            dscr: "Wskaźnik pokrycia zadłużenia",
            dscr_desc: "NOI / Roczna spłata długu",
            annual_cash_flow: "Roczny Cash Flow",
            annual_cash_flow_desc: "Roczny zysk netto",
            monthly_cash_flow: "Miesięczny Cash Flow",
            monthly_cash_flow_desc: "Średni miesięczny zysk",
            noi: "Dochód operacyjny netto",
            noi_desc: "Roczny dochód minus koszty operacyjne",
            year_10_equity: "Kapitał po 10 latach",
            year_10_equity_desc: "Szacowany kapitał po 10 latach",
        },
        hu: {
            overview: "Áttekintés",
            details: "Részletek",
            projections: "10 éves előrejelzések",
            // KPIs
            total_investment: "Teljes befektetés",
            total_investment_desc: "Vételár + összes kezdeti költség",
            roi: "10 éves ROI",
            roi_desc: "Teljes megtérülés 10 év után",
            cash_on_cash: "Cash-on-Cash hozam",
            cash_on_cash_desc: "Éves hozam a saját tőkéből",
            payback_period: "Megtérülési idő",
            payback_period_desc: "Évek a befektetés megtérüléséhez",
            cap_rate: "Cap Rate",
            cap_rate_desc: "Nettó jövedelem / Vételár",
            dscr: "Adósságszolgálati fedezet",
            dscr_desc: "NOI / Éves hiteltörlesztés",
            annual_cash_flow: "Éves Cash Flow",
            annual_cash_flow_desc: "Éves nettó profit",
            monthly_cash_flow: "Havi Cash Flow",
            monthly_cash_flow_desc: "Átlagos havi profit",
            noi: "Nettó működési jövedelem",
            noi_desc: "Éves bevétel mínusz működési költségek",
            year_10_equity: "Saját tőke 10 év után",
            year_10_equity_desc: "Becsült saját tőke 10 év után",
        },
        de: {
            overview: "Übersicht",
            details: "Details",
            projections: "10-Jahres-Prognosen",
            // KPIs
            total_investment: "Gesamtinvestition",
            total_investment_desc: "Kaufpreis + alle Anfangskosten",
            roi: "10-Jahres-ROI",
            roi_desc: "Gesamtrendite nach 10 Jahren",
            cash_on_cash: "Cash-on-Cash Rendite",
            cash_on_cash_desc: "Jährliche Rendite auf Eigenkapital",
            payback_period: "Amortisationszeit",
            payback_period_desc: "Jahre bis zur Rückzahlung der Investition",
            cap_rate: "Cap Rate",
            cap_rate_desc: "Nettoeinkommen / Kaufpreis",
            dscr: "Schuldendienstdeckungsgrad",
            dscr_desc: "NOI / Jährliche Schuldenzahlung",
            annual_cash_flow: "Jährlicher Cash Flow",
            annual_cash_flow_desc: "Jährlicher Nettogewinn",
            monthly_cash_flow: "Monatlicher Cash Flow",
            monthly_cash_flow_desc: "Durchschnittlicher monatlicher Gewinn",
            noi: "Nettobetriebseinkommen",
            noi_desc: "Jahreseinkommen minus Betriebskosten",
            year_10_equity: "Eigenkapital nach 10 Jahren",
            year_10_equity_desc: "Geschätztes Eigenkapital nach 10 Jahren",
        }
    };

    const t = translations[language] || translations.en;

    // Prepare chart data
    const cashFlowChartData = (results.cashFlowProjection || []).map(p => ({
        year: p.year,
        cashFlow: p.net_cash_flow
    }));

    return (
        <div className="space-y-6">
            <ResultsHeader 
                kpis={kpis} 
                currency={currency}
                currencySymbol={currencySymbol}
                language={language}
            />
            
            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">{t.overview}</TabsTrigger>
                    <TabsTrigger value="details">{t.details}</TabsTrigger>
                    <TabsTrigger value="projections">{t.projections}</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <KPICard
                            title={t.total_investment}
                            value={currencyFormatter(kpis.total_investment, currency, currencySymbol)}
                            description={t.total_investment_desc}
                        />
                        <KPICard
                            title={t.roi}
                            value={percentFormatter(kpis.roi_10_year, 1)}
                            description={t.roi_desc}
                        />
                        <KPICard
                            title={t.cash_on_cash}
                            value={percentFormatter(kpis.cash_on_cash_return, 2)}
                            description={t.cash_on_cash_desc}
                        />
                        <KPICard
                            title={t.payback_period}
                            value={kpis.payback_period && typeof kpis.payback_period === 'number' && kpis.payback_period !== Infinity ? 
                                `${kpis.payback_period.toFixed(1)} ${language === 'sk' ? 'rokov' : language === 'pl' ? 'lat' : language === 'hu' ? 'év' : language === 'de' ? 'Jahre' : 'years'}` : 'N/A'
                            }
                            description={t.payback_period_desc}
                        />
                        <KPICard
                            title={t.cap_rate}
                            value={percentFormatter(kpis.cap_rate, 2)}
                            description={t.cap_rate_desc}
                        />
                        <KPICard
                            title={t.dscr}
                            value={kpis.dscr && typeof kpis.dscr === 'number' ? kpis.dscr.toFixed(2) : 'N/A'}
                            description={t.dscr_desc}
                        />
                        <KPICard
                            title={t.annual_cash_flow}
                            value={currencyFormatter(kpis.annual_cash_flow, currency, currencySymbol)}
                            description={t.annual_cash_flow_desc}
                        />
                        <KPICard
                            title={t.monthly_cash_flow}
                            value={currencyFormatter(kpis.monthly_cash_flow, currency, currencySymbol)}
                            description={t.monthly_cash_flow_desc}
                        />
                        <KPICard
                            title={t.year_10_equity}
                            value={currencyFormatter(kpis.year_10_equity, currency, currencySymbol)}
                            description={t.year_10_equity_desc}
                        />
                    </div>
                </TabsContent>

                {/* Details Tab */}
                <TabsContent value="details" className="space-y-6 mt-6">
                    {results.expense_breakdown && results.expense_breakdown.length > 0 && (
                        <ExpenseBreakdownChart 
                            expenses={results.expense_breakdown} 
                            currency={currency} 
                            language={language} 
                        />
                    )}
                </TabsContent>

                {/* Projections Tab */}
                <TabsContent value="projections" className="space-y-6 mt-6">
                    {cashFlowChartData.length > 0 && (
                        <CashFlowChart 
                            data={cashFlowChartData} 
                            currency={currency} 
                            language={language} 
                        />
                    )}
                    {results.equityBuildup && results.equityBuildup.length > 0 && (
                        <EquityBuildupChart 
                            projections={results.equityBuildup} 
                            currency={currency} 
                            language={language} 
                        />
                    )}
                    {results.cashFlowProjection && results.cashFlowProjection.length > 0 && (
                        <CashFlowTable 
                            data={results.cashFlowProjection} 
                            currency={currency} 
                            currencySymbol={currencySymbol}
                            language={language}
                        />
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
