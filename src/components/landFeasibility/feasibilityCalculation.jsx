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

  // 4.1 Development Area
  const roads_area = land_area * roads_pct;
  const green_area = land_area * green_pct;
  const development_area = land_area * (1 - roads_pct - green_pct);

  // 4.2 Number of parcels
  const number_of_parcels = Math.max(0, Math.floor(development_area / min_parcel_size));

  if (number_of_parcels < 1 && land_area > 0) {
    validations.push({ type: 'warning', key: 'no_parcels' });
  }

  // 4.3 Average parcel size
  const avg_parcel_size = number_of_parcels > 0 ? development_area / number_of_parcels : 0;

  // 4.4 Max footprint per house
  const footprint_per_house = avg_parcel_size * max_plot_coverage;

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
    typology,
    risk_buffer_applied: risk_buffer_pct > 0,
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
    iz = 0,                    // index zastavanosti (0–1)
    kpp = null,                // koeficient podlažných plôch
    floors = null,             // počet nadzemných podlaží
    project_type = 'residential',
    non_residential_pct = 0,   // % nebytových (0–1)
    min_green_pct = 0.20,      // minimálne % zelene (0–1)
    avg_apartment_size = 60,   // priemerná výmera bytu m²
    mode = 'realistic',        // conservative | realistic | efficient
    green_on_structure = false,
  } = inputs;

  // 5.1 Zastavaná plocha
  const built_area = land_area * iz;

  // 5.2 HPP nadzemné
  let hpp_above;
  if (kpp !== null && kpp > 0) {
    hpp_above = land_area * kpp;
  } else if (floors !== null && floors > 0) {
    hpp_above = built_area * floors;
  } else {
    hpp_above = 0;
  }

  // 5.3 HPP podzemné
  const hpp_below = built_area * 1.0;

  // 5.4 ČPP nadzemné
  const efficiency = EFFICIENCY[mode] || EFFICIENCY.realistic;
  const npp_above = hpp_above * efficiency;

  // 5.5 ČPP podzemné
  const npp_below = hpp_below * 0.85;

  // 5.6 Byty
  const non_res = Math.min(non_residential_pct, 0.9);
  const apartments_area = npp_above * (1 - non_res - 0.10);

  // 5.7 Nebytové priestory
  const non_residential_area = npp_above * non_res;

  // 5.8 Balkóny
  const balconies_area = apartments_area * 0.10;

  // 5.9 Počet bytov
  const apartment_count = avg_apartment_size > 0
    ? Math.floor(apartments_area / avg_apartment_size)
    : 0;

  // 5.10 Parkovanie
  const parking_covered = Math.ceil(apartment_count * 1.2);
  const parking_outdoor = Math.ceil(apartment_count * 0.1);

  // 5.11 Pivnice
  const cellars_area = apartment_count * 3;

  // 5.12 Spevnené plochy
  const paved_area = land_area * 0.15;

  // 5.13 Zeleň na teréne
  const green_terrain = land_area - built_area - paved_area;
  const green_terrain_pct = land_area > 0 ? green_terrain / land_area : 0;
  const green_warning = green_terrain_pct < min_green_pct;

  // 5.14 Zeleň na konštrukcii
  const green_on_structure_area = green_on_structure ? built_area * 0.30 : 0;

  // Predzáhradky (ground-floor bonus ~5% of apartments)
  const front_gardens_area = apartments_area * 0.05;

  // Validácie
  const validations = [];
  if (npp_above > hpp_above) {
    validations.push({ type: 'error', key: 'cpp_exceeds_hpp' });
  }
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
    hpp_above,
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
    // Meta
    validations,
    data_confidence: 'concept',
  };
}