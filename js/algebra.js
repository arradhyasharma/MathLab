
/* =================================
   MATHLAB — ALGEBRA LAB
================================= */


/* ---------- HELPER FUNCTIONS ---------- */

function getNumber(id) {
  const input = document.getElementById(id);

  if (!input || input.value.trim() === "") return null;

  const value = Number(input.value);
  return Number.isFinite(value) ? value : null;
}

function formatNumber(number) {
  if (Math.abs(number) < 0.000000001) return "0";
  return Number(number.toFixed(6)).toString();
}

function showError(element, message) {
  element.replaceChildren();

  const error = document.createElement("p");
  error.className = "result-detail";
  error.textContent = message;

  element.append(error);
}

function makeButton(label, className, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

/* Shows calculation steps progressively. */
function renderSteps(element, title, answer, steps, detail) {
  element.replaceChildren();

  const heading = document.createElement("p");
  heading.className = "result-title";
  heading.textContent = title;

  const finalAnswer = document.createElement("p");
  finalAnswer.className = "result-main";
  finalAnswer.textContent = answer;

  const list = document.createElement("ol");
  list.className = "step-list";

  const stepElements = steps.map((step, index) => {
    const item = document.createElement("li");
    item.className = "step-item";
    item.hidden = true;

    const number = document.createElement("span");
    number.className = "step-number";
    number.textContent = `STEP ${index + 1}`;

    const content = document.createElement("span");
    content.className = "step-content";
    content.textContent = step;

    item.append(number, content);
    list.append(item);

    return item;
  });

  const controls = document.createElement("div");
  controls.className = "step-controls";

  let visibleCount = 0;

  const nextButton = makeButton(
    "Show Next Step",
    "step-button",
    () => {
      if (visibleCount < stepElements.length) {
        stepElements[visibleCount].hidden = false;
        visibleCount++;
      }

      if (visibleCount >= stepElements.length) {
        nextButton.disabled = true;
        nextButton.textContent = "All Steps Shown";
      }
    }
  );

  const allButton = makeButton(
    "Show All Steps",
    "step-button step-button-secondary",
    () => {
      stepElements.forEach(item => item.hidden = false);
      visibleCount = stepElements.length;
      nextButton.disabled = true;
      nextButton.textContent = "All Steps Shown";
    }
  );

  controls.append(nextButton, allButton);

  const explanation = document.createElement("p");
  explanation.className = "verification-note";
  explanation.textContent = detail;

  element.append(heading, finalAnswer, list, controls, explanation);
}


/* ---------- POLYNOMIAL EXPLORER ---------- */

const polynomialInputs = [
  "coefficientA",
  "coefficientB",
  "coefficientC",
  "inputX"
];

const polynomialPreview =
  document.getElementById("polynomialPreview");

const polynomialResult =
  document.getElementById("polynomialResult");


function createPolynomial(a, b, c) {
  const terms = [];

  function addTerm(coefficient, variable) {
    if (coefficient === 0) return;

    const absoluteValue = Math.abs(coefficient);
    const coefficientText =
      variable && absoluteValue === 1
        ? ""
        : formatNumber(absoluteValue);

    const term = coefficientText + variable;

    if (terms.length === 0) {
      terms.push(coefficient < 0 ? "-" + term : term);
    } else {
      terms.push(
        (coefficient < 0 ? " − " : " + ") + term
      );
    }
  }

  addTerm(a, "x²");
  addTerm(b, "x");
  addTerm(c, "");

  return terms.length ? terms.join("") : "0";
}


function updatePolynomialPreview() {
  const a = getNumber("coefficientA");
  const b = getNumber("coefficientB");
  const c = getNumber("coefficientC");

  if (a === null || b === null || c === null) {
    polynomialPreview.textContent = "Enter all coefficients";
    return;
  }

  polynomialPreview.textContent =
    "f(x) = " + createPolynomial(a, b, c);
}


/* Calculate f(x) with steps. */
function calculatePolynomial() {
  const a = getNumber("coefficientA");
  const b = getNumber("coefficientB");
  const c = getNumber("coefficientC");
  const x = getNumber("inputX");

  if ([a, b, c, x].some(value => value === null)) {
    showError(polynomialResult, "Please enter a valid number in every field.");
    return;
  }

  const square = x * x;
  const first = a * square;
  const second = b * x;
  const value = first + second + c;

  const steps = [
    `Start with f(x) = ${createPolynomial(a, b, c)}.`,
    `Substitute x = ${formatNumber(x)}: f(${formatNumber(x)}) = (${formatNumber(a)}) × (${formatNumber(x)})² + (${formatNumber(b)}) × (${formatNumber(x)}) + (${formatNumber(c)}).`,
    `Calculate the power: (${formatNumber(x)})² = ${formatNumber(square)}.`,
    `Multiply: (${formatNumber(a)}) × ${formatNumber(square)} = ${formatNumber(first)}, and (${formatNumber(b)}) × (${formatNumber(x)}) = ${formatNumber(second)}.`,
    `Add the terms: ${formatNumber(first)} + ${formatNumber(second)} + ${formatNumber(c)} = ${formatNumber(value)}.`
  ];

  const degree = a !== 0 ? 2 : b !== 0 ? 1 : c !== 0 ? 0 : "undefined (zero polynomial)";

  const detail = value === 0
    ? `${formatNumber(x)} is a zero of this polynomial. Degree: ${degree}.`
    : `${formatNumber(x)} is not a zero of this polynomial. Degree: ${degree}.`;

  renderSteps(
    polynomialResult,
    "POLYNOMIAL CALCULATION",
    `f(${formatNumber(x)}) = ${formatNumber(value)}`,
    steps,
    detail
  );
}


/* Find roots of ax² + bx + c = 0. */
function findPolynomialRoots() {
  const a = getNumber("coefficientA");
  const b = getNumber("coefficientB");
  const c = getNumber("coefficientC");

  if ([a, b, c].some(value => value === null)) {
    showError(polynomialResult, "Please enter all three coefficients.");
    return;
  }

  /* If a = 0, the equation is linear. */
  if (a === 0) {
    if (b === 0) {
      const isTrue = c === 0;

      renderSteps(
        polynomialResult,
        "SPECIAL CASE",
        isTrue ? "Every real number is a solution" : "No solution",
        [
          `The equation becomes ${formatNumber(c)} = 0.`,
          isTrue
            ? "This statement is true for every value of x."
            : "This statement is false, so no value of x can satisfy it."
        ],
        "The coefficient of x² and x is zero."
      );
      return;
    }

    const root = -c / b;

    renderSteps(
      polynomialResult,
      "LINEAR EQUATION ROOT",
      `x = ${formatNumber(root)}`,
      [
        `Start with ${formatNumber(b)}x + (${formatNumber(c)}) = 0.`,
        `Subtract ${formatNumber(c)} from both sides: ${formatNumber(b)}x = ${formatNumber(-c)}.`,
        `Divide both sides by ${formatNumber(b)}.`,
        `Therefore, x = ${formatNumber(root)}.`,
        `Verification: ${formatNumber(b)} × (${formatNumber(root)}) + (${formatNumber(c)}) = 0.`
      ],
      "This is a linear equation because the x² coefficient is zero."
    );
    return;
  }

  const discriminant = b * b - 4 * a * c;

  const steps = [
    `Start with ${createPolynomial(a, b, c)} = 0.`,
    `Use the discriminant formula: D = b² − 4ac.`,
    `Substitute: D = (${formatNumber(b)})² − 4 × (${formatNumber(a)}) × (${formatNumber(c)}).`,
    `Calculate: D = ${formatNumber(discriminant)}.`
  ];

  if (discriminant < 0) {
    renderSteps(
      polynomialResult,
      "NO REAL ROOTS",
      "No real value of x",
      steps.concat([
        "The discriminant is negative.",
        "A negative discriminant means the equation has no real roots."
      ]),
      "This result concerns real-number solutions. Complex roots are outside this lab's current scope."
    );
    return;
  }

  if (discriminant === 0) {
    const root = -b / (2 * a);

    renderSteps(
      polynomialResult,
      "ONE REPEATED ROOT",
      `x = ${formatNumber(root)}`,
      steps.concat([
        "Since D = 0, the equation has two equal roots.",
        `Use x = −b / 2a = ${formatNumber(root)}.`,
        `Verification: ${formatNumber(a)}(${formatNumber(root)})² + (${formatNumber(b)})(${formatNumber(root)}) + (${formatNumber(c)}) = 0.`
      ]),
      "A zero discriminant means the quadratic has one repeated real root."
    );
    return;
  }

  const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
  const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);

  renderSteps(
    polynomialResult,
    "TWO REAL ROOTS FOUND",
    `x₁ = ${formatNumber(root1)}   |   x₂ = ${formatNumber(root2)}`,
    steps.concat([
      "Since D is positive, there are two different real roots.",
      `Use x = (−b + √D) / 2a. First root: x₁ = ${formatNumber(root1)}.`,
      `Use x = (−b − √D) / 2a. Second root: x₂ = ${formatNumber(root2)}.`,
      `Verification: substituting either root into the original polynomial gives approximately zero (rounding may affect the displayed result).`
    ]),
    "Both roots are calculated using the quadratic formula."
  );
}


/* Create the new polynomial button. */
const calculateButton =
  document.getElementById("calculatePolynomial");

const polynomialStepsButton = makeButton(
  "Show Step-by-Step",
  "step-button",
  calculatePolynomial
);

const rootsButton = makeButton(
  "Find Value(s) of x",
  "step-button",
  findPolynomialRoots
);

calculateButton.insertAdjacentElement(
  "afterend",
  polynomialStepsButton
);

polynomialStepsButton.insertAdjacentElement(
  "afterend",
  rootsButton
);


calculateButton.addEventListener("click", calculatePolynomial);

polynomialInputs.forEach(id => {
  document.getElementById(id).addEventListener(
    "input",
    updatePolynomialPreview
  );
});

document
  .getElementById("resetPolynomial")
  .addEventListener("click", () => {
    document.getElementById("coefficientA").value = 1;
    document.getElementById("coefficientB").value = -5;
    document.getElementById("coefficientC").value = 6;
    document.getElementById("inputX").value = 2;

    updatePolynomialPreview();

    polynomialResult.textContent =
      "Your calculation will appear here.";
  });


/* ---------- LINEAR EQUATION SOLVER ---------- */

const equationResult =
  document.getElementById("equationResult");


function solveEquation() {
  const a = getNumber("equationA");
  const b = getNumber("equationB");
  const c = getNumber("equationC");

  if ([a, b, c].some(value => value === null)) {
    showError(equationResult, "Please enter a valid number in every field.");
    return;
  }

  if (a === 0) {
    const isTrue = b === c;

    renderSteps(
      equationResult,
      "SPECIAL CASE",
      isTrue ? "Infinitely many solutions" : "No solution",
      [
        `The equation becomes ${formatNumber(b)} = ${formatNumber(c)}.`,
        isTrue
          ? "Both sides are equal, so the equation is true for every value of x."
          : "The two sides are not equal, so there is no solution."
      ],
      "The coefficient of x is zero, so division by a is not possible."
    );
    return;
  }

  const rightSide = c - b;
  const x = rightSide / a;

  const steps = [
    `Start with ${formatNumber(a)}x + (${formatNumber(b)}) = ${formatNumber(c)}.`,
    `Subtract ${formatNumber(b)} from both sides: ${formatNumber(a)}x = ${formatNumber(c)} − (${formatNumber(b)}).`,
    `Simplify: ${formatNumber(a)}x = ${formatNumber(rightSide)}.`,
    `Divide both sides by ${formatNumber(a)}.`,
    `Therefore, x = ${formatNumber(x)}.`,
    `Verification: ${formatNumber(a)} × (${formatNumber(x)}) + (${formatNumber(b)}) = ${formatNumber(a * x + b)}, which equals ${formatNumber(c)}.`
  ];

  renderSteps(
    equationResult,
    "SOLUTION FOUND",
    `x = ${formatNumber(x)}`,
    steps,
    "The value is verified by substituting it into the original equation."
  );
}


/* Add a separate step-by-step button. */
const solveButton =
  document.getElementById("solveEquation");

const equationStepsButton = makeButton(
  "Show Step-by-Step",
  "step-button",
  solveEquation
);

solveButton.insertAdjacentElement("afterend", equationStepsButton);

solveButton.addEventListener("click", solveEquation);


document
  .getElementById("resetEquation")
  .addEventListener("click", () => {
    document.getElementById("equationA").value = 3;
    document.getElementById("equationB").value = 5;
    document.getElementById("equationC").value = 20;

    equationResult.textContent =
      "The solution and working will appear here.";
  });
      
