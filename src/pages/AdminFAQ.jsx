
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from '@/components/ui/switch';
import DeleteConfirmationDialog from '../components/shared/DeleteConfirmationDialog';

export default function AdminFAQPage() {
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editingFAQ, setEditingFAQ] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const { data: user } = useQuery({
        queryKey: ['currentUser'],
        queryFn: () => base44.auth.me(),
    });

    const { data: faqs, isLoading } = useQuery({
        queryKey: ['allFAQs'],
        queryFn: () => base44.entities.FAQ.list('order'),
    });

    const createMutation = useMutation({
        mutationFn: (data) => base44.entities.FAQ.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allFAQs'] });
            setIsEditDialogOpen(false);
            setEditingFAQ(null);
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => base44.entities.FAQ.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allFAQs'] });
            setIsEditDialogOpen(false);
            setEditingFAQ(null);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => base44.entities.FAQ.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allFAQs'] });
            setIsDeleteDialogOpen(false);
            setDeletingId(null);
        },
    });

    const handleSave = () => {
        const data = {
            question_sk: editingFAQ.question_sk,
            answer_sk: editingFAQ.answer_sk,
            question_en: editingFAQ.question_en,
            answer_en: editingFAQ.answer_en,
            category: editingFAQ.category,
            order: editingFAQ.order || 0,
            is_active: editingFAQ.is_active ?? true,
        };

        if (editingFAQ.id) {
            updateMutation.mutate({ id: editingFAQ.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const handleEdit = (faq) => {
        setEditingFAQ(faq ? { ...faq } : {
            question_sk: '',
            answer_sk: '',
            question_en: '',
            answer_en: '',
            category: 'general',
            order: 0,
            is_active: true,
        });
        setIsEditDialogOpen(true);
    };

    const handleDeleteClick = (id) => {
        setDeletingId(id);
        setIsDeleteDialogOpen(true);
    };

    const language = user?.preferred_language || 'en';

    const translations = {
        en: {
            title: "FAQ Management",
            subtitle: "Manage frequently asked questions",
            create_new: "Add New FAQ",
            search: "Search FAQs...",
            all_categories: "All Categories",
            general: "General",
            billing: "Billing",
            technical: "Technical",
            legal: "Legal",
            question: "Question",
            category: "Category",
            order: "Order",
            active: "Active",
            inactive: "Inactive",
            actions: "Actions",
            edit: "Edit",
            delete: "Delete",
            no_faqs: "No FAQ items",
            no_faqs_desc: "Create your first FAQ item.",
            delete_confirm_title: "Delete FAQ?",
            delete_confirm_desc: "Are you sure you want to delete this FAQ item?",
            cancel: "Cancel",
            save: "Save",
            edit_faq: "Edit FAQ",
            create_faq: "Create FAQ",
            question_sk: "Question (SK)",
            answer_sk: "Answer (SK)",
            question_en: "Question (EN)",
            answer_en: "Answer (EN)",
        },
        sk: {
            title: "Správa FAQ",
            subtitle: "Spravujte často kladené otázky",
            create_new: "Pridať novú FAQ",
            search: "Vyhľadať FAQ...",
            all_categories: "Všetky kategórie",
            general: "Všeobecné",
            billing: "Platby",
            technical: "Technické",
            legal: "Právne",
            question: "Otázka",
            category: "Kategória",
            order: "Poradie",
            active: "Aktívne",
            inactive: "Neaktívne",
            actions: "Akcie",
            edit: "Upraviť",
            delete: "Odstrániť",
            no_faqs: "Žiadne FAQ položky",
            no_faqs_desc: "Vytvorte svoju prvú FAQ položku.",
            delete_confirm_title: "Odstrániť FAQ?",
            delete_confirm_desc: "Naozaj chcete odstrániť túto FAQ položku?",
            cancel: "Zrušiť",
            save: "Uložiť",
            edit_faq: "Upraviť FAQ",
            create_faq: "Vytvoriť FAQ",
            question_sk: "Otázka (SK)",
            answer_sk: "Odpoveď (SK)",
            question_en: "Question (EN)",
            answer_en: "Answer (EN)",
        },
        pl: {
            title: "Zarządzanie FAQ",
            subtitle: "Zarządzaj najczęściej zadawanymi pytaniami",
            create_new: "Dodaj nowe FAQ",
            search: "Szukaj FAQ...",
            all_categories: "Wszystkie kategorie",
            general: "Ogólne",
            billing: "Płatności",
            technical: "Techniczne",
            legal: "Prawne",
            question: "Pytanie",
            category: "Kategoria",
            order: "Kolejność",
            active: "Aktywne",
            inactive: "Nieaktywne",
            actions: "Akcje",
            edit: "Edytuj",
            delete: "Usuń",
            no_faqs: "Brak pozycji FAQ",
            no_faqs_desc: "Utwórz swoją pierwszą pozycję FAQ.",
            delete_confirm_title: "Usunąć FAQ?",
            delete_confirm_desc: "Czy na pewno chcesz usunąć tę pozycję FAQ?",
            cancel: "Anuluj",
            save: "Zapisz",
            edit_faq: "Edytuj FAQ",
            create_faq: "Utwórz FAQ",
            question_sk: "Pytanie (SK)",
            answer_sk: "Odpowiedź (SK)",
            question_en: "Pytanie (EN)",
            answer_en: "Odpowiedź (EN)",
        },
        hu: {
            title: "GYIK kezelés",
            subtitle: "Gyakran ismételt kérdések kezelése",
            create_new: "Új GYIK hozzáadása",
            search: "GYIK keresése...",
            all_categories: "Minden kategória",
            general: "Általános",
            billing: "Számlázás",
            technical: "Technikai",
            legal: "Jogi",
            question: "Kérdés",
            category: "Kategória",
            order: "Sorrend",
            active: "Aktív",
            inactive: "Inaktív",
            actions: "Műveletek",
            edit: "Szerkesztés",
            delete: "Törlés",
            no_faqs: "Nincsenek GYIK elemek",
            no_faqs_desc: "Hozza létre első GYIK elemét.",
            delete_confirm_title: "GYIK törlése?",
            delete_confirm_desc: "Biztosan törölni szeretné ezt a GYIK elemet?",
            cancel: "Mégse",
            save: "Mentés",
            edit_faq: "GYIK szerkesztése",
            create_faq: "GYIK létrehozása",
            question_sk: "Kérdés (SK)",
            answer_sk: "Válasz (SK)",
            question_en: "Kérdés (EN)",
            answer_en: "Válasz (EN)",
        },
        de: {
            title: "FAQ-Verwaltung",
            subtitle: "Häufig gestellte Fragen verwalten",
            create_new: "Neue FAQ hinzufügen",
            search: "FAQs suchen...",
            all_categories: "Alle Kategorien",
            general: "Allgemein",
            billing: "Abrechnung",
            technical: "Technisch",
            legal: "Rechtlich",
            question: "Frage",
            category: "Kategorie",
            order: "Reihenfolge",
            active: "Aktiv",
            inactive: "Inaktiv",
            actions: "Aktionen",
            edit: "Bearbeiten",
            delete: "Löschen",
            no_faqs: "Keine FAQ-Elemente",
            no_faqs_desc: "Erstellen Sie Ihr erstes FAQ-Element.",
            delete_confirm_title: "FAQ löschen?",
            delete_confirm_desc: "Sind Sie sicher, dass Sie dieses FAQ-Element löschen möchten?",
            cancel: "Abbrechen",
            save: "Speichern",
            edit_faq: "FAQ bearbeiten",
            create_faq: "FAQ erstellen",
            question_sk: "Frage (SK)",
            answer_sk: "Antwort (SK)",
            question_en: "Frage (EN)",
            answer_en: "Antwort (EN)",
        }
    };

    const t = translations[language] || translations.en;

    const filteredFAQs = faqs?.filter(faq =>
        faq.question_sk?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.question_en?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer_sk?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer_en?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">{t.title}</h1>
                <Button onClick={() => handleEdit(null)}>
                    <Plus className="w-4 h-4 mr-2" />
                    {t.create_new}
                </Button>
            </div>

            <Input
                placeholder={t.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-md"
            />

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t.question}</TableHead>
                            <TableHead>{t.category}</TableHead>
                            <TableHead>{t.order}</TableHead>
                            <TableHead>{t.active}</TableHead>
                            <TableHead className="text-right">{t.actions}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredFAQs?.length > 0 ? (
                            filteredFAQs.map((faq) => (
                                <TableRow key={faq.id}>
                                    <TableCell className="font-medium max-w-md truncate">{faq.question_sk}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{t[faq.category] || faq.category}</Badge>
                                    </TableCell>
                                    <TableCell>{faq.order}</TableCell>
                                    <TableCell>
                                        <Badge variant={faq.is_active ? 'default' : 'secondary'}>
                                            {faq.is_active ? t.active : t.inactive}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(faq)}>
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(faq.id)}>
                                                <Trash2 className="w-4 h-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    {t.no_faqs}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Edit/Create Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingFAQ?.id ? t.edit_faq : t.create_faq}</DialogTitle>
                    </DialogHeader>
                    {editingFAQ && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>{t.question_sk}</Label>
                                    <Input
                                        value={editingFAQ.question_sk || ''}
                                        onChange={(e) => setEditingFAQ({...editingFAQ, question_sk: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>{t.question_en}</Label>
                                    <Input
                                        value={editingFAQ.question_en || ''}
                                        onChange={(e) => setEditingFAQ({...editingFAQ, question_en: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>{t.answer_sk}</Label>
                                    <Textarea
                                        value={editingFAQ.answer_sk || ''}
                                        onChange={(e) => setEditingFAQ({...editingFAQ, answer_sk: e.target.value})}
                                        rows={4}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>{t.answer_en}</Label>
                                    <Textarea
                                        value={editingFAQ.answer_en || ''}
                                        onChange={(e) => setEditingFAQ({...editingFAQ, answer_en: e.target.value})}
                                        rows={4}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>{t.category}</Label>
                                    <Select value={editingFAQ.category} onValueChange={(val) => setEditingFAQ({...editingFAQ, category: val})}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="general">{t.general}</SelectItem>
                                            <SelectItem value="billing">{t.billing}</SelectItem>
                                            <SelectItem value="technical">{t.technical}</SelectItem>
                                            <SelectItem value="legal">{t.legal}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>{t.order}</Label>
                                    <Input
                                        type="number"
                                        value={editingFAQ.order || 0}
                                        onChange={(e) => setEditingFAQ({...editingFAQ, order: parseInt(e.target.value) || 0})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>{t.active}</Label>
                                    <div className="flex items-center space-x-2 pt-2">
                                        <Switch
                                            checked={editingFAQ.is_active ?? true}
                                            onCheckedChange={(checked) => setEditingFAQ({...editingFAQ, is_active: checked})}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>{t.cancel}</Button>
                        <Button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending}>
                            {t.save}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <DeleteConfirmationDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={() => deleteMutation.mutate(deletingId)}
                title={t.delete_confirm_title}
                description={t.delete_confirm_desc}
            />
        </div>
    );
}
