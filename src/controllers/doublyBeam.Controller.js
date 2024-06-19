const { calculateStrain, calculateStress, calculateCompressionSteelStress, calculatePtension, calculatePcompression, calculateRVals } = require('../utils/doublyBeamFunctions');
const { ptlim, mulimbd2 } = require('../utils/beamFunctions');
const { roundToTwoDecimalsUp } = require('../utils/common');
const dotenv = require('dotenv');
dotenv.config({path : '../config/config'});

// Route to calculate and return shear stress
const steelPercentage = (req, res, next) => {
    const concreteGrades = [15, 20, 25, 30];
    const steelGrades = [250, 415, 500];
    const dratio = Array.from({ length: 4 }, (_, i) => 0.05 + 0.05 * i);
    const results = [];

    concreteGrades.forEach((fck) => {
        steelGrades.forEach((fy) => {
            const ptlim_val = ptlim(fck, fy);
            const Rlim_val = mulimbd2(fck, fy);
            const Rvals = calculateRVals(fck, fy); // Using calculateRVals function
            Rvals.forEach((rv) => {
                dratio.forEach((dr) => {
                    const CompressionSteelStress = calculateCompressionSteelStress(dr, fy);
                    const ptension = calculatePtension(ptlim_val, rv, Rlim_val, fy, dr);
                    const pcompression = calculatePcompression(fy, ptension, ptlim_val, CompressionSteelStress, fck);

                    results.push({
                        "Grade of steel N/mm2": `Fe${fy}`,
                        "Grade of concrete N/mm2" : `M${fck}`,
                        "Moment of resistance factor (Mu/bd2) N/mm2" : rv,
                        "d'/d": parseFloat(dr.toFixed(2)),
//                        ptlim_val: ptlim_val,
//                        CompressionSteelStress: parseFloat(CompressionSteelStress.toFixed(2)),
                        "Tension reinforcement percentage": parseFloat(ptension.toFixed(3)),
                        "Compression reinforcement percentage": parseFloat(pcompression.toFixed(3)),
                    });
                });
            });
        });
    });

    res.json(results);
};


module.exports = {steelPercentage};