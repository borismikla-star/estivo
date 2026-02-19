import { calculateIRR } from '../financialCalculations';

export function calculateAirbnb(projectData, preset, language = 'en') {
    const {
        property_data = {},
        financing_data = {},
        income_data = {},
        operating_data = {},
        entity_type = 'FO',
    } = projectData;

    const num = (value) => {
        const parsed = Number(value);
        return isNaN(parsed) ? 0 : parsed;
    };

    // === VAT SETTINGS ===
    // Airbnb short-term rental is typically VAT exempt for residential use.
    // Toggle is kept for commercial Airbnb use cases.
    const isVatPayer = property_data.is_vat_payer || false;
    const vatRate = num(property_data.vat_rate) || num(preset?.vat_rate) || 20;
    const vatMultiplier = 1 + (vatRate / 100);

    // === PROPERTY & INVESTMENT ===
    // If VAT payer, purchase price is entered as GROSS → convert to NET (can reclaim input VAT)
    const purchasePriceGross = num(property_data.purchase_price);
    const purchasePrice = isVatPayer ? purchasePriceGross / vatMultiplier : purchasePriceGross;
    const vatOnPurchase = isVatPayer ? purchasePriceGross - purchasePrice : 0;

    const furnishingCost = num(property_data.furnishing_cost);
    const acquisitionCosts = num(property_data.acquisition_costs);
    const totalInvestment = purchasePrice + furnishingCost + acquisitionCosts;

    // === FINANCING - CORRECTED ===
    const downPaymentPercent = num(financing_data.down_payment_percent) || 20;
    const loanTerm = num(financing_data.loan_term) || 30;
    const interestRate = num(financing_data.interest_rate) || 3.5;
    
    // Down payment is on purchase price only
    const downPayment = purchasePrice * (downPaymentPercent / 100);
    const loanAmount = purchasePrice - downPayment;
    // Total equity = down payment + furnishing + acquisition costs
    const totalEquity = downPayment + furnishingCost + acquisitionCosts;
    
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    let monthlyMortgagePayment = 0;
    if (loanAmount > 0) {
        if (monthlyInterestRate === 0) {
            // 0% interest: simple equal principal payments
            monthlyMortgagePayment = loanAmount / numberOfPayments;
        } else {
            // Standard annuity formula
            monthlyMortgagePayment = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
                                     (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
        }
    }
    const annualDebtService = monthlyMortgagePayment * 12;

    // === INCOME ===
    // avg_nightly_rate is entered as NET (excl. VAT)
    const avgNightlyRate = num(income_data.avg_nightly_rate);
    const occupancyRate = num(income_data.occupancy_rate) || 70;
    const nightsPerYear = 365 * (occupancyRate / 100);
    // grossAnnualRevenue = revenue excl. VAT (base for NOI and tax)
    const grossAnnualRevenue = avgNightlyRate * nightsPerYear;
    // Output VAT collected from guests (cash flow item, NOT part of NOI)
    const annualOutputVat = isVatPayer ? grossAnnualRevenue * (vatRate / 100) : 0;
    
    // Platform fees (Airbnb typically takes 3% from host)
    const platformFeeRate = num(income_data.platform_fee_rate) || 3;
    const platformFees = grossAnnualRevenue * (platformFeeRate / 100);
    const netAnnualRevenue = grossAnnualRevenue - platformFees;

    // === OPERATING EXPENSES ===
    const utilities = num(operating_data.utilities) || 0;
    const annualUtilities = utilities * 12;
    
    const cleaningCostPerStay = num(operating_data.cleaning_cost_per_stay) || 0;
    const estimatedStaysPerYear = nightsPerYear / (num(income_data.avg_length_of_stay) || 3);
    const annualCleaningCosts = cleaningCostPerStay * estimatedStaysPerYear;
    
    const supplies = num(operating_data.supplies) || 0;
    const annualSupplies = supplies * 12;
    
    const propertyManagement = num(operating_data.property_management) || 0;
    const annualPropertyManagement = (netAnnualRevenue * propertyManagement) / 100;
    
    const insurance = num(operating_data.insurance) || 0;
    const annualInsurance = insurance * 12;
    
    const propertyTax = num(operating_data.property_tax) || 0;
    const annualPropertyTax = (purchasePrice * propertyTax) / 100;
    
    const maintenance = num(operating_data.maintenance) || 0;
    const annualMaintenance = (purchasePrice * maintenance) / 100;
    
    const hoaFees = num(operating_data.hoa) || 0;
    const annualHOA = hoaFees * 12;
    
    const otherExpenses = num(operating_data.other_expenses) || 0;
    
    const totalAnnualOperatingExpenses = annualUtilities + annualCleaningCosts + annualSupplies + 
                                         annualPropertyManagement + annualInsurance + annualPropertyTax + 
                                         annualMaintenance + annualHOA + otherExpenses;

    // === CORE METRICS ===
    // NOI and all returns are on NET basis (excl. VAT).
    // VAT is a pass-through: output VAT collected from guests is remitted to the tax authority → annual net VAT CF ≈ 0.
    // The only real VAT benefit for a VAT payer is the one-time input VAT refund on the purchase price (vatOnPurchase),
    // which is captured in the IRR cash-flow series at t=0 (reducing effective equity).
    const netOperatingIncome = netAnnualRevenue - totalAnnualOperatingExpenses;
    const annualCashFlow = netOperatingIncome - annualDebtService;
    const monthlyCashFlow = annualCashFlow / 12;

    // === TAX CALCULATIONS (NEW!) ===
    const corporateTaxRate = num(preset?.corporate_tax_rate) || 21;
    const incomeTaxRateFO = num(preset?.income_tax_rate_fo) || 25;
    const depreciationRate = num(preset?.depreciation_rate) || 2;
    
    // Annual depreciation
    const annualDepreciation = purchasePrice * (depreciationRate / 100);
    
    // First year interest
    let firstYearInterest = 0;
    if (loanAmount > 0 && monthlyMortgagePayment > 0) {
        let balance = loanAmount;
        for (let month = 1; month <= 12; month++) {
            const interest = balance * monthlyInterestRate;
            firstYearInterest += interest;
            const principal = monthlyMortgagePayment - interest;
            balance -= principal;
        }
    }
    
    // Taxable income = NOI - Interest - Depreciation
    const taxableIncome = Math.max(0, netOperatingIncome - firstYearInterest - annualDepreciation);
    
    // Tax rate based on entity type
    const effectiveTaxRate = entity_type === 'PO' ? corporateTaxRate : incomeTaxRateFO;
    const annualIncomeTax = taxableIncome * (effectiveTaxRate / 100);
    
    // Cash flow after tax
    const annualCashFlowAfterTax = annualCashFlow - annualIncomeTax;
    const monthlyCashFlowAfterTax = annualCashFlowAfterTax / 12;
    
    // Tax benefits
    const taxBenefitFromInterest = firstYearInterest * (effectiveTaxRate / 100);
    const taxBenefitFromDepreciation = annualDepreciation * (effectiveTaxRate / 100);
    const totalTaxBenefit = taxBenefitFromInterest + taxBenefitFromDepreciation;

    // === ADVANCED METRICS ===
    // 1. RevPAN (Revenue per Available Night)
    const revPAN = grossAnnualRevenue / 365;
    
    // 2. Cap Rate
    const capRate = purchasePrice > 0 ? (netOperatingIncome / purchasePrice) * 100 : 0;
    
    // 3. Cash-on-Cash Return - based on total equity
    const cashOnCashReturn = totalEquity > 0 ? (annualCashFlow / totalEquity) * 100 : 0;
    const cashOnCashReturnAfterTax = totalEquity > 0 ? (annualCashFlowAfterTax / totalEquity) * 100 : 0;
    
    // 4. DSCR
    const dscr = annualDebtService > 0 ? netOperatingIncome / annualDebtService : null;
    
    // 5. Gross Yield
    const grossYield = purchasePrice > 0 ? (grossAnnualRevenue / purchasePrice) * 100 : 0;
    
    // 6. Net Yield
    const netYield = purchasePrice > 0 ? (netOperatingIncome / purchasePrice) * 100 : 0;
    
    // 7. Break-Even Occupancy
    // Gross revenue needed to cover all costs: opex + debt service
    // Net revenue = gross * (1 - platformFeeRate/100), so:
    // avgNightlyRate * 365 * occ * (1 - platformFeeRate/100) = opex + debtService
    const netRevenuePerNight = avgNightlyRate * (1 - platformFeeRate / 100);
    const breakEvenOccupancy = (avgNightlyRate > 0 && netRevenuePerNight > 0) ? 
        ((totalAnnualOperatingExpenses + annualDebtService) / (netRevenuePerNight * 365)) * 100 : 0;

    // 8. Comparison to Long-Term Rental
    const estimatedLongTermRent = num(income_data.comparable_long_term_rent) || (purchasePrice * 0.005);
    const annualLongTermRent = estimatedLongTermRent * 12;
    const airbnbPremium = annualLongTermRent > 0 ? ((netAnnualRevenue - annualLongTermRent) / annualLongTermRent) * 100 : 0;

    // === 10-YEAR PROJECTIONS WITH TAX ===
    const appreciationRate = num(operating_data.appreciation_rate) || 2;
    const revenueGrowthRate = num(income_data.revenue_growth_rate) || 3;
    const expenseGrowthRate = 2;
    
    const projections = [];
    // For VAT payers: input VAT on purchase is refundable → reduces effective equity at t=0
    const effectiveEquityForIRR = isVatPayer ? totalEquity - vatOnPurchase : totalEquity;
    const irrComputable = effectiveEquityForIRR > 0;
    const cashFlowsForIRR = [-(irrComputable ? effectiveEquityForIRR : totalEquity)];
    const cashFlowsForIRRAfterTax = [-(irrComputable ? effectiveEquityForIRR : totalEquity)];
    let cumulativeCashFlow = 0;
    let cumulativeCashFlowAfterTax = 0;
    let remainingLoanBalance = loanAmount;
    let currentPropertyValue = purchasePrice;
    let currentRevenue = netAnnualRevenue;
    let currentOpex = totalAnnualOperatingExpenses;
    
    for (let year = 1; year <= 10; year++) {
        if (year > 1) {
            currentPropertyValue *= (1 + appreciationRate / 100);
            currentRevenue *= (1 + revenueGrowthRate / 100);
            currentOpex *= (1 + expenseGrowthRate / 100);
        }
        
        const yearNOI = currentRevenue - currentOpex;
        const yearCashFlow = yearNOI - annualDebtService;
        cumulativeCashFlow += yearCashFlow;
        
        // Tax calculation for this year
        let yearInterest = 0;
        let tempBalance = remainingLoanBalance;
        for (let month = 1; month <= 12; month++) {
            const interest = tempBalance * monthlyInterestRate;
            yearInterest += interest;
            const principal = monthlyMortgagePayment - interest;
            tempBalance -= principal;
        }
        
        const yearDepreciation = purchasePrice * (depreciationRate / 100);
        const yearTaxableIncome = Math.max(0, yearNOI - yearInterest - yearDepreciation);
        const yearIncomeTax = yearTaxableIncome * (effectiveTaxRate / 100);
        const yearCashFlowAfterTax = yearCashFlow - yearIncomeTax;
        cumulativeCashFlowAfterTax += yearCashFlowAfterTax;
        
        let yearPrincipalPaid = 0;
        let tempLoanBalance = remainingLoanBalance;
        if (monthlyMortgagePayment > 0) {
            for (let month = 1; month <= 12; month++) {
                const interestPayment = tempLoanBalance * monthlyInterestRate;
                const principalPayment = Math.max(0, monthlyMortgagePayment - interestPayment);
                yearPrincipalPaid += principalPayment;
                tempLoanBalance = Math.max(0, tempLoanBalance - principalPayment);
            }
        }
        remainingLoanBalance = tempLoanBalance;
        
        const equity = currentPropertyValue - remainingLoanBalance;
        const cumulativeROI = totalEquity > 0 ? (cumulativeCashFlow / totalEquity) * 100 : 0;
        const cumulativeROIAfterTax = totalEquity > 0 ? (cumulativeCashFlowAfterTax / totalEquity) * 100 : 0;
        
        projections.push({
            year,
            gross_revenue: currentRevenue,
            operating_expenses: currentOpex,
            debt_service: annualDebtService,
            net_cash_flow: yearCashFlow,
            income_tax: yearIncomeTax,
            net_cash_flow_after_tax: yearCashFlowAfterTax,
            cumulative_cash_flow: cumulativeCashFlow,
            cumulative_cash_flow_after_tax: cumulativeCashFlowAfterTax,
            property_value: currentPropertyValue,
            loan_balance: remainingLoanBalance,
            equity: equity,
            principal_paid: yearPrincipalPaid,
            cumulative_roi: cumulativeROI,
            cumulative_roi_after_tax: cumulativeROIAfterTax
        });
        
        // For IRR: Years 1-9 are just cash flows, Year 10 includes exit
        const exitEquityY10 = Math.max(0, equity); // guard: can't be negative
        if (year < 10) {
            cashFlowsForIRR.push(yearCashFlow);
            cashFlowsForIRRAfterTax.push(yearCashFlowAfterTax);
        } else {
            // Year 10: cash flow + exit equity
            cashFlowsForIRR.push(yearCashFlow + exitEquityY10);
            cashFlowsForIRRAfterTax.push(yearCashFlowAfterTax + exitEquityY10);
        }
    }
    
    const year10 = projections[9];
    const totalCashFlows = year10.cumulative_cash_flow;
    const totalCashFlowsAfterTax = year10.cumulative_cash_flow_after_tax;
    const finalEquity = year10.equity;
    const totalReturn = totalCashFlows + finalEquity;
    const totalReturnAfterTax = totalCashFlowsAfterTax + finalEquity;
    const overallROI = totalEquity > 0 ? ((totalReturn - totalEquity) / totalEquity) * 100 : 0;
    const overallROIAfterTax = totalEquity > 0 ? ((totalReturnAfterTax - totalEquity) / totalEquity) * 100 : 0;
    const irr = irrComputable ? calculateIRR(cashFlowsForIRR) : null;
    const irrAfterTax = irrComputable ? calculateIRR(cashFlowsForIRRAfterTax) : null;
    const equityMultiple = totalEquity > 0 ? totalReturn / totalEquity : 0;
    const equityMultipleAfterTax = totalEquity > 0 ? totalReturnAfterTax / totalEquity : 0;
    
    let paybackPeriod = null;
    for (let i = 0; i < projections.length; i++) {
        if (projections[i].cumulative_cash_flow >= totalEquity) {
            paybackPeriod = i + 1;
            break;
        }
    }
    if (paybackPeriod === null) paybackPeriod = '>10';

    // === EXPENSE BREAKDOWN FOR PIE CHART - WITH TRANSLATIONS ===
    const expenseLabels = {
        en: {
            cleaning: 'Cleaning',
            supplies: 'Supplies',
            utilities: 'Utilities',
            maintenance: 'Maintenance',
            property_mgmt: 'Property Mgmt',
            platform_fees: 'Platform Fees',
            insurance: 'Insurance',
            property_tax: 'Property Tax',
            hoa: 'HOA',
            other: 'Other'
        },
        sk: {
            cleaning: 'Upratovanie',
            supplies: 'Spotrebný materiál',
            utilities: 'Energie',
            maintenance: 'Údržba',
            property_mgmt: 'Správa nehnuteľnosti',
            platform_fees: 'Poplatky platformám',
            insurance: 'Poistenie',
            property_tax: 'Daň z nehnuteľnosti',
            hoa: 'Poplatky HOA',
            other: 'Ostatné'
        }
    };
    
    const labels = expenseLabels[language] || expenseLabels.en;
    
    // totalOpexForBreakdown now includes platformFees for the pie chart
    const totalOpexForBreakdown = totalAnnualOperatingExpenses + platformFees;
    
    const expenseBreakdown = [
        { name: labels.cleaning, value: annualCleaningCosts, percentage: totalOpexForBreakdown > 0 ? ((annualCleaningCosts / totalOpexForBreakdown) * 100).toFixed(1) : '0' },
        { name: labels.supplies, value: annualSupplies, percentage: totalOpexForBreakdown > 0 ? ((annualSupplies / totalOpexForBreakdown) * 100).toFixed(1) : '0' },
        { name: labels.utilities, value: annualUtilities, percentage: totalOpexForBreakdown > 0 ? ((annualUtilities / totalOpexForBreakdown) * 100).toFixed(1) : '0' },
        { name: labels.maintenance, value: annualMaintenance, percentage: totalOpexForBreakdown > 0 ? ((annualMaintenance / totalOpexForBreakdown) * 100).toFixed(1) : '0' },
        { name: labels.property_mgmt, value: annualPropertyManagement, percentage: totalOpexForBreakdown > 0 ? ((annualPropertyManagement / totalOpexForBreakdown) * 100).toFixed(1) : '0' },
        { name: labels.platform_fees, value: platformFees, percentage: totalOpexForBreakdown > 0 ? ((platformFees / totalOpexForBreakdown) * 100).toFixed(1) : '0' },
        { name: labels.insurance, value: annualInsurance, percentage: totalOpexForBreakdown > 0 ? ((annualInsurance / totalOpexForBreakdown) * 100).toFixed(1) : '0' },
        { name: labels.property_tax, value: annualPropertyTax, percentage: totalOpexForBreakdown > 0 ? ((annualPropertyTax / totalOpexForBreakdown) * 100).toFixed(1) : '0' },
        { name: labels.hoa, value: annualHOA, percentage: totalOpexForBreakdown > 0 ? ((annualHOA / totalOpexForBreakdown) * 100).toFixed(1) : '0' },
        { name: labels.other, value: otherExpenses, percentage: totalOpexForBreakdown > 0 ? ((otherExpenses / totalOpexForBreakdown) * 100).toFixed(1) : '0' }
    ].filter(item => item.value > 0);

    return {
        kpis: {
            total_investment: totalInvestment,
            total_equity: totalEquity,
            down_payment: downPayment,
            loan_amount: loanAmount,
            monthly_mortgage_payment: monthlyMortgagePayment,
            annual_debt_service: annualDebtService,
            
            avg_nightly_rate: avgNightlyRate,
            occupancy_rate: occupancyRate,
            nights_booked: nightsPerYear,
            gross_annual_revenue: grossAnnualRevenue,
            platform_fees: platformFees,
            net_annual_revenue: netAnnualRevenue,
            
            total_annual_operating_expenses: totalAnnualOperatingExpenses,
            net_operating_income: netOperatingIncome,
            annual_cash_flow: annualCashFlow,
            monthly_cash_flow: monthlyCashFlow,
            
            // TAX ANALYSIS (NEW!)
            entity_type: entity_type,
            effective_tax_rate: effectiveTaxRate,
            annual_depreciation: annualDepreciation,
            annual_interest_deduction: firstYearInterest,
            taxable_income: taxableIncome,
            annual_income_tax: annualIncomeTax,
            tax_benefit_from_interest: taxBenefitFromInterest,
            tax_benefit_from_depreciation: taxBenefitFromDepreciation,
            total_tax_benefit: totalTaxBenefit,
            annual_cash_flow_after_tax: annualCashFlowAfterTax,
            monthly_cash_flow_after_tax: monthlyCashFlowAfterTax,
            
            revPAN: revPAN,
            cap_rate: capRate,
            cash_on_cash_return: cashOnCashReturn,
            cash_on_cash_return_after_tax: cashOnCashReturnAfterTax,
            dscr: dscr,
            gross_yield: grossYield,
            net_yield: netYield,
            break_even_occupancy: breakEvenOccupancy,
            
            long_term_rental_equivalent: annualLongTermRent,
            airbnb_premium: airbnbPremium,
            
            roi_10_year: overallROI,
            roi_10_year_after_tax: overallROIAfterTax,
            irr: irr,
            irr_after_tax: irrAfterTax,
            equity_multiple: equityMultiple,
            equity_multiple_after_tax: equityMultipleAfterTax,
            payback_period: paybackPeriod,

            gross_rental_income: grossAnnualRevenue,
            annual_cleaning_costs: annualCleaningCosts,
            annual_utilities: annualUtilities,
            annual_supplies: annualSupplies,
            annual_property_tax: annualPropertyTax,
            annual_insurance: annualInsurance,
            annual_maintenance: annualMaintenance,
            annual_platform_fees: platformFees,
            annual_other_costs: otherExpenses,

            // VAT Analysis
            is_vat_payer: isVatPayer,
            vat_rate: isVatPayer ? vatRate : 0,
            vat_on_purchase: vatOnPurchase,
            annual_output_vat: annualOutputVat,
        },
        cashFlowProjection: projections,
        equityBuildup: projections,
        roiProgression: projections.map(p => ({
            year: p.year,
            roi: p.cumulative_roi
        })),
        expense_breakdown: expenseBreakdown,
    };
}