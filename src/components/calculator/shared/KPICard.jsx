
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function KPICard({ 
    title, 
    value, 
    icon: Icon, 
    trend, 
    color = 'primary', 
    tooltip, 
    language = 'en' 
}) {
    // The previous getColorClass and getTrendIcon functions are no longer used
    // with the updated KPICard component structure and logic, hence they are removed.

    return (
        <Card className={`hover:shadow-lg transition-shadow bg-gradient-to-br from-card to-${color}/5`}>
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <p className="text-sm font-medium text-muted-foreground">{title}</p>
                            {tooltip && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <HelpCircle className="w-4 h-4 text-muted-foreground" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="max-w-xs text-sm">{tooltip}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                        </div>
                        <p className={`text-3xl font-bold text-${color}`}>{value}</p>
                        {/* Only display trend if it's a defined value */}
                        {trend !== undefined && (
                            <p className={`text-xs mt-2 flex items-center gap-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                {Math.abs(trend)}%
                            </p>
                        )}
                    </div>
                    {/* Render icon only if an Icon component is provided */}
                    {Icon && (
                        <div className={`p-3 rounded-lg bg-${color}/10`}>
                            <Icon className={`w-6 h-6 text-${color}`} />
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
