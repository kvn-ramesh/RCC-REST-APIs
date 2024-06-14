const { calculateWidthOfFooting, calculateNetSoilPressure, calculateEffectiveDepthOneWayShear, calculateEffectiveDepthTwoWayShear, calculateEffectiveDepthBendingMoment, calculateBendingMomentCriticalSection, calculateAreaSteelReinforcement, calculateAreaMinSteelReinforcement, calculateReqDevelopmentLength } = require('../utils/footingFunctions');
const { limitingdepthna, mulimbd2 } = require('../utils/beamFunctions');
const { calculateBeta, calculateShearStress } = require('../utils/shearFunctions');
const dotenv = require('dotenv');
dotenv.config({path : '../config/config'});

// Route to calculate and return shear stress
const footingDesign = (req, res, next) => {
    const columnWidth = 450; // Column Width (mm)
    const columnLength = 450; // Column Length (mm)
    const loadFactor = 1.5; // Load factor
    const assumedPercentageTensionSteel = 0.2;  // Assumed Percentage of Tension Steel
    const concreteGrades = [20, 25, 30]; // Concrete grades
    const steelGrades = [415, 500]; // Steel grades

    // Define ranges for service load and safe bearing capacity
 //   const serviceLoadRange = { min: 2000, max: 3000, increment: 100 };
    const serviceLoadRange = { min: 250, max: 5000, increment: 50 };    
//    const safeBearingCapacityRange = { min: 100, max: 400, increment: 50 };
    const safeBearingCapacityRange = { min: 100, max: 300, increment: 25 };
    const barDiameter = 16;
    const clearCover = 50;



    // Initialize array to store results
    const results = [];

    // Iterate over the steel grades
    steelGrades.forEach(steelGrade => {
        // Iterate over the concrete grades
        concreteGrades.forEach(concreteGrade => {

            const beta = calculateBeta(concreteGrade, assumedPercentageTensionSteel);
            const shearStress = parseFloat(calculateShearStress(concreteGrade, assumedPercentageTensionSteel, beta).toFixed(3));

            const ldna = limitingdepthna(steelGrade);
            const Rlim = mulimbd2(concreteGrade, steelGrade);            

            // Iterate over the range of safe bearing capacities
            for (let safeBearingCapacity = safeBearingCapacityRange.min; safeBearingCapacity <= safeBearingCapacityRange.max; safeBearingCapacity += safeBearingCapacityRange.increment) {
                // Iterate over the range of service loads
                for (let serviceLoad = serviceLoadRange.min; serviceLoad <= serviceLoadRange.max; serviceLoad += serviceLoadRange.increment) {

                        // Calculate Factored Load
                        const factoredLoad = loadFactor * serviceLoad;

                        // Calculate Width of footing
                        const widthOfFooting = calculateWidthOfFooting(serviceLoad, safeBearingCapacity);

                        // Intermediate value for calculating one way shear at critical section
                        const intermediateValue = (widthOfFooting  - (columnWidth/1000)) / 2;

                        // Calculate Weight
                        const weight = 1.1 * serviceLoad;

                        // Calculate Base Area of footing
                        const baseArea = weight / safeBearingCapacity;

                        // Calculate Net soil pressure
                        const netSoilPressure = calculateNetSoilPressure(factoredLoad, widthOfFooting);

                        // Calculate effective Depth  for One Way Shear
                        const effectiveDepthOneWayShear = calculateEffectiveDepthOneWayShear(netSoilPressure, shearStress * 1000, intermediateValue);

                        // Calculate effective Depth  for Two Way Shear
                        const effectiveDepthTwoWayShear = calculateEffectiveDepthTwoWayShear(concreteGrade, columnWidth / 1000, netSoilPressure, widthOfFooting);

                        // Calculate effective depth by Bending Moment Criterion
                        const effectiveDepthBendingMoment = calculateEffectiveDepthBendingMoment(netSoilPressure, widthOfFooting, columnWidth / 1000, Rlim)

                        // Calculate effective depth as the maximum value among the three
                        let effectiveDepth = Math.max(effectiveDepthOneWayShear, effectiveDepthTwoWayShear, effectiveDepthBendingMoment) * 1000;
                        effectiveDepth = Math.ceil(effectiveDepth / 10) * 10;

                        // Overall Depth
                        let overallDepthinmm = effectiveDepth + (barDiameter/2) + clearCover;
                        overallDepthinmm = Math.ceil(overallDepthinmm / 10) * 10;

                        // Calculate Bending Moment at Critical Section
                        const bendingMomentCriticalSection = calculateBendingMomentCriticalSection(netSoilPressure, widthOfFooting, columnWidth / 1000);

                        // Calculate Area of Steel Reinforcement for Bending Moment
                        const areaSteelReinforcementBM = calculateAreaSteelReinforcement(concreteGrade, steelGrade, widthOfFooting * 1000, effectiveDepth, bendingMomentCriticalSection * 1000000);

                        // Calculate Area of minimum Steel Reinforcement as per IS Code
                        const areaMinSteelReinforcement = calculateAreaMinSteelReinforcement(widthOfFooting, overallDepthinmm, steelGrade);

                        // Calculate Area of Steel Reinforcement assumed for one way Shear
                        const areaAssumedSteelReinforcementShear = assumedPercentageTensionSteel * widthOfFooting * effectiveDepth * 10;

                        // Area of Steel Reinforcement should be the highest among areaSteelReinforcementBM, areaMinSteelReinforcement, areaAssumedSteelReinforcementShear
                        const areaSteelReinforcement = Math.max(areaSteelReinforcementBM, areaMinSteelReinforcement, areaAssumedSteelReinforcementShear)

                        // Area of Bar in Square mm
                        const areaBarSquareMm = (Math.PI * Math.pow(barDiameter, 2)) / 4;

                        // Number of bars
                        const noOfBars = Math.ceil(areaSteelReinforcement / areaBarSquareMm);

                        // Spacing of Bars
                        const spacingOfBarsInMm = Math.floor(((widthOfFooting * 1000) - (75 * 2) - barDiameter) / (noOfBars - 1));

                        // Maximum Spacing Requirement as per code
                        const maxSpacingISCodeMm = Math.max(3 * effectiveDepth, 300)

                        // Bar Length available
                        const barLengthAvailableMm = ((widthOfFooting * 1000) - columnWidth) / 2;

                        // Required Development Length
                        const reqDevelopmentLengthMm = calculateReqDevelopmentLength(concreteGrade, steelGrade, barDiameter);

                        // Construct JSON object for current load
                        const result = {
                            columnWidth,
                            columnLength,
                            serviceLoad,
                            loadFactor,
                            factoredLoad,
                            concreteGrade,
                            steelGrade,
                            safeBearingCapacity,
                            weight,
                            baseArea,
                            widthOfFooting,
                            netSoilPressure,
                            shearStress,
                            intermediateValue,
                            effectiveDepthOneWayShear,
                            effectiveDepthTwoWayShear,
                            ldna,
                            Rlim,
                            effectiveDepthBendingMoment,
                            effectiveDepth,
                            overallDepthinmm,
                            bendingMomentCriticalSection,
                            areaSteelReinforcementBM,
                            areaMinSteelReinforcement,
                            areaAssumedSteelReinforcementShear,
                            areaSteelReinforcement,
                            barDiameter,
                            noOfBars,
                            spacingOfBarsInMm,
                            maxSpacingISCodeMm,
                            barLengthAvailableMm,
                            reqDevelopmentLengthMm
                        };

                        // Add result to array
                        results.push(result);
                }
            }
        });
    });

    // Send JSON response
    res.json(results);
};


module.exports = {footingDesign};