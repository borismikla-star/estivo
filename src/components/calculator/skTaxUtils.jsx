/**
 * Slovak tax utility functions for SK-specific entity type logic.
 * 
 * Entity types for SK:
 *   FO_rental   – FO pasívny príjem z prenájmu (§6 ods.3) – daň, bez odvodov
 *   FO_business – FO podnikanie / SZČO (§6 ods.1,2) – daň + odvody
 *   PO          – Právnická osoba – daň z príjmu PO, bez odvodov
 * 
 * For non-SK countries, entity_type remains 'FO' or 'PO' (legacy behaviour).
 */

/**
 * Returns the Slovak PO (corporate) tax rate based on annual revenue (tržby).
 * SK 2026 (za rok 2025):
 *   ≤ 100 000 EUR  → 10%
 *   ≤ 5 000 000 EUR → 21%
 *   >  5 000 000 EUR → 24%
 * @param {number} annualRevenue - annual revenue / tržby in EUR
 * @returns {number} tax rate in %
 */
export function getSkPoCorporateTaxRate(annualRevenue) {
    const rev = Math.max(0, annualRevenue);
    if (rev <= 100000) return 10;
    if (rev <= 5000000) return 21;
    return 24;
}

/**
 * Returns the effective income tax rate for the given entity type and preset.
 * For SK PO, uses progressive rate based on annualRevenue if provided.
 * @param {string} entityType - 'FO' | 'FO_rental' | 'FO_business' | 'PO'
 * @param {object} preset - CountryPreset object
 * @param {number} [annualRevenue] - annual revenue (used for SK PO progressive rate)
 * @returns {number} tax rate in %
 */
export function getIncomeTaxRate(entityType, preset, annualRevenue = 0) {
    const num = (v) => { const p = Number(v); return isNaN(p) ? 0 : p; };
    if (entityType === 'PO') {
        // SK uses progressive corporate tax based on revenue
        if (preset?.country_code === 'SK' || !preset?.country_code) {
            // Also apply SK progressive rate when no country is set (default behaviour)
            return getSkPoCorporateTaxRate(annualRevenue);
        }
        return num(preset?.corporate_tax_rate) || 21;
    }
    // FO, FO_rental, FO_business all use FO income tax rate
    return num(preset?.income_tax_rate_fo) || 25;
}

/**
 * Returns the levy (odvody) rate on taxable income for FO-business in SK.
 * Returns 0 for all other entity types or non-SK countries.
 * @param {string} entityType
 * @param {object} preset
 * @returns {number} levy rate in %
 */
export function getLevyRate(entityType, preset) {
    const num = (v) => { const p = Number(v); return isNaN(p) ? 0 : p; };
    if (entityType === 'FO_business' && preset?.country_code === 'SK') {
        return num(preset?.fo_business_levy_rate);
    }
    return 0;
}

/**
 * Calculates total tax (income tax + levies) on taxable income.
 * @param {number} taxableIncome
 * @param {string} entityType
 * @param {object} preset
 * @param {number} [annualRevenue] - annual revenue for SK PO progressive rate
 * @returns {{ incomeTax: number, levies: number, totalTax: number, effectiveTaxRate: number, levyRate: number }}
 */
export function calculateTax(taxableIncome, entityType, preset, annualRevenue = 0) {
    const taxRate = getIncomeTaxRate(entityType, preset, annualRevenue);
    const levyRate = getLevyRate(entityType, preset);

    const positiveIncome = Math.max(0, taxableIncome);
    const incomeTax = positiveIncome * (taxRate / 100);
    const levies = positiveIncome * (levyRate / 100);
    const totalTax = incomeTax + levies;

    return {
        incomeTax,
        levies,
        totalTax,
        effectiveTaxRate: taxRate,
        levyRate,
    };
}

/**
 * Returns whether the entity type is a "business" mode (FO_business or PO),
 * i.e. not passive rental. Used to decide UI rendering.
 */
export function isBusinessMode(entityType) {
    return entityType === 'FO_business' || entityType === 'PO';
}

/**
 * Normalise legacy 'FO' entity type to a specific sub-type based on calculator type.
 * Only applies when country is SK; for other countries returns the value as-is.
 * @param {string} entityType - raw value from projectData
 * @param {string} calcType - 'long_term_lease' | 'airbnb' | 'commercial' | 'development'
 * @param {string} country
 * @returns {string}
 */
export function resolveEntityType(entityType, calcType, country) {
    // If already a granular SK type, return it
    if (entityType === 'FO_rental' || entityType === 'FO_business' || entityType === 'PO') {
        return entityType;
    }
    // For non-SK, keep legacy
    if (country !== 'SK') return entityType || 'FO';
    // For SK with legacy 'FO': apply defaults per calc type
    if (entityType === 'PO') return 'PO';
    if (calcType === 'long_term_lease') return 'FO_rental';
    return 'FO_business'; // airbnb, commercial, development
}