import { base44 } from '@/api/base44Client';

// Cache pre AI preklady (aby sme nevolali AI opakovane)
const translationCache = new Map();

export const getLandingPageTranslations = (language) => {
    const translations = {
        en: {
            // Navigation
            nav_features: "Features",
            nav_why: "Why Estivo",
            nav_pricing: "Pricing",
            nav_faq: "FAQ",
            nav_blog: "Blog",
            nav_contact: "Contact",
            signIn: "Sign In",
            getStarted: "Get Started",
            
            // Hero
            heroTitle: "Invest in Real Estate Intelligently",
            heroSubtitle: "Professional-grade calculators and AI analysis to find winning property deals across Central Europe.",
            
            // Quick ROI Calculator
            quick_roi_title: "Quick ROI Check",
            quick_roi_subtitle: "Get a fast estimate of your investment potential",
            quick_roi_price: "Purchase Price (€)",
            quick_roi_rent: "Monthly Rent (€)",
            quick_roi_costs: "Initial Costs (€)",
            quick_roi_calculate: "Calculate",
            quick_roi_estimated_roi: "Est. ROI",
            quick_roi_estimated_profit: "Monthly Profit",
            
            // Features
            features_title: "Everything You Need to Analyze Deals",
            features_subtitle: "Built by investors, for investors. No fluff, just actionable insights.",
            feature1_title: "Long-Term & Short-Term Rentals",
            feature1_desc: "Model classic buy-to-let or Airbnb properties with precision cash flow projections.",
            feature2_title: "Commercial & Development",
            feature2_desc: "Advanced calculators for office, retail, and full development projects.",
            feature3_title: "Multi-Country Support",
            feature3_desc: "Pre-configured tax, depreciation, and legal frameworks for Slovakia, Czech Republic, Poland, and Hungary.",
            feature4_title: "Land Feasibility Analysis",
            feature4_desc: "Pre-investment land potential analysis — estimate buildable area, units, and development feasibility before you buy.",
            
            // Why
            why_title: "Why Estivo?",
            why_subtitle: "Because generic spreadsheets don't cut it anymore.",
            why1_title: "Investor-First Design",
            why1_desc: "We focus on metrics that actually matter: ROI, IRR, NPV, Cap Rate, Cash-on-Cash, and payback period.",
            why2_title: "Country-Specific Intelligence",
            why2_desc: "Tax rates, depreciation rules, and legislative notes tailored to your market.",
            why3_title: "Save & Compare Projects",
            why3_desc: "Build a portfolio, compare opportunities side-by-side, and track performance over time.",
            
            // Pricing
            pricing_title: "Simple, Transparent Pricing",
            pricing_subtitle: "Start free, upgrade when you're ready to scale.",
            
            // CTA
            cta_title: "Ready to Find Your Next Deal?",
            cta_subtitle: "Join hundreds of investors making smarter decisions with data.",
            cta_button: "Start Analyzing for Free",
            
            // Testimonials
            testimonials_title: "What Investors Are Saying",
            
            // FAQ
            faq_title: "Frequently Asked Questions",
            faq_subtitle: "Everything you need to know about Estivo.",
            
            // Footer
            footer_product: "Product",
            footer_resources: "Resources",
            footer_legal: "Legal",
            footer_company: "Company",
            footer_contact: "Contact",
            footer_terms: "Terms of Service",
            footer_privacy: "Privacy Policy",
            all_rights_reserved: "All rights reserved.",
        },
        sk: {
            // Navigation
            nav_features: "Funkcie",
            nav_why: "Prečo Estivo",
            nav_pricing: "Cenník",
            nav_faq: "FAQ",
            nav_blog: "Blog",
            nav_contact: "Kontakt",
            signIn: "Prihlásiť sa",
            getStarted: "Začať",
            
            // Hero
            heroTitle: "Investujte do nehnuteľností inteligentne",
            heroSubtitle: "Profesionálne kalkulačky a AI analýza na hľadanie ziskových nehnuteľností v strednej Európe.",
            
            // Quick ROI Calculator
            quick_roi_title: "Rýchla kontrola ROI",
            quick_roi_subtitle: "Získajte rýchly odhad investičného potenciálu",
            quick_roi_price: "Kúpna cena (€)",
            quick_roi_rent: "Mesačný nájom (€)",
            quick_roi_costs: "Počiatočné náklady (€)",
            quick_roi_calculate: "Vypočítať",
            quick_roi_estimated_roi: "Odhadovaný ROI",
            quick_roi_estimated_profit: "Mesačný zisk",
            
            // Features
            features_title: "Všetko, čo potrebujete na analýzu investícií",
            features_subtitle: "Vytvorené investormi, pre investorov. Žiadne zbytočnosti, iba užitočné informácie.",
            feature1_title: "Dlhodobý a krátkodobý prenájom",
            feature1_desc: "Modelujte klasické prenájmy alebo Airbnb nehnuteľnosti s presnými projekciami cash flow.",
            feature2_title: "Komerčné a developerské projekty",
            feature2_desc: "Pokročilé kalkulačky pre kancelárie, obchody a komplexné stavebné projekty.",
            feature3_title: "Podpora viacerých krajín",
            feature3_desc: "Predkonfigurované dane, odpisy a právne rámce pre Slovensko, Českú republiku, Poľsko a Maďarsko.",
            feature4_title: "Analýza uskutočniteľnosti pozemku",
            feature4_desc: "Predkúpová analýza potenciálu pozemku — odhadnite zastavanosť, počet bytov a uskutočniteľnosť projektu skôr, ako kúpite.",
            
            // Why
            why_title: "Prečo Estivo?",
            why_subtitle: "Pretože všeobecné tabuľky už nestačia.",
            why1_title: "Dizajn pre investorov",
            why1_desc: "Zameriavame sa na metriky, ktoré skutočne záležia: ROI, IRR, NPV, Cap Rate, Cash-on-Cash a doba návratnosti.",
            why2_title: "Inteligencia špecifická pre krajinu",
            why2_desc: "Daňové sadzby, pravidlá odpisov a legislatívne poznámky prispôsobené vášmu trhu.",
            why3_title: "Ukladanie a porovnávanie projektov",
            why3_desc: "Vytvorte si portfólio, porovnajte príležitosti vedľa seba a sledujte výkonnosť v čase.",
            
            // Pricing
            pricing_title: "Jednoduché, transparentné ceny",
            pricing_subtitle: "Začnite zadarmo, upgradujte keď ste pripravení rásť.",
            
            // CTA
            cta_title: "Pripravení nájsť vašu ďalšiu investíciu?",
            cta_subtitle: "Pripojte sa k stovkám investorov, ktorí robia múdrejšie rozhodnutia s dátami.",
            cta_button: "Začať analyzovať zadarmo",
            
            // Testimonials
            testimonials_title: "Čo hovoria investori",
            
            // FAQ
            faq_title: "Často kladené otázky",
            faq_subtitle: "Všetko, čo potrebujete vedieť o Estivo.",
            
            // Footer
            footer_product: "Produkt",
            footer_resources: "Zdroje",
            footer_legal: "Právne",
            footer_company: "Firma",
            footer_contact: "Kontakt",
            footer_terms: "Podmienky používania",
            footer_privacy: "Ochrana osobných údajov",
            all_rights_reserved: "Všetky práva vyhradené.",
        },
        pl: {
            // Navigation
            nav_features: "Funkcje",
            nav_why: "Dlaczego Estivo",
            nav_pricing: "Cennik",
            nav_faq: "FAQ",
            nav_blog: "Blog",
            nav_contact: "Kontakt",
            signIn: "Zaloguj się",
            getStarted: "Rozpocznij",
            
            // Hero
            heroTitle: "Inwestuj w nieruchomości inteligentnie",
            heroSubtitle: "Profesjonalne kalkulatory i analiza AI do znajdowania zyskownych nieruchomości w Europie Środkowej.",
            
            // Quick ROI Calculator
            quick_roi_title: "Szybki check ROI",
            quick_roi_subtitle: "Uzyskaj szybką ocenę potencjału inwestycji",
            quick_roi_price: "Cena zakupu (€)",
            quick_roi_rent: "Miesięczny czynsz (€)",
            quick_roi_costs: "Koszty początkowe (€)",
            quick_roi_calculate: "Oblicz",
            quick_roi_estimated_roi: "Szac. ROI",
            quick_roi_estimated_profit: "Miesięczny zysk",
            
            // Features
            features_title: "Wszystko, czego potrzebujesz do analizy inwestycji",
            features_subtitle: "Stworzone przez inwestorów, dla inwestorów. Żadnych ozdobników, tylko praktyczne informacje.",
            feature1_title: "Wynajem długo i krótkoterminowy",
            feature1_desc: "Modeluj klasyczne wynajmy lub nieruchomości Airbnb z dokładnymi projekcjami przepływów pieniężnych.",
            feature2_title: "Projekty komercyjne i deweloperskie",
            feature2_desc: "Zaawansowane kalkulatory dla biur, sklepów i kompleksowych projektów budowlanych.",
            feature3_title: "Wsparcie wielu krajów",
            feature3_desc: "Wstępnie skonfigurowane podatki, amortyzacja i ramy prawne dla Słowacji, Czech, Polski i Węgier.",
            feature4_title: "Analiza wykonalności gruntu",
            feature4_desc: "Przedkupna analiza potencjału gruntu — oszacuj zabudowaną powierzchnię, liczbę jednostek i wykonalność inwestycji przed zakupem.",
            
            // Why
            why_title: "Dlaczego Estivo?",
            why_subtitle: "Ponieważ ogólne arkusze kalkulacyjne już nie wystarczają.",
            why1_title: "Projekt dla inwestorów",
            why1_desc: "Skupiamy się na metrykach, które naprawdę się liczą: ROI, IRR, NPV, Cap Rate, Cash-on-Cash i okres zwrotu.",
            why2_title: "Inteligencja specyficzna dla kraju",
            why2_desc: "Stawki podatkowe, zasady amortyzacji i uwagi legislacyjne dostosowane do Twojego rynku.",
            why3_title: "Zapisz i porównaj projekty",
            why3_desc: "Zbuduj portfolio, porównaj okazje obok siebie i śledź wydajność w czasie.",
            
            // Pricing
            pricing_title: "Prosty, przejrzysty cennik",
            pricing_subtitle: "Zacznij za darmo, uaktualnij gdy będziesz gotowy do skalowania.",
            
            // CTA
            cta_title: "Gotowy znaleźć swoją następną okazję?",
            cta_subtitle: "Dołącz do setek inwestorów podejmujących mądrzejsze decyzje dzięki danym.",
            cta_button: "Zacznij analizować za darmo",
            
            // Testimonials
            testimonials_title: "Co mówią inwestorzy",
            
            // FAQ
            faq_title: "Najczęściej zadawane pytania",
            faq_subtitle: "Wszystko, co musisz wiedzieć o Estivo.",
            
            // Footer
            footer_product: "Produkt",
            footer_resources: "Zasoby",
            footer_legal: "Prawne",
            footer_company: "Firma",
            footer_contact: "Kontakt",
            footer_terms: "Warunki korzystania",
            footer_privacy: "Polityka prywatności",
            all_rights_reserved: "Wszelkie prawa zastrzeżone.",
        },
        hu: {
            // Navigation
            nav_features: "Funkciók",
            nav_why: "Miért Estivo",
            nav_pricing: "Árak",
            nav_faq: "GYIK",
            nav_blog: "Blog",
            nav_contact: "Kapcsolat",
            signIn: "Bejelentkezés",
            getStarted: "Kezdés",
            
            // Hero
            heroTitle: "Fektessen be okosan az ingatlanokba",
            heroSubtitle: "Professzionális kalkulátorok és AI elemzés a nyerő ingatlanügyletek megtalálásához Közép-Európában.",
            
            // Quick ROI Calculator
            quick_roi_title: "Gyors ROI ellenőrzés",
            quick_roi_subtitle: "Gyors becslés a befektetési potenciálról",
            quick_roi_price: "Vételár (€)",
            quick_roi_rent: "Havi bérleti díj (€)",
            quick_roi_costs: "Kezdeti költségek (€)",
            quick_roi_calculate: "Számítás",
            quick_roi_estimated_roi: "Becsült ROI",
            quick_roi_estimated_profit: "Havi profit",
            
            // Features
            features_title: "Minden, amire szüksége van az ügyletek elemzéséhez",
            features_subtitle: "Befektetők által, befektetőknek készítve. Semmi felesleg, csak hasznos betekintések.",
            feature1_title: "Hosszú és rövid távú bérlés",
            feature1_desc: "Modellezzen klasszikus bérleti vagy Airbnb ingatlanokat pontos cash flow vetítésekkel.",
            feature2_title: "Kereskedelmi és fejlesztési projektek",
            feature2_desc: "Fejlett kalkulátorok irodákhoz, kiskereskedelemhez és teljes fejlesztési projektekhez.",
            feature3_title: "Több ország támogatása",
            feature3_desc: "Előre konfigurált adók, értékcsökkenés és jogi keretek Szlovákiához, Csehországhoz, Lengyelországhoz és Magyarországhoz.",
            
            // Why
            why_title: "Miért Estivo?",
            why_subtitle: "Mert az általános táblázatok már nem elegendőek.",
            why1_title: "Befektetőközpontú tervezés",
            why1_desc: "Azokra a mérőszámokra összpontosítunk, amelyek valóban számítanak: ROI, IRR, NPV, Cap Rate, Cash-on-Cash és megtérülési időszak.",
            why2_title: "Országspecifikus intelligencia",
            why2_desc: "Adókulcsok, értékcsökkenési szabályok és jogszabályi megjegyzések az Ön piacához igazítva.",
            why3_title: "Projektek mentése és összehasonlítása",
            why3_desc: "Építsen portfóliót, hasonlítsa össze a lehetőségeket egymás mellett, és kövesse nyomon a teljesítményt idővel.",
            
            // Pricing
            pricing_title: "Egyszerű, átlátható árazás",
            pricing_subtitle: "Kezdje ingyen, frissítsen amikor készen áll a növekedésre.",
            
            // CTA
            cta_title: "Készen áll a következő ügylet megtalálására?",
            cta_subtitle: "Csatlakozzon több száz befektetőhöz, akik okosabb döntéseket hoznak adatok alapján.",
            cta_button: "Kezdjen el elemezni ingyen",
            
            // Testimonials
            testimonials_title: "Mit mondanak a befektetők",
            
            // FAQ
            faq_title: "Gyakran ismételt kérdések",
            faq_subtitle: "Minden, amit tudnia kell az Estivoról.",
            
            // Footer
            footer_product: "Termék",
            footer_resources: "Források",
            footer_legal: "Jogi",
            footer_company: "Cég",
            footer_contact: "Kapcsolat",
            footer_terms: "Felhasználási feltételek",
            footer_privacy: "Adatvédelmi szabályzat",
            all_rights_reserved: "Minden jog fenntartva.",
        },
        de: {
            // Navigation
            nav_features: "Funktionen",
            nav_why: "Warum Estivo",
            nav_pricing: "Preise",
            nav_faq: "FAQ",
            nav_blog: "Blog",
            nav_contact: "Kontakt",
            signIn: "Anmelden",
            getStarted: "Loslegen",
            
            // Hero
            heroTitle: "Investieren Sie intelligent in Immobilien",
            heroSubtitle: "Professionelle Kalkulatoren und KI-Analyse zum Finden gewinnbringender Immobiliengeschäfte in Mitteleuropa.",
            
            // Quick ROI Calculator
            quick_roi_title: "Schnelle ROI-Prüfung",
            quick_roi_subtitle: "Erhalten Sie eine schnelle Schätzung Ihres Investitionspotenzials",
            quick_roi_price: "Kaufpreis (€)",
            quick_roi_rent: "Monatliche Miete (€)",
            quick_roi_costs: "Anfangskosten (€)",
            quick_roi_calculate: "Berechnen",
            quick_roi_estimated_roi: "Geschätzter ROI",
            quick_roi_estimated_profit: "Monatlicher Gewinn",
            
            // Features
            features_title: "Alles, was Sie zur Analyse von Geschäften benötigen",
            features_subtitle: "Von Investoren für Investoren entwickelt. Kein Schnickschnack, nur umsetzbare Erkenntnisse.",
            feature1_title: "Lang- und Kurzzeitvermietung",
            feature1_desc: "Modellieren Sie klassische Mietimmobilien oder Airbnb-Objekte mit präzisen Cashflow-Prognosen.",
            feature2_title: "Gewerbe- und Entwicklungsprojekte",
            feature2_desc: "Erweiterte Rechner für Büros, Einzelhandel und komplette Entwicklungsprojekte.",
            feature3_title: "Unterstützung mehrerer Länder",
            feature3_desc: "Vorkonfigurierte Steuern, Abschreibungen und rechtliche Rahmenbedingungen für Slowakei, Tschechien, Polen und Ungarn.",
            
            // Why
            why_title: "Warum Estivo?",
            why_subtitle: "Weil generische Tabellenkalkulationen nicht mehr ausreichen.",
            why1_title: "Investororientiertes Design",
            why1_desc: "Wir konzentrieren uns auf Kennzahlen, die wirklich zählen: ROI, IRR, NPV, Cap Rate, Cash-on-Cash und Amortisationszeit.",
            why2_title: "Länderspezifische Intelligenz",
            why2_desc: "Steuersätze, Abschreibungsregeln und gesetzliche Hinweise auf Ihren Markt zugeschnitten.",
            why3_title: "Projekte speichern und vergleichen",
            why3_desc: "Erstellen Sie ein Portfolio, vergleichen Sie Möglichkeiten nebeneinander und verfolgen Sie die Leistung im Laufe der Zeit.",
            
            // Pricing
            pricing_title: "Einfache, transparente Preisgestaltung",
            pricing_subtitle: "Starten Sie kostenlos, upgraden Sie, wenn Sie bereit sind zu skalieren.",
            
            // CTA
            cta_title: "Bereit, Ihr nächstes Geschäft zu finden?",
            cta_subtitle: "Schließen Sie sich Hunderten von Investoren an, die datenbasiert klügere Entscheidungen treffen.",
            cta_button: "Kostenlos mit der Analyse beginnen",
            
            // Testimonials
            testimonials_title: "Was Investoren sagen",
            
            // FAQ
            faq_title: "Häufig gestellte Fragen",
            faq_subtitle: "Alles, was Sie über Estivo wissen müssen.",
            
            // Footer
            footer_product: "Produkt",
            footer_resources: "Ressourcen",
            footer_legal: "Rechtliches",
            footer_company: "Unternehmen",
            footer_contact: "Kontakt",
            footer_terms: "Nutzungsbedingungen",
            footer_privacy: "Datenschutzerklärung",
            all_rights_reserved: "Alle Rechte vorbehalten.",
        }
    };

    return translations[language] || translations.en;
};