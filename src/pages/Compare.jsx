import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Loader2 } from 'lucide-react';

import ProjectSelector from '../components/compare/ProjectSelector';
import ComparisonView from '../components/compare/ComparisonView';

export default function ComparePage() {
    const [selectedProjectIds, setSelectedProjectIds] = useState([]);

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

    const language = user?.preferred_language || 'en';

    const translations = {
        en: {
            title: "Compare Projects",
            subtitle: "Select up to 4 projects to compare side-by-side",
            no_projects_selected: "No Projects Selected",
            no_projects_selected_desc: "Choose projects from the list above to start comparing.",
        },
        sk: {
            title: "Porovnať projekty",
            subtitle: "Vyberte až 4 projekty na porovnanie vedľa seba",
            no_projects_selected: "Žiadne projekty nie sú vybrané",
            no_projects_selected_desc: "Vyberte projekty zo zoznamu vyššie pre začatie porovnania.",
        },
        pl: {
            title: "Porównaj projekty",
            subtitle: "Wybierz do 4 projektów do porównania obok siebie",
            no_projects_selected: "Nie wybrano projektów",
            no_projects_selected_desc: "Wybierz projekty z listy powyżej, aby rozpocząć porównanie.",
        },
        hu: {
            title: "Projektek összehasonlítása",
            subtitle: "Válasszon ki legfeljebb 4 projektet az összehasonlításhoz",
            no_projects_selected: "Nincs kiválasztott projekt",
            no_projects_selected_desc: "Válasszon projekteket a fenti listáról az összehasonlítás megkezdéséhez.",
        },
        de: {
            title: "Projekte vergleichen",
            subtitle: "Wählen Sie bis zu 4 Projekte zum Vergleich nebeneinander",
            no_projects_selected: "Keine Projekte ausgewählt",
            no_projects_selected_desc: "Wählen Sie Projekte aus der obigen Liste aus, um mit dem Vergleich zu beginnen.",
        }
    };

    const t = translations[language] || translations.en;

    const isLoading = isUserLoading || areProjectsLoading;

    if (isLoading) {
        return <div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    const selectedProjects = projects?.filter(p => selectedProjectIds.includes(p.id)) || [];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-foreground">{t.title}</h1>
                <p className="text-lg text-muted-foreground">{t.subtitle}</p>
            </div>

            <ProjectSelector
                projects={projects || []}
                selectedIds={selectedProjectIds}
                onSelectionChange={setSelectedProjectIds}
                language={language}
            />

            {selectedProjects.length > 0 ? (
                <ComparisonView projects={selectedProjects} language={language} />
            ) : (
                <div className="text-center py-16 border-2 border-dashed border-border rounded-xl bg-card">
                    <h3 className="text-xl font-semibold text-foreground">{t.no_projects_selected}</h3>
                    <p className="text-muted-foreground mt-2">{t.no_projects_selected_desc}</p>
                </div>
            )}
        </div>
    );
}