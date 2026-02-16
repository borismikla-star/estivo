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
                                <td style={{ width: '30%', padding: '4px', color: '#6b7280', fontWeight: '500' }}>{t.costs || 'Costs'}</td>
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
                                <td style={{ width: '30%', padding: '4px', color: '#6b7280', fontWeight: '500' }}>{t.revenue || 'Revenue'}</td>
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
                                <td style={{ width: '30%', padding: '4px', color: '#6b7280', fontWeight: '600' }}>{t.cumulative || 'Cumulative'}</td>
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

    const { kpis, cost_breakdown, revenue_breakdown, expense_breakdown } = results;
    const { name, type, country, property_data, income_data, assumptions_data } = projectData;

    const t = {
        en: {
            reportTitle: "Investment Analysis Report",
            projectInfo: "Project Information",
            projectName: "Project Name",
            projectType: "Project Type",
            country: "Country",
            entityType: "Entity Type",
            keyMetrics: "Key Financial Metrics",
            
            totalInvestment: "Total Investment",
            downPayment: "Down Payment / Equity",
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
            annualCashFlow: "Annual Cash Flow",
            propertyDetails: "Property & Income",
            purchasePrice: "Purchase Price",
            totalArea: "Total Area",
            rentableArea: "Rentable Area",
            propertyType: "Property Type",
            numberOfUnits: "Number of Units",
            monthlyRent: "Monthly Rent",
            annualRent: "Annual Base Rent",
            noi: "Net Operating Income",
            egi: "Effective Gross Income",
            pgi: "Potential Gross Income",
            vacancyRate: "Vacancy Rate",
            
            // Commercial specific
            incomeReimbursements: "Income & Reimbursements",
            camReimbursements: "CAM Reimbursements",
            otherReimbursements: "Other Reimbursements",
            otherIncome: "Other Income",
            operatingExpenses: "Operating Expenses (Annual)",
            totalOpex: "Total Operating Expenses",
            propertyTax: "Property Tax",
            insurance: "Insurance",
            maintenance: "Maintenance & Repairs",
            utilities: "Utilities",
            propertyManagement: "Property Management",
            capexReserve: "CapEx Reserve",
            
            // VAT Analysis for Commercial
            vatAnalysisCommercial: "VAT Analysis",
            vatStatus: "VAT Status",
            vatPayer: "VAT Payer",
            nonVatPayer: "Not VAT Payer",
            vatRate: "VAT Rate",
            grossInvestment: "Gross Investment (incl. VAT)",
            netInvestment: "Net Investment (excl. VAT)",
            totalVatDeductible: "Total VAT Deductible",
            vatBenefit: "VAT Benefit",
            
            // Investment breakdown
            investmentBreakdown: "Investment Breakdown",
            acquisitionCosts: "Acquisition Costs",
            
            // Assumptions
            assumptions: "Investment Assumptions",
            holdingPeriod: "Holding Period",
            exitCapRate: "Exit Cap Rate",
            annualAppreciation: "Annual Appreciation",
            rentGrowth: "Annual Rent Growth",
            
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
            expenseBreakdown: "Expense Breakdown",
            cashFlowTimeline: "Cash Flow Timeline",
            vatAnalysis: "VAT Analysis",
            period: "Period",
            costs: "Costs",
            revenue: "Revenue",
            cumulative: "Cumulative",
            months: "months",
            years: "years",
            vatInput: "VAT Input",
            vatOutput: "VAT Output",
            vatBalance: "VAT Balance",
            netProfitAfterVAT: "Net Profit after VAT",
            financingBreakdown: "Financing Breakdown",
            summary: "Executive Summary",
            performance: "Performance Metrics",

            // Tax Analysis (NEW!)
            taxAnalysis: "Tax Analysis",
            entityTypeFO: "Individual (FO)",
            entityTypePO: "Legal Entity (PO)",
            effectiveTaxRate: "Effective Tax Rate",
            corporateTaxRate: "Corporate Tax Rate",
            incomeTaxRate: "Income Tax Rate",
            taxableIncome: "Taxable Income",
            annualIncomeTax: "Annual Income Tax",
            depreciation: "Annual Depreciation",
            interestDeduction: "Interest Deduction",
            taxBenefits: "Tax Benefits",
            taxBenefitFromInterest: "Tax Benefit from Interest",
            taxBenefitFromDepreciation: "Tax Benefit from Depreciation",
            totalTaxBenefit: "Total Tax Benefits",
            beforeTax: "Before Tax",
            afterTax: "After Tax",
            cashFlowComparison: "Cash Flow Comparison",
            roiComparison: "ROI Comparison",
            irrComparison: "IRR Comparison",
            
            // Updated performance labels
            cashOnCashBeforeTax: "Cash-on-Cash (before tax)",
            cashOnCashAfterTax: "Cash-on-Cash (after tax)",
            roiBeforeTax: "ROI (before tax)",
            roiAfterTax: "ROI (after tax)",
            irrBeforeTax: "IRR (before tax)",
            irrAfterTax: "IRR (after tax)",
            npvBeforeTax: "NPV (before tax)",
            npvAfterTax: "NPV (after tax)",
        },
        sk: {
            reportTitle: "Správa o investičnej analýze",
            projectInfo: "Informácie o projekte",
            projectName: "Názov projektu",
            projectType: "Typ projektu",
            country: "Krajina",
            entityType: "Typ subjektu",
            keyMetrics: "Kľúčové finančné ukazovatele",
            
            totalInvestment: "Celková investícia",
            downPayment: "Vlastné zdroje / Equity",
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
            annualCashFlow: "Ročný Cash Flow",
            propertyDetails: "Nehnuteľnosť a príjem",
            purchasePrice: "Kúpna cena",
            totalArea: "Celková plocha",
            rentableArea: "Prenajímateľná plocha",
            propertyType: "Typ nehnuteľnosti",
            numberOfUnits: "Počet jednotiek",
            monthlyRent: "Mesačný nájom",
            annualRent: "Ročné základné nájomné",
            noi: "Čistý prevádzkový príjem",
            egi: "Efektívny hrubý príjem",
            pgi: "Potenciálny hrubý príjem",
            vacancyRate: "Miera neobsadenosti",
            
            // Commercial specific
            incomeReimbursements: "Príjmy a náhrady",
            camReimbursements: "Náhrady za správu",
            otherReimbursements: "Ostatné náhrady",
            otherIncome: "Ostatné príjmy",
            operatingExpenses: "Prevádzkové náklady (ročne)",
            totalOpex: "Celkové prevádzkové náklady",
            propertyTax: "Daň z nehnuteľnosti",
            insurance: "Poistenie",
            maintenance: "Údržba a opravy",
            utilities: "Energie",
            propertyManagement: "Správa nehnuteľnosti",
            capexReserve: "CapEx rezerva",
            
            // VAT Analysis for Commercial
            vatAnalysisCommercial: "Analýza DPH",
            vatStatus: "DPH Status",
            vatPayer: "Platca DPH",
            nonVatPayer: "Nie platca DPH",
            vatRate: "Sadzba DPH",
            grossInvestment: "Hrubá investícia (vrátane DPH)",
            netInvestment: "Čistá investícia (bez DPH)",
            totalVatDeductible: "Celková odpočítateľná DPH",
            vatBenefit: "Benefit z DPH",
            
            // Investment breakdown
            investmentBreakdown: "Rozloženie investície",
            acquisitionCosts: "Transakčné náklady",
            
            // Assumptions
            assumptions: "Investičné predpoklady",
            holdingPeriod: "Doba držby",
            exitCapRate: "Výstupný Cap Rate",
            annualAppreciation: "Ročná apreciácia",
            rentGrowth: "Ročný rast nájmu",
            
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
            expenseBreakdown: "Rozloženie nákladov",
            cashFlowTimeline: "Časová os Cash Flow",
            vatAnalysis: "Analýza DPH",
            period: "Obdobie",
            costs: "Náklady",
            revenue: "Príjmy",
            cumulative: "Kumulatívne",
            months: "mesiacov",
            years: "rokov",
            vatInput: "DPH na vstupe",
            vatOutput: "DPH na výstupe",
            vatBalance: "Saldo DPH",
            netProfitAfterVAT: "Čistý zisk po DPH",
            financingBreakdown: "Rozloženie financovania",
            summary: "Zhrnutie",
            performance: "Výkonnostné metriky",

            // Tax Analysis (NEW!)
            taxAnalysis: "Daňová analýza",
            entityTypeFO: "Fyzická osoba (FO)",
            entityTypePO: "Právnická osoba (PO)",
            effectiveTaxRate: "Efektívna daňová sadzba",
            corporateTaxRate: "Daň z príjmu PO",
            incomeTaxRate: "Daň z príjmu FO",
            taxableIncome: "Zdaniteľný príjem",
            annualIncomeTax: "Ročná daň z príjmu",
            depreciation: "Ročné odpisy",
            interestDeduction: "Odpočet úrokov",
            taxBenefits: "Daňové benefity",
            taxBenefitFromInterest: "Daňový benefit z úrokov",
            taxBenefitFromDepreciation: "Daňový benefit z odpisov",
            totalTaxBenefit: "Celkové daňové benefity",
            beforeTax: "Pred zdanením",
            afterTax: "Po zdanení",
            cashFlowComparison: "Porovnanie Cash Flow",
            roiComparison: "Porovnanie ROI",
            irrComparison: "Porovnanie IRR",
            
            // Updated performance labels
            cashOnCashBeforeTax: "Cash-on-Cash (pred zdanením)",
            cashOnCashAfterTax: "Cash-on-Cash (po zdanení)",
            roiBeforeTax: "ROI (pred zdanením)",
            roiAfterTax: "ROI (po zdanení)",
            irrBeforeTax: "IRR (pred zdanením)",
            irrAfterTax: "IRR (po zdanení)",
            npvBeforeTax: "NPV (pred zdanením)",
            npvAfterTax: "NPV (po zdanení)",
        }
    };
    const currentT = t[language] || t.en;
    
    const formatPaybackPeriod = (value) => {
        if (typeof value === 'string') return value;
        if (typeof value === 'number') return `${value.toFixed(1)} ${currentT.years}`;
        return 'N/A';
    };
    
    const formatDuration = (months) => {
        if (months === undefined || months === null) return 'N/A';
        const years = (months / 12).toFixed(1);
        return `${months} ${currentT.months} (${years} ${currentT.years})`;
    };
    
    const isDevelopment = type === 'development';
    const isCommercial = type === 'commercial';
    const isRental = type === 'long_term_lease' || type === 'airbnb';
    
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
    const EXPENSE_COLORS = ['#E53935', '#EF5350', '#F44336', '#E57373', '#EF9A9A', '#FFCDD2', '#FFEBEE'];

    // Get entity type label - check both locations where it might be stored
    const getEntityTypeLabel = () => {
        const entityType = projectData.project_info_data?.entity_type || projectData.entity_type || 'FO';
        return entityType === 'PO' ? 
            (language === 'sk' ? 'Právnická osoba (PO)' : 'Legal Entity (PO)') : 
            (language === 'sk' ? 'Fyzická osoba (FO)' : 'Individual (FO)');
    };

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
                    <KeyValue label={currentT.entityType} value={getEntityTypeLabel()} />
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
                                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{(kpis.total_gfa || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m²</div>
                                </div>
                                <div style={{ textAlign: 'center', backgroundColor: '#eff6ff', padding: '8px', borderRadius: '6px' }}>
                                    <div style={{ fontSize: '10px', color: '#6b7280' }}>{currentT.totalNFA}</div>
                                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{(kpis.total_nfa || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m²</div>
                                </div>
                                <div style={{ textAlign: 'center', backgroundColor: '#eff6ff', padding: '8px', borderRadius: '6px' }}>
                                    <div style={{ fontSize: '10px', color: '#6b7280' }}>{currentT.totalSalesArea}</div>
                                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{(kpis.total_sales_area || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} m²</div>
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
                ) : isCommercial ? (
                    /* COMMERCIAL PROJECT */
                    <>
                        {/* Executive Summary */}
                        <Section title={currentT.summary}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', backgroundColor: '#eff6ff', padding: '12px', borderRadius: '8px' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px' }}>{currentT.totalInvestment}</div>
                                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>{currencyFormatter(kpis.total_investment || 0)}</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px' }}>{currentT.capRate}</div>
                                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2563eb' }}>{percentFormatter(kpis.cap_rate || 0)}</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px' }}>{currentT.cashOnCash}</div>
                                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#059669' }}>{percentFormatter(kpis.cash_on_cash_return || 0)}</div>
                                </div>
                            </div>
                        </Section>

                        {/* VAT Analysis - ONLY if VAT payer */}
                        {kpis.is_vat_payer && (
                            <Section title={currentT.vatAnalysisCommercial}>
                                <div style={{ backgroundColor: '#dbeafe', padding: '12px', borderRadius: '8px', border: '1px solid #93c5fd', marginBottom: '12px' }}>
                                    <div style={{ textAlign: 'center', marginBottom: '8px', padding: '6px', backgroundColor: '#bfdbfe', borderRadius: '4px' }}>
                                        <span style={{ fontWeight: 'bold', color: '#1e40af' }}>✓ {currentT.vatPayer}</span>
                                        <span style={{ marginLeft: '8px', color: '#3b82f6' }}>({currentT.vatRate}: {kpis.vat_rate}%)</span>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                        <KeyValue label={currentT.grossInvestment} value={currencyFormatter(kpis.total_investment_gross || 0)} />
                                        <KeyValue label={currentT.totalVatDeductible} value={currencyFormatter(kpis.total_vat_deductible || 0)} isBold />
                                        <KeyValue label={currentT.netInvestment} value={currencyFormatter(kpis.net_investment_after_vat || 0)} isBold />
                                        <KeyValue label={currentT.vatBenefit} value={`-${currencyFormatter(kpis.total_vat_deductible || 0)}`} isBold />
                                    </div>
                                </div>
                            </Section>
                        )}

                        {/* TAX ANALYSIS (NEW!) */}
                        {kpis.effective_tax_rate !== undefined && (
                            <Section title={currentT.taxAnalysis}>
                                <div style={{ backgroundColor: '#fef3c7', padding: '12px', borderRadius: '8px', border: '1px solid #fcd34d', marginBottom: '12px' }}>
                                    <div style={{ textAlign: 'center', marginBottom: '8px', padding: '6px', backgroundColor: '#fef9c3', borderRadius: '4px' }}>
                                        <span style={{ fontWeight: 'bold', color: '#92400e' }}>
                                            {kpis.entity_type === 'PO' ? currentT.entityTypePO : currentT.entityTypeFO}
                                        </span>
                                        <span style={{ marginLeft: '8px', color: '#ca8a04' }}>
                                            ({currentT.effectiveTaxRate}: {percentFormatter(kpis.effective_tax_rate)})
                                        </span>
                                    </div>
                                    
                                    {/* Tax Calculation Breakdown */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                                        <KeyValue label={currentT.depreciation} value={currencyFormatter(kpis.annual_depreciation || 0)} />
                                        <KeyValue label={currentT.interestDeduction} value={currencyFormatter(kpis.annual_interest_deduction || 0)} />
                                        <KeyValue label={currentT.taxableIncome} value={currencyFormatter(kpis.taxable_income || 0)} isBold />
                                        <KeyValue label={currentT.annualIncomeTax} value={currencyFormatter(kpis.annual_income_tax || 0)} isBold />
                                    </div>
                                    
                                    {/* Tax Benefits Section */}
                                    <div style={{ backgroundColor: '#fff7ed', padding: '10px', borderRadius: '6px', border: '1px solid #fed7aa' }}>
                                        <div style={{ fontSize: '11px', fontWeight: '600', color: '#9a3412', marginBottom: '6px' }}>
                                            💰 {currentT.taxBenefits}
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                                            <div style={{ fontSize: '10px' }}>
                                                <span style={{ color: '#78716c' }}>{currentT.taxBenefitFromInterest}:</span>
                                                <span style={{ fontWeight: 'bold', marginLeft: '4px', color: '#059669' }}>
                                                    {currencyFormatter(kpis.tax_benefit_from_interest || 0)}
                                                </span>
                                            </div>
                                            <div style={{ fontSize: '10px' }}>
                                                <span style={{ color: '#78716c' }}>{currentT.taxBenefitFromDepreciation}:</span>
                                                <span style={{ fontWeight: 'bold', marginLeft: '4px', color: '#059669' }}>
                                                    {currencyFormatter(kpis.tax_benefit_from_depreciation || 0)}
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px solid #fed7aa', textAlign: 'center' }}>
                                            <span style={{ fontSize: '10px', color: '#78716c' }}>{currentT.totalTaxBenefit}: </span>
                                            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#059669' }}>
                                                {currencyFormatter(kpis.total_tax_benefit || 0)}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Before/After Tax Comparison */}
                                    <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                        <div style={{ backgroundColor: '#e0f2fe', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
                                            <div style={{ fontSize: '10px', color: '#0369a1', marginBottom: '4px' }}>{currentT.beforeTax}</div>
                                            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#0c4a6e' }}>
                                                {currencyFormatter(kpis.annual_cash_flow || 0)}
                                            </div>
                                            <div style={{ fontSize: '9px', color: '#0369a1' }}>{currentT.annualCashFlow}</div>
                                        </div>
                                        <div style={{ backgroundColor: '#dcfce7', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
                                            <div style={{ fontSize: '10px', color: '#15803d', marginBottom: '4px' }}>{currentT.afterTax}</div>
                                            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#166534' }}>
                                                {currencyFormatter(kpis.annual_cash_flow_after_tax || 0)}
                                            </div>
                                            <div style={{ fontSize: '9px', color: '#15803d' }}>{currentT.annualCashFlow}</div>
                                        </div>
                                    </div>
                                </div>
                            </Section>
                        )}

                        {/* Property Details */}
                        <Section title={currentT.propertyDetails}>
                            <KeyValue label={currentT.purchasePrice} value={currencyFormatter(property_data?.price || 0)} isBold />
                            {property_data?.size_m2 && (
                                <KeyValue label={currentT.totalArea} value={`${property_data.size_m2.toLocaleString()} m²`} />
                            )}
                            {property_data?.rentable_area_m2 && (
                                <KeyValue label={currentT.rentableArea} value={`${property_data.rentable_area_m2.toLocaleString()} m²`} />
                            )}
                            {property_data?.property_type && (
                                <KeyValue label={currentT.propertyType} value={property_data.property_type.charAt(0).toUpperCase() + property_data.property_type.slice(1)} />
                            )}
                            {property_data?.number_of_units && (
                                <KeyValue label={currentT.numberOfUnits} value={property_data.number_of_units} />
                            )}
                        </Section>

                        {/* Income & Reimbursements */}
                        <Section title={currentT.incomeReimbursements}>
                            <KeyValue label={currentT.annualRent} value={currencyFormatter(income_data?.annual_rent || 0)} isBold />
                            {income_data?.cam_reimbursements > 0 && (
                                <KeyValue label={currentT.camReimbursements} value={currencyFormatter(income_data.cam_reimbursements)} />
                            )}
                            {income_data?.other_reimbursements > 0 && (
                                <KeyValue label={currentT.otherReimbursements} value={currencyFormatter(income_data.other_reimbursements)} />
                            )}
                            {income_data?.other_income > 0 && (
                                <KeyValue label={currentT.otherIncome} value={currencyFormatter(income_data.other_income)} />
                            )}
                            <KeyValue label={currentT.pgi} value={currencyFormatter(kpis.potential_gross_income || 0)} />
                            {income_data?.vacancy_rate !== undefined && (
                                <KeyValue label={currentT.vacancyRate} value={percentFormatter(income_data.vacancy_rate)} />
                            )}
                            <KeyValue label={currentT.egi} value={currencyFormatter(kpis.effective_gross_income || 0)} isBold />
                        </Section>

                        {/* Operating Expenses */}
                        {expense_breakdown && expense_breakdown.length > 0 && (
                            <Section title={currentT.operatingExpenses}>
                                {expense_breakdown.map((item, idx) => (
                                    <KeyValue key={idx} label={item.name} value={currencyFormatter(item.value)} />
                                ))}
                                <KeyValue label={currentT.totalOpex} value={currencyFormatter((kpis.total_annual_operating_expenses || 0) + (kpis.annual_capex || 0))} isBold />
                            </Section>
                        )}

                        {/* Performance Metrics - UPDATED WITH AFTER TAX */}
                        <Section title={currentT.performance}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
                                <KeyValue label={currentT.noi} value={currencyFormatter(kpis.net_operating_income || 0)} isBold />
                                <KeyValue label={currentT.capRate} value={percentFormatter(kpis.cap_rate || 0)} />
                                <KeyValue label={currentT.dscr} value={kpis.dscr ? kpis.dscr.toFixed(2) : 'N/A'} />
                                
                                {/* Cash Flow - Before/After Tax */}
                                <KeyValue label={currentT.cashOnCashBeforeTax} value={percentFormatter(kpis.cash_on_cash_return || 0)} />
                                <KeyValue label={currentT.cashOnCashAfterTax} value={percentFormatter(kpis.cash_on_cash_return_after_tax || 0)} isBold />
                                
                                {/* IRR - Before/After Tax */}
                                {kpis.irr !== undefined && (
                                    <>
                                        <KeyValue label={currentT.irrBeforeTax} value={percentFormatter(kpis.irr)} />
                                        <KeyValue label={currentT.irrAfterTax} value={percentFormatter(kpis.irr_after_tax || 0)} isBold />
                                    </>
                                )}
                                
                                {/* NPV - Before/After Tax */}
                                {kpis.npv !== undefined && (
                                    <>
                                        <KeyValue label={currentT.npvBeforeTax} value={currencyFormatter(kpis.npv)} />
                                        <KeyValue label={currentT.npvAfterTax} value={currencyFormatter(kpis.npv_after_tax || 0)} isBold />
                                    </>
                                )}
                                
                                {/* ROI - Before/After Tax */}
                                {kpis.roi_10_year !== undefined && (
                                    <>
                                        <KeyValue label={currentT.roiBeforeTax} value={percentFormatter(kpis.roi_10_year)} />
                                        <KeyValue label={currentT.roiAfterTax} value={percentFormatter(kpis.roi_10_year_after_tax || 0)} isBold />
                                    </>
                                )}
                            </div>
                        </Section>

                        {/* Investment Breakdown */}
                        <Section title={currentT.investmentBreakdown}>
                            <PrintProgressBar 
                                label={currentT.downPayment} 
                                value={kpis.total_equity || 0} 
                                max={kpis.total_investment || 1}
                                color="#00B894"
                            />
                            <PrintProgressBar 
                                label={currentT.loanAmount} 
                                value={kpis.loan_amount || 0} 
                                max={kpis.total_investment || 1}
                                color="#E53935"
                            />
                        </Section>

                        {/* Assumptions */}
                        {assumptions_data && (
                            <Section title={currentT.assumptions}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
                                    {assumptions_data.holding_period && (
                                        <KeyValue label={currentT.holdingPeriod} value={`${assumptions_data.holding_period} ${currentT.years}`} />
                                    )}
                                    {assumptions_data.exit_cap_rate !== undefined && (
                                        <KeyValue label={currentT.exitCapRate} value={percentFormatter(assumptions_data.exit_cap_rate)} />
                                    )}
                                    {assumptions_data.annual_appreciation !== undefined && (
                                        <KeyValue label={currentT.annualAppreciation} value={percentFormatter(assumptions_data.annual_appreciation)} />
                                    )}
                                    {income_data?.rent_escalation_percent !== undefined && (
                                        <KeyValue label={currentT.rentGrowth} value={percentFormatter(income_data.rent_escalation_percent)} />
                                    )}
                                </div>
                            </Section>
                        )}
                    </>
                ) : isRental ? (
                    /* RENTAL PROJECTS (long_term_lease, airbnb) - WITH TAX ANALYSIS */
                    <>
                        {/* TAX ANALYSIS (NEW!) */}
                        {kpis.effective_tax_rate !== undefined && (
                            <Section title={currentT.taxAnalysis}>
                                <div style={{ backgroundColor: '#fef3c7', padding: '12px', borderRadius: '8px', border: '1px solid #fcd34d', marginBottom: '12px' }}>
                                    <div style={{ textAlign: 'center', marginBottom: '8px', padding: '6px', backgroundColor: '#fef9c3', borderRadius: '4px' }}>
                                        <span style={{ fontWeight: 'bold', color: '#92400e' }}>
                                            {kpis.entity_type === 'PO' ? currentT.entityTypePO : currentT.entityTypeFO}
                                        </span>
                                        <span style={{ marginLeft: '8px', color: '#ca8a04' }}>
                                            ({currentT.effectiveTaxRate}: {percentFormatter(kpis.effective_tax_rate)})
                                        </span>
                                    </div>
                                    
                                    {/* Tax Calculation Breakdown */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                                        <KeyValue label={currentT.depreciation} value={currencyFormatter(kpis.annual_depreciation || 0)} />
                                        <KeyValue label={currentT.interestDeduction} value={currencyFormatter(kpis.annual_interest_deduction || 0)} />
                                        <KeyValue label={currentT.taxableIncome} value={currencyFormatter(kpis.taxable_income || 0)} isBold />
                                        <KeyValue label={currentT.annualIncomeTax} value={currencyFormatter(kpis.annual_income_tax || 0)} isBold />
                                    </div>
                                    
                                    {/* Tax Benefits Section */}
                                    <div style={{ backgroundColor: '#fff7ed', padding: '10px', borderRadius: '6px', border: '1px solid #fed7aa' }}>
                                        <div style={{ fontSize: '11px', fontWeight: '600', color: '#9a3412', marginBottom: '6px' }}>
                                            💰 {currentT.taxBenefits}
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                                            <div style={{ fontSize: '10px' }}>
                                                <span style={{ color: '#78716c' }}>{currentT.taxBenefitFromInterest}:</span>
                                                <span style={{ fontWeight: 'bold', marginLeft: '4px', color: '#059669' }}>
                                                    {currencyFormatter(kpis.tax_benefit_from_interest || 0)}
                                                </span>
                                            </div>
                                            <div style={{ fontSize: '10px' }}>
                                                <span style={{ color: '#78716c' }}>{currentT.taxBenefitFromDepreciation}:</span>
                                                <span style={{ fontWeight: 'bold', marginLeft: '4px', color: '#059669' }}>
                                                    {currencyFormatter(kpis.tax_benefit_from_depreciation || 0)}
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px solid #fed7aa', textAlign: 'center' }}>
                                            <span style={{ fontSize: '10px', color: '#78716c' }}>{currentT.totalTaxBenefit}: </span>
                                            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#059669' }}>
                                                {currencyFormatter(kpis.total_tax_benefit || 0)}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Before/After Tax Comparison */}
                                    <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                        <div style={{ backgroundColor: '#e0f2fe', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
                                            <div style={{ fontSize: '10px', color: '#0369a1', marginBottom: '4px' }}>{currentT.beforeTax}</div>
                                            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#0c4a6e' }}>
                                                {currencyFormatter(kpis.annual_cash_flow || 0)}
                                            </div>
                                            <div style={{ fontSize: '9px', color: '#0369a1' }}>{currentT.annualCashFlow}</div>
                                        </div>
                                        <div style={{ backgroundColor: '#dcfce7', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
                                            <div style={{ fontSize: '10px', color: '#15803d', marginBottom: '4px' }}>{currentT.afterTax}</div>
                                            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#166534' }}>
                                                {currencyFormatter(kpis.annual_cash_flow_after_tax || 0)}
                                            </div>
                                            <div style={{ fontSize: '9px', color: '#15803d' }}>{currentT.annualCashFlow}</div>
                                        </div>
                                    </div>
                                </div>
                            </Section>
                        )}

                        <Section title={currentT.keyMetrics}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
                                <KeyValue label={currentT.totalInvestment} value={currencyFormatter(kpis.total_investment || 0)} isBold />
                                <KeyValue label={currentT.downPayment} value={currencyFormatter(kpis.down_payment || kpis.total_equity || 0)} isBold />
                                
                                {/* Cash-on-Cash - Before and After Tax */}
                                {kpis.cash_on_cash_return !== undefined && (
                                    <>
                                        <KeyValue label={currentT.cashOnCashBeforeTax} value={percentFormatter(kpis.cash_on_cash_return)} />
                                        {kpis.cash_on_cash_return_after_tax !== undefined && (
                                            <KeyValue label={currentT.cashOnCashAfterTax} value={percentFormatter(kpis.cash_on_cash_return_after_tax)} isBold />
                                        )}
                                    </>
                                )}
                                
                                {/* ROI - Before and After Tax */}
                                {kpis.roi_10_year !== undefined && (
                                    <>
                                        <KeyValue label={currentT.roiBeforeTax} value={percentFormatter(kpis.roi_10_year)} />
                                        {kpis.roi_10_year_after_tax !== undefined && (
                                            <KeyValue label={currentT.roiAfterTax} value={percentFormatter(kpis.roi_10_year_after_tax)} isBold />
                                        )}
                                    </>
                                )}
                                
                                {/* IRR - Before and After Tax */}
                                {kpis.irr !== undefined && (
                                    <>
                                        <KeyValue label={currentT.irrBeforeTax} value={percentFormatter(kpis.irr)} />
                                        {kpis.irr_after_tax !== undefined && (
                                            <KeyValue label={currentT.irrAfterTax} value={percentFormatter(kpis.irr_after_tax)} isBold />
                                        )}
                                    </>
                                )}
                                
                                {kpis.payback_period !== undefined && (
                                    <KeyValue label={currentT.payback} value={formatPaybackPeriod(kpis.payback_period)} />
                                )}
                                
                                {kpis.npv !== undefined && (
                                    <>
                                        <KeyValue label={currentT.npvBeforeTax} value={currencyFormatter(kpis.npv)} />
                                        {kpis.npv_after_tax !== undefined && (
                                            <KeyValue label={currentT.npvAfterTax} value={currencyFormatter(kpis.npv_after_tax)} isBold />
                                        )}
                                    </>
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
                ) : null}
            </main>

            <footer style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #e5e7eb', textAlign: 'center', fontSize: '9px', color: '#6b7280', pageBreakInside: 'avoid', pageBreakBefore: 'avoid' }}>
                {user?.entity_type === 'PO' && user.company_name ? (
                    <p style={{ fontWeight: 'bold', marginBottom: '2px', marginTop: 0 }}>{user.company_name}</p>
                ) : (
                    <p style={{ marginBottom: '2px', marginTop: 0 }}>Estivo.app - Smarter Property Investing.</p>
                )}
                <p style={{ marginTop: 0, marginBottom: 0 }}>This report is for informational purposes only and does not constitute financial advice. All calculations are estimates.</p>
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
                    footer {
                        page-break-before: avoid !important;
                        page-break-inside: avoid !important;
                        break-before: avoid !important;
                        break-inside: avoid !important;
                    }
                    main {
                        page-break-after: avoid !important;
                    }
                }
            `}</style>
        </div>
    );
}