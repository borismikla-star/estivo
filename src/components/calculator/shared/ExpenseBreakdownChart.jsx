import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B9D', '#C44569'];

export default function ExpenseBreakdownChart({ expenses, currency = 'EUR', language = 'en' }) {
    if (!expenses || expenses.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>
                        {language === 'sk' ? 'Rozdelenie ročných nákladov' : 
                         language === 'pl' ? 'Roczne koszty - podział' :
                         language === 'hu' ? 'Éves költségek megoszlása' :
                         language === 'de' ? 'Jährliche Kostenaufschlüsselung' :
                         'Annual Expense Breakdown'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-center py-8">
                        {language === 'sk' ? 'Žiadne nákladové údaje' :
                         language === 'pl' ? 'Brak danych o kosztach' :
                         language === 'hu' ? 'Nincs költségadat' :
                         language === 'de' ? 'Keine Kostendaten' :
                         'No expense data available'}
                    </p>
                </CardContent>
            </Card>
        );
    }

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
    const currencySymbol = currency === 'EUR' ? '€' : currency;

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                        <Pie
                            data={expenses}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(entry) => `${entry.name}: ${entry.percentage}%`}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {expenses.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip 
                            formatter={(value) => `${currencySymbol}${value.toLocaleString()}`}
                            labelStyle={{ color: '#000' }}
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}