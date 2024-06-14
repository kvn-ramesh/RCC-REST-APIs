const dotenv = require('dotenv');
dotenv.config({path : '../config/config'});
const ES = process.env.ES;

// Formula to calculate Tension Reinforcement Percentage for Singly Reinforced Rectangular Beam Section under flexure
const calcftrpsrrbs = (fck, fy, R100) => {
    const R = R100 /100;
    const maxpt = ptlim(fck, fy);
    const mumaxbd2 = mulimbd2(fck, fy);
    const mubd2 = ((fck/(2.01*fy))*(1-Math.sqrt(1-((4.620689*R)/fck)))*100).toFixed(3);
    if ((R <= mumaxbd2) && (mubd2 <= maxpt)) {
        return mubd2
    } else {
        return null
    }
    
}

// Formula to calculate Limiting depth of neutral axis
const limitingdepthna = (fy) => {
    return (
        0.0035/(0.0055+0.87*(fy/ES))
    )
}

// Formula to calculate Limiting Percentage of Tensile Steel
const ptlim = (fck, fy) => {
    const xumaxbyd = limitingdepthna(fy);

    return (
        41.37931*(fck/fy)*xumaxbyd
    )
}

// Formula to calculate Limiting Moment of Resistance
const mulimbd2 = (fck, fy) => {
    const xumaxbyd = limitingdepthna(fy);

    return (
        fck*0.36*xumaxbyd*(1-(0.416*xumaxbyd))
    )
}

module.exports = {
    calcftrpsrrbs,
    limitingdepthna,
    ptlim,
    mulimbd2
};