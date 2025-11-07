import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import InfoTooltip from '../InfoTooltip';

export default function KPICard({ title, value, description, tooltip, warning, good, excellent }) {
    // Determine status based on value and thresholds
    let status = 'neutral';
    let statusColor = 'text-gray-900';
    let statusIcon = null;
    
    if (warning) {
        status = 'warning';
        statusColor = 'text-amber-600';
        statusIcon = <AlertTriangle className="w-4 h-4 text-amber-500" />;
    } else if (excellent) {
        status = 'excellent';
        statusColor = 'text-green-600';
        statusIcon = <TrendingUp className="w-4 h-4 text-green-500" />;
    } else if (good) {
        status = 'good';
        statusColor = 'text-blue-600';
    }

    return (
        <Card className={`
            ${status === 'warning' ? 'border-amber-300 bg-amber-50' : ''}
            ${status === 'excellent' ? 'border-green-300 bg-green-50' : ''}
            ${status === 'good' ? 'border-blue-300 bg-blue-50' : ''}
            transition-all hover:shadow-md
        `}>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                        {tooltip && <InfoTooltip content={tooltip} />}
                    </div>
                    {statusIcon}
                </div>
            </CardHeader>
            <CardContent>
                <div className={`text-2xl font-bold ${statusColor}`}>{value}</div>
                {description && (
                    <p className="text-xs text-muted-foreground mt-1">{description}</p>
                )}
                {warning && (
                    <p className="text-xs text-amber-700 mt-2 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {warning}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}