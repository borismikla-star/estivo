import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
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
    m2: "m²",
    pcs: "ks",
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
translations.en.warnings.parcel_balance_mismatch = "Parcel balance mismatch – parcel components do not sum to average parcel size.";

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

function ParcelBreakdown({ pb, t }) {
  if (!pb || pb.number_of_parcels < 1) return null;

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