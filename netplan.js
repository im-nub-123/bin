let usage = 72;
let plan;

if (usage < 10) {
    plan = "Basic Plan";
} else if (usage <= 50) {
    plan = "Standard Plan";
} else if (usage <= 100) {
    plan = "Premium Plan";
} else {
    plan = "Unlimited Plan";
}

console.log("Your usage: " + usage + " GB");
console.log("Recommended Plan: " + plan);
