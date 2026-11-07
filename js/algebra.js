/* =================================
   MATHLAB — ALGEBRA LAB
================================= */


/* ---------- HELPER FUNCTIONS ---------- */

function getNumber(id) {
  const input = document.getElementById(id);

  if (!input || input.value.trim() === "") {
    return null;
  }

  const value = Number(input.value);

  return Number.isFinite(value) ? value : null;
}


function formatNumber(number) {
  if (Math.abs(number) < 0.000000001) {
    return "0";
  }

  return Number(number.toFixed(6)).toString();
}


function showMessage(element, title, main, detail) {
  element.replaceChildren();

  const heading = document.createElement("p");
  heading.className = "result-title";
  heading.textContent = title;

  const result = document.createElement("p");
  result.className = "result-main";
  result.textContent = main;

  const explanation = document.createElement("p");
  explanation.className = "result-detail";
  explanation.textContent = detail;

  element.append(heading, result, explanation);
}


function showError(element, message) {
  element.replaceChildren();

  const error = document.createElement("p");
  error.className = "result-detail";
  error.textContent = message;

  element.append(error);
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

    let term = "";

    if (variable === "") {
      term = formatNumber(absoluteValue);
    } else {
      term = (absoluteValue === 1 ? "" : formatNumber(absoluteValue))
        + variable;
    }

    if (terms.length === 0) {
      terms.push(coefficient < 0 ? "-" + term : term);
    } else {
      terms.push((coefficient < 0 ? " − " : " + ") + term);
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


function calculatePolynomial() {
  const a = getNumber("coefficientA");
  const b = getNumber("coefficientB");
  const c = getNumber("coefficientC");
  const x = getNumber("inputX");

  if ([a, b, c, x].some(value => value === null)) {
    showError(
      polynomialResult,
      "Please enter a valid number in every field."
    );
    return;
  }

  const value = a * x * x + b * x + c;

  let degree;

  if (a !== 0) {
    degree = 2;
  } else if (b !== 0) {
    degree = 1;
  } else if (c !== 0) {
    degree = 0;
  } else {
    degree = "Undefined for the zero polynomial";
  }

  let zeroMessage;

  if (value === 0) {
    zeroMessage = `${formatNumber(x)} is a zero of this polynomial.`;
  } else {
    zeroMessage = `${formatNumber(x)} is not a zero of this polynomial.`;
  }

  showMessage(
    polynomialResult,
    "CALCULATION COMPLETE",
    `f(${formatNumber(x)}) = ${formatNumber(value)}`,
    `Degree: ${degree}. ${zeroMessage}`
  );
}


document
  .getElementById("calculatePolynomial")
  .addEventListener("click", calculatePolynomial);


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

    polynomialResult.innerHTML =
      '<span class="result-placeholder">Your calculation will appear here.</span>';
  });


/* ---------- LINEAR EQUATION SOLVER ---------- */

const equationResult =
  document.getElementById("equationResult");


function solveEquation() {
  const a = getNumber("equationA");
  const b = getNumber("equationB");
  const c = getNumber("equationC");

  if ([a, b, c].some(value => value === null)) {
    showError(
      equationResult,
      "Please enter a valid number in every field."
    );
    return;
  }

  const rightSide = c - b;

  // Case 1: coefficient of x is zero.
  if (a === 0) {

    if (b === c) {
      showMessage(
        equationResult,
        "SPECIAL CASE",
        "Infinitely many solutions",
        "The equation becomes " + formatNumber(b) +
        " = " + formatNumber(c) +
        ". This statement is always true."
      );
    } else {
      showMessage(
        equationResult,
        "SPECIAL CASE",
        "No solution",
        "The equation becomes " + formatNumber(b) +
        " = " + formatNumber(c) +
        ". This statement is false."
      );
    }

    return;
  }

  const x = rightSide / a;

  equationResult.replaceChildren();

  const heading = document.createElement("p");
  heading.className = "result-title";
  heading.textContent = "SOLUTION FOUND";

  const answer = document.createElement("p");
  answer.className = "result-main";
  answer.textContent = `x = ${formatNumber(x)}`;

  const steps = document.createElement("ol");
  steps.className = "result-steps";

  const step1 = document.createElement("li");
  step1.textContent =
    `Start with ${formatNumber(a)}x + ${formatNumber(b)} = ${formatNumber(c)}.`;

  const step2 = document.createElement("li");
  step2.textContent =
    `Subtract ${formatNumber(b)} from both sides: ${formatNumber(a)}x = ${formatNumber(rightSide)}.`;

  const step3 = document.createElement("li");
  step3.textContent =
    `Divide both sides by ${formatNumber(a)}.`;

  const step4 = document.createElement("li");
  step4.textContent =
    `Therefore, x = ${formatNumber(x)}.`;

  steps.append(step1, step2, step3, step4);

  equationResult.append(heading, answer, steps);
}


document
  .getElementById("solveEquation")
  .addEventListener("click", solveEquation);


document
  .getElementById("resetEquation")
  .addEventListener("click", () => {
    document.getElementById("equationA").value = 3;
    document.getElementById("equationB").value = 5;
    document.getElementById("equationC").value = 20;

    equationResult.innerHTML =
      '<span class="result-placeholder">The solution and working will appear here.</span>';
  });
