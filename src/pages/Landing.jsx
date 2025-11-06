
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { BarChart3, Gem, CheckCircle, Star, Users, ArrowRight } from 'lucide-react';
import QuickRoiCalculator from '@/components/landing/QuickRoiCalculator';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import CookieConsentBanner from '@/components/cookies/CookieConsentBanner';
import { getLandingPageTranslations } from '@/components/lib/translations';
import { useQuery } from '@tanstack/react-query';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
    <motion.div
        className="bg-card p-8 rounded-2xl border border-border shadow-premium text-left h-full"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
    >
        <div className="flex items-center justify-center w-12 h-12 bg-accent-gradient rounded-lg mb-6">
            <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
    </motion.div>
);

const TestimonialCard = ({ text, author, role, delay }) => (
    <motion.div
        className="bg-card p-6 rounded-2xl border border-border shadow-premium"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
    >
        <div className="flex mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />)}
        </div>
        <p className="text-foreground italic">"{text}"</p>
        <div className="mt-4 text-right">
            <p className="font-semibold text-primary">{author}</p>
            <p className="text-sm text-muted-foreground/80">{role}</p>
        </div>
    </motion.div>
);

export default function LandingPage() {
    const [language, setLanguage] = useState(() => localStorage.getItem('estivo_lang') || 'en');
    const [betaMode, setBetaMode] = useState(true);

    const { data: user } = useQuery({
        queryKey: ['currentUser'],
        queryFn: async () => {
            try {
                return await base44.auth.me();
            } catch (error) {
                return null;
            }
        },
        retry: false,
        staleTime: Infinity,
    });

    // Fetch AppSettings to determine beta mode
    const { data: appSettings } = useQuery({
        queryKey: ['appSettings'],
        queryFn: async () => {
            try {
                const settings = await base44.entities.AppSettings.list('-updated_date', 1);
                console.log('[Landing] AppSettings loaded:', settings);
                return settings && settings.length > 0 ? settings[0] : { beta_mode: true };
            } catch (error) {
                console.error('[Landing] Failed to fetch AppSettings:', error);
                return { beta_mode: true }; // Default to beta mode on error
            }
        },
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        retry: 1,
    });

    useEffect(() => {
        if (appSettings) {
            console.log('[Landing] Setting beta mode from appSettings:', appSettings.beta_mode);
            setBetaMode(appSettings.beta_mode === true);
        }
    }, [appSettings]);

    const handleSetLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem('estivo_lang', lang);
    };
    
    const t = getLandingPageTranslations(language);

    const handleSignIn = () => {
        if (user) {
            window.location.href = createPageUrl('Dashboard');
        } else {
            base44.auth.redirectToLogin(createPageUrl('Dashboard'));
        }
    };

    const handleGetStarted = () => {
        if (user) {
            window.location.href = createPageUrl('Dashboard');
        } else {
            base44.auth.redirectToLogin(createPageUrl('Dashboard'));
        }
    };

    const pricingPlans = {
        en: [
            { 
                name: betaMode ? "Beta Access" : "Free", 
                price: betaMode ? "Free" : "€0", 
                desc: betaMode ? "Join as an early adopter and help us shape Estivo!" : "For investors just starting out.", 
                features: betaMode ? ["Full Pro Features", "Unlimited Projects", "All Calculator Types", "AI Analysis", "Priority Support", "Lifetime Early Adopter Benefits"] : ["1 Project", "Basic Calculators", "PDF Export"], 
                cta: betaMode ? "Join Beta" : "Get Started", 
                isBeta: betaMode 
            },
            { 
                name: "Pro", 
                price: betaMode ? "Coming Soon" : "€29", 
                desc: betaMode ? "Full professional features launching soon." : "For active investors and professionals.", 
                features: ["Unlimited Projects", "All Calculator Types", "AI Analysis & Recommendations", "Project Comparison", "Advanced Export"], 
                cta: betaMode ? "Join Waitlist" : "Choose Pro", 
                popular: !betaMode, 
                isComingSoon: betaMode 
            },
            { 
                name: "Business", 
                price: "Coming Soon", 
                desc: "For teams, developers, and firms.", 
                features: ["Everything in Pro", "Team Collaboration (coming soon)", "Branded Reports (coming soon)", "Priority Support"], 
                cta: "Coming Soon",
                isComingSoon: true
            },
        ],
        sk: [
            { 
                name: betaMode ? "Beta Prístup" : "Free", 
                price: betaMode ? "Zadarmo" : "0€", 
                desc: betaMode ? "Pridajte sa k prvým používateľom a pomôžte nám vylepšovať Estivo!" : "Pre začínajúcich investorov.", 
                features: betaMode ? ["Všetky Pro funkcie", "Neobmedzené projekty", "Všetky typy kalkulačiek", "AI Analýza", "Prioritná podpora", "Výhody pre prvých používateľov"] : ["1 projekt", "Základné kalkulačky", "Export do PDF"], 
                cta: betaMode ? "Pripojiť sa k Beta" : "Začať zadarmo", 
                isBeta: betaMode 
            },
            { 
                name: "Pro", 
                price: betaMode ? "Čoskoro" : "29€", 
                desc: betaMode ? "Profesionálne funkcie už čoskoro." : "Pre aktívnych investorov a profesionálov.", 
                features: ["Neobmedzené projekty", "Všetky typy kalkulačiek", "AI Analýza a Odporúčania", "Porovnávanie projektov", "Pokročilý export"], 
                cta: betaMode ? "Pripojiť sa k Waiting List" : "Vybrať Pro", 
                popular: !betaMode, 
                isComingSoon: betaMode 
            },
            { 
                name: "Business", 
                price: "Čoskoro", 
                desc: "Pre realitné kancelárie a developerov.", 
                features: ["Všetko v Pro", "Tímová spolupráca (čoskoro)", "Branding reportov (čoskoro)", "Prioritná podpora"], 
                cta: "Čoskoro",
                isComingSoon: true
            },
        ],
        pl: [
            { 
                name: betaMode ? "Dostęp Beta" : "Darmowy", 
                price: betaMode ? "Bezpłatnie" : "0€", 
                desc: betaMode ? "Dołącz jako wczesny użytkownik i pomóż nam kształtować Estivo!" : "Dla początkujących inwestorów.", 
                features: betaMode ? ["Wszystkie funkcje Pro", "Nieograniczone projekty", "Wszystkie kalkulatory", "Analiza AI", "Priorytetowe wsparcie", "Dożywotnie korzyści dla wczesnych użytkowników"] : ["1 projekt", "Podstawowe kalkulatory", "Eksport PDF"], 
                cta: betaMode ? "Dołącz do Beta" : "Rozpocznij", 
                isBeta: betaMode 
            },
            { 
                name: "Pro", 
                price: betaMode ? "Wkrótce" : "129 zł", 
                desc: betaMode ? "Pełne funkcje profesjonalne wkrótce." : "Dla aktywnych inwestorów i profesjonalistów.", 
                features: ["Nieograniczone projekty", "Wszystkie typy kalkulatorów", "Analiza AI i Rekomendacje", "Porównanie projektów", "Zaawansowany eksport"], 
                cta: betaMode ? "Dołącz do listy oczekujących" : "Wybierz Pro", 
                popular: !betaMode, 
                isComingSoon: betaMode 
            },
            { 
                name: "Business", 
                price: "Wkrótce", 
                desc: "Dla zespołów, deweloperów i firm.", 
                features: ["Wszystko w Pro", "Współpraca zespołowa (wkrótce)", "Markowe raporty (wkrótce)", "Priorytetowe wsparcie"], 
                cta: "Wkrótce",
                isComingSoon: true
            },
        ],
        hu: [
            { 
                name: betaMode ? "Béta Hozzáférés" : "Ingyenes", 
                price: betaMode ? "Ingyen" : "0 Ft", 
                desc: betaMode ? "Csatlakozz korai felhasználóként és segíts fejleszteni az Estivot!" : "Kezdő befektetőknek.", 
                features: betaMode ? ["Teljes Pro funkciók", "Korlátlan projektek", "Minden kalkulátor típus", "AI elemzés", "Kiemelt támogatás", "Élethosszig tartó korai felhasználói előnyök"] : ["1 projekt", "Alapkalkulátorok", "PDF export"], 
                cta: betaMode ? "Csatlakozz a Bétához" : "Kezdés", 
                isBeta: betaMode 
            },
            { 
                name: "Pro", 
                price: betaMode ? "Hamarosan" : "11 900 Ft", 
                desc: betaMode ? "Teljes professzionális funkciók hamarosan." : "Aktív befektetőknek és szakembereknek.", 
                features: ["Korlátlan projektek", "Minden kalkulátor típus", "AI elemzés és ajánlások", "Projekt összehasonlítás", "Speciális export"], 
                cta: betaMode ? "Csatlakozás a várólistához" : "Pro választása", 
                popular: !betaMode, 
                isComingSoon: betaMode 
            },
            { 
                name: "Business", 
                price: "Hamarosan", 
                desc: "Csapatoknak, fejlesztőknek és cégeknek.", 
                features: ["Minden a Pro-ban", "Csapatmunka (hamarosan)", "Márkázott jelentések (hamarosan)", "Kiemelt támogatás"], 
                cta: "Hamarosan",
                isComingSoon: true
            },
        ],
        de: [
            { 
                name: betaMode ? "Beta-Zugang" : "Kostenlos", 
                price: betaMode ? "Kostenlos" : "0€", 
                desc: betaMode ? "Werde Early Adopter und hilf uns, Estivo zu gestalten!" : "Für Einsteiger-Investoren.", 
                features: betaMode ? ["Alle Pro-Funktionen", "Unbegrenzte Projekte", "Alle Rechnertypen", "KI-Analyse", "Priorisierter Support", "Lebenslange Early-Adopter-Vorteile"] : ["1 Projekt", "Basis-Rechner", "PDF-Export"], 
                cta: betaMode ? "Beta beitreten" : "Loslegen", 
                isBeta: betaMode 
            },
            { 
                name: "Pro", 
                price: betaMode ? "Demnächst" : "29€", 
                desc: betaMode ? "Vollständige professionelle Funktionen bald verfügbar." : "Für aktive Investoren und Profis.", 
                features: ["Unbegrenzte Projekte", "Alle Rechnertypen", "KI-Analyse & Empfehlungen", "Projektvergleich", "Erweiterter Export"], 
                cta: betaMode ? "Warteliste beitreten" : "Pro wählen", 
                popular: !betaMode, 
                isComingSoon: betaMode 
            },
            { 
                name: "Business", 
                price: "Demnächst", 
                desc: "Für Teams, Entwickler und Firmen.", 
                features: ["Alles in Pro", "Team-Kollaboration (bald)", "Markenberichte (bald)", "Priorisierter Support"], 
                cta: "Demnächst",
                isComingSoon: true
            },
        ]
    };

    const currentPlans = pricingPlans[language] || pricingPlans.en;
    
    const faqData = {
        en: [
            {
                q: "Is Estivo suitable for both individuals and companies?",
                a: "Yes. You can switch between different tax regimes (personal vs. corporate), VAT settings, and depreciation rules directly in the calculators to match your specific entity."
            },
            {
                q: "Which countries are supported?",
                a: "Currently, we have specific presets for Slovakia, Czech Republic, Poland, and Hungary. We are continuously working on adding more countries."
            },
            {
                q: "Can I export my analysis?",
                a: "Yes, PDF and Excel exports are available in our Pro and Business plans. The Business plan also includes white-label reports with your own branding."
            },
            {
                q: "Where does the market data come from?",
                a: "Our analysis is powered by a combination of public statistical data, aggregated data from real estate portals, and current bank rates. We provide a full list of data sources in the final report."
            },
            {
                q: "Can I save and manage multiple projects?",
                a: "Absolutely. The Free plan has a limit on saved projects, while the Pro and Business plans offer unlimited project storage."
            },
            {
                q: "Is it possible to add my own custom costs or parameters?",
                a: "Yes. Each calculator module includes sections for 'Custom Costs' and 'Notes,' allowing you to add any unique line items. This information is then included in the final report."
            },
            {
                q: "Is Estivo suitable for beginner investors?",
                a: "Yes. We designed it to be intuitive for all levels. Every financial metric includes a helpful tooltip explaining what it means and how it's calculated, helping you learn as you go."
            }
        ],
        sk: [
             {
                q: "Je Estivo vhodné pre fyzické aj právnické osoby?",
                a: "Áno. Priamo v kalkulačkách môžete prepínať medzi rôznymi daňovými režimami (FO vs. PO), nastaveniami DPH a pravidlami odpisov tak, aby to zodpovedalo vašej situácii."
            },
            {
                q: "Ktoré krajiny sú podporované?",
                a: "Aktuálne máme prednastavenia pre Slovensko, Českú republiku, Poľsko a Maďarsko. Neustále pracujeme na pridávaní ďalších krajín."
            },
            {
                q: "Môžem si svoju analýzu exportovať?",
                a: "Áno, exporty do PDF a Excelu sú dostupné v našich plánoch Pro a Business. Plán Business zahŕňa aj white-label reporty s vašim vlastným brandom."
            },
            {
                q: "Odkiaľ pochádzajú trhové dáta?",
                a: "Naša analýza je založená na kombinácii verejných štatistických údajov, agregovaných dát z realitných portálov a aktuálnych sadzieb bánk. V konečnom reporte uvádzame kompletný zoznam zdrojov."
            },
            {
                q: "Môžem ukladať a spravovať viacero projektov?",
                a: "Samozrejme. Plán Free má limit na uložené projekty, zatiaľ čo plány Pro a Business ponúkajú neobmedzený počet projektov."
            },
            {
                q: "Je možné pridať vlastné náklady alebo parametre?",
                a: "Áno. Každý modul kalkulačky obsahuje sekcie pre 'Vlastné náklady' a 'Poznámky', čo vám umožňuje pridať akékoľvek jedinečné položky. Tieto informácie sa potom zahrnú do finálneho reportu."
            },
            {
                q: "Je Estivo vhodné pre začínajúcich investorov?",
                a: "Áno. Navrhli sme ho tak, aby bolo intuitívne pre všetky úrovne. Každá finančná metrika obsahuje nápovedu (tooltip), ktorá vysvetľuje, čo znamená a ako sa počíta, čo vám pomôže učiť sa za pochodu."
            }
        ]
    };
    
    const faqItems = faqData[language] || faqData.en;

    const faqTranslations = {
        en: {
            view_all: "View All FAQs"
        },
        sk: {
            view_all: "Zobraziť všetky FAQ"
        },
        pl: {
            view_all: "Zobacz wszystkie FAQ"
        },
        hu: {
            view_all: "Összes GYIK megtekintése"
        },
        de: {
            view_all: "Alle FAQs anzeigen"
        }
    };

    const faqT = faqTranslations[language] || faqTranslations.en;

    const testimonialsData = {
        en: [
            { text: "Estivo is the first tool I recommend. It cuts through the noise and shows you the numbers that actually matter. The cash flow projections are spot-on.", author: "Martin S.", role: "Real Estate Mentor" },
            { text: "As a developer, the development calculator is a game-changer. I can model entire projects and present clear, professional reports to my financial partners.", author: "Jana K.", role: "Property Developer" },
            { text: "I manage a portfolio of over 20 rental properties. With Estivo, I was able to identify two underperforming assets and adjust my strategy.", author: "Piotr W.", role: "Portfolio Landlord" }
        ],
        sk: [
            { text: "Estivo je prvý nástroj, ktorý odporúčam. Preseká sa všetkým šumom a ukáže vám čísla, na ktorých skutočne záleží. Projekcie cash flow sú presné.", author: "Martin S.", role: "Realitný mentor" },
            { text: "Ako developerovi mi developerská kalkulačka mení pravidlá hry. Môžem modelovať celé projekty a prezentovať jasné, profesionálne reporty mojim finančným partnerom.", author: "Jana K.", role: "Developerka" },
            { text: "Spravujem portfólio viac ako 20 nájomných nehnuteľností. S Estivom som dokázal identifikovať dve ne výkonné aktíva a upraviť svoju stratégiu.", author: "Piotr W.", role: "Portfólio manažér" }
        ]
    };

    const currentTestimonials = testimonialsData[language] || testimonialsData.en;

    console.log('[Landing] Rendering with betaMode:', betaMode);

    return (
        <div className="bg-background text-foreground">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(0,76,151,0.07)_0,_rgba(0,76,151,0)_50%)]"></div>
                <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/2 w-[1200px] h-[1200px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(0,163,224,0.05)_0,_rgba(0,163,224,0)_55%)]"></div>
            </div>

            <PublicHeader t={t} language={language} onLanguageChange={handleSetLanguage} isLoggedIn={!!user} />

            <main className="relative">
                {/* Hero Section */}
                <section className="container mx-auto px-4 sm:px-6 pt-16 pb-12 md:pt-24 md:pb-16">
                    <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center">
                        <motion.div
                            className="z-10 text-center lg:text-left"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            {betaMode && (
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full mb-6">
                                    <span className="px-2 py-0.5 text-xs font-bold bg-amber-500 text-white rounded-full">BETA</span>
                                    <span className="text-sm font-medium text-amber-700">
                                        {language === 'sk' ? 'Pripojte sa k prvým používateľom!' : 'Join our early adopters!'}
                                    </span>
                                </div>
                            )}
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 sm:mb-6 text-foreground">
                                {t.heroTitle}
                            </h1>
                            <p className="max-w-xl mx-auto lg:mx-0 text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8">
                                {t.heroSubtitle}
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 sm:gap-4">
                                <Button size="lg" onClick={handleGetStarted} className="w-full sm:w-auto bg-accent-gradient text-white hover:opacity-90 shadow-lg px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg">
                                    {betaMode ? (language === 'sk' ? 'Pripojiť sa k Beta' : 'Join Beta') : t.getStarted}
                                </Button>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="flex justify-center lg:justify-end"
                        >
                           <QuickRoiCalculator t={t} />
                        </motion.div>
                    </div>
                </section>
                
                {/* Features Section */}
                <section id="features" className="py-16 sm:py-24 bg-card/50">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto">
                             <h2 className="text-3xl sm:text-4xl font-bold text-center text-foreground">{t.features_title}</h2>
                             <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground">{t.features_subtitle}</p>
                        </div>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                            <FeatureCard 
                                icon={BarChart3} 
                                title={t.feature1_title} 
                                description={t.feature1_desc}
                                delay={0.1}
                            />
                            <FeatureCard 
                                icon={Gem} 
                                title={t.feature2_title}
                                description={t.feature2_desc}
                                delay={0.2}
                            />
                            <FeatureCard 
                                icon={Users} 
                                title={t.feature3_title}
                                description={t.feature3_desc}
                                delay={0.3}
                            />
                        </div>
                    </div>
                </section>

                {/* Why Estivo Section */}
                <section id="why-estivo" className="py-16 sm:py-24">
                     <div className="container mx-auto px-4 sm:px-6">
                        <div className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto">
                             <h2 className="text-3xl sm:text-4xl font-bold text-center text-foreground">{t.why_title}</h2>
                             <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground">{t.why_subtitle}</p>
                        </div>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 text-center">
                            <div className="p-4 sm:p-6">
                                <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-accent/50 text-primary rounded-xl mb-4 sm:mb-6 mx-auto">
                                    <BarChart3 className="w-7 h-7 sm:w-8 sm:h-8"/>
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">{t.why1_title}</h3>
                                <p className="text-sm sm:text-base text-muted-foreground">{t.why1_desc}</p>
                            </div>
                            <div className="p-4 sm:p-6">
                                 <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-accent/50 text-primary rounded-xl mb-4 sm:mb-6 mx-auto">
                                    <Gem className="w-7 h-7 sm:w-8 sm:h-8"/>
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">{t.why2_title}</h3>
                                <p className="text-sm sm:text-base text-muted-foreground">{t.why2_desc}</p>
                            </div>
                            <div className="p-4 sm:p-6">
                                 <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-accent/50 text-primary rounded-xl mb-4 sm:mb-6 mx-auto">
                                    <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8"/>
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">{t.why3_title}</h3>
                                <p className="text-sm sm:text-base text-muted-foreground">{t.why3_desc}</p>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Pricing Section - Mobile Optimized */}
                <section id="pricing" className="py-16 sm:py-24 bg-background">
                     <div className="container mx-auto px-4 sm:px-6">
                        <div className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto">
                             <h2 className="text-3xl sm:text-4xl font-bold text-center text-foreground">{t.pricing_title}</h2>
                             <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground">{t.pricing_subtitle}</p>
                             {betaMode && (
                                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                    <p className="text-sm text-amber-900 font-medium">
                                        {language === 'sk' 
                                            ? '🎉 Počas beta fázy majú všetci používatelia prístup k plným Pro funkciám zadarmo!' 
                                            : '🎉 During beta, all users get full Pro features for free!'}
                                    </p>
                                </div>
                             )}
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-start max-w-5xl mx-auto">
                            {currentPlans.map((plan) => (
                                 <Card key={plan.name} className={`rounded-2xl p-6 sm:p-8 border-2 transition-all duration-300 transform hover:-translate-y-2 ${plan.popular || plan.isBeta ? 'border-primary/80 bg-card scale-105 shadow-2xl' : 'bg-card border-border'} ${plan.isComingSoon ? 'opacity-75' : ''}`}>
                                    {(plan.popular || plan.isBeta || plan.isComingSoon) && (
                                        <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                                            <span className="px-3 sm:px-4 py-1 text-xs sm:text-sm font-semibold text-white bg-accent-gradient rounded-full flex items-center gap-1.5 justify-center whitespace-nowrap">
                                                <Star className="w-3 h-3 sm:w-4 sm:h-4" /> {plan.isBeta ? (language === 'sk' ? 'Beta Prístup' : 'Beta Access') : (language === 'sk' ? 'Čoskoro' : 'Coming Soon')}
                                            </span>
                                        </div>
                                    )}
                                    <div className="text-center mt-4">
                                        <CardTitle className="text-2xl sm:text-3xl font-bold">{plan.name}</CardTitle>
                                        <p className="text-muted-foreground mt-2 h-10 text-sm sm:text-base">{plan.desc}</p>
                                        <div className="text-4xl sm:text-5xl font-extrabold text-primary mt-4 sm:mt-6">
                                            {plan.price}
                                            {(!plan.isComingSoon && !plan.isBeta && plan.price.includes('€') && plan.name !== 'Free') && <span className="text-base sm:text-lg font-medium text-muted-foreground">/ {language === 'sk' ? 'mesiac' : 'month'}</span>}
                                        </div>
                                    </div>
                                    <ul className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center gap-2 sm:gap-3">
                                                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                                                <span className="text-foreground text-sm sm:text-base">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-8 sm:mt-10">
                                        <Button 
                                            onClick={plan.isComingSoon ? undefined : handleGetStarted} 
                                            disabled={plan.isComingSoon}
                                            className={`w-full text-base sm:text-lg py-2.5 sm:py-3 ${(plan.popular || plan.isBeta) && !plan.isComingSoon ? 'text-white bg-accent-gradient hover:opacity-90' : ''}`} 
                                            variant={(plan.popular || plan.isBeta) && !plan.isComingSoon ? 'default' : 'outline'}
                                        >
                                            {plan.cta}
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section id="faq" className="py-16 sm:py-24 bg-card/50">
                    <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
                        <div className="text-center mb-12 sm:mb-16">
                            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">{t.faq_title}</h2>
                            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground">{t.faq_subtitle}</p>
                        </div>
                        <Accordion type="single" collapsible className="w-full space-y-3 sm:space-y-4">
                            {faqItems.map((item, index) => (
                                <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-lg bg-card shadow-sm">
                                    <AccordionTrigger className="text-left font-semibold px-4 sm:px-6 py-3 sm:py-4 hover:no-underline text-foreground text-sm sm:text-base">
                                        {item.q}
                                    </AccordionTrigger>
                                    <AccordionContent className="px-4 sm:px-6 pb-4 sm:pb-6 text-muted-foreground text-sm sm:text-base">
                                        {item.a}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                        
                        <div className="text-center mt-8">
                            <Link to={createPageUrl('Contact')}>
                                <Button variant="outline" size="lg" className="gap-2">
                                    {faqT.view_all}
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="py-16 sm:py-24">
                    <div className="container mx-auto px-4 sm:px-6">
                        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 sm:mb-16 text-foreground">{t.testimonials_title}</h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {currentTestimonials.map((testimonial, index) => (
                                <TestimonialCard 
                                    key={index}
                                    text={testimonial.text}
                                    author={testimonial.author}
                                    role={testimonial.role}
                                    delay={0.1 * (index + 1)}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 sm:py-24 bg-accent-gradient">
                     <div className="container mx-auto px-4 sm:px-6 text-center">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">{t.cta_title}</h2>
                        <p className="text-base sm:text-lg text-white/80 mb-6 sm:mb-8 max-w-2xl mx-auto">
                           {t.cta_subtitle}
                        </p>
                        <Button size="lg" onClick={handleGetStarted} variant="secondary" className="bg-white text-primary hover:bg-gray-200 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 transform hover:scale-105 transition-transform">
                           {t.cta_button}
                        </Button>
                    </div>
                </section>
            </main>

            <PublicFooter t={t} />
            <CookieConsentBanner language={language} />
        </div>
    );
}
