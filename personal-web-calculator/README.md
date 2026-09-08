# Personal Web Calculator

A simple web-based calculator implementing the requirements in `BRD.md`: addition, subtraction,
multiplication, division, decimal entry, chained calculations, clear/reset, and safe
divide-by-zero handling.

## How to run

No build step or server required.

1. Open `index.html` directly in any web browser (double-click the file, or right-click →
   "Open with" your browser).
2. Use the on-screen buttons to enter numbers, choose an operation, and press `=` for the result.
3. Press `C` at any time to clear and start over.

## Files

| File | Purpose |
|---|---|
| `index.html` | Calculator markup: display and button grid |
| `style.css` | Visual layout/styling |
| `script.js` | Calculator logic (number entry, arithmetic, chaining, clear, divide-by-zero handling) and the code that wires it up to the buttons |

## What was checked

The core calculator logic in `script.js` is written as plain functions kept separate from the
button/DOM wiring, so it can be run directly with Node (without a browser) for real executed
checks. All of the following were executed and passed (`node` run against the actual
`script.js` logic):

- `2 + 3 = 5`, `10 - 4 = 6`, `5 × 6 = 30`, `20 ÷ 4 = 5`
- Decimal math (`0.1 + 0.2` displays as `0.3`, not floating-point noise) and a large whole-number
  result (`100000 × 100000 = 10000000000`) displaying unaltered
- Zero as an operand (`0 + 5 = 5`) and the initial display showing `0`
- Chained calculations (`5 + 3 = 8`, then `× 2 = 16`)
- Clear mid-calculation, followed by a normal new calculation
- Division by zero (`5 ÷ 0`) shows a clear message and does not crash, and the calculator works
  again both after pressing Clear and after simply typing a new digit
- Decimal pressed right after an operator or a result starts the new number as `0.`; a second
  decimal press within the same number is ignored
- `=` does nothing with no operator pending or before a second number is entered; pressing `=`
  again after a completed calculation leaves the result unchanged
- Changing the operator before typing the second number replaces the pending operator

**Not covered by the executed checks above (needs a manual browser check):** actual mouse-click
handling, on-screen rendering/layout, and general browser behavior. These were not run in this
environment and should be verified by hand in a browser before submission.
