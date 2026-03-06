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
    residential: "Block / Residential",
    mixed: "Mixed Use",
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
  },
  sk: {
    title: "Vstupné údaje pozemku",
    land_area: "Celková výmera pozemku (m²)",
    iz: "Index zastavanosti (IZ) napr. 0,40",
    kpp: "KPP (koeficient podlažných plôch) — alebo nechajte prázdne",
    floors: "Počet nadzemných podlaží — alebo nechajte prázdne",
    kpp_hint: "Ak je zadaný KPP, počet podlaží sa ignoruje.",
    project_type: "Typ projektu",
    residential: "Block / Rezidenčný",
    mixed: "Zmiešaný",
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
  },
};

export default function FeasibilityInputs({ inputs, onChange, language = 'sk' }) {
  const t = translations[language] || translations.sk;
  const set = (key, value) => onChange({ ...inputs, [key]: value });
  const isSubdivision = inputs.project_type === 'subdivision';
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
              <Label>{t.land_area}</Label>
              <Input type="number" value={inputs.land_area ?? ''} onChange={e => set('land_area', parseFloat(e.target.value) || 0)} />
            </div>

            <div className="space-y-1">
              <Label>{t.project_type}</Label>
              <Select value={inputs.project_type ?? 'residential'} onValueChange={v => set('project_type', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">{t.residential}</SelectItem>
                  <SelectItem value="mixed">{t.mixed}</SelectItem>
                  <SelectItem value="subdivision">{t.subdivision}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Block / Mixed mode fields */}
            {!isSubdivision && (
              <>
                <div className="space-y-1">
                  <Label>{t.iz}</Label>
                  <Input type="number" step="0.01" value={inputs.iz ?? ''} onChange={e => set('iz', parseFloat(e.target.value) || 0)} />
                </div>
                <div className="space-y-1">
                  <Label>{t.kpp}</Label>
                  <Input type="number" step="0.1" placeholder="—" value={inputs.kpp ?? ''} onChange={e => set('kpp', e.target.value === '' ? null : parseFloat(e.target.value))} />
                </div>
                <div className="space-y-1">
                  <Label>{t.floors}</Label>
                  <Input type="number" placeholder="—" value={inputs.floors ?? ''} onChange={e => set('floors', e.target.value === '' ? null : parseInt(e.target.value))} />
                  <p className="text-xs text-muted-foreground">{t.kpp_hint}</p>
                </div>
                <div className="space-y-1">
                  <Label>{t.non_res_pct}</Label>
                  <Input type="number" min="0" max="100" value={(inputs.non_residential_pct ?? 0) * 100} onChange={e => set('non_residential_pct', (parseFloat(e.target.value) || 0) / 100)} />
                </div>
                <div className="space-y-1">
                  <Label>{t.min_green_pct}</Label>
                  <Input type="number" min="0" max="100" value={(inputs.min_green_pct ?? 20) * 100} onChange={e => set('min_green_pct', (parseFloat(e.target.value) || 0) / 100)} />
                </div>
                <div className="space-y-1">
                  <Label>{t.avg_apt}</Label>
                  <Input type="number" value={inputs.avg_apartment_size ?? 60} onChange={e => set('avg_apartment_size', parseFloat(e.target.value) || 60)} />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <Label>{t.mode}</Label>
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
                  <Label>{t.green_on_structure}</Label>
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
                <Label>{t.public_roads_pct}</Label>
                <Input type="number" min="0" max="59" value={Math.round((inputs.public_roads_pct ?? 0.20) * 100)} onChange={e => set('public_roads_pct', (parseFloat(e.target.value) || 0) / 100)} />
              </div>
              <div className="space-y-1">
                <Label>{t.green_pct}</Label>
                <Input type="number" min="0" max="59" value={Math.round((inputs.green_pct ?? 0.10) * 100)} onChange={e => set('green_pct', (parseFloat(e.target.value) || 0) / 100)} />
              </div>
              <div className="space-y-1">
                <Label>{t.min_parcel_size}</Label>
                <Input type="number" min="250" value={inputs.min_parcel_size ?? 600} onChange={e => set('min_parcel_size', parseFloat(e.target.value) || 600)} />
              </div>
              <div className="space-y-1">
                <Label>{t.max_plot_coverage}</Label>
                <Input type="number" min="1" max="50" value={Math.round((inputs.max_plot_coverage ?? 0.30) * 100)} onChange={e => set('max_plot_coverage', (parseFloat(e.target.value) || 30) / 100)} />
              </div>
              <div className="space-y-1">
                <Label>{t.kpp_house}</Label>
                <Input type="number" step="0.1" placeholder="—" value={inputs.kpp_house ?? ''} onChange={e => set('kpp_house', e.target.value === '' ? null : parseFloat(e.target.value))} />
                <p className="text-xs text-muted-foreground">{t.kpp_house_hint}</p>
              </div>
              <div className="space-y-1">
                <Label>{t.floors_per_house}</Label>
                <Input type="number" min="1" max="4" value={inputs.floors_per_house ?? 2} onChange={e => set('floors_per_house', parseInt(e.target.value) || 2)} />
              </div>
              <div className="space-y-1">
                <Label>{t.typology}</Label>
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
                <Label>{t.parking_per_house}</Label>
                <Input type="number" min="0" max="10" value={inputs.parking_per_house ?? 2} onChange={e => set('parking_per_house', parseInt(e.target.value) || 2)} />
              </div>
              <div className="space-y-1">
                <Label>{t.paved_pct_house}</Label>
                <Input type="number" min="0" max="50" value={Math.round((inputs.paved_pct_house ?? 0.10) * 100)} onChange={e => set('paved_pct_house', (parseFloat(e.target.value) || 0) / 100)} />
              </div>
              <div className="space-y-1">
                <Label>{t.risk_buffer_pct}</Label>
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
                  <Label>{t.parking_ratio}</Label>
                  <Input type="number" step="0.1" min="0" max="5" value={inputs.parking_ratio ?? 1.2} onChange={e => set('parking_ratio', parseFloat(e.target.value) || 1.2)} />
                </div>
                <div className="space-y-1">
                  <Label>{t.outdoor_ratio}</Label>
                  <Input type="number" step="0.1" min="0" max="5" value={inputs.outdoor_ratio ?? 0.1} onChange={e => set('outdoor_ratio', parseFloat(e.target.value) || 0)} />
                </div>
                <div className="space-y-1">
                  <Label>{t.paved_pct}</Label>
                  <Input type="number" min="0" max="50" value={Math.round((inputs.paved_pct ?? 0.15) * 100)} onChange={e => set('paved_pct', (parseFloat(e.target.value) || 0) / 100)} />
                </div>
                <div className="space-y-1">
                  <Label>{t.urban_risk_buffer}</Label>
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