
import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from 'lucide-react';

export default function TrialStatus({ user, language = 'en' }) {
    if (!user?.trial_end_date || user.plan !== 'pro') return null;

    const trialEnd = new Date(user.trial_end_date);
    const now = new Date();
    const daysLeft = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) return null;

    const translations = {
        en: {
            trial_ending: (days) => `Your Pro trial ends in ${days} day${days !== 1 ? 's' : ''}`,
            upgrade_now: "Upgrade Now",
        },
        sk: {
            trial_ending: (days) => `Vaša Pro skúšobná doba končí za ${days} ${days === 1 ? 'deň' : days < 5 ? 'dni' : 'dní'}`,
            upgrade_now: "Upgradovať teraz",
        },
        pl: {
            trial_ending: (days) => `Twój okres próbny Pro kończy się za ${days} ${days === 1 ? 'dzień' : 'dni'}`, // Simplified pluralization based on typical Polish grammar for 1 vs many. The original change was redundant.
            upgrade_now: "Uaktualnij teraz",
        },
        hu: {
            trial_ending: (days) => `Pro próbaidőszaka ${days} nap múlva lejár`,
            upgrade_now: "Frissítés most",
        },
        de: {
            trial_ending: (days) => `Ihre Pro-Testversion endet in ${days} Tag${days !== 1 ? 'en' : ''}`,
            upgrade_now: "Jetzt upgraden",
        }
    };

    const t = translations[language] || translations.en;

    return (
        <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-amber-600" />
                    <p className="text-sm font-medium text-amber-900">
                        {t.trial_ending(daysLeft)}
                    </p>
                </div>
                <Button size="sm" onClick={() => window.location.href = createPageUrl('Pricing')}>
                    {t.upgrade_now}
                </Button>
            </CardContent>
        </Card>
    );
}
