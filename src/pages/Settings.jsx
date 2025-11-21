import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, User, Building, Globe, Crown, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function SettingsPage() {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({});
    const [saveStatus, setSaveStatus] = useState('');

    const { data: user, isLoading } = useQuery({
        queryKey: ['currentUser'],
        queryFn: () => base44.auth.me(),
        retry: false,
        onSuccess: (data) => {
            setFormData(data);
        }
    });

    const updateMutation = useMutation({
        mutationFn: (data) => base44.auth.updateMe(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus(''), 3000);
        },
        onError: () => {
            setSaveStatus('error');
        }
    });

    const language = user?.preferred_language || 'en';

    const translations = {
        en: {
            title: "Settings",
            subtitle: "Manage your account preferences and defaults.",
            tab_profile: "Profile",
            tab_preferences: "Preferences",
            tab_company: "Company Info",
            profile_email: "Email",
            profile_name: "Full Name",
            profile_plan: "Current Plan",
            profile_upgrade: "Upgrade to Pro",
            pref_language: "Preferred Language",
            pref_country: "Default Country",
            pref_entity: "Entity Type",
            pref_entity_fo: "Individual (FO)",
            pref_entity_po: "Company (PO)",
            company_name: "Company Name",
            company_reg: "Registration Number",
            company_tax: "Tax ID",
            company_address: "Street Address",
            company_city: "City",
            company_postal: "Postal Code",
            company_logo: "Company Logo",
            upload_logo: "Upload Logo",
            save_changes: "Save Changes",
            saving: "Saving...",
            saved: "Saved successfully!",
            free_plan: "Free Plan",
            pro_plan: "Pro Plan",
            business_plan: "Business Plan",
            trial_status: (days) => `${days} days left in trial`,
            error: "Error saving changes",
            company_info_desc: "Fill in your company details for white-labeled reports",
            subscription: "Subscription & Billing",
        },
        sk: {
            title: "Nastavenia",
            subtitle: "Spravujte svoje predvoľby účtu a predvolené hodnoty.",
            tab_profile: "Profil",
            tab_preferences: "Predvoľby",
            tab_company: "Firemné údaje",
            profile_email: "Email",
            profile_name: "Celé meno",
            profile_plan: "Súčasný plán",
            profile_upgrade: "Prejsť na Pro",
            pref_language: "Preferovaný jazyk",
            pref_country: "Predvolená krajina",
            pref_entity: "Typ entity",
            pref_entity_fo: "Fyzická osoba (FO)",
            pref_entity_po: "Právnická osoba (PO)",
            company_name: "Názov spoločnosti",
            company_reg: "IČO",
            company_tax: "DIČ",
            company_address: "Ulica a číslo",
            company_city: "Mesto",
            company_postal: "PSČ",
            company_logo: "Logo spoločnosti",
            upload_logo: "Nahrať logo",
            save_changes: "Uložiť zmeny",
            saving: "Ukladám...",
            saved: "Úspešne uložené!",
            free_plan: "Free plán",
            pro_plan: "Pro plán",
            business_plan: "Business plán",
            trial_status: (days) => `Zostáva ${days} dní skúšobnej doby`,
            error: "Chyba pri ukladaní",
            company_info_desc: "Vyplňte firemné údaje pre white-label reporty",
            subscription: "Predplatné a fakturácia",
        },
        pl: {
            title: "Ustawienia",
            subtitle: "Zarządzaj preferencjami swojego konta i ustawieniami domyślnymi.",
            tab_profile: "Profil",
            tab_preferences: "Preferencje",
            tab_company: "Dane firmy",
            profile_email: "Email",
            profile_name: "Pełna nazwa",
            profile_plan: "Obecny plan",
            profile_upgrade: "Przejdź na Pro",
            pref_language: "Preferowany język",
            pref_country: "Domyślny kraj",
            pref_entity: "Typ podmiotu",
            pref_entity_fo: "Osoba fizyczna (FO)",
            pref_entity_po: "Firma (PO)",
            company_name: "Nazwa firmy",
            company_reg: "NIP",
            company_tax: "ID podatkowy",
            company_address: "Adres ulicy",
            company_city: "Miasto",
            company_postal: "Kod pocztowy",
            company_logo: "Logo firmy",
            upload_logo: "Prześlij logo",
            save_changes: "Zapisz zmiany",
            saving: "Zapisywanie...",
            saved: "Zapisano pomyślnie!",
            free_plan: "Darmowy plan",
            pro_plan: "Plan Pro",
            business_plan: "Plan Business",
            trial_status: (days) => `${days} dni pozostało w okresie próbnym`,
            error: "Błąd podczas zapisywania zmian",
            company_info_desc: "Wypełnij dane firmy dla raportów white-label",
            subscription: "Subskrypcja i płatności",
        },
        hu: {
            title: "Beállítások",
            subtitle: "Kezelje fiókja beállításait és alapértelmezett értékeit.",
            tab_profile: "Profil",
            tab_preferences: "Beállítások",
            tab_company: "Cég adatok",
            profile_email: "Email",
            profile_name: "Teljes név",
            profile_plan: "Jelenlegi csomag",
            profile_upgrade: "Váltás Pro-ra",
            pref_language: "Előnyben részesített nyelv",
            pref_country: "Alapértelmezett ország",
            pref_entity: "Entitás típusa",
            pref_entity_fo: "Magánszemély (FO)",
            pref_entity_po: "Cég (PO)",
            company_name: "Cégnév",
            company_reg: "Cégjegyzékszám",
            company_tax: "Adószám",
            company_address: "Utca cím",
            company_city: "Város",
            company_postal: "Irányítószám",
            company_logo: "Cég logó",
            upload_logo: "Logó feltöltése",
            save_changes: "Módosítások mentése",
            saving: "Mentés...",
            saved: "Sikeresen mentve!",
            free_plan: "Ingyenes csomag",
            pro_plan: "Pro csomag",
            business_plan: "Üzleti csomag",
            trial_status: (days) => `${days} nap van hátra a próbaidőből`,
            error: "Hiba a mentés során",
            company_info_desc: "Töltse ki cégadatait a fehér címkés jelentésekhez",
            subscription: "Előfizetés és számlázás",
        },
        de: {
            title: "Einstellungen",
            subtitle: "Verwalten Sie Ihre Kontoeinstellungen und Standardwerte.",
            tab_profile: "Profil",
            tab_preferences: "Einstellungen",
            tab_company: "Firmendaten",
            profile_email: "E-Mail",
            profile_name: "Vollständiger Name",
            profile_plan: "Aktueller Plan",
            profile_upgrade: "Auf Pro upgraden",
            pref_language: "Bevorzugte Sprache",
            pref_country: "Standardland",
            pref_entity: "Entitätstyp",
            pref_entity_fo: "Privatperson (FO)",
            pref_entity_po: "Firma (PO)",
            company_name: "Firmenname",
            company_reg: "Handelsregisternummer",
            company_tax: "Steuernummer",
            company_address: "Straße und Hausnummer",
            company_city: "Stadt",
            company_postal: "Postleitzahl",
            company_logo: "Firmenlogo",
            upload_logo: "Logo hochladen",
            save_changes: "Änderungen speichern",
            saving: "Wird gespeichert...",
            saved: "Erfolgreich gespeichert!",
            free_plan: "Kostenloser Plan",
            pro_plan: "Pro Plan",
            business_plan: "Business Plan",
            trial_status: (days) => `${days} Tage verbleiben in der Testphase`,
            error: "Fehler beim Speichern der Änderungen",
            company_info_desc: "Füllen Sie Ihre Firmendaten für White-Label-Berichte aus",
            subscription: "Abonnement & Abrechnung",
        }
    };

    const t = translations[language] || translations.en;

    React.useEffect(() => {
        if (user) {
            setFormData(user);
        }
    }, [user]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSaveStatus('saving');
        updateMutation.mutate(formData);
    };

    if (isLoading) {
        return <div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    const planLabels = {
        free: t.free_plan,
        pro: t.pro_plan,
        business: t.business_plan
    };

    const trialDaysLeft = user?.trial_end_date ? 
        Math.ceil((new Date(user.trial_end_date) - new Date()) / (1000 * 60 * 60 * 24)) : null;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-foreground">{t.title}</h1>
                <p className="text-lg text-muted-foreground">{t.subtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            {t.tab_profile}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="full_name">{t.profile_name}</Label>
                                <Input
                                    id="full_name"
                                    value={formData.full_name || ''}
                                    onChange={(e) => handleChange('full_name', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">{t.profile_email}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email || ''}
                                    disabled
                                    className="bg-muted"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="preferred_language">{t.pref_language}</Label>
                                <Select
                                    value={formData.preferred_language || 'en'}
                                    onValueChange={(value) => handleChange('preferred_language', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="en">English</SelectItem>
                                        <SelectItem value="sk">Slovenčina</SelectItem>
                                        <SelectItem value="pl">Polski</SelectItem>
                                        <SelectItem value="hu">Magyar</SelectItem>
                                        <SelectItem value="de">Deutsch</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="country_code">{t.pref_country}</Label>
                                <Select
                                    value={formData.country_code || 'SK'}
                                    onValueChange={(value) => handleChange('country_code', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="SK">Slovakia</SelectItem>
                                        <SelectItem value="CZ">Czech Republic</SelectItem>
                                        <SelectItem value="PL">Poland</SelectItem>
                                        <SelectItem value="HU">Hungary</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="entity_type">{t.pref_entity}</Label>
                                <Select
                                    value={formData.entity_type || 'FO'}
                                    onValueChange={(value) => handleChange('entity_type', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="FO">{t.pref_entity_fo}</SelectItem>
                                        <SelectItem value="PO">{t.pref_entity_po}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {formData.entity_type === 'PO' && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building className="w-5 h-5" />
                                {t.tab_company}
                            </CardTitle>
                            <CardDescription>{t.company_info_desc}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="company_name">{t.company_name}</Label>
                                <Input
                                    id="company_name"
                                    value={formData.company_name || ''}
                                    onChange={(e) => handleChange('company_name', e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="company_reg_number">{t.company_reg}</Label>
                                    <Input
                                        id="company_reg_number"
                                        value={formData.company_reg_number || ''}
                                        onChange={(e) => handleChange('company_reg_number', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="company_tax_id">{t.company_tax}</Label>
                                    <Input
                                        id="company_tax_id"
                                        value={formData.company_tax_id || ''}
                                        onChange={(e) => handleChange('company_tax_id', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="company_address">{t.company_address}</Label>
                                <Input
                                    id="company_address"
                                    value={formData.company_address || ''}
                                    onChange={(e) => handleChange('company_address', e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="company_city">{t.company_city}</Label>
                                    <Input
                                        id="company_city"
                                        value={formData.company_city || ''}
                                        onChange={(e) => handleChange('company_city', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="company_postal_code">{t.company_postal}</Label>
                                    <Input
                                        id="company_postal_code"
                                        value={formData.company_postal_code || ''}
                                        onChange={(e) => handleChange('company_postal_code', e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card className={user?.plan === 'pro' && trialDaysLeft ? 'border-amber-500/50' : ''}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Crown className="w-5 h-5" />
                            {t.subscription}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{t.profile_plan}</p>
                                <p className="text-2xl font-bold text-foreground">{planLabels[user?.plan || 'free']}</p>
                                {user?.plan === 'pro' && trialDaysLeft && trialDaysLeft > 0 && (
                                    <p className="text-sm text-amber-600 mt-1 flex items-center gap-1">
                                        <Sparkles className="w-4 h-4" />
                                        {t.trial_status(trialDaysLeft)}
                                    </p>
                                )}
                            </div>
                            {user?.plan === 'free' && (
                                <Link to={createPageUrl('Pricing')}>
                                    <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                                        <Crown className="w-4 h-4 mr-2" />
                                        {t.profile_upgrade}
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <div className="flex items-center justify-between">
                    <div>
                        {saveStatus === 'saved' && (
                            <p className="text-sm text-green-600">{t.saved}</p>
                        )}
                        {saveStatus === 'error' && (
                            <p className="text-sm text-red-600">{t.error}</p>
                        )}
                    </div>
                    <Button type="submit" disabled={saveStatus === 'saving'}>
                        {saveStatus === 'saving' ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                {t.saving}
                            </>
                        ) : (
                            t.save_changes
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}