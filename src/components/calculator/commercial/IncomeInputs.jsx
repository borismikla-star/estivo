import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import InfoTooltip from "../../shared/InfoTooltip";

export default function IncomeInputs({ data, onChange, language = 'en' }) {
    const [localData, setLocalData] = useState(data);

    useEffect(() => {
        setLocalData(data);
    }, [data]);

    const handleChange = (field, value) => {
        const updated = { ...localData, [field]: value };
        setLocalData(updated);
        onChange(updated);
    };

    const translations = {
        en: {
            annual_rent: "Annual Base Rent",
            annual_rent_desc: "Total annual rental income from all tenants",
            rent_escalation: "Annual Rent Escalation (%)",
            rent_escalation_desc: "Yearly rent increase percentage",
            cam_reimbursements: "CAM Reimbursements (annual)",
            cam_desc: "Common Area Maintenance costs passed to tenants",
            other_reimbursements: "Other Reimbursements (annual)",
            other_reimbursements_desc: "Utilities, insurance, or other recoverable expenses",
            other_income: "Other Income (annual)",
            other_income_desc: "Parking, signage, or other revenue",
            vacancy_rate: "Vacancy Rate (%)",
            vacancy_desc: "Expected percentage of vacant space",
        },
        sk: {
            annual_rent: "Ročné základné nájomné",
            annual_rent_desc: "Celkový ročný príjem z nájmov od všetkých nájomcov",
            rent_escalation: "Ročné zvýšenie nájmu (%)",
            rent_escalation_desc: "Percentuálne ročné zvýšenie nájmu",
            cam_reimbursements: "Náhrady za správu (ročne)",
            cam_desc: "Náklady na správu spoločných priestorov hradené nájomcami",
            other_reimbursements: "Ostatné náhrady (ročne)",
            other_reimbursements_desc: "Energie, poistenie alebo iné vymáhateľné náklady",
            other_income: "Ostatné príjmy (ročne)",
            other_income_desc: "Parkovanie, reklama alebo iné príjmy",
            vacancy_rate: "Miera neobsadenosti (%)",
            vacancy_desc: "Očakávané percento neobsadených priestorov",
        },
        pl: {
            annual_rent: "Roczny czynsz bazowy",
            annual_rent_desc: "Całkowity roczny dochód z najmu od wszystkich najemców",
            rent_escalation: "Roczny wzrost czynszu (%)",
            rent_escalation_desc: "Procentowy roczny wzrost czynszu",
            cam_reimbursements: "Zwroty kosztów zarządzania (rocznie)",
            cam_desc: "Koszty utrzymania części wspólnych pokrywane przez najemców",
            other_reimbursements: "Inne zwroty (rocznie)",
            other_reimbursements_desc: "Media, ubezpieczenie lub inne zwracane koszty",
            other_income: "Inne dochody (rocznie)",
            other_income_desc: "Parking, reklama lub inne przychody",
            vacancy_rate: "Wskaźnik pustostanów (%)",
            vacancy_desc: "Oczekiwany procent pustych powierzchni",
        },
        hu: {
            annual_rent: "Éves alap bérleti díj",
            annual_rent_desc: "Összes éves bérleti bevétel minden bérlőtől",
            rent_escalation: "Éves bérleti díj emelés (%)",
            rent_escalation_desc: "Százalékos éves bérleti díj növekedés",
            cam_reimbursements: "Közös költségek megtérítése (éves)",
            cam_desc: "Közös területek karbantartási költségei, melyeket a bérlők fizetnek",
            other_reimbursements: "Egyéb megtérítések (éves)",
            other_reimbursements_desc: "Közművek, biztosítás vagy más visszatéríthető költségek",
            other_income: "Egyéb bevétel (éves)",
            other_income_desc: "Parkolás, reklám vagy más bevétel",
            vacancy_rate: "Üresedési arány (%)",
            vacancy_desc: "Várható üres terület százaléka",
        },
        de: {
            annual_rent: "Jährliche Grundmiete",
            annual_rent_desc: "Gesamter jährlicher Mietertrag von allen Mietern",
            rent_escalation: "Jährliche Mietsteigerung (%)",
            rent_escalation_desc: "Prozentuale jährliche Mieterhöhung",
            cam_reimbursements: "Nebenkostenerstattungen (jährlich)",
            cam_desc: "Gemeinschaftskostenkosten, die auf Mieter umgelegt werden",
            other_reimbursements: "Sonstige Erstattungen (jährlich)",
            other_reimbursements_desc: "Nebenkosten, Versicherung oder andere erstattungsfähige Ausgaben",
            other_income: "Sonstige Einnahmen (jährlich)",
            other_income_desc: "Parkplatz, Werbung oder andere Einnahmen",
            vacancy_rate: "Leerstandsquote (%)",
            vacancy_desc: "Erwarteter Prozentsatz leerstehender Flächen",
        }
    };

    const t = translations[language] || translations.en;

    return (
        <div className="space-y-4">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <Label>{t.annual_rent}</Label>
                    <InfoTooltip content={t.annual_rent_desc} />
                </div>
                <Input
                    type="number"
                    value={localData.annual_rent || ''}
                    onChange={(e) => handleChange('annual_rent', parseFloat(e.target.value) || 0)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Label>{t.rent_escalation}</Label>
                        <InfoTooltip content={t.rent_escalation_desc} />
                    </div>
                    <Input
                        type="number"
                        step="0.1"
                        value={localData.rent_escalation_percent || ''}
                        onChange={(e) => handleChange('rent_escalation_percent', parseFloat(e.target.value) || 2)}
                        placeholder="2.0"
                    />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Label>{t.vacancy_rate}</Label>
                        <InfoTooltip content={t.vacancy_desc} />
                    </div>
                    <Input
                        type="number"
                        step="0.1"
                        value={localData.vacancy_rate || ''}
                        onChange={(e) => handleChange('vacancy_rate', parseFloat(e.target.value) || 5)}
                        placeholder="5"
                    />
                </div>
            </div>

            <div className="border-t pt-4">
                <h4 className="font-semibold mb-3 text-sm">Reimbursements & Other Income</h4>
                <div className="space-y-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Label>{t.cam_reimbursements}</Label>
                            <InfoTooltip content={t.cam_desc} />
                        </div>
                        <Input
                            type="number"
                            value={localData.cam_reimbursements || ''}
                            onChange={(e) => handleChange('cam_reimbursements', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                        />
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Label>{t.other_reimbursements}</Label>
                            <InfoTooltip content={t.other_reimbursements_desc} />
                        </div>
                        <Input
                            type="number"
                            value={localData.other_reimbursements || ''}
                            onChange={(e) => handleChange('other_reimbursements', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                        />
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Label>{t.other_income}</Label>
                            <InfoTooltip content={t.other_income_desc} />
                        </div>
                        <Input
                            type="number"
                            value={localData.other_income || ''}
                            onChange={(e) => handleChange('other_income', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}