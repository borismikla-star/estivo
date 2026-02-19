import React from 'react';
import { BarChart3 } from 'lucide-react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function ResultsHeader({ language = 'en', title }) {
    const translations = {
        en: {
            results_title: "Analysis Results",
            key_metrics: "Key Financial Metrics",
            commercial_results: "Commercial Property Analysis Results",
        },
        sk: {
            results_title: "Výsledky analýzy",
            key_metrics: "Kľúčové finančné ukazovatele",
            commercial_results: "Výsledky analýzy obchodnej nehnuteľnosti",
        },
        pl: {
            results_title: "Wyniki analizy",
            key_metrics: "Kluczowe wskaźniki finansowe",
            commercial_results: "Wyniki analizy nieruchomości komercyjnej",
        },
        hu: {
            results_title: "Elemzési eredmények",
            key_metrics: "Kulcsfontosságú pénzügyi mutatók",
            commercial_results: "Kereskedelmi ingatlan elemzésének eredményei",
        },
        de: {
            results_title: "Analyseergebnisse",
            key_metrics: "Wichtige Finanzkennzahlen",
            commercial_results: "Analyseergebnisse für Gewerbeimmobilien",
        }
    };

    const t = translations[language] || translations.en;
    const displayTitle = title || t.results_title;

    return (
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <CardTitle className="text-2xl">{displayTitle}</CardTitle>
                    <CardDescription>{t.key_metrics}</CardDescription>
                </div>
            </div>
        </CardHeader>
    );
}