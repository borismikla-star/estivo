
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
  const [resultsKey, setResultsKey] = useState(0);

  const hasInitialized = useRef(false);
  const isCreatingProject = useRef(false);
  const isRecalculating = useRef(false);

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
  
  // Auto-recalculate when entity_type or country changes - using separate state for tracking
  const [watchedEntityType, setWatchedEntityType] = useState(null);
  const [watchedCountry, setWatchedCountry] = useState(null);

  useEffect(() => {
    if (!projectData || !countryPresets || isInitializing) return;
    
    // Initialize watched values on first render
    if (watchedEntityType === null) {
      setWatchedEntityType(projectData.entity_type);
      setWatchedCountry(projectData.country);
      return;
    }
    
    // Detect changes
    const entityChanged = watchedEntityType !== projectData.entity_type;
    const countryChanged = watchedCountry !== projectData.country;
    
    if ((entityChanged || countryChanged) && results && !isRecalculating.current) {
      console.log('[Calculator] DETECTED CHANGE - Auto-recalculating', {
        entityChanged,
        countryChanged,
        from: { entity: watchedEntityType, country: watchedCountry },
        to: { entity: projectData.entity_type, country: projectData.country }
      });
      
      isRecalculating.current = true;
      
      const recalculate = async () => {
        const preset = countryPresets.find(p => p.country_code === projectData.country);
        
        try {
          let newResults;
          
          switch(projectData.type) {
            case 'long_term_lease':
              newResults = calculateLongTermLease(projectData, preset, language);
              break;
            case 'commercial':
              newResults = calculateCommercial(projectData, preset, language);
              break;
            case 'airbnb':
              newResults = calculateAirbnb(projectData, preset, language);
              break;
            case 'development':
              const { calculateDevelopment } = await import('../components/calculator/development/calculation');
              newResults = calculateDevelopment(projectData, preset, language);
              break;
          }
          
          if (newResults) {
            console.log('[Calculator] Auto-recalc complete, updating results');
            setResults(newResults);
            setResultsKey(prev => prev + 1); // Increment key to force re-render
            setProjectData(prev => ({
              ...prev,
              results: newResults,
              ai_summary: null,
              sensitivity_data: null
            }));
            setAiSummary(null);
            setSensitivityData(null);
            setIsDirty(true);
            setSaveStatus('unsaved');
          }
        } catch (error) {
          console.error("[Calculator] Auto-recalc error:", error);
        } finally {
          isRecalculating.current = false;
          // Update watched values
          setWatchedEntityType(projectData.entity_type);
          setWatchedCountry(projectData.country);
        }
      };
      
      recalculate();
    }
  }, [projectData, countryPresets, language, results, isInitializing, watchedEntityType, watchedCountry]);

  // Language change handler
  const previousLanguage = useRef(null);
  
  React.useEffect(() => {
    if (previousLanguage.current !== null && previousLanguage.current !== language) {
      console.log("Language changed, recalculating results.");

      setAiSummary(null);
      setSensitivityData(null);

      setProjectData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          ai_summary: null,
          sensitivity_data: null,
          results: prev.results
        };
      });
      setIsDirty(true);
      setSaveStatus('unsaved');

      if (projectData && results && countryPresets) {
        const recalculateForLanguage = async () => {
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
                const { calculateDevelopment } = await import('../components/calculator/development/calculation');
                recalculatedResults = calculateDevelopment(projectData, preset, language);
                break;
            }
            
            if (recalculatedResults) {
              setResults(recalculatedResults);
              setResultsKey(prev => prev + 1); // Increment key to force re-render
              setProjectData(prev => ({
                ...prev,
                results: recalculatedResults
              }));
            }
          } catch (error) {
            console.error("Error recalculating for language:", error);
          }
        };
        recalculateForLanguage();
      }
    }
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
        
        if (section === 'country' || section === 'entity_type') {
            console.log(`[Calculator] handleBulkUpdate ${section}:`, data);
            const newData = {
                ...prev,
                [section]: data
            };
            setIsDirty(true);
            setSaveStatus('unsaved');
            return newData;
        }
        
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
      
      const { id, created_by, created_date, updated_date, ...dataToSave } = data;
      
      try {
        const result = await base44.entities.Project.update(id, dataToSave);
        return result;
      } catch (error) {
        console.error('[Calculator] Save failed:', error);
        throw error;
      }
    },
    onSuccess: (savedProject) => {
      setSaveStatus('saved');
      setIsDirty(false);
      queryClient.invalidateQueries({ queryKey: ['userProjects'] });
      
      setProjectData(prev => {
        if (!prev) return savedProject;
        return {
          ...prev,
          ...savedProject,
          results: prev.results || savedProject.results,
          ai_summary: prev.ai_summary || savedProject.ai_summary,
          sensitivity_data: prev.sensitivity_data || savedProject.sensitivity_data
        };
      });
    },
    onError: (error) => {
      console.error('[Calculator] onError called:', error);
      setSaveStatus('unsaved');
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
        isCreatingProject.current = false;
        queryClient.invalidateQueries({ queryKey: ['userProjects'] });
        const newUrl = createPageUrl(`Calculator?id=${savedProject.id}`);
        window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl);
        setProjectData(savedProject);
        
        setWatchedEntityType(savedProject.entity_type);
        setWatchedCountry(savedProject.country);
        previousLanguage.current = language;
        
        setSaveStatus('saved');
        setIsDirty(false);
        setIsInitializing(false);
    },
    onError: (error) => {
        isCreatingProject.current = false;
        console.error("Failed to create project:", error);
        setIsInitializing(false);
        alert("Failed to create project. Please try again.");
        navigate(createPageUrl("Dashboard"));
    }
  });

  const createTemplateMutation = useMutation({
      mutationFn: (data) => base44.entities.ProjectTemplate.create(data),
      onSuccess: () => {
          setIsSaveTemplateDialogOpen(false);
      },
      onError: (error) => {
          console.error("Failed to save template:", error);
      }
  });

  const handleSaveAsTemplate = useCallback((name) => {
    const hasProPlan = user?.plan === 'pro' || user?.plan === 'business';
    if (!hasProPlan) {
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
        if (!projectData) return;
        const projectType = projectData.type;
        let scenarios = [];
        
        if (projectType === 'development') {
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
        setProjectData(prev => ({
            ...prev,
            sensitivity_data: scenarios
        }));
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
        setProjectData(prev => ({
            ...prev,
            ai_summary: response
        }));
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
    if (hasInitialized.current) return;
    if (isUserLoading || arePresetsLoading) return;
    if (!user || !countryPresets) return;

    hasInitialized.current = true;

    if (projectIdFromUrl) {
      base44.entities.Project.get(projectIdFromUrl).then(fetchedProject => {
        console.log('[Calculator] Loaded project, entity_type:', fetchedProject.entity_type);
        
        const initialData = getInitialData(fetchedProject.type, user);
        const data = {
          ...initialData,
          ...fetchedProject,
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
        
        setProjectData(data);
        setResults(data.results);
        if (data.results) { // If there are initial results, set the key to force re-render
            setResultsKey(prev => prev + 1);
        }
        setAiSummary(data.ai_summary);
        setSensitivityData(data.sensitivity_data);
        
        setWatchedEntityType(data.entity_type);
        setWatchedCountry(data.country);
        previousLanguage.current = language;
        
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
            if (isCreatingProject.current) return;
            isCreatingProject.current = true;
            
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
            setIsInitializing(false);
            navigate(createPageUrl("Dashboard"));
        });
    } else {
      const typeFromUrl = urlParams.get('type');
      if (!typeFromUrl) {
          setIsInitializing(false);
          navigate(createPageUrl("Dashboard"));
          return;
      }

      if (isCreatingProject.current) return;
      isCreatingProject.current = true;

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
  }, [projectIdFromUrl, templateIdFromUrl, isUserLoading, arePresetsLoading, user, countryPresets, navigate, urlParams, createMutation, language]); 
  
  const handleCalculate = useCallback(async () => {
        if (!projectData || !countryPresets) return;
        
        setIsCalculating(true);
        console.log('[Calculator] Manual calculation started');
        
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
            
            setResults(calculatedResults);
            setResultsKey(prev => prev + 1); // Increment key to force re-render
            setProjectData(prev => ({
                ...prev,
                results: calculatedResults
            }));
            
            setIsDirty(true);
            setSaveStatus('unsaved');
            
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

  const handleManualSave = useCallback(() => {
    if (projectData && projectData.id && isDirty) {
      updateMutation.mutate(projectData);
    }
  }, [projectData, isDirty, updateMutation]);

  if (isInitializing) {
    return <div className="flex justify-center items-center h-screen bg-background"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  
  if (!projectData) {
      return <div className="flex justify-center items-center h-screen bg-background"><p>Could not load project.</p></div>;
  }

  const renderCalculatorInputs = () => {
    if (!projectData) return null;
    
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
                return <LongTermLeaseResults key={resultsKey} results={results} currency={currency} language={language} />;
            case 'commercial':
                return <CommercialResults 
                    key={resultsKey}
                    results={results} 
                    currency={currency} 
                    language={language}
                    holdingPeriod={projectData.assumptions_data?.holding_period || 10}
                />;
            case 'airbnb':
                return <AirbnbResults key={resultsKey} results={results} currency={currency} language={language} />;
            case 'development':
                const DevelopmentResults = React.lazy(() => import('../components/calculator/development/ResultsDisplay'));
                return (
                    <React.Suspense fallback={<div>Loading Development Results...</div>}>
                        <DevelopmentResults 
                            key={resultsKey}
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
                <div className="space-y-4 sm:space-y-6 bg-card p-4 sm:p-6 rounded-xl lg:rounded-2xl border border-border shadow-premium">
                    {renderCalculatorInputs()}
                </div>
                
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
