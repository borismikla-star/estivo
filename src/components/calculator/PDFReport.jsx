
import React from 'react';
import { currencyFormatter, percentFormatter } from '../lib/formatters';

const Section = ({ title, children }) => (
    <div className="mb-6 page-break-inside-avoid">
        <h2 className="text-lg font-bold border-b-2 border-gray-800 pb-1 mb-3 text-gray-800" style={{ borderBottomColor: '#1f2937', borderBottomWidth: '2px' }}>{title}</h2>
        {children}
    </div>
);

const KeyValue = ({ label, value, isBold = false }) => (
    <div className="flex justify-between items-center py-1.5 border-b border-gray-200" style={{ borderBottomColor: '#e5e7eb', borderBottomWidth: '1px', paddingTop: '6px', paddingBottom: '6px' }}>
        <span className="text-gray-600" style={{ color: '#4b5563' }}>{label}</span>
        <span className={`text-gray-900 ${isBold ? 'font-bold text-base' : ''}`} style={{ color: '#111827', fontWeight: isBold ? 'bold' : 'normal', fontSize: isBold ? '16px' : '14px' }}>{value}</span>
    </div>
);

// NEW: Print-friendly Progress Bar using table
const PrintProgressBar = ({ label, value, max, color = '#003E7E', showPercentage = true }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    const barWidth = Math.min(percentage, 100);
    
    return (
        <div className="mb-2" style={{ marginBottom: '8px' }}>
            <div className="flex justify-between items-center mb-1" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span className="text-xs font-medium text-gray-700" style={{ fontSize: '11px', fontWeight: '500', color: '#374151' }}>{label}</span>
                <span className="text-xs font-semibold text-gray-900" style={{ fontSize: '11px', fontWeight: '600', color: '#111827' }}>
                    {currencyFormatter(value)} {showPercentage && `(${percentage.toFixed(1)}%)`}
                </span>
            </div>
            {/* Print-friendly progress bar using border */}
            <div style={{ 
                width: '100%', 
                height: '8px', 
                backgroundColor: '#e5e7eb',
                borderRadius: '4px',
                overflow: 'hidden',
                border: '1px solid #d1d5db'
            }}>
                <div style={{ 
                    width: `${barWidth}%`, 
                    height: '100%',
                    backgroundColor: color,
                    transition: 'none'
                }} />
            </div>
        </div>
    );
};

// NEW: Visual Cash Flow Timeline for print
const PrintCashFlowTimeline = ({ data, t }) => {
    return (
        <div className="space-y-3" style={{ marginTop: '8px' }}>
            {data.map((row, idx) => (
                <div key={idx} className="page-break-inside-avoid" style={{ pageBreakInside: 'avoid', marginBottom: '12px' }}>
                    <div className="font-semibold text-sm mb-1 text-gray-800" style={{ fontWeight: '600', fontSize: '13px', color: '#1f2937', marginBottom: '4px' }}>{row.period}</div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                        <tbody>
                            <tr>
                                <td style={{ width: '30%', padding: '4px', color: '#6b7280', fontWeight: '500' }}>{t.costs}</td>
                                <td style={{ width: '70%', padding: '4px' }}>
                                    <span style={{ 
                                        backgroundColor: '#fee2e2', 
                                        color: '#991b1b',
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        fontWeight: '600',
                                        fontSize: '11px'
                                    }}>
                                        {currencyFormatter(row.costs)}
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td style={{ width: '30%', padding: '4px', color: '#6b7280', fontWeight: '500' }}>{t.revenue}</td>
                                <td style={{ width: '70%', padding: '4px' }}>
                                    <span style={{ 
                                        backgroundColor: '#d1fae5', 
                                        color: '#065f46',
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        fontWeight: '600',
                                        fontSize: '11px'
                                    }}>
                                        {currencyFormatter(row.revenue)}
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td style={{ width: '30%', padding: '4px', color: '#6b7280', fontWeight: '600' }}>{t.cumulative}</td>
                                <td style={{ width: '70%', padding: '4px' }}>
                                    <span style={{ 
                                        backgroundColor: '#dbeafe', 
                                        color: row.cumulative >= 0 ? '#065f46' : '#991b1b',
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        fontWeight: 'bold',
                                        fontSize: '12px'
                                    }}>
                                        {currencyFormatter(row.cumulative)}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
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
            
            costBreakdown: "Cost Breakdown",
            revenueBreakdown: "Revenue Breakdown",
            cashFlowTimeline: "Cash Flow Timeline",
            vatAnalysis: "VAT Analysis",
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
            
            costBreakdown: "Rozloženie nákladov",
            revenueBreakdown: "Rozloženie príjmov",
            cashFlowTimeline: "Časová os Cash Flow",
            vatAnalysis: "Analýza DPH",
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
    
    const COST_COLORS = ['#003E7E', '#004C97', '#0066CC', '#0080FF', '#33A3FF', '#66BBFF', '#99D6FF'];
    const REVENUE_COLORS = ['#00B894', '#00D1A0', '#4ECCA3', '#78E4C8', '#A8F5E5'];

    return (
        <div className="hidden print:block print-container p-6 font-sans bg-white" style={{ padding: '24px', fontFamily: 'Arial, sans-serif', fontSize: '12px', backgroundColor: 'white' }}>
            {/* Header */}
            <header className="mb-6 text-center page-break-inside-avoid" style={{ marginBottom: '24px', textAlign: 'center', pageBreakInside: 'avoid' }}>
                 {user?.entity_type === 'PO' && user.company_logo_url ? (
                    <img src={user.company_logo_url} alt="Company Logo" style={{ height: '60px', maxWidth: '200px', margin: '0 auto 16px', objectFit: 'contain' }} />
                 ) : (
                    <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68d666dadfd2546479ace4c8/478578f70_logo_transp120x40.png" alt="Estivo Logo" style={{ height: '40px', margin: '0 auto 16px' }} />
                 )}
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' }}>{currentT.reportTitle}</h1>
                <p style={{ color: '#6b7280', fontSize: '12px' }}>Generated on {new Date().toLocaleDateString()}</p>
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
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', backgroundColor: '#eff6ff', padding: '12px', borderRadius: '8px' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px' }}>{currentT.totalProjectCosts}</div>
                                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>{currencyFormatter(kpis.total_project_costs || 0)}</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px' }}>{currentT.grossRevenue}</div>
                                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#059669' }}>{currencyFormatter(kpis.gross_revenue || 0)}</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px' }}>{currentT.grossProfit}</div>
                                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2563eb' }}>{currencyFormatter(kpis.gross_profit || 0)}</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px' }}>{currentT.profitMargin}</div>
                                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#4f46e5' }}>{percentFormatter(kpis.profit_margin || 0)}</div>
                                </div>
                            </div>
                        </Section>

                        {/* Development Metrics */}
                        <Section title={currentT.developmentMetrics}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
                                <KeyValue label={currentT.developerMargin} value={percentFormatter(kpis.developer_margin || 0)} isBold />
                                <KeyValue label={currentT.returnOnCost} value={percentFormatter(kpis.return_on_cost || 0)} isBold />
                                <KeyValue label={currentT.equityMultiple} value={`${(kpis.equity_multiple || 0).toFixed(2)}x`} />
                                <KeyValue label={currentT.irr} value={percentFormatter(kpis.irr || 0)} />
                                <KeyValue label={currentT.annualizedReturn} value={percentFormatter(kpis.annualized_return || 0)} />
                                <KeyValue label={currentT.projectDuration} value={formatDuration(kpis.project_duration_months)} />
                            </div>
                        </Section>

                        {/* Financing Breakdown */}
                        <Section title={currentT.financingBreakdown}>
                            <PrintProgressBar 
                                label={currentT.ownResources} 
                                value={kpis.own_resources || 0} 
                                max={kpis.total_project_costs || 1}
                                color="#00B894"
                            />
                            <PrintProgressBar 
                                label={currentT.bankResources} 
                                value={kpis.bank_resources || 0} 
                                max={kpis.total_project_costs || 1}
                                color="#E53935"
                            />
                            <PrintProgressBar 
                                label={currentT.financingCosts} 
                                value={kpis.total_financing_costs || 0} 
                                max={kpis.total_project_costs || 1}
                                color="#F9A825"
                            />
                        </Section>

                        {/* Cost Breakdown */}
                        {cost_breakdown && cost_breakdown.length > 0 && (
                            <Section title={currentT.costBreakdown}>
                                {cost_breakdown.map((item, idx) => (
                                    <PrintProgressBar
                                        key={idx}
                                        label={item.name}
                                        value={item.value}
                                        max={kpis.total_project_costs || 1}
                                        color={COST_COLORS[idx % COST_COLORS.length]}
                                    />
                                ))}
                            </Section>
                        )}

                        {/* Revenue Breakdown */}
                        {revenue_breakdown && revenue_breakdown.length > 0 && (
                            <Section title={currentT.revenueBreakdown}>
                                {revenue_breakdown.map((item, idx) => (
                                    <PrintProgressBar
                                        key={idx}
                                        label={item.name}
                                        value={item.value}
                                        max={kpis.gross_revenue || 1}
                                        color={REVENUE_COLORS[idx % REVENUE_COLORS.length]}
                                    />
                                ))}
                            </Section>
                        )}

                        {/* Cash Flow Timeline */}
                        {cashFlowData && (
                            <Section title={currentT.cashFlowTimeline}>
                                <PrintCashFlowTimeline data={cashFlowData} t={currentT} />
                            </Section>
                        )}

                        {/* Key Metrics */}
                        <Section title={currentT.keyMetrics}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                                <div style={{ textAlign: 'center', backgroundColor: '#f9fafb', padding: '8px', borderRadius: '6px' }}>
                                    <div style={{ fontSize: '10px', color: '#6b7280' }}>{currentT.costPerM2}</div>
                                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{currencyFormatter(kpis.cost_per_m2 || 0)}</div>
                                </div>
                                <div style={{ textAlign: 'center', backgroundColor: '#f9fafb', padding: '8px', borderRadius: '6px' }}>
                                    <div style={{ fontSize: '10px', color: '#6b7280' }}>{currentT.revenuePerM2}</div>
                                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{currencyFormatter(kpis.revenue_per_m2 || 0)}</div>
                                </div>
                                <div style={{ textAlign: 'center', backgroundColor: '#f9fafb', padding: '8px', borderRadius: '6px' }}>
                                    <div style={{ fontSize: '10px', color: '#6b7280' }}>{currentT.profitPerM2}</div>
                                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{currencyFormatter(kpis.profit_per_m2 || 0)}</div>
                                </div>
                                <div style={{ textAlign: 'center', backgroundColor: '#f9fafb', padding: '8px', borderRadius: '6px' }}>
                                    <div style={{ fontSize: '10px', color: '#6b7280' }}>{currentT.breakEven}</div>
                                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{currencyFormatter(kpis.break_even_revenue || 0)}</div>
                                </div>
                                <div style={{ textAlign: 'center', backgroundColor: '#f9fafb', padding: '8px', borderRadius: '6px' }}>
                                    <div style={{ fontSize: '10px', color: '#6b7280' }}>{currentT.breakEvenPct}</div>
                                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{percentFormatter(kpis.break_even_percentage || 0)}</div>
                                </div>
                                <div style={{ textAlign: 'center', backgroundColor: '#f9fafb', padding: '8px', borderRadius: '6px' }}>
                                    <div style={{ fontSize: '10px', color: '#6b7280' }}>{currentT.netRevenue}</div>
                                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{currencyFormatter(kpis.net_revenue || 0)}</div>
                                </div>
                            </div>
                        </Section>

                        {/* Project Areas */}
                        <Section title={currentT.projectAreas}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                                <div style={{ textAlign: 'center', backgroundColor: '#eff6ff', padding: '8px', borderRadius: '6px' }}>
                                    <div style={{ fontSize: '10px', color: '#6b7280' }}>{currentT.totalGFA}</div>
                                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{(kpis.total_gfa || 0).toLocaleString()} m²</div>
                                </div>
                                <div style={{ textAlign: 'center', backgroundColor: '#eff6ff', padding: '8px', borderRadius: '6px' }}>
                                    <div style={{ fontSize: '10px', color: '#6b7280' }}>{currentT.totalNFA}</div>
                                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{(kpis.total_nfa || 0).toLocaleString()} m²</div>
                                </div>
                                <div style={{ textAlign: 'center', backgroundColor: '#eff6ff', padding: '8px', borderRadius: '6px' }}>
                                    <div style={{ fontSize: '10px', color: '#6b7280' }}>{currentT.totalSalesArea}</div>
                                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{(kpis.total_sales_area || 0).toLocaleString()} m²</div>
                                </div>
                            </div>
                        </Section>

                        {/* VAT Analysis */}
                        {(kpis.vat_input !== undefined || kpis.vat_output !== undefined) && (
                            <Section title={currentT.vatAnalysis}>
                                <div style={{ backgroundColor: '#fef3c7', padding: '12px', borderRadius: '8px', border: '1px solid #fcd34d' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
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

            <footer style={{ marginTop: '24px', paddingTop: '12px', borderTop: '1px solid #e5e7eb', textAlign: 'center', fontSize: '10px', color: '#6b7280', pageBreakInside: 'avoid' }}>
                {user?.entity_type === 'PO' && user.company_name ? (
                    <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>{user.company_name}</p>
                ) : (
                    <p style={{ marginBottom: '4px' }}>Estivo.app - Smarter Property Investing.</p>
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
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }
                }
            `}</style>
        </div>
    );
}
