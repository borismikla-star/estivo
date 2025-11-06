import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function ExpenseBreakdownChart({ data, language = 'en' }) {
    if (!data || data.length === 0) return null;

    const translations = {
        en: {
            title: "Annual Expense Breakdown",
        },
        sk: {
            title: "Rozdelenie ročných nákladov",
        },
        pl: {
            title: "Roczne koszty - podział",
        },
        hu: {
            title: "Éves költségek megoszlása",
        },
        de: {
            title: "Jährliche Kostenaufschlüsselung",
        }
    };

    const t = translations[language] || translations.en;

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(entry) => `${entry.name}: €${entry.value.toLocaleString()}`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip 
                            formatter={(value) => `€${value.toLocaleString()}`}
                            labelStyle={{ color: '#000' }}
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}