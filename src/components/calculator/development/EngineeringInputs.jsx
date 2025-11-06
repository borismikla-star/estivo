
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function EngineeringInputs({ data, language, onChange }) {
  const t = {
    sk: {
      territorial_decision: "Územné rozhodnutie (€)",
      architectural_study: "Architektonická štúdia (€)",
      project_documentation: "Projektová dokumentácia (€)",
      building_permit: "Stavebné povolenie (€)",
      engineering_networks: "Inžiniering sietí (€)",
      technical_supervision: "Stavebný dozor (€)",
      author_supervision: "Autorský dozor (€)",
      occupancy_permit: "Kolaudácia (€)",
      other_project_costs: "Ostatné náklady na projekt (€)",
    },
    en: {
      territorial_decision: "Territorial Decision (€)",
      architectural_study: "Architectural Study (€)",
      project_documentation: "Project Documentation (€)",
      building_permit: "Building Permit (€)",
      engineering_networks: "Network Engineering (€)",
      technical_supervision: "Technical Supervision (€)",
      author_supervision: "Author's Supervision (€)",
      occupancy_permit: "Occupancy Permit (€)",
      other_project_costs: "Other Project Costs (€)",
    },
    pl: {
      territorial_decision: "Decyzja o warunkach zabudowy (€)",
      architectural_study: "Studium architektoniczne (€)",
      project_documentation: "Dokumentacja projektowa (€)",
      building_permit: "Pozwolenie na budowę (€)",
      engineering_networks: "Inżynieria sieci (€)",
      technical_supervision: "Nadzór techniczny (€)",
      author_supervision: "Nadzór autorski (€)",
      occupancy_permit: "Pozwolenie na użytkowanie (€)",
      other_project_costs: "Inne koszty projektu (€)",
    },
    hu: {
      territorial_decision: "Telekalakítási engedély (€)",
      architectural_study: "Építészeti tanulmány (€)",
      project_documentation: "Tervdokumentáció (€)",
      building_permit: "Építési engedély (€)",
      engineering_networks: "Hálózattervezés (€)",
      technical_supervision: "Műszaki ellenőrzés (€)",
      author_supervision: "Tervezői művezetés (€)",
      occupancy_permit: "Használatbavételi engedély (€)",
      other_project_costs: "Egyéb projektköltségek (€)",
    },
    de: {
      territorial_decision: "Bebauungsplan (€)",
      architectural_study: "Architekturstudie (€)",
      project_documentation: "Projektunterlagen (€)",
      building_permit: "Baugenehmigung (€)",
      engineering_networks: "Netzwerkingenieurwesen (€)",
      technical_supervision: "Technische Überwachung (€)",
      author_supervision: "Autorenüberwachung (€)",
      occupancy_permit: "Nutzungsgenehmigung (€)",
      other_project_costs: "Sonstige Projektkosten (€)",
    },
    it: {
      territorial_decision: "Decisione territoriale (€)",
      architectural_study: "Studio di architettura (€)",
      project_documentation: "Documentazione di progetto (€)",
      building_permit: "Permesso di costruire (€)",
      engineering_networks: "Ingegneria delle reti (€)",
      technical_supervision: "Supervisione tecnica (€)",
      author_supervision: "Supervisione dell'autore (€)",
      occupancy_permit: "Permesso di agibilità (€)",
      other_project_costs: "Altri costi di progetto (€)",
    },
    es: {
      territorial_decision: "Decisión territorial (€)",
      architectural_study: "Estudio de arquitectura (€)",
      project_documentation: "Documentación del proyecto (€)",
      building_permit: "Permiso de construcción (€)",
      engineering_networks: "Ingeniería de redes (€)",
      technical_supervision: "Supervisión técnica (€)",
      author_supervision: "Supervisión del autor (€)",
      occupancy_permit: "Permiso de ocupación (€)",
      other_project_costs: "Otros costos del proyecto (€)",
    },
    fr: {
      engineering: "Ingénierie",
      architectural_study: "Étude architecturale",
      project_documentation: "Documentation du projet",
      building_permit: "Permis de construire",
      engineering_networks: "Réseaux d'ingénierie",
      other_costs: "Autres coûts de projet",
      territorial_decision: "Décision territoriale",
      technical_supervision: "Supervision technique",
      author_supervision: "Supervision de l'auteur",
      occupancy_permit: "Permis d'occupation"
    },
  }[language];

  // The handleChange function is kept for fields not explicitly modified by the outline
  // to use direct onChange calls, preserving its parseFloat functionality.
  const handleChange = (field, value) => {
    onChange({ [field]: parseFloat(value) || 0 });
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="space-y-2">
        <Label>{t.territorial_decision}</Label>
        {/* Changed onChange as per outline */}
        <Input type="number" value={data.territorialDecision || ""} onChange={e => onChange({ territorialDecision: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>{t.architectural_study}</Label>
        {/* Kept handleChange for this field */}
        <Input type="number" value={data.architecturalStudy || ""} onChange={(e) => handleChange('architecturalStudy', e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>{t.project_documentation}</Label>
        {/* Kept handleChange for this field */}
        <Input type="number" value={data.projectDocumentation || ""} onChange={(e) => handleChange('projectDocumentation', e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>{t.building_permit}</Label>
        {/* Kept handleChange for this field */}
        <Input type="number" value={data.buildingPermit || ""} onChange={(e) => handleChange('buildingPermit', e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>{t.engineering_networks}</Label>
        {/* Kept handleChange for this field */}
        <Input type="number" value={data.engineeringNetworks || ""} onChange={(e) => handleChange('engineeringNetworks', e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>{t.technical_supervision}</Label>
        {/* Changed onChange as per outline */}
        <Input type="number" value={data.technicalSupervision || ""} onChange={e => onChange({ technicalSupervision: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>{t.author_supervision}</Label>
        {/* Changed onChange as per outline */}
        <Input type="number" value={data.authorSupervision || ""} onChange={e => onChange({ authorSupervision: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>{t.occupancy_permit}</Label>
        {/* Changed onChange as per outline */}
        <Input type="number" value={data.occupancyPermit || ""} onChange={e => onChange({ occupancyPermit: e.target.value })} />
      </div>
      <div className="space-y-2">
        {/* Changed label key to t.other_costs and onChange as per outline */}
        <Label>{t.other_costs}</Label>
        <Input type="number" value={data.otherProjectCosts || ""} onChange={e => onChange({ otherProjectCosts: e.target.value })} />
      </div>
    </div>
  );
}
