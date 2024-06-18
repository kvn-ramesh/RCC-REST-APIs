const { calculateReqDevelopmentLength } = require('../utils/footingFunctions');
const dotenv = require('dotenv');
dotenv.config({path : '../config/config'});

// Route to calculate and return shear stress
const developmentLengthAid = (req, res, next) => {
    const concreteGrades = [15, 20, 25, 30, 35, 40, 45]; // Concrete grades
    const steelGrades = [250, 415, 500]; // Steel grades
    const barDiameters = [6, 8, 10, 12, 16, 18, 20, 22, 25, 28, 32, 36];

    // Initialize array to store results
    const results = [];

    // Iterate over the steel grades
    steelGrades.forEach(steelGrade => {
        // Iterate over the concrete grades
        concreteGrades.forEach(concreteGrade => {
            // Iterate over Bar Diameters
            barDiameters.forEach(barDiameter => {

                // Required Development Length - Tension Bars
                const tensionFactor = 1;
                const reqDevelopmentLengthMm = Math.round(calculateReqDevelopmentLength(concreteGrade, steelGrade, barDiameter, tensionFactor));
                const reqDevelopmentLengthCm = reqDevelopmentLengthMm/10;

                // Required Development Length - Compression Bars
                const compressionFactor = 1.25;
                const reqDevelopmentLengthCompMm = Math.round(calculateReqDevelopmentLength(concreteGrade, steelGrade, barDiameter, compressionFactor));
                const reqDevelopmentLengthCompCm = reqDevelopmentLengthCompMm/10;


                // Construct JSON object for Development Length
                const result = {
                    "Grade of concrete N/mm2": concreteGrade,
                    "Grade of steel N/mm2": steelGrade,
                    "Diameter of bar mm": barDiameter,
                    "Tension Bars - Required development length cm": reqDevelopmentLengthCm,
                    "Compression Bars - Required development length cm": reqDevelopmentLengthCompCm                    
                };

                // Add result to array
                results.push(result);
            });
        });
    });

    // Send JSON response
    res.json(results);
};


module.exports = {developmentLengthAid};