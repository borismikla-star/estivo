import React from 'react';
import { currencyFormatter, percentFormatter } from '../lib/formatters';

const Section = ({ title, children }) => (
    <div className="mb-6">
        <h2 className="text-xl font-bold border-b-2 border-gray-800 pb-1 mb-3 text-gray-800">{title}</h2>
        {children}
    </div>
);

const KeyValue = ({ label, value, isBold = false }) => (
    <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
        <span className="text-gray-600">{label}</span>
        <span className={`text-gray-900 ${isBold ? 'font-bold' : ''}`}>{value}</span>
    </div>
);

const Table = ({ headers, rows }) => (
    <table className="w-full border-collapse mb-4">
        <thead>
            <tr className="bg-gray-100">
                {headers.map((header, idx) => (
                    <th key={idx} className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700">
                        {header}
                    </th>
                ))}
            </tr>
        </thead>
        <tbody>
            {rows.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {row.map((cell, cellIdx) => (
                        <td key={cellIdx} className="border border-gray-300 px-3 py-2 text-sm text-gray-800">
                            {cell}
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    </table>
);

export default function PDFReport({ projectData, results, language, user }) {
    if (!projectData || !results) return null;

    const { kpis, cost_breakdown, revenue_breakdown } = results;
    const { name, type, country, property_data } = projectData;

    const t = {
        en: {
            reportTitle: "Investment Analysis Report",
            projectInfo: "Project Information",
            projectName: "Project Name",
            projectType: "Project Type",
            country: "Country",
            keyMetrics: "Key Financial Metrics",
            
            // General metrics (long_term_lease, commercial, airbnb)
            totalInvestment: "Total Investment",
            downPayment: "Down Payment",
            loanAmount: "Loan Amount",
            roi: "Return on Investment (ROI)",
            irr: "Internal Rate of Return (IRR)",
            npv: "Net Present Value (NPV)",
            payback: "Payback Period",
            cashOnCash: "Cash-on-Cash Return",
            capRate: "Cap Rate",
            dscr: "DSCR",
            grossYield: "Gross Yield",
            netYield: "Net Yield",
            monthlyCashFlow: "Avg. Monthly Cash Flow",
            annualCashFlow: "Avg. Annual Cash Flow",
            propertyDetails: "Property & Income",
            purchasePrice: "Purchase Price",
            monthlyRent: "Monthly Rent",
            annualRent: "Annual Rent",
            noi: "Net Operating Income",
            
            // Development-specific metrics
            developmentMetrics: "Development Metrics",
            totalProjectCosts: "Total Project Costs",
            ownResources: "Own Resources",
            bankResources: "Bank Resources",
            financingCosts: "Financing Costs",
            grossRevenue: "Gross Revenue",
            netRevenue: "Net Revenue",
            grossProfit: "Gross Profit",
            netProfit: "Net Profit",
            profitMargin: "Profit Margin",
            developerMargin: "Developer's Margin",
            returnOnCost: "Return on Cost (ROC)",
            equityMultiple: "Equity Multiple",
            annualizedReturn: "Annualized Return",
            projectDuration: "Project Duration",
            costPerM2: "Cost per m²",
            revenuePerM2: "Revenue per m²",
            profitPerM2: "Profit per m²",
            breakEven: "Break-Even Revenue",
            breakEvenPct: "Break-Even %",
            projectAreas: "Project Areas",
            totalGFA: "Total GFA",
            totalNFA: "Total NFA",
            totalSalesArea: "Total Sales Area",
            
            // NEW: Breakdown sections
            costBreakdown: "Cost Breakdown",
            revenueBreakdown: "Revenue Breakdown",
            cashFlowTimeline: "Cash Flow Timeline",
            vatAnalysis: "VAT Analysis",
            item: "Item",
            amount: "Amount",
            percentage: "Percentage",
            period: "Period",
            costs: "Costs",
            revenue: "Revenue",
            cumulative: "Cumulative",
            months: "months",
            vatInput: "VAT Input",
            vatOutput: "VAT Output",
            vatBalance: "VAT Balance",
            netProfitAfterVAT: "Net Profit after VAT",
        },
        sk: {
            reportTitle: "Správa o investičnej analýze",
            projectInfo: "Informácie o projekte",
            projectName: "Názov projektu",
            projectType: "Typ projektu",
            country: "Krajina",
            keyMetrics: "Kľúčové finančné ukazovatele",
            
            // General metrics
            totalInvestment: "Celková investícia",
            downPayment: "Vlastné zdroje",
            loanAmount: "Výška úveru",
            roi: "Návratnosť investície (ROI)",
            irr: "Vnútorná miera návratnosti (IRR)",
            npv: "Čistá súčasná hodnota (NPV)",
            payback: "Doba návratnosti",
            cashOnCash: "Návratnosť vlastného kapitálu",
            capRate: "Cap Rate",
            dscr: "DSCR",
            grossYield: "Hrubý výnos",
            netYield: "Čistý výnos",
            monthlyCashFlow: "Priem. mesačný Cash Flow",
            annualCashFlow: "Priem. ročný Cash Flow",
            propertyDetails: "Nehnuteľnosť a príjem",
            purchasePrice: "Kúpna cena",
            monthlyRent: "Mesačný nájom",
            annualRent: "Ročný nájom",
            noi: "Čistý prevádzkový príjem",
            
            // Development-specific
            developmentMetrics: "Ukazovatele developmentu",
            totalProjectCosts: "Celkové náklady projektu",
            ownResources: "Vlastné zdroje",
            bankResources: "Bankové zdroje",
            financingCosts: "Náklady na financovanie",
            grossRevenue: "Hrubé tržby",
            netRevenue: "Čisté tržby",
            grossProfit: "Hrubý zisk",
            netProfit: "Čistý zisk",
            profitMargin: "Zisková marža",
            developerMargin: "Marža developera",
            returnOnCost: "Návratnosť nákladov (ROC)",
            equityMultiple: "Násobok kapitálu",
            annualizedReturn: "Ročná návratnosť",
            projectDuration: "Trvanie projektu",
            costPerM2: "Náklady/m²",
            revenuePerM2: "Príjem/m²",
            profitPerM2: "Zisk/m²",
            breakEven: "Bod zvratu - tržby",
            breakEvenPct: "Bod zvratu %",
            projectAreas: "Plochy projektu",
            totalGFA: "Celková HPP",
            totalNFA: "Celková ČÚP",
            totalSalesArea: "Celková predajná plocha",
            
            // NEW: Breakdown sections
            costBreakdown: "Rozloženie nákladov",
            revenueBreakdown: "Rozloženie príjmov",
            cashFlowTimeline: "Časová os Cash Flow",
            vatAnalysis: "Analýza DPH",
            item: "Položka",
            amount: "Suma",
            percentage: "Podiel",
            period: "Obdobie",
            costs: "Náklady",
            revenue: "Príjmy",
            cumulative: "Kumulatívne",
            months: "mesiacov",
            vatInput: "DPH na vstupe",
            vatOutput: "DPH na výstupe",
            vatBalance: "Saldo DPH",
            netProfitAfterVAT: "Čistý zisk po DPH",
        }
    };
    const currentT = t[language] || t.en;
    
    const formatPaybackPeriod = (value) => {
        if (typeof value === 'string') return value;
        if (typeof value === 'number') return `${value.toFixed(1)} years`;
        return 'N/A';
    };
    
    const formatDuration = (months) => {
        if (months === undefined || months === null) return 'N/A';
        const years = (months / 12).toFixed(1);
        return `${months} ${currentT.months} (${years} years)`;
    };
    
    // Determine if this is a development project
    const isDevelopment = type === 'development';
    
    // Generate simplified cash flow data for development
    const generateCashFlowData = () => {
        if (!isDevelopment || !kpis.total_project_costs || !kpis.gross_revenue) return null;
        
        const totalCosts = kpis.total_project_costs;
        const totalRevenue = kpis.gross_revenue;
        
        return [
            { period: '1-6 ' + currentT.months, costs: -totalCosts * 0.3, revenue: 0, cumulative: -totalCosts * 0.3 },
            { period: '7-12 ' + currentT.months, costs: -totalCosts * 0.4, revenue: totalRevenue * 0.2, cumulative: -totalCosts * 0.7 + totalRevenue * 0.2 },
            { period: '13-18 ' + currentT.months, costs: -totalCosts * 0.2, revenue: totalRevenue * 0.4, cumulative: -totalCosts * 0.9 + totalRevenue * 0.6 },
            { period: '19-24 ' + currentT.months, costs: -totalCosts * 0.1, revenue: totalRevenue * 0.4, cumulative: kpis.gross_profit || 0 }
        ];
    };
    
    const cashFlowData = generateCashFlowData();
    
    // This component is only for printing - CRITICAL: Add print-container class
    return (
        <div className="hidden print:block print-container p-8 font-sans bg-white">
            <header className="mb-8 text-center">
                 {user?.entity_type === 'PO' && user.company_logo_url ? (
                    <img src={user.company_logo_url} alt="Company Logo" className="h-16 w-auto max-w-xs mx-auto mb-4 object-contain" />
                 ) : (
                    <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68d666dadfd2546479ace4c8/478578f70_logo_transp120x40.png" alt="Estivo Logo" className="h-10 mx-auto mb-4" />
                 )}
                <h1 className="text-3xl font-bold text-gray-800">{currentT.reportTitle}</h1>
                <p className="text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
            </header>

            <main>
                <Section title={currentT.projectInfo}>
                    <KeyValue label={currentT.projectName} value={name} />
                    <KeyValue label={currentT.projectType} value={type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} />
                    <KeyValue label={currentT.country} value={country} />
                </Section>
                
                {isDevelopment ? (
                    /* DEVELOPMENT PROJECT */
                    <>
                        <Section title={currentT.developmentMetrics}>
                            <div className="grid grid-cols-2 gap-x-12">
                                <KeyValue label={currentT.totalProjectCosts} value={currencyFormatter(kpis.total_project_costs || 0)} isBold />
                                <KeyValue label={currentT.grossRevenue} value={currencyFormatter(kpis.gross_revenue || 0)} isBold />
                                
                                <KeyValue label={currentT.grossProfit} value={currencyFormatter(kpis.gross_profit || 0)} isBold />
                                <KeyValue label={currentT.profitMargin} value={percentFormatter(kpis.profit_margin || 0)} isBold />
                                
                                <KeyValue label={currentT.developerMargin} value={percentFormatter(kpis.developer_margin || 0)} />
                                <KeyValue label={currentT.returnOnCost} value={percentFormatter(kpis.return_on_cost || 0)} />
                                
                                <KeyValue label={currentT.equityMultiple} value={`${(kpis.equity_multiple || 0).toFixed(2)}x`} />
                                <KeyValue label={currentT.irr} value={percentFormatter(kpis.irr || 0)} />
                                
                                <KeyValue label={currentT.annualizedReturn} value={percentFormatter(kpis.annualized_return || 0)} />
                                <KeyValue label={currentT.projectDuration} value={formatDuration(kpis.project_duration_months)} />
                            </div>
                        </Section>

                        <Section title={currentT.keyMetrics}>
                            <div className="grid grid-cols-2 gap-x-12">
                                <KeyValue label={currentT.ownResources} value={currencyFormatter(kpis.own_resources || 0)} />
                                <KeyValue label={currentT.bankResources} value={currencyFormatter(kpis.bank_resources || 0)} />
                                
                                <KeyValue label={currentT.financingCosts} value={currencyFormatter(kpis.total_financing_costs || 0)} />
                                <KeyValue label={currentT.netRevenue} value={currencyFormatter(kpis.net_revenue || 0)} />
                                
                                <KeyValue label={currentT.costPerM2} value={currencyFormatter(kpis.cost_per_m2 || 0)} />
                                <KeyValue label={currentT.revenuePerM2} value={currencyFormatter(kpis.revenue_per_m2 || 0)} />
                                
                                <KeyValue label={currentT.profitPerM2} value={currencyFormatter(kpis.profit_per_m2 || 0)} />
                                <KeyValue label={currentT.breakEven} value={currencyFormatter(kpis.break_even_revenue || 0)} />
                                
                                <KeyValue label={currentT.breakEvenPct} value={percentFormatter(kpis.break_even_percentage || 0)} />
                            </div>
                        </Section>

                        <Section title={currentT.projectAreas}>
                            <div className="grid grid-cols-2 gap-x-12">
                                <KeyValue label={currentT.totalGFA} value={`${(kpis.total_gfa || 0).toLocaleString()} m²`} />
                                <KeyValue label={currentT.totalNFA} value={`${(kpis.total_nfa || 0).toLocaleString()} m²`} />
                                <KeyValue label={currentT.totalSalesArea} value={`${(kpis.total_sales_area || 0).toLocaleString()} m²`} />
                            </div>
                        </Section>

                        {/* NEW: Cost Breakdown Table */}
                        {cost_breakdown && cost_breakdown.length > 0 && (
                            <Section title={currentT.costBreakdown}>
                                <Table 
                                    headers={[currentT.item, currentT.amount, currentT.percentage]}
                                    rows={cost_breakdown.map(item => [
                                        item.name,
                                        currencyFormatter(item.value),
                                        `${item.percentage}%`
                                    ])}
                                />
                            </Section>
                        )}

                        {/* NEW: Revenue Breakdown Table */}
                        {revenue_breakdown && revenue_breakdown.length > 0 && (
                            <Section title={currentT.revenueBreakdown}>
                                <Table 
                                    headers={[currentT.item, currentT.amount, currentT.percentage]}
                                    rows={revenue_breakdown.map(item => [
                                        item.name,
                                        currencyFormatter(item.value),
                                        `${item.percentage}%`
                                    ])}
                                />
                            </Section>
                        )}

                        {/* NEW: Cash Flow Timeline */}
                        {cashFlowData && (
                            <Section title={currentT.cashFlowTimeline}>
                                <Table 
                                    headers={[currentT.period, currentT.costs, currentT.revenue, currentT.cumulative]}
                                    rows={cashFlowData.map(row => [
                                        row.period,
                                        currencyFormatter(row.costs),
                                        currencyFormatter(row.revenue),
                                        currencyFormatter(row.cumulative)
                                    ])}
                                />
                            </Section>
                        )}

                        {/* NEW: VAT Analysis (if available) */}
                        {(kpis.vat_input !== undefined || kpis.vat_output !== undefined) && (
                            <Section title={currentT.vatAnalysis}>
                                <div className="grid grid-cols-2 gap-x-12">
                                    <KeyValue label={currentT.vatInput} value={currencyFormatter(kpis.vat_input || 0)} />
                                    <KeyValue label={currentT.vatOutput} value={currencyFormatter(kpis.vat_output || 0)} />
                                    <KeyValue label={currentT.vatBalance} value={currencyFormatter(kpis.vat_balance || 0)} isBold />
                                    <KeyValue label={currentT.netProfitAfterVAT} value={currencyFormatter(kpis.net_profit_after_vat || 0)} isBold />
                                </div>
                            </Section>
                        )}
                    </>
                ) : (
                    /* RENTAL PROJECTS (long_term_lease, commercial, airbnb) */
                    <>
                        <Section title={currentT.keyMetrics}>
                            <div className="grid grid-cols-2 gap-x-12">
                                <KeyValue label={currentT.totalInvestment} value={currencyFormatter(kpis.total_investment || 0)} isBold />
                                <KeyValue label={currentT.downPayment} value={currencyFormatter(kpis.down_payment || 0)} isBold />
                                
                                {kpis.roi_10_year !== undefined && (
                                    <KeyValue label={currentT.roi} value={percentFormatter(kpis.roi_10_year)} isBold />
                                )}
                                {kpis.roi !== undefined && (
                                    <KeyValue label={currentT.roi} value={percentFormatter(kpis.roi)} isBold />
                                )}
                                
                                {kpis.cash_on_cash_return !== undefined && (
                                    <KeyValue label={currentT.cashOnCash} value={percentFormatter(kpis.cash_on_cash_return)} />
                                )}
                                
                                {kpis.irr !== undefined && (
                                    <KeyValue label={currentT.irr} value={percentFormatter(kpis.irr)} />
                                )}
                                
                                {kpis.npv !== undefined && (
                                    <KeyValue label={currentT.npv} value={currencyFormatter(kpis.npv)} />
                                )}
                                
                                {kpis.payback_period !== undefined && (
                                    <KeyValue label={currentT.payback} value={formatPaybackPeriod(kpis.payback_period)} />
                                )}
                                
                                {kpis.cap_rate !== undefined && (
                                    <KeyValue label={currentT.capRate} value={percentFormatter(kpis.cap_rate)} />
                                )}
                                
                                {kpis.dscr !== undefined && (
                                    <KeyValue label={currentT.dscr} value={kpis.dscr.toFixed(2)} />
                                )}
                                
                                {kpis.gross_rental_yield !== undefined && (
                                    <KeyValue label={currentT.grossYield} value={percentFormatter(kpis.gross_rental_yield)} />
                                )}
                                {kpis.gross_yield !== undefined && (
                                    <KeyValue label={currentT.grossYield} value={percentFormatter(kpis.gross_yield)} />
                                )}
                                
                                {kpis.net_rental_yield !== undefined && (
                                    <KeyValue label={currentT.netYield} value={percentFormatter(kpis.net_rental_yield)} />
                                )}
                                {kpis.net_yield !== undefined && (
                                    <KeyValue label={currentT.netYield} value={percentFormatter(kpis.net_yield)} />
                                )}
                                
                                {kpis.monthly_cash_flow !== undefined && (
                                    <KeyValue label={currentT.monthlyCashFlow} value={currencyFormatter(kpis.monthly_cash_flow)} />
                                )}
                                
                                {kpis.annual_cash_flow !== undefined && (
                                    <KeyValue label={currentT.annualCashFlow} value={currencyFormatter(kpis.annual_cash_flow)} />
                                )}
                            </div>
                        </Section>

                        <Section title={currentT.propertyDetails}>
                            {property_data?.purchase_price !== undefined && (
                                <KeyValue label={currentT.purchasePrice} value={currencyFormatter(property_data.purchase_price)} />
                            )}
                            {property_data?.price !== undefined && (
                                <KeyValue label={currentT.purchasePrice} value={currencyFormatter(property_data.price)} />
                            )}
                            {property_data?.monthly_rent !== undefined && (
                                <KeyValue label={currentT.monthlyRent} value={currencyFormatter(property_data.monthly_rent)} />
                            )}
                            {kpis.annual_rent !== undefined && (
                                <KeyValue label={currentT.annualRent} value={currencyFormatter(kpis.annual_rent)} />
                            )}
                            {kpis.net_operating_income !== undefined && (
                                <KeyValue label={currentT.noi} value={currencyFormatter(kpis.net_operating_income)} />
                            )}
                        </Section>
                    </>
                )}
            </main>

            <footer className="mt-12 pt-4 border-t text-center text-xs text-gray-500">
                {user?.entity_type === 'PO' && user.company_name ? (
                    <p className="font-bold">{user.company_name}</p>
                ) : (
                    <p>Estivo.app - Smarter Property Investing.</p>
                )}
                <p>This report is for informational purposes only and does not constitute financial advice. All calculations are estimates.</p>
            </footer>
        </div>
    );
}