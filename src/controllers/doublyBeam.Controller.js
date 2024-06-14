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
                        steelGrade: `Fe${fy}`,
                        concreteGrade : `M${fck}`,
                        factoredMoment : rv,
                        dratio: parseFloat(dr.toFixed(2)),
                        ptlim_val: ptlim_val,
                        CompressionSteelStress: parseFloat(CompressionSteelStress.toFixed(2)),
                        ptension: parseFloat(ptension.toFixed(3)),
                        pcompression: parseFloat(pcompression.toFixed(3)),
                    });
                });
            });
        });
    });

    res.json(results);
};


module.exports = {steelPercentage};