import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Save, ArrowRight, Loader2, Layers, List, ArrowLeft } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { useNavigate, Link } from 'react-router-dom';
import FeasibilityInputs from '../components/landFeasibility/FeasibilityInputs';
import FeasibilityResults from '../components/landFeasibility/FeasibilityResults';
import ConceptList from '../components/landFeasibility/ConceptList';
import { calculateFeasibility } from '../components/landFeasibility/feasibilityCalculation';

const DEFAULT_INPUTS = {
  land_area: 2000,
  iz: 0.40,
  kpp: null,
  floors: 5,
  project_type: 'residential',
  non_residential_pct: 0,
  min_green_pct: 0.20,
  avg_apartment_size: 60,
  mode: 'realistic',
  green_on_structure: false,
};

const translations = {
  en: {
    title: "Land Feasibility Tool",
    subtitle: "Concept Generator — pre-investment land potential analysis",
    new_concept: "New Concept",
    my_concepts: "My Concepts",
    editor: "Editor",
    concept_name: "Concept Name",
    save: "Save",
    saving: "Saving…",
    back_to_list: "Back to list",
    transfer_title: "Transfer to Development Calculator",
    transfer_confirm: "This will create a new Development Calculator project with data from this concept. Continue?",
    transfer_ok: "Transfer",
    cancel: "Cancel",
    transferred_ok: "Transferred! Redirecting to calculator…",
    unsaved: "Unsaved",
    new_concept_placeholder: "e.g. Plot Bratislava – Ružinov",
  },
  sk: {
    title: "Land Feasibility Tool",
    subtitle: "Concept Generator — predkúpová analýza potenciálu pozemku",
    new_concept: "Nový koncept",
    my_concepts: "Moje koncepty",
    editor: "Editor",
    concept_name: "Názov konceptu",
    save: "Uložiť",
    saving: "Ukladám…",
    back_to_list: "Späť na zoznam",
    transfer_title: "Preniesť do Development Kalkulačky",
    transfer_confirm: "Vytvorí sa nový projekt v Development Kalkulačke s údajmi z tohto konceptu. Pokračovať?",
    transfer_ok: "Preniesť",
    cancel: "Zrušiť",
    transferred_ok: "Prenesené! Presmerovávam do kalkulačky…",
    unsaved: "Neuložené",
    new_concept_placeholder: "napr. Pozemok Bratislava – Ružinov",
  },
};

export default function LandFeasibility() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({ queryKey: ['currentUser'], queryFn: () => base44.auth.me() });
  const language = user?.preferred_language || 'sk';
  const t = translations[language] || translations.sk;

  const [view, setView] = useState('list'); // 'list' | 'editor'
  const [inputs, setInputs] = useState(DEFAULT_INPUTS);
  const [conceptName, setConceptName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [transferPending, setTransferPending] = useState(null);
  const [transferSuccess, setTransferSuccess] = useState(false);

  const results = useMemo(() => calculateFeasibility(inputs), [inputs]);

  const handleInputsChange = (newInputs) => {
    setInputs(newInputs);
    setIsDirty(true);
  };

  const { data: concepts = [], isLoading } = useQuery({
    queryKey: ['landConcepts'],
    queryFn: () => base44.entities.LandConcept.list('-created_date'),
  });

  const saveMutation = useMutation({
    mutationFn: (data) => editingId
      ? base44.entities.LandConcept.update(editingId, data)
      : base44.entities.LandConcept.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landConcepts'] });
      setIsDirty(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.LandConcept.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['landConcepts'] }),
  });

  const handleSave = () => {
    saveMutation.mutate({
      name: conceptName || `Concept ${new Date().toLocaleDateString('sk-SK')}`,
      status: 'completed',
      data_confidence: 'concept',
      inputs,
      results,
    });
  };

  const handleOpen = (concept) => {
    setEditingId(concept.id);
    setConceptName(concept.name);
    setInputs({ ...DEFAULT_INPUTS, ...(concept.inputs || {}) });
    setIsDirty(false);
    setView('editor');
  };

  const handleNew = () => {
    setEditingId(null);
    setConceptName('');
    setInputs(DEFAULT_INPUTS);
    setIsDirty(false);
    setView('editor');
  };

  const handleTransfer = (concept) => {
    setTransferPending(concept);
  };

  const confirmTransfer = async () => {
    if (!transferPending) return;
    const r = transferPending.results || {};
    const projectData = {
      name: transferPending.name,
      type: 'development',
      status: 'draft',
      project_info_data: { concept_source: transferPending.id, data_confidence: 'concept' },
      land_data: { land_area: r.land_area || 0 },
      construction_data: {
        built_area: r.built_area || 0,
        hpp_above: r.hpp_above || 0,
        hpp_below: r.hpp_below || 0,
        npp_above: r.npp_above || 0,
        npp_below: r.npp_below || 0,
        apartments_area: r.apartments_area || 0,
        apartment_count: r.apartment_count || 0,
        non_residential_area: r.non_residential_area || 0,
        balconies_area: r.balconies_area || 0,
        parking_covered: r.parking_covered || 0,
        parking_outdoor: r.parking_outdoor || 0,
      },
    };

    const newProject = await base44.entities.Project.create(projectData);
    await base44.entities.LandConcept.update(transferPending.id, {
      status: 'transferred',
      linked_project_id: newProject.id,
    });
    queryClient.invalidateQueries({ queryKey: ['landConcepts'] });
    setTransferPending(null);
    setTransferSuccess(true);
    setTimeout(() => {
      navigate(createPageUrl(`Calculator?id=${newProject.id}`));
    }, 1500);
  };

  return (
    <div>

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10 shrink-0">
            <Layers className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground leading-tight">{t.title}</h1>
            <p className="text-sm text-muted-foreground">{t.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {view === 'editor' ? (
            <>
              {isDirty && (
                <Badge variant="outline" className="text-xs text-amber-600 border-amber-300 hidden sm:flex">
                  {t.unsaved}
                </Badge>
              )}
              <Button variant="outline" size="sm" onClick={() => setView('list')} className="gap-1.5">
                <List className="h-4 w-4" />
                <span className="hidden sm:inline">{t.back_to_list}</span>
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saveMutation.isPending} className="bg-primary hover:bg-primary/90 gap-1.5">
                {saveMutation.isPending
                  ? <><Loader2 className="h-4 w-4 animate-spin" /><span className="hidden sm:inline">{t.saving}</span></>
                  : <><Save className="h-4 w-4" /><span className="hidden sm:inline">{t.save}</span></>}
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={handleNew} className="bg-primary hover:bg-primary/90 gap-1.5">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">{t.new_concept}</span>
            </Button>
          )}
        </div>
      </div>

      {/* ── Main Content ── */}
      <div>

        {view === 'list' ? (
          /* LIST VIEW */
          isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <ConceptList
              concepts={concepts}
              onOpen={handleOpen}
              onDelete={(id) => deleteMutation.mutate(id)}
              onTransfer={handleTransfer}
              language={language}
              onNew={handleNew}
            />
          )
        ) : (
          /* EDITOR VIEW — two-column like Calculator */
          <div className="space-y-4">
            {/* Concept name row */}
            <div className="bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-3">
              <Label className="text-sm font-medium text-muted-foreground shrink-0">{t.concept_name}:</Label>
              <Input
                className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 text-base font-semibold p-0 h-auto"
                placeholder={t.new_concept_placeholder}
                value={conceptName}
                onChange={e => { setConceptName(e.target.value); setIsDirty(true); }}
              />
            </div>

            {/* Two-column grid — same as Calculator */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 items-start">
              {/* Inputs */}
              <div className="bg-card p-4 sm:p-6 rounded-xl lg:rounded-2xl border border-border shadow-premium">
                <FeasibilityInputs inputs={inputs} onChange={handleInputsChange} language={language} />
              </div>

              {/* Results — sticky on large screens */}
              <div className="xl:sticky xl:top-24">
                <FeasibilityResults results={results} language={language} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Transfer confirm dialog */}
      {transferPending && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl shadow-xl p-6 max-w-md w-full space-y-4">
            <h2 className="text-lg font-bold">{t.transfer_title}</h2>
            <p className="text-sm text-muted-foreground">{t.transfer_confirm}</p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setTransferPending(null)}>{t.cancel}</Button>
              <Button onClick={confirmTransfer} className="bg-green-600 hover:bg-green-700 text-white">
                <ArrowRight className="h-4 w-4 mr-2" /> {t.transfer_ok}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer success toast */}
      {transferSuccess && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white rounded-xl px-5 py-3 shadow-lg text-sm font-medium z-50">
          {t.transferred_ok}
        </div>
      )}
    </div>
  );

}