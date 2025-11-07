import React from 'react';
import { currencyFormatter, percentFormatter } from '../lib/formatters';

const Section = ({ title, children }) => (
    <div className="mb-8 page-break-inside-avoid">
        <h2 className="text-xl font-bold border-b-2 border-gray-800 pb-2 mb-4 text-gray-800">{title}</h2>
        {children}
    </div>
);

const KeyValue = ({ label, value, isBold = false }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-200">
        <span className="text-gray-600">{label}</span>
        <span className={`text-gray-900 ${isBold ? 'font-bold text-lg' : ''}`}>{value}</span>
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

// NEW: Progress Bar Component for visual representation
const ProgressBar = ({ label, value, max, color = '#003E7E', showPercentage = true }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    return (
        <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <span className="text-sm font-semibold text-gray-900">
                    {currencyFormatter(value)} {showPercentage && `(${percentage.toFixed(1)}%)`}
                </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                    className="h-full rounded-full transition-all" 
                    style={{ 
                        width: `${Math.min(percentage, 100)}%`, 
                        backgroundColor: color 
                    }}
                />
            </div>
        </div>
    );
};

// NEW: Mini Pie Chart using CSS (Simple visual representation)
const SimplePieChart = ({ data, colors }) => {
    let cumulativePercent = 0;
    const segments = data.map((item, idx) => {
        const percent = item.percentage;
        const startPercent = cumulativePercent;
        cumulativePercent += parseFloat(percent);
        return {
            ...item,
            startPercent,
            percent: parseFloat(percent),
            color: colors[idx % colors.length]
        };
    });

    return (
        <div className="flex items-center gap-6">
            <div className="relative w-32 h-32 rounded-full overflow-hidden" style={{ background: '#e5e7eb' }}>
                {segments.map((segment, idx) => {
                    const rotation = (segment.startPercent / 100) * 360;
                    const skewAngle = 90 - (segment.percent / 100) * 360;
                    
                    return (
                        <div
                            key={idx}
                            className="absolute w-full h-full"
                            style={{
                                clipPath: segment.percent > 50 ? 'none' : 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 50% 0%)',
                                transform: `rotate(${rotation}deg)`,
                                transformOrigin: '50% 50%'
                            }}
                        >
                            <div
                                className="w-full h-full"
                                style={{
                                    background: segment.color,
                                    transform: segment.percent > 50 ? 'none' : `skewY(${skewAngle}deg)`,
                                    transformOrigin: '50% 50%'
                                }}
                            />
                        </div>
                    );
                })}
            </div>
            <div className="flex-1">
                {segments.map((segment, idx) => (
                    <div key={idx} className="flex items-center gap-2 mb-1">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: segment.color }} />
                        <span className="text-xs text-gray-700">{segment.name}: {segment.percentage}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// NEW: Visual Cash Flow Timeline
const CashFlowTimeline = ({ data, t }) => {
    const maxAbsValue = Math.max(...data.map(d => Math.max(Math.abs(d.costs), Math.abs(d.revenue), Math.abs(d.cumulative))));
    
    return (
        <div className="space-y-4">
            {data.map((row, idx) => (
                <div key={idx} className="page-break-inside-avoid">
                    <div className="font-semibold text-sm mb-2 text-gray-800">{row.period}</div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <div className="text-xs text-gray-600 mb-1">{t.costs}</div>
                            <div className="bg-red-100 rounded-lg p-2">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-medium text-red-800">
                                        {currencyFormatter(row.costs)}
                                    </span>
                                </div>
                                <div className="w-full bg-red-200 rounded-full h-2">
                                    <div 
                                        className="bg-red-600 h-full rounded-full" 
                                        style={{ width: `${(Math.abs(row.costs) / maxAbsValue) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-600 mb-1">{t.revenue}</div>
                            <div className="bg-green-100 rounded-lg p-2">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-medium text-green-800">
                                        {currencyFormatter(row.revenue)}
                                    </span>
                                </div>
                                <div className="w-full bg-green-200 rounded-full h-2">
                                    <div 
                                        className="bg-green-600 h-full rounded-full" 
                                        style={{ width: `${(row.revenue / maxAbsValue) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-2 bg-blue-50 rounded-lg p-2">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-semibold text-blue-900">{t.cumulative}</span>
                            <span className={`text-sm font-bold ${row.cumulative >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {currencyFormatter(row.cumulative)}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

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
            
            // General metrics
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
            
            // Development-specific
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
            
            // Breakdown sections
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
            financingBreakdown: "Financing Breakdown",
            summary: "Executive Summary",
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
            
            // Breakdown sections
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
            financingBreakdown: "Rozloženie financovania",
            summary: "Zhrnutie",
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
    
    const isDevelopment = type === 'development';
    
    // Generate cash flow data
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
    
    // Colors for charts
    const COST_COLORS = ['#003E7E', '#004C97', '#0066CC', '#0080FF', '#33A3FF', '#66BBFF', '#99D6FF'];
    const REVENUE_COLORS = ['#00B894', '#00D1A0', '#4ECCA3', '#78E4C8', '#A8F5E5'];

    return (
        <div className="hidden print:block print-container p-8 font-sans bg-white" style={{ fontSize: '12px' }}>
            {/* Header */}
            <header className="mb-8 text-center page-break-inside-avoid">
                 {user?.entity_type === 'PO' && user.company_logo_url ? (
                    <img src={user.company_logo_url} alt="Company Logo" className="h-16 w-auto max-w-xs mx-auto mb-4 object-contain" />
                 ) : (
                    <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68d666dadfd2546479ace4c8/478578f70_logo_transp120x40.png" alt="Estivo Logo" className="h-10 mx-auto mb-4" />
                 )}
                <h1 className="text-3xl font-bold text-gray-800">{currentT.reportTitle}</h1>
                <p className="text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
            </header>

            <main>
                {/* Project Info */}
                <Section title={currentT.projectInfo}>
                    <KeyValue label={currentT.projectName} value={name} />
                    <KeyValue label={currentT.projectType} value={type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} />
                    <KeyValue label={currentT.country} value={country} />
                </Section>
                
                {isDevelopment ? (
                    /* DEVELOPMENT PROJECT */
                    <>
                        {/* Executive Summary */}
                        <Section title={currentT.summary}>
                            <div className="grid grid-cols-2 gap-6 bg-blue-50 p-4 rounded-lg">
                                <div className="text-center">
                                    <div className="text-xs text-gray-600 mb-1">{currentT.totalProjectCosts}</div>
                                    <div className="text-2xl font-bold text-gray-900">{currencyFormatter(kpis.total_project_costs || 0)}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xs text-gray-600 mb-1">{currentT.grossRevenue}</div>
                                    <div className="text-2xl font-bold text-green-600">{currencyFormatter(kpis.gross_revenue || 0)}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xs text-gray-600 mb-1">{currentT.grossProfit}</div>
                                    <div className="text-2xl font-bold text-blue-600">{currencyFormatter(kpis.gross_profit || 0)}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xs text-gray-600 mb-1">{currentT.profitMargin}</div>
                                    <div className="text-2xl font-bold text-indigo-600">{percentFormatter(kpis.profit_margin || 0)}</div>
                                </div>
                            </div>
                        </Section>

                        {/* Development Metrics */}
                        <Section title={currentT.developmentMetrics}>
                            <div className="grid grid-cols-2 gap-x-8">
                                <KeyValue label={currentT.developerMargin} value={percentFormatter(kpis.developer_margin || 0)} isBold />
                                <KeyValue label={currentT.returnOnCost} value={percentFormatter(kpis.return_on_cost || 0)} isBold />
                                <KeyValue label={currentT.equityMultiple} value={`${(kpis.equity_multiple || 0).toFixed(2)}x`} />
                                <KeyValue label={currentT.irr} value={percentFormatter(kpis.irr || 0)} />
                                <KeyValue label={currentT.annualizedReturn} value={percentFormatter(kpis.annualized_return || 0)} />
                                <KeyValue label={currentT.projectDuration} value={formatDuration(kpis.project_duration_months)} />
                            </div>
                        </Section>

                        {/* Financing Breakdown - NEW VISUAL */}
                        <Section title={currentT.financingBreakdown}>
                            <div className="space-y-2">
                                <ProgressBar 
                                    label={currentT.ownResources} 
                                    value={kpis.own_resources || 0} 
                                    max={kpis.total_project_costs || 1}
                                    color="#00B894"
                                />
                                <ProgressBar 
                                    label={currentT.bankResources} 
                                    value={kpis.bank_resources || 0} 
                                    max={kpis.total_project_costs || 1}
                                    color="#E53935"
                                />
                                <ProgressBar 
                                    label={currentT.financingCosts} 
                                    value={kpis.total_financing_costs || 0} 
                                    max={kpis.total_project_costs || 1}
                                    color="#F9A825"
                                />
                            </div>
                        </Section>

                        {/* Cost Breakdown - VISUAL */}
                        {cost_breakdown && cost_breakdown.length > 0 && (
                            <Section title={currentT.costBreakdown}>
                                <div className="space-y-2">
                                    {cost_breakdown.map((item, idx) => (
                                        <ProgressBar
                                            key={idx}
                                            label={item.name}
                                            value={item.value}
                                            max={kpis.total_project_costs || 1}
                                            color={COST_COLORS[idx % COST_COLORS.length]}
                                        />
                                    ))}
                                </div>
                            </Section>
                        )}

                        {/* Revenue Breakdown - VISUAL */}
                        {revenue_breakdown && revenue_breakdown.length > 0 && (
                            <Section title={currentT.revenueBreakdown}>
                                <div className="space-y-2">
                                    {revenue_breakdown.map((item, idx) => (
                                        <ProgressBar
                                            key={idx}
                                            label={item.name}
                                            value={item.value}
                                            max={kpis.gross_revenue || 1}
                                            color={REVENUE_COLORS[idx % REVENUE_COLORS.length]}
                                        />
                                    ))}
                                </div>
                            </Section>
                        )}

                        {/* Cash Flow Timeline - VISUAL */}
                        {cashFlowData && (
                            <Section title={currentT.cashFlowTimeline}>
                                <CashFlowTimeline data={cashFlowData} t={currentT} />
                            </Section>
                        )}

                        {/* Key Metrics */}
                        <Section title={currentT.keyMetrics}>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center bg-gray-50 p-3 rounded">
                                    <div className="text-xs text-gray-600">{currentT.costPerM2}</div>
                                    <div className="text-lg font-bold">{currencyFormatter(kpis.cost_per_m2 || 0)}</div>
                                </div>
                                <div className="text-center bg-gray-50 p-3 rounded">
                                    <div className="text-xs text-gray-600">{currentT.revenuePerM2}</div>
                                    <div className="text-lg font-bold">{currencyFormatter(kpis.revenue_per_m2 || 0)}</div>
                                </div>
                                <div className="text-center bg-gray-50 p-3 rounded">
                                    <div className="text-xs text-gray-600">{currentT.profitPerM2}</div>
                                    <div className="text-lg font-bold">{currencyFormatter(kpis.profit_per_m2 || 0)}</div>
                                </div>
                                <div className="text-center bg-gray-50 p-3 rounded">
                                    <div className="text-xs text-gray-600">{currentT.breakEven}</div>
                                    <div className="text-lg font-bold">{currencyFormatter(kpis.break_even_revenue || 0)}</div>
                                </div>
                                <div className="text-center bg-gray-50 p-3 rounded">
                                    <div className="text-xs text-gray-600">{currentT.breakEvenPct}</div>
                                    <div className="text-lg font-bold">{percentFormatter(kpis.break_even_percentage || 0)}</div>
                                </div>
                                <div className="text-center bg-gray-50 p-3 rounded">
                                    <div className="text-xs text-gray-600">{currentT.netRevenue}</div>
                                    <div className="text-lg font-bold">{currencyFormatter(kpis.net_revenue || 0)}</div>
                                </div>
                            </div>
                        </Section>

                        {/* Project Areas */}
                        <Section title={currentT.projectAreas}>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center bg-blue-50 p-3 rounded">
                                    <div className="text-xs text-gray-600">{currentT.totalGFA}</div>
                                    <div className="text-lg font-bold">{(kpis.total_gfa || 0).toLocaleString()} m²</div>
                                </div>
                                <div className="text-center bg-blue-50 p-3 rounded">
                                    <div className="text-xs text-gray-600">{currentT.totalNFA}</div>
                                    <div className="text-lg font-bold">{(kpis.total_nfa || 0).toLocaleString()} m²</div>
                                </div>
                                <div className="text-center bg-blue-50 p-3 rounded">
                                    <div className="text-xs text-gray-600">{currentT.totalSalesArea}</div>
                                    <div className="text-lg font-bold">{(kpis.total_sales_area || 0).toLocaleString()} m²</div>
                                </div>
                            </div>
                        </Section>

                        {/* VAT Analysis */}
                        {(kpis.vat_input !== undefined || kpis.vat_output !== undefined) && (
                            <Section title={currentT.vatAnalysis}>
                                <div className="bg-yellow-50 p-4 rounded-lg">
                                    <div className="grid grid-cols-2 gap-4">
                                        <KeyValue label={currentT.vatInput} value={currencyFormatter(kpis.vat_input || 0)} />
                                        <KeyValue label={currentT.vatOutput} value={currencyFormatter(kpis.vat_output || 0)} />
                                        <KeyValue label={currentT.vatBalance} value={currencyFormatter(kpis.vat_balance || 0)} isBold />
                                        <KeyValue label={currentT.netProfitAfterVAT} value={currencyFormatter(kpis.net_profit_after_vat || 0)} isBold />
                                    </div>
                                </div>
                            </Section>
                        )}
                    </>
                ) : (
                    /* RENTAL PROJECTS */
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

            <footer className="mt-12 pt-4 border-t text-center text-xs text-gray-500 page-break-inside-avoid">
                {user?.entity_type === 'PO' && user.company_name ? (
                    <p className="font-bold">{user.company_name}</p>
                ) : (
                    <p>Estivo.app - Smarter Property Investing.</p>
                )}
                <p>This report is for informational purposes only and does not constitute financial advice. All calculations are estimates.</p>
            </footer>
            
            {/* Print-specific CSS */}
            <style>{`
                @media print {
                    .page-break-inside-avoid {
                        page-break-inside: avoid;
                        break-inside: avoid;
                    }
                    .print-container {
                        max-width: 100% !important;
                    }
                }
            `}</style>
        </div>
    );
}