const { calculateReqDevelopmentLength } = require('../utils/footingFunctions');
const dotenv = require('dotenv');
dotenv.config({path : '../config/config'});

// Route to calculate and return shear stress
const developmentLengthAid = (req, res, next) => {
    const concreteGrades = [20, 25, 30, 35, 40, 45]; // Concrete grades
    const steelGrades = [250, 415, 500]; // Steel grades
    const barDiameters = [10, 12, 16, 18, 20, 22, 25];

    // Initialize array to store results
    const results = [];

    // Iterate over the steel grades
    steelGrades.forEach(steelGrade => {
        // Iterate over the concrete grades
        concreteGrades.forEach(concreteGrade => {
            // Iterate over Bar Diameters
            barDiameters.forEach(barDiameter => {

                // Required Development Length
                const reqDevelopmentLengthMm = Math.ceil(calculateReqDevelopmentLength(concreteGrade, steelGrade, barDiameter));

                // Construct JSON object for Development Length
                const result = {
                    concreteGrade,
                    steelGrade,
                    barDiameter,
                    reqDevelopmentLengthMm
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