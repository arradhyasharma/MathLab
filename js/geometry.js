
/* =================================
   MATHLAB — GEOMETRY LAB
================================= */


/* ---------- HELPERS ---------- */

function geometryNumber(id) {
  const input = document.getElementById(id);

  if (!input || input.value.trim() === "") return null;

  const value = Number(input.value);
  return Number.isFinite(value) ? value : null;
}

function geometryFormat(number) {
  if (Math.abs(number) < 0.000000001) return "0";
  return Number(number.toFixed(6)).toString();
}

function geometryError(element, message) {
  element.replaceChildren();

  const error = document.createElement("p");
  error.className = "result-detail";
  error.textContent = message;

  element.append(error);
}

function geometryButton(label, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "step-button";
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}


/* ---------- STEP-BY-STEP DISPLAY ---------- */

function geometryShowSteps(element, title, answer, steps, note) {
  element.replaceChildren();

  const heading = document.createElement("p");
  heading.className = "result-title";
  heading.textContent = title;

  const result = document.createElement("p");
  result.className = "result-main";
  result.textContent = answer;

  const list = document.createElement("ol");
  list.className = "step-list";

  const items = steps.map((step, index) => {
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

  let shown = 0;

  const next = geometryButton("Show Next Step", () => {
    if (shown < items.length) {
      items[shown].hidden = false;
      shown++;
    }

    if (shown === items.length) {
      next.disabled = true;
      next.textContent = "All Steps Shown";
    }
  });

  const all = geometryButton("Show All Steps", () => {
    items.forEach(item => item.hidden = false);
    shown = items.length;
    next.disabled = true;
    next.textContent = "All Steps Shown";
  });

  controls.append(next, all);

  const explanation = document.createElement("p");
  explanation.className = "verification-note";
  explanation.textContent = note;

  element.append(heading, result, list, controls, explanation);
}


/* ---------- EXPERIMENT 01: TRIANGLE ANGLES ---------- */

const angleResult = document.getElementById("angleResult");

function checkTriangleAngles() {
  const a = geometryNumber("angleA");
  const b = geometryNumber("angleB");
  const c = geometryNumber("angleC");

  if ([a, b, c].some(value => value === null)) {
    geometryError(angleResult, "Please enter all three angles.");
    return;
  }

  if ([a, b, c].some(value => value <= 0 || value >= 180)) {
    geometryError(
      angleResult,
      "Each interior angle must be greater than 0° and less than 180°."
    );
    return;
  }

  const total = a + b + c;

  const steps = [
    `Start with angle A = ${geometryFormat(a)}°, angle B = ${geometryFormat(b)}° and angle C = ${geometryFormat(c)}°.`,
    "Use the triangle angle-sum property: A + B + C = 180°.",
    `Substitute the values: ${geometryFormat(a)}° + ${geometryFormat(b)}° + ${geometryFormat(c)}°.`,
    `Add the angles: ${geometryFormat(total)}°.`
  ];

  if (Math.abs(total - 180) < 0.000001) {
    geometryShowSteps(
      angleResult,
      "VALID TRIANGLE",
      "The three angles form a triangle.",
      steps.concat([
        "The sum is exactly 180°, so the angle-sum property is satisfied."
      ]),
      "A triangle's interior angles always add up to 180°."
    );
  } else {
    geometryShowSteps(
      angleResult,
      "NOT A VALID TRIANGLE",
      `Angle sum = ${geometryFormat(total)}°`,
      steps.concat([
        `The total differs from 180° by ${geometryFormat(Math.abs(180 - total))}°.`,
        "These three angles cannot be the interior angles of a triangle."
      ]),
      "For a valid triangle, the sum must be exactly 180°."
    );
  }
}

document
  .getElementById("checkAngles")
  .addEventListener("click", checkTriangleAngles);

document
  .getElementById("resetAngles")
  .addEventListener("click", () => {
    document.getElementById("angleA").value = 60;
    document.getElementById("angleB").value = 60;
    document.getElementById("angleC").value = 60;
    angleResult.textContent = "Your angle analysis will appear here.";
  });


/* ---------- EXPERIMENT 02: TRIANGLE CALCULATOR ---------- */

const triangleResult =
  document.getElementById("triangleResult");

function calculateTriangle() {
  const base = geometryNumber("triangleBase");
  const height = geometryNumber("triangleHeight");
  const a = geometryNumber("sideA");
  const b = geometryNumber("sideB");
  const c = geometryNumber("sideC");

  if ([base, height, a, b, c].some(value => value === null)) {
    geometryError(
      triangleResult,
      "Please enter a valid number in every field."
    );
    return;
  }

  if ([base, height, a, b, c].some(value => value <= 0)) {
    geometryError(
      triangleResult,
      "All lengths must be greater than zero."
    );
    return;
  }

  if (a + b <= c || a + c <= b || b + c <= a) {
    geometryError(
      triangleResult,
      "These three side lengths cannot form a triangle. The sum of any two sides must be greater than the third side."
    );
    return;
  }

  const area = 0.5 * base * height;
  const perimeter = a + b + c;

  const steps = [
    `Base = ${geometryFormat(base)} units and perpendicular height = ${geometryFormat(height)} units.`,
    "Use the area formula: Area = ½ × base × height.",
    `Substitute: Area = ½ × ${geometryFormat(base)} × ${geometryFormat(height)}.`,
    `Area = ${geometryFormat(area)} square units.`,
    `For perimeter, add all three sides: ${geometryFormat(a)} + ${geometryFormat(b)} + ${geometryFormat(c)}.`,
    `Perimeter = ${geometryFormat(perimeter)} units.`
  ];

  geometryShowSteps(
    triangleResult,
    "TRIANGLE CALCULATION",
    `Area = ${geometryFormat(area)} square units | Perimeter = ${geometryFormat(perimeter)} units`,
    steps,
    "The side lengths satisfy the triangle inequality. Area uses the perpendicular height, not necessarily one of the side lengths."
  );
}

document
  .getElementById("calculateTriangle")
  .addEventListener("click", calculateTriangle);

document
  .getElementById("resetTriangle")
  .addEventListener("click", () => {
    document.getElementById("triangleBase").value = 10;
    document.getElementById("triangleHeight").value = 6;
    document.getElementById("sideA").value = 10;
    document.getElementById("sideB").value = 8;
    document.getElementById("sideC").value = 8;

    triangleResult.textContent =
      "Your triangle calculations will appear here.";
  });


/* ---------- EXPERIMENT 03: QUADRILATERALS ---------- */

const quadType = document.getElementById("quadType");
const quadLength = document.getElementById("quadLength");
const quadWidth = document.getElementById("quadWidth");
const quadHeight = document.getElementById("quadHeight");

const quadSecondField =
  document.getElementById("quadSecondField");

const quadHeightField =
  document.getElementById("quadHeightField");

const quadLengthLabel =
  document.getElementById("quadLengthLabel");

const quadWidthLabel =
  document.getElementById("quadWidthLabel");

const quadResult =
  document.getElementById("quadResult");


function updateQuadrilateralFields() {
  const shape = quadType.value;

  quadSecondField.hidden = shape === "square";
  quadHeightField.hidden = shape !== "parallelogram";

  if (shape === "square") {
    quadLengthLabel.textContent = "Side length";
  } else if (shape === "rectangle") {
    quadLengthLabel.textContent = "Length";
    quadWidthLabel.textContent = "Width";
  } else {
    quadLengthLabel.textContent = "Base";
    quadWidthLabel.textContent = "Side length";
  }

  quadResult.textContent =
    "Enter the dimensions and calculate the result.";
}

quadType.addEventListener("change", updateQuadrilateralFields);


function calculateQuadrilateral() {
  const shape = quadType.value;
  const first = geometryNumber("quadLength");

  if (first === null || first <= 0) {
    geometryError(quadResult, "Enter a positive dimension.");
    return;
  }

  let area;
  let perimeter;
  let steps = [];
  let shapeName = "";

  if (shape === "square") {
    shapeName = "Square";

    area = first * first;
    perimeter = 4 * first;

    steps = [
      `Side length = ${geometryFormat(first)} units.`,
      "Area of a square = side × side.",
      `Area = ${geometryFormat(first)} × ${geometryFormat(first)} = ${geometryFormat(area)} square units.`,
      "Perimeter of a square = 4 × side.",
      `Perimeter = 4 × ${geometryFormat(first)} = ${geometryFormat(perimeter)} units.`
    ];
  }

  if (shape === "rectangle") {
    const second = geometryNumber("quadWidth");

    if (second === null || second <= 0) {
      geometryError(quadResult, "Enter a positive width.");
      return;
    }

    shapeName = "Rectangle";

    area = first * second;
    perimeter = 2 * (first + second);

    steps = [
      `Length = ${geometryFormat(first)} units and width = ${geometryFormat(second)} units.`,
      "Area of a rectangle = length × width.",
      `Area = ${geometryFormat(first)} × ${geometryFormat(second)} = ${geometryFormat(area)} square units.`,
      "Perimeter of a rectangle = 2 × (length + width).",
      `Perimeter = 2 × (${geometryFormat(first)} + ${geometryFormat(second)}) = ${geometryFormat(perimeter)} units.`
    ];
  }

  if (shape === "parallelogram") {
    const second = geometryNumber("quadWidth");
    const height = geometryNumber("quadHeight");

    if (
      second === null || height === null ||
      second <= 0 || height <= 0
    ) {
      geometryError(
        quadResult,
        "Enter positive values for the side length and perpendicular height."
      );
      return;
    }

    if (height > second) {
      geometryError(
        quadResult,
        "The perpendicular height cannot be greater than the sloping side length of a parallelogram."
      );
      return;
    }

    shapeName = "Parallelogram";

    area = first * height;
    perimeter = 2 * (first + second);

    steps = [
      `Base = ${geometryFormat(first)} units, side = ${geometryFormat(second)} units and perpendicular height = ${geometryFormat(height)} units.`,
      "Area of a parallelogram = base × perpendicular height.",
      `Area = ${geometryFormat(first)} × ${geometryFormat(height)} = ${geometryFormat(area)} square units.`,
      "Perimeter of a parallelogram = 2 × (base + side).",
      `Perimeter = 2 × (${geometryFormat(first)} + ${geometryFormat(second)}) = ${geometryFormat(perimeter)} units.`
    ];
  }

  geometryShowSteps(
    quadResult,
    `${shapeName.toUpperCase()} CALCULATION`,
    `Area = ${geometryFormat(area)} square units | Perimeter = ${geometryFormat(perimeter)} units`,
    steps,
    `The area and perimeter formulas for a ${shapeName.toLowerCase()} have been applied.`
  );
}

document
  .getElementById("calculateQuadrilateral")
  .addEventListener("click", calculateQuadrilateral);


document
  .getElementById("resetQuadrilateral")
  .addEventListener("click", () => {
    quadType.value = "square";
    quadLength.value = 5;
    quadWidth.value = 3;
    quadHeight.value = 4;

    updateQuadrilateralFields();

    quadResult.textContent =
      "Your shape calculations will appear here.";
  });


/* ---------- INITIAL SETUP ---------- */

updateQuadrilateralFields();
                   
