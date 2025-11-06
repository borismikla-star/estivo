
import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, delay }) => (
    <motion.div
        className="bg-card/50 border border-border/50 rounded-2xl p-6 shadow-soft"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
    >
        <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <div className="p-2 bg-secondary rounded-lg">
                <Icon className="h-5 w-5 text-primary" />
            </div>
        </div>
        <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
    </motion.div>
);

export default StatCard;
