
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Save, FileText } from 'lucide-react';

export default function ResultsHeader({ language = 'en' }) {
    const translations = {
        en: {
            results_title: "Analysis Results",
            key_metrics: "Key Financial Metrics",
        },
        sk: {
            results_title: "Výsledky analýzy",
            key_metrics: "Kľúčové finančné ukazovatele",
        },
        pl: {
            results_title: "Wyniki analizy",
            key_metrics: "Kluczowe wskaźniki finansowe",
        },
        hu: {
            results_title: "Elemzési eredmények",
            key_metrics: "Kulcsfontosságú pénzügyi mutatók",
        },
        de: {
            results_title: "Analyseergebnisse",
            key_metrics: "Wichtige Finanzkennzahlen",
        }
    };

    const t = translations[language] || translations.en;

    return (
        <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground">{t.results_title}</h2>
            <p className="text-muted-foreground">{t.key_metrics}</p>
        </div>
    );
}
