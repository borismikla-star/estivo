import React from 'react';
import { BarChart3 } from 'lucide-react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

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
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <CardTitle className="text-2xl">{t.results_title}</CardTitle>
                    <CardDescription>{t.key_metrics}</CardDescription>
                </div>
            </div>
        </CardHeader>
    );
}