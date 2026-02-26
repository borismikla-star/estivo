import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const translations = {
  en: {
    title: "Land & Regulatory Inputs",
    land_area: "Total Land Area (m²)",
    iz: "Plot Coverage Ratio (IZ) e.g. 0.40",
    kpp: "Floor Area Ratio (KPP) — or leave empty",
    floors: "Number of Above-Ground Floors — or leave empty",
    kpp_hint: "If KPP is set, floors are ignored.",
    project_type: "Project Type",
    residential: "Residential",
    mixed: "Mixed Use",
    non_res_pct: "Non-Residential % (0–100)",
    min_green_pct: "Min. Green on Ground (%)",
    avg_apt: "Average Apartment Size (m²)",
    mode: "Calculation Mode",
    conservative: "Conservative (72%)",
    realistic: "Realistic (75%)",
    efficient: "Efficient (80%)",
    green_on_structure: "Include Green on Structure",
  },
  sk: {
    title: "Vstupné údaje pozemku",
    land_area: "Celková výmera pozemku (m²)",
    iz: "Index zastavanosti (IZ) napr. 0,40",
    kpp: "KPP (koeficient podlažných plôch) — alebo nechajte prázdne",
    floors: "Počet nadzemných podlaží — alebo nechajte prázdne",
    kpp_hint: "Ak je zadaný KPP, počet podlaží sa ignoruje.",
    project_type: "Typ projektu",
    residential: "Rezidenčný",
    mixed: "Zmiešaný",
    non_res_pct: "Nebytové priestory % (0–100)",
    min_green_pct: "Min. % zelene na teréne",
    avg_apt: "Priemerná výmera bytu (m²)",
    mode: "Režim výpočtu",
    conservative: "Konzervatívny (72%)",
    realistic: "Realistický (75%)",
    efficient: "Efektívny (80%)",
    green_on_structure: "Zeleň na konštrukcii",
  },
};

export default function FeasibilityInputs({ inputs, onChange, language = 'sk' }) {
  const t = translations[language] || translations.sk;

  const set = (key, value) => onChange({ ...inputs, [key]: value });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>{t.land_area}</Label>
            <Input type="number" value={inputs.land_area ?? ''} onChange={e => set('land_area', parseFloat(e.target.value) || 0)} />
          </div>
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
            <Label>{t.project_type}</Label>
            <Select value={inputs.project_type ?? 'residential'} onValueChange={v => set('project_type', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="residential">{t.residential}</SelectItem>
                <SelectItem value="mixed">{t.mixed}</SelectItem>
              </SelectContent>
            </Select>
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
        </div>
      </CardContent>
    </Card>
  );
}