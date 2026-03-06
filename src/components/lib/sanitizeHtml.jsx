/**
 * Simple client-side HTML sanitizer.
 * Removes script tags, inline JS event handlers, and javascript: hrefs.
 * Used before rendering dangerouslySetInnerHTML content.
 */
export function sanitizeHtml(html) {
    if (!html) return '';

    // Remove <script> tags and their content
    let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Remove on* event handlers (onclick, onload, onerror, etc.)
    sanitized = sanitized.replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '');

    // Remove javascript: in href/src/action attributes
    sanitized = sanitized.replace(/(href|src|action)\s*=\s*(['"])\s*javascript:[^'"]*\2/gi, '$1=$2#$2');

    return sanitized;
}