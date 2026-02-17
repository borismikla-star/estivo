import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import KPICard from '../shared/KPICard';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import { currencyFormatter, percentFormatter } from '@/components/lib/formatters';
import { TrendingUp, TrendingDown, DollarSign, Target, PieChart as PieChartIcon, BarChart3, FileText, CheckCircle } from 'lucide-react';
import InfoTooltip from '@/components/shared/InfoTooltip';

const COLORS = ['#003E7E', '#004C97', '#0066CC', '#0080FF', '#33A3FF', '#66BBFF', '#99D6FF'];

export default function ResultsDisplay({ results, currency = '€', language = 'en' }) {
    if (!results || !results.kpis) return null;

    const { kpis, cost_breakdown, revenue_breakdown } = results;

    const translations = {
        sk: {
            title: "Výsledky developmentu",
            time_period_info: "Všetky metriky vypočítané za",
            project_duration_label: "celé trvanie projektu",
            overview: "Prehľad",
            charts: "Grafy",
            cashflow: "Cash Flow",
            vat_impact: "Vplyv DPH",
            kpis_title: "Kľúčové ukazovatele",
            
            // VAT Impact translations
            vat_section_title: "Analýza DPH",
            vat_input: "DPH na vstupe",
            vat_input_desc: "Odpočítateľná DPH z nákladov",
            vat_input_tooltip: "Suma DPH zaplatená na nákladoch, ktorú môže platca DPH odpočítať. FO neplatca DPH = 0 €, PO = cca 20% z nákladov.",
            vat_output: "DPH na výstupe",
            vat_output_desc: "DPH z predaja",
            vat_output_tooltip: "Suma DPH, ktorú musí platca DPH odviesť z predaja. Byty sú oslobodené od DPH, ale nebytové priestory a parkovacie miesta môžu podliehať DPH.",
            vat_balance: "Saldo DPH",
            vat_balance_desc: "Výsledná pozícia voči štátu",
            vat_balance_tooltip: "Rozdiel medzi DPH na výstupe a vstupe. Kladné číslo = treba zaplatiť štátu, záporné = štát vráti.",
            net_profit_after_vat: "Čistý zisk po DPH",
            net_profit_after_vat_desc: "Reálny zisk po zohľadnení DPH",
            net_profit_after_vat_tooltip: "Skutočný zisk po zaplatení/odpočítaní DPH. Pre FO neplatcu je rovnaký ako hrubý zisk, pre PO zahŕňa vplyv DPH salda.",
            entity_type_label: "Typ subjektu",
            vat_payer: "Platca DPH",
            non_vat_payer: "Neplatca DPH",
            vat_advantage: "✓ Výhoda: Môžete odpočítať DPH z nákladov",
            vat_disadvantage: "⚠ Nevýhoda: Platíte plnú cenu vrátane DPH",
            
            tax_analysis: "Daňová analýza",
            entity_type_fo: "Fyzická osoba (FO)",
            entity_type_po: "Právnická osoba (PO)",
            effective_tax_rate: "Efektívna daňová sadzba",
            tax_on_profit: "Daň zo zisku",
            tax_liability: "Daňová povinnosť",
            net_profit_after_tax: "Čistý zisk po zdanení",
            before_tax: "Pred zdanením",
            after_tax: "Po zdanení",
            
            total_project_costs: "Celkové náklady",
            total_project_costs_desc: "Všetky náklady vrátane financovania",
            total_project_costs_tooltip: "Súčet všetkých nákladov projektu: pozemok, výstavba, inžinierske siete, financovanie, rezerva a ostatné náklady.",
            gross_revenue: "Hrubé tržby",
            gross_revenue_desc: "Celkové príjmy z predaja",
            gross_revenue_tooltip: "Celkové očakávané tržby z predaja bytov, nebytových priestorov, parkovacích miest, balkónov, záhrad a pivníc.",
            gross_profit: "Hrubý zisk",
            gross_profit_desc: "Tržby mínus náklady",
            gross_profit_tooltip: "Rozdiel medzi celkovými tržbami a celkovými nákladmi projektu. Ukazuje absolútny zisk pred zdanením.",
            profit_margin: "Zisková marža",
            profit_margin_desc: "Percento zisku z tržieb",
            profit_margin_tooltip: "Zisk ako percento z celkových tržieb. Ukazuje, koľko percent z každého predaného eura zostáva ako zisk.",
            developer_margin: "Marža developera",
            developer_margin_desc: "Čistý zisk ako % nákladov",
            developer_margin_tooltip: "Zisk ako percento z celkových nákladov. Ukazuje efektivitu využitia investovaných prostriedkov.",
            return_on_cost: "Návratnosť nákladov",
            return_on_cost_desc: "ROC - zisk/náklady",
            return_on_cost_tooltip: "Return on Cost (ROC) - rovnaký ako marža developera, vyjadruje percento návratnosti investovaných nákladov.",
            equity_multiple: "Násobok kapitálu",
            equity_multiple_desc: "Koľkokrát sa vráti vlastný kapitál",
            equity_multiple_tooltip: "Ukazuje, koľkokrát sa vráti investovaný vlastný kapitál. Napr. 2.5x znamená, že dostanete 2.5-násobok svojej investície späť.",
            irr: "IRR",
            irr_desc: "Vnútorná miera návratnosti",
            irr_tooltip: "Internal Rate of Return - ročná percentuálna návratnosť investície zohľadňujúca časovú hodnotu peňazí a cash flow projektu.",
            annualized_return: "Ročná návratnosť",
            annualized_return_desc: "Ročný výnos vlastného kapitálu",
            annualized_return_tooltip: "Priemerná ročná návratnosť vlastného kapitálu prepočítaná na dobu trvania projektu.",
            cost_breakdown: "Rozloženie nákladov",
            revenue_breakdown: "Rozloženie príjmov",
            key_metrics: "Kľúčové mety",
            cost_per_m2: "Náklady/m²",
            cost_per_m2_tooltip: "Celkové náklady projektu vydelené celkovou predajnou plochou. Ukazuje priemernú cenu za m² nákladov.",
            revenue_per_m2: "Príjem/m²",
            revenue_per_m2_tooltip: "Celkové tržby vydelené celkovou predajnou plochou. Ukazuje priemernú predajnú cenu za m².",
            profit_per_m2: "Zisk/m²",
            profit_per_m2_tooltip: "Zisk vydelený celkovou predajnou plochou. Ukazuje, koľko zisku generuje každý m².",
            break_even_revenue: "Bod zvratu",
            break_even_revenue_tooltip: "Minimálna výška tržieb potrebná na pokrytie všetkých nákladov projektu. Pri tejto úrovni tržieb je zisk nulový.",
            break_even_percentage: "Bod zvratu %",
            break_even_percentage_tooltip: "Percento z plánovaných tržieb potrebné na pokrytie nákladov. Ukazuje, koľko % jednotiek je potrebné predať na break-even.",
            project_duration: "Trvanie projektu",
            months: "mesiacov",
            cashflow_timeline: "Časová os Cash Flow",
            period: "Obdobie",
            costs: "Náklady",
            revenue: "Príjmy",
            cumulative_cashflow: "Kumulatívny Cash Flow",
        },
        en: {
            title: "Development Results",
            time_period_info: "All metrics calculated for",
            project_duration_label: "entire project duration",
            overview: "Overview",
            charts: "Charts",
            cashflow: "Cash Flow",
            vat_impact: "VAT Impact",
            kpis_title: "Key Performance Indicators",
            
            // VAT Impact
            vat_section_title: "VAT Analysis",
            vat_input: "VAT Input",
            vat_input_desc: "Deductible VAT on costs",
            vat_input_tooltip: "Amount of VAT paid on costs that can be deducted by VAT payer. Non-VAT payer = 0 €, Company = approx. 20% of costs.",
            vat_output: "VAT Output",
            vat_output_desc: "VAT on sales",
            vat_output_tooltip: "Amount of VAT that must be paid to tax authority from sales. Apartments are VAT exempt, but non-residential and parking may have VAT.",
            vat_balance: "VAT Balance",
            vat_balance_desc: "Net position with tax authority",
            vat_balance_tooltip: "Difference between VAT output and input. Positive = must pay to state, negative = state refunds.",
            net_profit_after_vat: "Net Profit after VAT",
            net_profit_after_vat_desc: "Real profit after VAT consideration",
            net_profit_after_vat_tooltip: "Actual profit after paying/deducting VAT. For non-VAT payer same as gross profit, for company includes VAT balance impact.",
            entity_type_label: "Entity Type",
            vat_payer: "VAT Payer",
            non_vat_payer: "Non-VAT Payer",
            vat_advantage: "✓ Advantage: Can deduct VAT from costs",
            vat_disadvantage: "⚠ Disadvantage: Pay full price including VAT",
            
            tax_analysis: "Tax Analysis",
            entity_type_fo: "Individual (FO)",
            entity_type_po: "Legal Entity (PO)",
            effective_tax_rate: "Effective Tax Rate",
            tax_on_profit: "Tax on Profit",
            tax_liability: "Tax liability",
            net_profit_after_tax: "Net Profit After Tax",
            before_tax: "Before Tax",
            after_tax: "After Tax",
            
            total_project_costs: "Total Costs",
            total_project_costs_desc: "All costs including financing",
            total_project_costs_tooltip: "Sum of all project costs: land, construction, engineering networks, financing, reserve and other costs.",
            gross_revenue: "Gross Revenue",
            gross_revenue_desc: "Total sales revenue",
            gross_revenue_tooltip: "Total expected revenue from sales of apartments, non-residential units, parking spaces, balconies, gardens and basements.",
            gross_profit: "Gross Profit",
            gross_profit_desc: "Revenue minus costs",
            gross_profit_tooltip: "Difference between total revenue and total project costs. Shows absolute profit before taxes.",
            profit_margin: "Profit Margin",
            profit_margin_desc: "Profit as % of revenue",
            profit_margin_tooltip: "Profit as percentage of total revenue. Shows how much of each euro sold remains as profit.",
            developer_margin: "Developer Margin",
            developer_margin_desc: "Net profit as % of cost",
            developer_margin_tooltip: "Profit as percentage of total costs. Shows efficiency of invested capital utilization.",
            return_on_cost: "Return on Cost",
            return_on_cost_desc: "ROC - profit/cost",
            return_on_cost_tooltip: "Return on Cost (ROC) - same as developer margin, expresses percentage return on invested costs.",
            equity_multiple: "Equity Multiple",
            equity_multiple_desc: "How many times equity is returned",
            equity_multiple_tooltip: "Shows how many times your invested equity is returned. E.g. 2.5x means you get 2.5 times your investment back.",
            irr: "IRR",
            irr_desc: "Internal Rate of Return",
            irr_tooltip: "Internal Rate of Return - annual percentage return considering time value of money and project cash flows.",
            annualized_return: "Annualized Return",
            annualized_return_desc: "Annual return on equity",
            annualized_return_tooltip: "Average annual return on equity calculated over the project duration.",
            cost_breakdown: "Cost Breakdown",
            revenue_breakdown: "Revenue Breakdown",
            key_metrics: "Key Metrics",
            cost_per_m2: "Cost/m²",
            revenue_per_m2: "Revenue/m²",
            cost_per_m2_tooltip: "Total project costs divided by total sales area. Shows average cost per m².",
            revenue_per_m2_tooltip: "Total revenue divided by total sales area. Shows average selling price per m².",
            profit_per_m2: "Profit/m2",
            profit_per_m2_tooltip: "Profit divided by total sales area. Shows how much profit each m² generates.",
            break_even_revenue: "Break-Even",
            break_even_revenue_tooltip: "Minimum revenue needed to cover all project costs. At this revenue level, profit is zero.",
            break_even_percentage: "Break-Even %",
            break_even_percentage_tooltip: "Percentage of planned revenue needed to cover costs. Shows what % of units need to be sold to break even.",
            project_duration: "Project Duration",
            months: "months",
            cashflow_timeline: "Cash Flow Timeline",
            period: "Period",
            costs: "Costs",
            revenue: "Revenue",
            cumulative_cashflow: "Cumulative Cash Flow",
        },
        pl: {
            title: "Wyniki deweloperskie",
            time_period_info: "Wszystkie wskaźniki obliczone dla",
            project_duration_label: "całego czasu trwania projektu",
            overview: "Przegląd",
            charts: "Wykresy",
            cashflow: "Przepływ gotówki",
            vat_impact: "Wpływ VAT",
            kpis_title: "Kluczowe wskaźniki",

            // VAT Impact translations
            vat_section_title: "Analiza VAT",
            vat_input: "VAT naliczony",
            vat_input_desc: "Podlegający odliczeniu VAT od kosztów",
            vat_input_tooltip: "Kwota VAT zapłacona od kosztów, którą płatnik VAT może odliczyć. Podmiot niebędący płatnikiem VAT = 0 €, Firma = ok. 20% kosztów.",
            vat_output: "VAT należny",
            vat_output_desc: "VAT od sprzedaży",
            vat_output_tooltip: "Kwota VAT, którą płatnik VAT musi odprowadzić od sprzedaży. Mieszkania są zwolnione z VAT, ale powierzchnie niemieszkalne i miejsca parkingowe mogą podlegać VAT.",
            vat_balance: "Saldo VAT",
            vat_balance_desc: "Pozycja netto względem urzędu skarbowego",
            vat_balance_tooltip: "Różnica między VAT należnym a naliczonym. Dodatnia = do zapłaty państwu, ujemna = państwo zwraca.",
            net_profit_after_vat: "Zysk netto po VAT",
            net_profit_after_vat_desc: "Realny zysk po uwzględnieniu VAT",
            net_profit_after_vat_tooltip: "Rzeczywisty zysk po zapłaceniu/odliczeniu VAT. Dla niepłatnika VAT taki sam jak zysk brutto, dla firmy uwzględnia wpływ salda VAT.",
            entity_type_label: "Typ podmiotu",
            vat_payer: "Płatnik VAT",
            non_vat_payer: "Niepłatnik VAT",
            vat_advantage: "✓ Zaleta: Możesz odliczyć VAT od kosztów",
            vat_disadvantage: "⚠ Wada: Płacisz pełną cenę z VAT",
            
            tax_analysis: "Analiza podatkowa",
            entity_type_fo: "Osoba fizyczna (FO)",
            entity_type_po: "Osoba prawna (PO)",
            effective_tax_rate: "Efektywna stopa podatkowa",
            tax_on_profit: "Podatek od zysku",
            tax_liability: "Zobowiązanie podatkowe",
            net_profit_after_tax: "Zysk netto po opodatkowaniu",
            before_tax: "Przed opodatkowaniem",
            after_tax: "Po opodatkowaniu",
            
            total_project_costs: "Całkowite koszty",
            total_project_costs_desc: "Wszystkie koszty wraz z finansowaniem",
            total_project_costs_tooltip: "Suma wszystkich kosztów projektu: grunt, budowa, sieci inżynieryjne, finansowanie, rezerwa i inne koszty.",
            gross_revenue: "Przychody brutto",
            gross_revenue_desc: "Całkowite przychody ze sprzedaży",
            gross_revenue_tooltip: "Całkowite oczekiwane przychody ze sprzedaży mieszkań, lokali użytkowych, miejsc parkingowych, balkonów, ogrodów i piwnic.",
            gross_profit: "Zysk brutto",
            gross_profit_desc: "Przychody minus koszty",
            gross_profit_tooltip: "Różnica między całkowitymi przychodami a całkowitymi kosztami projektu. Pokazuje zysk absolutny przed opodatkowaniem.",
            profit_margin: "Marża zysku",
            profit_margin_desc: "Zysk jako % przychodów",
            profit_margin_tooltip: "Zysk jako procent całkowitych przychodów. Pokazuje, ile procent z każdego sprzedanego euro pozostaje jako zysk.",
            developer_margin: "Marża dewelopera",
            developer_margin_desc: "Zysk netto jako % kosztów",
            developer_margin_tooltip: "Zysk jako procent całkowitych kosztów. Pokazuje efektywność wykorzystania zainwestowanego kapitału.",
            return_on_cost: "Zwrot z kosztów",
            return_on_cost_desc: "ROC - zysk/koszty",
            return_on_cost_tooltip: "Return on Cost (ROC) - tak samo jak marża dewelopera, wyraża procentowy zwrot z zainwestowanych kosztów.",
            equity_multiple: "Mnożnik kapitału",
            equity_multiple_desc: "Ile razy zwraca się kapitał",
            equity_multiple_tooltip: "Pokazuje, ile razy zwraca się zainwestowany kapitał własny. Np. 2.5x oznacza, że otrzymasz 2.5 raza więcej niż zainwestowałeś.",
            irr: "IRR",
            irr_desc: "Wewnętrzna stopa zwrotu",
            irr_tooltip: "Internal Rate of Return - roczny procentowy zwrot uwzględniający wartość pieniądza w czasie i przepływy gotówki projektu.",
            annualized_return: "Roczny zwrot",
            annualized_return_desc: "Roczny zwrot z kapitału",
            annualized_return_tooltip: "Średni roczny zwrot z kapitału własnego obliczony na podstawie czasu trwania projektu.",
            cost_breakdown: "Podział kosztów",
            revenue_breakdown: "Podział przychodów",
            key_metrics: "Kluczowe metryki",
            cost_per_m2: "Koszt/m²",
            cost_per_m2_tooltip: "Całkowite koszty projektu podzielone przez całkowitą powierzchnię sprzedaży. Pokazuje średni koszt na m².",
            revenue_per_m2: "Przychód/m²",
            revenue_per_m2_tooltip: "Całkowite przychody podzielone przez całkowitą powierzchnię sprzedaży. Pokazuje średnią cenę sprzedaży na m².",
            profit_per_m2: "Zysk/m²",
            profit_per_m2_tooltip: "Zysk podzielony przez całkowitą powierzchnię sprzedaży. Pokazuje, ile zysku generuje każdy m².",
            break_even_revenue: "Próg rentowności",
            break_even_revenue_tooltip: "Minimalne przychody potrzebne do pokrycia wszystkich kosztów projektu. Przy tym poziomie przychodów zysk wynosi zero.",
            break_even_percentage: "Próg rentowności %",
            break_even_percentage_tooltip: "Procent planowanych przychodów potrzebny do pokrycia kosztów. Pokazuje, jaki % lokali należy sprzedać, aby osiągnąć próg rentowności.",
            project_duration: "Czas trwania projektu",
            months: "miesiące",
            cashflow_timeline: "Oś czasu przepływu gotówki",
            period: "Okres",
            costs: "Koszty",
            revenue: "Przychody",
            cumulative_cashflow: "Skumulowany przepływ gotówki",
        },
        hu: {
            title: "Fejlesztési eredmények",
            time_period_info: "Minden mutató kiszámítva",
            project_duration_label: "teljes projekt időtartamra",
            overview: "Áttekintés",
            charts: "Grafikonok",
            cashflow: "Pénzáramlás",
            vat_impact: "ÁFA hatás",
            kpis_title: "Kulcs teljesítménymutatók",

            // VAT Impact translations
            vat_section_title: "ÁFA elemzés",
            vat_input: "ÁFA bejövő oldalon",
            vat_input_desc: "Levonható ÁFA a költségekből",
            vat_input_tooltip: "A költségekre fizetett ÁFA összege, amelyet az ÁFA-fizető levonhat. Nem ÁFA-fizető = 0 €, Cég = kb. a költségek 20%-a.",
            vat_output: "ÁFA kimenő oldalon",
            vat_output_desc: "ÁFA az értékesítésből",
            vat_output_tooltip: "Az ÁFA összege, amelyet az ÁFA-fizetőnek be kell fizetnie az értékesítésből. A lakások ÁFA-mentesek, de a nem lakáscélú és parkolóhelyek ÁFA alá eshetnek.",
            vat_balance: "ÁFA egyenleg",
            vat_balance_desc: "Nettó pozíció az adóhatósággal szemben",
            vat_balance_tooltip: "Az ÁFA kimenő és bejövő oldal közötti különbség. Pozitív = az államnak kell fizetni, negatív = az állam visszatérít.",
            net_profit_after_vat: "Nettó nyereség ÁFA után",
            net_profit_after_vat_desc: "Valós nyereség az ÁFA figyelembevételével",
            net_profit_after_vat_tooltip: "Tényleges nyereség az ÁFA kifizetése/levonása után. Nem ÁFA-fizető esetében megegyezik a bruttó nyereséggel, cég esetében tartalmazza az ÁFA egyenleg hatását.",
            entity_type_label: "Jogi forma",
            vat_payer: "ÁFA fizető",
            non_vat_payer: "Nem ÁFA fizető",
            vat_advantage: "✓ Előny: Levonhatja az ÁFA-t a költségekből",
            vat_disadvantage: "⚠ Hátrány: Teljes árat fizet, beleértve az ÁFA-t",

            tax_analysis: "Adóelemzés",
            entity_type_fo: "Magánszemély (FO)",
            entity_type_po: "Jogi személy (PO)",
            effective_tax_rate: "Effektív adókulcs",
            tax_on_profit: "Nyereségadó",
            tax_liability: "Adókötelezettség",
            net_profit_after_tax: "Nettó nyereség adózás után",
            before_tax: "Adózás előtt",
            after_tax: "Adózás után",

            total_project_costs: "Összes költség",
            total_project_costs_desc: "Összes költség a finanszírozással együtt",
            total_project_costs_tooltip: "Összes projektköltség összege: telek, építés, mérnöki hálózatok, finanszírozás, tartalék és egyéb költségek.",
            gross_revenue: "Bruttó bevétel",
            gross_revenue_desc: "Összes értékesítési bevétel",
            gross_revenue_tooltip: "Várható összes bevétel lakások, nem lakás egységek, parkolóhelyek, erkélyek, kertek és pincék értékesítéséből.",
            gross_profit: "Bruttó nyereség",
            gross_profit_desc: "Bevétel mínusz költségek",
            gross_profit_tooltip: "Különbség az összes bevétel és az összes projektköltség között. Mutatja az abszolút nyereséget adózás előtt.",
            profit_margin: "Profitmarzs",
            profit_margin_desc: "Nyereség mint a bevétel %-a",
            profit_margin_tooltip: "Nyereség az összes bevétel százalékában. Mutatja, hogy minden eladott euróból mennyi marad nyereségként.",
            developer_margin: "Fejlesztői marzs",
            developer_margin_desc: "Nettó nyereség mint a költség %-a",
            developer_margin_tooltip: "Nyereség az összes költség százalékában. Mutatja a befektetett tőke felhasználásának hatékonyságát.",
            return_on_cost: "Költség megtérülés",
            return_on_cost_desc: "ROC - nyereség/költség",
            return_on_cost_tooltip: "Return on Cost (ROC) - ugyanaz, mint a fejlesztői marzs, százalékos megtérülést fejez ki a befektetett költségekre.",
            equity_multiple: "Tőke szorzó",
            equity_multiple_desc: "Hányszor térül meg a tőke",
            equity_multiple_tooltip: "Mutatja, hogy hányszor térül meg a befektetett saját tőke. Pl. 2.5x azt jelenti, hogy 2.5-szerese kapja vissza a befektetését.",
            irr: "IRR",
            irr_desc: "Belső megtérülési ráta",
            irr_tooltip: "Internal Rate of Return - éves százalékos hozam figyelembe véve a pénz időértékét és a projekt pénzáramait.",
            annualized_return: "Éves hozam",
            annualized_return_desc: "Éves tőkehozam",
            annualized_return_tooltip: "Átlagos éves saját tőke hozam a projekt időtartamára számítva.",
            cost_breakdown: "Költségek részletezése",
            revenue_breakdown: "Bevételek részletezése",
            key_metrics: "Kulcs metrikák",
            cost_per_m2: "Költség/m²",
            cost_per_m2_tooltip: "Összes projektköltség osztva az összes értékesítési területtel. Mutatja az átlagos költséget m²-enként.",
            revenue_per_m2: "Bevétel/m²",
            revenue_per_m2_tooltip: "Összes bevétel osztva az összes értékesítési területtel. Mutatja az átlagos eladási árat m²-enként.",
            profit_per_m2: "Nyereség/m²",
            profit_per_m2_tooltip: "Nyereség osztva az összes értékesítési területtel. Mutatja, hogy mennyi nyereséget termel minden m².",
            break_even_revenue: "Fedezeti pont",
            break_even_revenue_tooltip: "Minimális bevétel az összes projektköltség fedezéséhez. Ezen a bevételi szinten a nyereség nulla.",
            break_even_percentage: "Fedezeti pont %",
            break_even_percentage_tooltip: "A tervezett bevétel százaléka, amely szükséges a költségek fedezéséhez. Mutatja, hogy hány % egységet kell eladni a fedezeti ponthoz.",
            project_duration: "Projekt időtartam",
            months: "hónap",
            cashflow_timeline: "Pénzáramlás idővonal",
            period: "Időszak",
            costs: "Költségek",
            revenue: "Bevétel",
            cumulative_cashflow: "Kumulatív pénzáramlás",
        },
        de: {
            title: "Entwicklungsergebnisse",
            time_period_info: "Alle Kennzahlen berechnet für",
            project_duration_label: "gesamte Projektdauer",
            overview: "Übersicht",
            charts: "Diagramme",
            cashflow: "Cashflow",
            vat_impact: "Mehrwertsteuer-Auswirkungen",
            kpis_title: "Leistungskennzahlen",

            // VAT Impact translations
            vat_section_title: "Mehrwertsteuer-Analyse",
            vat_input: "Vorsteuer",
            vat_input_desc: "Abziehbare Mehrwertsteuer auf Kosten",
            vat_input_tooltip: "Betrag der auf Kosten gezahlten Mehrwertsteuer, die vom Mehrwertsteuerzahler abgezogen werden kann. Nicht-Mehrwertsteuerzahler = 0 €, Unternehmen = ca. 20% der Kosten.",
            vat_output: "Umsatzsteuer",
            vat_output_desc: "Mehrwertsteuer auf Verkäufe",
            vat_output_tooltip: "Betrag der Mehrwertsteuer, der vom Mehrwertsteuerzahler aus Verkäufen an das Finanzamt abgeführt werden muss. Wohnungen sind mehrwertsteuerbefreit, aber Nichtwohnflächen und Parkplätze können der Mehrwertsteuer unterliegen.",
            vat_balance: "Mehrwertsteuer-Saldo",
            vat_balance_desc: "Nettoposition gegenüber dem Finanzamt",
            vat_balance_tooltip: "Differenz zwischen Umsatzsteuer und Vorsteuer. Positiv = an den Staat zu zahlen, negativ = Staat erstattet.",
            net_profit_after_vat: "Nettogewinn nach Mehrwertsteuer",
            net_profit_after_vat_desc: "Realistischer Gewinn nach Berücksichtigung der Mehrwertsteuer",
            net_profit_after_vat_tooltip: "Tatsächlicher Gewinn nach Zahlung/Abzug der Mehrwertsteuer. Für Nicht-Mehrwertsteuerzahler gleich dem Bruttogewinn, für Unternehmen beinhaltet es die Auswirkung des Mehrwertsteuer-Saldos.",
            entity_type_label: "Rechtsform",
            vat_payer: "Mehrwertsteuerzahler",
            non_vat_payer: "Nicht-Mehrwertsteuerzahler",
            vat_advantage: "✓ Vorteil: Sie können die Mehrwertsteuer von den Kosten abziehen",
            vat_disadvantage: "⚠ Nachteil: Sie zahlen den vollen Preis inklusive Mehrwertsteuer",
            
            tax_analysis: "Steueranalyse",
            entity_type_fo: "Natürliche Person (FO)",
            entity_type_po: "Juristische Person (PO)",
            effective_tax_rate: "Effektiver Steuersatz",
            tax_on_profit: "Gewinnsteuer",
            tax_liability: "Steuerpflicht",
            net_profit_after_tax: "Nettogewinn nach Steuern",
            before_tax: "Vor Steuern",
            after_tax: "Nach Steuern",
            
            total_project_costs: "Gesamtkosten",
            total_project_costs_desc: "Alle Kosten inkl. Finanzierung",
            total_project_costs_tooltip: "Summe aller Projektkosten: Grundstück, Bau, technische Netze, Finanzierung, Reserve und sonstige Kosten.",
            gross_revenue: "Bruttoeinnahmen",
            gross_revenue_desc: "Gesamte Verkaufserlöse",
            gross_revenue_tooltip: "Erwartete Gesamteinnahmen aus dem Verkauf von Wohnungen, Gewerbeflächen, Parkplätzen, Balkonen, Gärten und Kellern.",
            gross_profit: "Bruttogewinn",
            gross_profit_desc: "Einnahmen minus Kosten",
            gross_profit_tooltip: "Differenz zwischen Gesamteinnahmen und Gesamtprojektkosten. Zeigt absoluten Gewinn vor Steuern.",
            profit_margin: "Gewinnmarge",
            profit_margin_desc: "Gewinn als % der Einnahmen",
            profit_margin_tooltip: "Gewinn als Prozentsatz der Gesamteinnahmen. Zeigt, wie viel von jedem verkauften Euro als Gewinn verbleibt.",
            developer_margin: "Entwicklermarge",
            developer_margin_desc: "Nettogewinn als % der Kosten",
            developer_margin_tooltip: "Gewinn als Prozentsatz der Gesamtkosten. Zeigt die Effizienz der Kapitalnutzung.",
            return_on_cost: "Kostenrendite",
            return_on_cost_desc: "ROC - Gewinn/Kosten",
            return_on_cost_tooltip: "Return on Cost (ROC) - gleich wie Entwicklermarge, drückt prozentuale Rendite der investierten Kosten aus.",
            equity_multiple: "Eigenkapital-Multiplikator",
            equity_multiple_desc: "Wie oft wird das Eigenkapital zurückgegeben",
            equity_multiple_tooltip: "Zeigt, wie oft Ihr investiertes Eigenkapital zurückkehrt. Z.B. 2.5x bedeutet, Sie erhalten das 2.5-fache Ihrer Investition zurück.",
            irr: "IRR",
            irr_desc: "Interner Zinsfuß",
            irr_tooltip: "Internal Rate of Return - jährliche prozentuale Rendite unter Berücksichtigung des Zeitwerts des Geldes und der Projekt-Cashflows.",
            annualized_return: "Jährliche Rendite",
            annualized_return_desc: "Jährliche Eigenkapitalrendite",
            annualized_return_tooltip: "Durchschnittliche jährliche Eigenkapitalrendite über die Projektdauer berechnet.",
            cost_breakdown: "Kostenaufschlüsselung",
            revenue_breakdown: "Einnahmenaufschlüsselung",
            key_metrics: "Kennzahlen",
            cost_per_m2: "Kosten/m²",
            cost_per_m2_tooltip: "Gesamtprojektkosten geteilt durch Gesamtverkaufsfläche. Zeigt durchschnittliche Kosten pro m².",
            revenue_per_m2: "Einnahmen/m²",
            revenue_per_m2_tooltip: "Gesamteinnahmen geteilt durch Gesamtverkaufsfläche. Zeigt durchschnittlichen Verkaufspreis pro m².",
            profit_per_m2: "Gewinn/m²",
            profit_per_m2_tooltip: "Gewinn geteilt durch Gesamtverkaufsfläche. Zeigt, wie viel Gewinn jeder m² generiert.",
            break_even_revenue: "Break-Even",
            break_even_revenue_tooltip: "Mindesteinnahmen zur Deckung aller Projektkosten. Bei diesem Einnahmenniveau ist der Gewinn null.",
            break_even_percentage: "Break-Even %",
            break_even_percentage_tooltip: "Prozentsatz der geplanten Einnahmen zur Kostendeckung. Zeigt, welcher % der Einheiten verkauft werden muss, um Break-Even zu erreichen.",
            project_duration: "Projektdauer",
            months: "Monate",
            cashflow_timeline: "Cashflow-Zeitachse",
            period: "Zeitraum",
            costs: "Kosten",
            revenue: "Einnahmen",
            cumulative_cashflow: "Kumulativer Cashflow",
        }
    };

    const t = translations[language] || translations.en;

    // Generate Cash Flow Timeline data (simplified - 4 phases)
    const cashFlowData = [
        { period: '1-6 ' + t.months, costs: -kpis.total_project_costs * 0.3, revenue: 0, cumulative: -kpis.total_project_costs * 0.3 },
        { period: '7-12 ' + t.months, costs: -kpis.total_project_costs * 0.4, revenue: kpis.gross_revenue * 0.2, cumulative: -kpis.total_project_costs * 0.7 + kpis.gross_revenue * 0.2 },
        { period: '13-18 ' + t.months, costs: -kpis.total_project_costs * 0.2, revenue: kpis.gross_revenue * 0.4, cumulative: -kpis.total_project_costs * 0.9 + kpis.gross_revenue * 0.6 },
        { period: '19-24 ' + t.months, costs: -kpis.total_project_costs * 0.1, revenue: kpis.gross_revenue * 0.4, cumulative: kpis.gross_profit }
    ];

    // VAT Impact message based on entity type
    const vatImpactMessages = {
        sk: {
            vat_payer: `Ako platca DPH môžete odpočítať ${currencyFormatter(kpis.vat_input, 'EUR', currency, 0)} z nákladov, čo výrazne znižuje reálne náklady projektu.`,
            non_vat_payer: `Ako neplatca DPH platíte plnú cenu vrátane DPH, čo zvyšuje vaše náklady o približne 20%. Zvážte registráciu ako platca DPH.`
        },
        en: {
            vat_payer: `As VAT payer you can deduct ${currencyFormatter(kpis.vat_input, 'EUR', currency, 0)} from costs, significantly reducing real project costs.`,
            non_vat_payer: `As non-VAT payer you pay full price including VAT, increasing your costs by approximately 20%. Consider registering as VAT payer.`
        },
        pl: {
            vat_payer: `Jako płatnik VAT możesz odliczyć ${currencyFormatter(kpis.vat_input, 'EUR', currency, 0)} od kosztów, co znacznie obniża rzeczywiste koszty projektu.`,
            non_vat_payer: `Jako niebędący płatnikiem VAT płacisz pełną cenę wraz z VAT, co zwiększa Twoje koszty o około 20%. Rozważ rejestrację jako płatnik VAT.`
        },
        hu: {
            vat_payer: `ÁFA fizetőként levonhat ${currencyFormatter(kpis.vat_input, 'EUR', currency, 0)} a költségekből, ami jelentősen csökkenti a valós projektköltségeket.`,
            non_vat_payer: `Nem ÁFA fizetőként a teljes árat fizeti ÁFA-val együtt, ami körülbelül 20%-kal növeli a költségeket. Fontolja meg az ÁFA fizetői regisztrációt.`
        },
        de: {
            vat_payer: `Als Mehrwertsteuerzahler können Sie ${currencyFormatter(kpis.vat_input, 'EUR', currency, 0)} von den Kosten abziehen, was die tatsächlichen Projektkosten erheblich reduziert.`,
            non_vat_payer: `Als Nicht-Mehrwertsteuerzahler zahlen Sie den vollen Preis inklusive Mehrwertsteuer, was Ihre Kosten um etwa 20% erhöht. Erwägen Sie die Registrierung als Mehrwertsteuerzahler.`
        }
    };

    const vatMessage = kpis.is_vat_payer 
        ? (vatImpactMessages[language] || vatImpactMessages.en).vat_payer
        : (vatImpactMessages[language] || vatImpactMessages.en).non_vat_payer;

    return (
        <div className="space-y-6">
            <Card className="shadow-premium border-primary/20">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                    <CardTitle className="text-2xl flex items-center gap-2">
                        <TrendingUp className="w-6 h-6" />
                        {t.title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="grid w-full grid-cols-4 mb-6">
                            <TabsTrigger value="overview">{t.overview}</TabsTrigger>
                            <TabsTrigger value="vat_impact">{t.vat_impact}</TabsTrigger>
                            <TabsTrigger value="charts">{t.charts}</TabsTrigger>
                            <TabsTrigger value="cashflow">{t.cashflow}</TabsTrigger>
                        </TabsList>

                        {/* Overview Tab */}
                        <TabsContent value="overview" className="space-y-6">
                            {/* Time Period Info */}
                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
                                <span className="text-sm text-blue-800 font-medium">
                                    ⏱ {t.time_period_info}: {t.project_duration_label} ({kpis.project_duration_months || 24} {t.months})
                                </span>
                            </div>
                            
                            {/* TAX ANALYSIS SECTION (NEW!) */}
                            {kpis.effective_tax_rate !== undefined && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                                        <FileText className="w-5 h-5" />
                                        {t.tax_analysis}
                                    </h3>
                                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                        <div className="flex items-center gap-2 mb-3">
                                            <CheckCircle className="w-5 h-5 text-amber-600" />
                                            <span className="font-semibold text-amber-800">
                                                {kpis.entity_type === 'PO' ? t.entity_type_po : t.entity_type_fo}
                                            </span>
                                            <span className="text-sm text-gray-600">
                                                ({t.effective_tax_rate}: {percentFormatter(kpis.effective_tax_rate)})
                                            </span>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <KPICard
                                                title={t.gross_profit}
                                                value={currencyFormatter(kpis.gross_profit, 'EUR', currency, 0)}
                                                description={t.before_tax}
                                            />
                                            <KPICard
                                                title={t.tax_on_profit}
                                                value={currencyFormatter(kpis.tax_on_profit, 'EUR', currency, 0)}
                                                description={t.tax_liability}
                                                status="warning"
                                            />
                                            <KPICard
                                                title={t.net_profit_after_tax}
                                                value={currencyFormatter(kpis.net_profit_after_tax, 'EUR', currency, 0)}
                                                description={t.after_tax}
                                                status="excellent"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Target className="w-5 h-5" />
                                {t.kpis_title}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <KPICard
                                    title={t.total_project_costs}
                                    value={currencyFormatter(kpis.total_project_costs, 'EUR', currency, 0)}
                                    icon={DollarSign}
                                    description={t.total_project_costs_desc}
                                    tooltip={t.total_project_costs_tooltip}
                                />
                                <KPICard
                                    title={t.gross_revenue}
                                    value={currencyFormatter(kpis.gross_revenue, 'EUR', currency, 0)}
                                    icon={TrendingUp}
                                    description={t.gross_revenue_desc}
                                    trend="up"
                                    tooltip={t.gross_revenue_tooltip}
                                />
                                <KPICard
                                    title={t.gross_profit}
                                    value={currencyFormatter(kpis.gross_profit, 'EUR', currency, 0)}
                                    icon={TrendingUp}
                                    description={t.gross_profit_desc}
                                    trend={kpis.gross_profit > 0 ? "up" : "down"}
                                    tooltip={t.gross_profit_tooltip}
                                />
                                <KPICard
                                    title={t.profit_margin}
                                    value={percentFormatter(kpis.profit_margin)}
                                    icon={Target}
                                    description={t.profit_margin_desc}
                                    tooltip={t.profit_margin_tooltip}
                                />
                                <KPICard
                                    title={t.developer_margin}
                                    value={percentFormatter(kpis.developer_margin)}
                                    icon={Target}
                                    description={t.developer_margin_desc}
                                    tooltip={t.developer_margin_tooltip}
                                />
                                <KPICard
                                    title={t.return_on_cost}
                                    value={percentFormatter(kpis.return_on_cost)}
                                    icon={TrendingUp}
                                    description={t.return_on_cost_desc}
                                    tooltip={t.return_on_cost_tooltip}
                                />
                                <KPICard
                                    title={t.equity_multiple}
                                    value={`${kpis.equity_multiple?.toFixed(2)}x`}
                                    icon={TrendingUp}
                                    description={t.equity_multiple_desc}
                                    tooltip={t.equity_multiple_tooltip}
                                />
                                <KPICard
                                    title={t.irr}
                                    value={percentFormatter(kpis.irr)}
                                    icon={TrendingUp}
                                    description={t.irr_desc}
                                    tooltip={t.irr_tooltip}
                                />
                                <KPICard
                                    title={t.annualized_return}
                                    value={percentFormatter(kpis.annualized_return)}
                                    icon={TrendingUp}
                                    description={t.annualized_return_desc}
                                    tooltip={t.annualized_return_tooltip}
                                />
                            </div>

                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold mb-4">{t.key_metrics}</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                                    <div className="bg-muted/30 p-4 rounded-lg">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-sm text-muted-foreground">{t.cost_per_m2}</p>
                                            <InfoTooltip content={t.cost_per_m2_tooltip} />
                                        </div>
                                        <p className="text-lg font-bold">{currencyFormatter(kpis.cost_per_m2, 'EUR', currency, 0)}</p>
                                    </div>
                                    <div className="bg-muted/30 p-4 rounded-lg">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-sm text-muted-foreground">{t.revenue_per_m2}</p>
                                            <InfoTooltip content={t.revenue_per_m2_tooltip} />
                                        </div>
                                        <p className="text-lg font-bold">{currencyFormatter(kpis.revenue_per_m2, 'EUR', currency, 0)}</p>
                                    </div>
                                    <div className="bg-muted/30 p-4 rounded-lg">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-sm text-muted-foreground">{t.profit_per_m2}</p>
                                            <InfoTooltip content={t.profit_per_m2_tooltip} />
                                        </div>
                                        <p className="text-lg font-bold">{currencyFormatter(kpis.profit_per_m2, 'EUR', currency, 0)}</p>
                                    </div>
                                    <div className="bg-muted/30 p-4 rounded-lg">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-sm text-muted-foreground">{t.break_even_revenue}</p>
                                            <InfoTooltip content={t.break_even_revenue_tooltip} />
                                        </div>
                                        <p className="text-lg font-bold">{currencyFormatter(kpis.break_even_revenue, 'EUR', currency, 0)}</p>
                                    </div>
                                    <div className="bg-muted/30 p-4 rounded-lg">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-sm text-muted-foreground">{t.break_even_percentage}</p>
                                            <InfoTooltip content={t.break_even_percentage_tooltip} />
                                        </div>
                                        <p className="text-lg font-bold">{percentFormatter(kpis.break_even_percentage)}</p>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* NEW: VAT Impact Tab */}
                        <TabsContent value="vat_impact" className="space-y-6">
                            <div className="bg-muted/30 p-4 rounded-lg mb-4">
                                <p className="text-sm font-semibold mb-2">{t.entity_type_label}</p>
                                <p className="text-2xl font-bold text-primary mb-2">
                                    {kpis.is_vat_payer ? t.vat_payer : t.non_vat_payer}
                                </p>
                                <p className={`text-sm ${kpis.is_vat_payer ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {kpis.is_vat_payer ? t.vat_advantage : t.vat_disadvantage}
                                </p>
                            </div>

                            <h3 className="text-lg font-semibold">{t.vat_section_title}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <KPICard
                                    title={t.vat_input}
                                    value={currencyFormatter(kpis.vat_input || 0, 'EUR', currency, 0)}
                                    icon={DollarSign}
                                    description={t.vat_input_desc}
                                    trend={kpis.vat_input > 0 ? "up" : null}
                                    tooltip={t.vat_input_tooltip}
                                />
                                <KPICard
                                    title={t.vat_output}
                                    value={currencyFormatter(kpis.vat_output || 0, 'EUR', currency, 0)}
                                    icon={DollarSign}
                                    description={t.vat_output_desc}
                                    trend={kpis.vat_output > 0 ? "down" : null}
                                    tooltip={t.vat_output_tooltip}
                                />
                                <KPICard
                                    title={t.vat_balance}
                                    value={currencyFormatter(kpis.vat_balance || 0, 'EUR', currency, 0)}
                                    icon={kpis.vat_balance >= 0 ? TrendingDown : TrendingUp}
                                    description={t.vat_balance_desc}
                                    trend={kpis.vat_balance >= 0 ? "down" : "up"}
                                    tooltip={t.vat_balance_tooltip}
                                />
                                <KPICard
                                    title={t.net_profit_after_vat}
                                    value={currencyFormatter(kpis.net_profit_after_vat || 0, 'EUR', currency, 0)}
                                    icon={TrendingUp}
                                    description={t.net_profit_after_vat_desc}
                                    trend={kpis.net_profit_after_vat > 0 ? "up" : "down"}
                                    tooltip={t.net_profit_after_vat_tooltip}
                                />
                            </div>

                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
                                {kpis.is_vat_payer ? t.vat_advantage.replace('✓ ', '💡 ') : t.vat_disadvantage.replace('⚠ ', '⚠️ ')}
                                </h4>
                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                    {vatMessage}
                                </p>
                            </div>
                        </TabsContent>

                        {/* Charts Tab */}
                        <TabsContent value="charts" className="space-y-8">
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Cost Breakdown */}
                                {cost_breakdown && cost_breakdown.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                            <PieChartIcon className="w-5 h-5" />
                                            {t.cost_breakdown}
                                        </h3>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={cost_breakdown}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={80}
                                                    label
                                                >
                                                    {cost_breakdown.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip formatter={(value) => currencyFormatter(value, 'EUR', currency, 0)} />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}

                                {/* Revenue Breakdown */}
                                {revenue_breakdown && revenue_breakdown.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                            <BarChart3 className="w-5 h-5" />
                                            {t.revenue_breakdown}
                                        </h3>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={revenue_breakdown}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis tickFormatter={(value) => `${currency}${(value / 1000).toFixed(0)}k`} />
                                                <Tooltip formatter={(value) => currencyFormatter(value, 'EUR', currency, 0)} />
                                                <Bar dataKey="value" fill="#003E7E" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        {/* Cash Flow Tab */}
                        <TabsContent value="cashflow" className="space-y-6">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <TrendingUp className="w-5 h-5" />
                                {t.cashflow_timeline}
                            </h3>
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={cashFlowData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="period" />
                                    <YAxis tickFormatter={(value) => `${currency}${(value / 1000).toFixed(0)}k`} />
                                    <Tooltip formatter={(value) => currencyFormatter(value, 'EUR', currency, 0)} />
                                    <Legend />
                                    <Line type="monotone" dataKey="costs" stroke="#E53935" name={t.costs} strokeWidth={2} />
                                    <Line type="monotone" dataKey="revenue" stroke="#00B894" name={t.revenue} strokeWidth={2} />
                                    <Line type="monotone" dataKey="cumulative" stroke="#003E7E" name={t.cumulative_cashflow} strokeWidth={3} />
                                </LineChart>
                            </ResponsiveContainer>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}