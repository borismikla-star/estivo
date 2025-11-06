export function calculateNPV(discountRate, initialInvestment, cashFlows) {
    let npv = -initialInvestment;
    for (let i = 0; i < cashFlows.length; i++) {
        npv += cashFlows[i] / Math.pow(1 + discountRate, i + 1);
    }
    return npv;
}

export function calculateIRR(initialInvestment, cashFlows, guess = 0.1, maxIterations = 100, tolerance = 1e-6) {
    let rate = guess;
    for (let i = 0; i < maxIterations; i++) {
        let npv = -initialInvestment;
        let derivative = 0;
        for (let t = 0; t < cashFlows.length; t++) {
            npv += cashFlows[t] / Math.pow(1 + rate, t + 1);
            derivative -= (t + 1) * cashFlows[t] / Math.pow(1 + rate, t + 2);
        }
        if (Math.abs(npv) < tolerance) {
            return rate * 100;
        }
        if (derivative === 0) { // Avoid division by zero
            return null;
        }
        rate -= npv / derivative;
    }
    return null; // Failed to converge
}

export function calculatePaybackPeriod(initialInvestment, cashFlows) {
    let cumulativeCashFlow = -initialInvestment;
    for (let i = 0; i < cashFlows.length; i++) {
        const cashFlow = cashFlows[i];
        if (cumulativeCashFlow + cashFlow >= 0) {
            return (i + 1) + (-cumulativeCashFlow / cashFlow) - 1;
        }
        cumulativeCashFlow += cashFlow;
    }
    return null; // Payback not achieved within the period
}