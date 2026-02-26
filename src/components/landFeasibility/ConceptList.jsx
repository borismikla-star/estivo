import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, ArrowRight, Trash2, Check } from 'lucide-react';
import { format } from 'date-fns';

const translations = {
  en: {
    no_concepts: "No saved concepts yet.",
    transferred: "Transferred",
    draft: "Draft",
    completed: "Completed",
    open: "Open",
    delete: "Delete",
    transfer: "Transfer to Calculator",
    apts: "apts",
    npp: "NFA",
  },
  sk: {
    no_concepts: "Zatiaľ žiadne uložené koncepty.",
    transferred: "Prenesené",
    draft: "Rozpracované",
    completed: "Dokončené",
    open: "Otvoriť",
    delete: "Zmazať",
    transfer: "Preniesť do kalkulačky",
    apts: "bytov",
    npp: "ČPP",
  },
};

const statusColor = {
  draft: "bg-amber-100 text-amber-800",
  completed: "bg-blue-100 text-blue-800",
  transferred: "bg-green-100 text-green-800",
};

export default function ConceptList({ concepts, onOpen, onDelete, onTransfer, language = 'sk' }) {
  const t = translations[language] || translations.sk;

  if (!concepts || concepts.length === 0) {
    return <p className="text-sm text-muted-foreground py-4 text-center">{t.no_concepts}</p>;
  }

  return (
    <div className="space-y-3">
      {concepts.map(c => {
        const r = c.results || {};
        return (
          <Card key={c.id} className="hover:shadow-md transition-shadow">
            <CardContent className="flex items-center justify-between gap-4 py-4 flex-wrap">
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="h-5 w-5 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold truncate">{c.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.created_date ? format(new Date(c.created_date), 'dd.MM.yyyy') : '—'}
                    {r.apartment_count ? ` · ${r.apartment_count} ${t.apts}` : ''}
                    {r.npp_above ? ` · ${Math.round(r.npp_above).toLocaleString('sk-SK')} m² ${t.npp}` : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={`text-xs ${statusColor[c.status] || statusColor.draft}`}>
                  {t[c.status] || c.status}
                </Badge>
                <Button variant="outline" size="sm" onClick={() => onOpen(c)}>
                  {t.open} <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
                {c.status !== 'transferred' && (
                  <Button variant="outline" size="sm" className="text-green-700 border-green-300 hover:bg-green-50" onClick={() => onTransfer(c)}>
                    <Check className="h-3 w-3 mr-1" /> {t.transfer}
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => onDelete(c.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}