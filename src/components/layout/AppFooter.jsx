import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Facebook, Linkedin, Mail } from 'lucide-react';

export default function AppFooter({ language = 'en' }) {
    const translations = {
        en: {
            tagline: "Real estate investment analysis made simple",
            product: "Product",
            dashboard: "Dashboard",
            calculators: "Calculators",
            portfolio: "Portfolio",
            pricing: "Pricing",
            company: "Company",
            about: "About Us",
            blog: "Blog",
            contact: "Contact",
            legal: "Legal",
            terms: "Terms of Service",
            privacy: "Privacy Policy",
            cookies: "Cookie Policy",
            followUs: "Follow Us",
            rights: "All rights reserved.",
        },
        sk: {
            tagline: "Analýza nehnuteľností jednoducho",
            product: "Produkt",
            dashboard: "Prehľad",
            calculators: "Kalkulačky",
            portfolio: "Portfólio",
            pricing: "Cenník",
            company: "Spoločnosť",
            about: "O nás",
            blog: "Blog",
            contact: "Kontakt",
            legal: "Právne informácie",
            terms: "Obchodné podmienky",
            privacy: "Ochrana osobných údajov",
            cookies: "Cookies",
            followUs: "Sledujte nás",
            rights: "Všetky práva vyhradené.",
        },
        pl: {
            tagline: "Analiza inwestycji w nieruchomości prosto",
            product: "Produkt",
            dashboard: "Panel",
            calculators: "Kalkulatory",
            portfolio: "Portfolio",
            pricing: "Cennik",
            company: "Firma",
            about: "O nas",
            blog: "Blog",
            contact: "Kontakt",
            legal: "Informacje prawne",
            terms: "Regulamin",
            privacy: "Polityka prywatności",
            cookies: "Polityka cookies",
            followUs: "Obserwuj nas",
            rights: "Wszelkie prawa zastrzeżone.",
        },
        hu: {
            tagline: "Ingatlan befektetés elemzés egyszerűen",
            product: "Termék",
            dashboard: "Vezérlőpult",
            calculators: "Kalkulátorok",
            portfolio: "Portfólió",
            pricing: "Árak",
            company: "Cég",
            about: "Rólunk",
            blog: "Blog",
            contact: "Kapcsolat",
            legal: "Jogi információk",
            terms: "Felhasználási feltételek",
            privacy: "Adatvédelmi irányelvek",
            cookies: "Cookie szabályzat",
            followUs: "Kövess minket",
            rights: "Minden jog fenntartva.",
        },
        de: {
            tagline: "Immobilieninvestitionsanalyse einfach gemacht",
            product: "Produkt",
            dashboard: "Dashboard",
            calculators: "Rechner",
            portfolio: "Portfolio",
            pricing: "Preise",
            company: "Unternehmen",
            about: "Über uns",
            blog: "Blog",
            contact: "Kontakt",
            legal: "Rechtliches",
            terms: "AGB",
            privacy: "Datenschutz",
            cookies: "Cookie-Richtlinie",
            followUs: "Folgen Sie uns",
            rights: "Alle Rechte vorbehalten.",
        }
    };

    const t = translations[language] || translations.en;
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-card border-t border-border mt-auto">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <img 
                            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68d666dadfd2546479ace4c8/478578f70_logo_transp120x40.png" 
                            alt="Estivo Logo" 
                            className="h-8 mb-3"
                        />
                        <p className="text-sm text-muted-foreground">{t.tagline}</p>
                    </div>

                    {/* Product */}
                    <div>
                        <h3 className="font-semibold mb-3">{t.product}</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to={createPageUrl('Dashboard')} className="text-muted-foreground hover:text-primary">
                                    {t.dashboard}
                                </Link>
                            </li>
                            <li>
                                <Link to={createPageUrl('Portfolio')} className="text-muted-foreground hover:text-primary">
                                    {t.portfolio}
                                </Link>
                            </li>
                            <li>
                                <Link to={createPageUrl('Pricing')} className="text-muted-foreground hover:text-primary">
                                    {t.pricing}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="font-semibold mb-3">{t.company}</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to={createPageUrl('Blog')} className="text-muted-foreground hover:text-primary">
                                    {t.blog}
                                </Link>
                            </li>
                            <li>
                                <Link to={createPageUrl('Contact')} className="text-muted-foreground hover:text-primary">
                                    {t.contact}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-semibold mb-3">{t.legal}</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to={createPageUrl('LegalDocument?slug=terms-of-service')} className="text-muted-foreground hover:text-primary">
                                    {t.terms}
                                </Link>
                            </li>
                            <li>
                                <Link to={createPageUrl('LegalDocument?slug=privacy-policy')} className="text-muted-foreground hover:text-primary">
                                    {t.privacy}
                                </Link>
                            </li>
                            <li>
                                <Link to={createPageUrl('LegalDocument?slug=cookie-policy')} className="text-muted-foreground hover:text-primary">
                                    {t.cookies}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {currentYear} Estivo. {t.rights}
                    </p>
                    
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">{t.followUs}</span>
                        <div className="flex gap-3">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="mailto:info@estivo.app" className="text-muted-foreground hover:text-primary">
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}