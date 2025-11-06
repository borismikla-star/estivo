
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function CookieSettingsDialog({ open, onOpenChange, onSave, settings, language }) {
    const [currentSettings, setCurrentSettings] = React.useState(settings);

    React.useEffect(() => {
        setCurrentSettings(settings);
    }, [settings]);

    const handleSave = () => {
        onSave(currentSettings);
    };

    const translations = {
        en: {
            title: "Cookie Settings",
            description: "Manage your cookie preferences. You can enable or disable different types of cookies below.",
            necessary_title: "Necessary Cookies",
            necessary_desc: "These cookies are essential for the website to function properly. They cannot be disabled.",
            analytics_title: "Analytics Cookies",
            analytics_desc: "These cookies help us understand how visitors interact with our website.",
            marketing_title: "Marketing Cookies",
            marketing_desc: "These cookies are used to track visitors across websites to display relevant advertisements.",
            save: "Save Preferences",
            cancel: "Cancel",
        },
        sk: {
            title: "Nastavenia cookies",
            description: "Spravujte svoje predvoľby cookies. Nižšie môžete povoliť alebo zakázať rôzne typy cookies.",
            necessary_title: "Nevyhnutné cookies",
            necessary_desc: "Tieto cookies sú nevyhnutné pre správne fungovanie webovej stránky. Nemožno ich zakázať.",
            analytics_title: "Analytické cookies",
            analytics_desc: "Tieto cookies nám pomáhajú pochopiť, ako návštevníci interagujú s našou webovou stránkou.",
            marketing_title: "Marketingové cookies",
            marketing_desc: "Tieto cookies sa používajú na sledovanie návštevníkov naprieč webovými stránkami na zobrazenie relevantných reklám.",
            save: "Uložiť predvoľby",
            cancel: "Zrušiť",
        },
        pl: {
            title: "Ustawienia plików cookie",
            description: "Zarządzaj swoimi preferencjami dotyczącymi plików cookie. Możesz włączyć lub wyłączyć różne typy plików cookie poniżej.",
            necessary_title: "Niezbędne pliki cookie",
            necessary_desc: "Te pliki cookie są niezbędne do prawidłowego działania strony internetowej. Nie można ich wyłączyć.",
            analytics_title: "Analityczne pliki cookie",
            analytics_desc: "Te pliki cookie pomagają nam zrozumieć, jak odwiedzający korzystają z naszej strony internetowej.",
            marketing_title: "Marketingowe pliki cookie",
            marketing_desc: "Te pliki cookie są używane do śledzenia odwiedzających w witrynach w celu wyświetlania odpowiednich reklam.",
            save: "Zapisz preferencje",
            cancel: "Anuluj",
        },
        hu: {
            title: "Cookie beállítások",
            description: "Kezelje cookie preferenciáit. Az alábbiakban különböző típusú cookie-kat engedélyezhet vagy tilthat le.",
            necessary_title: "Szükséges cookie-k",
            necessary_desc: "Ezek a cookie-k elengedhetetlenek a weboldal megfelelő működéséhez. Nem lehet őket letiltani.",
            analytics_title: "Analitikai cookie-k",
            analytics_desc: "Ezek a cookie-k segítenek megérteni, hogyan lépnek kapcsolatba a látogatók a weboldalunkkal.",
            marketing_title: "Marketing cookie-k",
            marketing_desc: "Ezeket a cookie-kat a látogatók webhelyeken keresztüli nyomon követésére használják releváns hirdetések megjelenítéséhez.",
            save: "Beállítások mentése",
            cancel: "Mégse",
        },
        de: {
            title: "Cookie-Einstellungen",
            description: "Verwalten Sie Ihre Cookie-Einstellungen. Sie können unten verschiedene Cookie-Typen aktivieren oder deaktivieren.",
            necessary_title: "Notwendige Cookies",
            necessary_desc: "Diese Cookies sind für das ordnungsgemäße Funktionieren der Website unerlässlich. Sie können nicht deaktiviert werden.",
            analytics_title: "Analyse-Cookies",
            analytics_desc: "Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren.",
            marketing_title: "Marketing-Cookies",
            marketing_desc: "Diese Cookies werden verwendet, um Besucher über Websites hinweg zu verfolgen, um relevante Werbung anzuzeigen.",
            save: "Einstellungen speichern",
            cancel: "Abbrechen",
        }
    };
    const t = translations[language] || translations.en;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t.title}</DialogTitle>
                    <DialogDescription>{t.description}</DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <Label htmlFor="necessary" className="font-bold">{t.necessary_title}</Label>
                            <p className="text-sm text-muted-foreground">{t.necessary_desc}</p>
                        </div>
                        <Switch id="necessary" checked={true} disabled />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <Label htmlFor="analytics" className="font-bold">{t.analytics_title}</Label>
                            <p className="text-sm text-muted-foreground">{t.analytics_desc}</p>
                        </div>
                        <Switch
                            id="analytics"
                            checked={currentSettings.analytics}
                            onCheckedChange={(checked) => setCurrentSettings(s => ({ ...s, analytics: checked }))}
                        />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <Label htmlFor="marketing" className="font-bold">{t.marketing_title}</Label>
                            <p className="text-sm text-muted-foreground">{t.marketing_desc}</p>
                        </div>
                        <Switch
                            id="marketing"
                            checked={currentSettings.marketing}
                            onCheckedChange={(checked) => setCurrentSettings(s => ({ ...s, marketing: checked }))}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>{t.cancel}</Button>
                    <Button onClick={handleSave}>{t.save}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
