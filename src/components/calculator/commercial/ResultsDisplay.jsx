
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card'; // Added Card and CardContent
import { FileText, CheckCircle } from 'lucide-react'; // Added icons
import { currencyFormatter, percentFormatter } from '../../lib/formatters';
import ResultsHeader from '../ResultsHeader';
import KPICard from '../shared/KPICard';
import CashFlowTable from '../shared/CashFlowTable';
import CashFlowChart from '../shared/CashFlowChart';
import EquityBuildupChart from '../shared/EquityBuildupChart';
import ExpenseBreakdownChart from '../shared/ExpenseBreakdownChart';
import ROIProgressionChart from '../shared/ROIProgressionChart';

export default function CommercialResults({ results, currency = '€', language = 'en', holdingPeriod = 10 }) {
    if (!results || !results.kpis) return null;
    
    // Destructured results object
    const { kpis, cashFlowProjection, expense_breakdown, equityBuildup } = results;
    const currencySymbol = currency === 'EUR' ? '€' : currency;

    const translations = {
        en: {
            commercial_results: "Commercial Property Analysis Results", // Added for ResultsHeader
            overview: "Overview",
            details: "Details",
            projections: "10-Year Projections",
            // KPIs
            total_investment: "Total Investment",
            total_investment_desc: "Purchase price + all initial costs",
            total_investment_tooltip: "Total capital required including purchase price and acquisition costs",
            
            roi: "10-Year ROI",
            roi_desc: "Total return after 10 years",
            roi_tooltip: "Return on Investment after 10 years including appreciation and cash flow",
            roi_warning: "Below market average - consider improving terms",
            
            cash_on_cash: "Cash-on-Cash Return",
            cash_on_cash_desc: "Annual return on equity",
            cash_on_cash_tooltip: "Annual cash flow divided by total equity invested",
            cash_on_cash_warning: "Low annual return - verify income and expenses",
            
            cap_rate: "Cap Rate",
            cap_rate_desc: "Net income / Purchase price",
            cap_rate_tooltip: "Net Operating Income divided by purchase price - key metric for commercial properties",
            cap_rate_warning: "Below typical market cap rate for this property type",
            
            npv: "Net Present Value",
            npv_desc: "Discounted future cash flows",
            npv_tooltip: "Present value of all future cash flows minus initial investment",
            npv_warning: "Negative NPV - investment may not meet your required return",
            
            irr: "Internal Rate of Return",
            irr_desc: "Average annual return",
            irr_tooltip: "Average annual return over the holding period - accounts for timing of cash flows",
            irr_warning: "Below typical market IRR",
            
            dscr: "Debt Service Coverage",
            dscr_desc: "NOI / Annual debt payment",
            dscr_tooltip: "Net Operating Income divided by annual debt service - lenders typically require 1.25+",
            dscr_warning: "Below 1.25 - may have difficulty securing financing",
            
            annual_cash_flow: "Annual Cash Flow",
            annual_cash_flow_desc: "Net operating income after debt service",
            annual_cash_flow_tooltip: "Annual cash remaining after all expenses and debt payments",
            
            noi: "Net Operating Income",
            noi_desc: "Annual income minus operating expenses & CapEx",
            noi_tooltip: "Total income minus operating expenses and capital expenditures",
            
            pgi: "Potential Gross Income",
            pgi_desc: "Total income before vacancy",
            pgi_tooltip: "Maximum possible annual income if 100% occupied",
            
            egi: "Effective Gross Income",
            egi_desc: "Income after vacancy loss",
            egi_tooltip: "Actual income after accounting for vacancy rate",

            // VAT Analysis Section (NEW!)
            vat_analysis: "VAT Analysis",
            vat_status: "VAT Status",
            vat_payer_status: "VAT Payer",
            non_vat_payer_status: "Not VAT Payer",
            vat_rate_label: "VAT Rate",
            vat_on_purchase: "VAT on Purchase",
            vat_on_purchase_desc: "VAT amount on property purchase price",
            vat_on_acquisition: "VAT on Acquisition Costs",
            vat_on_acquisition_desc: "VAT amount on acquisition costs",
            total_vat_deductible: "Total VAT Deductible",
            total_vat_deductible_desc: "Total input VAT that can be deducted",
            gross_investment: "Gross Investment",
            gross_investment_desc: "Total investment including VAT",
            net_investment: "Net Investment (After VAT)",
            net_investment_desc: "Actual investment after VAT deduction",
            vat_benefit: "VAT Benefit",
            vat_benefit_desc: "Cash flow benefit from VAT deduction",
        },
        sk: {
            commercial_results: "Výsledky analýzy komerčnej nehnuteľnosti", // Added for ResultsHeader
            overview: "Prehľad",
            details: "Detaily",
            projections: "10-ročné projekcie",
            // KPIs
            total_investment: "Celková investícia",
            total_investment_desc: "Kúpna cena + všetky počiatočné náklady",
            total_investment_tooltip: "Celkový požadovaný kapitál vrátane kúpnej ceny a transakčných nákladov",
            
            roi: "10-ročné ROI",
            roi_desc: "Celková návratnosť po 10 rokoch",
            roi_tooltip: "Návratnosť investície po 10 rokoch vrátane zhodnotenia a cash flow",
            roi_warning: "Pod priemerom trhu - zvážte zlepšenie podmienok",
            
            cash_on_cash: "Cash-on-Cash návratnosť",
            cash_on_cash_desc: "Ročná návratnosť vlastného kapitálu",
            cash_on_cash_tooltip: "Ročný cash flow delený celkovým investovaným kapitálom",
            cash_on_cash_warning: "Nízka ročná návratnosť - overte príjmy a náklady",
            
            cap_rate: "Cap Rate",
            cap_rate_desc: "Čistý príjem / Kúpna cena",
            cap_rate_tooltip: "Čistý prevádzkový príjem delený kúpnou cenou - kľúčová metrika pre komerčné nehnuteľnosti",
            cap_rate_warning: "Pod typickým trhovým cap rate pre tento typ nehnuteľnosti",
            
            npv: "Čistá súčasná hodnota",
            npv_desc: "Diskontované budúce cash flow",
            npv_tooltip: "Súčasná hodnota všetkých budúcich cash flow mínus počiatočná investícia",
            npv_warning: "Negatívne NPV - investícia nemusí dosahovať požadovanú návratnosť",
            
            irr: "Vnútorná miera návratnosti",
            irr_desc: "Priemerná ročná návratnosť",
            irr_tooltip: "Priemerná ročná návratnosť počas držby - zohľadňuje načasovanie cash flow",
            irr_warning: "Pod typickým trhovým IRR",
            
            dscr: "Pokrytie dlhovej služby",
            dscr_desc: "NOI / Ročná splátka dlhu",
            dscr_tooltip: "Čistý prevádzkový príjem delený ročnou splátkou - poskytovatelia úverov vyžadujú typicky 1.25+",
            dscr_warning: "Pod 1.25 - môžete mať problémy so získaním financovania",
            
            annual_cash_flow: "Ročný Cash Flow",
            annual_cash_flow_desc: "Čistý prevádzkový príjem po splátkach úveru",
            annual_cash_flow_tooltip: "Ročné peniaze zostávajúce po všetkých nákladoch a splátkach",
            
            noi: "Čistý prevádzkový príjem",
            noi_desc: "Ročný príjem mínus prevádzkové náklady a CapEx",
            noi_tooltip: "Celkový príjem mínus prevádzkové náklady a kapitálové výdavky",
            
            pgi: "Potenciálny hrubý príjem",
            pgi_desc: "Celkový príjem pred neobsadenosťou",
            pgi_tooltip: "Maximálny možný ročný príjem pri 100% obsadenosti",
            
            egi: "Efektívny hrubý príjem",
            egi_desc: "Príjem po odpočítaní neobsadenosti",
            egi_tooltip: "Skutočný príjem po zohľadnení miery neobsadenosti",

            // VAT Analysis Section (NEW!)
            vat_analysis: "Analýza DPH",
            vat_status: "DPH Status",
            vat_payer_status: "Platca DPH",
            non_vat_payer_status: "Nie platca DPH",
            vat_rate_label: "Sadzba DPH",
            vat_on_purchase: "DPH z kúpnej ceny",
            vat_on_purchase_desc: "Výška DPH z kúpnej ceny nehnuteľnosti",
            vat_on_acquisition: "DPH z transakčných nákladov",
            vat_on_acquisition_desc: "Výška DPH z transakčných nákladov",
            total_vat_deductible: "Celková odpočítateľná DPH",
            total_vat_deductible_desc: "Celková vstupná DPH, ktorú je možné odpočítať",
            gross_investment: "Hrubá investícia",
            gross_investment_desc: "Celková investícia vrátane DPH",
            net_investment: "Čistá investícia (po DPH)",
            net_investment_desc: "Skutočná investícia po odpočítaní DPH",
            vat_benefit: "Benefit z DPH",
            vat_benefit_desc: "Cash flow benefit z odpočtu DPH",
        },
        pl: {
            commercial_results: "Wyniki analizy nieruchomości komercyjnej", // Added for ResultsHeader
            overview: "Przegląd",
            details: "Szczegóły",
            projections: "Projekcje 10-letnie",
            // KPIs
            total_investment: "Całkowita inwestycja",
            total_investment_desc: "Cena zakupu + wszystkie koszty początkowe",
            total_investment_tooltip: "Całkowity kapitał wymagany, wliczając cenę zakupu i koszty nabycia",
            
            roi: "10-letni ROI",
            roi_desc: "Całkowity zwrot po 10 latach",
            roi_tooltip: "Zwrot z inwestycji po 10 latach, wliczając wzrost wartości i przepływ gotówki",
            roi_warning: "Poniżej średniej rynkowej - rozważ poprawę warunków",
            
            cash_on_cash: "Zwrot Cash-on-Cash",
            cash_on_cash_desc: "Roczny zwrot z kapitału własnego",
            cash_on_cash_tooltip: "Roczny przepływ gotówki podzielony przez całkowity zainwestowany kapitał własny",
            cash_on_cash_warning: "Niska roczna stopa zwrotu - zweryfikuj dochody i wydatki",
            
            cap_rate: "Cap Rate",
            cap_rate_desc: "Dochód netto / Cena zakupu",
            cap_rate_tooltip: "Dochód operacyjny netto podzielony przez cenę zakupu - kluczowy wskaźnik dla nieruchomości komercyjnych",
            cap_rate_warning: "Poniżej typowej rynkowej stopy kapitalizacji dla tego typu nieruchomości",
            
            npv: "Wartość bieżąca netto",
            npv_desc: "Zdyskontowane przyszłe przepływy pieniężne",
            npv_tooltip: "Wartość bieżąca wszystkich przyszłych przepływów pieniężnych minus początkowa inwestycja",
            npv_warning: "Ujemna wartość NPV - inwestycja może nie spełniać wymaganego zwrotu",
            
            irr: "Wewnętrzna stopa zwrotu",
            irr_desc: "Średni roczny zwrot",
            irr_tooltip: "Średnia roczna stopa zwrotu w okresie utrzymywania - uwzględnia timing przepływów pieniężnych",
            irr_warning: "Poniżej typowego rynkowego IRR",
            
            dscr: "Wskaźnik pokrycia zadłużenia",
            dscr_desc: "NOI / Roczna spłata długu",
            dscr_tooltip: "Dochód operacyjny netto podzielony przez roczną obsługę długu - kredytodawcy zazwyczaj wymagają 1.25+",
            dscr_warning: "Poniżej 1.25 - możesz mieć trudności z uzyskaniem finansowania",
            
            annual_cash_flow: "Roczny Cash Flow",
            annual_cash_flow_desc: "Dochód operacyjny netto po obsłudze długu",
            annual_cash_flow_tooltip: "Roczna gotówka pozostała po wszystkich wydatkach i spłatach długu",
            
            noi: "Dochód operacyjny netto",
            noi_desc: "Roczny dochód minus koszty operacyjne i CapEx",
            noi_tooltip: "Całkowity dochód minus koszty operacyjne i wydatki kapitałowe",
            
            monthly_cash_flow: "Miesięczny Cash Flow",
            monthly_cash_flow_desc: "Średni miesięczny zysk",
            
            pgi: "Potencjalny dochód brutto",
            pgi_desc: "Całkowity dochód przed pustostanami",
            pgi_tooltip: "Maksymalny możliwy roczny dochód przy 100% obłożeniu",
            
            egi: "Efektywny dochód brutto",
            egi_desc: "Dochód po stracie z pustostanów",
            egi_tooltip: "Rzeczywisty dochód po uwzględnieniu stopy pustostanów",
            of_total: "z całości",

            // VAT Analysis Section (NEW!)
            vat_analysis: "Analiza VAT",
            vat_status: "Status VAT",
            vat_payer_status: "Płatnik VAT",
            non_vat_payer_status: "Nie płatnik VAT",
            vat_rate_label: "Stawka VAT",
            vat_on_purchase: "VAT od ceny zakupu",
            vat_on_purchase_desc: "Kwota VAT od ceny zakupu nieruchomości",
            vat_on_acquisition: "VAT od kosztów nabycia",
            vat_on_acquisition_desc: "Kwota VAT od kosztów transakcji",
            total_vat_deductible: "Całkowity VAT do odliczenia",
            total_vat_deductible_desc: "Całkowity naliczony VAT możliwy do odliczenia",
            gross_investment: "Inwestycja brutto",
            gross_investment_desc: "Całkowita inwestycja z VAT",
            net_investment: "Inwestycja netto (po VAT)",
            net_investment_desc: "Rzeczywista inwestycja po odliczeniu VAT",
            vat_benefit: "Korzyść z VAT",
            vat_benefit_desc: "Korzyść cash flow z odliczenia VAT",
        },
        hu: {
            commercial_results: "Kereskedelmi ingatlan elemzési eredmények", // Added for ResultsHeader
            overview: "Áttekintés",
            details: "Részletek",
            projections: "10 éves előrejelzések",
            // KPIs
            total_investment: "Teljes befektetés",
            total_investment_desc: "Vételár + összes kezdeti költség",
            total_investment_tooltip: "Teljes tőkeigény, beleértve a vételárat és az akvizíciós költségeket",
            
            roi: "10 éves ROI",
            roi_desc: "Teljes megtérülés 10 év után",
            roi_tooltip: "Befektetés megtérülése 10 év után, beleértve az értéknövekedést és a cash flow-t",
            roi_warning: "Piaci átlag alatt - fontolja meg a feltételek javítását",
            
            cash_on_cash: "Cash-on-Cash hozam",
            cash_on_cash_desc: "Éves hozam a saját tőkéből",
            cash_on_cash_tooltip: "Éves cash flow osztva a teljes befektetett saját tőkével",
            cash_on_cash_warning: "Alacsony éves hozam - ellenőrizze a bevételeket és a kiadásokat",
            
            cap_rate: "Cap Rate",
            cap_rate_desc: "Nettó jövedelem / Vételár",
            cap_rate_tooltip: "Nettó működési jövedelem osztva a vételárral - kulcsfontosságú mutató kereskedelmi ingatlanoknál",
            cap_rate_warning: "Az ingatlantípusra jellemző piaci CAP ráta alatt",
            
            npv: "Nettó jelenérték",
            npv_desc: "Diszkontált jövőbeli cash flow-k",
            npv_tooltip: "Az összes jövőbeli cash flow jelenértéke mínusz a kezdeti befektetés",
            npv_warning: "Negatív NPV - a befektetés nem biztos, hogy eléri a kívánt hozamot",
            
            irr: "Belső megtérülési ráta",
            irr_desc: "Átlagos éves megtérülés",
            irr_tooltip: "Átlagos éves megtérülési ráta a tartási időszak alatt - figyelembe veszi a cash flow-k időzítését",
            irr_warning: "A tipikus piaci IRR alatt",
            
            dscr: "Adósságszolgálati fedezet",
            dscr_desc: "NOI / Éves hiteltörlesztés",
            dscr_tooltip: "Nettó működési jövedelem osztva az éves adósságszolgálattal - a hitelezők általában 1.25+-t követelnek meg",
            dscr_warning: "1.25 alatt - nehézségekbe ütközhet a finanszírozás biztosításával",
            
            annual_cash_flow: "Éves Cash Flow",
            annual_cash_flow_desc: "Nettó működési jövedelem hiteltörlesztés után",
            annual_cash_flow_tooltip: "Éves pénzmaradvány az összes költség és adósságtörlesztés után",
            
            noi: "Nettó működési jövedelem",
            noi_desc: "Éves bevétel mínusz működési költségek és CapEx",
            noi_tooltip: "Teljes bevétel mínusz működési költségek és tőkekiadások",
            
            monthly_cash_flow: "Havi Cash Flow",
            monthly_cash_flow_desc: "Átlagos havi profit",
            
            pgi: "Potenciális bruttó bevétel",
            pgi_desc: "Teljes bevétel üresedés előtt",
            pgi_tooltip: "Maximális lehetséges éves jövedelem 100%-os kihasználtság esetén",
            
            egi: "Effektív bruttó bevétel",
            egi_desc: "Bevétel üresedési veszteség után",
            egi_tooltip: "Tényleges jövedelem az üresedési arány figyelembevételével",
            of_total: "összesen",

            // VAT Analysis Section (NEW!)
            vat_analysis: "ÁFA elemzés",
            vat_status: "ÁFA státusz",
            vat_payer_status: "ÁFA fizető",
            non_vat_payer_status: "Nem ÁFA fizető",
            vat_rate_label: "ÁFA kulcs",
            vat_on_purchase: "ÁFA a vételárból",
            vat_on_purchase_desc: "ÁFA összege az ingatlan vételárából",
            vat_on_acquisition: "ÁFA a vásárlási költségekből",
            vat_on_acquisition_desc: "ÁFA összege a tranzakciós költségekből",
            total_vat_deductible: "Összes levonható ÁFA",
            total_vat_deductible_desc: "Teljes bemeneti ÁFA, amely levonható",
            gross_investment: "Bruttó befektetés",
            gross_investment_desc: "Teljes befektetés ÁFÁ-val",
            net_investment: "Nettó befektetés (ÁFA után)",
            net_investment_desc: "Tényleges befektetés ÁFA levonás után",
            vat_benefit: "ÁFA előny",
            vat_benefit_desc: "Cash flow előny az ÁFA levonásból",
        },
        de: {
            commercial_results: "Ergebnisse der Gewerbeimmobilienanalyse", // Added for ResultsHeader
            overview: "Übersicht",
            details: "Details",
            projections: "10-Jahres-Prognosen",
            // KPIs
            total_investment: "Gesamtinvestition",
            total_investment_desc: "Kaufpreis + alle Anfangskosten",
            total_investment_tooltip: "Benötigtes Gesamtkapital inklusive Kaufpreis und Anschaffungskosten",
            
            roi: "10-Jahres-ROI",
            roi_desc: "Gesamtrendite nach 10 Jahren",
            roi_tooltip: "Gesamtrendite nach 10 Jahren, einschließlich Wertsteigerung und Cashflow",
            roi_warning: "Unter dem Marktdurchschnitt – erwägen Sie eine Verbesserung der Bedingungen",
            
            cash_on_cash: "Cash-on-Cash Rendite",
            cash_on_cash_desc: "Jährliche Rendite auf Eigenkapital",
            cash_on_cash_tooltip: "Jährlicher Cashflow geteilt durch das gesamte investierte Eigenkapital",
            cash_on_cash_warning: "Niedrige jährliche Rendite – überprüfen Sie Einnahmen und Ausgaben",
            
            cap_rate: "Cap Rate",
            cap_rate_desc: "Nettoeinkommen / Kaufpreis",
            cap_rate_tooltip: "Nettobetriebseinkommen geteilt durch den Kaufpreis – eine Schlüsselkennzahl für Gewerbeimmobilien",
            cap_rate_warning: "Unter dem typischen Marktkapitalisierungszinssatz für diesen Immobilientyp",
            
            npv: "Nettobarwert",
            npv_desc: "Diskontierte zukünftige Cashflows",
            npv_tooltip: "Barwert aller zukünftigen Cashflows abzüglich der Anfangsinvestition",
            npv_warning: "Negativer Kapitalwert – die Investition erfüllt möglicherweise nicht Ihre gewünschte Rendite",
            
            irr: "Interner Zinsfuß",
            irr_desc: "Durchschnittliche jährliche Rendite",
            irr_tooltip: "Durchschnittliche jährliche Rendite über die Haltedauer – berücksichtigt den Zeitpunkt der Cashflows",
            irr_warning: "Unter dem typischen Marktzinsfuß (IRR)",
            
            dscr: "Schuldendienstdeckungsgrad",
            dscr_desc: "NOI / Jährliche Schuldenzahlung",
            dscr_tooltip: "Nettobetriebseinkommen geteilt durch den jährlichen Schuldendienst – Kreditgeber verlangen typischerweise 1.25+",
            dscr_warning: "Unter 1.25 – Schwierigkeiten bei der Finanzierungsbeschaffung möglich",
            
            annual_cash_flow: "Jährlicher Cash Flow",
            annual_cash_flow_desc: "Nettobetriebseinkommen nach Schuldendienst",
            annual_cash_flow_tooltip: "Jährlicher Cashflow nach allen Ausgaben und Schuldendienstzahlungen",
            
            noi: "Nettobetriebseinkommen",
            noi_desc: "Jahreseinkommen minus Betriebskosten und CapEx",
            noi_tooltip: "Gesamteinnahmen abzüglich Betriebskosten und Investitionsausgaben",
            
            monthly_cash_flow: "Monatlicher Cash Flow",
            monthly_cash_flow_desc: "Durchschnittlicher monatlicher Gewinn",
            
            pgi: "Potenzielles Bruttoeinkommen",
            pgi_desc: "Gesamteinkommen vor Leerstand",
            pgi_tooltip: "Maximales mögliches Jahreseinkommen bei 100%iger Belegung",
            
            egi: "Effektives Bruttoeinkommen",
            egi_desc: "Einkommen nach Leerstandsverlust",
            egi_tooltip: "Tatsächliches Einkommen nach Berücksichtigung des Leerstands",
            of_total: "des Gesamtbetrags",

            // VAT Analysis Section (NEW!)
            vat_analysis: "Umsatzsteueranalyse",
            vat_status: "Umsatzsteuerstatus",
            vat_payer_status: "Umsatzsteuerpflichtig",
            non_vat_payer_status: "Nicht umsatzsteuerpflichtig",
            vat_rate_label: "Umsatzsteuersatz",
            vat_on_purchase: "Umsatzsteuer auf Kaufpreis",
            vat_on_purchase_desc: "Umsatzsteuerbetrag auf Kaufpreis",
            vat_on_acquisition: "Umsatzsteuer auf Nebenkosten",
            vat_on_acquisition_desc: "Umsatzsteuerbetrag auf Erwerbsnebenkosten",
            total_vat_deductible: "Gesamt abzugsfähige Umsatzsteuer",
            total_vat_deductible_desc: "Gesamte Vorsteuer, die abgezogen werden kann",
            gross_investment: "Bruttoinvestition",
            gross_investment_desc: "Gesamtinvestition inkl. Umsatzsteuer",
            net_investment: "Nettoinvestition (nach Umsatzsteuer)",
            net_investment_desc: "Tatsächliche Investition nach Vorsteuerabzug",
            vat_benefit: "Umsatzsteuervorteil",
            vat_benefit_desc: "Cashflow-Vorteil aus Vorsteuerabzug",
        }
    };

    const t = translations[language] || translations.en;

    // Prepare data for charts
    const cashFlowChartData = (cashFlowProjection || []).map(p => ({
        year: p.year,
        cashFlow: p.net_cash_flow
    }));

    const roiProgressionData = (cashFlowProjection || []).map(p => ({
        year: p.year,
        roi: p.cumulative_roi
    }));

    // Helper function to check warnings
    const getCapRateStatus = (capRate) => {
        // Assuming capRate is already a percentage (e.g., 5 for 5%)
        if (capRate < 5) return 'warning';
        if (capRate > 8) return 'excellent';
        if (capRate > 6) return 'good';
        return 'neutral';
    };

    const getDSCRStatus = (dscr) => {
        if (dscr < 1.25) return 'warning';
        if (dscr > 2.0) return 'excellent';
        if (dscr > 1.5) return 'good';
        return 'neutral';
    };

    const getROIStatus = (roi) => {
        // Assuming roi is already a percentage (e.g., 50 for 50%)
        if (roi < 50) return 'warning';
        if (roi > 150) return 'excellent';
        if (roi > 100) return 'good';
        return 'neutral';
    };

    const getCashOnCashStatus = (coc) => {
        // Assuming coc is already a percentage (e.g., 5 for 5%)
        if (coc < 5) return 'warning';
        if (coc > 12) return 'excellent';
        if (coc > 8) return 'good';
        return 'neutral';
    };

    return (
        <Card className="bg-card">
            <ResultsHeader 
                title={t.commercial_results} // Changed to use title prop
            />
            <CardContent className="p-3 sm:p-6">
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-6"> {/* Added mb-6 */}
                        <TabsTrigger value="overview">{t.overview}</TabsTrigger>
                        <TabsTrigger value="details">{t.details}</TabsTrigger>
                        <TabsTrigger value="projections">{t.projections}</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-4 sm:space-y-6">
                        {/* VAT Analysis Section - ONLY if VAT payer */}
                        {kpis.is_vat_payer && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    {t.vat_analysis}
                                </h3>
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                    <div className="flex items-center gap-2 mb-3">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span className="font-semibold text-green-800">{t.vat_payer_status}</span>
                                        <span className="text-sm text-gray-600">({t.vat_rate_label}: {percentFormatter(kpis.vat_rate)})</span> {/* Changed kpis.vat_rate to percentFormatter */}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <KPICard
                                            title={t.gross_investment}
                                            value={currencyFormatter(kpis.total_investment_gross, currency, currencySymbol, 0)}
                                            description={t.gross_investment_desc}
                                        />
                                        <KPICard
                                            title={t.total_vat_deductible}
                                            value={currencyFormatter(kpis.total_vat_deductible, currency, currencySymbol, 0)}
                                            description={t.total_vat_deductible_desc}
                                            status="excellent"
                                        />
                                        <KPICard
                                            title={t.net_investment}
                                            value={currencyFormatter(kpis.net_investment_after_vat, currency, currencySymbol, 0)}
                                            description={t.net_investment_desc}
                                            status="good"
                                        />
                                        <KPICard
                                            title={t.vat_benefit}
                                            value={`-${currencyFormatter(kpis.total_vat_deductible, currency, currencySymbol, 0)}`}
                                            description={t.vat_benefit_desc}
                                            status="excellent"
                                        />
                                    </div>
                                    <div className="mt-4 p-3 bg-white rounded border border-blue-100">
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">{t.vat_on_purchase}:</span>
                                                <span className="font-medium">{currencyFormatter(kpis.vat_on_purchase, currency, currencySymbol, 0)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">{t.vat_on_acquisition}:</span>
                                                <span className="font-medium">{currencyFormatter(kpis.vat_on_acquisition, currency, currencySymbol, 0)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Investment Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <KPICard
                                title={t.total_investment}
                                value={currencyFormatter(kpis.total_investment, currency, currencySymbol, 0)}
                                description={t.total_investment_desc}
                                tooltip={t.total_investment_tooltip}
                            />
                            <KPICard
                                title={t.roi}
                                value={percentFormatter(kpis.roi_10_year, 1)}
                                description={t.roi_desc}
                                tooltip={t.roi_tooltip}
                                warning={getROIStatus(kpis.roi_10_year) === 'warning' ? t.roi_warning : null}
                                excellent={getROIStatus(kpis.roi_10_year) === 'excellent'}
                                good={getROIStatus(kpis.roi_10_year) === 'good'}
                            />
                            <KPICard
                                title={t.cash_on_cash}
                                value={percentFormatter(kpis.cash_on_cash_return, 2)}
                                description={t.cash_on_cash_desc}
                                tooltip={t.cash_on_cash_tooltip}
                                warning={getCashOnCashStatus(kpis.cash_on_cash_return) === 'warning' ? t.cash_on_cash_warning : null}
                                excellent={getCashOnCashStatus(kpis.cash_on_cash_return) === 'excellent'}
                                good={getCashOnCashStatus(kpis.cash_on_cash_return) === 'good'}
                            />
                            <KPICard
                                title={t.cap_rate}
                                value={percentFormatter(kpis.cap_rate, 2)}
                                description={t.cap_rate_desc}
                                tooltip={t.cap_rate_tooltip}
                                warning={getCapRateStatus(kpis.cap_rate) === 'warning' ? t.cap_rate_warning : null}
                                excellent={getCapRateStatus(kpis.cap_rate) === 'excellent'}
                                good={getCapRateStatus(kpis.cap_rate) === 'good'}
                            />
                            <KPICard
                                title={t.npv}
                                value={currencyFormatter(kpis.npv, currency, currencySymbol, 0)}
                                description={t.npv_desc}
                                tooltip={t.npv_tooltip}
                                warning={kpis.npv < 0 ? t.npv_warning : null}
                                excellent={kpis.npv > (kpis.total_equity * 0.5)} // Arbitrary threshold for excellent NPV
                                good={kpis.npv > 0}
                            />
                            <KPICard
                                title={t.irr}
                                value={percentFormatter(kpis.irr, 2)}
                                description={t.irr_desc}
                                tooltip={t.irr_tooltip}
                                warning={kpis.irr < 8 ? t.irr_warning : null} // Assuming 8% is a low IRR for commercial real estate
                                excellent={kpis.irr > 15} // Assuming 15% is excellent
                                good={kpis.irr > 10} // Assuming 10% is good
                            />
                            <KPICard
                                title={t.dscr}
                                value={kpis.dscr ? kpis.dscr.toFixed(2) : 'N/A'}
                                description={t.dscr_desc}
                                tooltip={t.dscr_tooltip}
                                warning={getDSCRStatus(kpis.dscr) === 'warning' ? t.dscr_warning : null}
                                excellent={getDSCRStatus(kpis.dscr) === 'excellent'}
                                good={getDSCRStatus(kpis.dscr) === 'good'}
                            />
                            <KPICard
                                title={t.annual_cash_flow}
                                value={currencyFormatter(kpis.annual_cash_flow, currency, currencySymbol, 0)}
                                description={t.annual_cash_flow_desc}
                                tooltip={t.annual_cash_flow_tooltip}
                                excellent={kpis.annual_cash_flow > (kpis.total_equity * 0.1)} // Arbitrary: 10% cash flow on equity
                                good={kpis.annual_cash_flow > 0}
                            />
                            <KPICard
                                title={t.noi}
                                value={currencyFormatter(kpis.net_operating_income, currency, currencySymbol, 0)}
                                description={t.noi_desc}
                                tooltip={t.noi_tooltip}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <KPICard
                                title={t.pgi}
                                value={currencyFormatter(kpis.potential_gross_income, currency, currencySymbol, 0)}
                                description={t.pgi_desc}
                                tooltip={t.pgi_tooltip}
                            />
                            <KPICard
                                title={t.egi}
                                value={currencyFormatter(kpis.effective_gross_income, currency, currencySymbol, 0)}
                                description={t.egi_desc}
                                tooltip={t.egi_tooltip}
                            />
                        </div>
                    </TabsContent>

                    {/* Details Tab */}
                    <TabsContent value="details" className="space-y-6 mt-6">
                        <ExpenseBreakdownChart 
                            expenses={expense_breakdown || []} 
                            currency={currency} 
                            language={language} 
                        />
                    </TabsContent>

                    {/* Projections Tab */}
                    <TabsContent value="projections" className="space-y-6 mt-6">
                        <CashFlowChart 
                            data={cashFlowChartData} 
                            currency={currency} 
                            language={language} 
                        />
                        <ROIProgressionChart 
                            data={roiProgressionData} 
                            language={language} 
                        />
                        <EquityBuildupChart 
                            projections={equityBuildup || []} 
                            currency={currency} 
                            language={language} 
                        />
                        <CashFlowTable 
                            data={cashFlowProjection || []} 
                            currency={currency} 
                            currencySymbol={currencySymbol}
                            language={language}
                        />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
