import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

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
    development_area: "Development Area",
    roads_area: "Public Roads Area",
    green_area: "Green Areas",
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
    }
  },
  sk: {
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
    development_area: "Rozvojová plocha",
    roads_area: "Verejné komunikácie",
    green_area: "Zelené plochy",
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
    }
  },
};

const ResultRow = ({ label, value, unit, highlight }) => (
  <div className={`flex justify-between items-center py-2 border-b border-border ${highlight ? 'bg-accent/10 px-2 rounded' : ''}`}>
    <span className="text-sm text-muted-foreground">{label}</span>
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

function SubdivisionResults({ results, t }) {
  const rows = [
    { key: 'land_area', unit: t.m2 },
    { key: 'roads_area', unit: t.m2 },
    { key: 'green_area', unit: t.m2 },
    { key: 'development_area', unit: t.m2, highlight: true },
    { key: 'number_of_parcels', unit: t.pcs, highlight: true },
    { key: 'avg_parcel_size', unit: t.m2 },
    { key: 'footprint_per_house', unit: t.m2 },
    { key: 'hpp_per_house', unit: t.m2 },
    { key: 'total_hpp', unit: t.m2 },
    { key: 'effective_total_hpp', unit: t.m2, highlight: true },
    { key: 'total_built_footprint', unit: t.m2 },
    { key: 'total_paved_area', unit: t.m2 },
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
            label={t[row.key]}
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
          {results.validations.map((v, i) => (
            <div key={i} className={`flex items-start gap-2 p-3 rounded-lg text-sm ${v.type === 'error' ? 'bg-destructive/10 text-destructive' : 'bg-amber-50 text-amber-800'}`}>
              {v.type === 'error' ? <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" /> : <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />}
              {t.warnings[v.key] || v.key}
            </div>
          ))}
        </div>
      )}

      {isSubdivision
        ? <SubdivisionResults results={results} t={t} />
        : <BlockResults results={results} t={t} />
      }
    </div>
  );
}