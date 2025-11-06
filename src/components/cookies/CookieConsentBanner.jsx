
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import CookieSettingsDialog from './CookieSettingsDialog';
import { Cookie, ShieldCheck, X } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'estivo_cookie_consent';

const initialSettings = {
    necessary: true,
    analytics: false,
    marketing: false,
};

export default function CookieConsentBanner({ language }) {
    const [consent, setConsent] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    useEffect(() => {
        try {
            const storedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
            if (storedConsent) {
                setConsent(JSON.parse(storedConsent));
            } else {
                setConsent(null);
                setIsVisible(true);
            }
        } catch (error) {
            console.error("Could not parse cookie consent from localStorage", error);
            setIsVisible(true);
        }
    }, []);

    const saveConsent = (newSettings) => {
        localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(newSettings));
        setConsent(newSettings);
        setIsVisible(false);
        setIsSettingsOpen(false);
    };

    const acceptAll = () => {
        saveConsent({ necessary: true, analytics: true, marketing: true });
    };

    const rejectAll = () => {
        saveConsent({ necessary: true, analytics: false, marketing: false });
    };

    const translations = {
        en: {
            title: "We use cookies",
            description: "This website uses cookies to enhance your experience and for analytics purposes. You can change your preferences at any time.",
            policy: "Cookie Policy",
            accept: "Accept All",
            reject: "Reject All",
            customize: "Customize",
            manage: "Manage Cookies",
        },
        sk: {
            title: "Používame súbory cookie",
            description: "Táto webová stránka používa súbory cookie na zlepšenie vášho zážitku a na analytické účely. Svoje predvoľby môžete kedykoľvek zmeniť.",
            policy: "Zásady používania súborov cookie",
            accept: "Prijať všetko",
            reject: "Odmietnuť všetko",
            customize: "Prispôsobiť",
            manage: "Spravovať cookies",
        },
        pl: {
            title: "Używamy plików cookie",
            description: "Ta strona internetowa używa plików cookie w celu poprawy doświadczeń użytkownika i do celów analitycznych. Możesz zmienić swoje preferencje w dowolnym momencie.",
            policy: "Polityka plików cookie",
            accept: "Zaakceptuj wszystkie",
            reject: "Odrzuć wszystkie",
            customize: "Dostosuj",
            manage: "Zarządzaj cookies",
        },
        hu: {
            title: "Cookie-kat használunk",
            description: "Ez a weboldal cookie-kat használ a felhasználói élmény javítása és elemzési célokra. Bármikor módosíthatja beállításait.",
            policy: "Cookie szabályzat",
            accept: "Összes elfogadása",
            reject: "Összes elutasítása",
            customize: "Testreszabás",
            manage: "Cookie-k kezelése",
        },
        de: {
            title: "Wir verwenden Cookies",
            description: "Diese Website verwendet Cookies, um Ihre Erfahrung zu verbessern und für Analysezwecke. Sie können Ihre Einstellungen jederzeit ändern.",
            policy: "Cookie-Richtlinie",
            accept: "Alle akzeptieren",
            reject: "Alle ablehnen",
            customize: "Anpassen",
            manage: "Cookies verwalten",
        }
    };
    const t = translations[language] || translations.en;

    return (
        <>
            <AnimatePresence>
                {isVisible && (
                    <>
                        {/* Dark overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
                            onClick={() => {}} // Prevents closing on overlay click
                        />
                        
                        {/* Centered Banner */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="fixed inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 bottom-4 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 z-[101] max-w-2xl mx-auto"
                        >
                            <div className="bg-card rounded-2xl shadow-2xl border-2 border-border p-6 sm:p-8">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                            <ShieldCheck className="w-6 h-6 text-primary" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">{t.title}</h3>
                                        <p className="text-sm sm:text-base text-muted-foreground">
                                            {t.description}{' '}
                                            <Link to={createPageUrl('LegalDocument?slug=cookie-policy')} className="text-primary hover:underline font-medium">
                                                {t.policy}
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button 
                                        variant="outline" 
                                        onClick={() => setIsSettingsOpen(true)}
                                        className="w-full sm:w-auto"
                                    >
                                        {t.customize}
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        onClick={rejectAll}
                                        className="w-full sm:w-auto"
                                    >
                                        {t.reject}
                                    </Button>
                                    <Button 
                                        onClick={acceptAll}
                                        className="w-full sm:w-auto bg-primary hover:bg-primary/90"
                                    >
                                        {t.accept}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {consent && (
                 <button 
                    onClick={() => setIsSettingsOpen(true)}
                    className="fixed bottom-4 left-4 z-[99] p-3 bg-card/80 backdrop-blur-sm border rounded-full shadow-lg hover:bg-accent transition-colors"
                    aria-label={t.manage}
                    title={t.manage}
                >
                    <Cookie className="w-6 h-6 text-primary" />
                </button>
            )}

            <CookieSettingsDialog
                open={isSettingsOpen}
                onOpenChange={setIsSettingsOpen}
                onSave={saveConsent}
                settings={consent || initialSettings}
                language={language}
            />
        </>
    );
}
