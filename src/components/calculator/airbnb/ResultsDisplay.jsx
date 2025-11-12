import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, CheckCircle } from 'lucide-react';
import { currencyFormatter, percentFormatter } from '../../lib/formatters';
import ResultsHeader from '../ResultsHeader';
import KPICard from '../shared/KPICard';
import CashFlowTable from '../shared/CashFlowTable';
import CashFlowChart from '../shared/CashFlowChart';
import EquityBuildupChart from '../shared/EquityBuildupChart';
import ExpenseBreakdownChart from '../shared/ExpenseBreakdownChart';
import ROIProgressionChart from '../shared/ROIProgressionChart';

export default function AirbnbResults({ results, currency = '€', language = 'en', holdingPeriod = 10 }) {
    if (!results || !results.kpis) return null;
    
    const { kpis, cashFlowProjection, expense_breakdown, equityBuildup } = results;
    const currencySymbol = currency === 'EUR' ? '€' : currency;

    const translations = {
        en: {
            airbnb_results: "Airbnb Investment Analysis Results",
            overview: "Overview",
            details: "Details",
            projections: "10-Year Projections",
            
            // Tax Analysis (NEW!)
            taxAnalysis: "Tax Analysis",
            taxStatus: "Tax Status",
            entityTypeFO: "Individual (FO)",
            entityTypePO: "Legal Entity (PO)",
            effectiveTaxRate: "Effective Tax Rate",
            taxableIncome: "Taxable Income",
            taxableIncomeDesc: "Income subject to taxation after deductions",
            annualIncomeTax: "Annual Income Tax",
            annualIncomeTaxDesc: "Tax liability on Airbnb income",
            depreciation: "Annual Depreciation",
            depreciationDesc: "Building depreciation (tax deductible)",
            interestDeduction: "Interest Deduction",
            interestDeductionDesc: "Mortgage interest (tax deductible)",
            taxBenefits: "Tax Benefits",
            taxBenefitFromInterest: "Benefit from Interest",
            taxBenefitFromDepreciation: "Benefit from Depreciation",
            totalTaxBenefit: "Total Tax Benefits",
            totalTaxBenefitDesc: "Total tax savings from deductions",
            beforeTax: "Before Tax",
            afterTax: "After Tax",
            cashFlowComparison: "Cash Flow Comparison",
            
            // KPIs
            totalInvestment: "Total Investment",
            totalInvestmentDesc: "Purchase price + furnishing + costs",
            
            roi: "10-Year ROI",
            roiDesc: "Total return after 10 years",
            roiWarning: "Below market average",
            
            roiAfterTax: "10-Year ROI (After Tax)",
            roiAfterTaxDesc: "Total return after taxes",
            
            cashOnCash: "Cash-on-Cash Return",
            cashOnCashDesc: "Annual return on equity (before tax)",
            cashOnCashWarning: "Low annual return",
            
            cashOnCashAfterTax: "Cash-on-Cash (After Tax)",
            cashOnCashAfterTaxDesc: "Annual return on equity after taxes",
            
            revPAN: "Revenue per Available Night",
            revPANDesc: "Daily revenue potential",
            
            capRate: "Cap Rate",
            capRateDesc: "Net income / Purchase price",
            capRateWarning: "Below typical cap rate",
            
            irr: "Internal Rate of Return",
            irrDesc: "Average annual return (before tax)",
            irrWarning: "Below typical IRR",
            
            irrAfterTax: "IRR (After Tax)",
            irrAfterTaxDesc: "Average annual return after taxes",
            
            dscr: "Debt Service Coverage",
            dscrDesc: "NOI / Annual debt payment",
            dscrWarning: "Below 1.25 - financing risk",
            
            occupancy: "Occupancy Rate",
            occupancyDesc: "Percentage of nights booked",
            
            nightsBooked: "Nights Booked Annually",
            nightsBookedDesc: "Based on occupancy rate",
            
            grossRevenue: "Gross Annual Revenue",
            grossRevenueDesc: "Total income before fees",
            
            netRevenue: "Net Annual Revenue",
            netRevenueDesc: "After platform fees",
            
            annualCashFlow: "Annual Cash Flow",
            annualCashFlowDesc: "Net cash flow (before tax)",
            
            monthlyCashFlow: "Monthly Cash Flow",
            monthlyCashFlowDesc: "Average monthly profit",
            
            grossYield: "Gross Yield",
            grossYieldDesc: "Gross revenue / Purchase price",
            
            netYield: "Net Yield",
            netYieldDesc: "NOI / Purchase price",
            
            airbnbPremium: "Airbnb Premium vs Long-Term",
            airbnbPremiumDesc: "Extra income vs traditional rental",
            
            breakEvenOccupancy: "Break-Even Occupancy",
            breakEvenOccupancyDesc: "Minimum occupancy to cover costs",
        },
        sk: {
            airbnb_results: "Výsledky analýzy Airbnb investície",
            overview: "Prehľad",
            details: "Detaily",
            projections: "10-ročné projekcie",
            
            // Tax Analysis (NEW!)
            taxAnalysis: "Daňová analýza",
            taxStatus: "Daňový status",
            entityTypeFO: "Fyzická osoba (FO)",
            entityTypePO: "Právnická osoba (PO)",
            effectiveTaxRate: "Efektívna daňová sadzba",
            taxableIncome: "Zdaniteľný príjem",
            taxableIncomeDesc: "Príjem podliehajúci zdaneniu po odpočtoch",
            annualIncomeTax: "Ročná daň z príjmu",
            annualIncomeTaxDesc: "Daňová povinnosť z príjmov z Airbnb",
            depreciation: "Ročné odpisy",
            depreciationDesc: "Odpisy budovy (daňovo odpočítateľné)",
            interestDeduction: "Odpočet úrokov",
            interestDeductionDesc: "Úroky z hypotéky (daňovo odpočítateľné)",
            taxBenefits: "Daňové benefity",
            taxBenefitFromInterest: "Benefit z úrokov",
            taxBenefitFromDepreciation: "Benefit z odpisov",
            totalTaxBenefit: "Celkové daňové benefity",
            totalTaxBenefitDesc: "Celkové daňové úspory z odpočtov",
            beforeTax: "Pred zdanením",
            afterTax: "Po zdanení",
            cashFlowComparison: "Porovnanie Cash Flow",
            
            // KPIs
            totalInvestment: "Celková investícia",
            totalInvestmentDesc: "Kúpna cena + zariadenie + náklady",
            
            roi: "10-ročné ROI",
            roiDesc: "Celková návratnosť po 10 rokoch",
            roiWarning: "Pod priemerom trhu",
            
            roiAfterTax: "10-ročné ROI (Po zdanení)",
            roiAfterTaxDesc: "Celková návratnosť po zdanení",
            
            cashOnCash: "Cash-on-Cash návratnosť",
            cashOnCashDesc: "Ročná návratnosť vlastného kapitálu (pred zdanením)",
            cashOnCashWarning: "Nízka ročná návratnosť",
            
            cashOnCashAfterTax: "Cash-on-Cash (Po zdanení)",
            cashOnCashAfterTaxDesc: "Ročná návratnosť vlastného kapitálu po zdanení",
            
            revPAN: "Príjem na dostupnú noc",
            revPANDesc: "Denný príjmový potenciál",
            
            capRate: "Cap Rate",
            capRateDesc: "Čistý príjem / Kúpna cena",
            capRateWarning: "Pod typickým cap rate",
            
            irr: "Vnútorná miera návratnosti",
            irrDesc: "Priemerná ročná návratnosť (pred zdanením)",
            irrWarning: "Pod typickým IRR",
            
            irrAfterTax: "IRR (Po zdanení)",
            irrAfterTaxDesc: "Priemerná ročná návratnosť po zdanení",
            
            dscr: "Pokrytie dlhovej služby",
            dscrDesc: "NOI / Ročná splátka dlhu",
            dscrWarning: "Pod 1.25 - riziko financovania",
            
            occupancy: "Miera obsadenosti",
            occupancyDesc: "Percento obsadených nocí",
            
            nightsBooked: "Obsadené noci ročne",
            nightsBookedDesc: "Na základe miery obsadenosti",
            
            grossRevenue: "Hrubé ročné tržby",
            grossRevenueDesc: "Celkový príjem pred poplatkami",
            
            netRevenue: "Čisté ročné tržby",
            netRevenueDesc: "Po poplatku platforme",
            
            annualCashFlow: "Ročný Cash Flow",
            annualCashFlowDesc: "Čistý cash flow (pred zdanením)",
            
            monthlyCashFlow: "Mesačný Cash Flow",
            monthlyCashFlowDesc: "Priemerný mesačný zisk",
            
            grossYield: "Hrubý výnos",
            grossYieldDesc: "Hrubé tržby / Kúpna cena",
            
            netYield: "Čistý výnos",
            netYieldDesc: "NOI / Kúpna cena",
            
            airbnbPremium: "Airbnb prémia vs dlhodobý prenájom",
            airbnbPremiumDesc: "Nadpríjem oproti tradičnému prenájmu",
            
            breakEvenOccupancy: "Bod zvratu - obsadenosť",
            breakEvenOccupancyDesc: "Minimálna obsadenosť na pokrytie nákladov",
        }
    };

    const t = translations[language] || translations.en;

    // Prepare data for charts
    const cashFlowChartData = (cashFlowProjection || []).map(p => ({
        year: p.year,
        cashFlow: p.net_cash_flow
    }));

    const roiProgressionData = (cashFlowProjection || []).map(p => ({
        year: p.year,
        roi: p.cumulative_roi
    }));

    // Helper functions for status
    const getROIStatus = (roi) => {
        if (roi < 50) return 'warning';
        if (roi > 150) return 'excellent';
        if (roi > 100) return 'good';
        return 'neutral';
    };

    const getCashOnCashStatus = (coc) => {
        if (coc < 6) return 'warning';
        if (coc > 15) return 'excellent';
        if (coc > 10) return 'good';
        return 'neutral';
    };

    const getCapRateStatus = (capRate) => {
        if (capRate < 5) return 'warning';
        if (capRate > 10) return 'excellent';
        if (capRate > 7) return 'good';
        return 'neutral';
    };

    const getDSCRStatus = (dscr) => {
        if (dscr < 1.25) return 'warning';
        if (dscr > 2.0) return 'excellent';
        if (dscr > 1.5) return 'good';
        return 'neutral';
    };

    return (
        <Card className="bg-card">
            <ResultsHeader 
                title={t.airbnb_results}
            />
            <CardContent className="p-3 sm:p-6">
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                        <TabsTrigger value="overview">{t.overview}</TabsTrigger>
                        <TabsTrigger value="details">{t.details}</TabsTrigger>
                        <TabsTrigger value="projections">{t.projections}</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-4 sm:space-y-6">
                        {/* TAX ANALYSIS SECTION (NEW!) */}
                        {kpis.effective_tax_rate !== undefined && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    {t.taxAnalysis}
                                </h3>
                                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                    {/* Entity Type Badge */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <CheckCircle className="w-5 h-5 text-amber-600" />
                                        <span className="font-semibold text-amber-800">
                                            {kpis.entity_type === 'PO' ? t.entityTypePO : t.entityTypeFO}
                                        </span>
                                        <span className="text-sm text-gray-600">
                                            ({t.effectiveTaxRate}: {percentFormatter(kpis.effective_tax_rate)})
                                        </span>
                                    </div>
                                    
                                    {/* Tax Calculation Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <KPICard
                                            title={t.depreciation}
                                            value={currencyFormatter(kpis.annual_depreciation, currency, currencySymbol, 0)}
                                            description={t.depreciationDesc}
                                        />
                                        <KPICard
                                            title={t.interestDeduction}
                                            value={currencyFormatter(kpis.annual_interest_deduction, currency, currencySymbol, 0)}
                                            description={t.interestDeductionDesc}
                                        />
                                        <KPICard
                                            title={t.taxableIncome}
                                            value={currencyFormatter(kpis.taxable_income, currency, currencySymbol, 0)}
                                            description={t.taxableIncomeDesc}
                                        />
                                        <KPICard
                                            title={t.annualIncomeTax}
                                            value={currencyFormatter(kpis.annual_income_tax, currency, currencySymbol, 0)}
                                            description={t.annualIncomeTaxDesc}
                                            status="warning"
                                        />
                                    </div>
                                    
                                    {/* Tax Benefits Box */}
                                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200 mb-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-sm font-semibold text-orange-800">
                                                💰 {t.taxBenefits}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 mb-3">
                                            <div className="text-sm">
                                                <span className="text-gray-600">{t.taxBenefitFromInterest}:</span>
                                                <div className="font-bold text-green-600">
                                                    {currencyFormatter(kpis.tax_benefit_from_interest, currency, currencySymbol, 0)}
                                                </div>
                                            </div>
                                            <div className="text-sm">
                                                <span className="text-gray-600">{t.taxBenefitFromDepreciation}:</span>
                                                <div className="font-bold text-green-600">
                                                    {currencyFormatter(kpis.tax_benefit_from_depreciation, currency, currencySymbol, 0)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="pt-3 border-t border-orange-200 text-center">
                                            <span className="text-sm text-gray-600">{t.totalTaxBenefit}: </span>
                                            <span className="text-lg font-bold text-green-600">
                                                {currencyFormatter(kpis.total_tax_benefit, currency, currencySymbol, 0)}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Before/After Tax Comparison */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-200">
                                            <div className="text-xs text-blue-600 mb-1">{t.beforeTax}</div>
                                            <div className="text-xl font-bold text-blue-900">
                                                {currencyFormatter(kpis.annual_cash_flow, currency, currencySymbol, 0)}
                                            </div>
                                            <div className="text-xs text-blue-600 mt-1">{t.annualCashFlowDesc}</div>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                                            <div className="text-xs text-green-600 mb-1">{t.afterTax}</div>
                                            <div className="text-xl font-bold text-green-900">
                                                {currencyFormatter(kpis.annual_cash_flow_after_tax, currency, currencySymbol, 0)}
                                            </div>
                                            <div className="text-xs text-green-600 mt-1">{t.annualCashFlowDesc}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Key Performance Indicators - UPDATED with After Tax Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <KPICard
                                title={t.totalInvestment}
                                value={currencyFormatter(kpis.total_investment, currency, currencySymbol, 0)}
                                description={t.totalInvestmentDesc}
                            />
                            
                            {/* ROI - Show both */}
                            <KPICard
                                title={t.roi}
                                value={percentFormatter(kpis.roi_10_year, 1)}
                                description={t.roiDesc}
                                warning={getROIStatus(kpis.roi_10_year) === 'warning' ? t.roiWarning : null}
                                excellent={getROIStatus(kpis.roi_10_year) === 'excellent'}
                                good={getROIStatus(kpis.roi_10_year) === 'good'}
                            />
                            {kpis.roi_10_year_after_tax !== undefined && (
                                <KPICard
                                    title={t.roiAfterTax}
                                    value={percentFormatter(kpis.roi_10_year_after_tax, 1)}
                                    description={t.roiAfterTaxDesc}
                                    status={getROIStatus(kpis.roi_10_year_after_tax)}
                                />
                            )}
                            
                            {/* Cash-on-Cash - Show both */}
                            <KPICard
                                title={t.cashOnCash}
                                value={percentFormatter(kpis.cash_on_cash_return, 2)}
                                description={t.cashOnCashDesc}
                                warning={getCashOnCashStatus(kpis.cash_on_cash_return) === 'warning' ? t.cashOnCashWarning : null}
                                excellent={getCashOnCashStatus(kpis.cash_on_cash_return) === 'excellent'}
                                good={getCashOnCashStatus(kpis.cash_on_cash_return) === 'good'}
                            />
                            {kpis.cash_on_cash_return_after_tax !== undefined && (
                                <KPICard
                                    title={t.cashOnCashAfterTax}
                                    value={percentFormatter(kpis.cash_on_cash_return_after_tax, 2)}
                                    description={t.cashOnCashAfterTaxDesc}
                                    status={getCashOnCashStatus(kpis.cash_on_cash_return_after_tax)}
                                />
                            )}
                            
                            {/* IRR - Show both */}
                            <KPICard
                                title={t.irr}
                                value={percentFormatter(kpis.irr, 2)}
                                description={t.irrDesc}
                                warning={kpis.irr < 10 ? t.irrWarning : null}
                                excellent={kpis.irr > 18}
                                good={kpis.irr > 12}
                            />
                            {kpis.irr_after_tax !== undefined && (
                                <KPICard
                                    title={t.irrAfterTax}
                                    value={percentFormatter(kpis.irr_after_tax, 2)}
                                    description={t.irrAfterTaxDesc}
                                    warning={kpis.irr_after_tax < 10 ? t.irrWarning : null}
                                    excellent={kpis.irr_after_tax > 18}
                                    good={kpis.irr_after_tax > 12}
                                />
                            )}
                            
                            <KPICard
                                title={t.revPAN}
                                value={currencyFormatter(kpis.revPAN, currency, currencySymbol, 0)}
                                description={t.revPANDesc}
                            />
                            
                            <KPICard
                                title={t.capRate}
                                value={percentFormatter(kpis.cap_rate, 2)}
                                description={t.capRateDesc}
                                warning={getCapRateStatus(kpis.cap_rate) === 'warning' ? t.capRateWarning : null}
                                excellent={getCapRateStatus(kpis.cap_rate) === 'excellent'}
                                good={getCapRateStatus(kpis.cap_rate) === 'good'}
                            />
                            
                            <KPICard
                                title={t.dscr}
                                value={kpis.dscr ? kpis.dscr.toFixed(2) : 'N/A'}
                                description={t.dscrDesc}
                                warning={getDSCRStatus(kpis.dscr) === 'warning' ? t.dscrWarning : null}
                                excellent={getDSCRStatus(kpis.dscr) === 'excellent'}
                                good={getDSCRStatus(kpis.dscr) === 'good'}
                            />
                            
                            <KPICard
                                title={t.occupancy}
                                value={percentFormatter(kpis.occupancy_rate, 1)}
                                description={t.occupancyDesc}
                            />
                            
                            <KPICard
                                title={t.nightsBooked}
                                value={Math.round(kpis.nights_booked)}
                                description={t.nightsBookedDesc}
                            />
                            
                            <KPICard
                                title={t.grossRevenue}
                                value={currencyFormatter(kpis.gross_annual_revenue, currency, currencySymbol, 0)}
                                description={t.grossRevenueDesc}
                            />
                            
                            <KPICard
                                title={t.netRevenue}
                                value={currencyFormatter(kpis.net_annual_revenue, currency, currencySymbol, 0)}
                                description={t.netRevenueDesc}
                            />
                            
                            <KPICard
                                title={t.grossYield}
                                value={percentFormatter(kpis.gross_yield, 2)}
                                description={t.grossYieldDesc}
                            />
                            
                            <KPICard
                                title={t.netYield}
                                value={percentFormatter(kpis.net_yield, 2)}
                                description={t.netYieldDesc}
                            />
                            
                            <KPICard
                                title={t.airbnbPremium}
                                value={percentFormatter(kpis.airbnb_premium, 1)}
                                description={t.airbnbPremiumDesc}
                                excellent={kpis.airbnb_premium > 50}
                                good={kpis.airbnb_premium > 30}
                            />
                            
                            <KPICard
                                title={t.breakEvenOccupancy}
                                value={percentFormatter(kpis.break_even_occupancy, 1)}
                                description={t.breakEvenOccupancyDesc}
                                excellent={kpis.break_even_occupancy < 40}
                                good={kpis.break_even_occupancy < 50}
                                warning={kpis.break_even_occupancy > 60 ? 'High break-even point' : null}
                            />
                        </div>
                    </TabsContent>

                    {/* Details Tab */}
                    <TabsContent value="details" className="space-y-6 mt-6">
                        <ExpenseBreakdownChart 
                            expenses={expense_breakdown || []} 
                            currency={currency} 
                            language={language} 
                        />
                    </TabsContent>

                    {/* Projections Tab */}
                    <TabsContent value="projections" className="space-y-6 mt-6">
                        <CashFlowChart 
                            data={cashFlowChartData} 
                            currency={currency} 
                            language={language} 
                        />
                        <ROIProgressionChart 
                            data={roiProgressionData} 
                            language={language} 
                        />
                        <EquityBuildupChart 
                            projections={equityBuildup || []} 
                            currency={currency} 
                            language={language} 
                        />
                        <CashFlowTable 
                            data={cashFlowProjection || []} 
                            currency={currency} 
                            currencySymbol={currencySymbol}
                            language={language}
                        />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}