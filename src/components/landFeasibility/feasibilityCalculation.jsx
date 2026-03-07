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
  // Global invariant: land_area = roads_area + total_built_footprint + total_paved_area + green_area
  // Public green is carved out of land alongside roads.
  // development_area = land_area - roads_area - public_green_area
  // Parcel values are strictly derived from global totals divided by number_of_parcels.

  const roads_area = land_area * public_roads_pct;

  // Required green (total, whole site)
  const required_green_total = land_area * green_pct;

  // Public green (non-parcel, common areas) = site-wide requirement minus what parcels provide
  // We first estimate parcels area without public green to derive parcel green, then reconcile.
  // Step 1: estimate raw parcels area (without public green carved out yet)
  const parcels_area_raw = land_area - roads_area;

  // Step 2: estimate number of parcels from raw area
  const number_of_parcels_est = Math.max(0, Math.floor(parcels_area_raw / effective_min_parcel));

  // Step 3: estimate parcel green per parcel (residual within raw avg parcel)
  const avg_parcel_size_raw = number_of_parcels_est > 0 ? parcels_area_raw / number_of_parcels_est : 0;
  const footprint_est = avg_parcel_size_raw * effective_coverage;
  const paved_est = avg_parcel_size_raw * paved_pct_house;
  const parcel_green_est = Math.max(0, avg_parcel_size_raw - footprint_est - paved_est);
  const total_parcel_green_est = parcel_green_est * number_of_parcels_est;

  // Step 4: public green = site-wide required minus parcel green
  const public_green_area = Math.max(0, required_green_total - total_parcel_green_est);

  // Step 5: development_area = land - roads - public_green  (spec §3)
  const development_area = land_area - roads_area - public_green_area;
  const number_of_parcels = Math.max(0, Math.floor(development_area / effective_min_parcel));

  if (number_of_parcels < 1 && land_area > 0) {
    validations.push({ type: 'warning', key: 'no_parcels' });
  }

  // Step 6: final average parcel size (spec §4)
  const avg_parcel_size = number_of_parcels > 0 ? development_area / number_of_parcels : 0;

  // Step 7: parcel-level components derived from global totals (spec §6)
  const footprint_per_house = avg_parcel_size * effective_coverage;
  const total_built_footprint = footprint_per_house * number_of_parcels;

  const parcel_paved = avg_parcel_size * paved_pct_house;
  const total_paved_area = parcel_paved * number_of_parcels;

  // Parcel green = residual (spec §6c): parcel_area - footprint - paved
  const parcel_green_area = Math.max(0, avg_parcel_size - footprint_per_house - parcel_paved);
  const total_parcel_green = parcel_green_area * number_of_parcels;

  // Total green = public green + parcel green
  const green_area = public_green_area + total_parcel_green;

  // HPP
  const hpp_per_house = (kpp_house !== null && kpp_house > 0)
    ? avg_parcel_size * kpp_house
    : footprint_per_house * floors_per_house;
  const total_hpp = hpp_per_house * number_of_parcels;
  const effective_total_hpp = total_hpp * (1 - risk_buffer_pct);

  // Parking
  const total_parking = number_of_parcels * parking_per_house;

  // Validation: green requirement
  const actual_green_pct = land_area > 0 ? green_area / land_area : 0;
  if (actual_green_pct < green_pct - 0.001) {
    validations.push({ type: 'warning', key: 'green_below_minimum' });
  }

  // Parcel balance mismatch check (spec §7)
  const parcel_sum = footprint_per_house + parcel_paved + parcel_green_area;
  const parcelBalanceDiff = avg_parcel_size > 0 ? Math.abs(parcel_sum - avg_parcel_size) / avg_parcel_size : 0;
  if (parcelBalanceDiff > 0.01) {
    validations.push({ type: 'warning', key: 'parcel_balance_mismatch' });
  }

  // Land balance check: land_area = roads + built + paved + green
  const land_used = checkLandBalance(
    land_area,
    total_built_footprint,
    roads_area,
    total_paved_area,
    green_area,
    validations
  );

  // ── PARCEL BREAKDOWN (derived, spec §5–6) ───────────────────────────────
  const parcel_breakdown = {
    development_area,
    number_of_parcels,
    avg_parcel_size,
    parcel_building_footprint: footprint_per_house,
    parcel_paved_area: parcel_paved,
    parcel_green_area,
    parcel_total: avg_parcel_size,
    // Green compliance
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
    public_green_area,
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
  // 'building' covers both former 'residential' and 'mixed' types

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
  // = parking_covered × 25 m²/miesto + kobky (3 m²/byt) + technické priestory (5% z parking) + obslužné komunikácie (20% z parking)
  // Počítame predbežne z odhadu bytov (npp_above_est) a parking_ratio
  const npp_above_est = hpp_above_raw * (EFFICIENCY[mode] || EFFICIENCY.realistic);
  const non_res_est = Math.min(non_residential_pct, 0.9);
  const apartments_area_est = npp_above_est * (1 - non_res_est - 0.10);
  const apartment_count_est = avg_apartment_size > 0 ? Math.floor(Math.max(0, apartments_area_est) / avg_apartment_size) : 0;
  const parking_covered_est = Math.ceil(apartment_count_est * parking_ratio);
  const parking_net_area = parking_covered_est * PARKING_SPACE_AREA;        // čisté parkovacie miesta
  const cellars_below = apartment_count_est * 3;                             // kobky 3 m²/byt
  const technical_area = parking_net_area * 0.05;                            // technické priestory 5%
  const circulation_area = parking_net_area * 0.20;                          // obslužné komunikácie 20%
  const hpp_below = parking_net_area + cellars_below + technical_area + circulation_area;

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