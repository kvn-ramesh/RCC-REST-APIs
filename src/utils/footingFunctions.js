const dotenv = require('dotenv');
dotenv.config({path : '../config/config'});
const ES = process.env.ES;

// Function to calculate width of footing
function calculateWidthOfFooting(serviceLoad, safeBearingCapacity) {
    // Calculate Weight
    const weight = 1.1 * serviceLoad;

    // Calculate Base Area of footing
    const baseArea = weight / safeBearingCapacity;

    // Calculate Width of footing (rounded to the nearest upper number)
    const widthOfFooting = Math.ceil(Math.sqrt(baseArea) * 10) / 10; // Rounded to 1 decimal place

    return widthOfFooting;
}

// Function to calculate net soil pressure
function calculateNetSoilPressure(factoredLoad, widthOfFooting) {
    // Calculate Net soil pressure
    const netSoilPressure = factoredLoad / (widthOfFooting * widthOfFooting ); // Convert to kN/m^2

    return netSoilPressure;
}

// Function to calculate effective depth for one-way shear
function calculateEffectiveDepthOneWayShear(netSoilPressure, shearStress, intermediateValue) {
    // Calculate effective depth for one-way shear
    const effectiveDepthOneWayShear = (netSoilPressure * intermediateValue) / (netSoilPressure + shearStress);

    return effectiveDepthOneWayShear;
}

// Function to calculate effective depth for two-way shear
function calculateEffectiveDepthTwoWayShear(concreteGrade, columnWidth, netSoilPressure, widthOfFooting) {

    // Calculate parameter b of the quadratic equation
    const parameterB = (1000 * Math.sqrt(concreteGrade) * columnWidth + 2 * netSoilPressure * columnWidth) / (1000 * Math.sqrt(concreteGrade) + netSoilPressure);

    // Calculate parameter c of the quadratic equation
    const parameterC =  (netSoilPressure * Math.pow(columnWidth, 2) - netSoilPressure * Math.pow(widthOfFooting, 2)) / (1000 * Math.sqrt(concreteGrade) + netSoilPressure);

    // Calculate effective depth for two-way shear
    const effectiveDepthTwoWayShear = (-parameterB + Math.sqrt(Math.pow(parameterB, 2) - 4 * parameterC)) / 2;

    return effectiveDepthTwoWayShear;
}

// Function to calculate Bending Moment at Critical Section
function calculateBendingMomentCriticalSection(netSoilPressure, widthOfFooting, columnWidth) {
    // Calculate bending moment at the critical section
    const bendingMomentCriticalSection = (netSoilPressure * widthOfFooting * Math.pow((widthOfFooting - columnWidth), 2)) / 8;
    
    return bendingMomentCriticalSection;
}

// Function to calculate effective depth by Bending Moment Criterion
function calculateEffectiveDepthBendingMoment(netSoilPressure, widthOfFooting, columnWidth, Rlim) {
    // Calculate effective depth for bending moment
    const effectiveDepthBendingMoment = Math.sqrt((netSoilPressure * Math.pow((widthOfFooting - columnWidth), 2) * 1000) / (8 * Rlim));
    
    return effectiveDepthBendingMoment/1000;
}

// Function to calculate Area of Steel Reinforcement for Bending Moment
function calculateAreaSteelReinforcement(concreteGrade, steelGrade, widthOfFooting, effectiveDepth, bendingMomentCriticalSection) {

    // Calculate parameter b of the quadratic equation
    const parameterB = (-1) * (widthOfFooting * effectiveDepth * concreteGrade) / steelGrade;
    
    // Calculate parameter c of the quadratic equation
    const parameterC = (widthOfFooting * concreteGrade * bendingMomentCriticalSection) / (0.87 * Math.pow(steelGrade, 2));
    
    // Calculate effective depth for two-way shear
    const areaSteelReinforecement = (-parameterB - Math.sqrt(Math.pow(parameterB, 2) - 4 * parameterC)) / 2;

    return areaSteelReinforecement;    
}

// Function to calculate minimum steel reinforcement required
function calculateAreaMinSteelReinforcement(widthOfFooting, overallDepthinmm, steelGrade) {
    let areaMinSteelReinforcement;
    if (steelGrade === 250) {
        areaMinSteelReinforcement = 1.2 * widthOfFooting * overallDepthinmm;
    } else if (steelGrade === 415 || steelGrade === 500) {
        areaMinSteelReinforcement = 1.2 * widthOfFooting * overallDepthinmm;
    } else {
        // Handle other cases or provide a default value
        areaMinSteelReinforcement = null; // You can change this to a default value or handle it differently
    }
    return areaMinSteelReinforcement;
}

// Function to calculate required Development Length
function calculateReqDevelopmentLength(concreteGrade, steelGrade, barDiameterMm) {

    let designBondStress;
    if (concreteGrade === 20) {
        designBondStress = 1.2;
    } else if (concreteGrade === 25) {
        designBondStress = 1.4;
    } else if (concreteGrade === 30) {
        designBondStress = 1.5;
    } else if (concreteGrade === 35) {
        designBondStress = 1.7;
    } else if (concreteGrade >= 40) {
        designBondStress = 1.9;
    } else {
        // Handle other cases or provide a default value
        designBondStress = null; // You can change this to a default value or handle it differently
    }

    let calculatedDesignBondStress;

    if (steelGrade === 250) {
        calculatedDesignBondStress = designBondStress;
    } else if (steelGrade === 415 || steelGrade === 500) {
        calculatedDesignBondStress = 1.6 * designBondStress;
    } else {
        // Handle other cases or provide a default value
        calculatedDesignBondStress = null; // You can change this to a default value or handle it differently
    }

    let reqDevelopmentLength;
    reqDevelopmentLength = (barDiameterMm * 0.87 * steelGrade) / (4 * calculatedDesignBondStress)

    return reqDevelopmentLength;

}

module.exports = {
    calculateWidthOfFooting,
    calculateNetSoilPressure,
    calculateEffectiveDepthOneWayShear,
    calculateEffectiveDepthTwoWayShear,
    calculateEffectiveDepthBendingMoment,
    calculateBendingMomentCriticalSection,
    calculateAreaSteelReinforcement,
    calculateAreaMinSteelReinforcement,
    calculateReqDevelopmentLength
};