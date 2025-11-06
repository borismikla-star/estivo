import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from 'lucide-react';
import InfoTooltip from '@/components/shared/InfoTooltip';

export default function KPICard({ title, value, icon: Icon, description, trend, tooltip }) {
    return (
        <Card className="hover:shadow-lg transition-shadow duration-300 bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2 flex-1">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                    {tooltip && <InfoTooltip content={tooltip} />}
                </div>
                {Icon && (
                    <Icon className="h-4 w-4 text-muted-foreground" />
                )}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-foreground flex items-center gap-2">
                    {value}
                    {trend === "up" && <TrendingUp className="h-5 w-5 text-success" />}
                    {trend === "down" && <TrendingDown className="h-5 w-5 text-destructive" />}
                </div>
                {description && (
                    <p className="text-xs text-muted-foreground mt-1">{description}</p>
                )}
            </CardContent>
        </Card>
    );
}