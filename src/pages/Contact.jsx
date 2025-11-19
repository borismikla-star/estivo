import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Mail, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from '@/components/ui/card';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { getLandingPageTranslations } from '@/components/lib/translations';

export default function ContactPage() {
    const [language, setLanguage] = useState(() => localStorage.getItem('estivo_lang') || 'en');

    const { data: faqItems, isLoading } = useQuery({
        queryKey: ['activeFAQs'],
        queryFn: () => base44.entities.FAQ.filter({ is_active: true }, 'order'),
    });

    const handleSetLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem('estivo_lang', lang);
    };

    const t = getLandingPageTranslations(language);

    const translations = {
        sk: {
            title: "Kontaktujte nás",
            subtitle: "Máte otázky? Radi vám pomôžeme!",
            email_title: "Email",
            email_desc: "Napíšte nám a odpovieme čo najskôr.",
            social_title: "Sledujte nás",
            social_desc: "Buďte v obraze s novinkami a tipmi.",
            faq_title: "Často kladené otázky",
            faq_subtitle: "Odpovede na najčastejšie otázky nájdete tu.",
            category_general: "Všeobecné",
            category_billing: "Platby",
            category_technical: "Technické",
            category_legal: "Právne"
        },
        en: {
            title: "Contact Us",
            subtitle: "Have questions? We're here to help!",
            email_title: "Email",
            email_desc: "Drop us a line and we'll get back to you as soon as possible.",
            social_title: "Follow Us",
            social_desc: "Stay updated with news and tips.",
            faq_title: "Frequently Asked Questions",
            faq_subtitle: "Find answers to the most common questions here.",
            category_general: "General",
            category_billing: "Billing",
            category_technical: "Technical",
            category_legal: "Legal"
        },
        pl: {
            title: "Skontaktuj się z nami",
            subtitle: "Masz pytania? Jesteśmy tutaj, aby pomóc!",
            email_title: "Email",
            email_desc: "Napisz do nas, a odpowiemy tak szybko, jak to możliwe.",
            social_title: "Śledź nas",
            social_desc: "Bądź na bieżąco z nowościami i poradami.",
            faq_title: "Najczęściej zadawane pytania",
            faq_subtitle: "Znajdź odpowiedzi na najczęstsze pytania tutaj.",
            category_general: "Ogólne",
            category_billing: "Płatności",
            category_technical: "Techniczne",
            category_legal: "Prawne"
        },
        hu: {
            title: "Lépjen kapcsolatba velünk",
            subtitle: "Kérdései vannak? Itt vagyunk, hogy segítsünk!",
            email_title: "Email",
            email_desc: "Írjon nekünk, és a lehető leghamarabb válaszolunk.",
            social_title: "Kövessen minket",
            social_desc: "Maradjon naprakész a hírek és tippek tekintetében.",
            faq_title: "Gyakran ismételt kérdések",
            faq_subtitle: "Válaszokat találhat a leggyakoribb kérdésekre itt.",
            category_general: "Általános",
            category_billing: "Számlázás",
            category_technical: "Technikai",
            category_legal: "Jogi"
        },
        de: {
            title: "Kontaktieren Sie uns",
            subtitle: "Haben Sie Fragen? Wir sind hier um zu helfen!",
            email_title: "E-Mail",
            email_desc: "Schreiben Sie uns und wir melden uns so schnell wie möglich.",
            social_title: "Folgen Sie uns",
            social_desc: "Bleiben Sie auf dem Laufenden mit Neuigkeiten und Tipps.",
            faq_title: "Häufig gestellte Fragen",
            faq_subtitle: "Finden Sie hier Antworten auf die häufigsten Fragen.",
            category_general: "Allgemein",
            category_billing: "Abrechnung",
            category_technical: "Technisch",
            category_legal: "Rechtlich"
        }
    };

    const ct = translations[language] || translations.en;

    const socialLinks = [
        { name: 'Facebook', icon: Facebook, url: 'https://www.facebook.com/profile.php?id=61583115466142', color: 'hover:text-blue-600' },
        { name: 'Instagram', icon: Instagram, url: 'https://www.instagram.com/estivo.io/', color: 'hover:text-pink-600' },
        { name: 'LinkedIn', icon: Linkedin, url: 'https://www.linkedin.com/in/info-estivo-559862396/', color: 'hover:text-blue-700' },
        { name: 'Twitter', icon: Twitter, url: 'https://x.com/estivo_io', color: 'hover:text-sky-500' },
    ];

    const groupedFAQs = faqItems?.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {}) || {};

    return (
        <div className="bg-background text-foreground min-h-screen flex flex-col">
            <PublicHeader t={t} language={language} onLanguageChange={handleSetLanguage} />
            <main className="flex-grow">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-5xl font-extrabold text-foreground sm:text-6xl">{ct.title}</h1>
                        <p className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto">{ct.subtitle}</p>
                    </div>

                    {/* Contact Cards */}
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
                        {/* Email Card */}
                        <Card className="p-8 text-center hover:shadow-lg transition-shadow">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Mail className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground mb-3">{ct.email_title}</h3>
                            <p className="text-muted-foreground mb-6">{ct.email_desc}</p>
                            <a href="mailto:info@estivo.io" className="text-primary font-semibold text-lg hover:underline">
                                info@estivo.io
                            </a>
                        </Card>

                        {/* Social Media Card */}
                        <Card className="p-8 text-center hover:shadow-lg transition-shadow">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Linkedin className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground mb-3">{ct.social_title}</h3>
                            <p className="text-muted-foreground mb-6">{ct.social_desc}</p>
                            <div className="flex justify-center gap-4">
                                {socialLinks.map(social => (
                                    social.url ? (
                                        <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" 
                                           className={`text-muted-foreground ${social.color} transition-colors`}>
                                            <social.icon className="w-6 h-6" />
                                        </a>
                                    ) : (
                                        <span key={social.name} className="text-muted-foreground/30 cursor-not-allowed">
                                            <social.icon className="w-6 h-6" />
                                        </span>
                                    )
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* FAQ Section */}
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-foreground">{ct.faq_title}</h2>
                            <p className="mt-4 text-lg text-muted-foreground">{ct.faq_subtitle}</p>
                        </div>

                        {isLoading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                            </div>
                        ) : (
                            <>
                                {Object.entries(groupedFAQs).map(([category, items]) => (
                                    <div key={category} className="mb-12">
                                        <h3 className="text-2xl font-bold text-foreground mb-6">
                                            {ct[`category_${category}`]}
                                        </h3>
                                        <Accordion type="single" collapsible className="w-full space-y-4">
                                            {items.map((item, index) => (
                                                <AccordionItem key={item.id} value={`item-${index}`} 
                                                               className="border border-border rounded-lg bg-card shadow-sm">
                                                    <AccordionTrigger className="text-left font-semibold px-6 py-4 hover:no-underline text-foreground">
                                                        {language === 'sk' ? item.question_sk : item.question_en}
                                                    </AccordionTrigger>
                                                    <AccordionContent className="px-6 pb-6 text-muted-foreground whitespace-pre-line">
                                                        {language === 'sk' ? item.answer_sk : item.answer_en}
                                                    </AccordionContent>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    </div>
                                ))}
                            </>
                        )}

                        {!isLoading && (!faqItems || faqItems.length === 0) && (
                            <p className="text-center text-muted-foreground py-12">
                                {language === 'sk' ? 'Zatiaľ tu nie sú žiadne FAQ položky.' : 'No FAQ items available yet.'}
                            </p>
                        )}
                    </div>
                </div>
            </main>
            <PublicFooter t={t} />
        </div>
    );
}