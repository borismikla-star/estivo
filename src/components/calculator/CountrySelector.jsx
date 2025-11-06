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

  const translations = {
    en: {
      country: "Country",
    },
    sk: {
      country: "Krajina",
    },
    pl: {
      country: "Kraj",
    },
    hu: {
      country: "Ország",
    },
    de: {
      country: "Land",
    }
  };

  const t = translations[language] || translations.en;

  return (
    <div className="p-6 bg-accent/10 rounded-lg border border-border">
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
    </div>
  );
}