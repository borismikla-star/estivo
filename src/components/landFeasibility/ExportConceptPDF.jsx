import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const fmt = (n) => n == null ? '—' : Math.round(n).toLocaleString('sk-SK');

// Estivo logo via hosted image URL
const LOGO_HTML = `<img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68d666dadfd2546479ace4c8/f7fb54908_logo.png" style="height:40px;display:block;" crossorigin="anonymous" />`;

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
    parking_covered: "Covered Parking",
    parking_outdoor: "Outdoor Parking",
    paved_area: "Paved Areas",
    green_terrain: "Green on Ground",
    cellars_area: "Cellars",
    apartment_count: "Est. Apartment Count",
    roads_area: "Public Roads Area",
    public_green_area: "Public / Common Green",
    green_area: "Total Green (site-wide)",
    development_area: "Development Area (parcels)",
    number_of_parcels: "Number of Parcels",
    avg_parcel_size: "Average Parcel Size",
    footprint_per_house: "Max Footprint per House",
    hpp_per_house: "HPP per House",
    total_hpp: "Total HPP (gross)",
    effective_total_hpp: "Effective HPP (after risk buffer)",
    total_built_footprint: "Total Built Footprint",
    total_paved_area: "Total Paved Area",
    total_parking: "Total Parking Spaces",
    parcel_breakdown: "Parcel Breakdown",
    pb_parcel_summary: "Parcel Summary",
    pb_typical_parcel: "Typical Parcel",
    pb_avg_parcel_size: "Average Parcel Size",
    pb_building_footprint_parcel: "Building Footprint",
    pb_paved_parcel: "Paved Area",
    pb_green_parcel: "Green Area",
    pb_parcel_total: "Total",
    pb_green_compliance: "Green Requirement Compliance",
    pb_required_green: "Required green (whole site)",
    pb_parcel_green_total: "Green on parcels",
    pb_public_green: "Public / common green",
    pb_green_total: "Total green",
    land_balance: "Land Balance",
    lb_building_footprint: "Building Footprint",
    lb_roads: "Roads / Infrastructure",
    lb_paved: "Paved Areas",
    lb_green: "Green on Ground",
    lb_total: "Total",
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
    roads_area: "Verejné komunikácie",
    public_green_area: "Verejná / spoločná zeleň",
    green_area: "Zeleň celkom (celý pozemok)",
    development_area: "Rozvojová plocha (parcely)",
    number_of_parcels: "Počet parciel",
    avg_parcel_size: "Priemerná výmera parcely",
    footprint_per_house: "Max. zastavaná plocha / dom",
    hpp_per_house: "HPP / dom",
    total_hpp: "Celkové HPP (hrubé)",
    effective_total_hpp: "Efektívne HPP (po risk bufferi)",
    total_built_footprint: "Celková zastavaná plocha",
    total_paved_area: "Spevnené plochy celkom",
    total_parking: "Celkové parkovacie miesta",
    parcel_breakdown: "Parcelový prehľad",
    pb_parcel_summary: "Súhrn parcelácie",
    pb_typical_parcel: "Typická parcela",
    pb_avg_parcel_size: "Priemerná veľkosť parcely",
    pb_building_footprint_parcel: "Zastavaná plocha domu",
    pb_paved_parcel: "Spevnené plochy",
    pb_green_parcel: "Zeleň parcely",
    pb_parcel_total: "Celkom",
    pb_green_compliance: "Plnenie požiadavky na zeleň",
    pb_required_green: "Požadovaná zeleň (celý pozemok)",
    pb_parcel_green_total: "Zeleň na parcelách",
    pb_public_green: "Verejná / spoločná zeleň",
    pb_green_total: "Zeleň celkom",
    land_balance: "Bilancia pozemku",
    lb_building_footprint: "Zastavaná plocha",
    lb_roads: "Komunikácie / infraštruktúra",
    lb_paved: "Spevnené plochy",
    lb_green: "Zeleň na teréne",
    lb_total: "Celkom",
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

function buildRows(results, t, isSubdivision) {
  if (isSubdivision) {
    return [
      { label: t.land_area, value: fmt(results.land_area), unit: t.m2, bold: true },
      { label: t.roads_area, value: fmt(results.roads_area), unit: t.m2 },
      { label: t.green_area, value: fmt(results.green_area), unit: t.m2 },
      { label: t.development_area, value: fmt(results.development_area), unit: t.m2, bold: true },
      { label: t.number_of_parcels, value: fmt(results.number_of_parcels), unit: t.pcs, bold: true },
      { label: t.avg_parcel_size, value: fmt(results.avg_parcel_size), unit: t.m2 },
      { label: t.footprint_per_house, value: fmt(results.footprint_per_house), unit: t.m2 },
      { label: t.hpp_per_house, value: fmt(results.hpp_per_house), unit: t.m2 },
      { label: t.total_hpp, value: fmt(results.total_hpp), unit: t.m2 },
      { label: t.effective_total_hpp, value: fmt(results.effective_total_hpp), unit: t.m2, bold: true },
      { label: t.total_built_footprint, value: fmt(results.total_built_footprint), unit: t.m2 },
      { label: t.total_paved_area, value: fmt(results.total_paved_area), unit: t.m2 },
      { label: t.total_parking, value: fmt(results.total_parking), unit: t.pcs },
    ];
  }
  return [
    { label: t.land_area, value: fmt(results.land_area), unit: t.m2, bold: true },
    { label: t.built_area, value: fmt(results.built_area), unit: t.m2, bold: true },
    { label: t.hpp_above, value: fmt(results.hpp_above), unit: t.m2 },
    { label: t.hpp_below, value: fmt(results.hpp_below), unit: t.m2 },
    { label: t.npp_above, value: fmt(results.npp_above), unit: t.m2, bold: true },
    { label: t.npp_below, value: fmt(results.npp_below), unit: t.m2 },
    { label: t.apartments_area, value: fmt(results.apartments_area), unit: t.m2, bold: true },
    { label: t.non_residential_area, value: fmt(results.non_residential_area), unit: t.m2 },
    { label: t.balconies_area, value: fmt(results.balconies_area), unit: t.m2 },
    { label: t.parking_covered, value: fmt(results.parking_covered), unit: t.pcs, bold: true },
    { label: t.parking_outdoor, value: fmt(results.parking_outdoor), unit: t.pcs },
    { label: t.paved_area, value: fmt(results.paved_area), unit: t.m2 },
    { label: t.green_terrain, value: fmt(results.green_terrain), unit: t.m2, bold: true },
    { label: t.cellars_area, value: fmt(results.cellars_area), unit: t.m2 },
    { label: t.apartment_count, value: fmt(results.apartment_count), unit: t.pcs, bold: true },
  ];
}

function buildBalanceRows(b, t) {
  return [
    { label: t.land_area, value: fmt(b.land_area), unit: t.m2, bold: true },
    { label: t.lb_building_footprint, value: fmt(b.building_footprint), unit: t.m2 },
    { label: t.lb_roads, value: fmt(b.roads_area), unit: t.m2 },
    { label: t.lb_paved, value: fmt(b.paved_area), unit: t.m2 },
    { label: t.lb_green, value: fmt(b.green_area), unit: t.m2 },
    { label: t.lb_total, value: fmt(b.total), unit: t.m2, bold: true },
  ];
}

const ROW_STYLE = (bold) => `
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:5px 0;
  border-bottom:1px solid #e5e7eb;
  font-weight:${bold ? '600' : '400'};
`;

function createReportHTML(conceptName, results, language, t, wt) {
  const isSubdivision = results?.mode === 'subdivision';
  const rows = buildRows(results, t, isSubdivision);
  const balanceRows = results.land_balance ? buildBalanceRows(results.land_balance, t) : [];
  const validations = results.validations || [];

  const renderRows = (arr) => arr.map(r => `
    <div style="${ROW_STYLE(r.bold)}">
      <span style="font-size:12px;color:#4b5563;">${r.label}</span>
      <span style="font-size:12px;color:#111827;font-weight:${r.bold ? '700' : '500'};">${r.value} <span style="font-size:10px;color:#9ca3af;">${r.unit}</span></span>
    </div>
  `).join('');

  const sectionTitle = (title) => `
    <h2 style="font-size:14px;font-weight:700;color:#1f2937;border-bottom:2px solid #1f2937;padding-bottom:4px;margin:0 0 10px 0;">${title}</h2>
  `;

  const validationHTML = validations.length > 0 ? `
    <div style="margin-bottom:20px;">
      ${sectionTitle(t.warnings_title)}
      ${validations.map(v => {
        const msg = wt[v.key];
        const text = typeof msg === 'function' ? msg(v) : (msg || v.key);
        const isError = v.type === 'error';
        return `<div style="padding:7px 10px;font-size:11px;background:${isError ? '#FEF2F2' : '#FFFBEB'};color:${isError ? '#B91C1C' : '#92400E'};border-left:3px solid ${isError ? '#EF4444' : '#F59E0B'};margin-bottom:5px;border-radius:2px;">${text}</div>`;
      }).join('')}
    </div>
  ` : '';

  const dateStr = new Date().toLocaleDateString('sk-SK');

  return `
    <div style="
      font-family:'Segoe UI',Arial,sans-serif;
      width:740px;
      background:#ffffff;
      padding:32px 32px 24px;
      box-sizing:border-box;
      color:#1f2937;
    ">
      <!-- Header: logo + title + date -->
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;text-align:center;">
        <div style="display:flex;flex-direction:column;align-items:flex-start;gap:10px;">
          ${LOGO_HTML}
          <div>
            <div style="font-size:18px;font-weight:700;color:#1f2937;margin-bottom:2px;">${conceptName || '—'}</div>
            <div style="font-size:11px;color:#6b7280;">${isSubdivision ? t.mode_sub : t.mode_block} &nbsp;|&nbsp; ${t.disclaimer}</div>
          </div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:11px;color:#6b7280;">${t.generated}</div>
          <div style="font-size:12px;color:#374151;font-weight:600;">${dateStr}</div>
        </div>
      </div>

      <!-- Main results section -->
      <div style="margin-bottom:24px;">
        ${sectionTitle(isSubdivision ? t.mode_sub : t.mode_block)}
        ${renderRows(rows)}
      </div>

      <!-- Land balance section -->
      ${balanceRows.length > 0 ? `
      <div style="margin-bottom:24px;">
        ${sectionTitle(t.land_balance)}
        ${renderRows(balanceRows)}
      </div>
      ` : ''}

      ${validationHTML}

      <!-- Footer -->
      <div style="margin-top:20px;padding-top:10px;border-top:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:center;">
        <div style="font-size:9px;color:#9ca3af;">Estivo.app – Smarter Property Investing.</div>
        <div style="font-size:9px;color:#9ca3af;">© ${new Date().getFullYear()} Estivo</div>
      </div>
    </div>
  `;
}

export async function exportConceptToPDF(conceptName, results, language = 'sk') {
  const t = LABELS[language] || LABELS.sk;
  const wt = WARNING_TEXTS[language] || WARNING_TEXTS.sk;

  const html = createReportHTML(conceptName, results, language, t, wt);

  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;left:-9999px;top:0;z-index:-1;';
  container.innerHTML = html;
  document.body.appendChild(container);

  await document.fonts.ready;

  const canvas = await html2canvas(container.firstElementChild, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
  });

  document.body.removeChild(container);

  const imgData = canvas.toDataURL('image/png');

  const pdfW = 210;
  const pdfH = (canvas.height / canvas.width) * pdfW;

  const doc = new jsPDF({
    format: [pdfW, pdfH],
    unit: 'mm',
    orientation: 'portrait',
  });

  doc.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH);

  const safeName = (conceptName || 'concept').replace(/[^a-z0-9_\-]/gi, '_').substring(0, 40);
  doc.save(`${safeName}_feasibility.pdf`);
}