import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TrendingUp } from 'lucide-react';
import { currencyFormatter, percentFormatter } from '@/components/lib/formatters';

export default function QuickRoiCalculator({ t }) {
    const [price, setPrice] = useState('200000');
    const [rent, setRent] = useState('900');
    const [costs, setCosts] = useState('10000');
    const [result, setResult] = useState(null);

    const handleCalculate = (e) => {
        e.preventDefault();
        const numPrice = parseFloat(price) || 0;
        const numRent = parseFloat(rent) || 0;
        const numCosts = parseFloat(costs) || 0;

        if (numPrice === 0) return;

        const annualRent = numRent * 12;
        const totalInvestment = numPrice + numCosts;
        
        // A simplified assumption for a quick calculator
        const annualOperatingCosts = annualRent * 0.25; 
        const netIncome = annualRent - annualOperatingCosts;
        
        const roi = (netIncome / totalInvestment) * 100;
        const monthlyCashflow = netIncome / 12;

        setResult({ roi, monthlyCashflow });
    };
    
    return (
        <Card className="shadow-2xl rounded-2xl border-border bg-card/80 backdrop-blur-xl w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-foreground">{t.quick_roi_title}</CardTitle>
                <CardDescription className="text-muted-foreground">{t.quick_roi_subtitle}</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleCalculate} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">{t.quick_roi_price}</label>
                        <Input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g., 200,000" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">{t.quick_roi_rent}</label>
                        <Input type="number" value={rent} onChange={e => setRent(e.target.value)} placeholder="e.g., 900" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">{t.quick_roi_costs}</label>
                        <Input type="number" value={costs} onChange={e => setCosts(e.target.value)} placeholder="e.g., 10,000" />
                    </div>
                    <Button type="submit" className="w-full bg-accent-gradient text-white hover:opacity-90 shadow-lg">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        {t.quick_roi_calculate}
                    </Button>
                </form>

                {result && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 pt-6 border-t border-border"
                    >
                        <div className="flex justify-around text-center">
                            <div>
                                <p className="text-sm text-muted-foreground">{t.quick_roi_estimated_roi}</p>
                                <p className="text-3xl font-bold text-primary">
                                    {percentFormatter(result.roi, 1)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">{t.quick_roi_estimated_profit}</p>
                                <p className="text-3xl font-bold text-primary">
                                    {currencyFormatter(result.monthlyCashflow, 'EUR', '€')}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </CardContent>
        </Card>
    );
}