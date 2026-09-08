// Pure calculator logic (no DOM). Kept separate from event wiring below so it can be
// executed directly under Node for automated checks, not just reasoned about.

function initialState() {
  return {
    currentInput: '0',
    previousValue: null,
    operator: null,
    overwrite: true,
    error: false,
  };
}

function calculate(a, operator, b) {
  switch (operator) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '×':
      return a * b;
    case '÷':
      if (b === 0) return null; // signals division by zero to the caller
      return a / b;
    default:
      return b;
  }
}

// Display-only formatting: trims floating-point noise (e.g. 0.1 + 0.2) without touching
// the underlying calculation value, and never touches exact integers so large whole
// numbers are never unnecessarily altered.
function formatForDisplay(num) {
  if (!isFinite(num)) return String(num);
  if (Number.isInteger(num)) return String(num);
  const rounded = parseFloat(num.toPrecision(12));
  return String(rounded);
}

function inputDigit(state, digit) {
  if (state.overwrite) {
    return { ...state, currentInput: digit, overwrite: false, error: false };
  }
  if (state.currentInput === '0') {
    return { ...state, currentInput: digit };
  }
  return { ...state, currentInput: state.currentInput + digit };
}

function inputDecimal(state) {
  if (state.overwrite) {
    return { ...state, currentInput: '0.', overwrite: false, error: false };
  }
  if (state.currentInput.includes('.')) {
    return state; // ignore repeated decimal point within the same number
  }
  return { ...state, currentInput: state.currentInput + '.' };
}

function inputOperator(state, op) {
  const currentValue = state.error ? 0 : parseFloat(state.currentInput);

  // No operator pending yet, or an operator was chosen but no second operand typed yet:
  // just (re)select the operator, no calculation.
  if (state.operator === null || state.overwrite) {
    return {
      ...state,
      previousValue: state.operator === null ? currentValue : state.previousValue,
      operator: op,
      overwrite: true,
      error: false,
    };
  }

  // A second operand was entered: compute the intermediate result (enables chaining),
  // then store the newly chosen operator.
  const result = calculate(state.previousValue, state.operator, currentValue);
  if (result === null) {
    return {
      currentInput: 'Cannot divide by zero',
      previousValue: null,
      operator: null,
      overwrite: true,
      error: true,
    };
  }
  return {
    currentInput: formatForDisplay(result),
    previousValue: result,
    operator: op,
    overwrite: true,
    error: false,
  };
}

function inputEquals(state) {
  // Nothing pending, or an operator was chosen but no second operand typed yet: no-op.
  if (state.operator === null || state.overwrite) {
    return state;
  }
  const currentValue = parseFloat(state.currentInput);
  const result = calculate(state.previousValue, state.operator, currentValue);
  if (result === null) {
    return {
      currentInput: 'Cannot divide by zero',
      previousValue: null,
      operator: null,
      overwrite: true,
      error: true,
    };
  }
  return {
    currentInput: formatForDisplay(result),
    previousValue: null,
    operator: null,
    overwrite: true,
    error: false,
  };
}

function inputClear() {
  return initialState();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initialState,
    calculate,
    formatForDisplay,
    inputDigit,
    inputDecimal,
    inputOperator,
    inputEquals,
    inputClear,
  };
}

// DOM wiring - only runs in a browser.
if (typeof document !== 'undefined') {
  (function () {
    const display = document.getElementById('display');
    let state = initialState();

    function render() {
      display.textContent = state.currentInput;
    }

    document.querySelectorAll('[data-digit]').forEach((button) => {
      button.addEventListener('click', () => {
        state = inputDigit(state, button.getAttribute('data-digit'));
        render();
      });
    });

    document.querySelectorAll('[data-operator]').forEach((button) => {
      button.addEventListener('click', () => {
        state = inputOperator(state, button.getAttribute('data-operator'));
        render();
      });
    });

    document.getElementById('decimal').addEventListener('click', () => {
      state = inputDecimal(state);
      render();
    });

    document.getElementById('equals').addEventListener('click', () => {
      state = inputEquals(state);
      render();
    });

    document.getElementById('clear').addEventListener('click', () => {
      state = inputClear();
      render();
    });

    render();
  })();
}
