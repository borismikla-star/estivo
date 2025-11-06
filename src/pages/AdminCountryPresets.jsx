
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import uniqBy from 'lodash/uniqBy';
import { Loader2, Edit, CheckCircle, MoreHorizontal, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import PresetEditDialog from '../components/admin/PresetEditDialog';
import DeleteConfirmationDialog from '../components/shared/DeleteConfirmationDialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';


export default function AdminCountryPresetsPage() {
    const queryClient = useQueryClient();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const { data: currentUser, isLoading: isCurrentUserLoading } = useQuery({ queryKey: ['currentUser'], queryFn: () => base44.auth.me() });
    
    const { data: presets, isLoading: arePresetsLoading } = useQuery({
        queryKey: ['countryPresets'],
        queryFn: () => base44.entities.CountryPreset.list(),
        enabled: currentUser?.role === 'admin',
    });

    const updatePresetMutation = useMutation({
        mutationFn: ({ id, data }) => base44.entities.CountryPreset.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['countryPresets'] });
            setIsEditDialogOpen(false);
            setSelectedPreset(null);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }
    });

    const deletePresetMutation = useMutation({
        mutationFn: (presetId) => base44.entities.CountryPreset.delete(presetId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['countryPresets'] });
            setIsDeleteDialogOpen(false);
            setSelectedPreset(null);
        }
    });

    const language = currentUser?.preferred_language || 'en';

    const translations = {
        en: {
            title: "Country Presets Management",
            subtitle: "Configure tax rates and financial defaults for each country",
            create_new: "Add New Country",
            search: "Search countries...",
            country: "Country",
            currency: "Currency",
            vat_rate: "VAT Rate",
            corp_tax: "Corp Tax",
            depreciation: "Depreciation", // Added back to preserve functionality
            status: "Status", // Added back to preserve functionality
            active: "Active",
            inactive: "Inactive",
            actions: "Actions",
            edit: "Edit",
            delete: "Delete",
            no_presets: "No country presets",
            no_presets_desc: "Add country configurations to get started.",
            edit_preset: "Edit Country Preset",
            delete_confirm_title: "Delete Preset?",
            delete_confirm_desc: (name) => `Are you sure you want to delete the preset for ${name}? This cannot be undone.`, // Modified to function
            cancel: "Cancel",
            success: "Preset updated successfully!" // Added back to preserve functionality
        },
        sk: {
            title: "Správa nastavení krajín",
            subtitle: "Nakonfigurujte daňové sadzby a finančné predvoľby pre každú krajinu",
            create_new: "Pridať novú krajinu",
            search: "Vyhľadať krajiny...",
            country: "Krajina",
            currency: "Mena",
            vat_rate: "Sadzba DPH",
            corp_tax: "Daň z príjmov",
            depreciation: "Odpisy", // Added back to preserve functionality
            status: "Stav", // Added back to preserve functionality
            active: "Aktívne",
            inactive: "Neaktívne",
            actions: "Akcie",
            edit: "Upraviť",
            delete: "Odstrániť",
            no_presets: "Žiadne nastavenia krajín",
            no_presets_desc: "Pridajte konfigurácie krajín a začnite.",
            edit_preset: "Upraviť nastavenie krajiny",
            delete_confirm_title: "Odstrániť nastavenie?",
            delete_confirm_desc: (name) => `Naozaj chcete odstrániť predvoľbu pre ${name}? Túto akciu nie je možné vrátiť späť.`, // Modified to function
            cancel: "Zrušiť",
            success: "Predvoľba úspešne aktualizovaná!" // Added back to preserve functionality
        },
        pl: {
            title: "Zarządzanie ustawieniami krajów",
            subtitle: "Skonfiguruj stawki podatkowe i domyślne ustawienia finansowe dla każdego kraju",
            create_new: "Dodaj nowy kraj",
            search: "Szukaj krajów...",
            country: "Kraj",
            currency: "Waluta",
            vat_rate: "Stawka VAT",
            corp_tax: "Podatek CIT",
            depreciation: "Amortyzacja", // Added
            status: "Status", // Added
            active: "Aktywny",
            inactive: "Nieaktywny",
            actions: "Akcje",
            edit: "Edytuj",
            delete: "Usuń",
            no_presets: "Brak ustawień krajów",
            no_presets_desc: "Dodaj konfiguracje krajów, aby rozpocząć.",
            edit_preset: "Edytuj ustawienia kraju",
            delete_confirm_title: "Usunąć ustawienie?",
            delete_confirm_desc: (name) => `Czy na pewno chcesz usunąć ustawienie dla ${name}? Tej operacji nie można cofnąć.`, // Modified to function
            cancel: "Anuluj",
            success: "Ustawienie zaktualizowane pomyślnie!" // Added
        },
        hu: {
            title: "Országbeállítások kezelése",
            subtitle: "Adókulcsok és pénzügyi alapértelmezések konfigurálása országonként",
            create_new: "Új ország hozzáadása",
            search: "Országok keresése...",
            country: "Ország",
            currency: "Valuta",
            vat_rate: "ÁFA kulcs",
            corp_tax: "Társasági adó",
            depreciation: "Értékcsökkenés", // Added
            status: "Státusz", // Added
            active: "Aktív",
            inactive: "Inaktív",
            actions: "Műveletek",
            edit: "Szerkesztés",
            delete: "Törlés",
            no_presets: "Nincsenek országbeállítások",
            no_presets_desc: "Adjon hozzá országkonfigurációkat a kezdéshez.",
            edit_preset: "Országbeállítás szerkesztése",
            delete_confirm_title: "Beállítás törlése?",
            delete_confirm_desc: (name) => `Biztosan törölni szeretné a(z) ${name} beállítást? Ez a művelet visszavonhatatlan.`, // Modified to function
            cancel: "Mégse",
            success: "Beállítás sikeresen frissítve!" // Added
        },
        de: {
            title: "Ländereinstellungen verwalten",
            subtitle: "Steuersätze und finanzielle Standards für jedes Land konfigurieren",
            create_new: "Neues Land hinzufügen",
            search: "Länder suchen...",
            country: "Land",
            currency: "Währung",
            vat_rate: "MwSt.-Satz",
            corp_tax: "Körperschaftsteuer",
            depreciation: "Abschreibung", // Added
            status: "Status", // Added
            active: "Aktiv",
            inactive: "Inaktiv",
            actions: "Aktionen",
            edit: "Bearbeiten",
            delete: "Löschen",
            no_presets: "Keine Ländereinstellungen",
            no_presets_desc: "Fügen Sie Länderkonfigurationen hinzu, um zu beginnen.",
            edit_preset: "Ländereinstellung bearbeiten",
            delete_confirm_title: "Einstellung löschen?",
            delete_confirm_desc: (name) => `Sind Sie sicher, dass Sie die Voreinstellung für ${name} löschen möchten? Dies kann nicht rückgängig gemacht werden.`, // Modified to function
            cancel: "Abbrechen",
            success: "Einstellung erfolgreich aktualisiert!" // Added
        }
    };

    const t = translations[language] || translations.en;
    
    const handleEdit = (preset) => {
        setSelectedPreset(preset);
        setIsEditDialogOpen(true);
    };

    const handleDelete = (preset) => {
        setSelectedPreset(preset);
        setIsDeleteDialogOpen(true);
    };
    
    const isLoading = isCurrentUserLoading || arePresetsLoading;

    const uniquePresets = uniqBy(presets, 'country_code');

    if (isLoading) {
        return <div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">{t.title}</h1>
                    <p className="text-muted-foreground">{t.subtitle}</p>
                </div>
                {showSuccess && (
                    <div className="flex items-center text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        {t.success}
                    </div>
                )}
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t.country}</TableHead>
                                <TableHead className="text-right">{t.vat_rate}</TableHead>
                                <TableHead className="text-right">{t.corp_tax}</TableHead>
                                <TableHead className="text-right">{t.depreciation}</TableHead>
                                <TableHead>{t.status}</TableHead>
                                <TableHead className="text-right">{t.actions}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {uniquePresets?.map(preset => (
                                <TableRow key={preset.id}>
                                    <TableCell className="font-medium">{preset.country_name_en} ({preset.country_code})</TableCell>
                                    <TableCell className="text-right">{preset.vat_rate}%</TableCell>
                                    <TableCell className="text-right">{preset.corporate_tax_rate}%</TableCell>
                                    <TableCell className="text-right">{preset.depreciation_rate}%</TableCell>
                                    <TableCell>
                                        <Badge variant={preset.is_active ? 'default' : 'outline'} className={preset.is_active ? 'bg-green-100 text-green-800' : ''}>
                                            {preset.is_active ? t.active : t.inactive}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEdit(preset)}>
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    {t.edit}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(preset)} className="text-destructive">
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    {t.delete}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {selectedPreset && (
                <PresetEditDialog
                    preset={selectedPreset}
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                    onSave={(data) => updatePresetMutation.mutate({ id: selectedPreset.id, data })}
                    isSaving={updatePresetMutation.isLoading}
                    language={language}
                />
            )}
            
            {selectedPreset && (
                <DeleteConfirmationDialog
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                    onConfirm={() => deletePresetMutation.mutate(selectedPreset.id)}
                    title={t.delete_confirm_title}
                    description={t.delete_confirm_desc(selectedPreset.country_name_en)}
                    confirmText={t.delete}
                    cancelText={t.cancel}
                    isDestructive
                />
            )}
        </div>
    );
}
