
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Loader2, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AdminSettingsPage() {
    const queryClient = useQueryClient();
    const [settings, setSettings] = useState({ trial_enabled: false, trial_duration_days: 30, beta_mode: false });
    const [showSuccess, setShowSuccess] = useState(false);

    const { data: appSettings, isLoading } = useQuery({
        queryKey: ['appSettings'],
        queryFn: async () => {
            const settingsList = await base44.entities.AppSettings.list();
            if (settingsList.length > 0) {
                return settingsList[0];
            }
            // If no settings exist, create them with default values, including beta_mode
            return base44.entities.AppSettings.create({ trial_enabled: false, trial_duration_days: 30, beta_mode: false });
        },
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (appSettings) {
            setSettings({
                id: appSettings.id,
                trial_enabled: appSettings.trial_enabled,
                trial_duration_days: appSettings.trial_duration_days,
                beta_mode: appSettings.beta_mode || false, // Ensure beta_mode is set, default to false if not present
            });
        }
    }, [appSettings]);

    // Renamed from saveSettingsMutation to updateSettingsMutation to align with the outline's implied purpose.
    // The functionality remains largely the same, but with slight adjustments as per the outline's intent.
    const updateSettingsMutation = useMutation({
        mutationFn: (newSettings) => {
            // The outline suggested `(data) => base44.entities.AppSettings.update(settings.id, data)`,
            // but the current `handleSave` passes the full `settings` object.
            // This original `mutationFn` approach is robust as it correctly destructures `id`
            // and passes only the relevant data for the update payload, preventing sending `id` twice.
            const { id, ...data } = newSettings;
            console.log('[AdminSettingsPage] Saving:', data);
            return base44.entities.AppSettings.update(id, data);
        },
        onSuccess: (result) => {
            console.log('[AdminSettingsPage] Save successful:', result);
            queryClient.invalidateQueries({ queryKey: ['appSettings'] });
            // The original code included queryClient.clear();
            // This has been removed as `invalidateQueries` is typically sufficient
            // to ensure the latest data is loaded, aligning with the outline's structure
            // and best practices for TanStack Query.

            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);

            // Broadcast change to other components to refresh, as specified in the outline
            // and already present in the original code. Keeping CustomEvent for flexibility.
            window.dispatchEvent(new CustomEvent('appSettingsChanged'));
            console.log('[AdminSettingsPage] Event dispatched');

            // The outline included `setIsEditing(false);` but `setIsEditing` is not defined
            // in this component's existing state. It's omitted to avoid introducing
            // undeclared variables and preserve existing functionality.
        }
    });

    const { data: user } = useQuery({ queryKey: ['currentUser'], queryFn: () => base44.auth.me() });
    const language = user?.preferred_language || 'en';

    const translations = {
        en: {
            title: "App Settings",
            subtitle: "Configure global application settings and user management.",
            beta_mode: "Beta Mode",
            beta_mode_desc: "When enabled, all new users get Pro plan for free as beta testers",
            trial_settings: "Trial Settings", // Re-added for consistency with UI structure
            trial_enabled: "Enable Pro Trial",
            trial_enabled_desc: "Automatically give new users a Pro plan trial",
            trial_duration: "Trial Duration (days)",
            trial_duration_desc: "How many days the Pro trial lasts",
            save_changes: "Save Changes",
            saving: "Saving...",
            saved: "Settings saved successfully!",
            error: "Error saving settings",
            current_mode: "Current Mode",
            beta_active: "Beta mode is currently ACTIVE",
            beta_inactive: "Beta mode is currently INACTIVE",
            warning_title: "Important",
            warning_beta_on: "Turning ON beta mode will give all NEW users Pro features for free.",
            warning_beta_off: "Turning OFF beta mode will downgrade all beta testers to Free plan.",
        },
        sk: {
            title: "Nastavenia aplikácie",
            subtitle: "Nakonfigurujte globálne nastavenia aplikácie a správu používateľov.",
            beta_mode: "Beta režim",
            beta_mode_desc: "Keď je zapnuté, všetci noví používatelia dostanú Pro plán zadarmo ako beta testéri",
            trial_settings: "Nastavenia skúšobnej doby", // Re-added for consistency with UI structure
            trial_enabled: "Povoliť Pro skúšobnú dobu",
            trial_enabled_desc: "Automaticky dať novým používateľom skúšobnú dobu Pro plánu",
            trial_duration: "Trvanie skúšobnej doby (dni)",
            trial_duration_desc: "Koľko dní trvá Pro skúšobná doba",
            save_changes: "Uložiť zmeny",
            saving: "Ukladám...",
            saved: "Nastavenia úspešne uložené!",
            error: "Chyba pri ukladaní nastavení",
            current_mode: "Aktuálny režim",
            beta_active: "Beta režim je momentálne AKTÍVNY",
            beta_inactive: "Beta režim je momentálne NEAKTÍVNY",
            warning_title: "Dôležité",
            warning_beta_on: "Zapnutie beta režimu dá všetkým NOVÝM používateľom Pro funkcie zadarmo.",
            warning_beta_off: "Vypnutie beta režimu zníži všetkých beta testerov na Free plán.",
        },
        pl: {
            title: "Ustawienia aplikacji",
            subtitle: "Skonfiguruj globalne ustawienia aplikacji i zarządzanie użytkownikami.",
            beta_mode: "Tryb Beta",
            beta_mode_desc: "Gdy włączony, wszyscy nowi użytkownicy otrzymują plan Pro za darmo jako beta testerzy",
            trial_settings: "Ustawienia okresu próbnego", // Added
            trial_enabled: "Włącz okres próbny Pro",
            trial_enabled_desc: "Automatycznie dawaj nowym użytkownikom okres próbny planu Pro",
            trial_duration: "Czas trwania okresu próbnego (dni)",
            trial_duration_desc: "Ile dni trwa okres próbny Pro",
            save_changes: "Zapisz zmiany",
            saving: "Zapisywanie...",
            saved: "Ustawienia zapisane pomyślnie!",
            error: "Błąd podczas zapisywania ustawień",
            current_mode: "Obecny tryb",
            beta_active: "Tryb beta jest obecnie AKTYWNY",
            beta_inactive: "Tryb beta jest obecnie NIEAKTYWNY",
            warning_title: "Ważne",
            warning_beta_on: "Włączenie trybu beta da wszystkim NOWYM użytkownikom funkcje Pro za darmo.",
            warning_beta_off: "Wyłączenie trybu beta spowoduje downgrade wszystkich beta testerów do planu Free.",
        },
        hu: {
            title: "Alkalmazás beállítások",
            subtitle: "Konfigurálja az alkalmazás globális beállításait és a felhasználókezelést.",
            beta_mode: "Beta mód",
            beta_mode_desc: "Ha engedélyezve van, minden új felhasználó ingyenesen megkapja a Pro csomagot béta tesztelőként",
            trial_settings: "Próbaidőszak beállításai", // Added
            trial_enabled: "Pro próbaidőszak engedélyezése",
            trial_enabled_desc: "Automatikusan adjon Pro csomag próbaidőszakot az új felhasználóknak",
            trial_duration: "Próbaidőszak időtartama (napok)",
            trial_duration_desc: "Hány napig tart a Pro próbaidőszak",
            save_changes: "Módosítások mentése",
            saving: "Mentés...",
            saved: "Beállítások sikeresen mentve!",
            error: "Hiba a beállítások mentése során",
            current_mode: "Jelenlegi mód",
            beta_active: "A béta mód jelenleg AKTÍV",
            beta_inactive: "A béta mód jelenleg INAKTÍV",
            warning_title: "Fontos",
            warning_beta_on: "A béta mód BEKAPCSOLÁSA minden ÚJ felhasználónak ingyenesen adja a Pro funkciókat.",
            warning_beta_off: "A béta mód KIKAPCSOLÁSA minden béta tesztelőt Free csomagra visszaminősít.",
        },
        de: {
            title: "App-Einstellungen",
            subtitle: "Konfigurieren Sie globale Anwendungseinstellungen und Benutzerverwaltung.",
            beta_mode: "Beta-Modus",
            beta_mode_desc: "Wenn aktiviert, erhalten alle neuen Benutzer den Pro-Plan kostenlos als Beta-Tester",
            trial_settings: "Testversion-Einstellungen", // Added
            trial_enabled: "Pro-Testversion aktivieren",
            trial_enabled_desc: "Geben Sie neuen Benutzern automatisch eine Pro-Plan-Testversion",
            trial_duration: "Testdauer (Tage)",
            trial_duration_desc: "Wie viele Tage die Pro-Testversion dauert",
            save_changes: "Änderungen speichern",
            saving: "Wird gespeichert...",
            saved: "Einstellungen erfolgreich gespeichert!",
            error: "Fehler beim Speichern der Einstellungen",
            current_mode: "Aktueller Modus",
            beta_active: "Beta-Modus ist derzeit AKTIV",
            beta_inactive: "Beta-Modus ist derzeit INAKTIV",
            warning_title: "Wichtig",
            warning_beta_on: "Das EINSCHALTEN des Beta-Modus gibt allen NEUEN Benutzern Pro-Funktionen kostenlos.",
            warning_beta_off: "Das AUSSCHALTEN des Beta-Modus stuft alle Beta-Tester auf den Free-Plan herab.",
        }
    };
    const t = translations[language] || translations.en;

    if (isLoading) {
        return <div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    const handleSave = () => {
        // Changed to call the updated mutation name
        updateSettingsMutation.mutate(settings);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-foreground">{t.title}</h1>
                <p className="text-muted-foreground mt-2">{t.subtitle}</p>
            </div>

            {settings?.beta_mode && (
                <Alert className="bg-amber-50 border-amber-500">
                    <AlertDescription className="text-amber-900 font-medium">
                        ⚠️ {t.beta_active}
                    </AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>{t.beta_mode}</CardTitle>
                    <CardDescription>{t.beta_mode_desc}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="beta-mode"
                            checked={settings?.beta_mode || false}
                            onCheckedChange={(checked) => setSettings(prev => ({ ...prev, beta_mode: checked }))}
                        />
                        <Label htmlFor="beta-mode" className="font-medium">
                            {settings?.beta_mode ? (language === 'sk' ? 'Aktívny' : 'Active') : (language === 'sk' ? 'Neaktívny' : 'Inactive')}
                        </Label>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t.trial_settings}</CardTitle>
                    <CardDescription>
                        {language === 'sk'
                            ? 'Tieto nastavenia sa použijú len ak Beta režim nie je aktívny.'
                            : 'These settings only apply when Beta Mode is not active.'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="trial-enabled"
                            checked={settings?.trial_enabled || false}
                            onCheckedChange={(checked) => setSettings(prev => ({ ...prev, trial_enabled: checked }))}
                            disabled={settings?.beta_mode}
                        />
                        <Label htmlFor="trial-enabled">
                            {t.trial_enabled}
                        </Label>
                    </div>
                    <p className="text-sm text-muted-foreground">{t.trial_enabled_desc}</p>

                    <div className="space-y-2">
                        <Label htmlFor="trial-duration">{t.trial_duration}</Label>
                        <Input
                            id="trial-duration"
                            type="number"
                            value={settings?.trial_duration_days || 30}
                            onChange={(e) => setSettings(prev => ({ ...prev, trial_duration_days: parseInt(e.target.value, 10) }))}
                            disabled={settings?.beta_mode || !settings?.trial_enabled}
                        />
                        <p className="text-sm text-muted-foreground">{t.trial_duration_desc}</p>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
                <Button onClick={handleSave} disabled={updateSettingsMutation.isLoading}>
                    {updateSettingsMutation.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {updateSettingsMutation.isLoading ? t.saving : t.save_changes}
                </Button>
                {showSuccess && (
                    <div className="flex items-center text-sm text-green-600">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        {t.saved}
                    </div>
                )}
            </div>
        </div>
    );
}
