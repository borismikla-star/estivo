import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Home, Package, Building, LineChart } from 'lucide-react';

const projectTypeIcons = {
    long_term_lease: Home,
    airbnb: Package,
    commercial: Building,
    development: LineChart,
};

export default function ProjectSelector({ projects, selectedIds, onSelectionChange, language = 'en' }) {
    const translations = {
        en: {
            select_projects: "Select Projects to Compare",
            select_up_to: "Select up to 4 projects",
            long_term_lease: "Long-Term Lease",
            airbnb: "Short-Term Rental",
            commercial: "Commercial",
            development: "Development",
            no_projects: "No projects available",
            no_projects_desc: "Create some projects first to compare them.",
        },
        sk: {
            select_projects: "Vyberte projekty na porovnanie",
            select_up_to: "Vyberte až 4 projekty",
            long_term_lease: "Dlhodobý prenájom",
            airbnb: "Krátkodobý prenájom",
            commercial: "Komerčné",
            development: "Development",
            no_projects: "Žiadne projekty k dispozícii",
            no_projects_desc: "Najprv vytvorte projekty, aby ste ich mohli porovnať.",
        },
        pl: {
            select_projects: "Wybierz projekty do porównania",
            select_up_to: "Wybierz do 4 projektów",
            long_term_lease: "Wynajem długoterminowy",
            airbnb: "Wynajem krótkoterminowy",
            commercial: "Komercyjne",
            development: "Deweloperskie",
            no_projects: "Brak dostępnych projektów",
            no_projects_desc: "Najpierw utwórz projekty, aby móc je porównać.",
        },
        hu: {
            select_projects: "Válassza ki az összehasonlítandó projekteket",
            select_up_to: "Válasszon ki legfeljebb 4 projektet",
            long_term_lease: "Hosszú távú bérlet",
            airbnb: "Rövid távú bérlet",
            commercial: "Kereskedelmi",
            development: "Fejlesztés",
            no_projects: "Nincsenek elérhető projektek",
            no_projects_desc: "Először hozzon létre projekteket az összehasonlításhoz.",
        },
        de: {
            select_projects: "Projekte zum Vergleich auswählen",
            select_up_to: "Wählen Sie bis zu 4 Projekte",
            long_term_lease: "Langfristige Vermietung",
            airbnb: "Kurzzeitvermietung",
            commercial: "Gewerblich",
            development: "Entwicklung",
            no_projects: "Keine Projekte verfügbar",
            no_projects_desc: "Erstellen Sie zuerst Projekte, um sie zu vergleichen.",
        }
    };

    const t = translations[language] || translations.en;

    const handleToggle = (projectId) => {
        if (selectedIds.includes(projectId)) {
            onSelectionChange(selectedIds.filter(id => id !== projectId));
        } else {
            if (selectedIds.length < 4) {
                onSelectionChange([...selectedIds, projectId]);
            }
        }
    };

    if (!projects || projects.length === 0) {
        return (
            <Card className="bg-card shadow-premium">
                <CardContent className="py-16 text-center">
                    <h3 className="text-xl font-semibold text-foreground">{t.no_projects}</h3>
                    <p className="text-muted-foreground mt-2">{t.no_projects_desc}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-card shadow-premium">
            <CardHeader>
                <CardTitle>{t.select_projects}</CardTitle>
                <p className="text-sm text-muted-foreground">{t.select_up_to}</p>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((project) => {
                        const isSelected = selectedIds.includes(project.id);
                        const isDisabled = !isSelected && selectedIds.length >= 4;
                        const Icon = projectTypeIcons[project.type] || Home;

                        return (
                            <div
                                key={project.id}
                                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                    isSelected
                                        ? 'border-primary bg-accent/50'
                                        : isDisabled
                                        ? 'border-border bg-muted/50 opacity-50 cursor-not-allowed'
                                        : 'border-border hover:border-primary/50 hover:bg-accent/30'
                                }`}
                                onClick={() => !isDisabled && handleToggle(project.id)}
                            >
                                <div className="flex items-start gap-3">
                                    <Checkbox
                                        checked={isSelected}
                                        disabled={isDisabled}
                                        onCheckedChange={() => !isDisabled && handleToggle(project.id)}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Icon className="h-4 w-4 text-primary flex-shrink-0" />
                                            <h4 className="font-semibold text-foreground truncate">{project.name}</h4>
                                        </div>
                                        <Badge variant="outline" className="text-xs">
                                            {t[project.type] || project.type}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}