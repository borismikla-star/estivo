import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

export default function NewProjectDialog({ open, onOpenChange, projectType, projectTitle, language = 'en' }) {
    const [projectName, setProjectName] = useState('');
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Reset project name when dialog opens
    React.useEffect(() => {
        if (open) {
            setProjectName(projectTitle || '');
        }
    }, [open, projectTitle]);

    const createMutation = useMutation({
        mutationFn: async (data) => {
            // Create actual project via API
            const projectData = {
                name: data.name,
                type: data.type,
                status: 'draft',
                property_data: {},
                financing_data: {},
                initial_costs_data: {},
                operating_data: {},
                income_data: {},
                opex_data: {},
                assumptions_data: {},
                project_info_data: {},
                cost_data: {},
                revenue_data: {},
            };
            
            const response = await base44.entities.Project.create(projectData);
            return response;
        },
        onSuccess: (data) => {
            console.log("Project created successfully:", data);
            queryClient.invalidateQueries({ queryKey: ['userProjects'] });
            onOpenChange(false); // Close the dialog
            setProjectName(''); // Clear the input
            
            // Navigate to Calculator with the new project ID
            navigate(createPageUrl(`Calculator?id=${data.id}`));
        },
        onError: (error) => {
            console.error("Error creating project:", error);
            alert("Failed to create project. Please try again.");
        },
    });

    const handleCreate = () => {
        if (projectName.trim() && projectType) {
            createMutation.mutate({ name: projectName.trim(), type: projectType });
        }
    };

    const translations = {
        en: {
            create_project: "Create New Project",
            project_name: "Project Name",
            name_placeholder: "Enter project name...",
            cancel: "Cancel",
            create: "Create Project",
            creating: "Creating...",
        },
        sk: {
            create_project: "Vytvoriť nový projekt",
            project_name: "Názov projektu",
            name_placeholder: "Zadajte názov projektu...",
            cancel: "Zrušiť",
            create: "Vytvoriť projekt",
            creating: "Vytváram...",
        },
        pl: {
            create_project: "Utwórz nowy projekt",
            project_name: "Nazwa projektu",
            name_placeholder: "Wprowadź nazwę projektu...",
            cancel: "Anuluj",
            create: "Utwórz projekt",
            creating: "Tworzenie...",
        },
        hu: {
            create_project: "Új projekt létrehozása",
            project_name: "Projekt neve",
            name_placeholder: "Írja be a projekt nevét...",
            cancel: "Mégse",
            create: "Projekt létrehozása",
            creating: "Létrehozás...",
        },
        de: {
            create_project: "Neues Projekt erstellen",
            project_name: "Projektname",
            name_placeholder: "Projektnamen eingeben...",
            cancel: "Abbrechen",
            create: "Projekt erstellen",
            creating: "Erstellen...",
        }
    };

    const t = translations[language] || translations.en;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{t.create_project}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div>
                        <Label htmlFor="name">{t.project_name}</Label>
                        <Input
                            id="name"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            placeholder={t.name_placeholder}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && projectName.trim() && !createMutation.isLoading) {
                                    handleCreate();
                                }
                            }}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={createMutation.isLoading}>
                        {t.cancel}
                    </Button>
                    <Button onClick={handleCreate} disabled={!projectName.trim() || createMutation.isLoading}>
                        {createMutation.isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t.creating}
                            </>
                        ) : (
                            t.create
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}