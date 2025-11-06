import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function EquityBuildupChart({ data, language = 'en' }) {
    if (!data || data.length === 0) return null;

    const translations = {
        en: {
            title: "Equity Buildup Over Time",
            year: "Year",
            equity: "Equity",
        },
        sk: {
            title: "Rast vlastného kapitálu",
            year: "Rok",
            equity: "Vlastný kapitál",
        },
        pl: {
            title: "Wzrost kapitału własnego",
            year: "Rok",
            equity: "Kapitał własny",
        },
        hu: {
            title: "Saját tőke növekedése",
            year: "Év",
            equity: "Saját tőke",
        },
        de: {
            title: "Eigenkapitalaufbau",
            year: "Jahr",
            equity: "Eigenkapital",
        }
    };

    const t = translations[language] || translations.en;

    const chartData = data.map((item, index) => ({
        year: `${t.year} ${index + 1}`,
        equity: item.equity || 0
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip 
                            formatter={(value) => `€${value.toLocaleString()}`}
                            labelStyle={{ color: '#000' }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="equity" 
                            stroke="hsl(var(--primary))" 
                            fill="hsl(var(--primary))" 
                            fillOpacity={0.6}
                            name={t.equity}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}