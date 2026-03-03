/**
 * Land Feasibility Calculation Engine
 * Concept-level estimation – no architectural study
 * Supports: block / mixed (apartment model) + subdivision (parcel model)
 */

// ─────────────────────────────────────────────
// SUBDIVISION CALCULATION
// ─────────────────────────────────────────────
export function calculateSubdivision(inputs) {
  const {
    land_area = 0,
    roads_pct = 0.20,          // % internal roads (0–1)
    green_pct = 0.10,          // % public green (0–1)
    min_parcel_size = 600,     // m²
    max_plot_coverage = 0.30,  // % (0–1)
    floors_per_house = 2,
    typology = 'detached',     // detached | semi | row
    risk_buffer_pct = 0.10,    // regulatory risk buffer (0–1)
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

  // Validations
  const validations = [];
  if (roads_pct + green_pct >= 0.60) {
    validations.push({ type: 'error', key: 'roads_green_too_high' });
  }
  if (max_plot_coverage > 0.50) {
    validations.push({ type: 'warning', key: 'coverage_too_high' });
  }
  if (min_parcel_size < 250) {
    validations.push({ type: 'warning', key: 'parcel_too_small' });
  }
  // Effective parcel size check (after typology adjustment)
  if (effective_min_parcel < 250) {
    validations.push({ type: 'warning', key: 'effective_parcel_too_small' });
  }
  // Coverage was capped to 0.50 by typology
  if (typology !== 'detached' && max_plot_coverage * (typology === 'row' ? 1.20 : 1.10) > 0.50) {
    validations.push({ type: 'warning', key: 'coverage_capped_to_max' });
  }

  // 4.1 Development Area
  const roads_area = land_area * roads_pct;
  const green_area = land_area * green_pct;
  const development_area = land_area * (1 - roads_pct - green_pct);

  // 4.2 Number of parcels (using typology-adjusted parcel size)
  const number_of_parcels = Math.max(0, Math.floor(development_area / effective_min_parcel));

  if (number_of_parcels < 1 && land_area > 0) {
    validations.push({ type: 'warning', key: 'no_parcels' });
  }

  // 4.3 Average parcel size
  const avg_parcel_size = number_of_parcels > 0 ? development_area / number_of_parcels : 0;

  // 4.4 Max footprint per house (using typology-adjusted coverage)
  const footprint_per_house = avg_parcel_size * effective_coverage;

  // 4.5 HPP per house
  const hpp_per_house = footprint_per_house * floors_per_house;

  // 4.6 Total HPP
  const total_hpp = hpp_per_house * number_of_parcels;

  // 4.7 Total built footprint
  const total_built_footprint = footprint_per_house * number_of_parcels;

  // 4.8 Effective HPP with risk buffer
  const effective_total_hpp = total_hpp * (1 - risk_buffer_pct);

  // Parking
  const total_parking = number_of_parcels * parking_per_house;

  return {
    // inputs echo
    land_area,
    typology,
    // areas
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
    risk_buffer_applied: risk_buffer_pct > 0,
    risk_buffer_pct,
    // meta
    validations,
    data_confidence: 'concept_subdivision',
    mode: 'subdivision',
  };
}

const EFFICIENCY = {
  conservative: 0.72,
  realistic: 0.75,
  efficient: 0.80,
};

export function calculateFeasibility(inputs) {
  // Route to subdivision model
  if (inputs.project_type === 'subdivision') {
    return calculateSubdivision(inputs);
  }

  const {
    land_area = 0,
    iz = 0,                     // index zastavanosti (0–1)
    kpp = null,                  // koeficient podlažných plôch
    floors = null,               // počet nadzemných podlaží
    project_type = 'residential',
    non_residential_pct = 0,    // % nebytových (0–1)
    min_green_pct = 0.20,       // minimálne % zelene (0–1)
    avg_apartment_size = 60,    // priemerná výmera bytu m²
    mode = 'realistic',         // conservative | realistic | efficient
    green_on_structure = false,
    // New parametrized inputs
    parking_ratio = 1.2,        // covered parking per apartment
    outdoor_ratio = 0.1,        // outdoor parking per apartment
    paved_pct = 0.15,           // spevnené plochy % pozemku
    urban_risk_buffer = 0.10,   // urban design / regulatory risk (0–1)
  } = inputs;

  // 5.1 Zastavaná plocha
  // Fallback: if iz = 0, estimate built area so min_green and paved fit
  let built_area;
  if (iz > 0) {
    built_area = land_area * iz;
  } else {
    // Fallback: paved takes paved_pct, green takes min_green_pct → rest is built
    const paved_fallback = land_area * paved_pct;
    built_area = Math.max(0, land_area * (1 - min_green_pct) - paved_fallback);
  }

  // 5.2 HPP nadzemné (calculated)
  let hpp_above_raw;
  if (kpp !== null && kpp > 0) {
    hpp_above_raw = land_area * kpp;
  } else if (floors !== null && floors > 0) {
    hpp_above_raw = built_area * floors;
  } else {
    hpp_above_raw = 0;
  }

  // 5.3 HPP podzemné
  const hpp_below = built_area * 1.0;

  // 5.4 Urban Risk Buffer → effective HPP above
  const risk_buffer_applied = urban_risk_buffer > 0 && hpp_above_raw > 0;
  const effective_hpp_above = hpp_above_raw * (1 - urban_risk_buffer);

  // Sanity check: KPP vs floors mismatch warning
  const validations = [];
  if (kpp > 0 && floors > 0 && built_area > 0) {
    const hpp_from_kpp = land_area * kpp;
    const hpp_from_floors = built_area * floors;
    const ratio = hpp_from_kpp > 0 ? Math.abs(hpp_from_floors - hpp_from_kpp) / hpp_from_kpp : 0;
    if (ratio > 0.25) {
      validations.push({ type: 'warning', key: 'kpp_floors_mismatch' });
    }
  }

  // Use effective_hpp_above as the base for all downstream calculations
  const hpp_above = effective_hpp_above;

  // 5.4 ČPP nadzemné
  const efficiency = EFFICIENCY[mode] || EFFICIENCY.realistic;
  const npp_above = hpp_above * efficiency;

  // 5.5 ČPP podzemné
  const npp_below = hpp_below * 0.85;

  // 5.6 Byty
  const non_res = Math.min(non_residential_pct, 0.9);
  let apartments_area = npp_above * (1 - non_res - 0.10);

  // Guard: clamp negative apartments area
  if (apartments_area < 0) {
    validations.push({ type: 'warning', key: 'apartments_area_clamped' });
    apartments_area = 0;
  }

  // 5.7 Nebytové priestory
  const non_residential_area = npp_above * non_res;

  // 5.8 Balkóny
  const balconies_area = apartments_area * 0.10;

  // 5.9 Počet bytov
  const apartment_count = avg_apartment_size > 0
    ? Math.floor(apartments_area / avg_apartment_size)
    : 0;

  // 5.10 Parkovanie (parametrized)
  const parking_covered = Math.ceil(apartment_count * parking_ratio);
  const parking_outdoor = Math.ceil(apartment_count * outdoor_ratio);

  // 5.11 Pivnice
  const cellars_area = apartment_count * 3;

  // 5.12 Spevnené plochy (parametrized)
  const paved_area = land_area * paved_pct;

  // 5.13 Zeleň na teréne
  let green_terrain = land_area - built_area - paved_area;
  if (green_terrain < 0) {
    validations.push({ type: 'warning', key: 'green_negative_clamped' });
    green_terrain = 0;
  }
  const green_terrain_pct = land_area > 0 ? green_terrain / land_area : 0;
  const green_warning = green_terrain_pct < min_green_pct;

  // 5.14 Zeleň na konštrukcii
  const green_on_structure_area = green_on_structure ? built_area * 0.30 : 0;

  // Predzáhradky (ground-floor bonus ~5% of apartments)
  const front_gardens_area = apartments_area * 0.05;

  // Validácie
  if (green_warning) {
    validations.push({ type: 'warning', key: 'green_below_minimum', min_pct: min_green_pct, actual_pct: green_terrain_pct });
  }
  if (parking_covered + parking_outdoor < apartment_count) {
    validations.push({ type: 'warning', key: 'parking_insufficient' });
  }

  return {
    // Inputs echo
    land_area,
    // Outputs
    built_area,
    hpp_above: hpp_above_raw,      // theoretical (before risk buffer)
    effective_hpp_above,           // after risk buffer
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
    // Risk buffer meta
    risk_buffer_applied,
    urban_risk_buffer,
    paved_pct,
    parking_ratio,
    outdoor_ratio,
    // Meta
    validations,
    data_confidence: 'concept',
    mode,
  };
}