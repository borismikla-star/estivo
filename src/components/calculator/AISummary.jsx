import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Lightbulb, Cog, BarChart2, Gem, CheckCircle, AlertTriangle, XCircle, Sparkles, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { percentFormatter } from '../lib/formatters';
import UpgradePrompt from '@/components/shared/UpgradePrompt';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import SensitivityAnalysis from './SensitivityAnalysis';
import BenchmarkContext from './BenchmarkContext';

const ScoreGauge = ({ score }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = score ? circumference - (score / 100) * circumference : circumference;
    
    let scoreColor;
    if (score >= 75) scoreColor = "hsl(var(--success))";
    else if (score >= 50) scoreColor = "hsl(var(--warning))";
    else scoreColor = "hsl(var(--destructive))";

    return (
        <div className="relative flex items-center justify-center w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 120 120">
                <circle
                    className="text-border"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                />
                <motion.circle
                    strokeWidth="10"
                    strokeLinecap="round"
                    stroke={scoreColor}
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                    style={{ strokeDasharray: circumference, strokeDashoffset: circumference, transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
                 <span className="text-3xl font-bold text-foreground" style={{ color: scoreColor }}>{score || 0}</span>
                 <span className="text-xs text-muted-foreground">/ 100</span>
            </div>
        </div>
    );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover text-popover-foreground rounded-lg border p-2 shadow-sm text-sm">
        <p className="font-bold">{label}</p>
        <p className="text-muted-foreground">{`ROI Change: `}
          <span className={payload[0].value > 0 ? 'text-success' : 'text-destructive'}>
            {percentFormatter(payload[0].value)}
          </span>
        </p>
      </div>
    );
  }

  return null;
};

const AISummary = ({ summary, sensitivityData, isLoading, error, onGenerate, canGenerate, user, results, projectType, country }) => {
    const language = user?.preferred_language || 'en';

    const translations = {
        en: {
            title: "AI Investment Analysis",
            subtitle: "Powered by artificial intelligence",
            generate: "Generate AI Analysis",
            regenerate: "Regenerate Analysis",
            generating: "Analyzing...",
            score_label: "Investment Score",
            insights_label: "Key Insights",
            recommendations_label: "Recommendations",
            sensitivity_label: "Sensitivity Analysis",
            sensitivity_desc: "How your ROI changes with key variables",
            upgrade_required: "AI Analysis is a Pro feature",
            upgrade_button: "Upgrade to Pro",
            cooldown_message: "Please wait before generating another analysis",
            // Kept for existing error handling structure
            unavailable_title: "AI Analysis Unavailable",
            note: "Your financial calculations are complete and accurate. The AI insights will be available shortly.",
            try_again: "Try Again",
            get_insights: "Get AI-powered insights and recommendations for your investment.",
        },
        sk: {
            title: "AI Investičná analýza",
            subtitle: "Poháňaná umelou inteligenciou",
            generate: "Vygenerovať AI analýzu",
            regenerate: "Znovu vygenerovať analýzu",
            generating: "Analyzujem...",
            score_label: "Investičné skóre",
            insights_label: "Kľúčové poznatky",
            recommendations_label: "Odporúčania",
            sensitivity_label: "Citlivostná analýza",
            sensitivity_desc: "Ako sa váš ROI mení pri kľúčových premenných",
            upgrade_required: "AI Analýza je funkcia Pro plánu",
            upgrade_button: "Prejsť na Pro",
            cooldown_message: "Počkajte prosím pred vygenerovaním ďalšej analýzy",
            // Kept for existing error handling structure
            unavailable_title: "AI analýza nie je k dispozícii",
            note: "Vaše finančné výpočty sú kompletné a presné. AI analýza bude čoskoro dostupná.",
            try_again: "Skúsiť znova",
            get_insights: "Získajte AI analýzu a odporúčania pre vašu investíciu.",
        },
        pl: {
            title: "Analiza inwestycyjna AI",
            subtitle: "Zasilana sztuczną inteligencją",
            generate: "Wygeneruj analizę AI",
            regenerate: "Ponownie wygeneruj analizę",
            generating: "Analizuję...",
            score_label: "Wynik inwestycyjny",
            insights_label: "Kluczowe spostrzeżenia",
            recommendations_label: "Rekomendacje",
            sensitivity_label: "Analiza wrażliwości",
            sensitivity_desc: "Jak Twój ROI zmienia się przy kluczowych zmiennych",
            upgrade_required: "Analiza AI to funkcja planu Pro",
            upgrade_button: "Przejdź na Pro",
            cooldown_message: "Proszę poczekać przed wygenerowaniem kolejnej analizy",
            unavailable_title: "Analiza AI niedostępna",
            note: "Twoje obliczenia finansowe są kompletne i dokładne. Wglądy AI będą dostępne wkrótce.",
            try_again: "Spróbuj ponownie",
            get_insights: "Uzyskaj analizę AI i rekomendacje dla Twojej inwestycji.",
        },
        hu: {
            title: "AI befektetési elemzés",
            subtitle: "Mesterséges intelligencia által működtetve",
            generate: "AI elemzés generálása",
            regenerate: "Elemzés újragenerálása",
            generating: "Elemzés...",
            score_label: "Befektetési pontszám",
            insights_label: "Kulcsfontosságú betekintések",
            recommendations_label: "Ajánlások",
            sensitivity_label: "Érzékenységi elemzés",
            sensitivity_desc: "Hogyan változik a ROI-ja a kulcsváltozóknál",
            upgrade_required: "Az AI elemzés Pro csomag funkció",
            upgrade_button: "Frissítés Pro-ra",
            cooldown_message: "Kérjük, várjon, mielőtt újabb elemzést generálna",
            unavailable_title: "AI elemzés nem elérhető",
            note: "Pénzügyi számításai teljesek és pontosak. Az AI elemzések hamarosan elérhetőek lesznek.",
            try_again: "Próbálja újra",
            get_insights: "Szerezzen AI-alapú betekintéseket és ajánlásokat befektetéséhez.",
        },
        de: {
            title: "KI-Investitionsanalyse",
            subtitle: "Betrieben von künstlicher Intelligenz",
            generate: "KI-Analyse generieren",
            regenerate: "Analyse neu generieren",
            generating: "Analysiere...",
            score_label: "Investitionsbewertung",
            insights_label: "Wichtige Erkenntnisse",
            recommendations_label: "Empfehlungen",
            sensitivity_label: "Sensitivitätsanalyse",
            sensitivity_desc: "Wie sich Ihr ROI bei Schlüsselvariablen ändert",
            upgrade_required: "KI-Analyse ist eine Pro-Funktion",
            upgrade_button: "Auf Pro upgraden",
            cooldown_message: "Bitte warten Sie, bevor Sie eine weitere Analyse generieren",
            unavailable_title: "KI-Analyse nicht verfügbar",
            note: "Ihre Finanzberechnungen sind vollständig und korrekt. Die KI-Einblicke werden in Kürze verfügbar sein.",
            try_again: "Erneut versuchen",
            get_insights: "Erhalten Sie KI-gesteuerte Einblicke und Empfehlungen für Ihre Investition.",
        }
    };

    const t = translations[language] || translations.en;

    const hasProPlan = user?.plan === 'pro' || user?.plan === 'business';

    if (!hasProPlan) {
        return (
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-premium">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Sparkles className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">{t.title}</CardTitle>
                                <p className="text-sm text-muted-foreground">{t.subtitle}</p>
                            </div>
                        </div>
                        <Crown className="w-6 h-6 text-amber-500" />
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{t.upgrade_required}</p>
                    <Link to={createPageUrl('Pricing')}>
                        <Button className="w-full">
                            <Crown className="w-4 h-4 mr-2" />
                            {t.upgrade_button}
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        );
    }

    if (isLoading) {
        return (
            <Card className="shadow-premium">
                <CardHeader>
                    <CardTitle className="flex items-center text-lg font-semibold text-primary">
                        <Gem className="w-5 h-5 mr-3 animate-pulse" />
                        {t.title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center min-h-[400px]">
                    <Loader2 className="w-12 h-12 animate-spin text-primary opacity-50" />
                    <p className="mt-4 text-sm text-muted-foreground">{t.generating}</p>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="shadow-premium border-warning/50">
                <CardHeader>
                    <CardTitle className="flex items-center text-lg font-semibold text-warning">
                        <AlertTriangle className="w-5 h-5 mr-3" />
                        {t.unavailable_title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground">{error}</p>
                    <p className="text-xs text-muted-foreground mt-2">{t.note}</p>
                    {canGenerate && onGenerate && (
                        <Button onClick={onGenerate} className="mt-4" size="sm">
                            {t.try_again}
                        </Button>
                    )}
                </CardContent>
            </Card>
        );
    }

    const hasSummary = summary && Object.keys(summary).length > 0;
    const hasSensitivity = sensitivityData && sensitivityData.length > 0;

    if (!hasSummary && !hasSensitivity) return (
        <Card className="shadow-premium h-full">
            <CardHeader>
                 <CardTitle className="flex items-center text-lg font-semibold text-primary">
                    <Gem className="w-5 h-5 mr-3" />
                    {t.title}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground h-full pb-12 space-y-4">
                 <p>{t.get_insights}</p>
                 {onGenerate && (
                    <Button onClick={onGenerate} disabled={!canGenerate} className="bg-accent-gradient text-white">
                        <Gem className="w-4 h-4 mr-2" />
                        {t.generate}
                    </Button>
                 )}
            </CardContent>
        </Card>
    );
    
    const { insights, recommendations, score } = summary || {};

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="shadow-premium relative overflow-hidden bg-white/70 backdrop-blur-xl">
                 <div className="absolute top-0 left-0 right-0 h-1 bg-accent-gradient"></div>
                 <CardHeader>
                    <CardTitle className="flex items-center text-lg font-semibold text-primary">
                        <Gem className="w-5 h-5 mr-3" />
                        {t.title}
                    </CardTitle>
                    <CardDescription>{t.subtitle}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {hasSummary && (
                        <>
                            <div className="text-center border-b border-border pb-6">
                                <p className="text-sm font-medium text-muted-foreground mb-2">{t.score_label}</p>
                                <ScoreGauge score={score || 0} />
                            </div>

                            <div>
                                <h4 className="flex items-center text-md font-semibold mb-2 text-foreground">
                                    <Lightbulb className="w-4 h-4 mr-2 text-primary" />
                                    {t.insights_label}
                                </h4>
                                <p className="text-sm text-muted-foreground bg-background p-3 rounded-lg border border-border">{insights}</p>
                            </div>

                            <div>
                                <h4 className="flex items-center text-md font-semibold mb-2 text-foreground">
                                    <Cog className="w-4 h-4 mr-2 text-primary" />
                                    {t.recommendations_label}
                                </h4>
                                <ul className="space-y-2">
                                    {recommendations?.map((rec, index) => (
                                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                            {getRecommendationIcon(rec)}
                                            <span>{rec}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )}

                     {results && projectType && (
                        <BenchmarkContext
                            results={results}
                            projectType={projectType}
                            country={country}
                            language={language}
                        />
                     )}

                     {hasSensitivity && (
                        <div>
                            <h4 className="flex items-center text-md font-semibold mb-2 text-foreground">
                                <BarChart2 className="w-4 h-4 mr-2 text-primary" />
                                {t.sensitivity_label}
                            </h4>
                            <SensitivityAnalysis sensitivityData={sensitivityData} language={language} />
                        </div>
                     )}
                </CardContent>
            </Card>
        </motion.div>
    );
};

function getRecommendationIcon(rec) {
    if (rec.toLowerCase().includes('price') || rec.toLowerCase().includes('cost') || rec.toLowerCase().includes('cena') || rec.toLowerCase().includes('náklady')) return <Cog className="w-4 h-4 text-warning flex-shrink-0" />;
    if (rec.toLowerCase().includes('rent') || rec.toLowerCase().includes('income') || rec.toLowerCase().includes('nájom') || rec.toLowerCase().includes('príjem')) return <Lightbulb className="w-4 h-4 text-success flex-shrink-0" />;
    return <Gem className="w-4 h-4 text-primary flex-shrink-0"/>;
}

export default AISummary;