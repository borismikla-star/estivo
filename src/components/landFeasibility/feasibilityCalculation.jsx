/**
 * Land Feasibility Calculation Engine
 * Concept-level estimation – no architectural study
 */

const EFFICIENCY = {
  conservative: 0.72,
  realistic: 0.75,
  efficient: 0.80,
};

export function calculateFeasibility(inputs) {
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