/**
 * Land Feasibility Calculation Engine
 * Concept-level estimation – no architectural study
 * Supports: block / mixed (apartment model) + subdivision (parcel model)
 *
 * LAND BALANCE INVARIANT:
 *   land_area = building_footprint + roads_area + paved_area + green_area
 *   green_area is always RESIDUAL (never clamped)
 *   If balance is broken → validation error/warning is emitted
 */

const BALANCE_TOLERANCE = 0.01; // 1%

function checkLandBalance(land_area, building_footprint, roads_area, paved_area, green_area, validations) {
  // Primary check: green_area < 0 means footprint+roads+paved > land_area
  if (green_area < 0) {
    const excess_m2 = Math.abs(Math.round(green_area));
    const excess_pct = land_area > 0 ? Math.round((excess_m2 / land_area) * 100) : 0;
    validations.push({ type: 'error', key: 'land_balance_exceeded', excess_m2, excess_pct });
  }

  const land_used = building_footprint + roads_area + paved_area + (green_area < 0 ? 0 : green_area);
  const diff = land_used - land_area;
  const pct = land_area > 0 ? Math.abs(diff) / land_area : 0;

  // Secondary: unallocated warning (green is positive but doesn't fill land)
  if (green_area >= 0 && pct > BALANCE_TOLERANCE && diff < 0) {
    validations.push({ type: 'warning', key: 'land_unallocated', diff: Math.round(Math.abs(diff)) });
  }

  return land_used;
}

// ─────────────────────────────────────────────
// SUBDIVISION CALCULATION
// ─────────────────────────────────────────────
export function calculateSubdivision(inputs) {
  const {
    land_area = 0,
    public_roads_pct = 0.20,   // % public roads/infrastructure (0–1)
    green_pct = 0.40,          // % min GREEN from the WHOLE land (regulatory requirement, 0–1)
    paved_pct_house = 0.10,    // % paved area per parcel (0–1)
    min_parcel_size = 600,     // m²
    max_plot_coverage = 0.30,  // % (0–1)
    floors_per_house = 2,
    kpp_house = null,          // KPP per parcel – if set, overrides floors_per_house
    typology = 'detached',     // detached | semi | row
    risk_buffer_pct = 0.10,   // regulatory risk buffer (0–1)
    parking_per_house = 2,
  } = inputs;

  // Typology heuristics: adjust parcel size and coverage
  let effective_min_parcel = min_parcel_size;
  let effective_coverage = max_plot_coverage;
  if (typology === 'semi') {
    effective_min_parcel = min_parcel_size * 0.85;
    effective_coverage = Math.min(0.50, max_plot_coverage * 1.10);
  } else if (typology === 'row') {
    effective_min_parcel = min_parcel_size * 0.70;
    effective_coverage = Math.min(0.50, max_plot_coverage * 1.20);
  }

  const validations = [];

  if (max_plot_coverage > 0.50) {
    validations.push({ type: 'warning', key: 'coverage_too_high' });
  }
  if (min_parcel_size < 250) {
    validations.push({ type: 'warning', key: 'parcel_too_small' });
  }
  if (effective_min_parcel < 250) {
    validations.push({ type: 'warning', key: 'effective_parcel_too_small' });
  }
  if (typology !== 'detached' && max_plot_coverage * (typology === 'row' ? 1.20 : 1.10) > 0.50) {
    validations.push({ type: 'warning', key: 'coverage_capped_to_max' });
  }

  // ── LAND BALANCE ──────────────────────────────────────────────────────────
  // Roads are carved out first. Green requirement applies to the WHOLE land_area
  // but is satisfied by: (green on parcels) + (public green on common areas).
  // Parcels get the full remaining area after roads only — green comes from within parcels.

  const roads_area = land_area * public_roads_pct;

  // Required green (total, whole site)
  const required_green_total = land_area * green_pct;

  // 4.2 Development area = land minus roads (green is NOT carved out upfront)
  const parcels_area = land_area - roads_area;
  const number_of_parcels = Math.max(0, Math.floor(parcels_area / effective_min_parcel));

  if (number_of_parcels < 1 && land_area > 0) {
    validations.push({ type: 'warning', key: 'no_parcels' });
  }

  // 4.3 Average parcel size
  const avg_parcel_size = number_of_parcels > 0 ? parcels_area / number_of_parcels : 0;

  // 4.4 Max footprint per house
  const footprint_per_house = avg_parcel_size * effective_coverage;

  // 4.5 HPP per house
  const hpp_per_house = (kpp_house !== null && kpp_house > 0)
    ? avg_parcel_size * kpp_house
    : footprint_per_house * floors_per_house;

  // 4.6 Total HPP
  const total_hpp = hpp_per_house * number_of_parcels;
  const effective_total_hpp = total_hpp * (1 - risk_buffer_pct);

  // 4.7 Total built footprint
  const total_built_footprint = footprint_per_house * number_of_parcels;

  // 4.8 Paved area on parcels (driveways, walkways)
  const total_paved_area = avg_parcel_size * paved_pct_house * number_of_parcels;

  // Parking (informative — on-parcel, included in paved_area above)
  const total_parking = number_of_parcels * parking_per_house;

  // ── GREEN BALANCE ──────────────────────────────────────────────────────────
  // Green on parcels = avg_parcel_size - footprint - paved (residual per parcel)
  const parcel_green_area = Math.max(0, avg_parcel_size - footprint_per_house - (avg_parcel_size * paved_pct_house));
  const total_parcel_green = parcel_green_area * number_of_parcels;

  // Public green = whatever is needed on top of parcel green to meet the site-wide minimum
  const public_green_area = Math.max(0, required_green_total - total_parcel_green);

  // Total green (site-wide): parcel green + public green
  const green_area = total_parcel_green + public_green_area;

  // Validation: check if green requirement is satisfied
  const actual_green_pct = land_area > 0 ? green_area / land_area : 0;
  if (actual_green_pct < green_pct - 0.001) {
    validations.push({ type: 'warning', key: 'green_below_minimum' });
  }

  // development_area for UI display
  const development_area = parcels_area;

  // Land balance validation
  // Note: land_area = roads + parcels_area; green is WITHIN parcels_area
  // For the balance block we report: footprint + roads + paved + green = land_area
  const land_used = checkLandBalance(
    land_area,
    total_built_footprint,
    roads_area,
    total_paved_area,
    green_area,
    validations
  );

  // ── PARCEL BREAKDOWN (derived, informative) ─────────────────────────────
  const parcel_building_footprint = footprint_per_house;
  const parcel_paved = avg_parcel_size * paved_pct_house;
  const parcel_total = parcel_building_footprint + parcel_paved + parcel_green_area;

  const parcel_breakdown = {
    development_area,
    number_of_parcels,
    avg_parcel_size,
    parcel_building_footprint,
    parcel_paved_area: parcel_paved,
    parcel_green_area,
    parcel_total: avg_parcel_size,
    // Green compliance summary
    required_green_total,
    total_parcel_green,
    public_green_area,
    green_pct_achieved: actual_green_pct,
    green_pct_required: green_pct,
  };

  return {
    land_area,
    typology,
    development_area,
    roads_area,
    green_area,
    number_of_parcels,
    avg_parcel_size,
    footprint_per_house,
    hpp_per_house,
    total_hpp,
    effective_total_hpp,
    total_built_footprint,
    total_parking,
    total_paved_area,
    risk_buffer_applied: risk_buffer_pct > 0,
    risk_buffer_pct,
    parcel_breakdown,
    // Land balance
    land_balance: {
      land_area,
      building_footprint: total_built_footprint,
      roads_area,
      paved_area: total_paved_area,
      green_area,
      total: land_used,
    },
    validations,
    data_confidence: 'concept_subdivision',
    mode: 'subdivision',
  };
}

// ─────────────────────────────────────────────
// BLOCK / MIXED CALCULATION
// ─────────────────────────────────────────────
const EFFICIENCY = {
  conservative: 0.72,
  realistic: 0.75,
  efficient: 0.80,
};

// Default parking space area including manoeuvring (m²)
const PARKING_SPACE_AREA = 25;

export function calculateFeasibility(inputs) {
  if (inputs.project_type === 'subdivision') {
    return calculateSubdivision(inputs);
  }

  const {
    land_area = 0,
    iz = 0,
    kpp = null,
    floors = null,
    project_type = 'residential',
    non_residential_pct = 0,
    min_green_pct = 0.20,
    avg_apartment_size = 60,
    mode = 'realistic',
    green_on_structure = false,
    parking_ratio = 1.2,
    outdoor_ratio = 0.1,
    paved_pct = 0.15,           // % of land area for internal roads + walkways (excl. outdoor parking)
    urban_risk_buffer = 0.10,
  } = inputs;

  const validations = [];

  // 5.1 Zastavaná plocha (building footprint)
  let built_area;
  if (iz > 0) {
    built_area = land_area * iz;
  } else {
    const paved_fallback = land_area * paved_pct;
    built_area = Math.max(0, land_area * (1 - min_green_pct) - paved_fallback);
  }

  // 5.2 HPP nadzemné
  let hpp_above_raw;
  if (kpp !== null && kpp > 0) {
    hpp_above_raw = land_area * kpp;
  } else if (floors !== null && floors > 0) {
    hpp_above_raw = built_area * floors;
  } else {
    hpp_above_raw = 0;
  }

  // 5.3 HPP podzemné (underground — not in land balance)
  const hpp_below = built_area * 1.0;

  // 5.4 Urban Risk Buffer
  const risk_buffer_applied = urban_risk_buffer > 0 && hpp_above_raw > 0;
  const effective_hpp_above = hpp_above_raw * (1 - urban_risk_buffer);

  // KPP vs floors mismatch
  if (kpp > 0 && floors > 0 && built_area > 0) {
    const hpp_from_kpp = land_area * kpp;
    const hpp_from_floors = built_area * floors;
    const ratio = hpp_from_kpp > 0 ? Math.abs(hpp_from_floors - hpp_from_kpp) / hpp_from_kpp : 0;
    if (ratio > 0.25) {
      validations.push({ type: 'warning', key: 'kpp_floors_mismatch' });
    }
  }

  const hpp_above = effective_hpp_above;

  // 5.5 ČPP
  const efficiency = EFFICIENCY[mode] || EFFICIENCY.realistic;
  const npp_above = hpp_above * efficiency;
  const npp_below = hpp_below * 0.85;

  // 5.6 Byty
  const non_res = Math.min(non_residential_pct, 0.9);
  let apartments_area = npp_above * (1 - non_res - 0.10);
  if (apartments_area < 0) {
    validations.push({ type: 'warning', key: 'apartments_area_clamped' });
    apartments_area = 0;
  }

  // 5.7 Nebytové
  const non_residential_area = npp_above * non_res;

  // 5.8 Balkóny (not in land balance)
  const balconies_area = apartments_area * 0.10;

  // 5.9 Počet bytov
  const apartment_count = avg_apartment_size > 0
    ? Math.floor(apartments_area / avg_apartment_size)
    : 0;

  // 5.10 Parkovanie
  const parking_covered = Math.ceil(apartment_count * parking_ratio);   // underground → NOT in land balance
  const parking_outdoor = Math.ceil(apartment_count * outdoor_ratio);   // surface → in land balance

  // 5.11 Pivnice (not in land balance)
  const cellars_area = apartment_count * 3;

  // ── LAND BALANCE ──────────────────────────────────────────────────────────
  // BLOCK model has no dedicated "roads_area" as a separate input —
  // internal roads/walkways are part of paved_pct.
  const roads_area = 0; // no separate public road area in block model

  // Surface parking area (25 m²/space incl. manoeuvring)
  const surface_parking_area = parking_outdoor * PARKING_SPACE_AREA;

  // Total paved = base paved % + surface parking
  const base_paved_area = land_area * paved_pct;
  const paved_area = base_paved_area + surface_parking_area;

  // RESIDUAL green — never clamped, always = land_area - footprint - paved
  const green_terrain = land_area - built_area - paved_area;

  // Green on structure (not in land balance — on top of building)
  const green_on_structure_area = green_on_structure ? built_area * 0.30 : 0;

  // Predzáhradky (informative sub-item of green)
  const front_gardens_area = apartments_area * 0.05;

  // 5.14 Validations
  const green_terrain_pct = land_area > 0 ? green_terrain / land_area : 0;
  if (green_terrain_pct < min_green_pct) {
    validations.push({ type: 'warning', key: 'green_below_minimum', min_pct: min_green_pct, actual_pct: green_terrain_pct });
  }
  if (parking_covered + parking_outdoor < apartment_count) {
    validations.push({ type: 'warning', key: 'parking_insufficient' });
  }

  // Land balance check
  const land_used = checkLandBalance(
    land_area,
    built_area,      // building_footprint
    roads_area,      // 0 for block model
    paved_area,
    green_terrain,
    validations
  );

  return {
    land_area,
    built_area,
    hpp_above: hpp_above_raw,
    effective_hpp_above,
    hpp_below,
    npp_above,
    npp_below,
    apartments_area,
    non_residential_area,
    balconies_area,
    front_gardens_area,
    parking_covered,
    parking_outdoor,
    paved_area,
    green_terrain,
    green_terrain_pct,
    green_on_structure_area,
    cellars_area,
    apartment_count,
    risk_buffer_applied,
    urban_risk_buffer,
    paved_pct,
    parking_ratio,
    outdoor_ratio,
    // Land balance
    land_balance: {
      land_area,
      building_footprint: built_area,
      roads_area,
      paved_area,
      green_area: green_terrain,
      total: land_used,
    },
    validations,
    data_confidence: 'concept',
    mode,
  };
}