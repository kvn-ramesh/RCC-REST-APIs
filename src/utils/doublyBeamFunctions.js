const { ptlim, mulimbd2 } = require('../utils/beamFunctions');
const { roundToTwoDecimalsUp } = require('../utils/common');
const dotenv = require('dotenv');
dotenv.config({path : '../config/config'});
const ES = process.env.ES;

function calculateStress(steelGrade, strain) {
    if (steelGrade === 250) {
        return 217.5;
    } else if (steelGrade === 415) {
        if (strain <= 0.00144) {
            return 288.7;
        } else if (strain > 0.00144 && strain <= 0.00163) {
            return 288.7 + (strain - 0.00144) * ((306.7 - 288.7) / (0.00163 - 0.00144));
        } else if (strain > 0.00163 && strain <= 0.00192) {
            return 306.7 + (strain - 0.00163) * ((324.8 - 306.7) / (0.00192 - 0.00163));
        } else if (strain > 0.00192 && strain <= 0.00241) {
            return 324.8 + (strain - 0.00192) * ((342.8 - 324.8) / (0.00241 - 0.00192));
        } else if (strain > 0.00241 && strain <= 0.00276) {
            return 342.8 + (strain - 0.00241) * ((351.8 - 342.8) / (0.00276 - 0.00241));
        } else if (strain > 0.00276 && strain <= 0.0038) {
            return 351.8 + (strain - 0.00276) * ((360.9 - 351.8) / (0.0038 - 0.00276));
        } else {
            return ""; // You can return any default value or handle the case accordingly
        }
    } else if (steelGrade === 500) {
        if (strain <= 0.00174) {
            return 347.8;
        } else if (strain > 0.00174 && strain <= 0.00195) {
            return 347.8 + (strain - 0.00174) * ((369.6 - 347.8) / (0.00195 - 0.00174));
        } else if (strain > 0.00195 && strain <= 0.00226) {
            return 369.6 + (strain - 0.00195) * ((391.3 - 369.6) / (0.00226 - 0.00195));
        } else if (strain > 0.00226 && strain <= 0.00277) {
            return 391.3 + (strain - 0.00226) * ((413 - 391.3) / (0.00277 - 0.00226));
        } else if (strain > 0.00277 && strain <= 0.00312) {
            return 413 + (strain - 0.00277) * ((423.9 - 413) / (0.00312 - 0.00277));
        } else if (strain > 0.00312 && strain <= 0.00417) {
            return 423.9 + (strain - 0.00312) * ((434.8 - 423.9) / (0.00417 - 0.00312));
        } else {
            return ""; // You can return any default value or handle the case accordingly
        }
    } else {
        return ""; // Handle the case where steel grade is neither 250 nor 415 nor 500
    }
}

function calculateStrain(dratio, steelGrade) {
    // Calculate compression steel strain
    const compressionSteelStrain = 0.0035 * (1 - dratio * ((1265 + steelGrade) / 805));
    return compressionSteelStrain;    
}

// Function to calculate compression steel stress
function calculateCompressionSteelStress(dratio, steelGrade) {
    // Calculate compression steel strain
    const compressionSteelStrain = calculateStrain(dratio, steelGrade);

    // Calculate compression steel stress using the calculateStress function
    const compressionSteelStress = calculateStress(steelGrade, compressionSteelStrain);

    return compressionSteelStress;
}

function calculatePtension(ptlim, R, RLim, fy, dratio) {
    const numerator = 100 * (R - RLim);
    const denominator = 0.87 * fy * (1 - dratio);
    const ptensionValue = ptlim + (numerator / denominator);
    return ptensionValue;
}

function calculatePcompression(fy, pt, ptlim, fsc, fck) {
    const pcompression = (0.87 * fy * (pt - ptlim)) / (fsc - 0.447 * fck);
    return pcompression;
}

// Function to calculate R values based on fck and fy
const calculateRVals = (fck, fy) => {
    // Calculate Rlim value
    const Rlim_val = mulimbd2(fck, fy);
    
    // Round up Rlim value to two decimal places
    const Rlim_start = roundToTwoDecimalsUp(Rlim_val);
    
    // Generate R values array
    const Rvals = Array.from({ length: 500 }, (_, i) => parseFloat((Rlim_start + 0.01 * i).toFixed(2)));

    
    return Rvals;
}

module.exports = {
    calculateStrain,
    calculateStress,
    calculateCompressionSteelStress,
    calculatePtension,
    calculatePcompression,
    calculateRVals
};