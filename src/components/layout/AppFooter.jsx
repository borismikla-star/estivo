import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import FeedbackButton from '@/components/shared/FeedbackButton';

export default function AppFooter({ language = 'en' }) {
    const translations = {
        en: {
            privacy: "Privacy Policy",
            terms: "Terms of Service",
            cookies: "Cookie Policy",
            rights: "All rights reserved"
        },
        sk: {
            privacy: "Zásady ochrany osobných údajov",
            terms: "Podmienky používania",
            cookies: "Zásady používania súborov cookie",
            rights: "Všetky práva vyhradené"
        },
        pl: {
            privacy: "Polityka prywatności",
            terms: "Warunki korzystania",
            cookies: "Polityka plików cookie",
            rights: "Wszelkie prawa zastrzeżone"
        },
        hu: {
            privacy: "Adatvédelmi irányelvek",
            terms: "Felhasználási feltételek",
            cookies: "Cookie szabályzat",
            rights: "Minden jog fenntartva"
        },
        de: {
            privacy: "Datenschutzrichtlinie",
            terms: "Nutzungsbedingungen",
            cookies: "Cookie-Richtlinie",
            rights: "Alle Rechte vorbehalten"
        }
    };

    const t = translations[language] || translations.en;
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-card border-t border-border mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-muted-foreground">
                        © {currentYear} Estivo. {t.rights}
                    </div>
                    <div className="flex flex-wrap justify-center gap-6">
                        <Link 
                            to={createPageUrl('LegalDocument?slug=privacy-policy')} 
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {t.privacy}
                        </Link>
                        <Link 
                            to={createPageUrl('LegalDocument?slug=terms-of-service')} 
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {t.terms}
                        </Link>
                        <Link 
                            to={createPageUrl('LegalDocument?slug=cookie-policy')} 
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {t.cookies}
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}