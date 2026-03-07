import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const fmt = (n) => n == null ? '—' : Math.round(n).toLocaleString('sk-SK');

// Estivo logo via hosted image URL
const LOGO_HTML = `<img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68d666dadfd2546479ace4c8/f7fb54908_logo.png" style="height:40px;display:block;" crossorigin="anonymous" />`;

const LABELS = {
  en: {
    concept: "Land Feasibility Concept",
    generated: "Generated",
    mode_block: "Building Development",
    mode_sub: "Subdivision",
    disclaimer: "Concept-level estimation – no architectural study",
    land_area: "Total Land Area",
    built_area: "Built-up Area (Footprint)",
    hpp_above: "GFA Above Ground",
    hpp_below: "GFA Below Ground",
    npp_above: "NFA Above Ground",
    npp_below: "NFA Below Ground",
    apartments_area: "Apartments Area",
    non_residential_area: "Non-Residential Area",
    balconies_area: "Balconies",
    parking_covered: "Covered Parking",
    parking_outdoor: "Outdoor Parking",
    paved_area: "Paved Areas",
    green_terrain: "Green on Ground",
    cellars_area: "Cellars",
    apartment_count: "Est. Apartment Count",
    roads_area: "Public Roads Area",
    public_green_area: "Public / Common Green",
    green_area: "Total Green (site-wide)",
    development_area: "Development Area (parcels)",
    number_of_parcels: "Number of Parcels",
    avg_parcel_size: "Average Parcel Size",
    footprint_per_house: "Max Footprint per House",
    hpp_per_house: "HPP per House",
    total_hpp: "Total HPP (gross)",
    effective_total_hpp: "Effective HPP (after risk buffer)",
    total_built_footprint: "Total Built Footprint",
    total_paved_area: "Total Paved Area",
    total_parking: "Total Parking Spaces",
    parcel_breakdown: "Parcel Breakdown",
    pb_parcel_summary: "Parcel Summary",
    pb_typical_parcel: "Typical Parcel",
    pb_avg_parcel_size: "Average Parcel Size",
    pb_building_footprint_parcel: "Building Footprint",
    pb_paved_parcel: "Paved Area",
    pb_green_parcel: "Green Area",
    pb_parcel_total: "Total",
    pb_green_compliance: "Green Requirement Compliance",
    pb_required_green: "Required green (whole site)",
    pb_parcel_green_total: "Green on parcels",
    pb_public_green: "Public / common green",
    pb_green_total: "Total green",
    land_balance: "Land Balance",
    lb_building_footprint: "Building Footprint",
    lb_roads: "Roads / Infrastructure",
    lb_paved: "Paved Areas",
    lb_green: "Green on Ground",
    lb_total: "Total",
    warnings_title: "Validations",
    methodology_title: "Calculation Methodology",
    m2: "m²",
    pcs: "pcs",
    tooltips: [
      { label: "Total Land Area", desc: "Total area of the assessed land parcel (input)." },
      { label: "Built-up Area (Footprint)", desc: "Max footprint = land area × IZ (site coverage coefficient). Derived from regulatory input." },
      { label: "GFA Above Ground", desc: "Gross Floor Area above ground = land area × KPP (floor area ratio). If KPP is not set, calculated as footprint × floors." },
      { label: "Effective GFA Above (after risk buffer)", desc: "GFA above ground reduced by the Urban Risk Buffer to account for regulatory restrictions and design constraints." },
      { label: "GFA Below Ground", desc: "Gross Floor Area below ground = covered parking × 25 m² + cellars (3 m²/apt) + technical rooms (5% of parking) + service circulation (20% of parking)." },
      { label: "NFA Above Ground", desc: "Net Floor Area above ground = GFA above × efficiency factor (conservative 75%, realistic 80%, optimistic 85%)." },
      { label: "NFA Below Ground", desc: "Net Floor Area below ground = GFA below × 85%." },
      { label: "Apartments Area", desc: "Residential net floor area = NFA above × (1 − non-residential % − 10% common areas)." },
      { label: "Non-Residential Area", desc: "Non-residential net floor area = NFA above × non-residential %." },
      { label: "Balconies", desc: "Estimated balcony area = apartments area × 10%. Not counted in land balance." },
      { label: "Covered Parking", desc: "Underground/covered spaces = apartment count × covered parking ratio." },
      { label: "Outdoor Parking", desc: "Surface spaces = apartment count × outdoor parking ratio. Included in paved area balance." },
      { label: "Paved Areas", desc: "Total paved on ground = base paved % of land + surface parking. Included in land balance." },
      { label: "Green on Ground", desc: "Residual green = land area − footprint − paved area. Must meet the regulatory minimum green %." },
      { label: "Cellars", desc: "Estimated cellar/storage area = apartment count × 3 m². Part of the underground floor area." },
      { label: "Est. Apartment Count", desc: "Estimated apartments = apartments area ÷ average apartment size (input)." },
    ],
  },
  sk: {
    concept: "Analýza uskutočniteľnosti – Koncept",
    generated: "Vygenerované",
    mode_block: "Bytová výstavba",
    mode_sub: "Parcelácia",
    disclaimer: "Predbežný odhad – bez architektonickej štúdie",
    land_area: "Výmera pozemku",
    built_area: "Zastavaná plocha",
    hpp_above: "HPP nadzemné",
    hpp_below: "HPP podzemné",
    npp_above: "ČPP nadzemné",
    npp_below: "ČPP podzemné",
    apartments_area: "Plocha bytov",
    non_residential_area: "Nebytové priestory",
    balconies_area: "Balkóny",
    parking_covered: "Kryté parkovanie (miesta)",
    parking_outdoor: "Vonkajšie parkovanie (miesta)",
    paved_area: "Spevnené plochy",
    green_terrain: "Zeleň na teréne",
    cellars_area: "Pivnice / kobky",
    apartment_count: "Odhadovaný počet bytov",
    roads_area: "Verejné komunikácie",
    public_green_area: "Verejná / spoločná zeleň",
    green_area: "Zeleň celkom (celý pozemok)",
    development_area: "Rozvojová plocha (parcely)",
    number_of_parcels: "Počet parciel",
    avg_parcel_size: "Priemerná výmera parcely",
    footprint_per_house: "Max. zastavaná plocha / dom",
    hpp_per_house: "HPP / dom",
    total_hpp: "Celkové HPP (hrubé)",
    effective_total_hpp: "Efektívne HPP (po risk bufferi)",
    total_built_footprint: "Celková zastavaná plocha",
    total_paved_area: "Spevnené plochy celkom",
    total_parking: "Celkové parkovacie miesta",
    parcel_breakdown: "Parcelový prehľad",
    pb_parcel_summary: "Súhrn parcelácie",
    pb_typical_parcel: "Typická parcela",
    pb_avg_parcel_size: "Priemerná veľkosť parcely",
    pb_building_footprint_parcel: "Zastavaná plocha domu",
    pb_paved_parcel: "Spevnené plochy",
    pb_green_parcel: "Zeleň parcely",
    pb_parcel_total: "Celkom",
    pb_green_compliance: "Plnenie požiadavky na zeleň",
    pb_required_green: "Požadovaná zeleň (celý pozemok)",
    pb_parcel_green_total: "Zeleň na parcelách",
    pb_public_green: "Verejná / spoločná zeleň",
    pb_green_total: "Zeleň celkom",
    land_balance: "Bilancia pozemku",
    lb_building_footprint: "Zastavaná plocha",
    lb_roads: "Komunikácie / infraštruktúra",
    lb_paved: "Spevnené plochy",
    lb_green: "Zeleň na teréne",
    lb_total: "Celkom",
    warnings_title: "Upozornenia / Chyby",
    methodology_title: "Metodika výpočtu",
    m2: "m²",
    pcs: "ks",
    tooltips: [
      { label: "Výmera pozemku", desc: "Celková výmera posudzovaného pozemku (vstup)." },
      { label: "Zastavaná plocha", desc: "Max. zastavaná plocha = výmera pozemku × IZ (koeficient zastavania). Odvodzuje sa z regulatívnych vstupov." },
      { label: "HPP nadzemné", desc: "Hrubá podlahová plocha nadzemných podlaží = výmera × KPP. Ak nie je KPP zadané, počíta sa ako zastavaná plocha × počet podlaží." },
      { label: "Efektívne HPP nadzemné (po risk bufferi)", desc: "HPP nadzemné znížené o Urban Risk Buffer – zohľadňuje regulatívne obmedzenia a projektové riziká." },
      { label: "HPP podzemné", desc: "HPP podzemné = kryté parkovacie miesta × 25 m² + kobky (3 m²/byt) + technické priestory (5 % z parkovacej plochy) + obslužné komunikácie (20 % z parkovacej plochy)." },
      { label: "ČPP nadzemné", desc: "Čistá podlahová plocha nadzemných podlaží = HPP nadzemné × koeficient efektívnosti (konzervatívny 75 %, realistický 80 %, optimistický 85 %)." },
      { label: "ČPP podzemné", desc: "Čistá podlahová plocha podzemných podlaží = HPP podzemné × 85 %." },
      { label: "Plocha bytov", desc: "Čistá plocha bytov = ČPP nadzemné × (1 − % nebytových priestorov − 10 % spoločné priestory)." },
      { label: "Nebytové priestory", desc: "Čistá plocha nebytových priestorov = ČPP nadzemné × % nebytových priestorov." },
      { label: "Balkóny", desc: "Odhad plochy balkónov = plocha bytov × 10 %. Nezapočítava sa do bilancie pozemku." },
      { label: "Kryté parkovanie (miesta)", desc: "Kryté / podzemné parkovacie miesta = počet bytov × koeficient kryté parkovanie." },
      { label: "Vonkajšie parkovanie (miesta)", desc: "Vonkajšie parkovacie miesta = počet bytov × koeficient vonkajšie parkovanie. Zarátava sa do bilancie pozemku." },
      { label: "Spevnené plochy", desc: "Celková spevnená plocha na teréne = základné % spevnených plôch + plocha vonkajšieho parkovania. Zarátava sa do bilancie pozemku." },
      { label: "Zeleň na teréne", desc: "Zbytková zeleň = výmera pozemku − zastavaná plocha − spevnené plochy. Musí spĺňať regulatívne minimum zelene." },
      { label: "Pivnice / kobky", desc: "Odhadovaná plocha kobiek/pivníc = počet bytov × 3 m². Súčasť HPP podzemného podlažia." },
      { label: "Odhadovaný počet bytov", desc: "Počet bytov = plocha bytov ÷ priemerná veľkosť bytu (vstup)." },
    ],
  },
  pl: {
    concept: "Analiza wykonalności – Koncepcja",
    generated: "Wygenerowano",
    mode_block: "Zabudowa mieszkaniowa",
    mode_sub: "Parcelacja",
    disclaimer: "Szacunek na poziomie koncepcji – bez projektu architektonicznego",
    land_area: "Powierzchnia terenu",
    built_area: "Powierzchnia zabudowy",
    hpp_above: "PUB nadziemna",
    hpp_below: "PUB podziemna",
    npp_above: "PUB netto nadziemna",
    npp_below: "PUB netto podziemna",
    apartments_area: "Powierzchnia mieszkań",
    non_residential_area: "Powierzchnia usługowa",
    balconies_area: "Balkony",
    parking_covered: "Miejsca parkingowe kryte",
    parking_outdoor: "Miejsca parkingowe zewnętrzne",
    paved_area: "Nawierzchnie utwardzone",
    green_terrain: "Zieleń na gruncie",
    cellars_area: "Piwnice / komórki",
    apartment_count: "Szac. liczba mieszkań",
    roads_area: "Drogi publiczne",
    public_green_area: "Zieleń publiczna / wspólna",
    green_area: "Zieleń łącznie",
    development_area: "Powierzchnia zabudowy (działki)",
    number_of_parcels: "Liczba działek",
    avg_parcel_size: "Średnia wielkość działki",
    footprint_per_house: "Maks. pow. zabudowy / dom",
    hpp_per_house: "PUB / dom",
    total_hpp: "Całkowita PUB (brutto)",
    effective_total_hpp: "Efektywna PUB (po buforze ryzyka)",
    total_built_footprint: "Łączna pow. zabudowy",
    total_paved_area: "Nawierzchnie utwardzone łącznie",
    total_parking: "Łączna liczba miejsc parkingowych",
    parcel_breakdown: "Podział działek",
    pb_parcel_summary: "Podsumowanie parcelacji",
    pb_typical_parcel: "Typowa działka",
    pb_avg_parcel_size: "Średnia wielkość działki",
    pb_building_footprint_parcel: "Pow. zabudowy domu",
    pb_paved_parcel: "Nawierzchnie utwardzone",
    pb_green_parcel: "Zieleń działki",
    pb_parcel_total: "Łącznie",
    pb_green_compliance: "Spełnienie wymogu zieleni",
    pb_required_green: "Wymagana zieleń (cały teren)",
    pb_parcel_green_total: "Zieleń na działkach",
    pb_public_green: "Zieleń publiczna / wspólna",
    pb_green_total: "Zieleń łącznie",
    land_balance: "Bilans terenu",
    lb_building_footprint: "Powierzchnia zabudowy",
    lb_roads: "Drogi / infrastruktura",
    lb_paved: "Nawierzchnie utwardzone",
    lb_green: "Zieleń na gruncie",
    lb_total: "Łącznie",
    warnings_title: "Ostrzeżenia / Błędy",
    methodology_title: "Metodologia obliczeń",
    m2: "m²",
    pcs: "szt.",
    tooltips: [
      { label: "Powierzchnia terenu", desc: "Całkowita powierzchnia ocenianej działki (dane wejściowe)." },
      { label: "Powierzchnia zabudowy", desc: "Maks. powierzchnia zabudowy = powierzchnia × WZ (wskaźnik zabudowy). Wynika z danych regulacyjnych." },
      { label: "PUB nadziemna", desc: "Powierzchnia użytkowa brutto nadziemna = powierzchnia × WIP (wskaźnik intensywności). Jeśli brak WIP, obliczana jako zabudowa × liczba kondygnacji." },
      { label: "Efektywna PUB nadziemna (po buforze ryzyka)", desc: "PUB nadziemna pomniejszona o bufor ryzyka – uwzględnia ograniczenia regulacyjne i ryzyka projektowe." },
      { label: "PUB podziemna", desc: "PUB podziemna = miejsca parkingowe × 25 m² + komórki (3 m²/mieszkanie) + pomieszczenia techniczne (5% powierzchni parkingowej) + drogi serwisowe (20% powierzchni parkingowej)." },
      { label: "PUB netto nadziemna", desc: "PUB netto nadziemna = PUB × współczynnik efektywności (konserwatywny 75%, realistyczny 80%, optymistyczny 85%)." },
      { label: "PUB netto podziemna", desc: "PUB netto podziemna = PUB podziemna × 85%." },
      { label: "Powierzchnia mieszkań", desc: "PUB netto mieszkań = PUB netto × (1 − % usługowy − 10% części wspólnych)." },
      { label: "Powierzchnia usługowa", desc: "PUB netto usługowa = PUB netto × % usługowy." },
      { label: "Balkony", desc: "Szacowana powierzchnia balkonów = pow. mieszkań × 10%. Nie wliczana do bilansu terenu." },
      { label: "Miejsca parkingowe kryte", desc: "Podziemne/kryte miejsca = liczba mieszkań × wskaźnik parkingowy." },
      { label: "Miejsca parkingowe zewnętrzne", desc: "Zewnętrzne miejsca = liczba mieszkań × wskaźnik zewnętrzny. Wliczane do bilansu terenu." },
      { label: "Nawierzchnie utwardzone", desc: "Łączna pow. utwardzona = bazowe % + parking zewnętrzny. Wliczane do bilansu terenu." },
      { label: "Zieleń na gruncie", desc: "Pozostała zieleń = powierzchnia − zabudowa − nawierzchnie utwardzone. Musi spełniać minimalne wymagania." },
      { label: "Piwnice / komórki", desc: "Szacowana pow. piwnic = liczba mieszkań × 3 m². Część PUB podziemnej." },
      { label: "Szac. liczba mieszkań", desc: "Liczba mieszkań = pow. mieszkań ÷ średnia wielkość mieszkania (wejście)." },
    ],
  },
  hu: {
    concept: "Telekalkalmassági elemzés – Koncepció",
    generated: "Generálva",
    mode_block: "Lakóépület fejlesztés",
    mode_sub: "Telekfelosztás",
    disclaimer: "Koncepció szintű becslés – építészeti terv nélkül",
    land_area: "Telek területe",
    built_area: "Beépített terület",
    hpp_above: "Bruttó alapterület (felszín felett)",
    hpp_below: "Bruttó alapterület (felszín alatt)",
    npp_above: "Nettó alapterület (felszín felett)",
    npp_below: "Nettó alapterület (felszín alatt)",
    apartments_area: "Lakások területe",
    non_residential_area: "Nem lakás célú helyiségek",
    balconies_area: "Erkélyek",
    parking_covered: "Fedett parkolóhelyek",
    parking_outdoor: "Külső parkolóhelyek",
    paved_area: "Burkolt felületek",
    green_terrain: "Zöldfelület talajon",
    cellars_area: "Pincék / tárolók",
    apartment_count: "Becsült lakásszám",
    roads_area: "Közutak területe",
    public_green_area: "Közösségi zöldfelület",
    green_area: "Összes zöldfelület",
    development_area: "Fejlesztési terület (telkek)",
    number_of_parcels: "Telkek száma",
    avg_parcel_size: "Átlagos telekméret",
    footprint_per_house: "Max. beépített terület / ház",
    hpp_per_house: "Bruttó alapterület / ház",
    total_hpp: "Összes bruttó alapterület",
    effective_total_hpp: "Effektív bruttó alapterület (kockázati puffer után)",
    total_built_footprint: "Összes beépített terület",
    total_paved_area: "Összes burkolt felület",
    total_parking: "Összes parkolóhely",
    parcel_breakdown: "Telekfelosztás részletei",
    pb_parcel_summary: "Felosztás összefoglalója",
    pb_typical_parcel: "Tipikus telek",
    pb_avg_parcel_size: "Átlagos telekméret",
    pb_building_footprint_parcel: "Ház beépített területe",
    pb_paved_parcel: "Burkolt felületek",
    pb_green_parcel: "Zöldfelület",
    pb_parcel_total: "Összesen",
    pb_green_compliance: "Zöldfelület-követelmény teljesítése",
    pb_required_green: "Szükséges zöldfelület (teljes telek)",
    pb_parcel_green_total: "Zöldfelület a telkeken",
    pb_public_green: "Közösségi zöldfelület",
    pb_green_total: "Összes zöldfelület",
    land_balance: "Telek mérleg",
    lb_building_footprint: "Beépített terület",
    lb_roads: "Utak / infrastruktúra",
    lb_paved: "Burkolt felületek",
    lb_green: "Zöldfelület talajon",
    lb_total: "Összesen",
    warnings_title: "Figyelmeztetések / Hibák",
    methodology_title: "Számítási módszertan",
    m2: "m²",
    pcs: "db",
    tooltips: [
      { label: "Telek területe", desc: "Az értékelt telek teljes területe (bemeneti adat)." },
      { label: "Beépített terület", desc: "Max. beépített terület = telek × BT (beépítési tényező). Szabályozási adatokból számítva." },
      { label: "Bruttó alapterület (felszín felett)", desc: "Bruttó alapterület = telek × IT (intenzitási tényező). Ha nincs IT, beépített terület × szintszám." },
      { label: "Effektív bruttó alapterület (kockázati puffer után)", desc: "Bruttó alapterület csökkentve a kockázati pufferrel – szabályozási korlátok és tervezési kockázatok figyelembevételével." },
      { label: "Bruttó alapterület (felszín alatt)", desc: "Földalatti alapterület = parkolóhelyek × 25 m² + tárolók (3 m²/lakás) + gépészeti helyiségek (5%) + szervizközlekedés (20%)." },
      { label: "Nettó alapterület (felszín felett)", desc: "Nettó alapterület = bruttó × hatékonysági tényező (konzervatív 75%, realista 80%, optimista 85%)." },
      { label: "Nettó alapterület (felszín alatt)", desc: "Nettó alapterület = földalatti bruttó × 85%." },
      { label: "Lakások területe", desc: "Lakások nettó területe = nettó alapterület × (1 − nem lakás % − 10% közösségi)." },
      { label: "Nem lakás célú helyiségek", desc: "Nem lakáscélú nettó területe = nettó alapterület × nem lakás %." },
      { label: "Erkélyek", desc: "Becsült erkélyterület = lakások területe × 10%. Nem számít bele a telekmérlegbe." },
      { label: "Fedett parkolóhelyek", desc: "Földalatti/fedett helyek = lakásszám × fedett parkolási arány." },
      { label: "Külső parkolóhelyek", desc: "Külső helyek = lakásszám × külső parkolási arány. Beletartozik a telekmérlegbe." },
      { label: "Burkolt felületek", desc: "Összes burkolt felület = alap % + külső parkoló. Beletartozik a telekmérlegbe." },
      { label: "Zöldfelület talajon", desc: "Maradék zöldfelület = telek − beépítés − burkolt. Teljesítenie kell a minimális zöldfelületi követelményt." },
      { label: "Pincék / tárolók", desc: "Becsült tárolóterület = lakásszám × 3 m². A földalatti alapterület része." },
      { label: "Becsült lakásszám", desc: "Lakásszám = lakások területe ÷ átlagos lakásméret (bemenet)." },
    ],
  },
  de: {
    concept: "Grundstücks-Machbarkeitsstudie – Konzept",
    generated: "Erstellt am",
    mode_block: "Wohnbebauung",
    mode_sub: "Parzellierung",
    disclaimer: "Konzeptschätzung – ohne Architektenplanung",
    land_area: "Grundstücksfläche",
    built_area: "Bebauungsfläche",
    hpp_above: "BGF oberirdisch",
    hpp_below: "BGF unterirdisch",
    npp_above: "NF oberirdisch",
    npp_below: "NF unterirdisch",
    apartments_area: "Wohnfläche",
    non_residential_area: "Gewerbefläche",
    balconies_area: "Balkone",
    parking_covered: "Überdachte Stellplätze",
    parking_outdoor: "Außenstellplätze",
    paved_area: "Versiegelte Flächen",
    green_terrain: "Grünfläche auf Terrain",
    cellars_area: "Keller / Abstellräume",
    apartment_count: "Gesch. Wohnungsanzahl",
    roads_area: "Öffentliche Wege",
    public_green_area: "Öffentliche / Gemeinschaftsgrünfläche",
    green_area: "Grünfläche gesamt",
    development_area: "Entwicklungsfläche (Parzellen)",
    number_of_parcels: "Anzahl Parzellen",
    avg_parcel_size: "Durchschn. Parzellengrö­ße",
    footprint_per_house: "Max. Bebauungsfläche / Haus",
    hpp_per_house: "BGF / Haus",
    total_hpp: "Gesamt-BGF (brutto)",
    effective_total_hpp: "Effektive BGF (nach Risikopuffer)",
    total_built_footprint: "Gesamte Bebauungsfläche",
    total_paved_area: "Versiegelte Flächen gesamt",
    total_parking: "Stellplätze gesamt",
    parcel_breakdown: "Parzellenaufschlüsselung",
    pb_parcel_summary: "Parzellierungsübersicht",
    pb_typical_parcel: "Typische Parzelle",
    pb_avg_parcel_size: "Durchschn. Parzellengrö­ße",
    pb_building_footprint_parcel: "Bebauungsfläche Haus",
    pb_paved_parcel: "Versiegelte Flächen",
    pb_green_parcel: "Grünfläche",
    pb_parcel_total: "Gesamt",
    pb_green_compliance: "Einhaltung der Grünflächenanforderung",
    pb_required_green: "Erforderliche Grünfläche (gesamt)",
    pb_parcel_green_total: "Grünfläche auf Parzellen",
    pb_public_green: "Öffentliche / Gemeinschaftsgrünfläche",
    pb_green_total: "Grünfläche gesamt",
    land_balance: "Grundstücksbilanz",
    lb_building_footprint: "Bebauungsfläche",
    lb_roads: "Wege / Infrastruktur",
    lb_paved: "Versiegelte Flächen",
    lb_green: "Grünfläche auf Terrain",
    lb_total: "Gesamt",
    warnings_title: "Warnungen / Fehler",
    methodology_title: "Berechnungsmethodik",
    m2: "m²",
    pcs: "Stk.",
    tooltips: [
      { label: "Grundstücksfläche", desc: "Gesamtfläche des zu bewertenden Grundstücks (Eingabe)." },
      { label: "Bebauungsfläche", desc: "Max. Bebauungsfläche = Grundstück × GRZ (Grundflächenzahl). Aus regulatorischen Eingaben abgeleitet." },
      { label: "BGF oberirdisch", desc: "Brutto-Geschossfläche oberirdisch = Grundstück × GFZ. Ohne GFZ: Bebauungsfläche × Geschossanzahl." },
      { label: "Effektive BGF oberirdisch (nach Risikopuffer)", desc: "BGF oberirdisch reduziert um den Risikopuffer – berücksichtigt regulatorische Einschränkungen und Planungsrisiken." },
      { label: "BGF unterirdisch", desc: "Untergeschoss-BGF = Stellplätze × 25 m² + Keller (3 m²/Whg) + Technikräume (5%) + Fahrwege (20%)." },
      { label: "NF oberirdisch", desc: "Nettofläche oberirdisch = BGF × Effizienzfaktor (konservativ 75%, realistisch 80%, optimistisch 85%)." },
      { label: "NF unterirdisch", desc: "Nettofläche unterirdisch = BGF unterirdisch × 85%." },
      { label: "Wohnfläche", desc: "Wohn-Nettofläche = NF × (1 − Gewerbe% − 10% Gemeinschaftsflächen)." },
      { label: "Gewerbefläche", desc: "Gewerbe-Nettofläche = NF × Gewerbe%." },
      { label: "Balkone", desc: "Geschätzte Balkonfläche = Wohnfläche × 10%. Nicht in der Grundstücksbilanz." },
      { label: "Überdachte Stellplätze", desc: "Unterirdische/überdachte Plätze = Wohnungsanzahl × Tiefgaragen-Quote." },
      { label: "Außenstellplätze", desc: "Außenstellplätze = Wohnungsanzahl × Außen-Quote. In der Grundstücksbilanz enthalten." },
      { label: "Versiegelte Flächen", desc: "Versiegelte Fläche = Basis-% + Außenparkplätze. In der Grundstücksbilanz enthalten." },
      { label: "Grünfläche auf Terrain", desc: "Restliche Grünfläche = Grundstück − Bebauung − versiegelt. Muss Mindestgrünanteil erfüllen." },
      { label: "Keller / Abstellräume", desc: "Geschätzte Kellerfläche = Wohnungsanzahl × 3 m². Teil der Untergeschoss-BGF." },
      { label: "Gesch. Wohnungsanzahl", desc: "Wohnungsanzahl = Wohnfläche ÷ Durchschnittswohnungsgröße (Eingabe)." },
    ],
  },
};

const WARNING_TEXTS = {
  en: {
    cpp_exceeds_hpp: "NFA exceeds GFA – check KPP/floors input.",
    green_below_minimum: "Green on ground is below minimum requirement.",
    parking_insufficient: "Parking places are insufficient for apartment count.",
    roads_green_too_high: "Internal roads + public green exceed 60% of land area.",
    coverage_too_high: "Max plot coverage exceeds 50% – check local regulations.",
    parcel_too_small: "Min. parcel size is below 250 m².",
    no_parcels: "Parcel size or land area too small – no buildable parcels.",
    kpp_floors_mismatch: "KPP vs Floors mismatch >25% – check regulatory inputs.",
    apartments_area_clamped: "Apartments area became negative – clamped to 0.",
    coverage_capped_to_max: "Plot coverage was capped to 50% maximum.",
    effective_parcel_too_small: "Effective parcel size (after typology adjustment) is below 250 m².",
    land_balance_exceeded: (v) => `Land balance exceeded by ${v?.excess_m2 ?? '?'} m² (${v?.excess_pct ?? '?'}%). Reduce paved/roads or building footprint.`,
    land_unallocated: "Unallocated land area detected.",
  },
  sk: {
    cpp_exceeds_hpp: "ČPP presahuje HPP – skontrolujte KPP alebo počet podlaží.",
    green_below_minimum: "Zeleň na teréne je nižšia ako regulatívne minimum.",
    parking_insufficient: "Počet parkovacích miest je nedostatočný.",
    roads_green_too_high: "Komunikácie + zeleň presahujú 60 % plochy pozemku.",
    coverage_too_high: "Max. zastavanosť parcely presahuje 50 %.",
    parcel_too_small: "Min. výmera parcely je pod 250 m².",
    no_parcels: "Výmera parcely alebo pozemku príliš malá – žiadne stavebné parcely.",
    kpp_floors_mismatch: "Nesúlad KPP vs. podlažnosť >25 %.",
    apartments_area_clamped: "Plocha bytov vyšla záporná – zaokrúhlená na 0.",
    coverage_capped_to_max: "Zastavanosť parcely bola zastropovaná na max. 50 %.",
    effective_parcel_too_small: "Efektívna výmera parcely (po úprave typológiou) je pod 250 m².",
    land_balance_exceeded: (v) => `Bilancia pozemku je prekročená o ${v?.excess_m2 ?? '?'} m² (${v?.excess_pct ?? '?'}%). Znížte spevnené plochy / komunikácie alebo zastavanú plochu.`,
    land_unallocated: "Nealokovaná plocha – celková alokácia je menšia ako výmera pozemku.",
  },
};

function buildRows(results, t, isSubdivision) {
  if (isSubdivision) {
    return [
      { label: t.land_area, value: fmt(results.land_area), unit: t.m2, bold: true },
      { label: t.roads_area, value: fmt(results.roads_area), unit: t.m2 },
      { label: t.public_green_area, value: fmt(results.public_green_area), unit: t.m2 },
      { label: t.development_area, value: fmt(results.development_area), unit: t.m2, bold: true },
      { label: t.number_of_parcels, value: fmt(results.number_of_parcels), unit: t.pcs, bold: true },
      { label: t.avg_parcel_size, value: fmt(results.avg_parcel_size), unit: t.m2 },
      { label: t.footprint_per_house, value: fmt(results.footprint_per_house), unit: t.m2 },
      { label: t.hpp_per_house, value: fmt(results.hpp_per_house), unit: t.m2 },
      { label: t.total_hpp, value: fmt(results.total_hpp), unit: t.m2 },
      { label: t.effective_total_hpp, value: fmt(results.effective_total_hpp), unit: t.m2, bold: true },
      { label: t.total_built_footprint, value: fmt(results.total_built_footprint), unit: t.m2 },
      { label: t.total_paved_area, value: fmt(results.total_paved_area), unit: t.m2 },
      { label: t.green_area, value: fmt(results.green_area), unit: t.m2 },
      { label: t.total_parking, value: fmt(results.total_parking), unit: t.pcs },
    ];
  }
  return [
    { label: t.land_area, value: fmt(results.land_area), unit: t.m2, bold: true },
    { label: t.built_area, value: fmt(results.built_area), unit: t.m2, bold: true },
    { label: t.hpp_above, value: fmt(results.hpp_above), unit: t.m2 },
    { label: t.hpp_below, value: fmt(results.hpp_below), unit: t.m2 },
    { label: t.npp_above, value: fmt(results.npp_above), unit: t.m2, bold: true },
    { label: t.npp_below, value: fmt(results.npp_below), unit: t.m2 },
    { label: t.apartments_area, value: fmt(results.apartments_area), unit: t.m2, bold: true },
    { label: t.non_residential_area, value: fmt(results.non_residential_area), unit: t.m2 },
    { label: t.balconies_area, value: fmt(results.balconies_area), unit: t.m2 },
    { label: t.parking_covered, value: fmt(results.parking_covered), unit: t.pcs, bold: true },
    { label: t.parking_outdoor, value: fmt(results.parking_outdoor), unit: t.pcs },
    { label: t.paved_area, value: fmt(results.paved_area), unit: t.m2 },
    { label: t.green_terrain, value: fmt(results.green_terrain), unit: t.m2, bold: true },
    { label: t.cellars_area, value: fmt(results.cellars_area), unit: t.m2 },
    { label: t.apartment_count, value: fmt(results.apartment_count), unit: t.pcs, bold: true },
  ];
}

function buildBalanceRows(b, t) {
  return [
    { label: t.land_area, value: fmt(b.land_area), unit: t.m2, bold: true },
    { label: t.lb_building_footprint, value: fmt(b.building_footprint), unit: t.m2 },
    { label: t.lb_roads, value: fmt(b.roads_area), unit: t.m2 },
    { label: t.lb_paved, value: fmt(b.paved_area), unit: t.m2 },
    { label: t.lb_green, value: fmt(b.green_area), unit: t.m2 },
    { label: t.lb_total, value: fmt(b.total), unit: t.m2, bold: true },
  ];
}

const ROW_STYLE = (bold) => `
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:5px 0;
  border-bottom:1px solid #e5e7eb;
  font-weight:${bold ? '600' : '400'};
`;

function buildParcelBreakdownHTML(pb, t) {
  if (!pb || pb.number_of_parcels < 1) return '';
  const greenOk = pb.green_pct_achieved >= pb.green_pct_required - 0.001;
  const greenPctAchieved = Math.round((pb.green_pct_achieved ?? 0) * 100);
  const greenPctRequired = Math.round((pb.green_pct_required ?? 0) * 100);

  const ROW = (label, value, unit, bold = false) => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:4px 0;border-bottom:1px solid #e5e7eb;font-weight:${bold ? '600' : '400'};">
      <span style="font-size:11px;color:#4b5563;">${label}</span>
      <span style="font-size:11px;color:#111827;font-weight:${bold ? '700' : '500'};">${value} <span style="font-size:9px;color:#9ca3af;">${unit}</span></span>
    </div>`;

  const sectionTitle = (title) => `<h2 style="font-size:13px;font-weight:700;color:#1f2937;border-bottom:2px solid #1f2937;padding-bottom:4px;margin:0 0 10px 0;">${title}</h2>`;
  const subTitle = (title) => `<p style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;margin:10px 0 4px;">${title}</p>`;

  const greenBg = greenOk ? '#f0fdf4' : '#fffbeb';
  const greenBorder = greenOk ? '#86efac' : '#fcd34d';
  const greenColor = greenOk ? '#15803d' : '#92400e';

  return `
    <div style="margin-bottom:24px;">
      ${sectionTitle(t.parcel_breakdown)}
      ${subTitle(t.pb_parcel_summary)}
      ${ROW(t.development_area, fmt(pb.development_area), 'm²', true)}
      ${ROW(t.number_of_parcels, fmt(pb.number_of_parcels), t.pcs, true)}
      ${ROW(t.pb_avg_parcel_size, fmt(pb.avg_parcel_size), 'm²')}

      ${subTitle(t.pb_typical_parcel)}
      <div style="border:1px solid #d1fae5;border-radius:6px;overflow:hidden;background:#f0fdf4;padding:4px 10px;">
        ${ROW(t.pb_avg_parcel_size, fmt(pb.avg_parcel_size), 'm²', true)}
        ${ROW(t.pb_building_footprint_parcel, fmt(pb.parcel_building_footprint), 'm²')}
        ${ROW(t.pb_paved_parcel, fmt(pb.parcel_paved_area), 'm²')}
        ${ROW(t.pb_green_parcel, fmt(pb.parcel_green_area), 'm²')}
        ${ROW(t.pb_parcel_total, fmt(pb.parcel_total), 'm²', true)}
      </div>

      ${subTitle(t.pb_green_compliance)}
      <div style="border:1px solid ${greenBorder};border-radius:6px;padding:8px 10px;background:${greenBg};">
        ${ROW(t.pb_required_green, `${fmt(pb.required_green_total)} (${greenPctRequired}%)`, 'm²')}
        ${ROW(`${t.pb_parcel_green_total} (${pb.number_of_parcels}×)`, fmt(pb.total_parcel_green), 'm²')}
        ${ROW(t.pb_public_green, fmt(pb.public_green_area), 'm²')}
        <div style="display:flex;justify-content:space-between;align-items:center;padding:4px 0;border-top:1px solid ${greenBorder};margin-top:4px;">
          <span style="font-size:11px;font-weight:700;color:#1f2937;">${t.pb_green_total}</span>
          <span style="font-size:11px;font-weight:700;color:${greenColor};">${fmt((pb.total_parcel_green ?? 0) + (pb.public_green_area ?? 0))} m² (${greenPctAchieved}%) ${greenOk ? '✓' : '⚠'}</span>
        </div>
      </div>
    </div>`;
}

function createReportHTML(conceptName, results, language, t, wt) {
  const isSubdivision = results?.mode === 'subdivision';
  const rows = buildRows(results, t, isSubdivision);
  const balanceRows = results.land_balance ? buildBalanceRows(results.land_balance, t) : [];
  const validations = results.validations || [];

  const renderRows = (arr) => arr.map(r => `
    <div style="${ROW_STYLE(r.bold)}">
      <span style="font-size:12px;color:#4b5563;">${r.label}</span>
      <span style="font-size:12px;color:#111827;font-weight:${r.bold ? '700' : '500'};">${r.value} <span style="font-size:10px;color:#9ca3af;">${r.unit}</span></span>
    </div>
  `).join('');

  const sectionTitle = (title) => `
    <h2 style="font-size:14px;font-weight:700;color:#1f2937;border-bottom:2px solid #1f2937;padding-bottom:4px;margin:0 0 10px 0;">${title}</h2>
  `;

  const validationHTML = validations.length > 0 ? `
    <div style="margin-bottom:20px;">
      ${sectionTitle(t.warnings_title)}
      ${validations.map(v => {
        const msg = wt[v.key];
        const text = typeof msg === 'function' ? msg(v) : (msg || v.key);
        const isError = v.type === 'error';
        return `<div style="padding:7px 10px;font-size:11px;background:${isError ? '#FEF2F2' : '#FFFBEB'};color:${isError ? '#B91C1C' : '#92400E'};border-left:3px solid ${isError ? '#EF4444' : '#F59E0B'};margin-bottom:5px;border-radius:2px;">${text}</div>`;
      }).join('')}
    </div>
  ` : '';

  const dateStr = new Date().toLocaleDateString('sk-SK');

  return `
    <div style="
      font-family:'Segoe UI',Arial,sans-serif;
      width:740px;
      background:#ffffff;
      padding:32px 32px 24px;
      box-sizing:border-box;
      color:#1f2937;
    ">
      <!-- Header: logo + title + date -->
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;text-align:center;">
        <div style="display:flex;flex-direction:column;align-items:flex-start;gap:10px;">
          ${LOGO_HTML}
          <div>
            <div style="font-size:18px;font-weight:700;color:#1f2937;margin-bottom:2px;">${conceptName || '—'}</div>
            <div style="font-size:11px;color:#6b7280;">${isSubdivision ? t.mode_sub : t.mode_block} &nbsp;|&nbsp; ${t.disclaimer}</div>
          </div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:11px;color:#6b7280;">${t.generated}</div>
          <div style="font-size:12px;color:#374151;font-weight:600;">${dateStr}</div>
        </div>
      </div>

      <!-- Main results section -->
      <div style="margin-bottom:24px;">
        ${sectionTitle(isSubdivision ? t.mode_sub : t.mode_block)}
        ${renderRows(rows)}
      </div>

      <!-- Parcel breakdown section (subdivision only) -->
      ${isSubdivision && results.parcel_breakdown ? buildParcelBreakdownHTML(results.parcel_breakdown, t) : ''}

      <!-- Land balance section -->
      ${balanceRows.length > 0 ? `
      <div style="margin-bottom:24px;">
        ${sectionTitle(t.land_balance)}
        ${renderRows(balanceRows)}
      </div>
      ` : ''}

      ${validationHTML}

      <!-- Footer -->
      <div style="margin-top:20px;padding-top:10px;border-top:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:center;">
        <div style="font-size:9px;color:#9ca3af;">Estivo.app – Smarter Property Investing.</div>
        <div style="font-size:9px;color:#9ca3af;">© ${new Date().getFullYear()} Estivo</div>
      </div>
    </div>
  `;
}

export async function exportConceptToPDF(conceptName, results, language = 'sk') {
  const t = LABELS[language] || LABELS.sk;
  const wt = WARNING_TEXTS[language] || WARNING_TEXTS.sk;

  const html = createReportHTML(conceptName, results, language, t, wt);

  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;left:-9999px;top:0;z-index:-1;';
  container.innerHTML = html;
  document.body.appendChild(container);

  await document.fonts.ready;

  const canvas = await html2canvas(container.firstElementChild, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
  });

  document.body.removeChild(container);

  const imgData = canvas.toDataURL('image/png');

  const pdfW = 210;
  const pdfH = (canvas.height / canvas.width) * pdfW;

  const doc = new jsPDF({
    format: [pdfW, pdfH],
    unit: 'mm',
    orientation: 'portrait',
  });

  doc.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH);

  const safeName = (conceptName || 'concept').replace(/[^a-z0-9_\-]/gi, '_').substring(0, 40);
  doc.save(`${safeName}_feasibility.pdf`);
}