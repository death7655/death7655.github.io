/** * GLOBAL STATE 
 */
let calculationSteps = [];

/** * ALGORITHM LOGIC WITH STEP GENERATION
 */

function validateLuhn(digits) {
    calculationSteps = ["Stripping non-digits..."];
    const cleanDigits = digits.replace(/\D/g, "");
    if (cleanDigits.length < 1) return false;

    let sum = 0;
    let shouldDouble = false;
    let details = [];

    // Loop from right to left
    for (let i = cleanDigits.length - 1; i >= 0; i--) {
        let digit = parseInt(cleanDigits.charAt(i), 10);
        let original = digit;

        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
            details.push(`Double ${original}→${digit}`);
        } else {
            details.push(`Keep ${original}`);
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }

    calculationSteps.push("Process: Doubling every second digit from the right (subtracting 9 if > 9):");
    calculationSteps.push(`<span class="math-block">${details.reverse().join(", ")}</span>`);
    calculationSteps.push(`Final Sum: <span class="math-block">${sum}</span>`);
    calculationSteps.push(`Result: ${sum} % 10 = <span class="math-block">${sum % 10}</span> (0 is valid)`);

    return (sum % 10 === 0);
}

function validateISBN10(isbn) {
    calculationSteps = ["Formatting: Removing dashes and spaces..."];
    const cleanIsbn = isbn.replace(/[-\s]/g, "").toUpperCase(); 
    if (cleanIsbn.length !== 10) return false;

    let sum = 0;
    let mathString = "";
    
    // Multiply first 9 digits by weights 10 down to 2
    for (let i = 0; i < 9; i++) {
        let weight = 10 - i;
        let digit = parseInt(cleanIsbn[i]);
        if (isNaN(digit)) return false;
        sum += digit * weight;
        mathString += `(${digit}×${weight})`;
        if (i < 8) mathString += " + ";
    }

    // Handle Check Digit (10th digit)
    let last = cleanIsbn[9];
    let lastVal = (last === 'X') ? 10 : parseInt(last);
    sum += lastVal;
    mathString += ` + (${lastVal})`;

    calculationSteps.push("Formula: Sum of (Digit × Weight) where weight goes 10 to 2:");
    calculationSteps.push(`<span class="math-block">${mathString} = ${sum}</span>`);
    calculationSteps.push(`Result: ${sum} % 11 = <span class="math-block">${sum % 11}</span> (0 is valid)`);

    return (sum % 11 === 0);
}

function validateUPC(upc) {
    calculationSteps = ["Ensuring exactly 12 digits..."];
    const cleanUpc = upc.replace(/\D/g, "");
    if (cleanUpc.length !== 12) return false;

    let oddSum = 0;
    let evenSum = 0;

    for (let i = 0; i < 11; i++) {
        let digit = parseInt(cleanUpc[i], 10);
        // Odd positions (1st, 3rd, etc) are index 0, 2, 4...
        if (i % 2 === 0) oddSum += digit;
        else evenSum += digit;
    }

    let checkDigit = parseInt(cleanUpc[11], 10);
    let step1 = oddSum * 3;
    let total = step1 + evenSum + checkDigit;

    calculationSteps.push(`Step 1: Sum of odd positions × 3: <span class="math-block">${oddSum} × 3 = ${step1}</span>`);
    calculationSteps.push(`Step 2: Add even positions and check digit: <span class="math-block">${step1} + ${evenSum} + ${checkDigit} = ${total}</span>`);
    calculationSteps.push(`Result: ${total} % 10 = <span class="math-block">${total % 10}</span> (0 is valid)`);

    return (total % 10 === 0);
}

/** * UI HANDLING & FORMATTING
 */

function updateUI() {
    const type = document.getElementById('algoType').value;
    const preview = document.getElementById('visual-preview');
    const label = document.getElementById('preview-label');
    const input = document.getElementById('numberInput');
    const resultText = document.getElementById('result-text');
    const stepsContainer = document.getElementById('logic-steps');
    
    // Reset state
    preview.className = 'preview-box ' + type + '-mode';
    input.value = ''; 
    resultText.innerText = "Waiting for input...";
    resultText.style.color = "var(--text-sub)";
    preview.style.boxShadow = "var(--shadow)";
    if (stepsContainer) stepsContainer.style.display = "none";
    
    const config = {
        'luhn': { label: 'CREDIT CARD', placeholder: '0000 0000 0000 0000' },
        'isbn10': { label: 'ISBN-10', placeholder: '0-000-00000-0' },
        'upc': { label: 'UPC BARCODE', placeholder: '0 00000 00000 0' }
    };

    label.innerText = config[type].label;
    document.getElementById('preview-number').innerText = config[type].placeholder;
}

function syncPreview() {
    const inputField = document.getElementById('numberInput');
    const type = document.getElementById('algoType').value;
    let val = inputField.value;

    // Filter input characters based on algorithm
    if (type === 'isbn10') {
        val = val.replace(/[^0-9Xx]/g, ''); 
    } else {
        val = val.replace(/\D/g, '');
    }

    const display = document.getElementById('preview-number');
    let formatted = val;

    // Apply strict formatting and length limits
    if (val.length > 0) {
        if (type === 'luhn') {
            if (val.length > 16) val = val.slice(0, 16);
            const matches = val.match(/.{1,4}/g);
            formatted = matches ? matches.join(' ') : val;
        } else if (type === 'isbn10') {
            if (val.length > 10) val = val.slice(0, 10);
            let parts = [val.slice(0, 1), val.slice(1, 4), val.slice(4, 9), val.slice(9, 10)];
            formatted = parts.filter(p => p).join('-');
        } else if (type === 'upc') {
            if (val.length > 12) val = val.slice(0, 12);
            let parts = [val.slice(0, 1), val.slice(1, 6), val.slice(6, 11), val.slice(11, 12)];
            formatted = parts.filter(p => p).join(' ');
        }
    }

    inputField.value = val; // Force input field to stay clean

    const placeholders = {
        'luhn': '0000 0000 0000 0000',
        'isbn10': '0-000-00000-0',
        'upc': '0 00000 00000 0'
    };

    display.innerText = formatted || placeholders[type];
}

function checkNumber() {
    const type = document.getElementById('algoType').value;
    const input = document.getElementById('numberInput').value;
    const resultText = document.getElementById('result-text');
    const preview = document.getElementById('visual-preview');
    const stepsContainer = document.getElementById('logic-steps');
    const stepsContent = document.getElementById('steps-content');
    
    if (!input) {
        resultText.innerText = "Please enter a number.";
        resultText.style.color = "#dc2626";
        if (stepsContainer) stepsContainer.style.display = "none";
        return;
    }

    let isValid = false;
    calculationSteps = []; 

    // Route to correct validation function
    if (type === "luhn") isValid = validateLuhn(input);
    else if (type === "isbn10") isValid = validateISBN10(input);
    else if (type === "upc") isValid = validateUPC(input);

    // Update Result UI
    resultText.innerText = isValid ? `✓ Valid ${type.toUpperCase()}` : "✕ Invalid Checksum";
    resultText.style.color = isValid ? "#059669" : "#dc2626";
    
    // Visual Feedback
    preview.style.boxShadow = isValid 
        ? "0 0 30px rgba(5, 150, 105, 0.3)" 
        : "0 0 30px rgba(220, 38, 38, 0.2)";

    // Inject and Show Steps
    if (stepsContainer && stepsContent) {
        stepsContainer.style.display = "block";
        stepsContent.innerHTML = calculationSteps
            .map(step => `<div class="step-item">${step}</div>`)
            .join("");
    }
}
