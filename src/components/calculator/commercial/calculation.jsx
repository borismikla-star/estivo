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

export function calculateCommercial(projectData, preset, language = 'en') {
    const {
        property_data = {},
        financing_data = {},
        income_data = {},
        opex_data = {},
        capex_data = {},
        assumptions_data = {},
    } = projectData;

    const num = (value) => {
        const parsed = Number(value);
        return isNaN(parsed) ? 0 : parsed;
    };

    // === VAT SETTINGS ===
    const isVatPayer = assumptions_data.vat_payer || false;
    const vatRate = num(preset?.vat_rate) || 20;
    const vatMultiplier = 1 + (vatRate / 100);

    // === PROPERTY & INVESTMENT ===
    const priceGross = num(property_data.price);
    const acquisitionCostsGross = num(property_data.acquisition_costs);
    
    // If VAT payer, calculate net amounts (can deduct input VAT)
    const price = isVatPayer ? priceGross / vatMultiplier : priceGross;
    const acquisitionCosts = isVatPayer ? acquisitionCostsGross / vatMultiplier : acquisitionCostsGross;
    const totalInvestment = price + acquisitionCosts;
    
    // VAT amounts (for display)
    const vatOnPurchase = isVatPayer ? priceGross - price : 0;
    const vatOnAcquisition = isVatPayer ? acquisitionCostsGross - acquisitionCosts : 0;
    const totalVatDeductible = vatOnPurchase + vatOnAcquisition;

    // === FINANCING - CORRECTED ===
    const downPaymentPercent = num(financing_data.down_payment_percent) || 25;
    const loanTerm = num(financing_data.loan_term) || 25;
    const interestRate = num(financing_data.interest_rate) || 4.5;
    
    // Down payment is on purchase price only
    const downPayment = price * (downPaymentPercent / 100);
    const loanAmount = price - downPayment;
    // Total equity = down payment + acquisition costs
    const totalEquity = downPayment + acquisitionCosts;
    
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    let monthlyMortgagePayment = 0;
    if (loanAmount > 0 && monthlyInterestRate > 0) {
        monthlyMortgagePayment = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
                                 (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    }
    const annualDebtService = monthlyMortgagePayment * 12;

    // === INCOME - WITH REIMBURSEMENTS ===
    const annualRent = num(income_data.annual_rent);
    const camReimbursements = num(income_data.cam_reimbursements) || 0;
    const otherReimbursements = num(income_data.other_reimbursements) || 0;
    const otherIncome = num(income_data.other_income) || 0;
    const vacancyRate = num(income_data.vacancy_rate) || 5;
    const rentEscalationPercent = num(income_data.rent_escalation_percent) || 2;
    
    const potentialGrossIncome = annualRent + camReimbursements + otherReimbursements + otherIncome;
    const vacancyLoss = potentialGrossIncome * (vacancyRate / 100);
    const effectiveGrossIncome = potentialGrossIncome - vacancyLoss;

    // === OPERATING EXPENSES - FIXED! ===
    const propertyTax = num(opex_data.property_tax) || 0;
    const insurance = num(opex_data.insurance) || 0;
    const utilities = num(opex_data.utilities) || 0;
    const maintenance = num(opex_data.maintenance) || 0;
    const propertyManagementPercent = num(opex_data.property_management || opex_data.property_management_fee) || 0;
    const otherExpenses = num(opex_data.other_expenses || opex_data.other_opex) || 0;
    
    const annualPropertyTax = propertyTax;
    const annualInsurance = insurance;
    const annualUtilities = utilities;
    const annualMaintenance = maintenance;
    const annualPropertyManagement = (effectiveGrossIncome * propertyManagementPercent) / 100;
    
    const totalAnnualOperatingExpenses = annualPropertyTax + annualInsurance + annualUtilities + 
                                         annualMaintenance + annualPropertyManagement + otherExpenses;

    // === CAPEX - NEW! ===
    const capexReservePercent = num(capex_data.capex_reserve_percent) || 0;
    const roofReplacement = num(capex_data.roof_replacement) || 0;
    const hvacReplacement = num(capex_data.hvac_replacement) || 0;
    const tenantImprovements = num(capex_data.tenant_improvements) || 0;
    
    // CapEx can be either % of NOI or specific reserves
    const netOperatingIncomeBeforeCapEx = effectiveGrossIncome - totalAnnualOperatingExpenses;
    const capexFromPercent = (netOperatingIncomeBeforeCapEx * capexReservePercent) / 100;
    const capexFromSpecific = roofReplacement + hvacReplacement + tenantImprovements;
    const totalAnnualCapEx = Math.max(capexFromPercent, capexFromSpecific); // Use whichever is higher

    // === CORE METRICS ===
    const netOperatingIncome = netOperatingIncomeBeforeCapEx - totalAnnualCapEx;
    const annualCashFlow = netOperatingIncome - annualDebtService;
    const monthlyCashFlow = annualCashFlow / 12;

    // === ADVANCED METRICS ===
    const capRate = price > 0 ? (netOperatingIncome / price) * 100 : 0;
    const dscr = annualDebtService > 0 ? netOperatingIncome / annualDebtService : 0;
    const cashOnCashReturn = totalEquity > 0 ? (annualCashFlow / totalEquity) * 100 : 0;
    const opexRatio = effectiveGrossIncome > 0 ? (totalAnnualOperatingExpenses / effectiveGrossIncome) * 100 : 0;
    const breakEvenOccupancy = potentialGrossIncome > 0 ? 
        ((totalAnnualOperatingExpenses + totalAnnualCapEx + annualDebtService) / potentialGrossIncome) * 100 : 0;
    const grm = annualRent > 0 ? price / annualRent : 0;

    // === NPV & IRR CALCULATION ===
    const discountRate = num(assumptions_data.discount_rate) || 8;
    const holdingPeriod = num(assumptions_data.holding_period) || 10;
    const exitCapRate = num(assumptions_data.exit_cap_rate) || capRate;
    const appreciationRate = num(assumptions_data.appreciation_rate) || 2;
    const expenseGrowthRate = 2;
    
    // Project cash flows with RENT ESCALATION
    const projections = [];
    const cashFlowsForIRR = [-totalEquity];
    let cumulativeCashFlow = 0;
    let remainingLoanBalance = loanAmount;
    let currentPropertyValue = price;
    let currentRent = annualRent;
    let currentOpex = totalAnnualOperatingExpenses;
    let currentCapEx = totalAnnualCapEx;
    let npvSum = 0;
    
    for (let year = 1; year <= holdingPeriod; year++) {
        if (year > 1) {
            currentPropertyValue *= (1 + appreciationRate / 100);
            currentRent *= (1 + rentEscalationPercent / 100); // Use rent escalation from input
            currentOpex *= (1 + expenseGrowthRate / 100);
            // CapEx grows with OpEx growth
            currentCapEx *= (1 + expenseGrowthRate / 100);
        }
        
        const yearPGI = currentRent + camReimbursements + otherReimbursements + otherIncome;
        const yearVacancy = yearPGI * (vacancyRate / 100);
        const yearEGI = yearPGI - yearVacancy;
        const yearNOI = yearEGI - currentOpex - currentCapEx;
        const yearCashFlow = yearNOI - annualDebtService;
        cumulativeCashFlow += yearCashFlow;
        
        const discountFactor = Math.pow(1 + discountRate / 100, year);
        npvSum += yearCashFlow / discountFactor;
        
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
            gross_income: yearEGI,
            operating_expenses: currentOpex,
            capex: currentCapEx,
            noi: yearNOI,
            debt_service: annualDebtService,
            net_cash_flow: yearCashFlow,
            cumulative_cash_flow: cumulativeCashFlow,
            property_value: currentPropertyValue,
            loan_balance: remainingLoanBalance,
            equity: equity,
            cumulative_roi: cumulativeROI
        });
        
        if (year < holdingPeriod) {
            cashFlowsForIRR.push(yearCashFlow);
        } else {
            const finalYearNOI = yearNOI;
            const exitValue = exitCapRate > 0 ? finalYearNOI / (exitCapRate / 100) : currentPropertyValue;
            const exitEquity = exitValue - remainingLoanBalance;
            cashFlowsForIRR.push(yearCashFlow + exitEquity);
        }
    }
    
    const finalYearNOI = projections[holdingPeriod - 1].noi;
    const exitValue = exitCapRate > 0 ? finalYearNOI / (exitCapRate / 100) : projections[holdingPeriod - 1].property_value;
    const exitEquity = exitValue - projections[holdingPeriod - 1].loan_balance;
    const exitDiscountFactor = Math.pow(1 + discountRate / 100, holdingPeriod);
    const npv = npvSum + (exitEquity / exitDiscountFactor) - totalEquity;
    
    const totalCashFlows = projections[holdingPeriod - 1].cumulative_cash_flow;
    const totalReturn = totalCashFlows + exitEquity;
    const overallROI = totalEquity > 0 ? ((totalReturn - totalEquity) / totalEquity) * 100 : 0;
    const irr = calculateIRR(cashFlowsForIRR);
    const equityMultiple = totalEquity > 0 ? totalReturn / totalEquity : 0;

    // === EXPENSE BREAKDOWN FOR CHARTS ===
    const expenseLabels = {
        en: {
            property_tax: 'Property Tax',
            insurance: 'Insurance',
            utilities: 'Utilities',
            maintenance: 'Maintenance',
            property_mgmt: 'Property Mgmt',
            capex: 'CapEx Reserve',
            other: 'Other'
        },
        sk: {
            property_tax: 'Daň z nehnuteľnosti',
            insurance: 'Poistenie',
            utilities: 'Energie',
            maintenance: 'Údržba',
            property_mgmt: 'Správa nehnuteľnosti',
            capex: 'CapEx rezerva',
            other: 'Ostatné'
        },
        pl: {
            property_tax: 'Podatek od nieruchomości',
            insurance: 'Ubezpieczenie',
            utilities: 'Media',
            maintenance: 'Konserwacja',
            property_mgmt: 'Zarządzanie',
            capex: 'Rezerwa CapEx',
            other: 'Inne'
        },
        hu: {
            property_tax: 'Ingatlanadó',
            insurance: 'Biztosítás',
            utilities: 'Közművek',
            maintenance: 'Karbantartás',
            property_mgmt: 'Ingatlankezelés',
            capex: 'CapEx tartalék',
            other: 'Egyéb'
        },
        de: {
            property_tax: 'Grundsteuer',
            insurance: 'Versicherung',
            utilities: 'Nebenkosten',
            maintenance: 'Instandhaltung',
            property_mgmt: 'Hausverwaltung',
            capex: 'CapEx-Rücklage',
            other: 'Sonstiges'
        }
    };
    
    const labels = expenseLabels[language] || expenseLabels.en;
    
    const totalOpexPlusCapEx = totalAnnualOperatingExpenses + totalAnnualCapEx;

    const expenseBreakdown = [
        { name: labels.property_tax, value: annualPropertyTax, percentage: totalOpexPlusCapEx > 0 ? ((annualPropertyTax / totalOpexPlusCapEx) * 100).toFixed(1) : '0' },
        { name: labels.insurance, value: annualInsurance, percentage: totalOpexPlusCapEx > 0 ? ((annualInsurance / totalOpexPlusCapEx) * 100).toFixed(1) : '0' },
        { name: labels.utilities, value: annualUtilities, percentage: totalOpexPlusCapEx > 0 ? ((annualUtilities / totalOpexPlusCapEx) * 100).toFixed(1) : '0' },
        { name: labels.maintenance, value: annualMaintenance, percentage: totalOpexPlusCapEx > 0 ? ((annualMaintenance / totalOpexPlusCapEx) * 100).toFixed(1) : '0' },
        { name: labels.property_mgmt, value: annualPropertyManagement, percentage: totalOpexPlusCapEx > 0 ? ((annualPropertyManagement / totalOpexPlusCapEx) * 100).toFixed(1) : '0' },
        { name: labels.capex, value: totalAnnualCapEx, percentage: totalOpexPlusCapEx > 0 ? ((totalAnnualCapEx / totalOpexPlusCapEx) * 100).toFixed(1) : '0' },
        { name: labels.other, value: otherExpenses, percentage: totalOpexPlusCapEx > 0 ? ((otherExpenses / totalOpexPlusCapEx) * 100).toFixed(1) : '0' }
    ].filter(item => item.value > 0);

    const roi_10_year = overallROI;

    return {
        kpis: {
            // Investment
            total_investment: totalInvestment,
            total_investment_gross: isVatPayer ? priceGross + acquisitionCostsGross : totalInvestment,
            total_equity: totalEquity,
            down_payment: downPayment,
            loan_amount: loanAmount,
            monthly_mortgage_payment: monthlyMortgagePayment,
            annual_debt_service: annualDebtService,
            
            // VAT Analysis (NEW!)
            is_vat_payer: isVatPayer,
            vat_rate: vatRate,
            vat_on_purchase: vatOnPurchase,
            vat_on_acquisition: vatOnAcquisition,
            total_vat_deductible: totalVatDeductible,
            net_investment_after_vat: totalInvestment,
            
            // Income
            potential_gross_income: potentialGrossIncome,
            effective_gross_income: effectiveGrossIncome,
            vacancy_loss: vacancyLoss,
            annual_rent: annualRent,
            cam_reimbursements: camReimbursements,
            other_reimbursements: otherReimbursements,
            
            // Expenses
            total_annual_operating_expenses: totalAnnualOperatingExpenses,
            annual_property_tax: annualPropertyTax,
            annual_insurance: annualInsurance,
            annual_utilities: annualUtilities,
            annual_maintenance: annualMaintenance,
            annual_management_fee: annualPropertyManagement,
            annual_other_opex: otherExpenses,
            annual_capex: totalAnnualCapEx,
            
            // Performance
            net_operating_income: netOperatingIncome,
            annual_cash_flow: annualCashFlow,
            monthly_cash_flow: monthlyCashFlow,
            
            // Key Ratios
            cap_rate: capRate,
            dscr: dscr,
            cash_on_cash_return: cashOnCashReturn,
            opex_ratio: opexRatio,
            break_even_occupancy: breakEvenOccupancy,
            grm: grm,
            
            // Long-term
            npv: npv,
            irr: irr,
            roi_10_year: roi_10_year,
            exit_value: exitValue,
            exit_equity: exitEquity,
            equity_multiple: equityMultiple,
        },
        cashFlowProjection: projections,
        equityBuildup: projections,
        expense_breakdown: expenseBreakdown,
    };
}