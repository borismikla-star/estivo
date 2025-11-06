export const currencyFormatter = (value, currencyCode = 'EUR', currencySymbol = '€', fractionDigits = 0) => {
    if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) return 'N/A';
    
    try {
        const formatter = new Intl.NumberFormat('en-US', { // Using a neutral locale like en-US
            style: 'currency',
            currency: currencyCode,
            minimumFractionDigits: fractionDigits,
            maximumFractionDigits: fractionDigits,
        });
        
        let parts = formatter.formatToParts(value);
        let valuePart = parts.filter(p => p.type !== 'currency').map(p => p.value).join('');

        return `${currencySymbol}${valuePart}`;

    } catch (e) {
        // Fallback for unsupported currency codes
        return `${currencySymbol}${value.toLocaleString(undefined, { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits })}`;
    }
};

export const percentFormatter = (value, fractionDigits = 1) => {
    if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) return 'N/A';
    return `${value.toFixed(fractionDigits)}%`;
};

export const numberFormatter = (value, fractionDigits = 2) => {
    if (typeof value !== 'number' || !isFinite(value) || isNaN(value)) return 'N/A';
    return value.toFixed(fractionDigits);
};