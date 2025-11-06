// Helper function to calculate IRR using Newton-Raphson method
function calculateIRR(cashFlows, guess = 0.1) {
    const maxIterations = 100;
    const tolerance = 0.00001;
    let rate = guess;
    
    for (let i = 0; i < maxIterations; i++) {
        let npv = 0;
        let dnpv = 0;
        
        for (let t = 0; t < cashFlows.length; t++) {
            const denominator = Math.pow(1 + rate, t);
            npv += cashFlows[t] / denominator;
            dnpv -= (t * cashFlows[t]) / Math.pow(1 + rate, t + 1);
        }
        
        const newRate = rate - npv / dnpv;
        
        if (Math.abs(newRate - rate) < tolerance) {
            return newRate * 100; // Return as percentage
        }
        
        rate = newRate;
    }
    
    return 0; // If no convergence, return 0
}

export function calculateLongTermLease(projectData, preset, language = 'en') {
    const {
        property_data = {},
        financing_data = {},
        initial_costs_data = {},
        operating_data = {},
        entity_type
    } = projectData;

    // Helper function to ensure number
    const num = (value) => {
        const parsed = Number(value);
        return isNaN(parsed) ? 0 : parsed;
    };

    // === INPUTS ===
    const purchasePrice = num(property_data.purchase_price);
    const monthlyRent = num(property_data.monthly_rent);
    const annualRent = monthlyRent * 12;
    
    // Initial costs
    const legalFees = num(initial_costs_data.legal_fees);
    const realEstateCommission = num(initial_costs_data.real_estate_commission);
    const notaryFees = num(initial_costs_data.notary_fees);
    const renovationCosts = num(initial_costs_data.renovation_costs);
    const furnishingCosts = num(initial_costs_data.furnishing_costs);
    const otherCosts = num(initial_costs_data.other_costs);
    const totalInitialCosts = legalFees + realEstateCommission + notaryFees + renovationCosts + furnishingCosts + otherCosts;
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
    if (loanAmount > 0 && monthlyInterestRate > 0) {
        monthlyMortgagePayment = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
                                 (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
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
    const netOperatingIncome = effectiveGrossIncome - totalAnnualOperatingExpenses;
    const annualCashFlow = netOperatingIncome - annualDebtService;
    const monthlyCashFlow = annualCashFlow / 12;
    
    // === ADVANCED METRICS ===
    
    // 1. Cap Rate (Capitalization Rate)
    const capRate = purchasePrice > 0 ? (netOperatingIncome / purchasePrice) * 100 : 0;
    
    // 2. Cash-on-Cash Return (Year 1) - based on TOTAL EQUITY (down payment + initial costs)
    const cashOnCashReturn = totalEquity > 0 ? (annualCashFlow / totalEquity) * 100 : 0;
    
    // 3. Debt Service Coverage Ratio (DSCR)
    const dscr = annualDebtService > 0 ? netOperatingIncome / annualDebtService : 0;
    
    // 4. Gross Rental Yield
    const grossRentalYield = purchasePrice > 0 ? (annualRent / purchasePrice) * 100 : 0;
    
    // 5. Net Rental Yield
    const netRentalYield = purchasePrice > 0 ? (netOperatingIncome / purchasePrice) * 100 : 0;
    
    // 6. Break-Even Occupancy
    const breakEvenOccupancy = annualRent > 0 ? ((totalAnnualOperatingExpenses + annualDebtService) / annualRent) * 100 : 0;
    
    // === 10-YEAR PROJECTIONS ===
    const appreciationRate = num(operating_data.appreciation_rate) || 2;
    const rentGrowthRate = num(operating_data.rent_growth_rate) || 2;
    const expenseGrowthRate = 2;
    
    const projections = [];
    const cashFlowsForIRR = [-totalEquity]; // Year 0: initial investment (negative)
    let cumulativeCashFlow = 0;
    let remainingLoanBalance = loanAmount;
    let currentPropertyValue = purchasePrice;
    let currentRent = annualRent;
    let currentOpex = totalAnnualOperatingExpenses;
    
    for (let year = 1; year <= 10; year++) {
        if (year > 1) {
            currentPropertyValue *= (1 + appreciationRate / 100);
            currentRent *= (1 + rentGrowthRate / 100);
            currentOpex *= (1 + expenseGrowthRate / 100);
        }
        
        const yearEffectiveIncome = currentRent * (1 - vacancyRate / 100);
        const yearNOI = yearEffectiveIncome - currentOpex;
        const yearCashFlow = yearNOI - annualDebtService;
        cumulativeCashFlow += yearCashFlow;
        
        let yearPrincipalPaid = 0;
        let tempLoanBalance = remainingLoanBalance;
        if (monthlyMortgagePayment > 0 && monthlyInterestRate > 0) {
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
        
        projections.push({
            year,
            gross_income: yearEffectiveIncome,
            operating_expenses: currentOpex,
            debt_service: annualDebtService,
            net_cash_flow: yearCashFlow,
            cumulative_cash_flow: cumulativeCashFlow,
            property_value: currentPropertyValue,
            loan_balance: remainingLoanBalance,
            equity: equity,
            principal_paid: yearPrincipalPaid,
            cumulative_roi: cumulativeROI
        });
        
        // For IRR calculation: Years 1-9 are just cash flows, Year 10 includes sale proceeds
        if (year < 10) {
            cashFlowsForIRR.push(yearCashFlow);
        } else {
            // Year 10: cash flow + equity from sale (property value - remaining loan)
            cashFlowsForIRR.push(yearCashFlow + equity);
        }
    }
    
    // === OVERALL ROI & IRR ===
    const year10 = projections[9];
    const totalCashFlows = year10.cumulative_cash_flow;
    const finalEquity = year10.equity;
    const totalReturn = totalCashFlows + finalEquity;
    const overallROI = totalEquity > 0 ? ((totalReturn - totalEquity) / totalEquity) * 100 : 0;
    
    // CORRECTED IRR CALCULATION using Newton-Raphson method
    const irr = calculateIRR(cashFlowsForIRR);
    
    const equityMultiple = totalEquity > 0 ? totalReturn / totalEquity : 0;
    
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
            
            cap_rate: capRate,
            cash_on_cash_return: cashOnCashReturn,
            dscr: dscr,
            gross_rental_yield: grossRentalYield,
            net_rental_yield: netRentalYield,
            break_even_occupancy: breakEvenOccupancy,
            
            roi_10_year: overallROI,
            irr: irr,
            equity_multiple: equityMultiple,
            payback_period: paybackPeriod,
        },
        projections,
        expense_breakdown: expenseBreakdown,
        cash_flow_monthly: []
    };
}