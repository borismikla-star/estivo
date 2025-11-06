import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function CashFlowChart({ data, language = 'en' }) {
    if (!data || data.length === 0) return null;

    const translations = {
        en: {
            title: "Cash Flow Projection (10 Years)",
            year: "Year",
            cash_flow: "Cash Flow",
        },
        sk: {
            title: "Projekcia Cash Flow (10 rokov)",
            year: "Rok",
            cash_flow: "Cash Flow",
        },
        pl: {
            title: "Projekcja Cash Flow (10 lat)",
            year: "Rok",
            cash_flow: "Cash Flow",
        },
        hu: {
            title: "Cash Flow előrejelzés (10 év)",
            year: "Év",
            cash_flow: "Cash Flow",
        },
        de: {
            title: "Cash Flow Prognose (10 Jahre)",
            year: "Jahr",
            cash_flow: "Cash Flow",
        }
    };

    const t = translations[language] || translations.en;

    const chartData = data.map((item, index) => ({
        year: `${t.year} ${index + 1}`,
        cashFlow: item.cashFlow || 0
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip 
                            formatter={(value) => `€${value.toLocaleString()}`}
                            labelStyle={{ color: '#000' }}
                        />
                        <Legend />
                        <Line 
                            type="monotone" 
                            dataKey="cashFlow" 
                            stroke="hsl(var(--primary))" 
                            strokeWidth={2}
                            name={t.cash_flow}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}