import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

const translations = {
  en: {
    title: "Feasibility Output",
    disclaimer: "Concept-level estimation – no architectural study",
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
    paved_area: "Paved Areas",
    green_terrain: "Green on Ground",
    green_on_structure: "Green on Structure",
    cellars_area: "Cellars",
    apartment_count: "Est. Apartment Count",
    m2: "m²",
    pcs: "pcs",
    warnings: {
      cpp_exceeds_hpp: "NFA exceeds GFA – check KPP/floors input.",
      green_below_minimum: "Green on ground is below minimum requirement.",
      parking_insufficient: "Parking places are insufficient for apartment count.",
    }
  },
  sk: {
    title: "Výstupy konceptu",
    disclaimer: "Concept-level estimation – no architectural study",
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
    paved_area: "Spevnené plochy",
    green_terrain: "Zeleň na teréne",
    green_on_structure: "Zeleň na konštrukcii",
    cellars_area: "Pivnice",
    apartment_count: "Odhad počtu bytov",
    m2: "m²",
    pcs: "ks",
    warnings: {
      cpp_exceeds_hpp: "ČPP presahuje HPP – skontrolujte KPP alebo počet podlaží.",
      green_below_minimum: "Zeleň na teréne je nižšia ako regulatívne minimum.",
      parking_insufficient: "Počet parkovacích miest je nedostatočný.",
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

export default function FeasibilityResults({ results, language = 'sk' }) {
  const t = translations[language] || translations.sk;

  if (!results) return null;

  const rows = [
    { key: 'land_area', unit: t.m2, highlight: false },
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
    <div className="space-y-4">
      {/* Validations */}
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
    </div>
  );
}