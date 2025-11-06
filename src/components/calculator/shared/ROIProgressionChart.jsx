import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ROIProgressionChart({ data, language = 'en' }) {
    if (!data || data.length === 0) return null;

    const translations = {
        en: {
            title: "ROI Progression",
            year: "Year",
            roi: "ROI",
        },
        sk: {
            title: "Vývoj ROI",
            year: "Rok",
            roi: "ROI",
        },
        pl: {
            title: "Progresja ROI",
            year: "Rok",
            roi: "ROI",
        },
        hu: {
            title: "ROI fejlődése",
            year: "Év",
            roi: "ROI",
        },
        de: {
            title: "ROI-Entwicklung",
            year: "Jahr",
            roi: "ROI",
        }
    };

    const t = translations[language] || translations.en;

    const chartData = data.map((item, index) => ({
        year: `${t.year} ${index + 1}`,
        roi: item.roi || 0
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
                            formatter={(value) => `${value.toFixed(2)}%`}
                            labelStyle={{ color: '#000' }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="roi" 
                            stroke="hsl(var(--primary))" 
                            strokeWidth={2}
                            name={t.roi}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}