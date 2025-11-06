
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";

export default function LegislativeNotes({ preset, language }) {
    if (!preset) return null;

    const note = language === 'sk' ? preset.legislative_notes_sk : preset.legislative_notes_en;
    if (!note) return null;
    
    const title = language === 'sk' ? 'Legislatívna poznámka' : 'Legislative Note';

    return (
        <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
                <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-blue-800">{title}</h4>
                        <p className="text-sm text-blue-700 mt-1">{note}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
