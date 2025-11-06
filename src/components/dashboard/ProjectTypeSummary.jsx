import React from 'react';
import { motion } from 'framer-motion';
import { Home, Package, Building, LineChart, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const typeDetails = {
    long_term_lease: { icon: Home, labelKey: 'long_term_lease' },
    airbnb: { icon: Package, labelKey: 'airbnb' },
    commercial: { icon: Building, labelKey: 'commercial' },
    development: { icon: LineChart, labelKey: 'development' },
};

const SummaryCard = ({ icon: Icon, label, count, delay, isTotal = false }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="h-full"
    >
        <Card className={`bg-card border-border shadow-premium h-full ${isTotal ? 'bg-accent-gradient text-white' : ''}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium ${isTotal ? 'text-white/80' : 'text-muted-foreground'}`}>{label}</CardTitle>
                <Icon className={`h-5 w-5 ${isTotal ? 'text-white' : 'text-muted-foreground'}`} />
            </CardHeader>
            <CardContent>
                <div className={`text-4xl font-bold ${isTotal ? 'text-white' : 'text-primary'}`}>{count}</div>
            </CardContent>
        </Card>
    </motion.div>
);

export default function ProjectTypeSummary({ counts, t }) {
    const totalProjects = Object.values(counts).reduce((sum, count) => sum + count, 0);

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
            <div className="col-span-2 md:col-span-1">
                 <SummaryCard
                    icon={TrendingUp}
                    label={"Total Projects"}
                    count={totalProjects}
                    delay={0}
                    isTotal={true}
                />
            </div>
            {Object.entries(typeDetails).map(([type, details], index) => (
                 <div className="col-span-1" key={type}>
                    <SummaryCard
                        icon={details.icon}
                        label={t[details.labelKey]}
                        count={counts[type] || 0}
                        delay={0.1 * (index + 1)}
                    />
                </div>
            ))}
        </div>
    );
}