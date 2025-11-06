
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Loader2, TrendingUp, Briefcase, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

import PortfolioStats from '../components/portfolio/PortfolioStats';
import PortfolioBreakdownChart from '../components/portfolio/PortfolioBreakdownChart';
import ProjectPerformanceTable from '../components/portfolio/ProjectPerformanceTable';
import FloatingActionBar from '../components/portfolio/FloatingActionBar';
import DeleteConfirmationDialog from '../components/shared/DeleteConfirmationDialog';

export default function PortfolioPage() {
    const queryClient = useQueryClient();
    const [selectedProjectIds, setSelectedProjectIds] = useState(new Set());
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const { data: user, isLoading: isUserLoading } = useQuery({
        queryKey: ['currentUser'],
        queryFn: () => base44.auth.me(),
        retry: false,
    });

    const { data: projects, isLoading: areProjectsLoading } = useQuery({
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
    });

    const language = user?.preferred_language || 'en';

    const translations = {
        en: {
            title: "Portfolio Overview",
            subtitle: "Track and analyze your entire real estate portfolio",
            stats_title: "Portfolio Statistics",
            breakdown_title: "Portfolio Breakdown",
            performance_title: "Project Performance",
            total_invested: "Total Invested",
            total_value: "Total Portfolio Value",
            avg_roi: "Average ROI",
            total_cashflow: "Total Monthly Cash Flow",
            no_projects: "No projects in your portfolio",
            no_projects_desc: "Start building your portfolio by creating your first project.",
            create_project: "Create Project",
            export_portfolio: "Export Portfolio",
            delete_selected: (count) => `Delete ${count} project${count > 1 ? 's' : ''}`,
            cancel: "Cancel",
            delete_confirm_title: "Delete Projects?",
            delete_confirm_desc: (count) => `Are you sure you want to delete ${count} selected project${count > 1 ? 's' : ''}? This action cannot be undone.`,
            delete: "Delete",
        },
        sk: {
            title: "Prehľad portfólia",
            subtitle: "Sledujte a analyzujte celé vaše realitné portfólio",
            stats_title: "Štatistiky portfólia",
            breakdown_title: "Rozloženie portfólia",
            performance_title: "Výkonnosť projektov",
            total_invested: "Celkovo investované",
            total_value: "Celková hodnota portfólia",
            avg_roi: "Priemerný ROI",
            total_cashflow: "Celkový mesačný Cash Flow",
            no_projects: "Žiadne projekty vo vašom portfóliu",
            no_projects_desc: "Začnite budovať svoje portfólio vytvorením prvého projektu.",
            create_project: "Vytvoriť projekt",
            export_portfolio: "Exportovať portfólio",
            delete_selected: (count) => `Odstrániť ${count} projekt${count > 1 ? 'y' : ''}`,
            cancel: "Zrušiť",
            delete_confirm_title: "Odstrániť projekty?",
            delete_confirm_desc: (count) => `Naozaj chcete odstrániť ${count} vybraný projekt${count > 1 ? 'y' : ''}? Túto akciu nemožno vrátiť späť.`,
            delete: "Odstrániť",
        },
        pl: {
            title: "Przegląd portfolio",
            subtitle: "Śledź i analizuj całe swoje portfolio nieruchomości",
            stats_title: "Statystyki portfolio",
            breakdown_title: "Podział portfolio",
            performance_title: "Wydajność projektów",
            total_invested: "Łącznie zainwestowano",
            total_value: "Całkowita wartość portfolio",
            avg_roi: "Średni ROI",
            total_cashflow: "Całkowity miesięczny Cash Flow",
            no_projects: "Brak projektów w Twoim portfolio",
            no_projects_desc: "Zacznij budować swoje portfolio, tworząc pierwszy projekt.",
            create_project: "Utwórz projekt",
            export_portfolio: "Eksportuj portfolio",
            delete_selected: (count) => `Usuń ${count} projekt${count > 1 ? 'ów' : ''}`,
            cancel: "Anuluj",
            delete_confirm_title: "Usunąć projekty?",
            delete_confirm_desc: (count) => `Czy na pewno chcesz usunąć ${count} wybrany projekt${count > 1 ? 'ów' : ''}? Ta akcja nie może zostać cofnięta.`,
            delete: "Usuń",
        },
        hu: {
            title: "Portfólió áttekintése",
            subtitle: "Kövesse nyomon és elemezze teljes ingatlanportfólióját",
            stats_title: "Portfólió statisztikák",
            breakdown_title: "Portfólió bontás",
            performance_title: "Projekt teljesítmény",
            total_invested: "Összes befektetés",
            total_value: "Teljes portfólió érték",
            avg_roi: "Átlagos ROI",
            total_cashflow: "Összes havi Cash Flow",
            no_projects: "Nincs projekt a portfóliójában",
            no_projects_desc: "Kezdje el építeni portfólióját az első projekt létrehozásával.",
            create_project: "Projekt létrehozása",
            export_portfolio: "Portfólió exportálása",
            delete_selected: (count) => `${count} projekt törlése`,
            cancel: "Mégse",
            delete_confirm_title: "Projektek törlése?",
            delete_confirm_desc: (count) => `Biztosan törölni szeretné a kiválasztott ${count} projektet? Ez a művelet nem vonható vissza.`,
            delete: "Törlés",
        },
        de: {
            title: "Portfolio-Übersicht",
            subtitle: "Verfolgen und analysieren Sie Ihr gesamtes Immobilienportfolio",
            stats_title: "Portfolio-Statistiken",
            breakdown_title: "Portfolio-Aufschlüsselung",
            performance_title: "Projekt-Performance",
            total_invested: "Gesamtinvestition",
            total_value: "Gesamter Portfolio-Wert",
            avg_roi: "Durchschnittlicher ROI",
            total_cashflow: "Gesamter monatlicher Cash Flow",
            no_projects: "Keine Projekte in Ihrem Portfolio",
            no_projects_desc: "Beginnen Sie mit dem Aufbau Ihres Portfolios, indem Sie Ihr erstes Projekt erstellen.",
            create_project: "Projekt erstellen",
            export_portfolio: "Portfolio exportieren",
            delete_selected: (count) => `${count} Projekt${count > 1 ? 'e' : ''} löschen`,
            cancel: "Abbrechen",
            delete_confirm_title: "Projekte löschen?",
            delete_confirm_desc: (count) => `Sind Sie sicher, dass Sie ${count} ausgewählte${count > 1 ? 's' : ''} Projekt${count > 1 ? 'e' : ''} löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.`,
            delete: "Löschen",
        }
    };

    const t = translations[language] || translations.en;

    const handleConfirmDelete = () => {
        deleteProjectsMutation.mutate(selectedProjectIds);
        setIsDeleteDialogOpen(false);
    };

    const isLoading = isUserLoading || areProjectsLoading;

    if (isLoading) {
        return <div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-foreground">{t.title}</h1>
                <p className="text-lg text-muted-foreground">{t.subtitle}</p>
            </div>

            {(!projects || projects.length === 0) ? (
                <div className="text-center py-16 border-2 border-dashed border-border rounded-xl bg-card">
                    <h3 className="text-xl font-semibold text-foreground">{t.no_projects}</h3>
                    <p className="text-muted-foreground mt-2">{t.no_projects_desc}</p>
                    <Link to={createPageUrl('Dashboard')}>
                        <Button className="mt-4">
                            <Plus className="mr-2 h-4 w-4" />
                            {t.create_project}
                        </Button>
                    </Link>
                </div>
            ) : (
                <>
                    <div>
                        <h2 className="text-2xl font-bold mb-4">{t.stats_title}</h2>
                        <PortfolioStats projects={projects} language={language} t={t} />
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-2xl font-bold mb-4">{t.breakdown_title}</h2>
                            <PortfolioBreakdownChart projects={projects} language={language} t={t} />
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mb-4">{t.performance_title}</h2>
                        <ProjectPerformanceTable
                            projects={projects}
                            selectedIds={selectedProjectIds}
                            onSelectionChange={setSelectedProjectIds}
                            language={language}
                            user={user}
                        />
                    </div>
                </>
            )}

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
                title={t.delete_confirm_title}
                description={t.delete_confirm_desc(selectedProjectIds.size)}
                confirmText={t.delete}
                cancelText={t.cancel}
            />
        </div>
    );
}
