import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, BarChart3, PieChart } from 'lucide-react';
import { currencyFormatter, percentFormatter } from '../lib/formatters';

export default function PortfolioStats({ projects, language = 'en' }) {
    const translations = {
        en: {
            total_projects: "Total Projects",
            total_invested: "Total Capital Invested",
            avg_roi: "Average ROI",
            total_equity: "Total Portfolio Equity",
            projects_suffix: "projects",
        },
        sk: {
            total_projects: "Celkový počet projektov",
            total_invested: "Celkový investovaný kapitál",
            avg_roi: "Priemerné ROI",
            total_equity: "Celkové portfóliové imanie",
            projects_suffix: "projektov",
        },
        pl: {
            total_projects: "Łączna liczba projektów",
            total_invested: "Całkowity zainwestowany kapitał",
            avg_roi: "Średni ROI",
            total_equity: "Całkowity kapitał portfela",
            projects_suffix: "projektów",
        },
        hu: {
            total_projects: "Összes projekt",
            total_invested: "Összes befektetett tőke",
            avg_roi: "Átlagos ROI",
            total_equity: "Teljes portfólió tőke",
            projects_suffix: "projekt",
        },
        de: {
            total_projects: "Gesamtprojekte",
            total_invested: "Gesamtes investiertes Kapital",
            avg_roi: "Durchschnittlicher ROI",
            total_equity: "Gesamtes Portfolio-Eigenkapital",
            projects_suffix: "Projekte",
        }
    };

    const t = translations[language] || translations.en;

    // Calculate stats
    const totalProjects = projects.length;
    
    let totalInvested = 0;
    let totalEquity = 0;
    let roiSum = 0;
    let roiCount = 0;

    projects.forEach(project => {
        const kpis = project.results?.kpis || {};
        if (kpis.total_equity) {
            totalInvested += kpis.total_equity;
        }
        
        // For equity, use the latest projection if available
        if (project.results?.projections && project.results.projections.length > 0) {
            const latestProjection = project.results.projections[project.results.projections.length - 1];
            totalEquity += latestProjection.equity || 0;
        }
        
        // For ROI, use the 10-year or overall ROI
        const roi = kpis.roi_10_year || kpis.roi || 0;
        if (roi > 0) {
            roiSum += roi;
            roiCount++;
        }
    });

    const avgROI = roiCount > 0 ? roiSum / roiCount : 0;

    const stats = [
        {
            title: t.total_projects,
            value: totalProjects,
            suffix: t.projects_suffix,
            icon: PieChart,
            color: 'text-blue-600'
        },
        {
            title: t.total_invested,
            value: currencyFormatter(totalInvested, 'EUR', '€', 0),
            icon: DollarSign,
            color: 'text-green-600'
        },
        {
            title: t.avg_roi,
            value: percentFormatter(avgROI, 1),
            icon: TrendingUp,
            color: 'text-amber-600'
        },
        {
            title: t.total_equity,
            value: currencyFormatter(totalEquity, 'EUR', '€', 0),
            icon: BarChart3,
            color: 'text-purple-600'
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <Card key={index} className="bg-card shadow-premium">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {stat.title}
                        </CardTitle>
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">
                            {stat.value}
                            {stat.suffix && <span className="text-sm font-normal text-muted-foreground ml-2">{stat.suffix}</span>}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}