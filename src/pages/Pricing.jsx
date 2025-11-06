
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle, Star, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function PricingPage() {
    const { data: user, isLoading } = useQuery({
        queryKey: ['currentUser'],
        queryFn: () => base44.auth.me(),
        retry: false
    });

    const language = user?.preferred_language || localStorage.getItem('preferred_language') || 'en';

    const translationMaps = {
        sk: {
            title: "Vyberte si plán, ktorý vám najviac vyhovuje",
            subtitle: "Odomknite pokročilé nástroje a neobmedzené projekty pre profesionálnu analýzu.",
            free: "Free",
            free_desc: "Pre začínajúcich investorov.",
            free_price: "0€",
            free_features: ["1 projekt", "Základné kalkulačky", "Export do PDF"],
            current_plan: "Váš aktuálny plán",
            pro: "Pro",
            pro_desc: "Pre aktívnych investorov a profesionálov.",
            pro_price: "29€",
            pro_per_month: "/ mesiac",
            pro_features: ["Neobmedzené projekty", "Všetky typy kalkulačiek", "AI Analýza a Odporúčania", "Porovnávanie projektov", "Pokročilý export"],
            upgrade_to_pro: "Upgradovať na Pro",
            most_popular: "Najpopulárnejší",
            business: "Business",
            business_desc: "Pre tímy, developerov a firmy.",
            business_price: "Kontaktujte nás",
            business_features: ["Všetko v Pro", "Tímová spolupráca (čoskoro)", "Branding reportov (čoskoro)", "Prioritná podpora"],
            contact_us: "Kontaktujte nás"
        },
        en: {
            title: "Choose the Plan That's Right for You",
            subtitle: "Unlock advanced tools and unlimited projects for professional-grade analysis.",
            free: "Free",
            free_desc: "For investors just starting out.",
            free_price: "€0",
            free_features: ["1 Project", "Basic Calculators", "PDF Export"],
            current_plan: "Your Current Plan",
            pro: "Pro",
            pro_desc: "For active investors and professionals.",
            pro_price: "€29",
            pro_per_month: "/ month",
            pro_features: ["Unlimited Projects", "All Calculator Types", "AI Analysis & Recommendations", "Project Comparison", "Advanced Export"],
            upgrade_to_pro: "Upgrade to Pro",
            most_popular: "Most Popular",
            business: "Business",
            business_desc: "For teams, developers, and firms.",
            business_price: "Contact Us",
            business_features: ["Everything in Pro", "Team Collaboration (soon)", "Branded Reports (soon)", "Priority Support"],
            contact_us: "Contact Us"
        },
        pl: {
            title: "Wybierz plan, który Ci odpowiada",
            subtitle: "Odblokuj zaawansowane narzędzia i nieograniczone projekty do profesjonalnej analizy.",
            free: "Darmowy",
            free_desc: "Dla początkujących inwestorów.",
            free_price: "0€",
            free_features: ["1 projekt", "Podstawowe kalkulatory", "Eksport do PDF"],
            current_plan: "Twój obecny plan",
            pro: "Pro",
            pro_desc: "Dla aktywnych inwestorów i profesjonalistów.",
            pro_price: "129zł",
            pro_per_month: "/ miesiąc",
            pro_features: ["Nieograniczone projekty", "Wszystkie typy kalkulatorów", "Analiza i rekomendacje AI", "Porównywanie projektów", "Zaawansowany eksport"],
            upgrade_to_pro: "Ulepsz do Pro",
            most_popular: "Najpopularniejszy",
            business: "Biznes",
            business_desc: "Dla zespołów, deweloperów i firm.",
            business_price: "Skontaktuj się z nami",
            business_features: ["Wszystko w Pro", "Współpraca zespołowa (wkrótce)", "Branding raportów (wkrótce)", "Priorytetowe wsparcie"],
            contact_us: "Skontaktuj się z nami"
        },
        hu: {
            title: "Válassza ki az Önnek megfelelő csomagot",
            subtitle: "Nyisson meg haladó eszközöket és korlátlan projekteket a professzionális elemzéshez.",
            free: "Ingyenes",
            free_desc: "Kezdő befektetőknek.",
            free_price: "0 Ft",
            free_features: ["1 projekt", "Alap kalkulátorok", "PDF export"],
            current_plan: "Jelenlegi csomagod",
            pro: "Pro",
            pro_desc: "Aktív befektetőknek és szakembereknek.",
            pro_price: "11,900 Ft",
            pro_per_month: "/ hónap",
            pro_features: ["Korlátlan projektek", "Minden kalkulátor típus", "AI elemzés és ajánlások", "Projektek összehasonlítása", "Haladó export"],
            upgrade_to_pro: "Frissítés Pro-ra",
            most_popular: "Legnépszerűbb",
            business: "Üzleti",
            business_desc: "Csapatoknak, fejlesztőknek és cégeknek.",
            business_price: "Lépjen kapcsolatba velünk",
            business_features: ["Minden a Pro-ban", "Csapatmunka (hamarosan)", "Márkázott jelentések (hamarosan)", "Kiemelt támogatás"],
            contact_us: "Lépjen kapcsolatba velünk"
        },
         de: {
            title: "Wählen Sie den passenden Plan",
            subtitle: "Schalten Sie erweiterte Tools und unbegrenzte Projekte für professionelle Analysen frei.",
            free: "Kostenlos",
            free_desc: "Für Einsteiger-Investoren.",
            free_price: "0€",
            free_features: ["1 Projekt", "Basis-Rechner", "PDF-Export"],
            current_plan: "Ihr aktueller Plan",
            pro: "Pro",
            pro_desc: "Für aktive Investoren und Profis.",
            pro_price: "29€",
            pro_per_month: "/ Monat",
            pro_features: ["Unbegrenzte Projekte", "Alle Rechnertypen", "KI-Analyse & Empfehlungen", "Projektvergleich", "Erweiterter Export"],
            upgrade_to_pro: "Upgrade auf Pro",
            most_popular: "Am beliebtesten",
            business: "Business",
            business_desc: "Für Teams, Entwickler und Firmen.",
            business_price: "Kontaktieren Sie uns",
            business_features: ["Alles in Pro", "Team-Kollaboration (bald)", "Markenberichte (bald)", "Priorisierter Support"],
            contact_us: "Kontaktieren Sie uns"
        },
    };

    const t = translationMaps[language] || translationMaps.en;

    const plans = [
        { name: t.free, id: 'free', desc: t.free_desc, price: t.free_price, features: t.free_features, isCurrent: user?.plan === 'free' },
        { name: t.pro, id: 'pro', desc: t.pro_desc, price: t.pro_price, price_suffix: t.pro_per_month, features: t.pro_features, isCurrent: user?.plan === 'pro', isPopular: true, stripe_link: 'https://buy.stripe.com/test_dummy_link_for_pro' },
        { name: t.business, id: 'business', desc: t.business_desc, price: t.business_price, features: t.business_features, isCurrent: user?.plan === 'business', contact: true }
    ];
    
    if (isLoading) {
        return <div className="flex justify-center items-center h-screen bg-background"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="bg-background text-foreground">
            <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-extrabold text-foreground sm:text-6xl">{t.title}</h1>
                    <p className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto">{t.subtitle}</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 items-start max-w-5xl mx-auto">
                    {plans.map((plan) => (
                        <Card key={plan.id} className={`rounded-2xl p-8 border-2 transition-all duration-300 transform hover:-translate-y-2 ${plan.isPopular ? 'border-[var(--accent-gradient-start)] bg-card scale-105 shadow-2xl' : 'bg-card border-border'}`}>
                            {plan.isPopular && (
                                <div className="text-center -mt-4 mb-6">
                                    <span className="px-4 py-1 text-sm font-semibold text-white bg-gradient-to-r from-[var(--accent-gradient-start)] to-[var(--accent-gradient-end)] rounded-full flex items-center gap-1.5 justify-center shadow-lg">
                                        <Star className="w-4 h-4" /> {t.most_popular}
                                    </span>
                                </div>
                            )}
                            <div className="text-center">
                                <CardTitle className="text-3xl font-bold">{plan.name}</CardTitle>
                                <p className="text-muted-foreground mt-2 h-10">{plan.desc}</p>
                                <div className="text-5xl font-extrabold text-primary mt-6">
                                    {plan.price}
                                    {plan.price_suffix && <span className="text-lg font-medium text-muted-foreground">{plan.price_suffix}</span>}
                                </div>
                            </div>
                            <ul className="mt-8 space-y-4">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        <span className="text-foreground">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-10">
                                {plan.isCurrent ? (
                                    <Button variant="outline" className="w-full text-lg py-3 cursor-default" disabled>{t.current_plan}</Button>
                                ) : plan.stripe_link ? (
                                    <a href={plan.stripe_link} className="block w-full">
                                        <Button className={`w-full text-lg py-3 text-white ${plan.isPopular ? 'bg-gradient-to-r from-[var(--accent-gradient-start)] to-[var(--accent-gradient-end)] hover:opacity-90' : 'bg-primary hover:bg-primary/90'}`}>{t.upgrade_to_pro}</Button>
                                    </a>
                                ) : plan.contact ? (
                                    <Link to={createPageUrl("Landing")} className="block w-full">
                                        <Button variant="outline" className="w-full text-lg py-3">{t.contact_us}</Button>
                                    </Link>
                                ) : (
                                    <Button className="w-full text-lg py-3" disabled>{t.current_plan}</Button>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
