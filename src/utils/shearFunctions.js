const dotenv = require('dotenv');
dotenv.config({path : '../config/config'});
const ES = process.env.ES;

// Function to calculate Beta
function calculateBeta(fck, pt) {
    return (0.8 * fck) / (6.89 * pt < 1 ? 1 : 6.89 * pt);
}


// Function to calculate Shear Stress
function calculateShearStress(fck, pt, beta) {
    return (
        (0.85 *
            Math.sqrt(0.8 * fck) *
            (Math.sqrt(1 + 5 * beta) - 1)) /
        (6 * beta)
    );
}

module.exports = {
    calculateBeta,
    calculateShearStress
};