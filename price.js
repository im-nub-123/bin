function calculateTotalPrice(bikeName, engineCapacity, gstPercentage, showroomPrice) {
    const gstAmount = (showroomPrice * gstPercentage) / 100;
    const totalPrice = showroomPrice + gstAmount;

    return `Bike Name: ${bikeName}, Engine Capacity: ${engineCapacity}cc, Base Price: ₹${showroomPrice}, GST: ₹${gstAmount}, Total Price: ₹${totalPrice}`;
}

console.log(calculateTotalPrice('Honda Shine', 125, 18, 75000));
