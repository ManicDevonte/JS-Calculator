let lastValue = null;
let lastOperator = null;
let repeatMode = false; 
let openParensCount = 0;

// Refrence display element
const display = document.getElementById('display');

// Track if we have performed a calculation
let justCalculated = false;

function isOperator(char) {
    return ['+', '-', '*', '/'].includes(char);
}

function getLastChar() {
    return display.value.slice(-1);
}

function safeEval(expression) {
    try {
        let jsExpression = expression
            .replace(/x/g, '*')
            .replace(/÷/g, '/');

        if (!/^[0-9+\-*/.() ]+$/.test(jsExpression)){
            throw new Error('Invalid characters in expression');
        }

        const result = Function(' "use strict"; return (' + jsExpression + ')')();

        if (!isFinite(result)) {
            throw new Error('Invalid calculation result');
        }

        return result;
    } catch (error) {
        console.error('Calcualtion error:', error);
        return 'Error';
    }
}

function appendToDisplay(value) {
    console.log('Button pressed:', value);

    let currentValue = display.value;
    let lastChar = currentValue.slice(-1);

    // If a number is entered after a calculation, start fresh
    if (justCalculated && !isNaN(value)) {
        display.value = value;
        justCalculated = false;
        return;
    }

    // Allow chaining after calculation (e.g., result + ...)
    if (justCalculated && isOperator(value)) {
        display.value = currentValue + value;
        justCalculated = false;
        return;
    }

    // Handle operators
    if (isOperator(value)) {
        // Don't allow operator first (except minus)
        if (currentValue === '0' && value !== '-') return;

        // Replace the last operator if already present
        if (isOperator(lastChar)) {
            display.value = currentValue.slice(0, -1) + value;
        } else {
            display.value = currentValue + value;
        }

    } else if (!isNaN(value)) {
        // Handle numbers
        if (currentValue === '0') {
            display.value = value;
        } else {
            display.value = currentValue + value;
        }

    } else if (value === '.') {
        // Handle decimals only if not already in current number
        let parts = currentValue.split(/[\+\-\*÷]/);
        let lastNumber = parts[parts.length - 1];
        if (!lastNumber.includes('.')) {
            display.value = currentValue + value;
        }

    } else if (value === '(' && (/\d|\)/.test(lastChar))) {
        // Implicit multiplication: e.g., 2(3+1) → 2*(3+1)
        display.value = currentValue + '*' + value;

    } else {
        display.value = currentValue + value;
    }

    justCalculated = false;
    console.log('Display updated to: ', display.value);
}

function clearDisplay() {
    console.log('Clear button pressed.');

    display.value = '0';
    justCalculated = false;

    display.style.backgroundColor = '#f0f0f0';
    setTimeout(() => {
        display.style.backgroundColor = '';
    }, 150);

}

function deleteLast() {
    console.log('Backspace button pressed.');

    let currentValue = display.value;

    // If theres only one character or its 0, reset to 0
    if (currentValue.length <= 1 || currentValue === '0') {
        display.value = '0';
    } else {
        display.value = currentValue.slice(0, -1);
    }
}

function percent() {
    const display = document.getElementById("display");
    let currentValue = parseFloat(display.value);
    if (!isNaN(currentValue)) {
        display.value = currentValue / 100;
    }
}

function negativeSign() {
    const display = document.getElementById("display");
    let currentValue = parseFloat(display.value);
    if (!isNaN(currentValue)) {
        display.value = currentValue * -1;
    }
}


function squareRoot() {
    const display = document.getElementById("display");
    let currentValue = parseFloat(display.value);
    if (!isNaN(currentValue)) {
        display.value = Math.sqrt(currentValue);
    }
}

function NumberSqured() {
    const display = document.getElementById("display");
    let currentValue = parseFloat(display.value);
    if (!isNaN(currentValue)) {
        display.value = Math.pow(currentValue, 2);
    }
}

function calculate() {
    const display = document.getElementById("display");
    let currentValue = display.value;

    if (!repeatMode) {
        // First press: evaluate normally and store last operator/value
        let expression = currentValue.replace(/÷/g, '/');
        try {
            let result = eval(expression);
            display.value = result;

            // Extract last operator and value
            const match = currentValue.match(/([-+*/÷])\s*([\d.]+)$/);
            if (match) {
                lastOperator = match[1] === '÷' ? '/' : match[1];
                lastValue = parseFloat(match[2]);
            }
            repeatMode = true;
        } catch {
            display.value = 'Error';
        }
    } else {
        // Second+ press: repeat last operation with result
        try {
            let newExpression = display.value + lastOperator + lastValue;
            let result = eval(newExpression);
            display.value = result;
        } catch {
            display.value = 'Error';
        }
    }
}

document.addEventListener('keydown', function(event) {
    console.log('Key pressed', event.key);

    if (event.key >= '0' && event.key <= '9') {
        appendToDisplay(event.key);
    } else if (event.key === '.') {
        appendToDisplay('.');
    } else if (event.key === '+') {
        appendToDisplay('+');
    } else if (event.key === '-') {
        appendToDisplay('-');
    } else if (event.key === '*') {
        appendToDisplay('*');
    } else if (event.key === '/') {
        event.preventDefault();
        appendToDisplay('/');
    }

    else if (event.key === 'Enter' || event.key === '=') {
        calculate();
    } else if (event.key === 'Escape' || event.key === 'c' || event.key === 'C') {
        clearDisplay();
    } else if (event.key === 'Backspace') {
        deleteLast();
    }
})

document.addEventListener('DOMContentLoaded', function() {
    console.log('Calculator loaded successfully');
    console.log('Display element', display);

    if (display) {
        console.log('Current display value: ', display.value);
    } else {
        console.log('Display element not found');
    }
})