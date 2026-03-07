import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import LandBalanceBlock from './LandBalanceBlock';

const translations = {
  en: {
    land_balance_title: "Land Balance",
    lb_land_area: "Land Area",
    lb_building_footprint: "Building Footprint",
    lb_roads: "Roads / Infrastructure",
    lb_paved: "Paved Areas",
    lb_green: "Green on Ground",
    lb_total: "Total",
    lb_ok: "Balance OK",
    lb_exceeded: "Balance EXCEEDED",
    lb_unallocated: "Unallocated land",
    lb_infra_note: "Roads and technical infrastructure are not assessed in detail within the Land Feasibility module. The tool is intended primarily for land capacity and site allocation assessment. Infrastructure costs, utility connections and related site works are evaluated in the Development Calculator. The actual scope of roads and infrastructure may affect the final project capacity.",
    title: "Feasibility Output",
    sub_title: "Subdivision Output",
    disclaimer: "Concept-level estimation – no architectural study",
    sub_disclaimer: "Concept-level land subdivision estimate",
    // Block mode
    land_area: "Total Land Area",
    built_area: "Built-up Area",
    hpp_above: "GFA Above Ground",
    hpp_below: "GFA Below Ground",
    npp_above: "NFA Above Ground",
    npp_below: "NFA Below Ground",
    apartments_area: "Apartments",
    non_residential_area: "Non-Residential",
    balconies_area: "Balconies",
    front_gardens_area: "Front Gardens",
    parking_covered: "Covered Parking",
    parking_outdoor: "Outdoor Parking",
    paved_area: "Paved Areas (incl. outdoor parking)",
    green_terrain: "Green on Ground",
    green_on_structure: "Green on Structure",
    cellars_area: "Cellars",
    apartment_count: "Est. Apartment Count",
    // Subdivision mode
    development_area: "Development Area (parcels)",
    roads_area: "Public Roads Area",
    public_green_area: "Public / Common Green",
    green_area: "Total Green (site-wide)",
    total_paved_area: "Total Paved Area (all parcels)",
    number_of_parcels: "Number of Parcels",
    avg_parcel_size: "Average Parcel Size",
    footprint_per_house: "Max Footprint per House",
    hpp_per_house: "HPP per House",
    total_hpp: "Total HPP (gross)",
    effective_total_hpp: "Effective HPP (after risk buffer)",
    total_built_footprint: "Total Built Footprint",
    total_parking: "Total Parking Spaces",
    // units
    m2: "m²",
    pcs: "pcs",
    effective_hpp_above: "Effective GFA Above (after risk buffer)",
    tooltips: {
      land_area: "Total area of the assessed land parcel (input).",
      built_area: "Maximum built-up footprint = land area × IZ (site coverage coefficient). Derived from regulatory input.",
      hpp_above: "Gross Floor Area above ground = land area × KPP (floor area ratio). If KPP is not set, calculated as footprint × number of floors.",
      effective_hpp_above: "GFA above ground reduced by the Urban Risk Buffer to account for building permits, regulatory reductions and design constraints.",
      hpp_below: "Gross Floor Area below ground. Calculated as: covered parking spaces × 25 m² + cellars (3 m²/apt) + technical rooms (5% of parking) + service circulation (20% of parking).",
      npp_above: "Net Floor Area above ground = GFA above × efficiency factor (conservative 75%, realistic 80%, optimistic 85%).",
      npp_below: "Net Floor Area below ground = GFA below × 85%.",
      apartments_area: "Residential (apartment) net floor area = NFA above × (1 − non-residential % − 10% common areas).",
      non_residential_area: "Non-residential net floor area = NFA above × non-residential %.",
      balconies_area: "Estimated balcony area = apartments area × 10%. Not counted in land balance.",
      front_gardens_area: "Informative estimate of front gardens = apartments area × 5%. Sub-item of green on ground.",
      parking_covered: "Number of underground/covered parking spaces = apartment count × covered parking ratio.",
      parking_outdoor: "Number of surface parking spaces = apartment count × outdoor parking ratio. Included in paved area balance.",
      paved_area: "Total paved area on ground = base paved % of land + surface parking area. Included in land balance.",
      green_terrain: "Residual green on ground = land area − footprint − paved area. Must meet the regulatory minimum green %.",
      green_on_structure: "Green roof / planted terrace on top of the building structure. Not counted in the land balance.",
      cellars_area: "Estimated cellar/storage area = apartment count × 3 m². Part of the underground floor area.",
      apartment_count: "Estimated number of apartments = apartments area ÷ average apartment size (input).",
    },
    warnings: {
      cpp_exceeds_hpp: "NFA exceeds GFA – check KPP/floors input.",
      green_below_minimum: "Green on ground is below minimum requirement.",
      parking_insufficient: "Parking places are insufficient for apartment count.",
      roads_green_too_high: "Internal roads + public green exceed 60% of land area.",
      coverage_too_high: "Max plot coverage exceeds 50% – check local regulations.",
      parcel_too_small: "Min. parcel size is below 250 m².",
      no_parcels: "Parcel size or land area too small – no buildable parcels.",
      kpp_floors_mismatch: "KPP vs Floors mismatch >25% – check regulatory inputs.",
      apartments_area_clamped: "Apartments area became negative – clamped to 0. Check inputs.",
      coverage_capped_to_max: "Plot coverage was capped to 50% maximum – typology adjustment exceeded limit.",
      effective_parcel_too_small: "Effective parcel size (after typology adjustment) is below 250 m².",
      green_negative_clamped: "Green area on ground is negative given current IZ and paved % – clamped to 0. Reduce paved area or IZ.",
      land_balance_exceeded: (v) => `Land balance exceeded by ${v?.excess_m2 ?? '?'} m² (${v?.excess_pct ?? '?'}%). Reduce paved/roads or building footprint.`,
      land_unallocated: "Unallocated land area detected – total allocation is less than land area.",
      parcel_balance_mismatch: "Parcel balance mismatch – parcel components do not sum to average parcel size.",
    }
  },
  sk: {
    land_balance_title: "Bilancia pozemku",
    lb_land_area: "Výmera pozemku",
    lb_building_footprint: "Zastavaná plocha",
    lb_roads: "Komunikácie / infraštruktúra",
    lb_paved: "Spevnené plochy",
    lb_green: "Zeleň na teréne",
    lb_total: "Celkom",
    lb_ok: "Bilancia OK",
    lb_exceeded: "Bilancia PREKROČENÁ",
    lb_unallocated: "Nealokovaná plocha",
    lb_infra_note: "Dopravná a technická infraštruktúra nie je predmetom detailného posúdenia v module Land Feasibility. Modul slúži najmä na posúdenie kapacity a plošnej bilancie pozemku. Náklady na komunikácie, technické siete a ďalšie infraštruktúrne prvky sa zohľadňujú v module Development Calculator. Skutočný rozsah komunikácií a infraštruktúry môže ovplyvniť výslednú kapacitu projektu.",
    title: "Výstupy konceptu",
    sub_title: "Výstupy parcelácie",
    disclaimer: "Concept-level estimation – no architectural study",
    sub_disclaimer: "Predbežný odhad parcelácie pozemku",
    // Block mode
    land_area: "Výmera pozemku",
    built_area: "Zastavaná plocha",
    hpp_above: "HPP nadzemné",
    hpp_below: "HPP podzemné",
    npp_above: "ČPP nadzemné",
    npp_below: "ČPP podzemné",
    apartments_area: "Byty",
    non_residential_area: "Nebytové priestory",
    balconies_area: "Balkóny",
    front_gardens_area: "Predzáhradky",
    parking_covered: "Kryté parkovacie miesta",
    parking_outdoor: "Vonkajšie parkovacie miesta",
    paved_area: "Spevnené plochy (vr. vonkajšie parkovanie)",
    green_terrain: "Zeleň na teréne",
    green_on_structure: "Zeleň na konštrukcii",
    cellars_area: "Pivnice",
    apartment_count: "Odhad počtu bytov",
    // Subdivision mode
    development_area: "Rozvojová plocha (parcely)",
    roads_area: "Verejné komunikácie",
    public_green_area: "Verejná / spoločná zeleň",
    green_area: "Zeleň celkom (celý pozemok)",
    total_paved_area: "Spevnené plochy celkom (všetky parcely)",
    number_of_parcels: "Počet parciel",
    avg_parcel_size: "Priemerná výmera parcely",
    footprint_per_house: "Max. zastavaná plocha / dom",
    hpp_per_house: "HPP / dom",
    total_hpp: "Celkové HPP (hrubé)",
    effective_total_hpp: "Efektívne HPP (po risk bufferi)",
    total_built_footprint: "Celková zastavaná plocha",
    total_parking: "Celkové parkovacie miesta",
    // units
    m2: "m²",
    pcs: "ks",
    effective_hpp_above: "Efektívne HPP nadzemné (po risk bufferi)",
    warnings: {
      cpp_exceeds_hpp: "ČPP presahuje HPP – skontrolujte KPP alebo počet podlaží.",
      green_below_minimum: "Zeleň na teréne je nižšia ako regulatívne minimum.",
      parking_insufficient: "Počet parkovacích miest je nedostatočný.",
      roads_green_too_high: "Komunikácie + zeleň presahujú 60 % plochy pozemku.",
      coverage_too_high: "Max. zastavanosť parcely presahuje 50 % – skontrolujte reguláciu.",
      parcel_too_small: "Min. výmera parcely je pod 250 m².",
      no_parcels: "Výmera parcely alebo pozemku príliš malá – žiadne stavebné parcely.",
      kpp_floors_mismatch: "Nesúlad KPP vs. podlažnosť >25 % – skontrolujte regulatívne vstupy.",
      apartments_area_clamped: "Plocha bytov vyšla záporná – zaokrúhlená na 0. Skontrolujte vstupy.",
      coverage_capped_to_max: "Zastavanosť parcely bola zastropovaná na max. 50 % – typológia prekročila limit.",
      effective_parcel_too_small: "Efektívna výmera parcely (po úprave typológiou) je pod 250 m².",
      green_negative_clamped: "Zeleň na teréne vyšla záporná (IZ + spevnené plochy > 100 %) – zaokrúhlená na 0. Znížte IZ alebo % spevnených plôch.",
      land_balance_exceeded: (v) => `Bilancia pozemku je prekročená o ${v?.excess_m2 ?? '?'} m² (${v?.excess_pct ?? '?'}%). Znížte spevnené plochy / komunikácie alebo zastavanú plochu.`,
      land_unallocated: "Nealokovaná plocha – celková alokácia je menšia ako výmera pozemku.",
      parcel_balance_mismatch: "Nesúlad parcelovej bilancie – súčet položiek parcely nezodpovedá priemernej veľkosti parcely.",
    },
    // Parcel breakdown translations
    parcel_breakdown_title: "Parcelový prehľad",
    parcel_summary_title: "Súhrn parcelácie",
    typical_parcel_title: "Typická parcela",
    pb_development_area: "Rozvojová plocha",
    pb_number_of_parcels: "Počet parciel",
    pb_avg_parcel_size: "Priemerná veľkosť parcely",
    pb_parcel_area: "Plocha parcely",
    pb_building_footprint: "Zastavaná plocha domu",
    pb_paved_area: "Spevnené plochy",
    pb_green_area: "Zeleň parcely",
    pb_total: "Celkom",
    pb_green_compliance_title: "Plnenie požiadavky na zeleň",
    pb_required_green_total: "Požadovaná zeleň (celý pozemok)",
    pb_total_parcel_green: "Zeleň na parcelách",
    pb_public_green: "Verejná / spoločná zeleň",
    pb_total_green: "Zeleň celkom",
    m2: "m²",
    pcs: "ks",
  },
};

// PL translations
translations.pl = {
  land_balance_title: "Bilans terenu",
  lb_land_area: "Powierzchnia terenu",
  lb_building_footprint: "Powierzchnia zabudowy",
  lb_roads: "Drogi / infrastruktura",
  lb_paved: "Nawierzchnie utwardzone",
  lb_green: "Zieleń na gruncie",
  lb_total: "Łącznie",
  lb_ok: "Bilans OK",
  lb_exceeded: "Bilans PRZEKROCZONY",
  lb_unallocated: "Nieprzydzielona powierzchnia",
  lb_infra_note: "Infrastruktura drogowa i techniczna nie jest szczegółowo oceniana w module Land Feasibility. Narzędzie służy głównie do oceny pojemności działki i bilansu powierzchni.",
  title: "Wyniki koncepcji",
  sub_title: "Wyniki parcelacji",
  disclaimer: "Szacunek na poziomie koncepcji – bez projektu architektonicznego",
  sub_disclaimer: "Wstępny szacunek podziału działki",
  land_area: "Powierzchnia terenu",
  built_area: "Powierzchnia zabudowy",
  hpp_above: "PUB nadziemna",
  hpp_below: "PUB podziemna",
  npp_above: "PUB netto nadziemna",
  npp_below: "PUB netto podziemna",
  apartments_area: "Mieszkania",
  non_residential_area: "Powierzchnia usługowa",
  balconies_area: "Balkony",
  front_gardens_area: "Ogródki przydomowe",
  parking_covered: "Miejsca parkingowe kryte",
  parking_outdoor: "Miejsca parkingowe zewnętrzne",
  paved_area: "Nawierzchnie utwardzone (w tym parking)",
  green_terrain: "Zieleń na gruncie",
  green_on_structure: "Zieleń na konstrukcji",
  cellars_area: "Piwnice",
  apartment_count: "Szac. liczba mieszkań",
  development_area: "Powierzchnia zabudowy (działki)",
  roads_area: "Drogi publiczne",
  public_green_area: "Zieleń publiczna / wspólna",
  green_area: "Zieleń łącznie",
  total_paved_area: "Nawierzchnie utwardzone łącznie",
  number_of_parcels: "Liczba działek",
  avg_parcel_size: "Średnia wielkość działki",
  footprint_per_house: "Maks. pow. zabudowy / dom",
  hpp_per_house: "PUB / dom",
  total_hpp: "Całkowita PUB (brutto)",
  effective_total_hpp: "Efektywna PUB (po buforze ryzyka)",
  total_built_footprint: "Łączna pow. zabudowy",
  total_parking: "Łączna liczba miejsc parkingowych",
  m2: "m²",
  pcs: "szt.",
  effective_hpp_above: "Efektywna PUB nadziemna (po buforze ryzyka)",
  parcel_breakdown_title: "Podział działek",
  parcel_summary_title: "Podsumowanie parcelacji",
  typical_parcel_title: "Typowa działka",
  pb_development_area: "Powierzchnia zabudowy",
  pb_number_of_parcels: "Liczba działek",
  pb_avg_parcel_size: "Średnia wielkość działki",
  pb_parcel_area: "Powierzchnia działki",
  pb_building_footprint: "Pow. zabudowy domu",
  pb_paved_area: "Nawierzchnie utwardzone",
  pb_green_area: "Zieleń działki",
  pb_total: "Łącznie",
  pb_green_compliance_title: "Spełnienie wymogu zieleni",
  pb_required_green_total: "Wymagana zieleń (cały teren)",
  pb_total_parcel_green: "Zieleń na działkach",
  pb_public_green: "Zieleń publiczna / wspólna",
  pb_total_green: "Zieleń łącznie",
  warnings: {
    cpp_exceeds_hpp: "PUB netto przekracza PUB – sprawdź wskaźnik intensywności lub liczbę kondygnacji.",
    green_below_minimum: "Zieleń na gruncie jest poniżej minimalnego wymagania.",
    parking_insufficient: "Liczba miejsc parkingowych jest niewystarczająca.",
    roads_green_too_high: "Drogi + zieleń przekraczają 60% powierzchni terenu.",
    coverage_too_high: "Maks. wskaźnik zabudowy przekracza 50% – sprawdź miejscowe przepisy.",
    parcel_too_small: "Min. wielkość działki jest poniżej 250 m².",
    no_parcels: "Wielkość działki lub terenu zbyt mała – brak działek budowlanych.",
    kpp_floors_mismatch: "Niezgodność wskaźnika intensywności vs. kondygnacje >25%.",
    apartments_area_clamped: "Powierzchnia mieszkań jest ujemna – zaokrąglona do 0. Sprawdź dane wejściowe.",
    coverage_capped_to_max: "Wskaźnik zabudowy został ograniczony do maks. 50%.",
    effective_parcel_too_small: "Efektywna wielkość działki (po korekcie typologią) jest poniżej 250 m².",
    green_negative_clamped: "Zieleń na gruncie wyszła ujemna – zaokrąglona do 0. Zmniejsz pow. utwardzone lub wskaźnik zabudowy.",
    land_balance_exceeded: (v) => `Bilans terenu przekroczony o ${v?.excess_m2 ?? '?'} m² (${v?.excess_pct ?? '?'}%). Zmniejsz nawierzchnie lub pow. zabudowy.`,
    land_unallocated: "Wykryto nieprzydzieloną powierzchnię – całkowita alokacja jest mniejsza niż powierzchnia terenu.",
    parcel_balance_mismatch: "Niezgodność bilansu działki – składniki działki nie sumują się do średniej wielkości.",
  },
};

// HU translations
translations.hu = {
  land_balance_title: "Telek mérleg",
  lb_land_area: "Telek területe",
  lb_building_footprint: "Beépített terület",
  lb_roads: "Utak / infrastruktúra",
  lb_paved: "Burkolt felületek",
  lb_green: "Zöldfelület talajon",
  lb_total: "Összesen",
  lb_ok: "Mérleg OK",
  lb_exceeded: "Mérleg TÚLLÉPVE",
  lb_unallocated: "Nem allokált terület",
  lb_infra_note: "A közlekedési és műszaki infrastruktúra nem kerül részletesen értékelésre a Land Feasibility modulban. Az eszköz elsősorban a telek kapacitásának és területi mérlegének felmérésére szolgál.",
  title: "Koncepció eredményei",
  sub_title: "Telekfelosztás eredményei",
  disclaimer: "Koncepció szintű becslés – építészeti terv nélkül",
  sub_disclaimer: "Előzetes telekfelosztási becslés",
  land_area: "Telek területe",
  built_area: "Beépített terület",
  hpp_above: "Bruttó alapterület (felszín felett)",
  hpp_below: "Bruttó alapterület (felszín alatt)",
  npp_above: "Nettó alapterület (felszín felett)",
  npp_below: "Nettó alapterület (felszín alatt)",
  apartments_area: "Lakások",
  non_residential_area: "Nem lakás célú helyiségek",
  balconies_area: "Erkélyek",
  front_gardens_area: "Előkertek",
  parking_covered: "Fedett parkolóhelyek",
  parking_outdoor: "Külső parkolóhelyek",
  paved_area: "Burkolt felületek (parkolóval)",
  green_terrain: "Zöldfelület talajon",
  green_on_structure: "Zöldfelület szerkezeten",
  cellars_area: "Pincék",
  apartment_count: "Becsült lakásszám",
  development_area: "Fejlesztési terület (telkek)",
  roads_area: "Közutak területe",
  public_green_area: "Közösségi zöldfelület",
  green_area: "Összes zöldfelület",
  total_paved_area: "Összes burkolt felület",
  number_of_parcels: "Telkek száma",
  avg_parcel_size: "Átlagos telekméret",
  footprint_per_house: "Max. beépített terület / ház",
  hpp_per_house: "Bruttó alapterület / ház",
  total_hpp: "Összes bruttó alapterület",
  effective_total_hpp: "Effektív bruttó alapterület (kockázati puffer után)",
  total_built_footprint: "Összes beépített terület",
  total_parking: "Összes parkolóhely",
  m2: "m²",
  pcs: "db",
  effective_hpp_above: "Effektív bruttó alapterület felszín felett",
  parcel_breakdown_title: "Telekfelosztás részletei",
  parcel_summary_title: "Felosztás összefoglalója",
  typical_parcel_title: "Tipikus telek",
  pb_development_area: "Fejlesztési terület",
  pb_number_of_parcels: "Telkek száma",
  pb_avg_parcel_size: "Átlagos telekméret",
  pb_parcel_area: "Telek területe",
  pb_building_footprint: "Ház beépített területe",
  pb_paved_area: "Burkolt felületek",
  pb_green_area: "Zöldfelület",
  pb_total: "Összesen",
  pb_green_compliance_title: "Zöldfelület-követelmény teljesítése",
  pb_required_green_total: "Szükséges zöldfelület (teljes telek)",
  pb_total_parcel_green: "Zöldfelület a telkeken",
  pb_public_green: "Közösségi zöldfelület",
  pb_total_green: "Összes zöldfelület",
  warnings: {
    cpp_exceeds_hpp: "Nettó alapterület meghaladja a bruttót – ellenőrizze az intenzitási mutatót vagy az szintszámot.",
    green_below_minimum: "A talajon lévő zöldfelület az előírt minimum alatt van.",
    parking_insufficient: "A parkolóhelyek száma nem elegendő.",
    roads_green_too_high: "Utak + zöldfelület meghaladja a telek 60%-át.",
    coverage_too_high: "A max. beépítési arány meghaladja az 50%-ot – ellenőrizze a helyi előírásokat.",
    parcel_too_small: "A min. telekméret 250 m² alatt van.",
    no_parcels: "A telekméret vagy terület túl kicsi – nincs beépíthető telek.",
    kpp_floors_mismatch: "Intenzitási mutató vs. szintszám eltérés >25%.",
    apartments_area_clamped: "A lakások területe negatív lett – 0-ra kerekítve. Ellenőrizze a bemeneti adatokat.",
    coverage_capped_to_max: "A beépítési arány max. 50%-ra lett korlátozva.",
    effective_parcel_too_small: "A tényleges telekméret (tipológiai korrekció után) 250 m² alatt van.",
    green_negative_clamped: "A talajon lévő zöldfelület negatív lett – 0-ra kerekítve. Csökkentse a burkolt felületeket vagy a beépítési arányt.",
    land_balance_exceeded: (v) => `A terekmérleg ${v?.excess_m2 ?? '?'} m²-rel (${v?.excess_pct ?? '?'}%) túllépve. Csökkentse a burkolt felületeket vagy a beépített területet.`,
    land_unallocated: "Nem allokált terület észlelve – a teljes allokáció kisebb a telek területénél.",
    parcel_balance_mismatch: "Telekmérleg eltérés – a telek összetevői nem adják ki az átlagos telekméret értékét.",
  },
};

// DE translations
translations.de = {
  land_balance_title: "Grundstücksbilanz",
  lb_land_area: "Grundstücksfläche",
  lb_building_footprint: "Bebauungsfläche",
  lb_roads: "Wege / Infrastruktur",
  lb_paved: "Versiegelte Flächen",
  lb_green: "Grünfläche auf Terrain",
  lb_total: "Gesamt",
  lb_ok: "Bilanz OK",
  lb_exceeded: "Bilanz ÜBERSCHRITTEN",
  lb_unallocated: "Nicht zugewiesene Fläche",
  lb_infra_note: "Verkehrs- und technische Infrastruktur wird im Land Feasibility-Modul nicht detailliert bewertet. Das Tool dient primär zur Beurteilung der Grundstückskapazität und Flächenbilanz.",
  title: "Konzeptergebnisse",
  sub_title: "Parzellierungsergebnisse",
  disclaimer: "Konzeptschätzung – ohne Architektenplanung",
  sub_disclaimer: "Vorläufige Grundstücksparzellierungsschätzung",
  land_area: "Grundstücksfläche",
  built_area: "Bebauungsfläche",
  hpp_above: "BGF oberirdisch",
  hpp_below: "BGF unterirdisch",
  npp_above: "NF oberirdisch",
  npp_below: "NF unterirdisch",
  apartments_area: "Wohnungen",
  non_residential_area: "Gewerbefläche",
  balconies_area: "Balkone",
  front_gardens_area: "Vorgärten",
  parking_covered: "Überdachte Stellplätze",
  parking_outdoor: "Außenstellplätze",
  paved_area: "Versiegelte Flächen (inkl. Parkplätze)",
  green_terrain: "Grünfläche auf Terrain",
  green_on_structure: "Grünfläche auf Konstruktion",
  cellars_area: "Keller",
  apartment_count: "Gesch. Wohnungsanzahl",
  development_area: "Entwicklungsfläche (Parzellen)",
  roads_area: "Öffentliche Wege",
  public_green_area: "Öffentliche / Gemeinschaftsgrünfläche",
  green_area: "Grünfläche gesamt",
  total_paved_area: "Versiegelte Flächen gesamt",
  number_of_parcels: "Anzahl Parzellen",
  avg_parcel_size: "Durchschnittliche Parzellengrö­ße",
  footprint_per_house: "Max. Bebauungsfläche / Haus",
  hpp_per_house: "BGF / Haus",
  total_hpp: "Gesamt-BGF (brutto)",
  effective_total_hpp: "Effektive BGF (nach Risikopuffer)",
  total_built_footprint: "Gesamte Bebauungsfläche",
  total_parking: "Stellplätze gesamt",
  m2: "m²",
  pcs: "Stk.",
  effective_hpp_above: "Effektive BGF oberirdisch (nach Risikopuffer)",
  parcel_breakdown_title: "Parzellenaufschlüsselung",
  parcel_summary_title: "Parzellierungsübersicht",
  typical_parcel_title: "Typische Parzelle",
  pb_development_area: "Entwicklungsfläche",
  pb_number_of_parcels: "Anzahl Parzellen",
  pb_avg_parcel_size: "Durchschn. Parzellengrö­ße",
  pb_parcel_area: "Parzellenfläche",
  pb_building_footprint: "Bebauungsfläche Haus",
  pb_paved_area: "Versiegelte Flächen",
  pb_green_area: "Grünfläche",
  pb_total: "Gesamt",
  pb_green_compliance_title: "Einhaltung der Grünflächenanforderung",
  pb_required_green_total: "Erforderliche Grünfläche (gesamt)",
  pb_total_parcel_green: "Grünfläche auf Parzellen",
  pb_public_green: "Öffentliche / Gemeinschaftsgrünfläche",
  pb_total_green: "Grünfläche gesamt",
  warnings: {
    cpp_exceeds_hpp: "NF überschreitet BGF – prüfen Sie GRZ/Geschosszahl.",
    green_below_minimum: "Grünfläche auf Terrain liegt unter dem Mindesterfordernis.",
    parking_insufficient: "Stellplatzanzahl ist unzureichend.",
    roads_green_too_high: "Wege + Grünfläche überschreiten 60% der Grundstücksfläche.",
    coverage_too_high: "Max. GRZ überschreitet 50% – prüfen Sie lokale Vorschriften.",
    parcel_too_small: "Min. Parzellengrö­ße liegt unter 250 m².",
    no_parcels: "Parzellengrö­ße oder Grundstücksfläche zu klein – keine bebaubaren Parzellen.",
    kpp_floors_mismatch: "GFZ vs. Geschosszahl Abweichung >25%.",
    apartments_area_clamped: "Wohnfläche wurde negativ – auf 0 gerundet. Prüfen Sie die Eingaben.",
    coverage_capped_to_max: "GRZ wurde auf max. 50% begrenzt.",
    effective_parcel_too_small: "Effektive Parzellengrö­ße (nach Typologieanpassung) liegt unter 250 m².",
    green_negative_clamped: "Grünfläche auf Terrain wurde negativ – auf 0 gerundet. Reduzieren Sie versiegelte Flächen oder GRZ.",
    land_balance_exceeded: (v) => `Grundstücksbilanz um ${v?.excess_m2 ?? '?'} m² (${v?.excess_pct ?? '?'}%) überschritten. Reduzieren Sie versiegelte Flächen oder Bebauungsfläche.`,
    land_unallocated: "Nicht zugewiesene Fläche erkannt – Gesamtzuweisung ist kleiner als Grundstücksfläche.",
    parcel_balance_mismatch: "Parzellenbilanzmissverhältnis – Parzellenkomponenten ergeben nicht die durchschnittliche Parzellengrö­ße.",
  },
};

// Parcel breakdown translations for EN (add outside sk block)
translations.en.parcel_breakdown_title = "Parcel Breakdown";
translations.en.parcel_summary_title = "Parcel Summary";
translations.en.typical_parcel_title = "Typical Parcel";
translations.en.pb_development_area = "Development Area";
translations.en.pb_number_of_parcels = "Number of Parcels";
translations.en.pb_avg_parcel_size = "Average Parcel Size";
translations.en.pb_parcel_area = "Parcel Area";
translations.en.pb_building_footprint = "Building Footprint";
translations.en.pb_paved_area = "Paved Area";
translations.en.pb_green_area = "Green Area";
translations.en.pb_total = "Total";
translations.en.pb_green_compliance_title = "Green Requirement Compliance";
translations.en.pb_required_green_total = "Required green (whole site)";
translations.en.pb_total_parcel_green = "Green on parcels";
translations.en.pb_public_green = "Public / common green";
translations.en.pb_total_green = "Total green";
translations.en.warnings.parcel_balance_mismatch = "Parcel balance mismatch – parcel components do not sum to average parcel size.";

const ResultRow = ({ label, value, unit, highlight, tooltip }) => (
  <div className={`flex justify-between items-center py-2 border-b border-border ${highlight ? 'bg-accent/10 px-2 rounded' : ''}`}>
    <span className="text-sm text-muted-foreground flex items-center gap-1">
      {label}
      {tooltip && (
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3 w-3 text-muted-foreground/60 cursor-help shrink-0" />
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs text-xs leading-relaxed">
              {tooltip}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </span>
    <span className="font-semibold text-foreground">{value} <span className="text-xs text-muted-foreground">{unit}</span></span>
  </div>
);

const fmt = (n) => Math.round(n).toLocaleString('sk-SK');

function BlockResults({ results, t }) {
  const rows = [
    { key: 'land_area', unit: t.m2 },
    { key: 'built_area', unit: t.m2, highlight: true },
    { key: 'hpp_above', unit: t.m2 },
    { key: 'hpp_below', unit: t.m2 },
    { key: 'npp_above', unit: t.m2, highlight: true },
    { key: 'npp_below', unit: t.m2 },
    { key: 'apartments_area', unit: t.m2, highlight: true },
    { key: 'non_residential_area', unit: t.m2 },
    { key: 'balconies_area', unit: t.m2 },
    { key: 'front_gardens_area', unit: t.m2 },
    { key: 'parking_covered', unit: t.pcs, highlight: true },
    { key: 'parking_outdoor', unit: t.pcs },
    { key: 'paved_area', unit: t.m2 },
    { key: 'green_terrain', unit: t.m2, highlight: true },
    ...(results.green_on_structure_area > 0 ? [{ key: 'green_on_structure_area', unit: t.m2, labelOverride: t.green_on_structure }] : []),
    { key: 'cellars_area', unit: t.m2 },
    { key: 'apartment_count', unit: t.pcs, highlight: true },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle>{t.title}</CardTitle>
          <Badge variant="outline" className="flex items-center gap-1 text-xs text-muted-foreground">
            <Info className="h-3 w-3" />
            {t.disclaimer}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {rows.map(row => (
          <ResultRow
            key={row.key}
            label={row.labelOverride || t[row.key]}
            value={fmt(results[row.key] ?? 0)}
            unit={row.unit}
            highlight={row.highlight}
          />
        ))}
      </CardContent>
    </Card>
  );
}

function ParcelBreakdown({ pb, t }) {
  if (!pb || pb.number_of_parcels < 1) return null;

  const greenOk = pb.green_pct_achieved >= pb.green_pct_required - 0.001;
  const greenPctAchieved = Math.round((pb.green_pct_achieved ?? 0) * 100);
  const greenPctRequired = Math.round((pb.green_pct_required ?? 0) * 100);

  const summaryRows = [
    { label: t.pb_development_area, value: fmt(pb.development_area), unit: t.m2 },
    { label: t.pb_number_of_parcels, value: fmt(pb.number_of_parcels), unit: t.pcs },
    { label: t.pb_avg_parcel_size, value: fmt(pb.avg_parcel_size), unit: t.m2 },
  ];

  const parcelRows = [
    { label: t.pb_parcel_area, value: fmt(pb.avg_parcel_size), unit: t.m2, highlight: true },
    { label: t.pb_building_footprint, value: fmt(pb.parcel_building_footprint), unit: t.m2 },
    { label: t.pb_paved_area, value: fmt(pb.parcel_paved_area), unit: t.m2 },
    { label: t.pb_green_area, value: fmt(pb.parcel_green_area), unit: t.m2 },
    { label: t.pb_total, value: fmt(pb.parcel_total), unit: t.m2, highlight: true },
  ];

  return (
    <Card className="border-green-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="flex items-center gap-2">
            {t.parcel_breakdown_title}
          </CardTitle>
          <Badge variant="outline" className="text-xs text-green-700 border-green-300">
            derived
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{t.parcel_summary_title}</p>
          {summaryRows.map((r, i) => (
            <ResultRow key={i} label={r.label} value={r.value} unit={r.unit} highlight={r.highlight} />
          ))}
        </div>
        {/* Typical parcel */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{t.typical_parcel_title}</p>
          <div className="rounded-lg border border-green-100 bg-green-50/40 overflow-hidden">
            {parcelRows.map((r, i) => (
              <div key={i} className={`flex justify-between items-center px-3 py-2 border-b border-green-100 last:border-b-0 ${r.highlight ? 'bg-green-100/60 font-semibold' : ''}`}>
                <span className="text-sm text-muted-foreground">{r.label}</span>
                <span className="font-semibold text-foreground text-sm">{r.value} <span className="text-xs text-muted-foreground">{r.unit}</span></span>
              </div>
            ))}
          </div>
        </div>
        {/* Visual bar */}
        <div>
          <p className="text-xs text-muted-foreground mb-1">{t.pb_parcel_area}: {fmt(pb.avg_parcel_size)} m²</p>
          <div className="flex h-5 rounded overflow-hidden w-full text-xs">
            <div style={{ width: `${(pb.parcel_building_footprint / pb.avg_parcel_size) * 100}%` }} className="bg-slate-500 flex items-center justify-center text-white overflow-hidden whitespace-nowrap px-1" title={t.pb_building_footprint}>🏠</div>
            <div style={{ width: `${(pb.parcel_paved_area / pb.avg_parcel_size) * 100}%` }} className="bg-gray-300 flex items-center justify-center text-gray-700 overflow-hidden whitespace-nowrap px-1" title={t.pb_paved_area}>⬛</div>
            <div style={{ width: `${(pb.parcel_green_area / pb.avg_parcel_size) * 100}%` }} className="bg-green-400 flex items-center justify-center text-white overflow-hidden whitespace-nowrap px-1" title={t.pb_green_area}>🌿</div>
          </div>
          <div className="flex gap-3 mt-1 flex-wrap">
            <span className="flex items-center gap-1 text-xs text-muted-foreground"><span className="inline-block w-3 h-3 rounded-sm bg-slate-500"></span>{t.pb_building_footprint} ({Math.round((pb.parcel_building_footprint / pb.avg_parcel_size) * 100)}%)</span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground"><span className="inline-block w-3 h-3 rounded-sm bg-gray-300"></span>{t.pb_paved_area} ({Math.round((pb.parcel_paved_area / pb.avg_parcel_size) * 100)}%)</span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground"><span className="inline-block w-3 h-3 rounded-sm bg-green-400"></span>{t.pb_green_area} ({Math.round((pb.parcel_green_area / pb.avg_parcel_size) * 100)}%)</span>
          </div>
        </div>

        {/* Green compliance summary */}
        <div className={`rounded-lg border p-3 ${greenOk ? 'border-green-300 bg-green-50/60' : 'border-amber-300 bg-amber-50/60'}`}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-2 text-muted-foreground">{t.pb_green_compliance_title}</p>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t.pb_required_green_total}</span>
              <span className="font-semibold">{fmt(pb.required_green_total)} m² ({greenPctRequired}%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t.pb_total_parcel_green} ({pb.number_of_parcels}×)</span>
              <span className="font-semibold">{fmt(pb.total_parcel_green)} m²</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t.pb_public_green}</span>
              <span className="font-semibold">{fmt(pb.public_green_area)} m²</span>
            </div>
            <div className={`flex justify-between border-t pt-1 mt-1 ${greenOk ? 'border-green-200' : 'border-amber-200'}`}>
              <span className="font-semibold">{t.pb_total_green}</span>
              <span className={`font-bold ${greenOk ? 'text-green-700' : 'text-amber-700'}`}>
                {fmt((pb.total_parcel_green ?? 0) + (pb.public_green_area ?? 0))} m² ({greenPctAchieved}%) {greenOk ? '✓' : '⚠'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SubdivisionResults({ results, t }) {
  const rows = [
    { key: 'land_area', unit: t.m2 },
    { key: 'roads_area', unit: t.m2 },
    { key: 'public_green_area', unit: t.m2 },
    { key: 'development_area', unit: t.m2, highlight: true },
    { key: 'number_of_parcels', unit: t.pcs, highlight: true },
    { key: 'avg_parcel_size', unit: t.m2 },
    { key: 'footprint_per_house', unit: t.m2 },
    { key: 'hpp_per_house', unit: t.m2 },
    { key: 'total_hpp', unit: t.m2 },
    { key: 'effective_total_hpp', unit: t.m2, highlight: true, labelOverride: results.risk_buffer_pct > 0 ? `${t.effective_total_hpp} (-${Math.round(results.risk_buffer_pct * 100)}%)` : t.effective_total_hpp },
    { key: 'total_built_footprint', unit: t.m2 },
    { key: 'total_paved_area', unit: t.m2 },
    { key: 'green_area', unit: t.m2 },
    { key: 'total_parking', unit: t.pcs },
  ];

  return (
    <Card className="border-blue-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle>{t.sub_title}</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">Land Subdivision Concept</p>
          </div>
          <Badge variant="outline" className="flex items-center gap-1 text-xs text-blue-600 border-blue-300">
            <Info className="h-3 w-3" />
            {t.sub_disclaimer}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {rows.map(row => (
          <ResultRow
            key={row.key}
            label={row.labelOverride || t[row.key]}
            value={fmt(results[row.key] ?? 0)}
            unit={row.unit}
            highlight={row.highlight}
          />
        ))}
      </CardContent>
    </Card>
  );
}

export default function FeasibilityResults({ results, language = 'sk' }) {
  const t = translations[language] || translations.sk;
  if (!results) return null;

  const isSubdivision = results.mode === 'subdivision';

  return (
    <div className="space-y-4">
      {results.validations?.length > 0 && (
        <div className="space-y-2">
          {results.validations.map((v, i) => {
            const msg = t.warnings[v.key];
            const text = typeof msg === 'function' ? msg(v) : (msg || v.key);
            return (
              <div key={i} className={`flex items-start gap-2 p-3 rounded-lg text-sm ${v.type === 'error' ? 'bg-destructive/10 text-destructive' : 'bg-amber-50 text-amber-800'}`}>
                {v.type === 'error' ? <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" /> : <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />}
                {text}
              </div>
            );
          })}
        </div>
      )}

      {isSubdivision
        ? <SubdivisionResults results={results} t={t} />
        : <BlockResults results={results} t={t} />
      }

      {isSubdivision && results.parcel_breakdown && (
        <ParcelBreakdown pb={results.parcel_breakdown} t={t} />
      )}

      {results.land_balance && (
        <LandBalanceBlock balance={results.land_balance} t={t} />
      )}
    </div>
  );
}