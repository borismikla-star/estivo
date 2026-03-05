import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const fmt = (n) => n == null ? '—' : Math.round(n).toLocaleString('sk-SK');

// Estivo SVG logo as inline HTML (blue version, scaled down)
const ESTIVO_LOGO_SVG = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1760 520" style="height:32px;display:block;">
  <path d="M0 0 C25.45940744 22.51864959 41.82342781 54.07725622 44.58203125 88.1171875 C45.24177033 104.55568623 45.3262925 121.02586835 41.58203125 137.1171875 C35.73660683 162.20659318 23.79881304 182.17773273 7.58203125 199.1171875 C-21.90678735 230.38818531 -63.34065625 243.07906069 -102.31640625 244.3359375 C-146.95786952 245.26013341 -189.56997762 233.0667826 -222.51074219 202.00073242 C-247.12692125 178.16906332 -261.77884869 145.46496013 -262.62109375 111.1328125 C-263.07923532 71.65093078 -253.21911056 37.15723937 -225.41796875 8.1171875 C-167.82152558 -52.89010097 -59.44702745 -51.00333202 0 0 Z M-142.41796875 50.1171875 C-156.49999278 60.94740608 -163.01717498 76.35276334 -165.02734375 91.125 C-167.21323752 111.07369871 -164.23729286 132.03476271 -151.41796875 148.1171875 C-142.03825628 158.93993266 -130.60286608 166.00032456 -116.11132812 167.32861328 C-99.67610948 168.25086308 -84.69566754 165.25906571 -71.66796875 154.4921875 C-58.39595922 141.79722186 -52.61861383 124.35121632 -52.13476562 106.33886719 C-51.89797046 86.36124834 -56.77957501 68.85979317 -70.4765625 53.86328125 C-81.89264078 42.82424776 -96.09716588 39.700744 -111.40551758 39.75146484 C-123.17208651 39.97562914 -132.81898082 43.31514605 -142.41796875 50.1171875 Z" fill="#0066FF" transform="translate(1554.41796875,171.8828125)"/>
  <path d="M0 0 C26.08851613 22.55109021 40.09329892 55.25393966 43.17773438 89.12670898 C43.50539071 94.31318865 43.49088407 99.49647778 43.47265625 104.69140625 C43.484375 108.0078125 43.484375 108.0078125 43.48046875 111.30859375 C43.28939146 119.43308915 42.78035604 124.62400879 42.34765625 129.81640625 C-22.66234375 129.81640625 -87.67234375 129.81640625 -154.65234375 129.81640625 C-144.26768969 150.58571438 -135.18542311 161.2968645 -113.6875 168.859375 C-89.89176036 175.25091667 -63.66587421 171.39546388 -42.46484375 159.44140625 C-27.65234375 148.81640625 -27.65234375 148.81640625 -4.90234375 170.56640625 C23.34765625 199.81640625 23.34765625 199.81640625 23.11376953 201.89135742 C-18.65234375 232.81640625 -65.48867799 251.70541002 -121.71646578 250.99827 C-168.36621094 231.80517578 -185.66017601 224.32540661 -200.13940321 213.8141907 C-213.65234375 200.81640625 -214.69261719 199.88828125 -215.75390625 198.94140625 C-238.4777763 177.9942997 -250.1766687 144.99021385 -251.82080078 114.71435547 C-253.20825039 76.12700165 -243.44748882 40.31702006 -217.08984375 11.37890625 C-160.91766735 -47.35747792 -62.36781879 -51.34552386 0 0 Z M-142.21484375 48.81640625 C-150.41457979 57.47486878 -153.78470967 67.34586993 -156.65234375 78.81640625 C-120.35234375 78.81640625 -84.05234375 78.81640625 -46.65234375 78.81640625 C-50.66657943 62.75946354 -57.46073243 48.98697763 -72.05078125 40.09375 C-95.61297357 28.52492585 -122.4279286 31.07948682 -142.21484375 48.81640625 Z" fill="#0066FF" transform="translate(264.65234375,170.18359375)"/>
  <path d="M0 0 C25.89516481 3.82876115 48.0224418 9.4111897 69 20 C53.41383333 58.2450838 50.01019985 66.08597568 46.625 73.9375 C41 87 41 87 39.40209961 86.25317383 C15.10500797 74.9549603 -8.52125766 67.83463755 -35.50634766 67.75976562 C-54.68280394 67.5855611 -67.60806498 68.50506516 -77.64453125 77.46875 C-80.64341927 80.85654281 -80.2214603 84.71843417 -80 89 C-76.35839842 94.72620002 -74.68690943 95.38635613 -73 96 C-58.1786644 102.11258552 -44.07610387 103.40587459 -30.6015625 105.41015625 C42.52864856 116.29953932 42.52864856 116.29953932 65.875 144.4375 C78.47746245 161.74283258 80.96378686 183.29424122 77.84765625 204.0546875 C73.80421621 224.57348436 60.90271996 242.44172889 43.8828125 254.34326172 C-1.30640549 284.16093455 -62.55510824 283.69228708 -113.75 273.8125 C-135.74788177 269.2670013 -157.60069109 262.51043517 -177 251 C-152.13850824 193.47721318 -150.15885358 189.20993487 -148 185 C-105.74574862 205.35062629 -62.64200228 216.25089822 -25.8046875 206.9765625 C-13 198.0625 -13 198.0625 -13.1875 185.9375 C-20.63727141 176.02177638 -40.71661767 175.57857436 -52.12062073 173.9500885 C-137.16292412 162.09936846 -137.16292412 162.09936846 -158.9921875 133.37890625 C-170.92418376 115.73696329 -173.64398514 94.00501439 -170.34765625 73.22265625 C-152 37 -152 37 -149.796875 34.515625 C-130.39161108 13.82524426 -102.286568 4.49826066 -75 0 C-49.37965534 -4.04260995 -23.44325867 -3.38983072 0 0 Z" fill="#0066FF" transform="translate(506,137)"/>
  <path d="M0 0 C32.67 0 65.34 0 99 0 C113.81048173 38.25118624 120.09009705 54.3637416 126.45571899 70.44384766 C144.55053711 116.515625 144.55053711 116.515625 162 164 C162.66 164 163.32 164 164 164 C166.62711978 154.35573578 169.91440321 146.79577472 190.5625 97.375 C210.07802949 50.03356476 213.77600476 41.13186057 231 0 C261.03 0 291.06 0 322 0 C253.11376953 170.39601135 253.11376953 170.39601135 211 272 C178 272 145 272 111 272 C92.78989242 228.75099451 92.78989242 228.75099451 80.08984375 197.4765625 C65.25 161.375 65.25 161.375 48 119.5 C35.64252927 89.44448819 35.64252927 89.44448819 0 0 Z" fill="#0066FF" transform="translate(970,139)"/>
  <path d="M0 0 C31.68 0 63.36 0 96 0 C96 19.8 96 39.6 96 60 C116.46 60 136.92 60 158 60 C158 83.76 158 107.52 158 132 C137.54 132 117.08 132 96 132 C96.09089757 168.78710938 96.09089757 168.78710938 96.5632782 228.96794128 C96.68997215 238.04808156 98.22366776 247.09247175 104.125 254.27734375 C124.12890625 262.01953125 124.12890625 262.01953125 149.71484375 255.3671875 C154 254 154 254 177 322 C144.19850767 340.29922482 101.80493271 341.52134233 66.05224609 331.61376953 C24.24475846 311.96355949 12.86962891 291.64135742 -0.11352539 231.56176758 C-0.11327746 221.1884172 -0.09765625 217.64453125 -0.09765625 217.64453125 C0 132 0 132 0 132 C-12.87 132 -25.74 132 -39 132 C-39 108.24 -39 84.48 -39 60 C-26.13 60 -13.26 60 0 60 C0 40.2 0 20.4 0 0 Z" fill="#0066FF" transform="translate(636,79)"/>
  <path d="M0 0 C31.68 0 63.36 0 96 0 C96 89.76 96 179.52 96 272 C64.32 272 32.64 272 0 272 C0 182.24 0 92.48 0 0 Z" fill="#0066FF" transform="translate(849,139)"/>
</svg>`;

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
        <div style="display:flex;flex-direction:column;align-items:flex-start;gap:8px;">
          ${ESTIVO_LOGO_SVG}
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