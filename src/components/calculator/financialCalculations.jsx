export function calculateNPV(discountRate, initialInvestment, cashFlows) {
    let npv = -initialInvestment;
    for (let i = 0; i < cashFlows.length; i++) {
        npv += cashFlows[i] / Math.pow(1 + discountRate, i + 1);
    }
    return npv;
}

/**
 * Robust IRR calculation using Newton-Raphson method.
 * Accepts a full cash-flow array (index 0 = year 0, typically negative investment).
 * Returns IRR as a percentage (e.g. 12.5 for 12.5%), or null if it cannot converge.
 */
export function calculateIRR(cashFlows, guess = 0.1) {
    const maxIterations = 100;
    const tolerance = 0.00001;
    const epsilon = 1e-10;

    // Must have both positive and negative cash flows for a valid IRR
    const hasPositive = cashFlows.some(cf => cf > 0);
    const hasNegative = cashFlows.some(cf => cf < 0);
    if (!hasPositive || !hasNegative) return null;

    let rate = guess;

    for (let i = 0; i < maxIterations; i++) {
        let npv = 0;
        let dnpv = 0;

        for (let t = 0; t < cashFlows.length; t++) {
            const denom = Math.pow(1 + rate, t);
            npv += cashFlows[t] / denom;
            dnpv -= (t * cashFlows[t]) / Math.pow(1 + rate, t + 1);
        }

        if (Math.abs(dnpv) < epsilon) break;

        const newRate = rate - npv / dnpv;
        if (Math.abs(newRate - rate) < tolerance) {
            return isFinite(newRate) ? newRate * 100 : null;
        }
        rate = newRate;
    }

    return null;
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