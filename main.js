/** * ALGORITHM LOGIC
 */

function validateISBN10(isbn) {
    // Remove dashes and spaces
    const cleanIsbn = isbn.replace(/[-\s]/g, ""); 
    if (cleanIsbn.length !== 10) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
        let digit = parseInt(cleanIsbn[i]);
        if (isNaN(digit)) return false;
        sum += digit * (10 - i);
    }

    // Handle the 'X' check digit
    let last = cleanIsbn[9].toUpperCase();
    sum += (last === 'X') ? 10 : parseInt(last);

    return (sum % 11 === 0);
}

function validateLuhn(digits) {
    const cleanDigits = digits.replace(/\D/g, "");
    if (cleanDigits.length < 1) return false;

    let sum = 0;
    let shouldDouble = false;

    for (let i = cleanDigits.length - 1; i >= 0; i--) {
        let digit = parseInt(cleanDigits.charAt(i), 10);

        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }

    return (sum % 10 === 0);
}

function validateUPC(upc) {
    const cleanUpc = upc.replace(/\D/g, "");
    if (cleanUpc.length !== 12) return false;

    let oddSum = 0;
    let evenSum = 0;

    for (let i = 0; i < 11; i++) {
        let digit = parseInt(cleanUpc[i], 10);
        // UPC uses 1-based indexing for logic: 
        // Odd positions (1,3,5...) are indices 0,2,4...
        if (i % 2 === 0) {
            oddSum += digit;
        } else {
            evenSum += digit;
        }
    }
    let total = (oddSum * 3) + evenSum + parseInt(cleanUpc[11], 10);
    return (total % 10 === 0);
}

/** * UI HANDLING
 */

function updateUI() {
    const type = document.getElementById('algoType').value;
    const preview = document.getElementById('visual-preview');
    const label = document.getElementById('preview-label');
    const input = document.getElementById('numberInput');
    const resultText = document.getElementById('result-text');
    
    // Reset classes and state
    preview.className = 'preview-box ' + type + '-mode';
    input.value = ''; 
    resultText.innerText = "Waiting for input...";
    resultText.style.color = "var(--text-sub)";
    
    // Update labels and placeholders based on selection
    const config = {
        'luhn': { label: 'CREDIT CARD', placeholder: '#### #### #### ####' },
        'isbn10': { label: 'BOOK (ISBN-10)', placeholder: '0-000-00000-0' },
        'upc': { label: 'PRODUCT BARCODE', placeholder: '0 00000 00000 0' }
    };

    label.innerText = config[type].label;
    document.getElementById('preview-number').innerText = config[type].placeholder;
}

function syncPreview() {
    const inputField = document.getElementById('numberInput');
    let val = inputField.value;
    const type = document.getElementById('algoType').value;

    // Allow 'X' only for ISBN mode
    if (type === 'isbn10') {
        val = val.replace(/[^0-9Xx]/g, ''); 
    } else {
        val = val.replace(/\D/g, '');
    }
    const display = document.getElementById('preview-number');

    let formatted = val;

    if (val.length > 0) {
        if (type === 'luhn') {
            if (val.length > 16)
            {
                return;
            }
            formatted = val.match(/.{1,4}/g).join(' ');
        } else if (type === 'isbn10') {
            if (val.length > 10)
            {
                return;
            }
            let parts = [val.slice(0, 1), val.slice(1, 4), val.slice(4, 9), val.slice(9, 10)];
            formatted = parts.filter(p => p).join('-');
        } else if (type === 'upc') {
            if (val.length > 12)
            {
                return;
            }
            let parts = [val.slice(0, 1), val.slice(1, 6), val.slice(6, 11), val.slice(11, 12)];
            formatted = parts.filter(p => p).join(' ');
        }
    }

    // Default placeholders if input is empty
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
    
    if (!input) {
        resultText.innerText = "Please enter a number.";
        resultText.style.color = "#dc2626";
        return;
    }

    let isValid = false;

    // Execute the correct algorithm
    switch(type) {
        case "luhn":
            isValid = validateLuhn(input);
            break;
        case "isbn10":
            isValid = validateISBN10(input);
            break;
        case "upc":
            isValid = validateUPC(input);
            break;
    }

    // Update Result UI
    if (isValid) {
        resultText.innerText = "✓ Valid " + type.toUpperCase();
        resultText.style.color = "#059669";
        preview.style.boxShadow = "0 0 20px rgba(5, 150, 105, 0.4)";
    } else {
        resultText.innerText = "✕ Invalid Checksum";
        resultText.style.color = "#dc2626";
        preview.style.boxShadow = "0 0 20px rgba(220, 38, 38, 0.2)";
    }
}