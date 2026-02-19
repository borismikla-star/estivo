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
            // Deep clone to ensure React detects the change
            const clonedResults = JSON.parse(JSON.stringify(newResults));
            console.log('[Calculator] Auto-recalc complete, updating results', {
              effectiveTaxRate: clonedResults.kpis?.effective_tax_rate,
              taxableIncome: clonedResults.kpis?.taxable_income,
              annualIncomeTax: clonedResults.kpis?.annual_income_tax,
              annualDepreciation: clonedResults.kpis?.annual_depreciation
            });
            
            setResults(clonedResults);
            setProjectData(prev => ({
              ...prev,
              results: clonedResults,
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
              const clonedResults = JSON.parse(JSON.stringify(recalculatedResults));
              setResults(clonedResults);
              setProjectData(prev => ({
                ...prev,
                results: clonedResults
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
          // console.error("Failed to save template:", error); // Removed logging
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
        if (!projectData || !baseResults?.kpis) return;
        const projectType = projectData.type;

        const baseIrr = baseResults.kpis.irr; // IRR is already in percentage format from calculation

        const LABELS = {
            en: { rent: 'Rent / Nightly Rate', occupancy: 'Occupancy (±5%)', purchasePrice: 'Purchase Price', exitCapRate: 'Exit Cap Rate (+0.5%)', interestRate: 'Interest Rate (+1%)', salePrice: 'Sale Price', constructionCost: 'Construction Cost' },
            sk: { rent: 'Nájom / Cena za noc', occupancy: 'Obsadenosť (±5%)', purchasePrice: 'Kúpna cena', exitCapRate: 'Exit Cap Rate (+0,5%)', interestRate: 'Úroková sadzba (+1%)', salePrice: 'Predajná cena', constructionCost: 'Náklady výstavby' },
            pl: { rent: 'Czynsz / Stawka nocna', occupancy: 'Obłożenie (±5%)', purchasePrice: 'Cena zakupu', exitCapRate: 'Exit Cap Rate (+0,5%)', interestRate: 'Stopa procentowa (+1%)', salePrice: 'Cena sprzedaży', constructionCost: 'Koszty budowy' },
            hu: { rent: 'Bérleti díj / Éjszakai díj', occupancy: 'Foglaltság (±5%)', purchasePrice: 'Vételár', exitCapRate: 'Exit Cap Rate (+0,5%)', interestRate: 'Kamatláb (+1%)', salePrice: 'Eladási ár', constructionCost: 'Építési költségek' },
            de: { rent: 'Miete / Nachtpreis', occupancy: 'Belegung (±5%)', purchasePrice: 'Kaufpreis', exitCapRate: 'Exit Cap Rate (+0,5%)', interestRate: 'Zinssatz (+1%)', salePrice: 'Verkaufspreis', constructionCost: 'Baukosten' },
        };
        const L = LABELS[language] || LABELS.en;

        // Helper: run calculation and extract IRR
        const calcIrr = async (modifiedData) => {
            let res;
            switch (projectType) {
                case 'long_term_lease': res = calculateLongTermLease(modifiedData, preset, language); break;
                case 'commercial': res = calculateCommercial(modifiedData, preset, language); break;
                case 'airbnb': res = calculateAirbnb(modifiedData, preset, language); break;
                case 'development': {
                    const { calculateDevelopment } = await import('../components/calculator/development/calculation');
                    res = calculateDevelopment(modifiedData, preset, language);
                    break;
                }
                default: return null;
            }
            const raw = res?.kpis?.irr;
            return raw != null ? raw : null;
        };

        // Deep clone helper
        const clone = (d) => JSON.parse(JSON.stringify(d));

        let scenarios = [];

        if (projectType === 'development') {
            // Sale price ±10%
            const saleMinus = clone(projectData);
            if (saleMinus.revenue_data?.avg_price_per_m2) saleMinus.revenue_data.avg_price_per_m2 *= 0.9;
            const salePlus = clone(projectData);
            if (salePlus.revenue_data?.avg_price_per_m2) salePlus.revenue_data.avg_price_per_m2 *= 1.1;

            // Construction cost ±10%
            const constrMinus = clone(projectData);
            if (constrMinus.construction_data?.construction_cost_per_m2) constrMinus.construction_data.construction_cost_per_m2 *= 0.9;
            const constrPlus = clone(projectData);
            if (constrPlus.construction_data?.construction_cost_per_m2) constrPlus.construction_data.construction_cost_per_m2 *= 1.1;

            // Interest rate +1%
            const intMinus = clone(projectData);
            if (intMinus.financing_data?.interest_rate != null) intMinus.financing_data.interest_rate = Math.max(0, (Number(intMinus.financing_data.interest_rate) || 0) - 1);
            const intPlus = clone(projectData);
            if (intPlus.financing_data?.interest_rate != null) intPlus.financing_data.interest_rate = (Number(intPlus.financing_data.interest_rate) || 0) + 1;

            const [sM, sP, cM, cP, iM, iP] = await Promise.all([
                calcIrr(saleMinus), calcIrr(salePlus), calcIrr(constrMinus), calcIrr(constrPlus), calcIrr(intMinus), calcIrr(intPlus)
            ]);

            scenarios = [
                { label: L.salePrice, irr_minus10: sM, irr_plus10: sP, base_irr: baseIrr },
                { label: L.constructionCost, irr_minus10: cM, irr_plus10: cP, base_irr: baseIrr },
                { label: L.interestRate, irr_minus10: iM, irr_plus10: iP, base_irr: baseIrr },
            ];

        } else if (projectType === 'airbnb') {
            // Occupancy ±5%
            const occMinus = clone(projectData);
            occMinus.income_data = { ...occMinus.income_data, occupancy_rate: Math.max(0, (Number(occMinus.income_data?.occupancy_rate) || 70) - 5) };
            const occPlus = clone(projectData);
            occPlus.income_data = { ...occPlus.income_data, occupancy_rate: Math.min(100, (Number(occPlus.income_data?.occupancy_rate) || 70) + 5) };

            // Nightly rate ±10%
            const rateMinus = clone(projectData);
            rateMinus.income_data = { ...rateMinus.income_data, avg_nightly_rate: (Number(rateMinus.income_data?.avg_nightly_rate) || 0) * 0.9 };
            const ratePlus = clone(projectData);
            ratePlus.income_data = { ...ratePlus.income_data, avg_nightly_rate: (Number(ratePlus.income_data?.avg_nightly_rate) || 0) * 1.1 };

            // Purchase price ±10%
            const priceMinus = clone(projectData);
            priceMinus.property_data = { ...priceMinus.property_data, purchase_price: (Number(priceMinus.property_data?.purchase_price) || 0) * 0.9 };
            const pricePlus = clone(projectData);
            pricePlus.property_data = { ...pricePlus.property_data, purchase_price: (Number(pricePlus.property_data?.purchase_price) || 0) * 1.1 };

            // Interest ±1%
            const intMinus = clone(projectData);
            intMinus.financing_data = { ...intMinus.financing_data, interest_rate: Math.max(0, (Number(intMinus.financing_data?.interest_rate) || 0) - 1) };
            const intPlus = clone(projectData);
            intPlus.financing_data = { ...intPlus.financing_data, interest_rate: (Number(intPlus.financing_data?.interest_rate) || 0) + 1 };

            const [oM, oP, rM, rP, prM, prP, iM, iP] = await Promise.all([
                calcIrr(occMinus), calcIrr(occPlus), calcIrr(rateMinus), calcIrr(ratePlus),
                calcIrr(priceMinus), calcIrr(pricePlus), calcIrr(intMinus), calcIrr(intPlus)
            ]);

            scenarios = [
                { label: L.rent, irr_minus10: rM, irr_plus10: rP, base_irr: baseIrr },
                { label: L.occupancy, irr_minus10: oM, irr_plus10: oP, base_irr: baseIrr },
                { label: L.purchasePrice, irr_minus10: prM, irr_plus10: prP, base_irr: baseIrr },
                { label: L.interestRate, irr_minus10: iM, irr_plus10: iP, base_irr: baseIrr },
            ];

        } else {
            // long_term_lease / commercial
            // Rent ±10%
            const rentMinus = clone(projectData);
            if (rentMinus.property_data?.monthly_rent) rentMinus.property_data.monthly_rent *= 0.9;
            if (rentMinus.income_data?.base_rent) rentMinus.income_data.base_rent *= 0.9;
            const rentPlus = clone(projectData);
            if (rentPlus.property_data?.monthly_rent) rentPlus.property_data.monthly_rent *= 1.1;
            if (rentPlus.income_data?.base_rent) rentPlus.income_data.base_rent *= 1.1;

            // Purchase price ±10%
            const priceMinus = clone(projectData);
            const priceField = priceMinus.property_data?.purchase_price != null ? 'purchase_price' : 'price';
            priceMinus.property_data = { ...priceMinus.property_data, [priceField]: (Number(priceMinus.property_data?.[priceField]) || 0) * 0.9 };
            const pricePlus = clone(projectData);
            pricePlus.property_data = { ...pricePlus.property_data, [priceField]: (Number(pricePlus.property_data?.[priceField]) || 0) * 1.1 };

            // Interest rate ±1%
            const intMinus = clone(projectData);
            intMinus.financing_data = { ...intMinus.financing_data, interest_rate: Math.max(0, (Number(intMinus.financing_data?.interest_rate) || 0) - 1) };
            const intPlus = clone(projectData);
            intPlus.financing_data = { ...intPlus.financing_data, interest_rate: (Number(intPlus.financing_data?.interest_rate) || 0) + 1 };

            // Exit cap rate: shift assumptions ±0.5%
            const exitMinus = clone(projectData);
            exitMinus.assumptions_data = { ...exitMinus.assumptions_data, exit_cap_rate: Math.max(0.1, (Number(exitMinus.assumptions_data?.exit_cap_rate) || (baseResults.kpis.cap_rate || 5)) - 0.5) };
            const exitPlus = clone(projectData);
            exitPlus.assumptions_data = { ...exitPlus.assumptions_data, exit_cap_rate: (Number(exitPlus.assumptions_data?.exit_cap_rate) || (baseResults.kpis.cap_rate || 5)) + 0.5 };

            const [rM, rP, prM, prP, iM, iP, eM, eP] = await Promise.all([
                calcIrr(rentMinus), calcIrr(rentPlus), calcIrr(priceMinus), calcIrr(pricePlus),
                calcIrr(intMinus), calcIrr(intPlus), calcIrr(exitMinus), calcIrr(exitPlus)
            ]);

            scenarios = [
                { label: L.rent, irr_minus10: rM, irr_plus10: rP, base_irr: baseIrr },
                { label: L.purchasePrice, irr_minus10: prM, irr_plus10: prP, base_irr: baseIrr },
                { label: L.interestRate, irr_minus10: iM, irr_plus10: iP, base_irr: baseIrr },
                { label: L.exitCapRate, irr_minus10: eM, irr_plus10: eP, base_irr: baseIrr },
            ];
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
- DSCR: ${kpis.dscr?.toFixed(2) || 'N/A'}%
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
            // console.error("Failed to load template:", error); // Removed logging
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
            
            const clonedResults = JSON.parse(JSON.stringify(calculatedResults));
            setResults(clonedResults);
            setProjectData(prev => ({
                ...prev,
                results: clonedResults
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
                const DevelopmentResults = React.lazy(() => import('../components/calculator/development/ResultsDisplay'));
                return (
                    <React.Suspense fallback={<div>Loading Development Results...</div>}>
                        <DevelopmentResults 
                            results={results} 
                            currency={currency} 
                            language={language}
                            holdingPeriod={projectData.timeline?.total_months || 24}
                            sensitivityData={sensitivityData}
                        />
                    </React.Suspense>
                );
            default:
                return null;
        }
    };

  return (
    <div className="print:bg-white">
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
                            results={results}
                            projectType={projectData?.type}
                            country={projectData?.country}
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