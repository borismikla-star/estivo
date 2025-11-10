
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from '@/utils';
import defaultsDeep from 'lodash/defaultsDeep';

import { Loader2, Calculator as CalculatorIcon } from 'lucide-react';
import CalculatorHeader from '../components/calculator/CalculatorHeader';
import AISummary from "../components/calculator/AISummary";
import LongTermLeaseCalculator from '../components/calculator/long_term_lease/LongTermLeaseCalculator';
import CommercialCalculator from '../components/calculator/commercial/CommercialCalculator';
import AirbnbCalculator from '../components/calculator/airbnb/AirbnbCalculator';
import DevelopmentCalculator from '../components/calculator/development/DevelopmentCalculator';
import PDFReport from '../components/calculator/PDFReport';
import SaveTemplateDialog from '../components/calculator/SaveTemplateDialog';

import LongTermLeaseResults from '../components/calculator/long_term_lease/ResultsDisplay';
import { calculateLongTermLease } from '../components/calculator/long_term_lease/calculation';

import AirbnbResults from '../components/calculator/airbnb/ResultsDisplay';
import { calculateAirbnb } from '../components/calculator/airbnb/calculation';

import CommercialResults from '../components/calculator/commercial/ResultsDisplay';
import { calculateCommercial } from '../components/calculator/commercial/calculation';

const getInitialData = (type, user) => ({
    name: `New ${type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
    type: type,
    created_by: user?.email,
    country: user?.country_code || 'SK',
    currency: 'EUR',
    entity_type: user?.entity_type || 'FO',
    results: null,
    ai_summary: null,
    sensitivity_data: null,
    status: 'draft',
    property_data: {},
    financing_data: {},
    initial_costs_data: {},
    operating_data: {},
    income_data: {},
    opex_data: {},
    assumptions_data: {},
    project_info_data: {},
    land_data: {},
    engineering_data: {},
    construction_data: {},
    sales_data: {},
    other_dev_costs_data: {},
    timeline: {}
});

export default function Calculator() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(location.search);
  const projectIdFromUrl = urlParams.get('id');
  const templateIdFromUrl = urlParams.get('templateId');

  const [projectData, setProjectData] = useState(null);
  const [saveStatus, setSaveStatus] = useState('saved');
  const [isDirty, setIsDirty] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSaveTemplateDialogOpen, setIsSaveTemplateDialogOpen] = useState(false);
  
  const [results, setResults] = useState(null);
  const [aiSummary, setAiSummary] = useState(null);
  const [sensitivityData, setSensitivityData] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  // Protection against multiple initializations and project creations
  const hasInitialized = useRef(false);
  const isCreatingProject = useRef(false);

  // Rate limit protection
  const [aiCooldown, setAiCooldown] = useState(() => {
    const stored = localStorage.getItem('estivo_ai_cooldown');
    if (stored) {
      const cooldownUntil = parseInt(stored, 10);
      if (Date.now() < cooldownUntil) {
        return true;
      }
      localStorage.removeItem('estivo_ai_cooldown');
    }
    return false;
  });
  
  const [aiError, setAiError] = useState(null);
  const [rateLimitUntil, setRateLimitUntil] = useState(() => {
    const stored = localStorage.getItem('estivo_ai_cooldown');
    return stored ? parseInt(stored, 10) : null;
  });

  const { data: user, isLoading: isUserLoading } = useQuery({ queryKey: ['currentUser'], queryFn: () => base44.auth.me(), retry: false });

  const { data: countryPresets, isLoading: arePresetsLoading } = useQuery({
      queryKey: ['countryPresets'],
      queryFn: () => base44.entities.CountryPreset.list(),
  });

  const language = user?.preferred_language || 'en';
  
  // Clear AI analysis when language changes AND recalculate results to update graph labels
  const previousLanguage = React.useRef(language);
  
  React.useEffect(() => {
    // Only proceed if the language has actually changed from a previous value
    if (previousLanguage.current && previousLanguage.current !== language) {
      console.log("Language changed, clearing AI and potentially recalculating results.");

      // 1. Clear AI analysis and sensitivity from local state
      setAiSummary(null);
      setSensitivityData(null);

      // 2. Update projectData to clear AI fields and mark as dirty
      // This is done regardless of whether results exist or not, as AI analysis is language-dependent
      setProjectData(prev => {
        if (!prev) return prev; // Should not happen if projectData is already loaded
        return {
          ...prev,
          ai_summary: null,
          sensitivity_data: null,
          results: prev.results // Keep existing results in projectData for now
        };
      });
      setIsDirty(true);
      setSaveStatus('unsaved');

      // 3. If previous results exist, recalculate them with the new language
      if (projectData && results && countryPresets) {
        const recalculateProjectOnLanguageChange = async () => {
          const preset = countryPresets.find(p => p.country_code === projectData.country);
          let recalculatedResults = null;
          
          try {
            switch(projectData.type) {
              case 'long_term_lease':
                recalculatedResults = calculateLongTermLease(projectData, preset, language);
                break;
              case 'commercial':
                recalculatedResults = calculateCommercial(projectData, preset, language);
                break;
              case 'airbnb':
                recalculatedResults = calculateAirbnb(projectData, preset, language);
                break;
              case 'development':
                // Dynamic import for development calculation
                const { calculateDevelopment } = await import('../components/calculator/development/calculation');
                recalculatedResults = calculateDevelopment(projectData, preset, language);
                break;
              default:
                console.warn("Unknown calculator type for language change recalculation:", projectData.type);
                break;
            }
            
            if (recalculatedResults) {
              // Update local results state
              setResults(recalculatedResults);
              // Update projectData to include the newly recalculated results
              // AI fields are already cleared by the previous setProjectData call
              setProjectData(prev => ({
                ...prev,
                results: recalculatedResults
              }));
              // Dirty state and save status are already handled above.
            }
          } catch (error) {
            console.error("Error recalculating results on language change:", error);
            // Consider displaying a user-friendly message for recalculation failure
          }
        };
        recalculateProjectOnLanguageChange();
      }
    }
    // Update the ref to the current language for the next render cycle
    previousLanguage.current = language;
  }, [language, projectData, results, countryPresets]);

  const handleFieldChange = useCallback((section, field, value) => {
    setProjectData(prev => {
        if (!prev) return prev;
        const newData = {
            ...prev,
            [section]: {
                ...(prev[section] || {}),
                [field]: value
            }
        };
        setIsDirty(true);
        setSaveStatus('unsaved');
        return newData;
    });
  }, []);
  
  const handleBulkUpdate = useCallback((section, data) => {
    setProjectData(prev => {
        if (!prev) return prev;
        
        // Special handling for top-level fields like country and entity_type
        if (section === 'country' || section === 'entity_type') {
            const newData = {
                ...prev,
                [section]: data
            };
            setIsDirty(true);
            setSaveStatus('unsaved');
            return newData;
        }
        
        // Special handling for country/entity changes which are top-level fields when passed via property_data
        if (section === 'property_data' && (data.country !== undefined || data.entity_type !== undefined)) {
            const newData = {
                ...prev,
                country: data.country !== undefined ? data.country : prev.country,
                entity_type: data.entity_type !== undefined ? data.entity_type : prev.entity_type,
                [section]: {
                    ...(prev[section] || {}),
                    ...data
                }
            };
            setIsDirty(true);
            setSaveStatus('unsaved');
            return newData;
        }
        
        const newData = {
            ...prev,
            [section]: {
                ...(prev[section] || {}),
                ...data
            }
        };
        setIsDirty(true);
        setSaveStatus('unsaved');
        return newData;
    });
  }, []);

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      if (!data || !data.id) {
        console.error('[Calculator] Update failed: No project ID');
        return Promise.reject(new Error("No project ID to update."));
      }
      
      setSaveStatus('saving');
      console.log('[Calculator] Saving project:', data.id);
      console.log('[Calculator] Full project data structure:', {
        name: data.name,
        type: data.type,
        country: data.country,
        project_info_data: data.project_info_data,
        cost_data: data.cost_data, 
        revenue_data: data.revenue_data, 
        financing_data: data.financing_data,
        results: data.results ? 'exists' : 'missing',
        property_data: data.property_data
      });
      
      const { id, created_by, created_date, updated_date, ...dataToSave } = data;
      
      try {
        const result = await base44.entities.Project.update(id, dataToSave);
        console.log('[Calculator] Save successful, saved data:', {
          id: result.id,
          has_project_info_data: !!result.project_info_data,
          project_info_data: result.project_info_data,
          has_cost_data: !!result.cost_data, 
          has_revenue_data: !!result.revenue_data 
        });
        return result;
      } catch (error) {
        console.error('[Calculator] Save failed:', error);
        throw error;
      }
    },
    onSuccess: (savedProject) => {
      console.log('[Calculator] onSuccess - received saved project:', {
        id: savedProject.id,
        has_project_info_data: !!savedProject.project_info_data,
        project_info_data: savedProject.project_info_data
      });
      setSaveStatus('saved');
      setIsDirty(false);
      queryClient.invalidateQueries({ queryKey: ['userProjects'] });
      
      // IMPORTANT: Update projectData with saved data
      setProjectData(prev => {
        if (!prev) return savedProject; // Should not happen for an update
        return {
          ...prev,
          ...savedProject,
          // Preserve local state that might have changed during save, if they are newer
          results: prev.results || savedProject.results,
          ai_summary: prev.ai_summary || savedProject.ai_summary,
          sensitivity_data: prev.sensitivity_data || savedProject.sensitivity_data
        };
      });
    },
    onError: (error) => {
      console.error('[Calculator] onError called:', error);
      setSaveStatus('unsaved');
      // Show error to user
      const errorMessages = {
        sk: 'Nepodarilo sa uložiť projekt. Skúste to prosím znova.',
        en: 'Failed to save project. Please try again.',
        pl: 'Nie udało się zapisać projektu. Spróbuj ponownie.',
        hu: 'Nem sikerült menteni a projektet. Próbáld újra.',
        de: 'Projekt konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.'
      };
      alert(errorMessages[language] || errorMessages.en);
    },
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Project.create(data),
    onSuccess: (savedProject) => {
        isCreatingProject.current = false; // Reset flag after successful creation
        queryClient.invalidateQueries({ queryKey: ['userProjects'] });
        const newUrl = createPageUrl(`Calculator?id=${savedProject.id}`);
        window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl);
        setProjectData(savedProject);
        setSaveStatus('saved');
        setIsDirty(false);
        setIsInitializing(false);
    },
    onError: (error) => {
        isCreatingProject.current = false; // Reset flag even on error
        console.error("Failed to create project:", error);
        setIsInitializing(false);
        // Show user-friendly error and redirect
        alert("Failed to create project. Please try again.");
        navigate(createPageUrl("Dashboard"));
    }
  });

  const createTemplateMutation = useMutation({
      mutationFn: (data) => base44.entities.ProjectTemplate.create(data),
      onSuccess: () => {
          console.log("Template saved!");
          setIsSaveTemplateDialogOpen(false);
      },
      onError: (error) => {
          console.error("Failed to save template:", error);
      }
  });

  const handleSaveAsTemplate = useCallback((name) => {
    // CHECK PRO PLAN BEFORE ALLOWING TEMPLATE SAVE
    const hasProPlan = user?.plan === 'pro' || user?.plan === 'business';
    if (!hasProPlan) {
        // Use the globally defined 'language' variable
        const alertMessages = {
            sk: "Ukladanie šablón je funkcia Pro plánu. Prosím, prejdite na Pro.",
            en: "Save as Template is a Pro feature. Please upgrade to Pro.",
            pl: "Zapisywanie jako szablon to funkcja planu Pro. Proszę uaktualnić do wersji Pro.",
            hu: "A sablon mentése Pro funkció. Kérjük, frissítsen Pro verzióra.",
            de: "Als Vorlage speichern ist eine Pro-Funktion. Bitte aktualisieren Sie auf Pro."
        };
        alert(alertMessages[language] || alertMessages.en);
        return;
    }
    
    if (!projectData) return;
    const { id, created_by, created_date, updated_date, results, ai_summary, sensitivity_data, ...dataToSave } = projectData;
    const template = {
        name,
        type: projectData.type,
        project_data: dataToSave,
    };
    createTemplateMutation.mutate(template);
  }, [user, projectData, createTemplateMutation, language]);

  useEffect(() => {
    if (rateLimitUntil && Date.now() >= rateLimitUntil) {
      setAiCooldown(false);
      setRateLimitUntil(null);
      setAiError(null);
      localStorage.removeItem('estivo_ai_cooldown');
    } else if (rateLimitUntil) {
      const timeRemaining = rateLimitUntil - Date.now();
      const timer = setTimeout(() => {
        setAiCooldown(false);
        setRateLimitUntil(null);
        setAiError(null);
        localStorage.removeItem('estivo_ai_cooldown');
      }, timeRemaining);
      return () => clearTimeout(timer);
    }
  }, [rateLimitUntil]);

  const runSensitivityAnalysis = useCallback(async (baseResults, preset) => {
    try {
        if (!projectData) return; // Ensure projectData is available
        const projectType = projectData.type;
        let scenarios = [];
        
        if (projectType === 'development') {
            // Development-specific sensitivity scenarios
            const devScenarios = {
                sk: [
                    { name: 'Predajná cena +10%', change: 15 },
                    { name: 'Predajná cena -10%', change: -15 },
                    { name: 'Náklady výstavby +10%', change: -12 },
                    { name: 'Predĺženie projektu +3 mesiace', change: -8 },
                    { name: 'Úrok +1%', change: -4 },
                ],
                en: [
                    { name: 'Sale Price +10%', change: 15 },
                    { name: 'Sale Price -10%', change: -15 },
                    { name: 'Construction Costs +10%', change: -12 },
                    { name: 'Project Delay +3 months', change: -8 },
                    { name: 'Interest Rate +1%', change: -4 },
                ],
                pl: [
                    { name: 'Cena sprzedaży +10%', change: 15 },
                    { name: 'Cena sprzedaży -10%', change: -15 },
                    { name: 'Koszty budowy +10%', change: -12 },
                    { name: 'Opóźnienie projektu +3 miesiące', change: -8 },
                    { name: 'Stopa procentowa +1%', change: -4 },
                ],
                hu: [
                    { name: 'Eladási ár +10%', change: 15 },
                    { name: 'Eladási ár -10%', change: -15 },
                    { name: 'Építési költségek +10%', change: -12 },
                    { name: 'Projekt késés +3 hónap', change: -8 },
                    { name: 'Kamatláb +1%', change: -4 },
                ],
                de: [
                    { name: 'Verkaufspreis +10%', change: 15 },
                    { name: 'Verkaufspreis -10%', change: -15 },
                    { name: 'Baukosten +10%', change: -12 },
                    { name: 'Projektverzögerung +3 Monate', change: -8 },
                    { name: 'Zinssatz +1%', change: -4 },
                ]
            };
            scenarios = devScenarios[language] || devScenarios.en;
        } else if (projectType === 'airbnb') {
            // Airbnb-specific scenarios
            const airbnbScenarios = {
                sk: [
                    { name: 'Obsadenosť +10%', change: 12 },
                    { name: 'Denná sadzba +10%', change: 10 },
                    { name: 'Úrok +1%', change: -5 },
                    { name: 'Prevádzkové náklady +10%', change: -4 },
                ],
                en: [
                    { name: 'Occupancy +10%', change: 12 },
                    { name: 'Daily Rate +10%', change: 10 },
                    { name: 'Interest Rate +1%', change: -5 },
                    { name: 'Operating Costs +10%', change: -4 },
                ],
                pl: [
                    { name: 'Obłożenie +10%', change: 12 },
                    { name: 'Stawka dzienna +10%', change: 10 },
                    { name: 'Stopa procentowa +1%', change: -5 },
                    { name: 'Koszty operacyjne +10%', change: -4 },
                ],
                hu: [
                    { name: 'Foglaltság +10%', change: 12 },
                    { name: 'Napi díj +10%', change: 10 },
                    { name: 'Kamatláb +1%', change: -5 },
                    { name: 'Üzemi költségek +10%', change: -4 },
                ],
                de: [
                    { name: 'Belegung +10%', change: 12 },
                    { name: 'Tagesrate +10%', change: 10 },
                    { name: 'Zinssatz +1%', change: -5 },
                    { name: 'Betriebskosten +10%', change: -4 },
                ]
            };
            scenarios = airbnbScenarios[language] || airbnbScenarios.en;
        } else {
            // Long-term lease & Commercial scenarios
            const generalScenarios = {
                sk: [
                    { name: 'Kúpna cena +10%', change: -10 },
                    { name: 'Nájom +10%', change: 8 },
                    { name: 'Úrok +1%', change: -5 },
                    { name: 'Neobsadenosť +5%', change: -3 },
                ],
                en: [
                    { name: 'Purchase Price +10%', change: -10 },
                    { name: 'Rent +10%', change: 8 },
                    { name: 'Interest Rate +1%', change: -5 },
                    { name: 'Vacancy +5%', change: -3 },
                ],
                pl: [
                    { name: 'Cena zakupu +10%', change: -10 },
                    { name: 'Czynsz +10%', change: 8 },
                    { name: 'Stopa procentowa +1%', change: -5 },
                    { name: 'Pustostany +5%', change: -3 },
                ],
                hu: [
                    { name: 'Vételár +10%', change: -10 },
                    { name: 'Bérleti díj +10%', change: 8 },
                    { name: 'Kamatláb +1%', change: -5 },
                    { name: 'Üresedés +5%', change: -3 },
                ],
                de: [
                    { name: 'Kaufpreis +10%', change: -10 },
                    { name: 'Miete +10%', change: 8 },
                    { name: 'Zinssatz +1%', change: -5 },
                    { name: 'Leerstand +5%', change: -3 },
                ]
            };
            scenarios = generalScenarios[language] || generalScenarios.en;
        }
        
        setSensitivityData(scenarios);
        
        // Update local projectData state to store sensitivity_data
        setProjectData(prev => ({
            ...prev,
            sensitivity_data: scenarios
        }));
        // Mark as dirty and unsaved, as this data should be saved with the project
        setIsDirty(true);
        setSaveStatus('unsaved');
        
    } catch (error) {
        console.error("Sensitivity Analysis Error:", error);
    }
  }, [language, projectData]);

  const generateAISummary = useCallback(async () => {
    if (!results || !results.kpis) {
      const errorMessages = {
        sk: 'Najprv prosím vypočítajte váš projekt',
        en: 'Please calculate your project first',
        pl: 'Najpierw proszę obliczyć projekt',
        hu: 'Kérjük, először számítsa ki projektjét',
        de: 'Bitte berechnen Sie zuerst Ihr Projekt'
      };
      setAiError(errorMessages[language] || errorMessages.en);
      return;
    }
    
    if (aiCooldown) {
      const timeRemaining = rateLimitUntil ? Math.ceil((rateLimitUntil - Date.now()) / 1000) : 60;
      const cooldownErrorMessages = {
        sk: `Počkajte prosím ${timeRemaining} sekúnd pred ďalším generovaním AI analýzy.`,
        en: `Please wait ${timeRemaining} seconds before generating AI analysis again.`,
        pl: `Proszę poczekać ${timeRemaining} sekund przed kolejnym wygenerowaniem analizy AI.`,
        hu: `Kérjük, várjon ${timeRemaining} másodpercet az AI elemzés újbóli generálása előtt.`,
        de: `Bitte warten Sie ${timeRemaining} Sekunden, bevor Sie die KI-Analyse erneut generieren.`
      };
      setAiError(cooldownErrorMessages[language] || cooldownErrorMessages.en);
      return;
    }
    
    setIsAiLoading(true);
    setAiError(null);
    
    try {
        const kpis = results.kpis;
        const projectType = projectData.type;
        
        let prompt = '';
        
        // Different prompts for different project types and languages
        if (projectType === 'development') {
            const prompts = {
                sk: `Si profesionálny analytik developerských projektov. Analyzuj tento developerský projekt a poskytni:

1. Stručné investičné skóre (0-100), kde 100 je vynikajúce
2. 2-3 kľúčové poznatky o silných a slabých stránkach tohto projektu
3. 2-3 konkrétne, realizovateľné odporúčania na zlepšenie výnosov

Údaje o projekte:
- Celkové náklady projektu: €${kpis.total_project_costs?.toLocaleString() || 'N/A'}
- Hrubé tržby: €${kpis.gross_revenue?.toLocaleString() || 'N/A'}
- Hrubý zisk: €${kpis.gross_profit?.toLocaleString() || 'N/A'}
- Zisková marža: ${kpis.profit_margin?.toFixed(1) || 'N/A'}%
- Marža developera: ${kpis.developer_margin?.toFixed(1) || 'N/A'}%
- Návratnosť nákladov: ${kpis.return_on_cost?.toFixed(1) || 'N/A'}%
- Násobok kapitálu: ${kpis.equity_multiple?.toFixed(2) || 'N/A'}x
- Ročná návratnosť: ${kpis.annualized_return?.toFixed(1) || 'N/A'}%
- Náklady na m²: €${kpis.cost_per_m2?.toFixed(0) || 'N/A'}
- Príjem na m²: €${kpis.revenue_per_m2?.toFixed(0) || 'N/A'}

Odpoveď by mala byť stručná a profesionálna. Formátuj ako JSON:
{
  "score": number,
  "insights": "string",
  "recommendations": ["string", "string", "string"]
}

DÔLEŽITÉ: Odpoveď musí byť CELÁ v slovenčine.`,
                en: `You are a professional real estate development analyst. Analyze this development project and provide:

1. A brief investment score (0-100) where 100 is excellent
2. 2-3 key insights about this project's strengths and weaknesses
3. 2-3 specific, actionable recommendations to improve returns

Project Data:
- Total Project Costs: €${kpis.total_project_costs?.toLocaleString() || 'N/A'}
- Gross Revenue: €${kpis.gross_revenue?.toLocaleString() || 'N/A'}
- Gross Profit: €${kpis.gross_profit?.toLocaleString() || 'N/A'}
- Profit Margin: ${kpis.profit_margin?.toFixed(1) || 'N/A'}%
- Developer's Margin: ${kpis.developer_margin?.toFixed(1) || 'N/A'}%
- Return on Cost: ${kpis.return_on_cost?.toFixed(1) || 'N/A'}%
- Equity Multiple: ${kpis.equity_multiple?.toFixed(2) || 'N/A'}x
- Annualized Return: ${kpis.annualized_return?.toFixed(1) || 'N/A'}%
- Cost per m²: €${kpis.cost_per_m2?.toFixed(0) || 'N/A'}
- Revenue per m²: €${kpis.revenue_per_m2?.toFixed(0) || 'N/A'}

Keep the response concise and professional. Format as JSON:
{
  "score": number,
  "insights": "string",
  "recommendations": ["string", "string", "string"]
}`,
                pl: `Jesteś profesjonalnym analitykiem projektów deweloperskich. Przeanalizuj ten projekt deweloperski i podaj:

1. Krótką ocenę inwestycji (0-100), gdzie 100 to doskonały wynik
2. 2-3 kluczowe spostrzeżenia o mocnych i słabych stronach tego projektu
3. 2-3 konkretne, możliwe do wdrożenia rekomendacje poprawy zwrotów

Dane projektu:
- Całkowite koszty projektu: €${kpis.total_project_costs?.toLocaleString() || 'N/A'}
- Przychody brutto: €${kpis.gross_revenue?.toLocaleString() || 'N/A'}
- Zysk brutto: €${kpis.gross_profit?.toLocaleString() || 'N/A'}
- Marża zysku: ${kpis.profit_margin?.toFixed(1) || 'N/A'}%
- Marża dewelopera: ${kpis.developer_margin?.toFixed(1) || 'N/A'}%
- Zwrot z kosztów: ${kpis.return_on_cost?.toFixed(1) || 'N/A'}%
- Mnożnik kapitału: ${kpis.equity_multiple?.toFixed(2) || 'N/A'}x
- Roczny zwrot: ${kpis.annualized_return?.toFixed(1) || 'N/A'}%
- Koszt za m²: €${kpis.cost_per_m2?.toFixed(0) || 'N/A'}
- Przychód za m²: €${kpis.revenue_per_m2?.toFixed(0) || 'N/A'}

Odpowiedź powinna być zwięzła i profesjonalna. Format jako JSON:
{
  "score": number,
  "insights": "string",
  "recommendations": ["string", "string", "string"]
}

WAŻNE: Odpowiedź musi być w CAŁOŚCI po polsku.`,
                hu: `Ön professzionális ingatlanfejlesztési elemző. Elemezze ezt a fejlesztési projektet és adjon:

1. Rövid befektetési pontszám (0-100), ahol 100 kiváló
2. 2-3 kulcsfontosságú betekintés a projekt erősségeiről és gyengeségeiről
3. 2-3 konkrét, végrehajtható ajánlás a hozamok javítására

Projekt adatok:
- Összes projektköltség: €${kpis.total_project_costs?.toLocaleString() || 'N/A'}
- Bruttó bevétel: €${kpis.gross_revenue?.toLocaleString() || 'N/A'}
- Bruttó nyereség: €${kpis.gross_profit?.toLocaleString() || 'N/A'}
- Profitmarzs: ${kpis.profit_margin?.toFixed(1) || 'N/A'}%
- Fejlesztő marzs: ${kpis.developer_margin?.toFixed(1) || 'N/A'}%
- Költség megtérülés: ${kpis.return_on_cost?.toFixed(1) || 'N/A'}%
- Tőke szorzó: ${kpis.equity_multiple?.toFixed(2) || 'N/A'}x
- Éves hozam: ${kpis.annualized_return?.toFixed(1) || 'N/A'}%
- Költség négyzetméterenként: €${kpis.cost_per_m2?.toFixed(0) || 'N/A'}
- Bevétel négyzetméterenként: €${kpis.revenue_per_m2?.toFixed(0) || 'N/A'}

A válasz legyen tömör és szakszerű. Formázás JSON-ként:
{
  "score": number,
  "insights": "string",
  "recommendations": ["string", "string", "string"]
}

FONTOS: A válasznak TELJES EGÉSZÉBEN magyarul kell lennie.`,
                de: `Sie sind ein professioneller Immobilienentwicklungsanalyst. Analysieren Sie dieses Entwicklungsprojekt und geben Sie an:

1. Eine kurze Investitionsbewertung (0-100), wobei 100 ausgezeichnet ist
2. 2-3 wichtige Erkenntnisse über die Stärken und Schwächen des Projekts
3. 2-3 spezifische, umsetzbare Empfehlungen zur Verbesserung der Renditen

Projektdaten:
- Gesamtprojektkosten: €${kpis.total_project_costs?.toLocaleString() || 'N/A'}
- Bruttoeinnahmen: €${kpis.gross_revenue?.toLocaleString() || 'N/A'}
- Bruttogewinn: €${kpis.gross_profit?.toLocaleString() || 'N/A'}
- Gewinnmarge: ${kpis.profit_margin?.toFixed(1) || 'N/A'}%
- Entwicklermarge: ${kpis.developer_margin?.toFixed(1) || 'N/A'}%
- Kostenrendite: ${kpis.return_on_cost?.toFixed(1) || 'N/A'}%
- Eigenkapital-Multiplikator: ${kpis.equity_multiple?.toFixed(2) || 'N/A'}x
- Jährliche Rendite: ${kpis.annualized_return?.toFixed(1) || 'N/A'}%
- Kosten pro m²: €${kpis.cost_per_m2?.toFixed(0) || 'N/A'}
- Einnahmen pro m²: €${kpis.revenue_per_m2?.toFixed(0) || 'N/A'}

Die Antwort sollte prägnant und professionell sein. Format als JSON:
{
  "score": number,
  "insights": "string",
  "recommendations": ["string", "string", "string"]
}

WICHTIG: Die Antwort muss VOLLSTÄNDIG auf Deutsch sein.`
            };
            prompt = prompts[language] || prompts.en;
        } else {
            // Rental properties prompt (long_term_lease, commercial, airbnb)
            const prompts = {
                sk: `Si profesionálny analytik nehnuteľností. Analyzuj túto investíciu typu ${projectType.replace(/_/g, ' ')} a poskytni:

1. Stručné investičné skóre (0-100), kde 100 je vynikajúce
2. 2-3 kľúčové poznatky o silných a slabých stránkach tejto investície
3. 2-3 konkrétne, realizovateľné odporúčania na zlepšenie výnosov

Investičné údaje:
- Celková investícia: €${kpis.total_investment?.toLocaleString() || 'N/A'}
- ROI: ${kpis.roi_10_year?.toFixed(1) || kpis.roi?.toFixed(1) || 'N/A'}%
- Cash-on-Cash: ${kpis.cash_on_cash_return?.toFixed(1) || 'N/A'}%
- Cap Rate: ${kpis.cap_rate?.toFixed(2) || 'N/A'}%
- DSCR: ${kpis.dscr?.toFixed(2) || 'N/A'}
- Mesačný Cash Flow: €${kpis.monthly_cash_flow?.toLocaleString() || (kpis.annual_cash_flow / 12)?.toLocaleString() || 'N/A'}

Odpoveď by mala byť stručná a profesionálna. Formátuj ako JSON:
{
  "score": number,
  "insights": "string",
  "recommendations": ["string", "string", "string"]
}

DÔLEŽITÉ: Odpoveď musí byť CELÁ v slovenčine.`,
                en: `You are a professional real estate investment analyst. Analyze this ${projectType.replace(/_/g, ' ')} investment and provide:

1. A brief investment score (0-100) where 100 is excellent
2. 2-3 key insights about this deal's strengths and weaknesses
3. 2-3 specific, actionable recommendations to improve returns

Investment Data:
- Total Investment: €${kpis.total_investment?.toLocaleString() || 'N/A'}
- ROI: ${kpis.roi_10_year?.toFixed(1) || kpis.roi?.toFixed(1) || 'N/A'}%
- Cash-on-Cash: ${kpis.cash_on_cash_return?.toFixed(1) || 'N/A'}%
- Cap Rate: ${kpis.cap_rate?.toFixed(2) || 'N/A'}%
- DSCR: ${kpis.dscr?.toFixed(2) || 'N/A'}
- Monthly Cash Flow: €${kpis.monthly_cash_flow?.toLocaleString() || (kpis.annual_cash_flow / 12)?.toLocaleString() || 'N/A'}

Keep the response concise and professional. Format as JSON:
{
  "score": number,
  "insights": "string",
  "recommendations": ["string", "string", "string"]
}`,
                pl: `Jesteś profesjonalnym analitykiem inwestycji w nieruchomości. Przeanalizuj tę inwestycję typu ${projectType.replace(/_/g, ' ')} i podaj:

1. Krótką ocenę inwestycji (0-100), gdzie 100 to doskonały wynik
2. 2-3 kluczowe spostrzeżenia o mocnych i słabych stronach tej transakcji
3. 2-3 konkretne, możliwe do wdrożenia rekomendacje poprawy zwrotów

Dane inwestycyjne:
- Całkowita inwestycja: €${kpis.total_investment?.toLocaleString() || 'N/A'}
- ROI: ${kpis.roi_10_year?.toFixed(1) || kpis.roi?.toFixed(1) || 'N/A'}%
- Cash-on-Cash: ${kpis.cash_on_cash_return?.toFixed(1) || 'N/A'}%
- Cap Rate: ${kpis.cap_rate?.toFixed(2) || 'N/A'}%
- DSCR: ${kpis.dscr?.toFixed(2) || 'N/A'}
- Miesięczny Cash Flow: €${kpis.monthly_cash_flow?.toLocaleString() || (kpis.annual_cash_flow / 12)?.toLocaleString() || 'N/A'}

Odpowiedź powinna być zwięzła i profesjonalna. Format jako JSON:
{
  "score": number,
  "insights": "string",
  "recommendations": ["string", "string", "string"]
}

WAŻNE: Odpowiedź musi być w CAŁOŚCI po polsku.`,
                hu: `Ön professzionális ingatlanbefektetési elemző. Elemezze ezt a ${projectType.replace(/_/g, ' ')} befektetést és adjon:

1. Rövid befektetési pontszám (0-100), ahol 100 kiváló
2. 2-3 kulcsfontosságú betekintés az ügylet erősségeiről és gyengeségeiről
3. 2-3 konkrét, végrehajtható ajánlás a hozamok javítására

Befektetési adatok:
- Összes befektetés: €${kpis.total_investment?.toLocaleString() || 'N/A'}
- ROI: ${kpis.roi_10_year?.toFixed(1) || kpis.roi?.toFixed(1) || 'N/A'}%
- Cash-on-Cash: ${kpis.cash_on_cash_return?.toFixed(1) || 'N/A'}%
- Cap Rate: ${kpis.cap_rate?.toFixed(2) || 'N/A'}%
- DSCR: ${kpis.dscr?.toFixed(2) || 'N/A'}
- Havi Cash Flow: €${kpis.monthly_cash_flow?.toLocaleString() || (kpis.annual_cash_flow / 12)?.toLocaleString() || 'N/A'}

A válasz legyen tömör és szakszerű. Formázás JSON-ként:
{
  "score": number,
  "insights": "string",
  "recommendations": ["string", "string", "string"]
}

FONTOS: A válasznak TELJES EGÉSZÉBEN magyarul kell lennie.`,
                de: `Sie sind ein professioneller Immobilieninvestmentanalyst. Analysieren Sie diese ${projectType.replace(/_/g, ' ')} Investition und geben Sie an:

1. Eine kurze Investitionsbewertung (0-100), wobei 100 ausgezeichnet ist
2. 2-3 wichtige Erkenntnisse über die Stärken und Schwächen dieses Geschäfts
3. 2-3 spezifische, umsetzbare Empfehlungen zur Verbesserung der Renditen

Investitionsdaten:
- Gesamtinvestition: €${kpis.total_investment?.toLocaleString() || 'N/A'}
- ROI: ${kpis.roi_10_year?.toFixed(1) || kpis.roi?.toFixed(1) || 'N/A'}%
- Cash-on-Cash: ${kpis.cash_on_cash_return?.toFixed(1) || 'N/A'}%
- Cap Rate: ${kpis.cap_rate?.toFixed(2) || 'N/A'}%
- DSCR: ${kpis.dscr?.toFixed(2) || 'N/A'}
- Monatlicher Cash Flow: €${kpis.monthly_cash_flow?.toLocaleString() || (kpis.annual_cash_flow / 12)?.toLocaleString() || 'N/A'}

Die Antwort sollte prägnant und professionell sein. Format als JSON:
{
  "score": number,
  "insights": "string",
  "recommendations": ["string", "string", "string"]
}

WICHTIG: Die Antwort muss VOLLSTÄNDIG auf Deutsch sein.`
            };
            prompt = prompts[language] || prompts.en;
        }

        const response = await base44.integrations.Core.InvokeLLM({
            prompt,
            response_json_schema: {
                type: "object",
                properties: {
                    score: { type: "number" },
                    insights: { type: "string" },
                    recommendations: { type: "array", items: { type: "string" } }
                }
            }
        });

        setAiSummary(response);
        
        // Update local projectData state to store AI summary
        setProjectData(prev => ({
            ...prev,
            ai_summary: response
        }));
        // Mark as dirty and unsaved, as this data should be saved with the project
        setIsDirty(true);
        setSaveStatus('unsaved');
        
        setTimeout(() => {
            runSensitivityAnalysis(results, countryPresets.find(p => p.country_code === projectData.country));
        }, 1000);

        setAiCooldown(true);
        const cooldownUntil = Date.now() + 60000;
        setRateLimitUntil(cooldownUntil);
        localStorage.setItem('estivo_ai_cooldown', cooldownUntil.toString());

    } catch (error) {
        console.error("AI Summary Error:", error);
        const errorMessages = {
            sk: 'Nepodarilo sa vygenerovať AI analýzu. Vaše výpočty sú stále platné.',
            en: 'Unable to generate AI analysis at this time. Your calculations are still valid.',
            pl: 'Nie udało się wygenerować analizy AI. Twoje obliczenia są nadal ważne.',
            hu: 'Nem sikerült létrehozni az AI elemzést. A számításai továbbra is érvényesek.',
            de: 'KI-Analyse konnte nicht erstellt werden. Ihre Berechnungen sind weiterhin gültig.'
        };
        
        if (error.message && error.message.includes('Rate limit')) {
            const cooldownTime = 300000;
            setAiCooldown(true);
            const cooldownUntil = Date.now() + cooldownTime;
            setRateLimitUntil(cooldownUntil);
            localStorage.setItem('estivo_ai_cooldown', cooldownUntil.toString());
            const rateLimitMessages = {
                sk: 'AI analýza je dočasne nedostupná kvôli limitom. Počkajte prosím 5 minút.',
                en: 'AI analysis is temporarily unavailable due to rate limits. Please wait 5 minutes.',
                pl: 'Analiza AI jest tymczasowo niedostępna z powodu limitów. Proszę poczekać 5 minut.',
                hu: 'Az AI elemzés ideiglenesen nem érhető el korlátozások miatt. Kérjük, várjon 5 percet.',
                de: 'KI-Analyse ist aufgrund von Beschränkungen vorübergehend nicht verfügbar. Bitte warten Sie 5 Minuten.'
            };
            setAiError(rateLimitMessages[language] || rateLimitMessages.en);
        } else {
            setAiError(errorMessages[language] || errorMessages.en);
        }
    } finally {
        setIsAiLoading(false);
    }
  }, [results, projectData, countryPresets, aiCooldown, rateLimitUntil, runSensitivityAnalysis, language]);

  useEffect(() => {
    // Prevent duplicate initialization calls, especially during strict mode or fast re-renders
    if (hasInitialized.current) return;
    if (isUserLoading || arePresetsLoading) return;
    // Ensure user and countryPresets are loaded before proceeding
    if (!user || !countryPresets) return;

    // Mark as initialized to prevent re-running this block
    hasInitialized.current = true;

    if (projectIdFromUrl) {
      base44.entities.Project.get(projectIdFromUrl).then(fetchedProject => {
        console.log('[Calculator] Loaded project from DB:', {
          id: fetchedProject.id,
          name: fetchedProject.name,
          type: fetchedProject.type,
          has_project_info_data: !!fetchedProject.project_info_data,
          project_info_data: fetchedProject.project_info_data,
          has_cost_data: !!fetchedProject.cost_data, 
          has_revenue_data: !!fetchedProject.revenue_data, 
          has_results: !!fetchedProject.results
        });
        
        const initialData = getInitialData(fetchedProject.type, user);
        // CRITICAL FIX: Deep merge nested objects instead of replacing them
        const data = {
          ...initialData,
          ...fetchedProject,
          // Deep merge nested objects - merge fields from both initialData and fetchedProject
          project_info_data: {
            ...(initialData.project_info_data || {}),
            ...(fetchedProject.project_info_data || {})
          },
          cost_data: {
            ...(initialData.cost_data || {}),
            ...(fetchedProject.cost_data || {})
          },
          revenue_data: {
            ...(initialData.revenue_data || {}),
            ...(fetchedProject.revenue_data || {})
          },
          financing_data: {
            ...(initialData.financing_data || {}),
            ...(fetchedProject.financing_data || {})
          },
          property_data: {
            ...(initialData.property_data || {}),
            ...(fetchedProject.property_data || {})
          },
          initial_costs_data: {
            ...(initialData.initial_costs_data || {}),
            ...(fetchedProject.initial_costs_data || {})
          },
          operating_data: {
            ...(initialData.operating_data || {}),
            ...(fetchedProject.operating_data || {})
          },
          income_data: {
            ...(initialData.income_data || {}),
            ...(fetchedProject.income_data || {})
          },
          opex_data: {
            ...(initialData.opex_data || {}),
            ...(fetchedProject.opex_data || {})
          },
          assumptions_data: {
            ...(initialData.assumptions_data || {}),
            ...(fetchedProject.assumptions_data || {})
          }
        };
        
        console.log('[Calculator] Merged project data:', {
          id: data.id,
          name: data.name,
          type: data.type,
          project_info_data: data.project_info_data,
          project_info_keys: Object.keys(data.project_info_data || {}),
          cost_data_keys: Object.keys(data.cost_data || {}), 
          revenue_data_keys: Object.keys(data.revenue_data || {}) 
        });
        
        setProjectData(data);
        setResults(data.results);
        setAiSummary(data.ai_summary);
        setSensitivityData(data.sensitivity_data);
        setIsInitializing(false);
        setSaveStatus('saved');
        setIsDirty(false);
      }).catch(error => {
        console.error("Failed to load project:", error);
        setIsInitializing(false);
        navigate(createPageUrl("Dashboard"));
      });
    } else if (templateIdFromUrl) {
        base44.entities.ProjectTemplate.get(templateIdFromUrl).then(template => {
            // Prevent duplicate creation requests
            if (isCreatingProject.current) return;
            isCreatingProject.current = true; // Set flag before mutation
            
            let initialObject = getInitialData(template.type, user);
            const projectFromTemplate = defaultsDeep({}, template.project_data, initialObject);
            projectFromTemplate.name = `New Project from ${template.name}`;
            projectFromTemplate.results = null;
            projectFromTemplate.ai_summary = null;
            projectFromTemplate.sensitivity_data = null;
            projectFromTemplate.id = undefined;
            projectFromTemplate.created_by = user?.email;

            createMutation.mutate(projectFromTemplate);
        }).catch(error => {
            console.error("Failed to load template:", error);
            setIsInitializing(false); // Ensure initialization ends even on error
            navigate(createPageUrl("Dashboard")); // Redirect on template load failure
        });
    } else {
      const typeFromUrl = urlParams.get('type');
      if (!typeFromUrl) {
          // No type, navigate to dashboard, ensure initialization ends
          setIsInitializing(false); // Crucial to prevent infinite loader
          navigate(createPageUrl("Dashboard"));
          return;
      }

      // Prevent duplicate creation requests
      if (isCreatingProject.current) return;
      isCreatingProject.current = true; // Set flag before mutation

      let initialObject = getInitialData(typeFromUrl, user);
      const preset = countryPresets.find(p => p.country_code === initialObject.country);

      if (preset) {
        switch(initialObject.type) {
            case 'long_term_lease':
                initialObject.operating_data.property_tax = preset.property_tax_rate;
                break;
            case 'commercial':
                initialObject.assumptions_data.discount_rate = preset.npv_discount_rate;
                break;
            case 'airbnb':
                initialObject.financing_data.loan_term = 30;
                break;
            case 'development':
                initialObject.project_info_data.vatPayer = true;
                break;
        }
      }
      createMutation.mutate(initialObject);
    }
  }, [projectIdFromUrl, templateIdFromUrl, isUserLoading, arePresetsLoading, user, countryPresets, navigate, urlParams, createPageUrl, createMutation]); 
  
  const handleCalculate = useCallback(async () => {
        if (!projectData || !countryPresets) return;
        
        setIsCalculating(true);
        console.log('[Calculator] Starting calculation for project:', projectData.id);
        
        try {
            const preset = countryPresets.find(p => p.country_code === projectData.country);
            let calculatedResults;
            
            switch(projectData.type) {
                case 'long_term_lease':
                    calculatedResults = calculateLongTermLease(projectData, preset, language);
                    break;
                case 'commercial':
                    calculatedResults = calculateCommercial(projectData, preset, language);
                    break;
                case 'airbnb':
                    calculatedResults = calculateAirbnb(projectData, preset, language);
                    break;
                case 'development':
                    const { calculateDevelopment } = await import('../components/calculator/development/calculation');
                    calculatedResults = calculateDevelopment(projectData, preset, language);
                    break;
                default:
                    throw new Error("Unknown calculator type");
            }
            
            console.log('[Calculator] Calculation complete, results:', {
                hasKpis: !!calculatedResults?.kpis,
                kpisCount: calculatedResults?.kpis ? Object.keys(calculatedResults.kpis).length : 0
            });
            
            setResults(calculatedResults);
            
            // Update local projectData state to store calculation results
            setProjectData(prev => {
                const updated = {
                    ...prev,
                    results: calculatedResults
                };
                console.log('[Calculator] Updated projectData with results');
                return updated;
            });
            
            // Mark as dirty and unsaved
            setIsDirty(true);
            setSaveStatus('unsaved');
            console.log('[Calculator] Marked as dirty and unsaved');
            
        } catch (error) {
            console.error("[Calculator] Calculation error:", error);
            const errorMessages = {
                sk: 'Chyba pri výpočte. Skontrolujte prosím všetky vstupné údaje.',
                en: 'Calculation error. Please check all input data.',
                pl: 'Błąd obliczeniowy. Sprawdź wszystkie dane wejściowe.',
                hu: 'Számítási hiba. Ellenőrizze az összes bemeneti adatot.',
                de: 'Berechnungsfehler. Bitte überprüfen Sie alle Eingabedaten.'
            };
            alert(errorMessages[language] || errorMessages.en);
        } finally {
            setIsCalculating(false);
        }
    }, [projectData, countryPresets, language]);
  
  const handlePrint = () => {
    window.print();
  };

  // MANUAL SAVE ONLY - called when user clicks Save button
  const handleManualSave = useCallback(() => {
    console.log('[Calculator] handleManualSave called', {
      hasProjectData: !!projectData,
      projectId: projectData?.id,
      isDirty: isDirty,
      saveStatus: saveStatus
    });
    
    if (projectData && projectData.id && isDirty) {
      console.log('[Calculator] Triggering save mutation');
      updateMutation.mutate(projectData);
    } else {
      console.log('[Calculator] Save skipped - conditions not met');
    }
  }, [projectData, isDirty, updateMutation]);

  if (isInitializing) {
    return <div className="flex justify-center items-center h-screen bg-background"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  
  if (!projectData) {
      return <div className="flex justify-center items-center h-screen bg-background"><p>Could not load project.</p></div>;
  }

  const renderCalculatorInputs = () => {
    if (!projectData) return null; // Added check for projectData
    
    const props = { projectData, onFieldChange: handleFieldChange, onBulkUpdate: handleBulkUpdate, language, user, countryPresets, t: {} };
    switch (projectData.type) {
      case 'long_term_lease': return <LongTermLeaseCalculator {...props} />;
      case 'commercial': return <CommercialCalculator {...props} />;
      case 'airbnb': return <AirbnbCalculator {...props} />;
      case 'development': return <DevelopmentCalculator {...props} />;
      default: return <div>Unknown calculator type</div>;
    }
  };

  const renderResults = () => {
        if (!results) return null;
        
        const currency = projectData.currency === 'EUR' ? '€' : projectData.currency;
        
        switch(projectData.type) {
            case 'long_term_lease':
                return <LongTermLeaseResults results={results} currency={currency} language={language} />;
            case 'commercial':
                return <CommercialResults 
                    results={results} 
                    currency={currency} 
                    language={language}
                    holdingPeriod={projectData.assumptions_data?.holding_period || 10}
                />;
            case 'airbnb':
                return <AirbnbResults results={results} currency={currency} language={language} />;
            case 'development':
                // Import the development results component
                const DevelopmentResults = React.lazy(() => import('../components/calculator/development/ResultsDisplay'));
                return (
                    <React.Suspense fallback={<div>Loading Development Results...</div>}>
                        <DevelopmentResults 
                            results={results} 
                            currency={currency} 
                            language={language}
                            holdingPeriod={projectData.timeline?.total_months || 24}
                        />
                    </React.Suspense>
                );
            default:
                return null;
        }
    };

  return (
    <div className="bg-background min-h-full print:bg-white">
        <div className="print:hidden">
            <CalculatorHeader 
                projectData={projectData}
                onNameChange={(value) => {
                    setProjectData(prev => ({ ...prev, name: value }));
                    setIsDirty(true);
                    setSaveStatus('unsaved');
                }}
                saveStatus={saveStatus}
                isDirty={isDirty}
                handleSave={handleManualSave}
                handleCalculate={handleCalculate}
                isCalculating={isCalculating}
                isSaving={updateMutation.isLoading}
                handlePrint={results ? handlePrint : null}
                onSaveAsTemplate={() => setIsSaveTemplateDialogOpen(true)}
                t={{}}
            />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 items-start p-3 sm:p-4 lg:p-6 xl:p-8 max-w-[1920px] mx-auto">
                {/* Inputs Column */}
                <div className="space-y-4 sm:space-y-6 bg-card p-4 sm:p-6 rounded-xl lg:rounded-2xl border border-border shadow-premium">
                    {renderCalculatorInputs()}
                </div>
                
                {/* Results Column */}
                <div className="xl:sticky xl:top-28 space-y-4 sm:space-y-6">
                    {isCalculating && !results && (
                      <div className="flex flex-col items-center justify-center p-6 sm:p-8 bg-card rounded-lg shadow-premium border border-border min-h-[300px] sm:h-96">
                          <Loader2 className="h-10 w-10 sm:h-12 w-12 animate-spin text-primary mb-4" />
                          <p className="text-base sm:text-lg text-muted-foreground">Analyzing your investment...</p>
                      </div>
                    )}
                    {results && (
                      <>
                        <AISummary 
                            summary={aiSummary} 
                            sensitivityData={sensitivityData} 
                            isLoading={isAiLoading}
                            error={aiError}
                            onGenerate={generateAISummary}
                            canGenerate={!aiCooldown && !isAiLoading}
                            user={user}
                            t={{}} 
                        />
                        {renderResults()}
                      </>
                    )}
                    {!isCalculating && !results && (
                         <div className="flex flex-col items-center justify-center p-6 sm:p-8 bg-card rounded-lg shadow-premium border border-border min-h-[300px] sm:h-96">
                            <CalculatorIcon className="h-10 w-10 sm:h-12 w-12 text-primary/30 mb-4" />
                            <p className="text-base sm:text-lg text-muted-foreground text-center px-4">Your results and AI analysis will appear here after calculation.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
        <PDFReport projectData={projectData} results={results} language={language} user={user} />
        <SaveTemplateDialog 
            open={isSaveTemplateDialogOpen}
            onOpenChange={setIsSaveTemplateDialogOpen}
            onSave={handleSaveAsTemplate}
            language={language}
            isSaving={createTemplateMutation.isLoading}
        />

        <style>{`
            @media print {
                body * {
                    visibility: hidden;
                }
                .print-container, .print-container * {
                    visibility: visible;
                }
                .print-container {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                }
                .print\\:hidden {
                    display: none !important;
                }
                .print\\:bg-white {
                    background-color: white !important;
                }
            }
        `}</style>
    </div>
  );
}
