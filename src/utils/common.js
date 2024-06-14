function roundToTwoDecimalsUp(number) {
    // Multiply the number by 100 to shift two decimal places to the left
    const multipliedNumber = number * 100;
    
    // Round up to the nearest integer
    const roundedInteger = Math.ceil(multipliedNumber);
    
    // Divide the rounded integer by 100 to shift two decimal places to the right
    const roundedNumber = roundedInteger / 100;
    
    return roundedNumber;
}

module.exports = {
    roundToTwoDecimalsUp
};