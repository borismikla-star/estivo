import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, CheckCircle } from 'lucide-react';
import { currencyFormatter, percentFormatter } from '../../lib/formatters';
import ResultsHeader from '../ResultsHeader';
import KPICard from '../shared/KPICard';
import CashFlowTable from '../shared/CashFlowTable';
import CashFlowChart from '../shared/CashFlowChart';
import EquityBuildupChart from '../shared/EquityBuildupChart';
import ExpenseBreakdownChart from '../shared/ExpenseBreakdownChart';
import ROIProgressionChart from '../shared/ROIProgressionChart';

export default function LongTermLeaseResults({ results, currency = '€', language = 'en', holdingPeriod = 10 }) {
    if (!results || !results.kpis) return null;
    
    const { kpis, cashFlowProjection, expense_breakdown, equityBuildup } = results;
    const currencySymbol = currency === 'EUR' ? '€' : currency;

    const translations = {
        en: {
            long_term_lease_results: "Long-Term Lease Analysis Results",
            key_metrics: "Key Financial Metrics",
            overview: "Overview",
            details: "Details",
            projections: "10-Year Projections",
            per_month: "/mo",
            per_year: "/year",
            
            taxAnalysis: "Tax Analysis",
            taxStatus: "Tax Status",
            entityTypeFO: "Individual (FO)",
            entityTypePO: "Legal Entity (PO)",
            effectiveTaxRate: "Effective Tax Rate",
            taxableIncome: "Taxable Income",
            taxableIncomeDesc: "Income subject to taxation after deductions",
            taxableIncomeTooltip: "NOI minus interest expense minus depreciation",
            annualIncomeTax: "Annual Income Tax",
            annualIncomeTaxDesc: "Tax liability on rental income",
            annualIncomeTaxTooltip: "Taxable income multiplied by effective tax rate",
            depreciation: "Annual Depreciation",
            depreciationDesc: "Building depreciation (tax deductible)",
            depreciationTooltip: "Annual building depreciation that reduces taxable income",
            interestDeduction: "Interest Deduction",
            interestDeductionDesc: "Mortgage interest (tax deductible)",
            interestDeductionTooltip: "Annual mortgage interest that reduces taxable income",
            taxBenefits: "Tax Benefits",
            taxBenefitFromInterest: "Benefit from Interest",
            taxBenefitFromDepreciation: "Benefit from Depreciation",
            totalTaxBenefit: "Total Tax Benefits",
            totalTaxBenefitDesc: "Total tax savings from deductions",
            beforeTax: "Before Tax",
            afterTax: "After Tax",
            cashFlowComparison: "Cash Flow Comparison",
            
            totalInvestment: "Total Investment",
            totalInvestmentDesc: "Purchase price + all initial costs",
            totalInvestmentTooltip: "Total capital required including purchase price and all initial costs",
            
            roi: "10-Year ROI",
            roiDesc: "Total return after 10 years (before tax)",
            roiTooltip: "Total return on investment after 10 years including property appreciation and cumulative cash flow",
            roiWarning: "Below market average - consider improving terms",
            
            roiAfterTax: "10-Year ROI (After Tax)",
            roiAfterTaxDesc: "Total return after taxes",
            roiAfterTaxTooltip: "Total return on investment after 10 years including tax impact",
            
            cashOnCash: "Cash-on-Cash Return",
            cashOnCashDesc: "Annual return on equity (before tax)",
            cashOnCashTooltip: "Annual cash flow divided by total equity invested - measures year 1 cash return",
            cashOnCashWarning: "Low annual return - verify income and expenses",
            
            cashOnCashAfterTax: "Cash-on-Cash (After Tax)",
            cashOnCashAfterTaxDesc: "Annual return on equity after taxes",
            cashOnCashAfterTaxTooltip: "Annual cash flow after tax divided by total equity invested",
            
            capRate: "Cap Rate",
            capRateDesc: "Net income / Purchase price",
            capRateTooltip: "Net Operating Income divided by purchase price - key profitability metric",
            capRateWarning: "Below typical market cap rate",
            
            irr: "Internal Rate of Return",
            irrDesc: "Average annual return (before tax)",
            irrTooltip: "Average annual return over the holding period - accounts for timing of cash flows",
            irrWarning: "Below typical market IRR",
            
            irrAfterTax: "IRR (After Tax)",
            irrAfterTaxDesc: "Average annual return after taxes",
            irrAfterTaxTooltip: "Average annual return over the holding period including tax impact",
            
            dscr: "Debt Service Coverage",
            dscrDesc: "NOI / Annual debt payment",
            dscrTooltip: "Net Operating Income divided by annual debt service - lenders typically require 1.25+",
            dscrWarning: "Below 1.25 - may have difficulty securing financing",
            
            annualCashFlow: "Annual Cash Flow",
            annualCashFlowDesc: "Net cash flow (before tax)",
            annualCashFlowTooltip: "Annual cash remaining after all expenses and debt payments",
            
            monthlyCashFlow: "Monthly Cash Flow",
            monthlyCashFlowDesc: "Average monthly profit (before tax)",
            monthlyCashFlowTooltip: "Monthly cash flow before tax",
            
            grossYield: "Gross Rental Yield",
            grossYieldDesc: "Annual rent / Purchase price",
            grossYieldTooltip: "Annual rental income as percentage of purchase price",
            
            netYield: "Net Rental Yield",
            netYieldDesc: "NOI / Purchase price",
            netYieldTooltip: "Net Operating Income as percentage of purchase price",
            
            payback: "Payback Period",
            paybackDesc: "Time to recover initial investment",
            paybackTooltip: "Years needed to recover total equity from cumulative cash flows",
            
            noi: "Net Operating Income",
            noiDesc: "Annual income minus operating expenses",
            noiTooltip: "Annual rental income minus all operating expenses (before debt service)",
        },
        sk: {
            long_term_lease_results: "Výsledky analýzy dlhodobého prenájmu",
            key_metrics: "Kľúčové finančné ukazovatele",
            overview: "Prehľad",
            details: "Detaily",
            projections: "10-ročné projekcie",
            per_month: "/mes",
            per_year: "/rok",
            
            taxAnalysis: "Daňová analýza",
            taxStatus: "Daňový status",
            entityTypeFO: "Fyzická osoba (FO)",
            entityTypePO: "Právnická osoba (PO)",
            effectiveTaxRate: "Efektívna daňová sadzba",
            taxableIncome: "Zdaniteľný príjem",
            taxableIncomeDesc: "Príjem podliehajúci zdaneniu po odpočtoch",
            taxableIncomeTooltip: "NOI mínus úrokové náklady mínus odpisy",
            annualIncomeTax: "Ročná daň z príjmu",
            annualIncomeTaxDesc: "Daňová povinnosť z príjmov z prenájmu",
            annualIncomeTaxTooltip: "Zdaniteľný príjem vynásobený efektívnou daňovou sadzbou",
            depreciation: "Ročné odpisy",
            depreciationDesc: "Odpisy budovy (daňovo odpočítateľné)",
            depreciationTooltip: "Ročné odpisy budovy, ktoré znižujú zdaniteľný príjem",
            interestDeduction: "Odpočet úrokov",
            interestDeductionDesc: "Úroky z hypotéky (daňovo odpočítateľné)",
            interestDeductionTooltip: "Ročné úroky z hypotéky, ktoré znižujú zdaniteľný príjem",
            taxBenefits: "Daňové benefity",
            taxBenefitFromInterest: "Benefit z úrokov",
            taxBenefitFromDepreciation: "Benefit z odpisov",
            totalTaxBenefit: "Celkové daňové benefity",
            totalTaxBenefitDesc: "Celkové daňové úspory z odpočtov",
            beforeTax: "Pred zdanením",
            afterTax: "Po zdanení",
            cashFlowComparison: "Porovnanie Cash Flow",
            
            totalInvestment: "Celková investícia",
            totalInvestmentDesc: "Kúpna cena + všetky počiatočné náklady",
            totalInvestmentTooltip: "Celkový požadovaný kapitál vrátane kúpnej ceny a všetkých počiatočných nákladov",
            
            roi: "10-ročné ROI",
            roiDesc: "Celková návratnosť po 10 rokoch (pred zdanením)",
            roiTooltip: "Celková návratnosť investície po 10 rokoch vrátane zhodnotenia nehnuteľnosti a kumulatívneho cash flow",
            roiWarning: "Pod priemerom trhu - zvážte zlepšenie podmienok",
            
            roiAfterTax: "10-ročné ROI (Po zdanení)",
            roiAfterTaxDesc: "Celková návratnosť po zdanení",
            roiAfterTaxTooltip: "Celková návratnosť investície po 10 rokoch vrátane vplyvu daní",
            
            cashOnCash: "Cash-on-Cash návratnosť",
            cashOnCashDesc: "Ročná návratnosť vlastného kapitálu (pred zdanením)",
            cashOnCashTooltip: "Ročný cash flow delený celkovým investovaným kapitálom - meria ročný peňažný výnos",
            cashOnCashWarning: "Nízka ročná návratnosť - overte príjmy a náklady",
            
            cashOnCashAfterTax: "Cash-on-Cash (Po zdanení)",
            cashOnCashAfterTaxDesc: "Ročná návratnosť vlastného kapitálu po zdanení",
            cashOnCashAfterTaxTooltip: "Ročný cash flow po zdanení delený celkovým investovaným kapitálom",
            
            capRate: "Cap Rate",
            capRateDesc: "Čistý príjem / Kúpna cena",
            capRateTooltip: "Čistý prevádzkový príjem delený kúpnou cenou - kľúčová metrika ziskovosti",
            capRateWarning: "Pod typickým trhovým cap rate",
            
            irr: "Vnútorná miera návratnosti",
            irrDesc: "Priemerná ročná návratnosť (pred zdanením)",
            irrTooltip: "Priemerná ročná návratnosť počas doby držby - zohľadňuje načasovanie cash flow",
            irrWarning: "Pod typickým trhovým IRR",
            
            irrAfterTax: "IRR (Po zdanení)",
            irrAfterTaxDesc: "Priemerná ročná návratnosť po zdanení",
            irrAfterTaxTooltip: "Priemerná ročná návratnosť počas doby držby vrátane vplyvu daní",
            
            dscr: "Pokrytie dlhovej služby",
            dscrDesc: "NOI / Ročná splátka dlhu",
            dscrTooltip: "Čistý prevádzkový príjem delený ročnou splátkou - poskytovatelia úverov vyžadujú typicky 1.25+",
            dscrWarning: "Pod 1.25 - môžete mať problémy so získaním financovania",
            
            annualCashFlow: "Ročný Cash Flow",
            annualCashFlowDesc: "Čistý cash flow (pred zdanením)",
            annualCashFlowTooltip: "Ročné peniaze zostávajúce po všetkých nákladoch a splátkach",
            
            monthlyCashFlow: "Mesačný Cash Flow",
            monthlyCashFlowDesc: "Priemerný mesačný zisk (pred zdanením)",
            monthlyCashFlowTooltip: "Mesačný cash flow pred zdanením",
            
            grossYield: "Hrubý výnos z prenájmu",
            grossYieldDesc: "Ročný nájom / Kúpna cena",
            grossYieldTooltip: "Ročný príjem z nájmu ako percento z kúpnej ceny",
            
            netYield: "Čistý výnos z prenájmu",
            netYieldDesc: "NOI / Kúpna cena",
            netYieldTooltip: "Čistý prevádzkový príjem ako percento z kúpnej ceny",
            
            payback: "Doba návratnosti",
            paybackDesc: "Čas na vrátenie počiatočnej investície",
            paybackTooltip: "Počet rokov potrebných na vrátenie celkového kapitálu z kumulatívnych cash flow",
            
            noi: "Čistý prevádzkový príjem",
            noiDesc: "Ročný príjem mínus prevádzkové náklady",
            noiTooltip: "Ročný príjem z nájmu mínus všetky prevádzkové náklady (pred splácaním dlhu)",
        },
        pl: {
            long_term_lease_results: "Wyniki analizy najmu długoterminowego",
            key_metrics: "Kluczowe wskaźniki finansowe",
            overview: "Przegląd",
            details: "Szczegóły",
            projections: "Projekcje 10-letnie",
            per_month: "/mies",
            per_year: "/rok",
            
            taxAnalysis: "Analiza podatkowa",
            taxStatus: "Status podatkowy",
            entityTypeFO: "Osoba fizyczna (FO)",
            entityTypePO: "Osoba prawna (PO)",
            effectiveTaxRate: "Efektywna stopa podatkowa",
            taxableIncome: "Dochód podlegający opodatkowaniu",
            taxableIncomeDesc: "Dochód podlegający opodatkowaniu po odliczeniach",
            taxableIncomeTooltip: "NOI minus koszty odsetek minus amortyzacja",
            annualIncomeTax: "Roczny podatek dochodowy",
            annualIncomeTaxDesc: "Zobowiązanie podatkowe od dochodów z najmu",
            annualIncomeTaxTooltip: "Dochód podlegający opodatkowaniu pomnożony przez efektywną stopę podatkową",
            depreciation: "Roczna amortyzacja",
            depreciationDesc: "Amortyzacja budynku (odliczalna od podatku)",
            depreciationTooltip: "Roczna amortyzacja budynku zmniejszająca dochód podlegający opodatkowaniu",
            interestDeduction: "Odliczenie odsetek",
            interestDeductionDesc: "Odsetki od kredytu hipotecznego (odliczalne od podatku)",
            interestDeductionTooltip: "Roczne odsetki od kredytu hipotecznego zmniejszające dochód podlegający opodatkowaniu",
            taxBenefits: "Korzyści podatkowe",
            taxBenefitFromInterest: "Korzyść z odsetek",
            taxBenefitFromDepreciation: "Korzyść z amortyzacji",
            totalTaxBenefit: "Całkowite korzyści podatkowe",
            totalTaxBenefitDesc: "Całkowite oszczędności podatkowe z odliczeń",
            beforeTax: "Przed opodatkowaniem",
            afterTax: "Po opodatkowaniu",
            cashFlowComparison: "Porównanie przepływów pieniężnych",
            
            totalInvestment: "Całkowita inwestycja",
            totalInvestmentDesc: "Cena zakupu + wszystkie koszty początkowe",
            totalInvestmentTooltip: "Całkowity kapitał wymagany, wliczając cenę zakupu i wszystkie koszty początkowe",
            
            roi: "10-letni ROI",
            roiDesc: "Całkowity zwrot po 10 latach (przed opodatkowaniem)",
            roiTooltip: "Całkowity zwrot z inwestycji po 10 latach, wliczając wzrost wartości i skumulowane przepływy pieniężne",
            roiWarning: "Poniżej średniej rynkowej - rozważ poprawę warunków",
            
            roiAfterTax: "10-letni ROI (Po opodatkowaniu)",
            roiAfterTaxDesc: "Całkowity zwrot po opodatkowaniu",
            roiAfterTaxTooltip: "Całkowity zwrot z inwestycji po 10 latach z uwzględnieniem wpływu podatków",
            
            cashOnCash: "Zwrot Cash-on-Cash",
            cashOnCashDesc: "Roczny zwrot z kapitału własnego (przed opodatkowaniem)",
            cashOnCashTooltip: "Roczny przepływ gotówki podzielony przez całkowity zainwestowany kapitał - mierzy roczny zwrot gotówkowy",
            cashOnCashWarning: "Niska roczna stopa zwrotu - zweryfikuj dochody i wydatki",
            
            cashOnCashAfterTax: "Cash-on-Cash (Po opodatkowaniu)",
            cashOnCashAfterTaxDesc: "Roczny zwrot z kapitału własnego po opodatkowaniu",
            cashOnCashAfterTaxTooltip: "Roczny przepływ gotówki po opodatkowaniu podzielony przez całkowity zainwestowany kapitał",
            
            capRate: "Cap Rate",
            capRateDesc: "Dochód netto / Cena zakupu",
            capRateTooltip: "Dochód operacyjny netto podzielony przez cenę zakupu - kluczowy wskaźnik rentowności",
            capRateWarning: "Poniżej typowej rynkowej stopy kapitalizacji",
            
            irr: "Wewnętrzna stopa zwrotu",
            irrDesc: "Średni roczny zwrot (przed opodatkowaniem)",
            irrTooltip: "Średnia roczna stopa zwrotu w okresie utrzymywania - uwzględnia timing przepływów pieniężnych",
            irrWarning: "Poniżej typowego rynkowego IRR",
            
            irrAfterTax: "IRR (Po opodatkowaniu)",
            irrAfterTaxDesc: "Średni roczny zwrot po opodatkowaniu",
            irrAfterTaxTooltip: "Średnia roczna stopa zwrotu w okresie utrzymywania z uwzględnieniem wpływu podatków",
            
            dscr: "Wskaźnik pokrycia zadłużenia",
            dscrDesc: "NOI / Roczna spłata długu",
            dscrTooltip: "Dochód operacyjny netto podzielony przez roczną obsługę długu - kredytodawcy zazwyczaj wymagają 1.25+",
            dscrWarning: "Poniżej 1.25 - możesz mieć trudności z uzyskaniem finansowania",
            
            annualCashFlow: "Roczny Cash Flow",
            annualCashFlowDesc: "Czysty cash flow (przed opodatkowaniem)",
            annualCashFlowTooltip: "Roczna gotówka pozostała po wszystkich wydatkach i spłatach długu",
            
            monthlyCashFlow: "Miesięczny Cash Flow",
            monthlyCashFlowDesc: "Średni miesięczny zysk (przed opodatkowaniem)",
            monthlyCashFlowTooltip: "Miesięczny przepływ gotówki przed opodatkowaniem",
            
            grossYield: "Rentowność brutto z najmu",
            grossYieldDesc: "Roczny czynsz / Cena zakupu",
            grossYieldTooltip: "Roczny dochód z najmu jako procent ceny zakupu",
            
            netYield: "Rentowność netto z najmu",
            netYieldDesc: "NOI / Cena zakupu",
            netYieldTooltip: "Dochód operacyjny netto jako procent ceny zakupu",
            
            payback: "Okres zwrotu",
            paybackDesc: "Czas odzyskania początkowej inwestycji",
            paybackTooltip: "Lata potrzebne do odzyskania całkowitego kapitału ze skumulowanych przepływów pieniężnych",
            
            noi: "Dochód operacyjny netto",
            noiDesc: "Roczny dochód minus koszty operacyjne",
            noiTooltip: "Roczny dochód z najmu minus wszystkie koszty operacyjne (przed obsługą długu)",
        },
        hu: {
            long_term_lease_results: "Hosszú távú bérleti elemzés eredményei",
            key_metrics: "Kulcsfontosságú pénzügyi mutatók",
            overview: "Áttekintés",
            details: "Részletek",
            projections: "10 éves előrejelzések",
            per_month: "/hó",
            per_year: "/év",
            
            taxAnalysis: "Adóelemzés",
            taxStatus: "Adó státusz",
            entityTypeFO: "Magánszemély (FO)",
            entityTypePO: "Jogi személy (PO)",
            effectiveTaxRate: "Effektív adókulcs",
            taxableIncome: "Adózás előtti jövedelem",
            taxableIncomeDesc: "Levonások után adóköteles jövedelem",
            taxableIncomeTooltip: "NOI mínusz kamatköltségek mínusz értékcsökkenés",
            annualIncomeTax: "Éves jövedelemadó",
            annualIncomeTaxDesc: "Adókötelezettség bérleti díjból származó jövedelemre",
            annualIncomeTaxTooltip: "Adóköteles jövedelem szorozva az effektív adókulccsal",
            depreciation: "Éves értékcsökkenés",
            depreciationDesc: "Épület értékcsökkenése (adóalap-csökkentő)",
            depreciationTooltip: "Éves épület értékcsökkenés, amely csökkenti az adóköteles jövedelmet",
            interestDeduction: "Kamattalap-csökkentés",
            interestDeductionDesc: "Hitelkamatok (adóalap-csökkentő)",
            interestDeductionTooltip: "Éves jelzáloghitel kamatok, amelyek csökkentik az adóköteles jövedelmet",
            taxBenefits: "Adókedvezmények",
            taxBenefitFromInterest: "Kamattalap-csökkentésből eredő előny",
            taxBenefitFromDepreciation: "Értékcsökkenésből eredő előny",
            totalTaxBenefit: "Összes adókedvezmény",
            totalTaxBenefitDesc: "Összes adómegtakarítás a levonásokból",
            beforeTax: "Adózás előtt",
            afterTax: "Adózás után",
            cashFlowComparison: "Cash Flow összehasonlítás",
            
            totalInvestment: "Teljes befektetés",
            totalInvestmentDesc: "Vételár + összes kezdeti költség",
            totalInvestmentTooltip: "Teljes tőkeigény, beleértve a vételárat és az összes kezdeti költséget",
            
            roi: "10 éves ROI",
            roiDesc: "Teljes megtérülés 10 év után (adózás előtt)",
            roiTooltip: "Teljes befektetési megtérülés 10 év után, beleértve az ingatlan értéknövekedését és a kumulált cash flow-t",
            roiWarning: "Piaci átlag alatt - fontolja meg a feltételek javítását",
            
            roiAfterTax: "10 éves ROI (Adózás után)",
            roiAfterTaxDesc: "Teljes megtérülés adózás után",
            roiAfterTaxTooltip: "Teljes befektetési megtérülés 10 év után az adók hatásával együtt",
            
            cashOnCash: "Cash-on-Cash hozam",
            cashOnCashDesc: "Éves hozam a saját tőkéből (adózás előtt)",
            cashOnCashTooltip: "Éves cash flow osztva a teljes befektetett tőkével - az éves készpénzes hozamot méri",
            cashOnCashWarning: "Alacsony éves hozam - ellenőrizze a bevételeket és a kiadásokat",
            
            cashOnCashAfterTax: "Cash-on-Cash (Adózás után)",
            cashOnCashAfterTaxDesc: "Éves hozam a saját tőkéből adózás után",
            cashOnCashAfterTaxTooltip: "Éves cash flow adózás után osztva a teljes befektetett tőkével",
            
            capRate: "Cap Rate",
            capRateDesc: "Nettó jövedelem / Vételár",
            capRateTooltip: "Nettó működési jövedelem osztva a vételárral - kulcsfontosságú jövedelmezőségi mutató",
            capRateWarning: "Tipikus piaci CAP ráta alatt",
            
            irr: "Belső megtérülési ráta",
            irrDesc: "Átlagos éves megtérülés (adózás előtt)",
            irrTooltip: "Átlagos éves megtérülési ráta a tartási időszak alatt - figyelembe veszi a cash flow-k időzítését",
            irrWarning: "Tipikus piaci IRR alatt",
            
            irrAfterTax: "IRR (Adózás után)",
            irrAfterTaxDesc: "Átlagos éves megtérülés adózás után",
            irrAfterTaxTooltip: "Átlagos éves megtérülési ráta a tartási időszak alatt az adók hatásával együtt",
            
            dscr: "Adósságszolgálati fedezet",
            dscrDesc: "NOI / Éves hiteltörlesztés",
            dscrTooltip: "Nettó működési jövedelem osztva az éves adósságszolgálattal - a hitelezők általában 1.25+-t követelnek meg",
            dscrWarning: "1.25 alatt - nehézségekbe ütközhet a finanszírozás biztosításával",
            
            annualCashFlow: "Éves Cash Flow",
            annualCashFlowDesc: "Nettó cash flow (adózás előtt)",
            annualCashFlowTooltip: "Éves pénzmaradvány az összes költség és adósságtörlesztés után",
            
            monthlyCashFlow: "Havi Cash Flow",
            monthlyCashFlowDesc: "Átlagos havi profit (adózás előtt)",
            monthlyCashFlowTooltip: "Havi cash flow adózás előtt",
            
            grossYield: "Bruttó bérleti hozam",
            grossYieldDesc: "Éves bérleti díj / Vételár",
            grossYieldTooltip: "Éves bérleti díj a vételár százalékában",
            
            netYield: "Nettó bérleti hozam",
            netYieldDesc: "NOI / Vételár",
            netYieldTooltip: "Nettó működési jövedelem a vételár százalékában",
            
            payback: "Megtérülési időszak",
            paybackDesc: "A kezdeti befektetés megtérítésének ideje",
            paybackTooltip: "A teljes tőke kumulált cash flow-kból történő megtérítéséhez szükséges évek száma",
            
            noi: "Nettó működési jövedelem",
            noiDesc: "Éves bevétel mínusz működési költségek",
            noiTooltip: "Éves bérleti díj bevétel mínusz az összes működési költség (az adósságszolgálat előtt)",
        },
        de: {
            long_term_lease_results: "Ergebnisse der Langzeitvermietungsanalyse",
            key_metrics: "Wichtige Finanzkennzahlen",
            overview: "Übersicht",
            details: "Details",
            projections: "10-Jahres-Prognosen",
            per_month: "/Mon",
            per_year: "/Jahr",
            
            taxAnalysis: "Steueranalyse",
            taxStatus: "Steuerstatus",
            entityTypeFO: "Natürliche Person (FO)",
            entityTypePO: "Juristische Person (PO)",
            effectiveTaxRate: "Effektiver Steuersatz",
            taxableIncome: "Zu versteuerndes Einkommen",
            taxableIncomeDesc: "Einkommen, das nach Abzügen der Besteuerung unterliegt",
            taxableIncomeTooltip: "NOI minus Zinsaufwand minus Abschreibung",
            annualIncomeTax: "Jährliche Einkommensteuer",
            annualIncomeTaxDesc: "Steuerpflicht auf Mieteinnahmen",
            annualIncomeTaxTooltip: "Zu versteuerndes Einkommen multipliziert mit dem effektiven Steuersatz",
            depreciation: "Jährliche Abschreibung",
            depreciationDesc: "Gebäudeabschreibung (steuerlich absetzbar)",
            depreciationTooltip: "Jährliche Gebäudeabschreibung, die das zu versteuernde Einkommen reduziert",
            interestDeduction: "Zinsabzug",
            interestDeductionDesc: "Hypothekenzinsen (steuerlich absetzbar)",
            interestDeductionTooltip: "Jährliche Hypothekenzinsen, die das zu versteuernde Einkommen reduzieren",
            taxBenefits: "Steuervorteile",
            taxBenefitFromInterest: "Vorteil aus Zinsen",
            taxBenefitFromDepreciation: "Vorteil aus Abschreibung",
            totalTaxBenefit: "Gesamte Steuervorteile",
            totalTaxBenefitDesc: "Gesamte Steuerersparnisse durch Abzüge",
            beforeTax: "Vor Steuern",
            afterTax: "Nach Steuern",
            cashFlowComparison: "Cashflow-Vergleich",
            
            totalInvestment: "Gesamtinvestition",
            totalInvestmentDesc: "Kaufpreis + alle Anfangskosten",
            totalInvestmentTooltip: "Benötigtes Gesamtkapital inklusive Kaufpreis und aller Anfangskosten",
            
            roi: "10-Jahres-ROI",
            roiDesc: "Gesamtrendite nach 10 Jahren (vor Steuern)",
            roiTooltip: "Gesamtrendite nach 10 Jahren, einschließlich Wertsteigerung und kumuliertem Cashflow",
            roiWarning: "Unter dem Marktdurchschnitt – erwägen Sie eine Verbesserung der Bedingungen",
            
            roiAfterTax: "10-Jahres-ROI (Nach Steuern)",
            roiAfterTaxDesc: "Gesamtrendite nach Steuern",
            roiAfterTaxTooltip: "Gesamtrendite nach 10 Jahren unter Berücksichtigung der Steuerwirkung",
            
            cashOnCash: "Cash-on-Cash Rendite",
            cashOnCashDesc: "Jährliche Eigenkapitalrendite (vor Steuern)",
            cashOnCashTooltip: "Jährlicher Cashflow geteilt durch das gesamte investierte Eigenkapital - misst die jährliche Barrendite",
            cashOnCashWarning: "Niedrige jährliche Rendite – überprüfen Sie Einnahmen und Ausgaben",
            
            cashOnCashAfterTax: "Cash-on-Cash (Nach Steuern)",
            cashOnCashAfterTaxDesc: "Jährliche Eigenkapitalrendite nach Steuern",
            cashOnCashAfterTaxTooltip: "Jährlicher Cashflow nach Steuern geteilt durch das gesamte investierte Eigenkapital",
            
            capRate: "Cap Rate",
            capRateDesc: "Nettoeinkommen / Kaufpreis",
            capRateTooltip: "Nettobetriebseinkommen geteilt durch den Kaufpreis - wichtige Rentabilitätskennzahl",
            capRateWarning: "Unter dem typischen Marktkapitalisierungszinssatz",
            
            irr: "Interner Zinsfuß",
            irrDesc: "Durchschnittliche jährliche Rendite (vor Steuern)",
            irrTooltip: "Durchschnittliche jährliche Rendite über die Haltedauer - berücksichtigt den Zeitpunkt der Cashflows",
            irrWarning: "Unter dem typischen Marktzinsfuß (IRR)",
            
            irrAfterTax: "IRR (Nach Steuern)",
            irrAfterTaxDesc: "Durchschnittliche jährliche Rendite nach Steuern",
            irrAfterTaxTooltip: "Durchschnittliche jährliche Rendite über die Haltedauer unter Berücksichtigung der Steuerwirkung",
            
            dscr: "Schuldendienstdeckungsgrad",
            dscrDesc: "NOI / Jährliche Schuldenzahlung",
            dscrTooltip: "Nettobetriebseinkommen geteilt durch den jährlichen Schuldendienst - Kreditgeber verlangen typischerweise 1.25+",
            dscrWarning: "Unter 1.25 – Schwierigkeiten bei der Finanzierungsbeschaffung möglich",
            
            annualCashFlow: "Jährlicher Cash Flow",
            annualCashFlowDesc: "Netto-Cashflow (vor Steuern)",
            annualCashFlowTooltip: "Jährlicher Cashflow nach allen Ausgaben und Schuldendienstzahlungen",
            
            monthlyCashFlow: "Monatlicher Cash Flow",
            monthlyCashFlowDesc: "Durchschnittlicher monatlicher Gewinn (vor Steuern)",
            monthlyCashFlowTooltip: "Monatlicher Cashflow vor Steuern",
            
            grossYield: "Bruttomietrendite",
            grossYieldDesc: "Jahresmiete / Kaufpreis",
            grossYieldTooltip: "Jährliche Mieteinnahmen als Prozentsatz des Kaufpreises",
            
            netYield: "Nettomietrendite",
            netYieldDesc: "NOI / Kaufpreis",
            netYieldTooltip: "Nettobetriebseinkommen als Prozentsatz des Kaufpreises",
            
            payback: "Amortisationszeit",
            paybackDesc: "Zeit zur Rückgewinnung der Anfangsinvestition",
            paybackTooltip: "Jahre, die benötigt werden, um das Gesamtkapital aus kumulierten Cashflows zurückzugewinnen",
            
            noi: "Nettobetriebseinkommen",
            noiDesc: "Jahreseinkommen minus Betriebskosten",
            noiTooltip: "Jährliche Mieteinnahmen minus alle Betriebskosten (vor Schuldendienst)",
        }
    };

    const t = translations[language] || translations.en;

    const cashFlowChartData = (cashFlowProjection || []).map(p => ({
        year: p.year,
        cashFlow: p.net_cash_flow
    }));

    const roiProgressionData = (cashFlowProjection || []).map(p => ({
        year: p.year,
        roi: p.cumulative_roi
    }));

    const getROIStatus = (roi) => {
        if (roi < 50) return 'warning';
        if (roi > 150) return 'excellent';
        if (roi > 100) return 'good';
        return 'neutral';
    };

    const getCashOnCashStatus = (coc) => {
        if (coc < 5) return 'warning';
        if (coc > 12) return 'excellent';
        if (coc > 8) return 'good';
        return 'neutral';
    };

    const getCapRateStatus = (capRate) => {
        if (capRate < 4) return 'warning';
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

    return (
        <Card className="bg-card">
            <ResultsHeader 
                title={t.long_term_lease_results}
            />
            <CardContent className="p-3 sm:p-6">
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                        <TabsTrigger value="overview">{t.overview}</TabsTrigger>
                        <TabsTrigger value="details">{t.details}</TabsTrigger>
                        <TabsTrigger value="projections">{t.projections}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4 sm:space-y-6">
                        {kpis.effective_tax_rate !== undefined && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    {t.taxAnalysis}
                                </h3>
                                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                    <div className="flex items-center gap-2 mb-3">
                                        <CheckCircle className="w-5 h-5 text-amber-600" />
                                        <span className="font-semibold text-amber-800">
                                            {kpis.entity_type === 'PO' ? t.entityTypePO : t.entityTypeFO}
                                        </span>
                                        <span className="text-sm text-gray-600">
                                            ({t.effectiveTaxRate}: {percentFormatter(kpis.effective_tax_rate)})
                                        </span>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <KPICard
                                            title={t.depreciation}
                                            value={currencyFormatter(kpis.annual_depreciation, currency, currencySymbol, 0)}
                                            description={t.depreciationDesc}
                                            tooltip={t.depreciationTooltip}
                                        />
                                        <KPICard
                                            title={t.interestDeduction}
                                            value={currencyFormatter(kpis.annual_interest_deduction, currency, currencySymbol, 0)}
                                            description={t.interestDeductionDesc}
                                            tooltip={t.interestDeductionTooltip}
                                        />
                                        <KPICard
                                            title={t.taxableIncome}
                                            value={currencyFormatter(kpis.taxable_income, currency, currencySymbol, 0)}
                                            description={t.taxableIncomeDesc}
                                            tooltip={t.taxableIncomeTooltip}
                                        />
                                        <KPICard
                                            title={t.annualIncomeTax}
                                            value={currencyFormatter(kpis.annual_income_tax, currency, currencySymbol, 0)}
                                            description={t.annualIncomeTaxDesc}
                                            tooltip={t.annualIncomeTaxTooltip}
                                            status="warning"
                                        />
                                    </div>
                                    
                                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200 mb-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-sm font-semibold text-orange-800">
                                                💰 {t.taxBenefits}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 mb-3">
                                            <div className="text-sm">
                                                <span className="text-gray-600">{t.taxBenefitFromInterest}:</span>
                                                <div className="font-bold text-green-600">
                                                    {currencyFormatter(kpis.tax_benefit_from_interest, currency, currencySymbol, 0)}
                                                </div>
                                            </div>
                                            <div className="text-sm">
                                                <span className="text-gray-600">{t.taxBenefitFromDepreciation}:</span>
                                                <div className="font-bold text-green-600">
                                                    {currencyFormatter(kpis.tax_benefit_from_depreciation, currency, currencySymbol, 0)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="pt-3 border-t border-orange-200 text-center">
                                            <span className="text-sm text-gray-600">{t.totalTaxBenefit}: </span>
                                            <span className="text-lg font-bold text-green-600">
                                                {currencyFormatter(kpis.total_tax_benefit, currency, currencySymbol, 0)}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-200">
                                            <div className="text-xs text-blue-600 mb-1">{t.beforeTax}</div>
                                            <div className="text-xl font-bold text-blue-900">
                                                {currencyFormatter(kpis.annual_cash_flow, currency, currencySymbol, 0)}
                                            </div>
                                            <div className="text-xs text-blue-600 mt-1">{t.annualCashFlowDesc}</div>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                                            <div className="text-xs text-green-600 mb-1">{t.afterTax}</div>
                                            <div className="text-xl font-bold text-green-900">
                                                {currencyFormatter(kpis.annual_cash_flow_after_tax, currency, currencySymbol, 0)}
                                            </div>
                                            <div className="text-xs text-green-600 mt-1">{t.annualCashFlowDesc}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <KPICard
                                title={t.totalInvestment}
                                value={currencyFormatter(kpis.total_investment, currency, currencySymbol, 0)}
                                description={t.totalInvestmentDesc}
                                tooltip={t.totalInvestmentTooltip}
                            />
                            
                            <KPICard
                                title={t.roi}
                                value={percentFormatter(kpis.roi_10_year, 1)}
                                description={t.roiDesc}
                                tooltip={t.roiTooltip}
                                warning={getROIStatus(kpis.roi_10_year) === 'warning' ? t.roiWarning : null}
                                excellent={getROIStatus(kpis.roi_10_year) === 'excellent'}
                                good={getROIStatus(kpis.roi_10_year) === 'good'}
                            />
                            {kpis.roi_10_year_after_tax !== undefined && (
                                <KPICard
                                    title={t.roiAfterTax}
                                    value={percentFormatter(kpis.roi_10_year_after_tax, 1)}
                                    description={t.roiAfterTaxDesc}
                                    tooltip={t.roiAfterTaxTooltip}
                                    status={getROIStatus(kpis.roi_10_year_after_tax)}
                                />
                            )}
                            
                            <KPICard
                                title={t.cashOnCash}
                                value={percentFormatter(kpis.cash_on_cash_return, 2)}
                                description={t.cashOnCashDesc}
                                tooltip={t.cashOnCashTooltip}
                                warning={getCashOnCashStatus(kpis.cash_on_cash_return) === 'warning' ? t.cashOnCashWarning : null}
                                excellent={getCashOnCashStatus(kpis.cash_on_cash_return) === 'excellent'}
                                good={getCashOnCashStatus(kpis.cash_on_cash_return) === 'good'}
                            />
                            {kpis.cash_on_cash_return_after_tax !== undefined && (
                                <KPICard
                                    title={t.cashOnCashAfterTax}
                                    value={percentFormatter(kpis.cash_on_cash_return_after_tax, 2)}
                                    description={t.cashOnCashAfterTaxDesc}
                                    tooltip={t.cashOnCashAfterTaxTooltip}
                                    status={getCashOnCashStatus(kpis.cash_on_cash_return_after_tax)}
                                />
                            )}
                            
                            <KPICard
                                title={t.irr}
                                value={percentFormatter(kpis.irr, 2)}
                                description={t.irrDesc}
                                tooltip={t.irrTooltip}
                                warning={kpis.irr < 10 ? t.irrWarning : null}
                                excellent={kpis.irr > 18}
                                good={kpis.irr > 12}
                            />
                            {kpis.irr_after_tax !== undefined && (
                                <KPICard
                                    title={t.irrAfterTax}
                                    value={percentFormatter(kpis.irr_after_tax, 2)}
                                    description={t.irrAfterTaxDesc}
                                    tooltip={t.irrAfterTaxTooltip}
                                    warning={kpis.irr_after_tax < 10 ? t.irrWarning : null}
                                    excellent={kpis.irr_after_tax > 18}
                                    good={kpis.irr_after_tax > 12}
                                />
                            )}
                            
                            <KPICard
                                title={t.capRate}
                                value={percentFormatter(kpis.cap_rate, 2)}
                                description={t.capRateDesc}
                                tooltip={t.capRateTooltip}
                                warning={getCapRateStatus(kpis.cap_rate) === 'warning' ? t.capRateWarning : null}
                                excellent={getCapRateStatus(kpis.cap_rate) === 'excellent'}
                                good={getCapRateStatus(kpis.cap_rate) === 'good'}
                            />
                            
                            <KPICard
                                title={t.dscr}
                                value={kpis.dscr ? kpis.dscr.toFixed(2) : 'N/A'}
                                description={t.dscrDesc}
                                tooltip={t.dscrTooltip}
                                warning={getDSCRStatus(kpis.dscr) === 'warning' ? t.dscrWarning : null}
                                excellent={getDSCRStatus(kpis.dscr) === 'excellent'}
                                good={getDSCRStatus(kpis.dscr) === 'good'}
                            />
                            
                            <KPICard
                                title={t.grossYield}
                                value={percentFormatter(kpis.gross_rental_yield, 2)}
                                description={t.grossYieldDesc}
                                tooltip={t.grossYieldTooltip}
                            />
                            
                            <KPICard
                                title={t.netYield}
                                value={percentFormatter(kpis.net_rental_yield, 2)}
                                description={t.netYieldDesc}
                                tooltip={t.netYieldTooltip}
                            />
                            
                            <KPICard
                                title={t.monthlyCashFlow}
                                value={currencyFormatter(kpis.monthly_cash_flow, currency, currencySymbol, 0)}
                                description={t.monthlyCashFlowDesc}
                                tooltip={t.monthlyCashFlowTooltip}
                            />
                            
                            <KPICard
                                title={t.annualCashFlow}
                                value={currencyFormatter(kpis.annual_cash_flow, currency, currencySymbol, 0)}
                                description={t.annualCashFlowDesc}
                                tooltip={t.annualCashFlowTooltip}
                            />
                            
                            <KPICard
                                title={t.noi}
                                value={currencyFormatter(kpis.net_operating_income, currency, currencySymbol, 0)}
                                description={t.noiDesc}
                                tooltip={t.noiTooltip}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="details" className="space-y-6 mt-6">
                        <ExpenseBreakdownChart 
                            expenses={expense_breakdown || []} 
                            currency={currency} 
                            language={language} 
                        />
                    </TabsContent>

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