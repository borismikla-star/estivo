import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Loader2, Home, Building, Package, LineChart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

import ProjectTypeSummary from '../components/dashboard/ProjectTypeSummary';
import FeatureCard from '../components/dashboard/FeatureCard';
import ProjectPerformanceTable from '../components/portfolio/ProjectPerformanceTable';
import FloatingActionBar from '../components/portfolio/FloatingActionBar';
import DeleteConfirmationDialog from '../components/shared/DeleteConfirmationDialog';
import NewProjectDialog from '../components/dashboard/NewProjectDialog';
import TrialStatus from '../components/shared/TrialStatus';
import UpgradePrompt from '../components/shared/UpgradePrompt';
import AppFooter from '../components/layout/AppFooter';

export default function Dashboard() {
    const queryClient = useQueryClient();
    const [selectedProjectIds, setSelectedProjectIds] = useState(new Set());
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
    const [newProjectType, setNewProjectType] = useState(null);
    const [newProjectTitle, setNewProjectTitle] = useState('');
    const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

    // Use cached user from Layout - don't fetch again
    const { data: user, isLoading: isUserLoading } = useQuery({
        queryKey: ['currentUser'],
        queryFn: async () => {
            try {
                return await base44.auth.me();
            } catch (error) {
                return null;
            }
        },
        retry: false,
        staleTime: 1000 * 60 * 5,
    });
    
    const { data: projects, isLoading: areProjectsLoading, refetch: refetchProjects } = useQuery({
        queryKey: ['userProjects', user?.email],
        queryFn: () => user ? base44.entities.Project.filter({ created_by: user.email }, '-updated_date') : [],
        enabled: !!user,
    });

    const deleteProjectsMutation = useMutation({
        mutationFn: async (ids) => {
            const deletePromises = Array.from(ids).map(id => base44.entities.Project.delete(id));
            return Promise.all(deletePromises);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProjects'] });
            setSelectedProjectIds(new Set());
        },
        onError: (error) => {
            console.error("Failed to delete projects:", error);
        }
    });

    const handleConfirmDelete = () => {
        deleteProjectsMutation.mutate(selectedProjectIds);
        setIsDeleteDialogOpen(false);
    };

    const handleOpenNewProjectDialog = (type, title) => {
        const isFreePlan = !user?.plan || user.plan === 'free';
        
        if (isFreePlan) {
            // Free plan can only create long_term_lease projects
            if (type !== 'long_term_lease') {
                setShowUpgradePrompt(true);
                return;
            }
            
            // Check if they already have a long_term_lease project
            const longTermLeaseProjects = projects?.filter(p => p.type === 'long_term_lease') || [];
            if (longTermLeaseProjects.length >= 1) {
                setShowUpgradePrompt(true);
                return;
            }
        }
        
        setNewProjectType(type);
        setNewProjectTitle(title);
        setIsNewProjectDialogOpen(true);
    };

    const language = user?.preferred_language || 'en';

    const translations = {
        sk: {
            welcome: `Vitajte späť, ${user?.full_name || 'používateľ'}!`,
            subtitle: "Pripravený nájsť ďalšiu investíciu?",
            my_projects: "Prehľad projektov",
            start_new: "Začať nový projekt",
            long_term_lease: "Dlhodobý prenájom",
            ltl_desc: "Analyzujte klasické rezidenčné nehnuteľnosti na prenájom.",
            airbnb: "Krátkodobý prenájom",
            airbnb_desc: "Vyhodnoťte potenciál nehnuteľností pre Airbnb alebo dovolenkový prenájom.",
            commercial: "Komerčné nehnuteľnosti",
            commercial_desc: "Pre kancelárie, maloobchod alebo priemyselné nehnuteľnosti.",
            development: "Developerský projekt",
            dev_desc: "Modelujte komplexné stavebné projekty od začiatku do konca.",
            no_projects: "Zatiaľ nemáte žiadne projekty. Začnite svoj prvý!",
            no_projects_desc: "Uložené projekty sa zobrazia tu. Začnite nový nižšie.",
            delete_selected: (count) => `Odstrániť ${count} projekt${count > 1 ? 'y' : ''}`,
            cancel: "Zrušiť",
            delete_confirmation_title: "Ste si istý?",
            delete_confirmation_desc: (count) => `Toto natrvalo odstráni ${count} vybraný projekt${count > 1 ? 'y' : ''}. Túto akciu nemožno vrátiť späť.`,
            delete_button: "Odstrániť",
        },
        en: {
            welcome: `Welcome back, ${user?.full_name || 'user'}!`,
            subtitle: "Ready to find your next deal?",
            my_projects: "Projects Overview",
            start_new: "Start a New Project",
            long_term_lease: "Long-Term Lease",
            ltl_desc: "Analyze classic buy-to-let residential properties.",
            airbnb: "Short-Term Rental",
            airbnb_desc: "Evaluate properties for Airbnb or vacation rentals.",
            commercial: "Commercial Property",
            commercial_desc: "For office, retail, or industrial real estate assets.",
            development: "Development Project",
            dev_desc: "Model complex build-to-sell or build-to-rent projects.",
            no_projects: "You don't have any projects yet. Start your first one!",
            no_projects_desc: "Your saved projects will appear here. Start a new one below.",
            delete_selected: (count) => `Delete ${count} project${count > 1 ? 's' : ''}`,
            cancel: "Cancel",
            delete_confirmation_title: "Are you sure?",
            delete_confirmation_desc: (count) => `This will permanently delete ${count} selected project${count > 1 ? 's' : ''}. This action cannot be undone.`,
            delete_button: "Delete",
        },
        pl: {
            welcome: `Witaj ponownie, ${user?.full_name || 'użytkowniku'}!`,
            subtitle: "Gotowy znaleźć swoją następną okazję?",
            my_projects: "Przegląd projektów",
            start_new: "Rozpocznij nowy projekt",
            long_term_lease: "Wynajem długoterminowy",
            ltl_desc: "Analizuj klasyczne nieruchomości mieszkalne na wynajem.",
            airbnb: "Wynajem krótkoterminowy",
            airbnb_desc: "Oceń nieruchomości pod kątem Airbnb lub wynajmu wakacyjnego.",
            commercial: "Nieruchomość komercyjna",
            commercial_desc: "Dla biur, handlu detalicznego lub nieruchomości przemysłowych.",
            development: "Projekt deweloperski",
            dev_desc: "Modeluj złożone projekty budowy na sprzedaż lub wynajem.",
            no_projects: "Nie masz jeszcze żadnych projektów. Rozpocznij swój pierwszy!",
            no_projects_desc: "Twoje zapisane projekty pojawią się tutaj. Rozpocznij nowy poniżej.",
            delete_selected: (count) => `Usuń ${count} projekt${count > 1 ? 'ów' : ''}`,
            cancel: "Anuluj",
            delete_confirmation_title: "Czy jesteś pewien?",
            delete_confirmation_desc: (count) => `To trwale usunie ${count} wybrany projekt${count > 1 ? 'ów' : ''}. Ta akcja nie może zostać cofnięta.`,
            delete_button: "Usuń",
        },
        hu: {
            welcome: `Üdvözöljük vissza, ${user?.full_name || 'felhasználó'}!`,
            subtitle: "Készen áll a következő ügylet megtalálására?",
            my_projects: "Projektek áttekintése",
            start_new: "Új projekt indítása",
            long_term_lease: "Hosszú távú bérlet",
            ltl_desc: "Elemezzen klasszikus lakóingatlanokat hosszú távú bérbeadásra.",
            airbnb: "Rövid távú bérlet",
            airbnb_desc: "Értékeljen ingatlanokat Airbnb vagy nyaralóbérlethez.",
            commercial: "Kereskedelmi ingatlan",
            commercial_desc: "Irodák, kiskereskedelem vagy ipari ingatlanok számára.",
            development: "Fejlesztési projekt",
            dev_desc: "Modellezzen komplex építési projekteket eladásra vagy bérbeadásra.",
            no_projects: "Még nincs egyetlen projektje sem. Indítsa el az elsőt!",
            no_projects_desc: "A mentett projektek itt jelennek meg. Indítson egy újat lent.",
            delete_selected: (count) => `${count} projekt törlése`, // Hungarian doesn't use pluralization like English/Slovak for this construct
            cancel: "Mégse",
            delete_confirmation_title: "Biztos benne?",
            delete_confirmation_desc: (count) => `Ez véglegesen törli a ${count} kiválasztott projektet. Ez a művelet nem vonható vissza.`,
            delete_button: "Törlés",
        },
        de: {
            welcome: `Willkommen zurück, ${user?.full_name || 'Benutzer'}!`,
            subtitle: "Bereit, Ihr nächstes Geschäft zu finden?",
            my_projects: "Projektübersicht",
            start_new: "Neues Projekt starten",
            long_term_lease: "Langfristige Vermietung",
            ltl_desc: "Analysieren Sie klassische Wohnimmobilien zur Vermietung.",
            airbnb: "Kurzzeitvermietung",
            airbnb_desc: "Bewerten Sie Immobilien für Airbnb oder Ferienvermietung.",
            commercial: "Gewerbeimmobilie",
            commercial_desc: "Für Büro-, Einzelhandels- oder Industrieimmobilien.",
            development: "Entwicklungsprojekt",
            dev_desc: "Modellieren Sie komplexe Bau-zu-Verkauf- oder Bau-zu-Vermietung-Projekte.",
            no_projects: "Sie haben noch keine Projekte. Starten Sie Ihr erstes!",
            no_projects_desc: "Ihre gespeicherten Projekte werden hier angezeigt. Starten Sie ein neues unten.",
            delete_selected: (count) => `${count} Projekt${count > 1 ? 'e' : ''} löschen`,
            cancel: "Abbrechen",
            delete_confirmation_title: "Sind Sie sicher?",
            delete_confirmation_desc: (count) => `Dies löscht ${count} ausgewählte${count > 1 ? '' : 's'} Projekt${count > 1 ? 'e' : ''} dauerhaft. Diese Aktion kann nicht rückgängig gemacht werden.`,
            delete_button: "Löschen",
        }
    };
    
    const t = translations[language] || translations.en;
    
    // If user is not loaded yet, show loading
    if (isUserLoading || !user) {
        return <div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    const projectCounts = projects?.reduce((acc, project) => {
        acc[project.type] = (acc[project.type] || 0) + 1;
        return acc;
    }, { long_term_lease: 0, airbnb: 0, commercial: 0, development: 0 }) || { long_term_lease: 0, airbnb: 0, commercial: 0, development: 0 };

    const newProjectFeatures = [
        { title: t.long_term_lease, description: t.ltl_desc, icon: Home, type: 'long_term_lease' },
        { title: t.airbnb, description: t.airbnb_desc, icon: Package, type: 'airbnb' },
        { title: t.commercial, description: t.commercial_desc, icon: Building, type: 'commercial' },
        { title: t.development, description: t.dev_desc, icon: LineChart, type: 'development' },
    ];
    
    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-1 space-y-12">
            <div>
                <h1 className="text-3xl font-bold text-foreground">{t.welcome}</h1>
                <p className="text-lg text-muted-foreground">{t.subtitle}</p>
            </div>

            <TrialStatus user={user} language={language} />

            <ProjectTypeSummary counts={projectCounts} t={t} />

            <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">{t.my_projects}</h2>
                {(projects && projects.length > 0) ? (
                    <ProjectPerformanceTable 
                        projects={projects}
                        selectedIds={selectedProjectIds}
                        onSelectionChange={setSelectedProjectIds}
                        language={language}
                        user={user} 
                    />
                ) : (
                    <div className="text-center py-16 border-2 border-dashed border-border rounded-xl bg-card">
                        <h3 className="text-xl font-semibold text-foreground">{t.no_projects}</h3>
                        <p className="text-muted-foreground mt-2">{t.no_projects_desc}</p>
                    </div>
                )}
            </div>

            <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">{t.start_new}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {newProjectFeatures.map((feature, index) => {
                        const isFreePlan = !user?.plan || user.plan === 'free';
                        const isLocked = isFreePlan && feature.type !== 'long_term_lease';
                        
                        return (
                            <div key={feature.title} className="relative">
                                <FeatureCard
                                    icon={feature.icon}
                                    title={feature.title}
                                    description={feature.description}
                                    onClick={() => handleOpenNewProjectDialog(feature.type, feature.title)}
                                    delay={0.1 * index}
                                />
                                {isLocked && (
                                    <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px] rounded-2xl flex items-center justify-center">
                                        <div className="bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                            </svg>
                                            Pro Feature
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {selectedProjectIds.size > 0 && (
                <FloatingActionBar
                    count={selectedProjectIds.size}
                    onClear={() => setSelectedProjectIds(new Set())}
                >
                    <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        {t.delete_selected(selectedProjectIds.size)}
                    </Button>
                </FloatingActionBar>
            )}

            <DeleteConfirmationDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
                title={t.delete_confirmation_title}
                description={t.delete_confirmation_desc(selectedProjectIds.size)}
                confirmText={t.delete_button}
                cancelText={t.cancel}
            />

            <NewProjectDialog 
                open={isNewProjectDialogOpen}
                onOpenChange={setIsNewProjectDialogOpen}
                projectType={newProjectType}
                projectTitle={newProjectTitle}
                language={language}
                />

                </div>

                <AppFooter language={language} />
                </div>
                );
                }