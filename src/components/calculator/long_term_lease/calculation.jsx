import { calculateIRR } from '../financialCalculations';
import { resolveEntityType, calculateTax } from '../skTaxUtils';

export function calculateLongTermLease(projectData, preset, language = 'en') {
    const {
        property_data = {},
        financing_data = {},
        initial_costs_data = {},
        operating_data = {},
    } = projectData;

    // entity_type is a top-level field on projectData
    // For SK: resolve to granular sub-type (FO_rental default for long_term_lease)
    const entity_type = resolveEntityType(
        projectData.entity_type,
        'long_term_lease',
        projectData.country || 'SK'
    );

    // Helper function to ensure number
    const num = (value) => {
        const parsed = Number(value);
        return isNaN(parsed) ? 0 : parsed;
    };

    // === VAT SETTINGS ===
    // Long-term residential rental is typically VAT exempt.
    // However, the toggle is available for edge cases (e.g. commercial-use properties).
    const isVatPayer = operating_data.is_vat_payer === true;
    const vatRate = num(operating_data.vat_rate) || num(preset?.vat_rate) || 20;
    const vatMultiplier = 1 + (vatRate / 100);

    // === INPUTS ===
    // If VAT payer, purchase price is entered as gross → we deduct VAT to get net (reclaimable)
    const purchasePriceGross = num(property_data.purchase_price);
    const purchasePrice = isVatPayer ? purchasePriceGross / vatMultiplier : purchasePriceGross;
    const vatOnPurchase = isVatPayer ? purchasePriceGross - purchasePrice : 0;
    
    const monthlyRent = num(property_data.monthly_rent);
    const annualRent = monthlyRent * 12;
    
    // Initial costs
    const acquisitionCosts = num(initial_costs_data.acquisition_costs);
    const renovationCosts = num(initial_costs_data.renovation_costs);
    const furnishingCosts = num(initial_costs_data.furnishing_costs);
    const otherInitialCosts = num(initial_costs_data.other_initial_costs);
    const totalInitialCosts = acquisitionCosts + renovationCosts + furnishingCosts + otherInitialCosts;
    const totalInvestment = purchasePrice + totalInitialCosts;
    
    // === FINANCING - CORRECTED ===
    const downPaymentPercent = num(financing_data.down_payment_percent) || 20;
    const loanTerm = num(financing_data.loan_term) || 30;
    const interestRate = num(financing_data.interest_rate) || 3.5;
    
    // Down payment is percentage of PURCHASE PRICE only, not total investment
    const downPayment = purchasePrice * (downPaymentPercent / 100);
    const loanAmount = purchasePrice - downPayment;
    // User must cover initial costs + down payment from their own funds
    const totalEquity = downPayment + totalInitialCosts;
    
    // Calculate monthly mortgage payment (P&I)
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
    
    // Operating expenses
    const propertyTax = num(operating_data.property_tax) || 0;
    const insurance = num(operating_data.insurance) || 0;
    const hoa = num(operating_data.hoa) || 0;
    const maintenance = num(operating_data.maintenance) || 0;
    const propertyManagement = num(operating_data.property_management) || 0;
    const utilities = num(operating_data.utilities) || 0;
    const otherExpenses = num(operating_data.other_expenses) || 0;
    const vacancyRate = num(operating_data.vacancy_rate) || 5;
    
    const annualPropertyTax = (purchasePrice * propertyTax) / 100;
    const annualInsurance = insurance * 12;
    const annualHOA = hoa * 12;
    const annualMaintenance = (purchasePrice * maintenance) / 100;
    const annualPropertyManagement = (annualRent * propertyManagement) / 100;
    const annualUtilities = utilities * 12;
    const annualVacancyLoss = (annualRent * vacancyRate) / 100;
    
    const totalAnnualOperatingExpenses = annualPropertyTax + annualInsurance + annualHOA + 
                                         annualMaintenance + annualPropertyManagement + 
                                         annualUtilities + otherExpenses + annualVacancyLoss;
    
    // === CORE METRICS ===
    const effectiveGrossIncome = annualRent - annualVacancyLoss;
    // NOI = EGI minus all operating expenses (excl. vacancy – already deducted above)
    const operatingExpensesExclVacancy = annualPropertyTax + annualInsurance + annualHOA +
                                         annualMaintenance + annualPropertyManagement +
                                         annualUtilities + otherExpenses;
    const netOperatingIncome = effectiveGrossIncome - operatingExpensesExclVacancy;
    const annualCashFlow = netOperatingIncome - annualDebtService;
    const monthlyCashFlow = annualCashFlow / 12;
    
    // === TAX CALCULATIONS (NEW!) ===
    const corporateTaxRate = num(preset?.corporate_tax_rate) || 21;
    const incomeTaxRateFO = num(preset?.income_tax_rate_fo) || 25;
    const depreciationRate = num(preset?.depreciation_rate) || 2;
    
    // Annual depreciation
    const annualDepreciation = purchasePrice * (depreciationRate / 100);
    
    // First year interest (changes each year as principal is paid down)
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
    
    // Tax rate based on entity type (SK-aware)
    const { incomeTax: annualIncomeTax, levies: annualLevies, totalTax: annualTotalTax, effectiveTaxRate, levyRate } = calculateTax(taxableIncome, entity_type, preset);
    
    // Cash flow after tax (income tax + levies)
    const annualCashFlowAfterTax = annualCashFlow - annualTotalTax;
    const monthlyCashFlowAfterTax = annualCashFlowAfterTax / 12;
    
    // Tax benefits
    const taxBenefitFromInterest = firstYearInterest * (effectiveTaxRate / 100);
    const taxBenefitFromDepreciation = annualDepreciation * (effectiveTaxRate / 100);
    const totalTaxBenefit = taxBenefitFromInterest + taxBenefitFromDepreciation;
    
    // === ADVANCED METRICS ===
    
    // 1. Cap Rate (Capitalization Rate)
    const capRate = purchasePrice > 0 ? (netOperatingIncome / purchasePrice) * 100 : 0;
    
    // 2. Cash-on-Cash Return (Year 1) - based on TOTAL EQUITY
    const cashOnCashReturn = totalEquity > 0 ? (annualCashFlow / totalEquity) * 100 : 0;
    const cashOnCashReturnAfterTax = totalEquity > 0 ? (annualCashFlowAfterTax / totalEquity) * 100 : 0;
    
    // 3. Debt Service Coverage Ratio (DSCR)
    const dscr = annualDebtService > 0 ? netOperatingIncome / annualDebtService : null;
    
    // 4. Gross Rental Yield
    const grossRentalYield = purchasePrice > 0 ? (annualRent / purchasePrice) * 100 : 0;
    
    // 5. Net Rental Yield
    const netRentalYield = purchasePrice > 0 ? (netOperatingIncome / purchasePrice) * 100 : 0;
    
    // 6. Break-Even Occupancy
    const breakEvenOccupancy = annualRent > 0 ? ((totalAnnualOperatingExpenses + annualDebtService) / annualRent) * 100 : 0;
    
    // === 10-YEAR PROJECTIONS WITH TAX ===
    const appreciationRate = num(operating_data.appreciation_rate) || 2;
    const rentGrowthRate = num(operating_data.rent_growth_rate) || 2;
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
    let currentRent = annualRent;
    // Track opex WITHOUT vacancy (vacancy handled separately each year)
    let currentOpexExclVacancy = operatingExpensesExclVacancy;
    
    for (let year = 1; year <= 10; year++) {
        if (year > 1) {
            currentPropertyValue *= (1 + appreciationRate / 100);
            currentRent *= (1 + rentGrowthRate / 100);
            currentOpexExclVacancy *= (1 + expenseGrowthRate / 100);
        }
        
        // Vacancy deducted once from gross rent → effective income
        const yearEffectiveIncome = currentRent * (1 - vacancyRate / 100);
        // NOI = EGI - opex (vacancy already excluded from EGI, not counted again in opex)
        const yearNOI = yearEffectiveIncome - currentOpexExclVacancy;
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
        const { totalTax: yearIncomeTax } = calculateTax(yearTaxableIncome, entity_type, preset);
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
            gross_income: yearEffectiveIncome,
            operating_expenses: currentOpexExclVacancy,
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
    
    // === OVERALL ROI & IRR ===
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
    const totalOpex = annualPropertyTax + annualInsurance + annualHOA + annualMaintenance + 
                      annualPropertyManagement + annualUtilities + otherExpenses + annualVacancyLoss;
    
    const expenseLabels = {
        en: {
            property_tax: 'Property Tax',
            insurance: 'Insurance',
            hoa: 'HOA',
            maintenance: 'Maintenance',
            property_mgmt: 'Property Mgmt',
            utilities: 'Utilities',
            vacancy_loss: 'Vacancy Loss',
            other: 'Other'
        },
        sk: {
            property_tax: 'Daň z nehnuteľnosti',
            insurance: 'Poistenie',
            hoa: 'HOA',
            maintenance: 'Údržba',
            property_mgmt: 'Správa nehnuteľnosti',
            utilities: 'Energie',
            vacancy_loss: 'Strata z neobsadenosti',
            other: 'Ostatné'
        }
    };
    
    const labels = expenseLabels[language] || expenseLabels.en;
    
    const expenseBreakdown = [
        { name: labels.property_tax, value: annualPropertyTax, percentage: totalOpex > 0 ? ((annualPropertyTax / totalOpex) * 100).toFixed(1) : 0 },
        { name: labels.insurance, value: annualInsurance, percentage: totalOpex > 0 ? ((annualInsurance / totalOpex) * 100).toFixed(1) : 0 },
        { name: labels.hoa, value: annualHOA, percentage: totalOpex > 0 ? ((annualHOA / totalOpex) * 100).toFixed(1) : 0 },
        { name: labels.maintenance, value: annualMaintenance, percentage: totalOpex > 0 ? ((annualMaintenance / totalOpex) * 100).toFixed(1) : 0 },
        { name: labels.property_mgmt, value: annualPropertyManagement, percentage: totalOpex > 0 ? ((annualPropertyManagement / totalOpex) * 100).toFixed(1) : 0 },
        { name: labels.utilities, value: annualUtilities, percentage: totalOpex > 0 ? ((annualUtilities / totalOpex) * 100).toFixed(1) : 0 },
        { name: labels.vacancy_loss, value: annualVacancyLoss, percentage: totalOpex > 0 ? ((annualVacancyLoss / totalOpex) * 100).toFixed(1) : 0 },
        { name: labels.other, value: otherExpenses, percentage: totalOpex > 0 ? ((otherExpenses / totalOpex) * 100).toFixed(1) : 0 }
    ].filter(item => item.value > 0);
    
    // === RETURN RESULTS ===
    return {
        kpis: {
            total_investment: totalInvestment,
            total_equity: totalEquity,
            down_payment: downPayment,
            loan_amount: loanAmount,
            monthly_mortgage_payment: monthlyMortgagePayment,
            annual_debt_service: annualDebtService,
            
            annual_rent: annualRent,
            effective_gross_income: effectiveGrossIncome,
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
            
            cap_rate: capRate,
            cash_on_cash_return: cashOnCashReturn,
            cash_on_cash_return_after_tax: cashOnCashReturnAfterTax,
            dscr: dscr,
            gross_rental_yield: grossRentalYield,
            net_rental_yield: netRentalYield,
            break_even_occupancy: breakEvenOccupancy,
            
            roi_10_year: overallROI,
            roi_10_year_after_tax: overallROIAfterTax,
            irr: irr,
            irr_after_tax: irrAfterTax,
            equity_multiple: equityMultiple,
            equity_multiple_after_tax: equityMultipleAfterTax,
            payback_period: paybackPeriod,

            annual_property_tax: annualPropertyTax,
            annual_insurance: annualInsurance,
            annual_hoa: annualHOA,
            annual_maintenance: annualMaintenance,
            annual_management_fee: annualPropertyManagement,
            annual_utilities: annualUtilities,
            annual_other_costs: otherExpenses,
            year_10_equity: finalEquity,
        acquisition_costs: acquisitionCosts,
        renovation_costs: renovationCosts,
        furnishing_costs: furnishingCosts,
        other_initial_costs: otherInitialCosts,

        // VAT info
        is_vat_payer: isVatPayer,
        vat_rate: isVatPayer ? vatRate : 0,
        vat_on_purchase: vatOnPurchase,
        },
        cashFlowProjection: projections,
        equityBuildup: projections,
        expense_breakdown: expenseBreakdown,
    };
}