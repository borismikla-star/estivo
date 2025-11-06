import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import InfoTooltip from '@/components/shared/InfoTooltip';

const percentFormatter = (value) => {
    if (typeof value !== 'number' || isNaN(value)) return 'N/A';
    const color = value > 0 ? 'text-green-600' : 'text-red-600';
    return <span className={color}>{value.toFixed(1)}%</span>;
};

export default function SensitivityAnalysis({ baseResults, calculate, projectData, analysisConfig, language }) {
    const t = {
        sk: {
            title: "Analýza citlivosti",
            description: "Ako zmeny v kľúčových predpokladoch ovplyvnia vašu návratnosť investícií (ROI).",
            variable: "Premenná",
            change: "Zmena",
            roi: "Nové ROI",
            purchase_price: "Kúpna cena",
            rent: "Mesačný nájom",
            occupancy: "Obsadenosť",
            nightly_rate: "Cena za noc",
            construction_cost: "Náklady na výstavbu",
            sale_price: "Predajná cena",
        },
        en: {
            title: "Sensitivity Analysis",
            description: "How changes in key assumptions will impact your Return on Investment (ROI).",
            variable: "Variable",
            change: "Change",
            roi: "New ROI",
            purchase_price: "Purchase Price",
            rent: "Monthly Rent",
            occupancy: "Occupancy",
            nightly_rate: "Nightly Rate",
            construction_cost: "Construction Cost",
            sale_price: "Sale Price",
        }
    }[language];

    const sensitivityData = useMemo(() => {
        if (!baseResults || !calculate || !projectData) return [];

        const variations = [-0.10, -0.05, 0.05, 0.10]; // -10%, -5%, +5%, +10%
        let results = [];

        analysisConfig.forEach(config => {
            variations.forEach(variation => {
                const updatedData = JSON.parse(JSON.stringify(projectData)); // Deep copy
                
                let originalValue = updatedData[config.section][config.field];
                const newValue = originalValue * (1 + variation);
                updatedData[config.section][config.field] = newValue;
                
                const newMetrics = calculate(updatedData);
                const roiKey = newMetrics.roiOnEquity !== undefined ? 'roiOnEquity' : (newMetrics.kpi?.roi_equity_y1 !== undefined ? 'kpi.roi_equity_y1' : 'roi');
                
                let newRoi;
                if (roiKey === 'kpi.roi_equity_y1') {
                    newRoi = newMetrics.kpi.roi_equity_y1;
                } else {
                    newRoi = newMetrics[roiKey];
                }

                results.push({
                    variable: t[config.t_key],
                    change: `${(variation * 100).toFixed(0)}%`,
                    newRoi: newRoi,
                });
            });
        });

        return results;
    }, [baseResults, calculate, projectData, analysisConfig, language]);

    if (!baseResults) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    {t.title}
                    <InfoTooltip info={t.description} />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t.variable}</TableHead>
                            <TableHead className="text-right">{t.change}</TableHead>
                            <TableHead className="text-right">{t.roi}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sensitivityData.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{row.variable}</TableCell>
                                <TableCell className="text-right">{row.change}</TableCell>
                                <TableCell className="text-right font-semibold">{percentFormatter(row.newRoi)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}