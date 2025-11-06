
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Loader2, Edit, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';

export default function AdminLegalPage() {
    const navigate = useNavigate();
    const { data: user } = useQuery({ queryKey: ['currentUser'], queryFn: () => base44.auth.me() });

    const { data: documents, isLoading } = useQuery({
        queryKey: ['legalDocuments'],
        queryFn: () => base44.entities.LegalDocument.list('-updated_date'),
    });

    const language = user?.preferred_language || 'en';

    const translations = {
        en: {
            title: "Legal Documents Management",
            subtitle: "Manage Terms of Service, Privacy Policy, and other legal pages",
            create_new: "Create New Document",
            search: "Search documents...",
            document_title: "Title",
            slug: "Slug",
            actions: "Actions",
            edit: "Edit",
            delete: "Delete",
            no_docs: "No legal documents",
            no_docs_desc: "Create your first legal document.",
            delete_confirm_title: "Delete Document?",
            delete_confirm_desc: "Are you sure you want to delete this legal document?",
            cancel: "Cancel",
        },
        sk: {
            title: "Správa právnych dokumentov",
            subtitle: "Spravujte Podmienky služby, Ochranu súkromia a ďalšie právne stránky",
            create_new: "Vytvoriť nový dokument",
            search: "Vyhľadať dokumenty...",
            document_title: "Názov",
            slug: "Slug",
            actions: "Akcie",
            edit: "Upraviť",
            delete: "Odstrániť",
            no_docs: "Žiadne právne dokumenty",
            no_docs_desc: "Vytvorte svoj prvý právny dokument.",
            delete_confirm_title: "Odstrániť dokument?",
            delete_confirm_desc: "Naozaj chcete odstrániť tento právny dokument?",
            cancel: "Zrušiť",
        },
        pl: {
            title: "Zarządzanie dokumentami prawnymi",
            subtitle: "Zarządzaj Warunkami świadczenia usług, Polityką prywatności i innymi stronami prawnymi",
            create_new: "Utwórz nowy dokument",
            search: "Szukaj dokumentów...",
            document_title: "Tytuł",
            slug: "Slug",
            actions: "Akcje",
            edit: "Edytuj",
            delete: "Usuń",
            no_docs: "Brak dokumentów prawnych",
            no_docs_desc: "Utwórz swój pierwszy dokument prawny.",
            delete_confirm_title: "Usunąć dokument?",
            delete_confirm_desc: "Czy na pewno chcesz usunąć ten dokument prawny?",
            cancel: "Anuluj",
        },
        hu: {
            title: "Jogi dokumentumok kezelése",
            subtitle: "Felhasználási feltételek, Adatvédelmi irányelvek és más jogi oldalak kezelése",
            create_new: "Új dokumentum létrehozása",
            search: "Dokumentumok keresése...",
            document_title: "Cím",
            slug: "Slug",
            actions: "Műveletek",
            edit: "Szerkesztés",
            delete: "Törlés",
            no_docs: "Nincsenek jogi dokumentumok",
            no_docs_desc: "Hozza létre első jogi dokumentumát.",
            delete_confirm_title: "Dokumentum törlése?",
            delete_confirm_desc: "Biztosan törölni szeretné ezt a jogi dokumentumot?",
            cancel: "Mégse",
        },
        de: {
            title: "Rechtsdokumente verwalten",
            subtitle: "Nutzungsbedingungen, Datenschutzrichtlinien und andere rechtliche Seiten verwalten",
            create_new: "Neues Dokument erstellen",
            search: "Dokumente suchen...",
            document_title: "Titel",
            slug: "Slug",
            actions: "Aktionen",
            edit: "Bearbeiten",
            delete: "Löschen",
            no_docs: "Keine Rechtsdokumente",
            no_docs_desc: "Erstellen Sie Ihr erstes Rechtsdokument.",
            delete_confirm_title: "Dokument löschen?",
            delete_confirm_desc: "Sind Sie sicher, dass Sie dieses Rechtsdokument löschen möchten?",
            cancel: "Abbrechen",
        }
    };

    const t = translations[language] || translations.en;

    if (isLoading) {
        return <div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t.title}</CardTitle>
                <CardDescription>{t.subtitle}</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t.document_title}</TableHead>
                            <TableHead>{t.slug}</TableHead>
                            <TableHead className="text-right">{t.actions}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {documents && documents.length > 0 ? (
                            documents?.map((doc) => (
                                <TableRow key={doc.id}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-muted-foreground"/> {doc.title}
                                    </TableCell>
                                    <TableCell>{doc.slug}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm" onClick={() => navigate(`/AdminLegalEditor?slug=${doc.slug}`)}>
                                            <Edit className="mr-2 h-4 w-4" /> {t.edit}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                                    {t.no_docs}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
