
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Save,
  Calculator,
  Loader2,
  MoreVertical, // New import
  Printer, // New import
  LayoutTemplate // New import
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'; // New imports for DropdownMenu

// SaveStatusIndicator component is removed as its functionality is integrated into the Save button.

export default function CalculatorHeader({
  projectData,
  onNameChange,
  saveStatus,
  isDirty,
  handleSave,
  handleCalculate,
  isCalculating,
  isSaving,
  handlePrint,
  onSaveAsTemplate,
}) {
  // Removed isEditingName state as the input is always editable now, and the pencil icon/message are removed.

  // Language determination updated to use projectData or default to 'en'.
  // The outline had `projectData?.created_by ? 'en' : 'en'`, which was a placeholder.
  // Using `projectData?.language || 'en'` for a more sensible default.
  const language = projectData?.language || 'en';
    
  const translations = {
    en: {
      save: "Save",
      saving: "Saving...",
      saved: "Saved",
      calculate: "Calculate",
      calculating: "Calculating...",
      print: "Print Report",
      save_template: "Save as Template",
      project_name: "Project Name",
    },
    sk: {
      save: "Uložiť",
      saving: "Ukladám...",
      saved: "Uložené",
      calculate: "Vypočítať",
      calculating: "Počítam...",
      print: "Tlačiť report",
      save_template: "Uložiť ako šablónu",
      project_name: "Názov projektu",
    },
    pl: {
      save: "Zapisz",
      saving: "Zapisywanie...",
      saved: "Zapisano",
      calculate: "Oblicz",
      calculating: "Obliczanie...",
      print: "Drukuj raport",
      save_template: "Zapisz jako szablon",
      project_name: "Nazwa projektu",
    },
    hu: {
      save: "Mentés",
      saving: "Mentés...",
      saved: "Mentve",
      calculate: "Számítás",
      calculating: "Számítás folyamatban...",
      print: "Jelentés nyomtatása",
      save_template: "Mentés sablonként",
      project_name: "Projekt neve",
    },
    de: {
      save: "Speichern",
      saving: "Speichern...",
      saved: "Gespeichert",
      calculate: "Berechnen",
      calculating: "Berechnung läuft...",
      print: "Bericht drucken",
      save_template: "Als Vorlage speichern",
      project_name: "Projektname",
    }
  };

  const t = translations[language] || translations.en;

  return (
    <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <Input
            value={projectData?.name || ''}
            onChange={(e) => onNameChange(e.target.value)}
            className="text-lg sm:text-xl font-bold bg-transparent border-none focus-visible:ring-0 px-0 max-w-md"
            placeholder={t.project_name}
          />
                    
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Button
              onClick={handleSave}
              disabled={!isDirty || isSaving}
              variant={isDirty ? "default" : "outline"}
              size="sm"
              className="flex-1 sm:flex-none"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.saving}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {saveStatus === 'saved' ? t.saved : t.save}
                </>
              )}
            </Button>
                        
            <Button
              onClick={handleCalculate}
              disabled={isCalculating}
              variant="default"
              size="sm"
              className="flex-1 sm:flex-none bg-primary"
            >
              {isCalculating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.calculating}
                </>
              ) : (
                <>
                  <Calculator className="mr-2 h-4 w-4" />
                  {t.calculate}
                </>
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {handlePrint && (
                  <DropdownMenuItem onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" />
                    {t.print}
                  </DropdownMenuItem>
                )}
                {onSaveAsTemplate && ( // Ensure onSaveAsTemplate is provided before rendering
                  <DropdownMenuItem onClick={onSaveAsTemplate}>
                    <LayoutTemplate className="mr-2 h-4 w-4" />
                    {t.save_template}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
