import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { currencyFormatter, percentFormatter } from '../../lib/formatters';
import InfoTooltip from '@/components/shared/InfoTooltip';

export default function FinancingInputs({ data, totalCosts, totalRevenue, language, onChange }) {
  const translations = {
    sk: {
      title: "Financovanie",
      basic: "Základné",
      phased: "Fázované",
      own_resources: "Vlastné zdroje (%)",
      own_resources_tooltip: "Percento celkových nákladov krytých vlastnými zdrojmi (napr. 30 = 30%)",
      bank_loan: "Úroková sadzba úveru (%)",
      bank_loan_tooltip: "Ročná úroková sadzba bankového úveru",
      interest_rate: "Úroková sadzba (%)",
      interest_rate_tooltip: "Ročná úroková sadzba úveru",
      loan_term: "Doba úveru (mesiace)",
      loan_term_tooltip: "Trvanie úverového obdobia v mesiacoch",
      project_duration: "Trvanie projektu (mesiace)",
      project_duration_tooltip: "Celková dĺžka projektu od začiatku po dokončenie",
      total_costs_label: "Celkové náklady",
      total_revenue_label: "Celkové tržby",
      financing_summary: "Súhrn financovania",
      
      // Phased financing
      phase_preparation: "Prípravná fáza",
      phase_construction: "Stavebná fáza",
      phase_sales: "Predajná fáza",
      duration_months: "Trvanie (mesiace)",
      loan_drawdown_pct: "Čerpanie úveru (%)",
      interest_rate_phase: "Úroková sadzba (%)",
      preparation_tooltip: "Prípravná fáza - nákup pozemku, projektová dokumentácia, povolenia",
      construction_tooltip: "Stavebná fáza - realizácia výstavby, engineering",
      sales_tooltip: "Predajná fáza - marketing, predaj, odovzdávanie jednotiek",
      loan_drawdown_tooltip: "Percentuálny podiel celkového úveru čerpaný v tejto fáze",
    },
    en: {
      title: "Financing",
      basic: "Basic",
      phased: "Phased",
      own_resources: "Own Resources (%)",
      own_resources_tooltip: "Percentage of total costs covered by equity (e.g., 30 = 30%)",
      bank_loan: "Bank Interest Rate (%)",
      bank_loan_tooltip: "Annual interest rate on the bank loan",
      interest_rate: "Interest Rate (%)",
      interest_rate_tooltip: "Annual interest rate on the loan",
      loan_term: "Loan Term (months)",
      loan_term_tooltip: "Duration of the loan period in months",
      project_duration: "Project Duration (months)",
      project_duration_tooltip: "Total length of project from start to completion",
      total_costs_label: "Total Costs",
      total_revenue_label: "Total Revenue",
      financing_summary: "Financing Summary",
      
      // Phased financing
      phase_preparation: "Preparation Phase",
      phase_construction: "Construction Phase",
      phase_sales: "Sales Phase",
      duration_months: "Duration (months)",
      loan_drawdown_pct: "Loan Drawdown (%)",
      interest_rate_phase: "Interest Rate (%)",
      preparation_tooltip: "Preparation phase - land acquisition, project documentation, permits",
      construction_tooltip: "Construction phase - building realization, engineering",
      sales_tooltip: "Sales phase - marketing, sales, unit handover",
      loan_drawdown_tooltip: "Percentage of total loan drawn in this phase",
    },
    pl: {
      title: "Finansowanie",
      basic: "Podstawowe",
      phased: "Fazowane",
      own_resources: "Środki własne (%)",
      own_resources_tooltip: "Procent całkowitych kosztów pokrywany kapitałem własnym (np. 30 = 30%)",
      bank_loan: "Oprocentowanie kredytu (%)",
      bank_loan_tooltip: "Roczna stopa procentowa kredytu bankowego",
      interest_rate: "Stopa procentowa (%)",
      interest_rate_tooltip: "Roczna stopa procentowa kredytu",
      loan_term: "Okres kredytu (miesiące)",
      loan_term_tooltip: "Okres trwania kredytu w miesiącach",
      project_duration: "Czas trwania projektu (miesiące)",
      project_duration_tooltip: "Całkowity czas projektu od początku do końca",
      total_costs_label: "Całkowite koszty",
      total_revenue_label: "Całkowite przychody",
      financing_summary: "Podsumowanie finansowania",
      
      phase_preparation: "Faza przygotowawcza",
      phase_construction: "Faza budowy",
      phase_sales: "Faza sprzedaży",
      duration_months: "Czas trwania (miesiące)",
      loan_drawdown_pct: "Wykorzystanie kredytu (%)",
      interest_rate_phase: "Stopa procentowa (%)",
      preparation_tooltip: "Faza przygotowawcza - zakup gruntu, dokumentacja, pozwolenia",
      construction_tooltip: "Faza budowy - realizacja budowy, engineering",
      sales_tooltip: "Faza sprzedaży - marketing, sprzedaż, przekazanie lokali",
      loan_drawdown_tooltip: "Procent całkowitego kredytu czerpany w tej fazie",
    },
    hu: {
      title: "Finanszírozás",
      basic: "Alap",
      phased: "Fázisolt",
      own_resources: "Saját források (%)",
      own_resources_tooltip: "A teljes költségek saját tőkéből fedezett százaléka (pl. 30 = 30%)",
      bank_loan: "Hitel kamatlába (%)",
      bank_loan_tooltip: "A bankhitel éves kamatlába",
      interest_rate: "Kamatláb (%)",
      interest_rate_tooltip: "A hitel éves kamatlába",
      loan_term: "Hitel futamideje (hónap)",
      loan_term_tooltip: "A hitelperiódus időtartama hónapokban",
      project_duration: "Projekt időtartam (hónap)",
      project_duration_tooltip: "A projekt teljes hossza a kezdettől a befejezésig",
      total_costs_label: "Összes költség",
      total_revenue_label: "Összes bevétel",
      financing_summary: "Finanszírozási összefoglaló",
      
      phase_preparation: "Előkészítési fázis",
      phase_construction: "Építési fázis",
      phase_sales: "Értékesítési fázis",
      duration_months: "Időtartam (hónap)",
      loan_drawdown_pct: "Hitel lehívás (%)",
      interest_rate_phase: "Kamatláb (%)",
      preparation_tooltip: "Előkészítési fázis - telek vásárlás, projektdokumentáció, engedélyek",
      construction_tooltip: "Építési fázis - építés megvalósítás, engineering",
      sales_tooltip: "Értékesítési fázis - marketing, értékesítés, lakások átadása",
      loan_drawdown_tooltip: "A teljes hitel százalékos aránya ebben a fázisban",
    },
    de: {
      title: "Finanzierung",
      basic: "Basis",
      phased: "Phasenweise",
      own_resources: "Eigenkapital (%)",
      own_resources_tooltip: "Prozentsatz der Gesamtkosten aus Eigenkapital (z.B. 30 = 30%)",
      bank_loan: "Darlehenszinssatz (%)",
      bank_loan_tooltip: "Jährlicher Zinssatz des Bankdarlehens",
      interest_rate: "Zinssatz (%)",
      interest_rate_tooltip: "Jährlicher Zinssatz des Darlehens",
      loan_term: "Darlehenslaufzeit (Monate)",
      loan_term_tooltip: "Dauer der Darlehensperiode in Monaten",
      project_duration: "Projektdauer (Monate)",
      project_duration_tooltip: "Gesamtlänge des Projekts von Anfang bis Ende",
      total_costs_label: "Gesamtkosten",
      total_revenue_label: "Gesamteinnahmen",
      financing_summary: "Finanzierungszusammenfassung",
      
      phase_preparation: "Vorbereitungsphase",
      phase_construction: "Bauphase",
      phase_sales: "Verkaufsphase",
      duration_months: "Dauer (Monate)",
      loan_drawdown_pct: "Darlehensinanspruchnahme (%)",
      interest_rate_phase: "Zinssatz (%)",
      preparation_tooltip: "Vorbereitungsphase - Grundstückskauf, Projektdokumentation, Genehmigungen",
      construction_tooltip: "Bauphase - Baurealisierung, Engineering",
      sales_tooltip: "Verkaufsphase - Marketing, Verkauf, Wohnungsübergabe",
      loan_drawdown_tooltip: "Prozentsatz des Gesamtdarlehens in dieser Phase",
    }
  };

  const t = translations[language] || translations.en;
  const safeData = data || {};

  const handleChange = (field, value) => {
    onChange({ ...safeData, [field]: parseFloat(value) || 0 });
  };

  const handlePhasedChange = (phase, field, value) => {
    const phases = safeData.phases || {
      preparation: { duration: 6, loan_drawdown_pct: 20, interest_rate: 5 },
      construction: { duration: 12, loan_drawdown_pct: 60, interest_rate: 5 },
      sales: { duration: 6, loan_drawdown_pct: 20, interest_rate: 4.5 }
    };
    
    onChange({
      ...safeData,
      phases: {
        ...phases,
        [phase]: {
          ...phases[phase],
          [field]: parseFloat(value) || 0
        }
      }
    });
  };

  const ownResourcesPercent = safeData.own_resources_percent || 30;
  const ownResources = totalCosts * (ownResourcesPercent / 100);
  const bankResources = totalCosts * ((100 - ownResourcesPercent) / 100);
  const totalFinancing = ownResources + bankResources;
  const financingGap = totalCosts - totalFinancing;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">{t.title}</h3>
      
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="basic">{t.basic}</TabsTrigger>
          <TabsTrigger value="phased">{t.phased}</TabsTrigger>
        </TabsList>

        {/* Basic Financing Tab */}
        <TabsContent value="basic" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="own_resources_percent" className="flex items-center gap-2">
              {t.own_resources} <span className="text-destructive">*</span>
              <InfoTooltip content={t.own_resources_tooltip} />
            </Label>
            <Input
              id="own_resources_percent"
              type="number"
              min="0"
              max="100"
              step="1"
              placeholder="30"
              value={safeData.own_resources_percent || ""}
              onChange={(e) => handleChange('own_resources_percent', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bank_interest_percent" className="flex items-center gap-2">
              {t.bank_loan} <span className="text-destructive">*</span>
              <InfoTooltip content={t.bank_loan_tooltip} />
            </Label>
            <Input
              id="bank_interest_percent"
              type="number"
              min="0"
              max="100"
              step="0.1"
              placeholder="6"
              value={safeData.bank_interest_percent || ""}
              onChange={(e) => handleChange('bank_interest_percent', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="loan_term" className="flex items-center gap-2">
              {t.loan_term}
              <InfoTooltip content={t.loan_term_tooltip} />
            </Label>
            <Input
              id="loan_term"
              type="number"
              min="1"
              step="1"
              value={safeData.loan_term || ""}
              onChange={(e) => handleChange('loan_term', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project_duration_months" className="flex items-center gap-2">
              {t.project_duration} <span className="text-destructive">*</span>
              <InfoTooltip content={t.project_duration_tooltip} />
            </Label>
            <Input
              id="project_duration_months"
              type="number"
              min="1"
              step="1"
              placeholder="24"
              value={safeData.project_duration_months || ""}
              onChange={(e) => handleChange('project_duration_months', e.target.value)}
              required
            />
          </div>
        </TabsContent>

        {/* Phased Financing Tab */}
        <TabsContent value="phased" className="space-y-6">
          {/* Preparation Phase */}
          <div className="p-4 border rounded-lg bg-muted/20">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              {t.phase_preparation}
              <InfoTooltip content={t.preparation_tooltip} />
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">{t.duration_months}</Label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={safeData.phases?.preparation?.duration || 6}
                  onChange={(e) => handlePhasedChange('preparation', 'duration', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs flex items-center gap-1">
                  {t.loan_drawdown_pct}
                  <InfoTooltip content={t.loan_drawdown_tooltip} />
                </Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={safeData.phases?.preparation?.loan_drawdown_pct || 20}
                  onChange={(e) => handlePhasedChange('preparation', 'loan_drawdown_pct', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{t.interest_rate_phase}</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={safeData.phases?.preparation?.interest_rate || 5}
                  onChange={(e) => handlePhasedChange('preparation', 'interest_rate', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Construction Phase */}
          <div className="p-4 border rounded-lg bg-muted/20">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              {t.phase_construction}
              <InfoTooltip content={t.construction_tooltip} />
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">{t.duration_months}</Label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={safeData.phases?.construction?.duration || 12}
                  onChange={(e) => handlePhasedChange('construction', 'duration', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs flex items-center gap-1">
                  {t.loan_drawdown_pct}
                  <InfoTooltip content={t.loan_drawdown_tooltip} />
                </Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={safeData.phases?.construction?.loan_drawdown_pct || 60}
                  onChange={(e) => handlePhasedChange('construction', 'loan_drawdown_pct', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{t.interest_rate_phase}</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={safeData.phases?.construction?.interest_rate || 5}
                  onChange={(e) => handlePhasedChange('construction', 'interest_rate', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Sales Phase */}
          <div className="p-4 border rounded-lg bg-muted/20">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              {t.phase_sales}
              <InfoTooltip content={t.sales_tooltip} />
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">{t.duration_months}</Label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={safeData.phases?.sales?.duration || 6}
                  onChange={(e) => handlePhasedChange('sales', 'duration', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs flex items-center gap-1">
                  {t.loan_drawdown_pct}
                  <InfoTooltip content={t.loan_drawdown_tooltip} />
                </Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={safeData.phases?.sales?.loan_drawdown_pct || 20}
                  onChange={(e) => handlePhasedChange('sales', 'loan_drawdown_pct', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{t.interest_rate_phase}</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={safeData.phases?.sales?.interest_rate || 4.5}
                  onChange={(e) => handlePhasedChange('sales', 'interest_rate', e.target.value)}
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Financing Summary */}
      <div className="border-t pt-4 space-y-3">
        <h4 className="font-semibold">{t.financing_summary}</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t.total_costs_label}:</span>
            <span className="font-semibold">{currencyFormatter(totalCosts, 'EUR', '€', 0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t.total_revenue_label}:</span>
            <span className="font-semibold">{currencyFormatter(totalRevenue, 'EUR', '€', 0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{language === 'en' ? 'Own Resources' : language === 'sk' ? 'Vlastné zdroje' : language === 'pl' ? 'Środki własne' : language === 'hu' ? 'Saját források' : 'Eigenkapital'}:</span>
            <span className="font-semibold">{currencyFormatter(ownResources, 'EUR', '€', 0)} ({ownResourcesPercent}%)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{language === 'en' ? 'Bank Resources' : language === 'sk' ? 'Bankové zdroje' : language === 'pl' ? 'Środki bankowe' : language === 'hu' ? 'Banki források' : 'Bankdarlehen'}:</span>
            <span className="font-semibold">{currencyFormatter(bankResources, 'EUR', '€', 0)} ({(100 - ownResourcesPercent).toFixed(0)}%)</span>
          </div>
        </div>
        {financingGap !== 0 && (
          <div className={`p-3 rounded-lg ${financingGap > 0 ? 'bg-destructive/10' : 'bg-success/10'}`}>
            <p className="text-sm font-semibold">
              {financingGap > 0 ? '⚠️ ' : '✓ '}
              Financing Gap: {currencyFormatter(Math.abs(financingGap), 'EUR', '€', 0)}
              {financingGap > 0 && ' (additional funding needed)'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}