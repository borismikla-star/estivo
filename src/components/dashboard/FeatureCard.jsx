
import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, description, onClick, delay }) => (
    <div onClick={onClick} className="block group cursor-pointer">
        <motion.div
            className="bg-card p-6 rounded-2xl border border-border shadow-premium text-left h-full transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-lg group-hover:-translate-y-1 flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
        >
            <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 bg-accent-gradient rounded-lg mb-6">
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{title}</h3>
            </div>
            <p className="text-muted-foreground flex-grow">{description}</p>
        </motion.div>
    </div>
);

export default FeatureCard;
