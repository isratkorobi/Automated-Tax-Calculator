function calculateTaxSystem() {
    // ১. আগে চেক করা হচ্ছে কোনো রেডিও বাটন সিলেক্ট করা আছে কি না
    let categoryElement = document.querySelector('input[name="taxCategory"]:checked');
    let category = categoryElement ? categoryElement.value : null;

    let grossSalary = Number(document.getElementById('grossSalary').value) || 0;
    let actualInvestment = Number(document.getElementById('actualInvestment').value) || 0;
    let sourceTax = Number(document.getElementById('sourceTax').value) || 0;

    // ২. Base limits based on category
    // যদি কোনো কিছু সিলেক্ট করা না থাকে, তাহলে ডিফল্টভাবে সাধারণ স্ল্যাব (Male) ৩,৭৫,০০০ ধরে নিবে যেন কোড এরর না দেয়
    let threshold = 375000;
    if (category === 'female') {
        threshold = 425000;
    } else if (category === 'disable') {
        threshold = 500000;
    } else if (category === 'freedom') {
        threshold = 525000;
    }

    // 3. Exempted Income & Taxable Income Calculation
    let oneThird = grossSalary / 3;
    let exemptedIncome = Math.min(oneThird, 500000);
    let taxableIncome = grossSalary - exemptedIncome;
    if (taxableIncome < 0) {
        taxableIncome = 0;
    }

    // 4. Allowable Investment Display
    let allowableInvestment = Math.min(taxableIncome * 0.15, 1000000);

    // 5. Total Tax Payable Calculation
    let taxPayable = taxableIncome - threshold;
    let totalTax = 0;

    if (taxPayable > 0) {
        let slab1 = Math.min(taxPayable, 300000);
        totalTax += slab1 * 0.10;
        taxPayable -= slab1;
    }
    if (taxPayable > 0) {
        let slab2 = Math.min(taxPayable, 400000);
        totalTax += slab2 * 0.15;
        taxPayable -= slab2;
    }
    if (taxPayable > 0) {
        let slab3 = Math.min(taxPayable, 500000);
        totalTax += slab3 * 0.20;
        taxPayable -= slab3;
    }
    if (taxPayable > 0) {
        let slab4 = Math.min(taxPayable, 2000000);
        totalTax += slab4 * 0.25;
        taxPayable -= slab4;
    }
    if (taxPayable > 0) {
        totalTax += taxPayable * 0.30;
    }

    // Tax rebate calculation
    let rebateRuleA = taxableIncome * 0.03;
    let rebateRuleB = actualInvestment * 0.10;
    let taxRebate = Math.min(rebateRuleA, rebateRuleB, 100000);

    if (taxRebate > totalTax) {
        taxRebate = totalTax;
    }

    // Net tax payable (with minimum 5000 bdt rule)
    let netTax = totalTax - taxRebate;
    if (taxableIncome > threshold && netTax < 5000) {
        netTax = 5000;
    } else if (taxableIncome <= threshold) {
        netTax = 0;
    }

    // Source tax
    let taxPayableReturn = netTax - sourceTax;
    if (taxPayableReturn < 0) {
        taxPayableReturn = 0;
    }

    // Monthly TDS calculation:
    // Monthly TDS calculation:

    // ১. Without Investment Calculation
    // Monthly TDS calculation:

    // ১. Without Investment Calculation
    let taxWithoutRebate = totalTax;
    if (taxableIncome > threshold && taxWithoutRebate < 5000) {
        taxWithoutRebate = 5000;
    }

    // Source tax বাদ দিয়ে হিসাব করা
    let remainingTaxWithoutRebate = taxWithoutRebate - sourceTax;
    if (remainingTaxWithoutRebate < 0) {
        remainingTaxWithoutRebate = 0; // মাইনাস ফিগার যেন না আসে
    }
    let MonthlyTdsWithout = remainingTaxWithoutRebate / 12;

    // ২. If Investment Calculation (শুধুমাত্র ইনভেস্টমেন্ট থাকলে হিসাব হবে)
    let MonthlyTdsInvest = 0;
    if (actualInvestment > 0) {
        // ইনভেস্টমেন্ট থাকলে সরাসরি "Tax Payable With Return" কে ১২ দিয়ে ভাগ করা হবে
        MonthlyTdsInvest = taxPayableReturn / 12;
    }

    // DOM আপডেটের কাজগুলো
    document.getElementById('exemptedIncome').value = Math.round(exemptedIncome);
    document.getElementById('taxableIncome').value = Math.round(taxableIncome);
    document.getElementById('allowableInvestment').value = Math.round(allowableInvestment);
    document.getElementById('totalTaxPayable').value = Math.round(totalTax);
    document.getElementById('taxRebate').value = Math.round(taxRebate);
    document.getElementById('netTaxPayable').value = Math.round(netTax);

    document.getElementById('taxPayableReturn').value = Math.round(taxPayableReturn);
    document.getElementById('monthlyTdsInvest').value = Math.round(MonthlyTdsInvest);
    document.getElementById('monthlyTdsWithout').value = Math.round(MonthlyTdsWithout); s
}

// Add event listeners:
document.getElementById('grossSalary').addEventListener('input', calculateTaxSystem);
document.getElementById('actualInvestment').addEventListener('input', calculateTaxSystem);
document.getElementById('sourceTax').addEventListener('input', calculateTaxSystem); // Fixed: শেষের 's' রিমুভ করা হয়েছে

let radios = document.querySelectorAll('input[name="taxCategory"]');
radios.forEach(radio => radio.addEventListener('change', function () {

    // মেইন ফর্মের ইনপুট ফিল্ডগুলো খালি করে দেওয়া
    document.getElementById('grossSalary').value = '';
    document.getElementById('actualInvestment').value = '';
    document.getElementById('sourceTax').value = '';

    // মডালের ভেতরের ইনপুটগুলোও '0' করে দেওয়া
    document.querySelectorAll(".inv-input").forEach(inp => inp.value = '0');
    if (document.getElementById('modalTotalAmount')) {
        document.getElementById('modalTotalAmount').value = '0';
    }

    // Initial Call
    calculateTaxSystem();
}));
// ==========================================
// Modal Elements
// ==========================================
const modal = document.getElementById("investmentModal");
const mainInvestmentInput = document.getElementById("actualInvestment");
const closeModalBtn = document.getElementById("closeModal");
const saveChangesBtn = document.getElementById("saveChangesBtn");
const invInputs = document.querySelectorAll(".inv-input");
const modalTotalAmount = document.getElementById("modalTotalAmount");

// ১. HTML থেকে সরাসরি এই ফাংশনটি কল হবে মডাল ওপেন করার জন্য
window.openInvestmentModal = function () {
    if (modal) {
        modal.style.display = "flex";
        document.getElementById("modalAllowable").value = document.getElementById("allowableInvestment").value;
    } else {
        console.log("Modal element not found!");
    }
};

// ২. মডাল ক্লোজ হবে
closeModalBtn.addEventListener("click", function () {
    modal.style.display = "none";
});

// ৩. মডালের ভেতরে যোগফল দেখাবে
invInputs.forEach(input => {
    input.addEventListener("input", function () {
        let total = 0;
        invInputs.forEach(inp => {
            total += Number(inp.value) || 0;
        });
        modalTotalAmount.value = total;
    });
});

// ৪. মডালের ভ্যালু মেইন ফর্মে সেভ হবে
saveChangesBtn.addEventListener("click", function () {
    mainInvestmentInput.value = modalTotalAmount.value;
    modal.style.display = "none";
    calculateTaxSystem(); // মেইন ক্যালকুলেশন আবার কল করা হলো
});