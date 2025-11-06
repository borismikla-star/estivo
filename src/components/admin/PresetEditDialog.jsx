import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from 'lucide-react';

export default function PresetEditDialog({ preset, open, onOpenChange, onSave, isSaving, language }) {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (preset) {
            setFormData(preset);
        }
    }, [preset]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const t_data = {
        en: {
            title: (name) => `Edit Presets for ${name}`,
            description: "Changes will affect all new calculations for this country.",
            tabs_general: "General",
            tabs_taxes: "Taxes & Contributions",
            tabs_notes: "Legislative Notes",
            country_code: "Country Code",
            country_name_en: "Country Name (EN)",
            country_name_sk: "Country Name (SK)",
            currency_code: "Currency Code",
            currency_symbol: "Currency Symbol",
            npv_discount_rate: "NPV Discount Rate (%)",
            depreciation_rate: "Depreciation Rate (%)",
            vat_rate: "VAT Rate (%)",
            property_tax_rate: "Property Tax Rate (%)",
            income_tax_fo: "Income Tax Rate (Individual)",
            corp_tax: "Corporate Tax Rate (%)",
            social_contributions: "Social Contributions (%)",
            notes_en: "Notes (English)",
            notes_sk: "Notes (Slovak)",
            is_active: "Preset Active",
            cancel: "Cancel",
            save: "Save Changes",
            saving: "Saving...",
        },
        sk: {
            title: (name) => `Upraviť predvoľby pre ${name}`,
            description: "Zmeny ovplyvnia všetky nové výpočty pre túto krajinu.",
            tabs_general: "Všeobecné",
            tabs_taxes: "Dane a odvody",
            tabs_notes: "Legislatívne poznámky",
            country_code: "Kód krajiny",
            country_name_en: "Názov krajiny (EN)",
            country_name_sk: "Názov krajiny (SK)",
            currency_code: "Kód meny",
            currency_symbol: "Symbol meny",
            npv_discount_rate: "Diskontná sadzba NPV (%)",
            depreciation_rate: "Sadzba odpisov (%)",
            vat_rate: "Sadzba DPH (%)",
            property_tax_rate: "Sadzba dane z nehnuteľnosti (%)",
            income_tax_fo: "Sadzba dane z príjmu (FO)",
            corp_tax: "Daň z príjmu PO (%)",
            social_contributions: "Sociálne odvody (%)",
            notes_en: "Poznámky (Anglicky)",
            notes_sk: "Poznámky (Slovensky)",
            is_active: "Predvoľba aktívna",
            cancel: "Zrušiť",
            save: "Uložiť zmeny",
            saving: "Ukladám...",
        }
    };
    const t = t_data[language] || t_data.en;

    const InputField = ({ id, label, value, ...props }) => (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <Input id={id} value={value || ''} onChange={(e) => handleInputChange(id, e.target.value)} {...props} />
        </div>
    );
    
    if (!preset) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{t.title(preset.country_name_en)}</DialogTitle>
                    <DialogDescription>{t.description}</DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="general">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="general">{t.tabs_general}</TabsTrigger>
                        <TabsTrigger value="taxes">{t.tabs_taxes}</TabsTrigger>
                        <TabsTrigger value="notes">{t.tabs_notes}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="general" className="grid grid-cols-2 gap-4 py-4">
                        <InputField id="country_code" label={t.country_code} value={formData.country_code} disabled />
                        <InputField id="country_name_en" label={t.country_name_en} value={formData.country_name_en} />
                        <InputField id="country_name_sk" label={t.country_name_sk} value={formData.country_name_sk} />
                        <InputField id="currency_code" label={t.currency_code} value={formData.currency_code} />
                        <InputField id="currency_symbol" label={t.currency_symbol} value={formData.currency_symbol} />
                        <InputField id="npv_discount_rate" label={t.npv_discount_rate} type="number" value={formData.npv_discount_rate} />
                    </TabsContent>
                    <TabsContent value="taxes" className="grid grid-cols-2 gap-4 py-4">
                        <InputField id="vat_rate" label={t.vat_rate} type="number" value={formData.vat_rate} />
                        <InputField id="property_tax_rate" label={t.property_tax_rate} type="number" value={formData.property_tax_rate} />
                        <InputField id="income_tax_rate_fo" label={t.income_tax_fo} type="number" value={formData.income_tax_rate_fo} />
                        <InputField id="corporate_tax_rate" label={t.corp_tax} type="number" value={formData.corporate_tax_rate} />
                        <InputField id="depreciation_rate" label={t.depreciation_rate} type="number" value={formData.depreciation_rate} />
                        <InputField id="social_contributions" label={t.social_contributions} type="number" value={formData.social_contributions} />
                    </TabsContent>
                    <TabsContent value="notes" className="space-y-4 py-4">
                        <div className="space-y-2">
                             <Label htmlFor="legislative_notes_en">{t.notes_en}</Label>
                             <Textarea id="legislative_notes_en" value={formData.legislative_notes_en || ''} onChange={e => handleInputChange('legislative_notes_en', e.target.value)} rows={5}/>
                        </div>
                         <div className="space-y-2">
                             <Label htmlFor="legislative_notes_sk">{t.notes_sk}</Label>
                             <Textarea id="legislative_notes_sk" value={formData.legislative_notes_sk || ''} onChange={e => handleInputChange('legislative_notes_sk', e.target.value)} rows={5}/>
                        </div>
                    </TabsContent>
                </Tabs>
                <div className="flex items-center space-x-2 pt-4 border-t">
                    <Switch id="is_active" checked={formData.is_active} onCheckedChange={(c) => handleInputChange('is_active', c)} />
                    <Label htmlFor="is_active">{t.is_active}</Label>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>{t.cancel}</Button>
                    <Button onClick={() => onSave(formData)} disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSaving ? t.saving : t.save}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}