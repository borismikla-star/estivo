import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function PortfolioBreakdownChart({ projects, language = 'en' }) {
    const translations = {
        en: {
            title: "Portfolio Breakdown",
            long_term_lease: "Long-Term Lease",
            airbnb: "Short-Term Rental",
            commercial: "Commercial",
            development: "Development",
            projects: "projects",
        },
        sk: {
            title: "Rozloženie portfólia",
            long_term_lease: "Dlhodobý prenájom",
            airbnb: "Krátkodobý prenájom",
            commercial: "Komerčné",
            development: "Development",
            projects: "projektov",
        },
        pl: {
            title: "Podział portfela",
            long_term_lease: "Wynajem długoterminowy",
            airbnb: "Wynajem krótkoterminowy",
            commercial: "Komercyjne",
            development: "Deweloperskie",
            projects: "projektów",
        },
        hu: {
            title: "Portfólió bontás",
            long_term_lease: "Hosszú távú bérlet",
            airbnb: "Rövid távú bérlet",
            commercial: "Kereskedelmi",
            development: "Fejlesztés",
            projects: "projekt",
        },
        de: {
            title: "Portfolio-Aufschlüsselung",
            long_term_lease: "Langfristige Vermietung",
            airbnb: "Kurzzeitvermietung",
            commercial: "Gewerblich",
            development: "Entwicklung",
            projects: "Projekte",
        }
    };

    const t = translations[language] || translations.en;

    // Count projects by type
    const typeCounts = projects.reduce((acc, project) => {
        acc[project.type] = (acc[project.type] || 0) + 1;
        return acc;
    }, {});

    const data = Object.entries(typeCounts).map(([type, count]) => ({
        name: t[type] || type,
        value: count,
        type: type
    }));

    const COLORS = {
        long_term_lease: '#3b82f6',
        airbnb: '#0ea5e9',
        commercial: '#64748b',
        development: '#f59e0b'
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-popover text-popover-foreground rounded-lg border p-3 shadow-lg">
                    <p className="font-semibold">{payload[0].name}</p>
                    <p className="text-sm text-muted-foreground">
                        {payload[0].value} {t.projects}
                    </p>
                </div>
            );
        }
        return null;
    };

    const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
        const RADIAN = Math.PI / 180;
        const radius = outerRadius + 20;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text 
                x={x} 
                y={y} 
                fill="#2E3B4E" 
                textAnchor={x > cx ? 'start' : 'end'} 
                dominantBaseline="central"
                style={{ fontSize: '12px', fontWeight: 500 }}
            >
                {`${name}: ${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    if (data.length === 0) return null;

    return (
        <Card className="bg-card shadow-premium" style={{ width: '500px' }}>
            <CardHeader>
                <CardTitle>{t.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={{
                                stroke: '#94a3b8',
                                strokeWidth: 1,
                            }}
                            label={renderCustomLabel}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[entry.type] || '#94a3b8'} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend 
                            verticalAlign="bottom" 
                            height={36}
                            iconType="circle"
                        />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}