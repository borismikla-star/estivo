
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { currencyFormatter, percentFormatter } from '../../lib/formatters';
import ResultsHeader from '../ResultsHeader';
import KPICard from '../shared/KPICard';
import CashFlowTable from '../shared/CashFlowTable';
import CashFlowChart from '../shared/CashFlowChart';
import EquityBuildupChart from '../shared/EquityBuildupChart';
import ExpenseBreakdownChart from '../shared/ExpenseBreakdownChart';
import ROIProgressionChart from '../shared/ROIProgressionChart';

export default function CommercialResults({ results, currency = 'EUR', language = 'en', holdingPeriod = 10 }) {
    if (!results || !results.kpis) return null;
    
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
            cap_rate: "Cap Rate",
            cap_rate_desc: "Net income / Purchase price",
            npv: "Net Present Value",
            npv_desc: "Discounted future cash flows",
            irr: "Internal Rate of Return",
            irr_desc: "Average annual return",
            dscr: "Debt Service Coverage",
            dscr_desc: "NOI / Annual debt payment",
            annual_cash_flow: "Annual Cash Flow",
            annual_cash_flow_desc: "Net operating income after debt service",
            noi: "Net Operating Income",
            noi_desc: "Annual income minus operating expenses",
            monthly_cash_flow: "Monthly Cash Flow",
            monthly_cash_flow_desc: "Average monthly profit",
            of_total: "of total", // For expense breakdown
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
            cap_rate: "Cap Rate",
            cap_rate_desc: "Čistý príjem / Kúpna cena",
            npv: "Čistá súčasná hodnota",
            npv_desc: "Diskontované budúce cash flow",
            irr: "Vnútorná miera návratnosti",
            irr_desc: "Priemerná ročná návratnosť",
            dscr: "Pokrytie dlhovej služby",
            dscr_desc: "NOI / Ročná splátka dlhu",
            annual_cash_flow: "Ročný Cash Flow",
            annual_cash_flow_desc: "Čistý prevádzkový príjem po splátkach úveru",
            noi: "Čistý prevádzkový príjem",
            noi_desc: "Ročný príjem mínus prevádzkové náklady",
            monthly_cash_flow: "Mesačný Cash Flow",
            monthly_cash_flow_desc: "Priemerný mesačný zisk",
            of_total: "z celku", // For expense breakdown
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
            cap_rate: "Cap Rate",
            cap_rate_desc: "Dochód netto / Cena zakupu",
            npv: "Wartość bieżąca netto",
            npv_desc: "Zdyskontowane przyszłe przepływy pieniężne",
            irr: "Wewnętrzna stopa zwrotu",
            irr_desc: "Średni roczny zwrot",
            dscr: "Wskaźnik pokrycia zadłużenia",
            dscr_desc: "NOI / Roczna spłata długu",
            annual_cash_flow: "Roczny Cash Flow",
            annual_cash_flow_desc: "Dochód operacyjny netto po obsłudze długu",
            noi: "Dochód operacyjny netto",
            noi_desc: "Roczny dochód minus koszty operacyjne",
            monthly_cash_flow: "Miesięczny Cash Flow",
            monthly_cash_flow_desc: "Średni miesięczny zysk",
            of_total: "z całości", // For expense breakdown
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
            cap_rate: "Cap Rate",
            cap_rate_desc: "Nettó jövedelem / Vételár",
            npv: "Nettó jelenérték",
            npv_desc: "Diszkontált jövőbeli cash flow-k",
            irr: "Belső megtérülési ráta",
            irr_desc: "Átlagos éves megtérülés",
            dscr: "Adósságszolgálati fedezet",
            dscr_desc: "NOI / Éves hiteltörlesztés",
            annual_cash_flow: "Éves Cash Flow",
            annual_cash_flow_desc: "Nettó működési jövedelem hiteltörlesztés után",
            noi: "Nettó működési jövedelem",
            noi_desc: "Éves bevétel mínusz működési költségek",
            monthly_cash_flow: "Havi Cash Flow",
            monthly_cash_flow_desc: "Átlagos havi profit",
            of_total: "összesen", // For expense breakdown
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
            cap_rate: "Cap Rate",
            cap_rate_desc: "Nettoeinkommen / Kaufpreis",
            npv: "Nettobarwert",
            npv_desc: "Diskontierte zukünftige Cashflows",
            irr: "Interner Zinsfuß",
            irr_desc: "Durchschnittliche jährliche Rendite",
            dscr: "Schuldendienstdeckungsgrad",
            dscr_desc: "NOI / Jährliche Schuldenzahlung",
            annual_cash_flow: "Jährlicher Cash Flow",
            annual_cash_flow_desc: "Nettobetriebseinkommen nach Schuldendienst",
            noi: "Nettobetriebseinkommen",
            noi_desc: "Jahreseinkommen minus Betriebskosten",
            monthly_cash_flow: "Monatlicher Cash Flow",
            monthly_cash_flow_desc: "Durchschnittlicher monatlicher Gewinn",
            of_total: "des Gesamtbetrags", // For expense breakdown
        }
    };

    const t = translations[language] || translations.en;

    const expenseData = [
        { name: 'Property Tax', value: kpis.annual_property_tax || 0 },
        { name: 'Insurance', value: kpis.annual_insurance || 0 },
        { name: 'Maintenance', value: kpis.annual_maintenance || 0 },
        { name: 'Management', value: kpis.annual_management_fee || 0 },
        { name: 'Utilities', value: (kpis.annual_utilities_cost || 0) + (kpis.annual_other_opex || 0) },
    ].filter(item => item.value > 0);

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
                            value={currencyFormatter(kpis.total_investment, currency, currencySymbol, 0)}
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
                            title={t.cap_rate}
                            value={percentFormatter(kpis.cap_rate, 2)}
                            description={t.cap_rate_desc}
                        />
                        <KPICard
                            title={t.npv}
                            value={currencyFormatter(kpis.npv, currency, currencySymbol, 0)}
                            description={t.npv_desc}
                        />
                        <KPICard
                            title={t.irr}
                            value={percentFormatter(kpis.irr, 2)}
                            description={t.irr_desc}
                        />
                        <KPICard
                            title={t.dscr}
                            value={kpis.dscr ? kpis.dscr.toFixed(2) : 'N/A'}
                            description={t.dscr_desc}
                        />
                        <KPICard
                            title={t.annual_cash_flow}
                            value={currencyFormatter(kpis.annual_cash_flow, currency, currencySymbol, 0)}
                            description={t.annual_cash_flow_desc}
                        />
                        <KPICard
                            title={t.noi}
                            value={currencyFormatter(kpis.net_operating_income, currency, currencySymbol, 0)}
                            description={t.noi_desc}
                        />
                    </div>
                </TabsContent>

                {/* Details Tab */}
                <TabsContent value="details" className="space-y-6 mt-6">
                    <ExpenseBreakdownChart expenses={expenseData} currency={currency} language={language} />
                </TabsContent>

                {/* Projections Tab */}
                <TabsContent value="projections" className="space-y-6 mt-6">
                    <CashFlowChart projections={results.cashFlowProjection || []} currency={currency} language={language} />
                    <EquityBuildupChart projections={results.equityBuildup || []} currency={currency} language={language} />
                    <CashFlowTable 
                        data={results.cashFlowProjection || []} 
                        currency={currency} 
                        currencySymbol={currencySymbol}
                        language={language}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
