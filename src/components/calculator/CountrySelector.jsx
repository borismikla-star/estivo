import React from 'react';
import uniqBy from 'lodash/uniqBy';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function CountrySelector({ projectData, onBulkUpdate, countryPresets, language = 'en' }) {
  const activePresets = (countryPresets || []).filter(p => p.is_active);
  const uniqueCountries = uniqBy(activePresets, 'country_code');

  const handleCountryChange = (countryCode) => {
    onBulkUpdate('property_data', {
      ...projectData.property_data,
      country: countryCode
    });
  };

  const handleEntityChange = (entityType) => {
    onBulkUpdate('property_data', {
      ...projectData.property_data,
      entity_type: entityType
    });
  };

  const translations = {
    en: {
      country: "Country",
      entity_type: "Entity Type",
      individual: "Individual (FO)",
      company: "Company (PO)",
    },
    sk: {
      country: "Krajina",
      entity_type: "Druh osoby",
      individual: "Fyzická osoba (FO)",
      company: "Právnická osoba (PO)",
    },
    pl: {
      country: "Kraj",
      entity_type: "Typ podmiotu",
      individual: "Osoba fizyczna (FO)",
      company: "Osoba prawna (PO)",
    },
    hu: {
      country: "Ország",
      entity_type: "Jogalany típusa",
      individual: "Magánszemély (FO)",
      company: "Cég (PO)",
    },
    de: {
      country: "Land",
      entity_type: "Rechtsform",
      individual: "Privatperson (FO)",
      company: "Unternehmen (PO)",
    }
  };

  const t = translations[language] || translations.en;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-accent/10 rounded-lg border border-border">
      <div>
        <Label>{t.country}</Label>
        <Select
          value={projectData.country || 'SK'}
          onValueChange={handleCountryChange}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {uniqueCountries.map((preset) => (
              <SelectItem key={preset.country_code} value={preset.country_code}>
                {language === 'sk' ? preset.country_name_sk : preset.country_name_en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>{t.entity_type}</Label>
        <Select
          value={projectData.property_data?.entity_type || projectData.entity_type || 'FO'}
          onValueChange={handleEntityChange}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="FO">{t.individual}</SelectItem>
            <SelectItem value="PO">{t.company}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}