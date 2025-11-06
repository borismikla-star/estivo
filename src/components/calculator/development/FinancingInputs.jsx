
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { currencyFormatter } from '../../lib/formatters';

export default function FinancingInputs({ data, totalCosts, totalRevenue, language, onChange }) {
  const translations = {
    sk: {
      title: "Financovanie",
      own_resources_pct: "Vlastné zdroje (%)",
      own_resources_result: "Vlastné zdroje",
      bank_resources: "Bankové zdroje (doplnené do 100%)",
      own_resources_interest: "Úroky vlastných zdrojov (5%)",
      bank_fees: "Bankové poplatky (0,2%)",
      bank_interest_pct: "Úroky z bankových zdrojov (%)",
      bank_interest_result: "Úroky z bankových zdrojov",
      project_duration: "Trvanie projektu (mesiace)",
      result: "Výsledok",
      financing_costs: "Náklady financovania",
      total_financing_costs: "Celkové náklady financovania",
      duration_desc: "Typicky 18-36 mesiacov pre rezidenčné projekty",
    },
    en: {
      title: "Financing",
      own_resources_pct: "Own Resources (%)",
      own_resources_result: "Own Resources",
      bank_resources: "Bank Resources (completed to 100%)",
      own_resources_interest: "Own Resources Interest (5%)",
      bank_fees: "Bank Fees (0.2%)",
      bank_interest_pct: "Bank Interest Rate (%)",
      bank_interest_result: "Bank Interest",
      project_duration: "Project Duration (months)",
      result: "Result",
      financing_costs: "Financing Costs",
      total_financing_costs: "Total Financing Costs",
      duration_desc: "Typically 18-36 months for residential projects",
    },
    pl: {
      title: "Finansowanie",
      own_resources_pct: "Środki własne (%)",
      own_resources_result: "Środki własne",
      bank_resources: "Środki bankowe (uzupełnione do 100%)",
      own_resources_interest: "Odsetki od środków własnych (5%)",
      bank_fees: "Opłaty bankowe (0,2%)",
      bank_interest_pct: "Oprocentowanie kredytu bankowego (%)",
      bank_interest_result: "Odsetki bankowe",
      project_duration: "Czas trwania projektu (miesiące)",
      result: "Wynik",
      financing_costs: "Koszty finansowania",
      total_financing_costs: "Całkowite koszty finansowania",
      duration_desc: "Zazwyczaj 18-36 miesięcy dla projektów mieszkaniowych",
    },
    hu: {
      title: "Finanszírozás",
      own_resources_pct: "Saját források (%)",
      own_resources_result: "Saját források",
      bank_resources: "Banki források (kiegészítve 100%-ra)",
      own_resources_interest: "Saját források kamata (5%)",
      bank_fees: "Banki díjak (0,2%)",
      bank_interest_pct: "Banki kamatláb (%)",
      bank_interest_result: "Banki kamatok",
      project_duration: "Projekt időtartama (hónapok)",
      result: "Eredmény",
      financing_costs: "Finanszírozási költségek",
      total_financing_costs: "Teljes finanszírozási költségek",
      duration_desc: "Általában 18-36 hónap lakóprojekteknél",
    },
    de: {
      title: "Finanzierung",
      own_resources_pct: "Eigenmittel (%)",
      own_resources_result: "Eigenmittel",
      bank_resources: "Bankmittel (ergänzt auf 100%)",
      own_resources_interest: "Eigenmittelzinsen (5%)",
      bank_fees: "Bankgebühren (0,2%)",
      bank_interest_pct: "Bankzinssatz (%)",
      bank_interest_result: "Bankzinsen",
      project_duration: "Projektdauer (Monate)",
      result: "Ergebnis",
      financing_costs: "Finanzierungskosten",
      total_financing_costs: "Gesamte Finanzierungskosten",
      duration_desc: "Typischerweise 18-36 Monate für Wohnprojekte",
    }
  };

  const t = translations[language] || translations.en;
  const safeData = data || {};

  // Calculations
  const ownResourcesPercent = parseFloat(safeData.own_resources_percent) || 30;
  const bankInterestPercent = parseFloat(safeData.bank_interest_percent) || 6;
  const projectDurationMonths = parseFloat(safeData.project_duration_months) || 24;
  
  const ownResourcesAmount = totalCosts * (ownResourcesPercent / 100);
  const bankResourcesAmount = totalCosts * ((100 - ownResourcesPercent) / 100);
  const ownResourcesInterest = ownResourcesAmount * 0.05; // 5%
  const bankFeesAmount = bankResourcesAmount * 0.002; // 0.2%
  const bankInterestAmount = bankResourcesAmount * (bankInterestPercent / 100);

  const handleChange = (field, value) => {
    onChange({ ...safeData, [field]: parseFloat(value) || 0 });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">{t.title}</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>{t.project_duration}</Label>
          <Input 
            type="number" 
            value={safeData.project_duration_months || ""} 
            onChange={(e) => handleChange('project_duration_months', e.target.value)}
            placeholder="24"
          />
          <p className="text-xs text-muted-foreground">
            {t.duration_desc}
          </p>
        </div>

        <div className="space-y-2">
          <Label>{t.own_resources_pct}</Label>
          <Input 
            type="number" 
            value={safeData.own_resources_percent || ""} 
            onChange={(e) => handleChange('own_resources_percent', e.target.value)}
            placeholder="30"
          />
          <p className="text-sm text-muted-foreground">{t.result}: {currencyFormatter(ownResourcesAmount, 'EUR', '€', 2)}</p>
        </div>

        <div className="space-y-2 bg-muted/30 p-4 rounded-lg">
          <Label>{t.bank_resources}</Label>
          <p className="text-lg font-semibold text-foreground">{currencyFormatter(bankResourcesAmount, 'EUR', '€', 2)}</p>
          <p className="text-xs text-muted-foreground">{100 - ownResourcesPercent}%</p>
        </div>

        <div className="space-y-4 border-t pt-4">
          <h4 className="font-medium text-sm text-muted-foreground">{t.financing_costs}</h4>
          
          <div className="space-y-2 bg-muted/20 p-3 rounded">
            <Label className="text-sm">{t.own_resources_interest}</Label>
            <p className="text-sm font-semibold text-foreground">{currencyFormatter(ownResourcesInterest, 'EUR', '€', 2)}</p>
          </div>

          <div className="space-y-2 bg-muted/20 p-3 rounded">
            <Label className="text-sm">{t.bank_fees}</Label>
            <p className="text-sm font-semibold text-foreground">{currencyFormatter(bankFeesAmount, 'EUR', '€', 2)}</p>
          </div>

          <div className="space-y-2">
            <Label>{t.bank_interest_pct}</Label>
            <Input 
              type="number" 
              value={safeData.bank_interest_percent || ""} 
              onChange={(e) => handleChange('bank_interest_percent', e.target.value)}
              placeholder="6"
            />
            <p className="text-sm text-muted-foreground">{t.result}: {currencyFormatter(bankInterestAmount, 'EUR', '€', 2)}</p>
          </div>
        </div>

        <div className="bg-primary/10 p-4 rounded-lg border-2 border-primary/20">
          <p className="text-sm text-muted-foreground mb-1">{t.total_financing_costs}</p>
          <p className="text-2xl font-bold text-primary">
            {currencyFormatter(ownResourcesInterest + bankFeesAmount + bankInterestAmount, 'EUR', '€', 2)}
          </p>
        </div>
      </div>
    </div>
  );
}
