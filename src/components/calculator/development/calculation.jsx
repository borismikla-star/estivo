
// Helper function to calculate IRR using Newton-Raphson method
function calculateIRR(cashFlows, guess = 0.1) {
    const maxIterations = 100;
    const tolerance = 0.00001;
    let rate = guess;
    
    for (let i = 0; i < maxIterations; i++) {
        let npv = 0;
        let dnpv = 0;
        
        for (let t = 0; t < cashFlows.length; t++) {
            const denominator = Math.pow(1 + rate, t);
            npv += cashFlows[t] / denominator;
            dnpv -= (t * cashFlows[t]) / Math.pow(1 + rate, t + 1);
        }
        
        const newRate = rate - npv / dnpv;
        
        if (Math.abs(newRate - rate) < tolerance) {
            return newRate * 100; // Return as percentage
        }
        
        rate = newRate;
    }
    
    return 0; // If no convergence, return 0
}

export function calculateDevelopment(projectData, preset, language = 'en') {
    const {
        project_info_data = {},
        cost_data = {},
        revenue_data = {},
        financing_data = {}
    } = projectData;

    const num = (value) => {
        const parsed = Number(value);
        return isNaN(parsed) ? 0 : parsed;
    };

    // === PROJECT DATA ===
    const totalLandArea = num(project_info_data.total_land_area);
    const buildingArea = num(project_info_data.building_area);
    const gfaAbove = num(project_info_data.gfa_above);
    const gfaBelow = num(project_info_data.gfa_below);
    const nfaAbove = num(project_info_data.nfa_above);
    const nfaBelow = num(project_info_data.nfa_below);
    const salesAreaApartments = num(project_info_data.sales_area_apartments);
    const salesAreaNonResidential = num(project_info_data.sales_area_non_residential);
    const salesAreaBalconies = num(project_info_data.sales_area_balconies);
    const salesAreaGardens = num(project_info_data.sales_area_gardens);
    const parkingIndoorCount = num(project_info_data.parking_indoor_count);
    const parkingOutdoorCount = num(project_info_data.parking_outdoor_count);
    const pavedAreas = num(project_info_data.paved_areas);
    const greenAreasTerrain = num(project_info_data.green_areas_terrain);
    const greenAreasStructure = num(project_info_data.green_areas_structure);
    const basementArea = num(project_info_data.basement_area);

    const totalGFA = gfaAbove + gfaBelow;
    const totalNFA = nfaAbove + nfaBelow;
    const totalSalesArea = salesAreaApartments + salesAreaNonResidential + salesAreaBalconies + salesAreaGardens + basementArea;

    // === COST CALCULATIONS WITH MANUAL MODE SUPPORT ===
    
    // 1. Land + Project Purchase
    const landAndProject = num(cost_data.land_and_project);

    // 2. Implementation - with manual mode support
    const calculateCost = (prefix, area) => {
        const isManual = cost_data[`${prefix}_manual_mode`];
        if (isManual) {
            return num(cost_data[`${prefix}_manual_value`]);
        }
        return area * num(cost_data[`${prefix}_unit_price`]);
    };

    const aboveGroundCost = calculateCost('above_ground', gfaAbove);
    const belowGroundCost = calculateCost('below_ground', gfaBelow);
    const outdoorAreasCost = calculateCost('outdoor_areas', pavedAreas);
    const greeneryTerrainCost = calculateCost('greenery_terrain', greenAreasTerrain);
    const greeneryStructureCost = calculateCost('greenery_structure', greenAreasStructure);

    const implementationSubtotal = aboveGroundCost + belowGroundCost + outdoorAreasCost + greeneryTerrainCost + greeneryStructureCost;
    
    // Engineering networks - with manual mode support
    const engineeringNetworks = cost_data.engineering_networks_manual_mode
        ? num(cost_data.engineering_networks_manual_value)
        : implementationSubtotal * 0.04; // 4% of 2.1-2.5
    
    const totalImplementation = implementationSubtotal + engineeringNetworks;

    // 3. Additional Budget Costs (percentages of implementation costs)
    const projectManagement = cost_data.project_management_manual_mode
        ? num(cost_data.project_management_manual_value)
        : totalImplementation * 0.035; // 3.5%
        
    const siteEquipment = cost_data.site_equipment_manual_mode
        ? num(cost_data.site_equipment_manual_value)
        : totalImplementation * 0.03; // 3%
        
    const projectActivity = cost_data.project_activity_manual_mode
        ? num(cost_data.project_activity_manual_value)
        : totalImplementation * 0.035; // 3.5%
        
    const engineeringActivity = cost_data.engineering_activity_manual_mode
        ? num(cost_data.engineering_activity_manual_value)
        : totalImplementation * 0.01; // 1%
        
    const technicalSupervision = cost_data.technical_supervision_manual_mode
        ? num(cost_data.technical_supervision_manual_value)
        : totalImplementation * 0.015; // 1.5%

    // Sales and Marketing will be calculated as % of revenue later
    let salesCosts = 0;
    let marketingCosts = 0;

    const totalAdditionalBudget = projectManagement + siteEquipment + projectActivity + 
                                  engineeringActivity + technicalSupervision;

    // 4. Other Services - with manual mode support for development fee
    const legalServices = cost_data.legal_services_manual_mode
        ? num(cost_data.legal_services_manual_value)
        : totalImplementation * 0.005; // 0.5%
    
    const developmentFee = cost_data.development_fee_manual_mode
        ? num(cost_data.development_fee_manual_value)
        : totalSalesArea * num(cost_data.development_fee_per_m2);
        
    const otherFeesPermits = cost_data.other_fees_manual_mode
        ? num(cost_data.other_fees_manual_value)
        : implementationSubtotal * 0.01; // 1% of 2.1-2.6

    const totalOtherServices = legalServices + developmentFee + otherFeesPermits;

    // 5. Reserve
    const reserveProvision = cost_data.reserve_manual_mode
        ? num(cost_data.reserve_manual_value)
        : totalImplementation * 0.05; // 5%

    // === REVENUE CALCULATIONS ===
    const apartmentsUnitPrice = num(revenue_data.apartments_unit_price);
    const nonResidentialUnitPrice = num(revenue_data.non_residential_unit_price);
    const parkingIndoorUnitPrice = num(revenue_data.parking_indoor_unit_price);
    const parkingOutdoorUnitPrice = num(revenue_data.parking_outdoor_unit_price);
    const balconiesUnitPrice = num(revenue_data.balconies_unit_price);
    const gardensUnitPrice = num(revenue_data.gardens_unit_price);
    const basementsUnitPrice = num(revenue_data.basements_unit_price);
    const otherRevenue = num(revenue_data.other_revenue);

    const apartmentsRevenue = salesAreaApartments * apartmentsUnitPrice;
    const nonResidentialRevenue = salesAreaNonResidential * nonResidentialUnitPrice;
    const parkingIndoorRevenue = parkingIndoorCount * parkingIndoorUnitPrice;
    const parkingOutdoorRevenue = parkingOutdoorCount * parkingOutdoorUnitPrice;
    const balconiesRevenue = salesAreaBalconies * balconiesUnitPrice;
    const gardensRevenue = salesAreaGardens * gardensUnitPrice;
    const basementsRevenue = basementArea * basementsUnitPrice;

    const totalGrossRevenue = apartmentsRevenue + nonResidentialRevenue + parkingIndoorRevenue + 
                              parkingOutdoorRevenue + balconiesRevenue + gardensRevenue + 
                              basementsRevenue + otherRevenue;

    // Now calculate sales and marketing as % of revenue
    salesCosts = totalGrossRevenue * 0.02; // 2% of revenue
    marketingCosts = totalGrossRevenue * 0.008; // 0.8% of revenue

    // === TOTAL COSTS BEFORE FINANCING ===
    const totalCostsBeforeFinancing = landAndProject + totalImplementation + totalAdditionalBudget + 
                                      salesCosts + marketingCosts + totalOtherServices + reserveProvision;

    // === FINANCING ===
    const ownResourcesPercent = num(financing_data.own_resources_percent) || 30;
    const bankInterestPercent = num(financing_data.bank_interest_percent) || 6;

    const ownResources = totalCostsBeforeFinancing * (ownResourcesPercent / 100);
    const bankResources = totalCostsBeforeFinancing * ((100 - ownResourcesPercent) / 100);

    const ownResourcesInterest = ownResources * 0.05; // 5% interest on own resources
    const bankFees = bankResources * 0.002; // 0.2% bank fees
    const bankInterest = bankResources * (bankInterestPercent / 100);

    const totalFinancingCosts = ownResourcesInterest + bankFees + bankInterest;

    // === TOTAL PROJECT COSTS ===
    const totalProjectCosts = totalCostsBeforeFinancing + totalFinancingCosts;

    // === NET REVENUE (after sales commission which is already in salesCosts) ===
    const netRevenue = totalGrossRevenue - salesCosts;

    // === PROFIT ANALYSIS ===
    const grossProfit = totalGrossRevenue - totalProjectCosts;
    const netProfit = netRevenue - totalProjectCosts;
    
    const profitMargin = totalGrossRevenue > 0 ? (grossProfit / totalGrossRevenue) * 100 : 0;
    const developerMargin = totalProjectCosts > 0 ? (grossProfit / totalProjectCosts) * 100 : 0;
    const returnOnCost = totalProjectCosts > 0 ? (grossProfit / totalProjectCosts) * 100 : 0;

    // === PER M² METRICS ===
    const costPerM2 = totalSalesArea > 0 ? totalProjectCosts / totalSalesArea : 0;
    const landCostPerM2 = totalLandArea > 0 ? landAndProject / totalLandArea : 0;
    const constructionCostPerM2 = totalGFA > 0 ? totalImplementation / totalGFA : 0;
    const revenuePerM2 = totalSalesArea > 0 ? totalGrossRevenue / totalSalesArea : 0;
    const profitPerM2 = totalSalesArea > 0 ? grossProfit / totalSalesArea : 0;

    // === DEVELOPER'S RETURN - CORRECTED WITH IRR ===
    const equityMultiple = ownResources > 0 ? (grossProfit + ownResources) / ownResources : 0;
    
    // Project duration for annualized return (default 24 months = 2 years)
    const projectDurationMonths = num(financing_data.project_duration_months) || 24;
    const projectDurationYears = projectDurationMonths / 12;
    
    // Simple annualized return (CAGR on equity)
    const annualizedReturn = ownResources > 0 && projectDurationYears > 0 
        ? (Math.pow(equityMultiple, 1/projectDurationYears) - 1) * 100 
        : 0;

    // === IRR CALCULATION WITH TIMELINE ===
    // Simplified timeline model:
    // - Month 0: Initial equity investment
    // - Months 1-(duration-6): Construction costs paid gradually
    // - Months (duration-6)-duration: Sales revenue comes in
    
    const cashFlowsForIRR = [];
    
    // Initial investment (negative)
    cashFlowsForIRR.push(-ownResources);
    
    // During construction: costs are paid out (negative cash flows)
    const constructionMonths = Math.max(projectDurationMonths - 6, projectDurationMonths * 0.75);
    const monthlyCostDuringConstruction = (totalCostsBeforeFinancing - ownResources) / constructionMonths;
    
    for (let month = 1; month <= constructionMonths; month++) {
        cashFlowsForIRR.push(-monthlyCostDuringConstruction);
    }
    
    // During sales phase: revenue comes in (positive cash flows)
    const salesMonths = projectDurationMonths - constructionMonths;
    const monthlyRevenueDuringSales = salesMonths > 0 ? totalGrossRevenue / salesMonths : 0;
    
    for (let month = 1; month <= salesMonths; month++) {
        cashFlowsForIRR.push(monthlyRevenueDuringSales);
    }
    
    // Calculate IRR on monthly cash flows, then annualize
    const monthlyIRR = calculateIRR(cashFlowsForIRR, 0.01);
    const irr = Math.pow(1 + monthlyIRR / 100, 12) - 1; // Convert to annual
    const irrAnnual = irr * 100;

    // === BREAKEVEN & RISK METRICS ===
    const breakEvenRevenue = totalProjectCosts;
    const breakEvenPercentage = totalGrossRevenue > 0 ? (breakEvenRevenue / totalGrossRevenue) * 100 : 0;
    
    // Land value uplift
    const landValueUplift = totalGrossRevenue - landAndProject;
    const landValueUpliftPercent = landAndProject > 0 ? (landValueUplift / landAndProject) * 100 : 0;

    // === COST BREAKDOWN FOR CHARTS ===
    const costLabels = {
        en: {
            land: 'Land & Project',
            construction: 'Construction',
            additional: 'Additional Budget',
            services: 'Other Services',
            reserve: 'Reserve',
            financing: 'Financing',
            marketing: 'Sales & Marketing'
        },
        sk: {
            land: 'Pozemok a projekt',
            construction: 'Výstavba',
            additional: 'Dodatočné náklady',
            services: 'Ostatné služby',
            reserve: 'Rezerva',
            financing: 'Financovanie',
            marketing: 'Predaj a marketing'
        },
        pl: {
            land: 'Grunt i projekt',
            construction: 'Budowa',
            additional: 'Dodatkowy budżet',
            services: 'Inne usługi',
            reserve: 'Rezerwa',
            financing: 'Finansowanie',
            marketing: 'Sprzedaż i marketing'
        },
        hu: {
            land: 'Telek és projekt',
            construction: 'Építés',
            additional: 'További költségvetés',
            services: 'Egyéb szolgáltatások',
            reserve: 'Tartalék',
            financing: 'Finanszírozás',
            marketing: 'Értékesítés és marketing'
        },
        de: {
            land: 'Grundstück und Projekt',
            construction: 'Bau',
            additional: 'Zusätzliches Budget',
            services: 'Sonstige Dienstleistungen',
            reserve: 'Reserve',
            financing: 'Finanzierung',
            marketing: 'Verkauf und Marketing'
        }
    };
    
    const labels = costLabels[language] || costLabels.en;
    
    const costBreakdown = [
        { name: labels.land, value: landAndProject, percentage: totalProjectCosts > 0 ? ((landAndProject / totalProjectCosts) * 100).toFixed(1) : 0 },
        { name: labels.construction, value: totalImplementation, percentage: totalProjectCosts > 0 ? ((totalImplementation / totalProjectCosts) * 100).toFixed(1) : 0 },
        { name: labels.additional, value: totalAdditionalBudget, percentage: totalProjectCosts > 0 ? ((totalAdditionalBudget / totalProjectCosts) * 100).toFixed(1) : 0 },
        { name: labels.marketing, value: salesCosts + marketingCosts, percentage: totalProjectCosts > 0 ? (((salesCosts + marketingCosts) / totalProjectCosts) * 100).toFixed(1) : 0 },
        { name: labels.services, value: totalOtherServices, percentage: totalProjectCosts > 0 ? ((totalOtherServices / totalProjectCosts) * 100).toFixed(1) : 0 },
        { name: labels.reserve, value: reserveProvision, percentage: totalProjectCosts > 0 ? ((reserveProvision / totalProjectCosts) * 100).toFixed(1) : 0 },
        { name: labels.financing, value: totalFinancingCosts, percentage: totalProjectCosts > 0 ? ((totalFinancingCosts / totalProjectCosts) * 100).toFixed(1) : 0 }
    ].filter(item => item.value > 0);

    // === REVENUE BREAKDOWN FOR CHARTS ===
    const revenueLabels = {
        en: {
            apartments: 'Apartments',
            non_residential: 'Non-Residential',
            parking_indoor: 'Indoor Parking',
            parking_outdoor: 'Outdoor Parking',
            balconies: 'Balconies',
            gardens: 'Gardens',
            basements: 'Basements',
            other: 'Other'
        },
        sk: {
            apartments: 'Byty',
            non_residential: 'Nebytové priestory',
            parking_indoor: 'Kryté parkovanie',
            parking_outdoor: 'Vonkajšie parkovanie',
            balconies: 'Balkóny',
            gardens: 'Predzáhradky',
            basements: 'Pivnice',
            other: 'Ostatné'
        },
        pl: {
            apartments: 'Mieszkania',
            non_residential: 'Lokale użytkowe',
            parking_indoor: 'Parking wewnętrzny',
            parking_outdoor: 'Parking zewnętrzny',
            balconies: 'Balkony',
            gardens: 'Ogródki',
            basements: 'Piwnice',
            other: 'Inne'
        },
        hu: {
            apartments: 'Lakások',
            non_residential: 'Nem lakás',
            parking_indoor: 'Fedett parkoló',
            parking_outdoor: 'Kültéri parkoló',
            balconies: 'Erkélyek',
            gardens: 'Kertek',
            basements: 'Pincék',
            other: 'Egyéb'
        },
        de: {
            apartments: 'Wohnungen',
            non_residential: 'Gewerbeflächen',
            parking_indoor: 'Tiefgarage',
            parking_outdoor: 'Außenstellplätze',
            balconies: 'Balkone',
            gardens: 'Gärten',
            basements: 'Keller',
            other: 'Sonstiges'
        }
    };
    
    const revLabels = revenueLabels[language] || revenueLabels.en;
    
    const revenueBreakdown = [
        { name: revLabels.apartments, value: apartmentsRevenue, percentage: totalGrossRevenue > 0 ? ((apartmentsRevenue / totalGrossRevenue) * 100).toFixed(1) : 0 },
        { name: revLabels.non_residential, value: nonResidentialRevenue, percentage: totalGrossRevenue > 0 ? ((nonResidentialRevenue / totalGrossRevenue) * 100).toFixed(1) : 0 },
        { name: revLabels.parking_indoor, value: parkingIndoorRevenue, percentage: totalGrossRevenue > 0 ? ((parkingIndoorRevenue / totalGrossRevenue) * 100).toFixed(1) : 0 },
        { name: revLabels.parking_outdoor, value: parkingOutdoorRevenue, percentage: totalGrossRevenue > 0 ? ((parkingOutdoorRevenue / totalGrossRevenue) * 100).toFixed(1) : 0 },
        { name: revLabels.balconies, value: balconiesRevenue, percentage: totalGrossRevenue > 0 ? ((balconiesRevenue / totalGrossRevenue) * 100).toFixed(1) : 0 },
        { name: revLabels.gardens, value: gardensRevenue, percentage: totalGrossRevenue > 0 ? ((gardensRevenue / totalGrossRevenue) * 100).toFixed(1) : 0 },
        { name: revLabels.basements, value: basementsRevenue, percentage: totalGrossRevenue > 0 ? ((basementsRevenue / totalGrossRevenue) * 100).toFixed(1) : 0 },
        { name: revLabels.other, value: otherRevenue, percentage: totalGrossRevenue > 0 ? ((otherRevenue / totalGrossRevenue) * 100).toFixed(1) : 0 }
    ].filter(item => item.value > 0);

    return {
        kpis: {
            // Investment Summary
            total_project_costs: totalProjectCosts,
            own_resources: ownResources,
            bank_resources: bankResources,
            total_financing_costs: totalFinancingCosts,
            
            // Revenue
            gross_revenue: totalGrossRevenue,
            net_revenue: netRevenue,
            
            // Profit Metrics
            gross_profit: grossProfit,
            net_profit: netProfit,
            profit_margin: profitMargin,
            developer_margin: developerMargin,
            return_on_cost: returnOnCost,
            
            // Per M² Metrics
            cost_per_m2: costPerM2,
            land_cost_per_m2: landCostPerM2,
            construction_cost_per_m2: constructionCostPerM2,
            revenue_per_m2: revenuePerM2,
            profit_per_m2: profitPerM2,
            
            // Developer Returns
            equity_multiple: equityMultiple,
            annualized_return: annualizedReturn,
            irr: irrAnnual, // NEW: True IRR calculation
            
            // Risk & Breakeven
            break_even_revenue: breakEvenRevenue,
            break_even_percentage: breakEvenPercentage,
            land_value_uplift: landValueUplift,
            land_value_uplift_percent: landValueUpliftPercent,
            
            // Areas
            total_gfa: totalGFA,
            total_nfa: totalNFA,
            total_sales_area: totalSalesArea,
            total_land_area: totalLandArea,
            
            // Efficiency ratios
            gfa_to_land_ratio: totalLandArea > 0 ? (totalGFA / totalLandArea) : 0,
            nfa_to_gfa_ratio: totalGFA > 0 ? (totalNFA / totalGFA) * 100 : 0,
            sales_to_gfa_ratio: totalGFA > 0 ? (totalSalesArea / totalGFA) * 100 : 0,
            
            // Timeline
            project_duration_months: projectDurationMonths,
            project_duration_years: projectDurationYears,
        },
        cost_breakdown: costBreakdown,
        revenue_breakdown: revenueBreakdown
    };
}
