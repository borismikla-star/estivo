
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from 'lucide-react';

export default function SaveTemplateDialog({ open, onOpenChange, onSave, language = 'en', isSaving = false }) {
    const [templateName, setTemplateName] = useState('');

    const translations = {
        en: {
            title: "Save as Template",
            description: "Save this project as a reusable template for future projects",
            template_name: "Template Name",
            name_placeholder: "Enter template name...",
            cancel: "Cancel",
            save: "Save Template",
            saving: "Saving...",
        },
        sk: {
            title: "Uložiť ako šablónu",
            description: "Uložte tento projekt ako znovupoužiteľnú šablónu pre budúce projekty",
            template_name: "Názov šablóny",
            name_placeholder: "Zadajte názov šablóny...",
            cancel: "Zrušiť",
            save: "Uložiť šablónu",
            saving: "Ukladám...",
        },
        pl: {
            title: "Zapisz jako szablon",
            description: "Zapisz ten projekt jako szablon wielokrotnego użytku dla przyszłych projektów",
            template_name: "Nazwa szablonu",
            name_placeholder: "Wprowadź nazwę szablonu...",
            cancel: "Anuluj",
            save: "Zapisz szablon",
            saving: "Zapisywanie...",
        },
        hu: {
            title: "Mentés sablonként",
            description: "Mentse el ezt a projektet újrafelhasználható sablonként a jövőbeli projektekhez",
            template_name: "Sablon neve",
            name_placeholder: "Írja be a sablon nevét...",
            cancel: "Mégse",
            save: "Sablon mentése",
            saving: "Mentés...",
        },
        de: {
            title: "Als Vorlage speichern",
            description: "Speichern Sie dieses Projekt als wiederverwendbare Vorlage für zukünftige Projekte",
            template_name: "Vorlagenname",
            name_placeholder: "Vorlagennamen eingeben...",
            cancel: "Abbrechen",
            save: "Vorlage speichern",
            saving: "Speichern...",
        }
    };

    const t = translations[language] || translations.en;

    const handleSave = () => {
        if (templateName.trim()) {
            onSave(templateName.trim());
            setTemplateName('');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t.title}</DialogTitle>
                    <DialogDescription>{t.description}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div>
                        <Label htmlFor="templateName">{t.template_name}</Label>
                        <Input
                            id="templateName"
                            value={templateName}
                            onChange={(e) => setTemplateName(e.target.value)}
                            placeholder={t.name_placeholder}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        {t.cancel}
                    </Button>
                    <Button onClick={handleSave} disabled={!templateName.trim() || isSaving}>
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t.saving}
                            </>
                        ) : (
                            t.save
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
