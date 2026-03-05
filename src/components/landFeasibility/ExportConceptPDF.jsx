import { jsPDF } from 'jspdf';

const fmt = (n) => n == null ? '—' : Math.round(n).toLocaleString('sk-SK');

const LABELS = {
  en: {
    concept: "Land Feasibility Concept",
    generated: "Generated",
    mode_block: "Block / Mixed-use",
    mode_sub: "Subdivision",
    disclaimer: "Concept-level estimation – no architectural study",
    land_area: "Total Land Area",
    built_area: "Built-up Area (Footprint)",
    hpp_above: "GFA Above Ground",
    hpp_below: "GFA Below Ground",
    npp_above: "NFA Above Ground",
    npp_below: "NFA Below Ground",
    apartments_area: "Apartments Area",
    non_residential_area: "Non-Residential Area",
    balconies_area: "Balconies",
    parking_covered: "Covered Parking (spaces)",
    parking_outdoor: "Outdoor Parking (spaces)",
    paved_area: "Paved Areas",
    green_terrain: "Green on Ground",
    cellars_area: "Cellars",
    apartment_count: "Est. Apartment Count",
    // Subdivision
    roads_area: "Public Roads Area",
    green_area: "Green Areas",
    development_area: "Development Area",
    number_of_parcels: "Number of Parcels",
    avg_parcel_size: "Average Parcel Size",
    footprint_per_house: "Max Footprint per House",
    hpp_per_house: "HPP per House",
    total_hpp: "Total HPP (gross)",
    effective_total_hpp: "Effective HPP (after risk buffer)",
    total_built_footprint: "Total Built Footprint",
    total_paved_area: "Total Paved Area",
    total_parking: "Total Parking Spaces",
    // Land Balance
    land_balance: "Land Balance",
    lb_building_footprint: "Building Footprint",
    lb_roads: "Roads / Infrastructure",
    lb_paved: "Paved Areas",
    lb_green: "Green on Ground",
    lb_total: "Total",
    // Warnings
    warnings_title: "Validations",
    m2: "m²",
    pcs: "pcs",
  },
  sk: {
    concept: "Analýza uskutočniteľnosti – Koncept",
    generated: "Vygenerované",
    mode_block: "Block / Bytová zástavba",
    mode_sub: "Parcelácia",
    disclaimer: "Predbežný odhad – bez architektonickej štúdie",
    land_area: "Výmera pozemku",
    built_area: "Zastavaná plocha",
    hpp_above: "HPP nadzemné",
    hpp_below: "HPP podzemné",
    npp_above: "ČPP nadzemné",
    npp_below: "ČPP podzemné",
    apartments_area: "Plocha bytov",
    non_residential_area: "Nebytové priestory",
    balconies_area: "Balkóny",
    parking_covered: "Kryté parkovanie (miesta)",
    parking_outdoor: "Vonkajšie parkovanie (miesta)",
    paved_area: "Spevnené plochy",
    green_terrain: "Zeleň na teréne",
    cellars_area: "Pivnice",
    apartment_count: "Odhadovaný počet bytov",
    // Subdivision
    roads_area: "Verejné komunikácie",
    green_area: "Zelené plochy",
    development_area: "Rozvojová plocha",
    number_of_parcels: "Počet parciel",
    avg_parcel_size: "Priemerná výmera parcely",
    footprint_per_house: "Max. zastavaná plocha / dom",
    hpp_per_house: "HPP / dom",
    total_hpp: "Celkové HPP (hrubé)",
    effective_total_hpp: "Efektívne HPP (po risk bufferi)",
    total_built_footprint: "Celková zastavaná plocha",
    total_paved_area: "Spevnené plochy celkom",
    total_parking: "Celkové parkovacie miesta",
    // Land Balance
    land_balance: "Bilancia pozemku",
    lb_building_footprint: "Zastavaná plocha",
    lb_roads: "Komunikácie / infraštruktúra",
    lb_paved: "Spevnené plochy",
    lb_green: "Zeleň na teréne",
    lb_total: "Celkom",
    // Warnings
    warnings_title: "Upozornenia / Chyby",
    m2: "m²",
    pcs: "ks",
  },
};

const WARNING_TEXTS = {
  en: {
    cpp_exceeds_hpp: "NFA exceeds GFA – check KPP/floors input.",
    green_below_minimum: "Green on ground is below minimum requirement.",
    parking_insufficient: "Parking places are insufficient for apartment count.",
    roads_green_too_high: "Internal roads + public green exceed 60% of land area.",
    coverage_too_high: "Max plot coverage exceeds 50% – check local regulations.",
    parcel_too_small: "Min. parcel size is below 250 m².",
    no_parcels: "Parcel size or land area too small – no buildable parcels.",
    kpp_floors_mismatch: "KPP vs Floors mismatch >25% – check regulatory inputs.",
    apartments_area_clamped: "Apartments area became negative – clamped to 0.",
    coverage_capped_to_max: "Plot coverage was capped to 50% maximum.",
    effective_parcel_too_small: "Effective parcel size (after typology adjustment) is below 250 m².",
    land_balance_exceeded: (v) => `Land balance exceeded by ${v?.excess_m2 ?? '?'} m² (${v?.excess_pct ?? '?'}%). Reduce paved/roads or building footprint.`,
    land_unallocated: "Unallocated land area detected.",
  },
  sk: {
    cpp_exceeds_hpp: "ČPP presahuje HPP – skontrolujte KPP alebo počet podlaží.",
    green_below_minimum: "Zeleň na teréne je nižšia ako regulatívne minimum.",
    parking_insufficient: "Počet parkovacích miest je nedostatočný.",
    roads_green_too_high: "Komunikácie + zeleň presahujú 60 % plochy pozemku.",
    coverage_too_high: "Max. zastavanosť parcely presahuje 50 %.",
    parcel_too_small: "Min. výmera parcely je pod 250 m².",
    no_parcels: "Výmera parcely alebo pozemku príliš malá – žiadne stavebné parcely.",
    kpp_floors_mismatch: "Nesúlad KPP vs. podlažnosť >25 %.",
    apartments_area_clamped: "Plocha bytov vyšla záporná – zaokrúhlená na 0.",
    coverage_capped_to_max: "Zastavanosť parcely bola zastropovaná na max. 50 %.",
    effective_parcel_too_small: "Efektívna výmera parcely (po úprave typológiou) je pod 250 m².",
    land_balance_exceeded: (v) => `Bilancia pozemku je prekročená o ${v?.excess_m2 ?? '?'} m² (${v?.excess_pct ?? '?'}%). Znížte spevnené plochy / komunikácie alebo zastavanú plochu.`,
    land_unallocated: "Nealokovaná plocha – celková alokácia je menšia ako výmera pozemku.",
  },
};

export function exportConceptToPDF(conceptName, results, language = 'sk') {
  const t = LABELS[language] || LABELS.sk;
  const wt = WARNING_TEXTS[language] || WARNING_TEXTS.sk;
  const isSubdivision = results?.mode === 'subdivision';

  const doc = new jsPDF({ format: 'a4', unit: 'mm' });
  const pageW = 210;
  const marginL = 16;
  const marginR = 16;
  const contentW = pageW - marginL - marginR;

  let y = 18;

  // ── Header bar ──────────────────────────────────────────────────────────
  doc.setFillColor(0, 62, 126); // --estivo-blue
  doc.rect(0, 0, pageW, 28, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('ESTIVO', marginL, 12);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(t.concept, marginL, 20);
  doc.setFontSize(9);
  doc.text(
    `${t.generated}: ${new Date().toLocaleDateString('sk-SK')}`,
    pageW - marginR,
    20,
    { align: 'right' }
  );

  y = 36;

  // ── Concept name ────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(46, 59, 78);
  doc.text(conceptName || '—', marginL, y);
  y += 5;

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(108, 122, 137);
  doc.text(`${isSubdivision ? t.mode_sub : t.mode_block} | ${t.disclaimer}`, marginL, y);
  y += 8;

  // ── Section helper ──────────────────────────────────────────────────────
  const drawSectionHeader = (title) => {
    doc.setFillColor(0, 62, 126);
    doc.rect(marginL, y, contentW, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(title.toUpperCase(), marginL + 2, y + 4);
    y += 9;
  };

  const drawRow = (label, value, unit, highlight = false) => {
    if (y > 275) {
      doc.addPage();
      y = 16;
    }
    if (highlight) {
      doc.setFillColor(240, 245, 255);
      doc.rect(marginL, y - 3.5, contentW, 6.5, 'F');
    }
    doc.setFont('helvetica', highlight ? 'bold' : 'normal');
    doc.setFontSize(9);
    doc.setTextColor(46, 59, 78);
    doc.text(label, marginL + 2, y);
    doc.setFont('helvetica', 'bold');
    doc.text(`${value} ${unit}`, pageW - marginR - 2, y, { align: 'right' });
    doc.setDrawColor(226, 230, 234);
    doc.line(marginL, y + 1.5, pageW - marginR, y + 1.5);
    y += 7;
  };

  // ── Results ──────────────────────────────────────────────────────────────
  drawSectionHeader(isSubdivision ? t.mode_sub : t.mode_block);

  if (isSubdivision) {
    drawRow(t.land_area, fmt(results.land_area), t.m2, true);
    drawRow(t.roads_area, fmt(results.roads_area), t.m2);
    drawRow(t.green_area, fmt(results.green_area), t.m2);
    drawRow(t.development_area, fmt(results.development_area), t.m2, true);
    drawRow(t.number_of_parcels, fmt(results.number_of_parcels), t.pcs, true);
    drawRow(t.avg_parcel_size, fmt(results.avg_parcel_size), t.m2);
    drawRow(t.footprint_per_house, fmt(results.footprint_per_house), t.m2);
    drawRow(t.hpp_per_house, fmt(results.hpp_per_house), t.m2);
    drawRow(t.total_hpp, fmt(results.total_hpp), t.m2);
    drawRow(t.effective_total_hpp, fmt(results.effective_total_hpp), t.m2, true);
    drawRow(t.total_built_footprint, fmt(results.total_built_footprint), t.m2);
    drawRow(t.total_paved_area, fmt(results.total_paved_area), t.m2);
    drawRow(t.total_parking, fmt(results.total_parking), t.pcs);
  } else {
    drawRow(t.land_area, fmt(results.land_area), t.m2, true);
    drawRow(t.built_area, fmt(results.built_area), t.m2, true);
    drawRow(t.hpp_above, fmt(results.hpp_above), t.m2);
    drawRow(t.hpp_below, fmt(results.hpp_below), t.m2);
    drawRow(t.npp_above, fmt(results.npp_above), t.m2, true);
    drawRow(t.npp_below, fmt(results.npp_below), t.m2);
    drawRow(t.apartments_area, fmt(results.apartments_area), t.m2, true);
    drawRow(t.non_residential_area, fmt(results.non_residential_area), t.m2);
    drawRow(t.balconies_area, fmt(results.balconies_area), t.m2);
    drawRow(t.parking_covered, fmt(results.parking_covered), t.pcs, true);
    drawRow(t.parking_outdoor, fmt(results.parking_outdoor), t.pcs);
    drawRow(t.paved_area, fmt(results.paved_area), t.m2);
    drawRow(t.green_terrain, fmt(results.green_terrain), t.m2, true);
    drawRow(t.cellars_area, fmt(results.cellars_area), t.m2);
    drawRow(t.apartment_count, fmt(results.apartment_count), t.pcs, true);
  }

  y += 2;

  // ── Land Balance ─────────────────────────────────────────────────────────
  if (results.land_balance) {
    drawSectionHeader(t.land_balance);
    const b = results.land_balance;
    drawRow(t.land_area, fmt(b.land_area), t.m2, true);
    drawRow(t.lb_building_footprint, fmt(b.building_footprint), t.m2);
    drawRow(t.lb_roads, fmt(b.roads_area), t.m2);
    drawRow(t.lb_paved, fmt(b.paved_area), t.m2);
    drawRow(t.lb_green, fmt(b.green_area), t.m2);
    drawRow(t.lb_total, fmt(b.total), t.m2, true);
    y += 2;
  }

  // ── Validations ──────────────────────────────────────────────────────────
  if (results.validations?.length > 0) {
    drawSectionHeader(t.warnings_title);
    results.validations.forEach((v) => {
      if (y > 275) { doc.addPage(); y = 16; }
      const msg = wt[v.key];
      const text = typeof msg === 'function' ? msg(v) : (msg || v.key);
      const isError = v.type === 'error';
      doc.setFillColor(isError ? 254 : 255, isError ? 226 : 251, isError ? 226 : 235);
      doc.roundedRect(marginL, y - 3, contentW, 7, 1, 1, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(isError ? 185 : 146, isError ? 28 : 64, isError ? 28 : 14);
      doc.text(isError ? '✖' : '⚠', marginL + 2, y + 1);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(46, 59, 78);
      const lines = doc.splitTextToSize(text, contentW - 10);
      doc.text(lines, marginL + 7, y + 1);
      y += lines.length * 5 + 3;
    });
  }

  // ── Footer ───────────────────────────────────────────────────────────────
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(180, 180, 180);
    doc.text('estivo.app | Land Feasibility Concept', marginL, 291);
    doc.text(`${i} / ${pageCount}`, pageW - marginR, 291, { align: 'right' });
  }

  const safeName = (conceptName || 'concept').replace(/[^a-z0-9_\-]/gi, '_').substring(0, 40);
  doc.save(`${safeName}_feasibility.pdf`);
}