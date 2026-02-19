import React from 'react';
import { Info } from 'lucide-react';

const messages = {
    en: {
        no_vat: "Enter all amounts excluding VAT (net prices).",
        vat_payer: "You are a VAT payer. Enter the purchase price including VAT (gross) — the system will automatically deduct VAT. Enter all other amounts excluding VAT (net).",
        hint_price_no_vat: "Enter net amount (excl. VAT)",
        hint_price_vat: "Enter gross amount (incl. VAT) — VAT will be deducted automatically",
        hint_other: "Enter net amount (excl. VAT)",
        hint_rent: "Enter net rent (excl. VAT)",
        hint_nightly: "Enter net nightly rate (excl. VAT)",
    },
    sk: {
        no_vat: "Zadávajte všetky sumy bez DPH (čisté ceny).",
        vat_payer: "Ste platca DPH. Kúpnu cenu zadajte vrátane DPH (brutto) — systém DPH automaticky odpočíta. Ostatné sumy zadávajte bez DPH (netto).",
        hint_price_no_vat: "Zadajte sumu bez DPH (netto)",
        hint_price_vat: "Zadajte sumu s DPH (brutto) — DPH bude automaticky odpočítaná",
        hint_other: "Zadajte sumu bez DPH (netto)",
        hint_rent: "Zadajte nájom bez DPH (netto)",
        hint_nightly: "Zadajte cenu za noc bez DPH (netto)",
    },
    pl: {
        no_vat: "Wprowadź wszystkie kwoty bez VAT (ceny netto).",
        vat_payer: "Jesteś podatnikiem VAT. Cenę zakupu wprowadź z VAT (brutto) — system automatycznie odliczy VAT. Pozostałe kwoty wprowadź bez VAT (netto).",
        hint_price_no_vat: "Wprowadź kwotę netto (bez VAT)",
        hint_price_vat: "Wprowadź kwotę brutto (z VAT) — VAT zostanie automatycznie odliczony",
        hint_other: "Wprowadź kwotę netto (bez VAT)",
        hint_rent: "Wprowadź czynsz netto (bez VAT)",
        hint_nightly: "Wprowadź cenę za noc netto (bez VAT)",
    },
    hu: {
        no_vat: "Minden összeget ÁFA nélkül (nettó áron) adjon meg.",
        vat_payer: "Ön ÁFA fizető. A vételárat ÁFÁ-val (bruttó) adja meg — a rendszer automatikusan levonja az ÁFÁ-t. Az összes többi összeget ÁFA nélkül (nettó) adja meg.",
        hint_price_no_vat: "Adja meg a nettó összeget (ÁFA nélkül)",
        hint_price_vat: "Adja meg a bruttó összeget (ÁFÁ-val) — az ÁFA automatikusan levonásra kerül",
        hint_other: "Adja meg a nettó összeget (ÁFA nélkül)",
        hint_rent: "Adja meg a nettó bérleti díjat (ÁFA nélkül)",
        hint_nightly: "Adja meg az éjszakánkénti nettó árat (ÁFA nélkül)",
    },
    de: {
        no_vat: "Geben Sie alle Beträge ohne MwSt. (Nettopreise) ein.",
        vat_payer: "Sie sind umsatzsteuerpflichtig. Geben Sie den Kaufpreis inkl. MwSt. (brutto) ein — das System zieht die MwSt. automatisch ab. Alle anderen Beträge netto (ohne MwSt.) eingeben.",
        hint_price_no_vat: "Nettobetrag eingeben (ohne MwSt.)",
        hint_price_vat: "Bruttobetrag eingeben (inkl. MwSt.) — MwSt. wird automatisch abgezogen",
        hint_other: "Nettobetrag eingeben (ohne MwSt.)",
        hint_rent: "Nettomiete eingeben (ohne MwSt.)",
        hint_nightly: "Nettobetrag pro Nacht eingeben (ohne MwSt.)",
    },
};

export function useVatHints(language = 'en') {
    return messages[language] || messages.en;
}

export default function VatInputBanner({ isVatPayer = false, language = 'en' }) {
    const t = messages[language] || messages.en;
    const text = isVatPayer ? t.vat_payer : t.no_vat;
    const color = isVatPayer
        ? 'bg-amber-50 border-amber-200 text-amber-800'
        : 'bg-blue-50 border-blue-200 text-blue-800';

    return (
        <div className={`flex items-start gap-2 p-3 rounded-lg border text-sm ${color}`}>
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{text}</span>
        </div>
    );
}