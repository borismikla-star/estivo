import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Crown, CheckCircle } from 'lucide-react'; 
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter, // Keep DialogFooter in imports as it's a valid component, even if not directly used as a wrapper in the final render structure.
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"; 

export default function UpgradePrompt({ open, onOpenChange, language = 'en' }) {
    const translations = {
        en: {
            title: "Upgrade to Pro",
            description: "Unlock this feature and many more with Estivo Pro for €29/month.",
            feature1: "Unlimited projects",
            feature2: "All calculator types",
            feature3: "AI analysis & recommendations",
            feature4: "Advanced export options",
            feature5: "Priority support",
            upgrade: "Upgrade Now",
            cancel: "Maybe Later",
        },
        sk: {
            title: "Prejsť na Pro",
            description: "Odomknite túto funkciu a mnoho ďalších s Estivo Pro za 29€/mesiac.",
            feature1: "Neobmedzené projekty",
            feature2: "Všetky typy kalkulačiek",
            feature3: "AI analýza a odporúčania",
            feature4: "Pokročilé možnosti exportu",
            feature5: "Prioritná podpora",
            upgrade: "Upgradovať teraz",
            cancel: "Možno neskôr",
        },
        pl: {
            title: "Przejdź na Pro",
            description: "Odblokuj tę funkcję i wiele innych dzięki Estivo Pro za 129 zł/miesiąc.",
            feature1: "Nieograniczone projekty",
            feature2: "Wszystkie typy kalkulatorów",
            feature3: "Analiza AI i rekomendacje",
            feature4: "Zaawansowane opcje eksportu",
            feature5: "Priorytetowe wsparcie",
            upgrade: "Uaktualnij teraz",
            cancel: "Może później",
        },
        hu: {
            title: "Váltson Pro-ra",
            description: "Nyissa meg ezt a funkciót és még sok mást az Estivo Pro-val 11 900 Ft/hónap áron.",
            feature1: "Korlátlan projektek",
            feature2: "Minden kalkulátor típus",
            feature3: "AI elemzés és ajánlások",
            feature4: "Fejlett exportálási lehetőségek",
            feature5: "Kiemelt támogatás",
            upgrade: "Frissítés most",
            cancel: "Talán később",
        },
        de: {
            title: "Upgrade auf Pro",
            description: "Schalten Sie diese Funktion und viele weitere mit Estivo Pro für 29€/Monat frei.",
            feature1: "Unbegrenzte Projekte",
            feature2: "Alle Rechnertypen",
            feature3: "KI-Analyse & Empfehlungen",
            feature4: "Erweiterte Exportoptionen",
            feature5: "Priorisierter Support",
            upgrade: "Jetzt upgraden",
            cancel: "Vielleicht später",
        }
    };

    const t = translations[language] || translations.en;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Crown className="w-5 h-5 text-amber-500" />
                        {t.title}
                    </DialogTitle>
                    <DialogDescription>{t.description}</DialogDescription>
                </DialogHeader>
                
                <div className="space-y-3 py-4">
                    {[t.feature1, t.feature2, t.feature3, t.feature4, t.feature5].map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span>{feature}</span>
                        </div>
                    ))}
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                        {t.cancel}
                    </Button>
                    <Button onClick={() => window.location.href = createPageUrl('Pricing')} className="flex-1 bg-primary">
                        {t.upgrade}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}