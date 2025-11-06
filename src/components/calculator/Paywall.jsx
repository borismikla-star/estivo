
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Lock } from 'lucide-react';

export default function Paywall({ featureName, language }) {
    const t = {
        sk: {
            title: 'Prémiová funkcia',
            description: `Kalkulačka pre '${featureName}' je dostupná len v Pro pláne.`,
            cta: 'Inovovať na Pro',
            back: 'Späť na prehľad'
        },
        en: {
            title: 'Premium Feature Locked',
            description: `The '${featureName}' calculator is only available on the Pro plan.`,
            cta: 'Upgrade to Pro',
            back: 'Back to Dashboard'
        },
        pl: {
            title: 'Funkcja Premium',
            description: `Kalkulator '${featureName}' jest dostępny tylko w planie Pro.`,
            cta: 'Ulepsz do Pro',
            back: 'Powrót do panelu'
        },
        hu: {
            title: 'Prémium funkció',
            description: `A '${featureName}' kalkulátor csak a Pro csomagban érhető el.`,
            cta: 'Frissítés Pro-ra',
            back: 'Vissza az irányítópultra'
        },
        de: {
            title: 'Premium-Funktion gesperrt',
            description: `Der '${featureName}'-Rechner ist nur im Pro-Plan verfügbar.`,
            cta: 'Upgrade auf Pro',
            back: 'Zurück zum Dashboard'
        },
        it: {
            title: 'Funzionalità Premium bloccata',
            description: `Il calcolatore '${featureName}' è disponibile solo nel piano Pro.`,
            cta: 'Passa a Pro',
            back: 'Torna alla dashboard'
        },
        es: {
            title: 'Función Premium bloqueada',
            description: `La calculadora '${featureName}' solo está disponible en el plan Pro.`,
            cta: 'Actualizar a Pro',
            back: 'Volver al panel'
        },
        fr: {
            title: 'Fonctionnalité Premium verrouillée',
            description: `Le calculateur '${featureName}' n'est disponible que dans le plan Pro.`,
            cta: 'Passer à Pro',
            back: 'Retour au tableau de bord'
        }
    }[language] || { // Fallback to English if language is not supported
        title: 'Premium Feature Locked',
        description: `The '${featureName}' calculator is only available on the Pro plan.`,
        cta: 'Upgrade to Pro',
        back: 'Back to Dashboard'
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <Card className="text-center p-8 shadow-lg">
                <CardHeader>
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-8 h-8 text-yellow-600" />
                    </div>
                    <CardTitle className="text-3xl font-bold">{t.title}</CardTitle>
                    <CardDescription className="text-lg text-gray-600 mt-2">{t.description}</CardDescription>
                </CardHeader>
                <CardContent className="mt-6">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to={createPageUrl('Pricing')}>
                            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto">
                                {t.cta}
                            </Button>
                        </Link>
                         <Link to={createPageUrl('Dashboard')}>
                            <Button size="lg" variant="outline" className="w-full sm:w-auto">
                                {t.back}
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
