import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export default function FloatingActionBar({ count, onClear, children }) {
    return (
        <AnimatePresence>
            {count > 0 && (
                <motion.div
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-auto max-w-lg"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                    <div className="flex items-center gap-4 bg-card text-card-foreground p-3 rounded-xl shadow-2xl border border-border">
                        <div className="flex items-center gap-2">
                             <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onClear}>
                                <X className="h-4 w-4" />
                            </Button>
                            <span className="text-sm font-medium pr-2 border-r">{count} selected</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {children}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}