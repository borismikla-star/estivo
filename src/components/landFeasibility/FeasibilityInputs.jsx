import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ChevronDown, ChevronUp } from 'lucide-react';
import InfoTooltip from '../shared/InfoTooltip';

const translations = {
  en: {
    title: "Land & Regulatory Inputs",
    land_area: "Total Land Area (m²)",
    iz: "Plot Coverage Ratio (IZ) e.g. 0.40",
    kpp: "Floor Area Ratio (KPP) — or leave empty",
    floors: "Number of Above-Ground Floors — or leave empty",
    kpp_hint: "If KPP is set, floors are ignored.",
    project_type: "Project Type",
    building: "Building Development",
    subdivision: "Subdivision / Family Houses",
    non_res_pct: "Non-Residential % (0–100)",
    min_green_pct: "Min. Green on Ground (%)",
    avg_apt: "Average Apartment Size (m²)",
    mode: "Calculation Mode",
    conservative: "Conservative (72%)",
    realistic: "Realistic (75%)",
    efficient: "Efficient (80%)",
    green_on_structure: "Include Green on Structure",
    // Subdivision
    sub_title: "Subdivision Parameters",
    public_roads_pct: "Public Roads / Infrastructure (%)",
    green_pct: "Min. Green Area on Site (%)",
    paved_pct_house: "Paved Area per Parcel (%)",
    min_parcel_size: "Min. Parcel Size (m²)",
    max_plot_coverage: "Max Plot Coverage per House (%)",
    floors_per_house: "Floors per House",
    kpp_house: "Floor Area Ratio per House (KPP) — or leave empty",
    kpp_house_hint: "If KPP is set, floors are ignored.",
    typology: "House Typology",
    detached: "Detached",
    semi: "Semi-detached",
    row: "Row House",
    risk_buffer_pct: "Design Efficiency Buffer (%)",
    parking_per_house: "Parking per House",
    // Advanced block
    advanced_title: "Advanced Assumptions",
    parking_ratio: "Covered Parking per Apartment",
    outdoor_ratio: "Outdoor Parking per Apartment",
    paved_pct: "Paved Area (% of site)",
    urban_risk_buffer: "Urban Risk Buffer (%)",
    advanced_hint: "Adjusts HPP for regulatory/design uncertainty",
    // Tooltips
    tt_land_area: "Total area of the plot in square metres as stated in the land register.",
    tt_project_type: "Select the main use type: Block/Residential for apartment buildings, Subdivision for individual family houses on separate plots.",
    tt_iz: "Ratio of built-up footprint to total land area. E.g. IZ 0.40 means 40% of the land can be covered by buildings. Set by the territorial plan.",
    tt_kpp: "Total floor area ratio relative to the land area (all above-ground floors). If entered, it overrides the floors × IZ calculation.",
    tt_floors: "Number of above-ground storeys. Used to estimate gross floor area (GFA) as footprint × floors.",
    tt_non_res_pct: "Share of net usable area intended for non-residential uses (retail, offices). The remaining share is residential.",
    tt_min_green_pct: "Minimum share of the land area that must remain as unpaved green space (terrain). Regulatory requirement.",
    tt_avg_apt: "Average usable area of one apartment unit. Affects the estimated number of units.",
    tt_mode: "Efficiency ratio (net usable / gross floor area): Conservative 72%, Realistic 75%, Efficient 80%.",
    tt_green_on_structure: "Whether a green roof or elevated garden is planned. Adds informative green area on structure (not counted in land balance).",
    tt_public_roads_pct: "Share of the total land area allocated to public roads, pathways and technical infrastructure.",
    tt_green_pct: "Minimum share of the total site that must be green (regulatory requirement). The calculation checks compliance.",
    tt_paved_pct_house: "Share of each parcel area covered by driveways, terraces and other paved surfaces.",
    tt_min_parcel_size: "Minimum area of a single building plot. Determines the maximum number of parcels from the development area.",
    tt_max_plot_coverage: "Maximum share of a single parcel that can be covered by the building footprint. Regulatory limit.",
    tt_floors_per_house: "Number of above-ground storeys per house. Used to calculate gross floor area per plot.",
    tt_kpp_house: "Floor area ratio per parcel. If entered, overrides floors × footprint calculation.",
    tt_typology: "House typology affects effective parcel size and max coverage: Detached (100%), Semi-detached (85%), Row house (70%).",
    tt_risk_buffer_pct: "Reduction applied to gross floor area to reflect design efficiency, construction tolerances and regulatory compliance. Net floor area = GFA × (1 – buffer%).",
    tt_parking_per_house: "Number of parking spaces required per house (typically 2 for family houses).",
    tt_parking_ratio: "Number of covered/underground parking spaces per apartment.",
    tt_outdoor_ratio: "Number of surface parking spaces per apartment.",
    tt_paved_pct: "Share of the land area used for internal roads, walkways and surface parking.",
    tt_urban_risk_buffer: "Reduction of gross floor area for regulatory uncertainty and design losses. Net usable area = GFA × (1 – buffer%).",
  },
  sk: {
    title: "Vstupné údaje pozemku",
    land_area: "Celková výmera pozemku (m²)",
    iz: "Index zastavanosti (IZ) napr. 0,40",
    kpp: "KPP (koeficient podlažných plôch) — alebo nechajte prázdne",
    floors: "Počet nadzemných podlaží — alebo nechajte prázdne",
    kpp_hint: "Ak je zadaný KPP, počet podlaží sa ignoruje.",
    project_type: "Typ projektu",
    building: "Bytová výstavba",
    subdivision: "Parcelácia / Rodinné domy",
    non_res_pct: "Nebytové priestory % (0–100)",
    min_green_pct: "Min. % zelene na teréne",
    avg_apt: "Priemerná výmera bytu (m²)",
    mode: "Režim výpočtu",
    conservative: "Konzervatívny (72%)",
    realistic: "Realistický (75%)",
    efficient: "Efektívny (80%)",
    green_on_structure: "Zeleň na konštrukcii",
    // Subdivision
    sub_title: "Parametre parcelácie",
    public_roads_pct: "Verejné komunikácie / infraštruktúra (%)",
    green_pct: "Min. výmera zelene na pozemku (%)",
    paved_pct_house: "Spevnené plochy / parcela (%)",
    min_parcel_size: "Min. výmera parcely (m²)",
    max_plot_coverage: "Max. zastavanosť parcely (%)",
    floors_per_house: "Počet podlaží (dom)",
    kpp_house: "Index podlažných plôch (KPP) / parcelu — alebo nechajte prázdne",
    kpp_house_hint: "Ak je zadaný KPP, počet podlaží sa ignoruje.",
    typology: "Typológia domu",
    detached: "Samostatne stojaci",
    semi: "Dvojdom",
    row: "Radový dom",
    risk_buffer_pct: "Efektivita návrhu stavby (%)",
    parking_per_house: "Parkovanie / dom",
    // Advanced block
    advanced_title: "Pokročilé predpoklady",
    parking_ratio: "Kryté parkovanie / byt",
    outdoor_ratio: "Vonkajšie parkovanie / byt",
    paved_pct: "Spevnené plochy (% pozemku)",
    urban_risk_buffer: "Urban risk buffer (%)",
    advanced_hint: "Znižuje HPP o regulatívnu/projektovú neistotu",
    // Tooltips
    tt_land_area: "Celková výmera pozemku v m² podľa katastra nehnuteľností.",
    tt_project_type: "Vyberte hlavný typ využitia: Block/Rezidenčný pre bytové domy, Parcelácia pre individuálne rodinné domy na samostatných parcelách.",
    tt_iz: "Podiel zastavanej plochy k celkovej výmere pozemku. Napr. IZ 0,40 znamená, že 40 % pozemku môže byť zastavané. Určuje územný plán.",
    tt_kpp: "Koeficient podlažných plôch voči výmere pozemku (všetky nadzemné podlažia). Ak je zadaný, prepíše výpočet podlaží × IZ.",
    tt_floors: "Počet nadzemných podlaží. Slúži na odhad hrubej podlažnej plochy (HPP) ako zastavená plocha × podlažia.",
    tt_non_res_pct: "Podiel čistej úžitkovej plochy určenej na nebytové využitie (obchod, kancelárie). Zvyšok je rezidenčný.",
    tt_min_green_pct: "Minimálny podiel plochy pozemku, ktorý musí zostať ako nezastavená zeleň na teréne. Regulatívna požiadavka.",
    tt_avg_apt: "Priemerná úžitková plocha jednej bytovej jednotky. Ovplyvňuje odhadovaný počet bytov.",
    tt_mode: "Koeficient efektivity (čistá úžitková / hrubá podlažná plocha): Konzervatívny 72 %, Realistický 75 %, Efektívny 80 %.",
    tt_green_on_structure: "Či je plánovaná zelená strecha alebo vyvýšená záhrada. Pridáva informatívnu plochu zelene na konštrukcii (nezapočítava sa do bilancie pozemku).",
    tt_public_roads_pct: "Podiel celkovej plochy pozemku vyhradený pre verejné komunikácie, chodníky a technickú infraštruktúru.",
    tt_green_pct: "Minimálny podiel celého pozemku, ktorý musí byť zelený (regulatívna požiadavka). Výpočet overuje splnenie tejto podmienky.",
    tt_paved_pct_house: "Podiel plochy každej parcely pokrytý príjazdovými cestami, terasami a inými spevnenými plochami.",
    tt_min_parcel_size: "Minimálna výmera jednej stavebnej parcely. Určuje maximálny počet parciel z rozvojovej plochy.",
    tt_max_plot_coverage: "Maximálny podiel jednej parcely, ktorý môže byť pokrytý zastavnou plochou domu. Regulatívny limit.",
    tt_floors_per_house: "Počet nadzemných podlaží na dom. Slúži na výpočet hrubej podlažnej plochy na parcelu.",
    tt_kpp_house: "Koeficient podlažných plôch na parcelu. Ak je zadaný, prepíše výpočet podlaží × zastavená plocha.",
    tt_typology: "Typológia domu ovplyvňuje efektívnu výmeru parcely a max. zastavanosť: Samostatne stojaci (100 %), Dvojdom (85 %), Radový dom (70 %).",
    tt_risk_buffer_pct: "Redukcia hrubej podlažnej plochy zohľadňujúca efektivitu návrhu, stavebné tolerancie a regulatívnu zhodu. Čistá plocha = HPP × (1 – buffer %).",
    tt_parking_per_house: "Počet parkovacích miest požadovaných na dom (štandardne 2 pre rodinné domy).",
    tt_parking_ratio: "Počet krytých/podzemných parkovacích miest na byt.",
    tt_outdoor_ratio: "Počet vonkajších parkovacích miest na byt.",
    tt_paved_pct: "Podiel plochy pozemku využitý na interné komunikácie, chodníky a povrchové parkovanie.",
    tt_urban_risk_buffer: "Redukcia HPP pre regulatívnu neistotu a projektové straty. Čistá úžitková plocha = HPP × (1 – buffer %).",
  },
};

const translations_pl = {
  title: "Dane wejściowe terenu",
  land_area: "Całkowita powierzchnia terenu (m²)",
  iz: "Wskaźnik zabudowy (WZ) np. 0,40",
  kpp: "Wskaźnik intensywności zabudowy (WIZ) — lub pozostaw puste",
  floors: "Liczba kondygnacji nadziemnych — lub pozostaw puste",
  kpp_hint: "Jeśli WIZ jest ustawiony, liczba kondygnacji jest ignorowana.",
  project_type: "Typ projektu",
  building: "Zabudowa mieszkaniowa",
  subdivision: "Parcelacja / Domy jednorodzinne",
  non_res_pct: "Udział pow. usługowej % (0–100)",
  min_green_pct: "Min. % zieleni na gruncie",
  avg_apt: "Średnia pow. mieszkania (m²)",
  mode: "Tryb obliczeń",
  conservative: "Konserwatywny (72%)",
  realistic: "Realistyczny (75%)",
  efficient: "Efektywny (80%)",
  green_on_structure: "Zieleń na konstrukcji",
  sub_title: "Parametry parcelacji",
  public_roads_pct: "Drogi publiczne / infrastruktura (%)",
  green_pct: "Min. pow. zieleni na terenie (%)",
  paved_pct_house: "Nawierzchnie utwardzone / działka (%)",
  min_parcel_size: "Min. wielkość działki (m²)",
  max_plot_coverage: "Max wskaźnik zabudowy / dom (%)",
  floors_per_house: "Kondygnacje / dom",
  kpp_house: "WIZ / działkę — lub pozostaw puste",
  kpp_house_hint: "Jeśli WIZ jest ustawiony, liczba kondygnacji jest ignorowana.",
  typology: "Typologia domu",
  detached: "Wolnostojący",
  semi: "Bliźniak",
  row: "Szeregowiec",
  risk_buffer_pct: "Bufor efektywności projektu (%)",
  parking_per_house: "Parkowanie / dom",
  advanced_title: "Zaawansowane założenia",
  parking_ratio: "Parkowanie kryte / mieszkanie",
  outdoor_ratio: "Parkowanie zewnętrzne / mieszkanie",
  paved_pct: "Nawierzchnie utwardzone (% terenu)",
  urban_risk_buffer: "Bufor ryzyka (%)",
  advanced_hint: "Zmniejsza PUB o niepewność regulacyjną/projektową",
  tt_land_area: "Całkowita powierzchnia działki w m².",
  tt_project_type: "Wybierz typ: Mieszkaniowy dla budynków wielorodzinnych, Parcelacja dla domów jednorodzinnych.",
  tt_iz: "Stosunek powierzchni zabudowy do powierzchni działki.",
  tt_kpp: "Wskaźnik intensywności zabudowy. Jeśli podany, zastępuje obliczenie kondygnacje × WZ.",
  tt_floors: "Liczba kondygnacji nadziemnych.",
  tt_non_res_pct: "Udział netto powierzchni użytkowej przeznaczonej na cele nieresydencjonalne.",
  tt_min_green_pct: "Minimalny udział powierzchni działki, który musi pozostać jako zieleń na gruncie.",
  tt_avg_apt: "Średnia powierzchnia użytkowa jednego mieszkania.",
  tt_mode: "Współczynnik efektywności (netto/brutto): Konserwatywny 72%, Realistyczny 75%, Efektywny 80%.",
  tt_green_on_structure: "Czy planowany jest zielony dach lub ogród na konstrukcji.",
  tt_public_roads_pct: "Udział całkowitej pow. terenu przeznaczony na drogi publiczne i infrastrukturę.",
  tt_green_pct: "Minimalny udział terenu, który musi być zielony (wymóg regulacyjny).",
  tt_paved_pct_house: "Udział powierzchni każdej działki pokryty nawierzchniami utwardzonymi.",
  tt_min_parcel_size: "Minimalna powierzchnia jednej działki budowlanej.",
  tt_max_plot_coverage: "Maksymalny udział działki pokryty przez budynek.",
  tt_floors_per_house: "Liczba kondygnacji nadziemnych na dom.",
  tt_kpp_house: "WIZ na działkę. Jeśli podany, zastępuje obliczenie kondygnacje × pow. zabudowy.",
  tt_typology: "Typologia domu wpływa na efektywną wielkość działki: Wolnostojący (100%), Bliźniak (85%), Szeregowiec (70%).",
  tt_risk_buffer_pct: "Redukcja pow. brutto uwzględniająca efektywność projektu.",
  tt_parking_per_house: "Liczba miejsc parkingowych wymaganych na dom.",
  tt_parking_ratio: "Liczba krytych miejsc parkingowych na mieszkanie.",
  tt_outdoor_ratio: "Liczba zewnętrznych miejsc parkingowych na mieszkanie.",
  tt_paved_pct: "Udział terenu przeznaczony na wewnętrzne drogi i parkingi.",
  tt_urban_risk_buffer: "Redukcja PUB brutto z tytułu niepewności regulacyjnej.",
};

const translations_hu = {
  title: "Telek adatok",
  land_area: "Telek teljes területe (m²)",
  iz: "Beépítési arány (BA) pl. 0,40",
  kpp: "Intenzitási mutató (IM) — vagy hagyja üresen",
  floors: "Felszín feletti szintek száma — vagy hagyja üresen",
  kpp_hint: "Ha IM meg van adva, a szintszám figyelmen kívül marad.",
  project_type: "Projekt típusa",
  building: "Lakóépület fejlesztés",
  subdivision: "Telekfelosztás / Családi házak",
  non_res_pct: "Nem lakás célú arány % (0–100)",
  min_green_pct: "Min. zöldfelület a talajon (%)",
  avg_apt: "Átlagos lakásterület (m²)",
  mode: "Számítási mód",
  conservative: "Konzervatív (72%)",
  realistic: "Realisztikus (75%)",
  efficient: "Hatékony (80%)",
  green_on_structure: "Zöldfelület a szerkezeten",
  sub_title: "Telekfelosztás paraméterei",
  public_roads_pct: "Közutak / infrastruktúra (%)",
  green_pct: "Min. zöldfelület a telken (%)",
  paved_pct_house: "Burkolt felületek / telek (%)",
  min_parcel_size: "Min. telekméret (m²)",
  max_plot_coverage: "Max. beépítési arány / ház (%)",
  floors_per_house: "Szintek száma (ház)",
  kpp_house: "IM / telkenként — vagy hagyja üresen",
  kpp_house_hint: "Ha IM meg van adva, a szintszám figyelmen kívül marad.",
  typology: "Ház típusa",
  detached: "Szabadon álló",
  semi: "Ikrésház",
  row: "Sorház",
  risk_buffer_pct: "Tervezési hatékonysági puffer (%)",
  parking_per_house: "Parkolás / ház",
  advanced_title: "Speciális feltételezések",
  parking_ratio: "Fedett parkolás / lakás",
  outdoor_ratio: "Külső parkolás / lakás",
  paved_pct: "Burkolt felületek (% telek)",
  urban_risk_buffer: "Kockázati puffer (%)",
  advanced_hint: "A bruttó alapterületet csökkenti a szabályozási/tervezési bizonytalanság miatt",
  tt_land_area: "A telek teljes területe m²-ben.",
  tt_project_type: "Válassza a fő típust: Lakóépület a társasházakhoz, Telekfelosztás az egyedi családi házakhoz.",
  tt_iz: "A beépített terület aránya a telek teljes területéhez.",
  tt_kpp: "Intenzitási mutató. Ha meg van adva, felülírja a szintszám × BA számítást.",
  tt_floors: "Felszín feletti szintek száma.",
  tt_non_res_pct: "A nem lakáscélú területek aránya.",
  tt_min_green_pct: "A telek minimálisan zöldfelületként megőrzendő aránya.",
  tt_avg_apt: "Egy lakás átlagos területe.",
  tt_mode: "Hatékonysági arány: Konzervatív 72%, Realisztikus 75%, Hatékony 80%.",
  tt_green_on_structure: "Tervezett-e zöldtető vagy emelt kert.",
  tt_public_roads_pct: "Közutak és infrastruktúra által elfoglalt terület aránya.",
  tt_green_pct: "A telek minimálisan zöldfelületként fenntartandó aránya.",
  tt_paved_pct_house: "Az egyes telkek burkolt felületeinek aránya.",
  tt_min_parcel_size: "Egy építési telek minimális mérete.",
  tt_max_plot_coverage: "Az épület által elfoglalható maximális telek-arány.",
  tt_floors_per_house: "Felszín feletti szintek száma házanként.",
  tt_kpp_house: "IM telkenként. Ha meg van adva, felülírja a szintszám × beépített terület számítást.",
  tt_typology: "A ház típusa befolyásolja a tényleges telekméret: Szabadon álló (100%), Ikerház (85%), Sorház (70%).",
  tt_risk_buffer_pct: "A bruttó alapterület csökkentése a tervezési hatékonyság miatt.",
  tt_parking_per_house: "Házonként szükséges parkolóhelyek száma.",
  tt_parking_ratio: "Fedett parkolóhelyek száma lakásonként.",
  tt_outdoor_ratio: "Külső parkolóhelyek száma lakásonként.",
  tt_paved_pct: "Belső utakra és parkolókra felhasznált terület aránya.",
  tt_urban_risk_buffer: "A bruttó alapterület csökkentése szabályozási bizonytalanság miatt.",
};

const translations_de = {
  title: "Grundstücks-Eingaben",
  land_area: "Gesamtgrundfläche (m²)",
  iz: "Grundflächenzahl (GRZ) z.B. 0,40",
  kpp: "Geschossflächenzahl (GFZ) — oder leer lassen",
  floors: "Anzahl Obergeschosse — oder leer lassen",
  kpp_hint: "Wenn GFZ gesetzt ist, wird die Geschosszahl ignoriert.",
  project_type: "Projekttyp",
  building: "Wohngebäudeentwicklung",
  subdivision: "Parzellierung / Einfamilienhäuser",
  non_res_pct: "Gewerbeflächenanteil % (0–100)",
  min_green_pct: "Min. Grünflächenanteil auf Terrain (%)",
  avg_apt: "Durchschnittliche Wohnungsgröße (m²)",
  mode: "Berechnungsmodus",
  conservative: "Konservativ (72%)",
  realistic: "Realistisch (75%)",
  efficient: "Effizient (80%)",
  green_on_structure: "Grünfläche auf Konstruktion",
  sub_title: "Parzellierungsparameter",
  public_roads_pct: "Öffentliche Wege / Infrastruktur (%)",
  green_pct: "Min. Grünflächenanteil (%)",
  paved_pct_house: "Versiegelte Flächen / Parzelle (%)",
  min_parcel_size: "Min. Parzellengrö­ße (m²)",
  max_plot_coverage: "Max. GRZ / Haus (%)",
  floors_per_house: "Geschosse / Haus",
  kpp_house: "GFZ / Parzelle — oder leer lassen",
  kpp_house_hint: "Wenn GFZ gesetzt ist, wird die Geschosszahl ignoriert.",
  typology: "Haustyp",
  detached: "Freistehend",
  semi: "Doppelhaus",
  row: "Reihenhaus",
  risk_buffer_pct: "Planungseffizienz-Puffer (%)",
  parking_per_house: "Stellplätze / Haus",
  advanced_title: "Erweiterte Annahmen",
  parking_ratio: "Überdachte Stellplätze / Whg.",
  outdoor_ratio: "Außenstellplätze / Whg.",
  paved_pct: "Versiegelte Flächen (% Grundstück)",
  urban_risk_buffer: "Risikopuffer (%)",
  advanced_hint: "Reduziert BGF um Regulierungs-/Planungsunsicherheit",
  tt_land_area: "Gesamtfläche des Grundstücks in m².",
  tt_project_type: "Wählen Sie den Hauptnutzungstyp: Wohngebäude für Mehrfamilienhäuser, Parzellierung für Einfamilienhäuser.",
  tt_iz: "Verhältnis der Bebauungsfläche zur Gesamtgrundstücksfläche.",
  tt_kpp: "Geschossflächenzahl. Wenn angegeben, überschreibt es die Berechnung Geschosse × GRZ.",
  tt_floors: "Anzahl der Obergeschosse.",
  tt_non_res_pct: "Anteil der Nettofläche für gewerbliche Nutzung.",
  tt_min_green_pct: "Mindestanteil der Grundstücksfläche als unbefestigte Grünfläche.",
  tt_avg_apt: "Durchschnittliche Nutzfläche einer Wohneinheit.",
  tt_mode: "Effizienzquote (Netto/Brutto): Konservativ 72%, Realistisch 75%, Effizient 80%.",
  tt_green_on_structure: "Ob ein Gründach oder erhöhter Garten geplant ist.",
  tt_public_roads_pct: "Anteil der Gesamtgrundstücksfläche für öffentliche Wege und Infrastruktur.",
  tt_green_pct: "Mindestanteil des Gesamtgeländes als Grünfläche (regulatorische Anforderung).",
  tt_paved_pct_house: "Anteil jeder Parzellenfläche mit befestigten Oberflächen.",
  tt_min_parcel_size: "Mindestgröße eines einzelnen Baugrundstücks.",
  tt_max_plot_coverage: "Maximaler Anteil einer einzelnen Parzelle, der bebaut werden darf.",
  tt_floors_per_house: "Anzahl der Obergeschosse pro Haus.",
  tt_kpp_house: "GFZ pro Parzelle. Wenn angegeben, überschreibt Geschosse × Bebauungsfläche.",
  tt_typology: "Haustyp beeinflusst effektive Parzellengrö­ße: Freistehend (100%), Doppelhaus (85%), Reihenhaus (70%).",
  tt_risk_buffer_pct: "Reduzierung der BGF für Planungseffizienz und Bautoleranzen.",
  tt_parking_per_house: "Anzahl der benötigten Stellplätze pro Haus.",
  tt_parking_ratio: "Anzahl überdachter Stellplätze pro Wohnung.",
  tt_outdoor_ratio: "Anzahl der Außenstellplätze pro Wohnung.",
  tt_paved_pct: "Anteil der Grundstücksfläche für interne Wege und Parkplätze.",
  tt_urban_risk_buffer: "Reduzierung der BGF für Regulierungsunsicherheit.",
};

function LabelWithTooltip({ label, tooltip }) {
  return (
    <div className="flex items-center gap-1.5">
      <Label>{label}</Label>
      {tooltip && <InfoTooltip content={tooltip} />}
    </div>
  );
}

export default function FeasibilityInputs({ inputs, onChange, language = 'sk' }) {
  const t = translations[language] || translations.sk;
  const set = (key, value) => onChange({ ...inputs, [key]: value });
  const isSubdivision = inputs.project_type === 'subdivision';
  // Normalize: treat 'residential'/'mixed' (legacy) as 'building'
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Always shown */}
            <div className="space-y-1">
              <LabelWithTooltip label={t.land_area} tooltip={t.tt_land_area} />
              <Input type="number" value={inputs.land_area ?? ''} onChange={e => set('land_area', parseFloat(e.target.value) || 0)} />
            </div>

            <div className="space-y-1">
              <LabelWithTooltip label={t.project_type} tooltip={t.tt_project_type} />
              <Select value={inputs.project_type === 'subdivision' ? 'subdivision' : 'building'} onValueChange={v => set('project_type', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="building">{t.building}</SelectItem>
                  <SelectItem value="subdivision">{t.subdivision}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Block / Mixed mode fields */}
            {!isSubdivision && (
              <>
                <div className="space-y-1">
                  <LabelWithTooltip label={t.iz} tooltip={t.tt_iz} />
                  <Input type="number" step="0.01" value={inputs.iz ?? ''} onChange={e => set('iz', parseFloat(e.target.value) || 0)} />
                </div>
                <div className="space-y-1">
                  <LabelWithTooltip label={t.kpp} tooltip={t.tt_kpp} />
                  <Input type="number" step="0.1" placeholder="—" value={inputs.kpp ?? ''} onChange={e => set('kpp', e.target.value === '' ? null : parseFloat(e.target.value))} />
                </div>
                <div className="space-y-1">
                  <LabelWithTooltip label={t.floors} tooltip={t.tt_floors} />
                  <Input type="number" placeholder="—" value={inputs.floors ?? ''} onChange={e => set('floors', e.target.value === '' ? null : parseInt(e.target.value))} />
                  <p className="text-xs text-muted-foreground">{t.kpp_hint}</p>
                </div>
                <div className="space-y-1">
                  <LabelWithTooltip label={t.non_res_pct} tooltip={t.tt_non_res_pct} />
                  <Input type="number" min="0" max="100" value={(inputs.non_residential_pct ?? 0) * 100} onChange={e => set('non_residential_pct', (parseFloat(e.target.value) || 0) / 100)} />
                </div>
                <div className="space-y-1">
                  <LabelWithTooltip label={t.min_green_pct} tooltip={t.tt_min_green_pct} />
                  <Input type="number" min="0" max="100" value={(inputs.min_green_pct ?? 20) * 100} onChange={e => set('min_green_pct', (parseFloat(e.target.value) || 0) / 100)} />
                </div>
                <div className="space-y-1">
                  <LabelWithTooltip label={t.avg_apt} tooltip={t.tt_avg_apt} />
                  <Input type="number" value={inputs.avg_apartment_size ?? 60} onChange={e => set('avg_apartment_size', parseFloat(e.target.value) || 60)} />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <LabelWithTooltip label={t.mode} tooltip={t.tt_mode} />
                  <Select value={inputs.mode ?? 'realistic'} onValueChange={v => set('mode', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conservative">{t.conservative}</SelectItem>
                      <SelectItem value="realistic">{t.realistic}</SelectItem>
                      <SelectItem value="efficient">{t.efficient}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-3 sm:col-span-2">
                  <Switch checked={!!inputs.green_on_structure} onCheckedChange={v => set('green_on_structure', v)} />
                  <LabelWithTooltip label={t.green_on_structure} tooltip={t.tt_green_on_structure} />
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Subdivision-specific inputs */}
      {isSubdivision && (
        <Card>
          <CardHeader>
            <CardTitle>{t.sub_title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <LabelWithTooltip label={t.public_roads_pct} tooltip={t.tt_public_roads_pct} />
                <Input type="number" min="0" max="59" value={Math.round((inputs.public_roads_pct ?? 0.20) * 100)} onChange={e => set('public_roads_pct', (parseFloat(e.target.value) || 0) / 100)} />
              </div>
              <div className="space-y-1">
                <LabelWithTooltip label={t.green_pct} tooltip={t.tt_green_pct} />
                <Input type="number" min="0" max="59" value={Math.round((inputs.green_pct ?? 0.10) * 100)} onChange={e => set('green_pct', (parseFloat(e.target.value) || 0) / 100)} />
              </div>
              <div className="space-y-1">
                <LabelWithTooltip label={t.min_parcel_size} tooltip={t.tt_min_parcel_size} />
                <Input type="number" min="250" value={inputs.min_parcel_size ?? 600} onChange={e => set('min_parcel_size', parseFloat(e.target.value) || 600)} />
              </div>
              <div className="space-y-1">
                <LabelWithTooltip label={t.max_plot_coverage} tooltip={t.tt_max_plot_coverage} />
                <Input type="number" min="1" max="50" value={Math.round((inputs.max_plot_coverage ?? 0.30) * 100)} onChange={e => set('max_plot_coverage', (parseFloat(e.target.value) || 30) / 100)} />
              </div>
              <div className="space-y-1">
                <LabelWithTooltip label={t.kpp_house} tooltip={t.tt_kpp_house} />
                <Input type="number" step="0.1" placeholder="—" value={inputs.kpp_house ?? ''} onChange={e => set('kpp_house', e.target.value === '' ? null : parseFloat(e.target.value))} />
                <p className="text-xs text-muted-foreground">{t.kpp_house_hint}</p>
              </div>
              <div className="space-y-1">
                <LabelWithTooltip label={t.floors_per_house} tooltip={t.tt_floors_per_house} />
                <Input type="number" min="1" max="4" value={inputs.floors_per_house ?? 2} onChange={e => set('floors_per_house', parseInt(e.target.value) || 2)} />
              </div>
              <div className="space-y-1">
                <LabelWithTooltip label={t.typology} tooltip={t.tt_typology} />
                <Select value={inputs.typology ?? 'detached'} onValueChange={v => set('typology', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="detached">{t.detached}</SelectItem>
                    <SelectItem value="semi">{t.semi}</SelectItem>
                    <SelectItem value="row">{t.row}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <LabelWithTooltip label={t.parking_per_house} tooltip={t.tt_parking_per_house} />
                <Input type="number" min="0" max="10" value={inputs.parking_per_house ?? 2} onChange={e => set('parking_per_house', parseInt(e.target.value) || 2)} />
              </div>
              <div className="space-y-1">
                <LabelWithTooltip label={t.paved_pct_house} tooltip={t.tt_paved_pct_house} />
                <Input type="number" min="0" max="50" value={Math.round((inputs.paved_pct_house ?? 0.10) * 100)} onChange={e => set('paved_pct_house', (parseFloat(e.target.value) || 0) / 100)} />
              </div>
              <div className="space-y-1">
                <LabelWithTooltip label={t.risk_buffer_pct} tooltip={t.tt_risk_buffer_pct} />
                <Input type="number" min="0" max="30" value={Math.round((inputs.risk_buffer_pct ?? 0.10) * 100)} onChange={e => set('risk_buffer_pct', (parseFloat(e.target.value) || 0) / 100)} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Advanced assumptions — Block/Mixed only */}
      {!isSubdivision && (
        <Card>
          <CardHeader
            className="cursor-pointer select-none"
            onClick={() => setShowAdvanced(v => !v)}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                {t.advanced_title}
              </CardTitle>
              {showAdvanced ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </div>
          </CardHeader>
          {showAdvanced && (
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <LabelWithTooltip label={t.parking_ratio} tooltip={t.tt_parking_ratio} />
                  <Input type="number" step="0.1" min="0" max="5" value={inputs.parking_ratio ?? 1.2} onChange={e => set('parking_ratio', parseFloat(e.target.value) || 1.2)} />
                </div>
                <div className="space-y-1">
                  <LabelWithTooltip label={t.outdoor_ratio} tooltip={t.tt_outdoor_ratio} />
                  <Input type="number" step="0.1" min="0" max="5" value={inputs.outdoor_ratio ?? 0.1} onChange={e => set('outdoor_ratio', parseFloat(e.target.value) || 0)} />
                </div>
                <div className="space-y-1">
                  <LabelWithTooltip label={t.paved_pct} tooltip={t.tt_paved_pct} />
                  <Input type="number" min="0" max="50" value={Math.round((inputs.paved_pct ?? 0.15) * 100)} onChange={e => set('paved_pct', (parseFloat(e.target.value) || 0) / 100)} />
                </div>
                <div className="space-y-1">
                  <LabelWithTooltip label={t.urban_risk_buffer} tooltip={t.tt_urban_risk_buffer} />
                  <Input type="number" min="0" max="30" value={Math.round((inputs.urban_risk_buffer ?? 0.10) * 100)} onChange={e => set('urban_risk_buffer', (parseFloat(e.target.value) || 0) / 100)} />
                  <p className="text-xs text-muted-foreground">{t.advanced_hint}</p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}