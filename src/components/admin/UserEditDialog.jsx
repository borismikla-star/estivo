import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from 'lucide-react';

const roles = ['user', 'admin'];
const plans = ['free', 'pro', 'business'];

export default function UserEditDialog({ user, open, onOpenChange, onSave, isSaving, language }) {
    const [formData, setFormData] = useState({ role: '', plan: '' });

    useEffect(() => {
        if (user) {
            setFormData({
                role: user.role || 'user',
                plan: user.plan || 'free',
            });
        }
    }, [user]);

    const handleSave = () => {
        onSave(formData);
    };

    const t_data = {
        en: {
            title: "Edit User",
            description: (email) => `Change the role and subscription plan for ${email}.`,
            role: "Role",
            plan: "Plan",
            cancel: "Cancel",
            save: "Save Changes",
            saving: "Saving...",
            admin: "Admin",
            user: "User",
            free: "Free",
            pro: "Pro",
            business: "Business"
        },
        sk: {
            title: "Upraviť používateľa",
            description: (email) => `Zmeňte rolu a plán predplatného pre ${email}.`,
            role: "Rola",
            plan: "Plán",
            cancel: "Zrušiť",
            save: "Uložiť zmeny",
            saving: "Ukladá sa...",
            admin: "Admin",
            user: "Používateľ",
            free: "Free",
            pro: "Pro",
            business: "Business"
        }
    };

    const t = t_data[language] || t_data.en;

    if (!user) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t.title}</DialogTitle>
                    <DialogDescription>{t.description(user.email)}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="role">{t.role}</Label>
                        <Select id="role" value={formData.role} onValueChange={(value) => setFormData(p => ({...p, role: value}))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map(role => (
                                    <SelectItem key={role} value={role} className="capitalize">{t[role]}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="plan">{t.plan}</Label>
                        <Select id="plan" value={formData.plan} onValueChange={(value) => setFormData(p => ({...p, plan: value}))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a plan" />
                            </SelectTrigger>
                            <SelectContent>
                                {plans.map(plan => (
                                    <SelectItem key={plan} value={plan} className="capitalize">{t[plan]}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>{t.cancel}</Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSaving ? t.saving : t.save}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}