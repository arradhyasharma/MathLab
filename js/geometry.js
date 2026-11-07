
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


/* ---------- EXPERIMENT 03: HERON'S FORMULA ---------- */

const heronResult = document.getElementById("heronResult");

function calculateHeron() {
  const a = geometryNumber("heronA");
  const b = geometryNumber("heronB");
  const c = geometryNumber("heronC");

  if ([a, b, c].some(value => value === null || value <= 0)) {
    geometryError(heronResult, "Enter three positive side lengths.");
    return;
  }

  if (a + b <= c || a + c <= b || b + c <= a) {
    geometryError(
      heronResult,
      "These sides cannot form a triangle. The sum of any two sides must be greater than the third."
    );
    return;
  }

  const s = (a + b + c) / 2;
  const product = s * (s - a) * (s - b) * (s - c);
  const area = Math.sqrt(product);

  const steps = [
    `The three sides are a = ${geometryFormat(a)}, b = ${geometryFormat(b)} and c = ${geometryFormat(c)}.`,
    "Calculate the semi-perimeter: s = (a + b + c) ÷ 2.",
    `s = (${geometryFormat(a)} + ${geometryFormat(b)} + ${geometryFormat(c)}) ÷ 2 = ${geometryFormat(s)}.`,
    "Apply Heron's formula: Area = √[s(s − a)(s − b)(s − c)].",
    `Substitute: Area = √[${geometryFormat(s)} × ${geometryFormat(s - a)} × ${geometryFormat(s - b)} × ${geometryFormat(s - c)}].`,
    `Area = ${geometryFormat(area)} square units.`
  ];

  geometryShowSteps(
    heronResult,
    "HERON'S FORMULA RESULT",
    `Area = ${geometryFormat(area)} square units`,
    steps,
    "Heron's formula finds the area using only the three side lengths."
  );
}

document
  .getElementById("calculateHeron")
  .addEventListener("click", calculateHeron);

document
  .getElementById("resetHeron")
  .addEventListener("click", () => {
    document.getElementById("heronA").value = 13;
    document.getElementById("heronB").value = 14;
    document.getElementById("heronC").value = 15;
    heronResult.textContent =
      "Your Heron's formula calculation will appear here.";
  });


/* ---------- EXPERIMENT 04: EQUILATERAL TRIANGLE ---------- */

const equilateralResult =
  document.getElementById("equilateralResult");

function calculateEquilateral() {
  const a = geometryNumber("equilateralSide");

  if (a === null || a <= 0) {
    geometryError(
      equilateralResult,
      "Enter a positive side length."
    );
    return;
  }

  const area = (Math.sqrt(3) / 4) * a * a;
  const height = (Math.sqrt(3) / 2) * a;
  const perimeter = 3 * a;

  const steps = [
    `Each side of the equilateral triangle is ${geometryFormat(a)} units.`,
    "All three interior angles are equal: 180° ÷ 3 = 60°.",
    "Perimeter = 3 × side length.",
    `Perimeter = 3 × ${geometryFormat(a)} = ${geometryFormat(perimeter)} units.`,
    "Height = (√3 ÷ 2) × side length.",
    `Height = (√3 ÷ 2) × ${geometryFormat(a)} = ${geometryFormat(height)} units.`,
    "Area = (√3 ÷ 4) × side length².",
    `Area = (√3 ÷ 4) × ${geometryFormat(a)}² = ${geometryFormat(area)} square units.`
  ];

  geometryShowSteps(
    equilateralResult,
    "EQUILATERAL TRIANGLE RESULT",
    `Area = ${geometryFormat(area)} square units`,
    steps,
    `Perimeter = ${geometryFormat(perimeter)} units · Height = ${geometryFormat(height)} units · Each angle = 60°.`
  );
}

document
  .getElementById("calculateEquilateral")
  .addEventListener("click", calculateEquilateral);

document
  .getElementById("resetEquilateral")
  .addEventListener("click", () => {
    document.getElementById("equilateralSide").value = 6;
    equilateralResult.textContent =
      "Your equilateral triangle calculations will appear here.";
  });
/* ---------- EXPERIMENT 05: QUADRILATERALS ---------- */

const quadType = document.getElementById("quadType");
const quadLength = document.getElementById("quadLength");
const quadWidth = document.getElementById("quadWidth");
const quadSideC = document.getElementById("quadSideC");
const quadSideD = document.getElementById("quadSideD");
const quadHeight = document.getElementById("quadHeight");

const quadSecondField =
  document.getElementById("quadSecondField");

const quadThirdField =
  document.getElementById("quadThirdField");

const quadFourthField =
  document.getElementById("quadFourthField");

const quadHeightField =
  document.getElementById("quadHeightField");

const quadLengthLabel =
  document.getElementById("quadLengthLabel");

const quadWidthLabel =
  document.getElementById("quadWidthLabel");

const quadSideCLabel =
  document.getElementById("quadSideCLabel");

const quadSideDLabel =
  document.getElementById("quadSideDLabel");

const quadHeightLabel =
  document.getElementById("quadHeightLabel");

const quadResult =
  document.getElementById("quadResult");


function updateQuadrilateralFields() {
  const shape = quadType.value;

  // Hide optional fields first.
  quadSecondField.hidden = true;
  quadThirdField.hidden = true;
  quadFourthField.hidden = true;
  quadHeightField.hidden = true;

  if (shape === "square") {
    quadLengthLabel.textContent = "Side length";
  }

  else if (shape === "rectangle") {
    quadLengthLabel.textContent = "Length";
    quadWidthLabel.textContent = "Width";
    quadSecondField.hidden = false;
  }

  else if (shape === "parallelogram") {
    quadLengthLabel.textContent = "Base";
    quadWidthLabel.textContent = "Adjacent side";
    quadHeightLabel.textContent = "Perpendicular height";

    quadSecondField.hidden = false;
    quadHeightField.hidden = false;
  }

  else if (shape === "rhombus") {
    quadLengthLabel.textContent = "Side length";
    quadWidthLabel.textContent = "Diagonal 1";
    quadSideCLabel.textContent = "Diagonal 2";

    quadSecondField.hidden = false;
    quadThirdField.hidden = false;
  }

  else if (shape === "trapezium") {
    quadLengthLabel.textContent = "Parallel side 1";
    quadWidthLabel.textContent = "Parallel side 2";
    quadSideCLabel.textContent = "Side 3";
    quadSideDLabel.textContent = "Side 4";
    quadHeightLabel.textContent = "Perpendicular height";

    quadSecondField.hidden = false;
    quadThirdField.hidden = false;
    quadFourthField.hidden = false;
    quadHeightField.hidden = false;
  }

  quadResult.textContent =
    "Enter the dimensions and calculate the result.";
}


function calculateQuadrilateral() {
  const shape = quadType.value;
  const first = geometryNumber("quadLength");

  if (first === null || first <= 0) {
    geometryError(quadResult, "Enter a positive first dimension.");
    return;
  }

  let area = 0;
  let perimeter = 0;
  let steps = [];
  let shapeName = "";

  if (shape === "square") {
    shapeName = "Square";

    area = first * first;
    perimeter = 4 * first;

    steps = [
      `Side = ${geometryFormat(first)} units.`,
      "Area = side × side.",
      `Area = ${geometryFormat(first)} × ${geometryFormat(first)} = ${geometryFormat(area)} square units.`,
      "Perimeter = 4 × side.",
      `Perimeter = 4 × ${geometryFormat(first)} = ${geometryFormat(perimeter)} units.`
    ];
  }

  else if (shape === "rectangle") {
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
      "Area = length × width.",
      `Area = ${geometryFormat(first)} × ${geometryFormat(second)} = ${geometryFormat(area)} square units.`,
      "Perimeter = 2 × (length + width).",
      `Perimeter = 2 × (${geometryFormat(first)} + ${geometryFormat(second)}) = ${geometryFormat(perimeter)} units.`
    ];
  }

  else if (shape === "parallelogram") {
    const second = geometryNumber("quadWidth");
    const height = geometryNumber("quadHeight");

    if ([second, height].some(value => value === null || value <= 0)) {
      geometryError(
        quadResult,
        "Enter positive values for the adjacent side and perpendicular height."
      );
      return;
    }

    if (height > second) {
      geometryError(
        quadResult,
        "The perpendicular height cannot exceed the adjacent side length."
      );
      return;
    }

    shapeName = "Parallelogram";
    area = first * height;
    perimeter = 2 * (first + second);

    steps = [
      `Base = ${geometryFormat(first)}, adjacent side = ${geometryFormat(second)} and height = ${geometryFormat(height)} units.`,
      "Area = base × perpendicular height.",
      `Area = ${geometryFormat(first)} × ${geometryFormat(height)} = ${geometryFormat(area)} square units.`,
      "Perimeter = 2 × (base + adjacent side).",
      `Perimeter = 2 × (${geometryFormat(first)} + ${geometryFormat(second)}) = ${geometryFormat(perimeter)} units.`
    ];
  }

  else if (shape === "rhombus") {
    const d1 = geometryNumber("quadWidth");
    const d2 = geometryNumber("quadSideC");

    if ([d1, d2].some(value => value === null || value <= 0)) {
      geometryError(
        quadResult,
        "Enter positive values for both diagonals."
      );
      return;
    }

    // In a rhombus, diagonals bisect each other at right angles.
    // Therefore, side² = (d1/2)² + (d2/2)².
    const expectedSide = Math.sqrt(
      (d1 / 2) ** 2 + (d2 / 2) ** 2
    );

    if (Math.abs(first - expectedSide) > 0.00001 * Math.max(1, expectedSide)) {
      geometryError(
        quadResult,
        `These measurements are inconsistent. For diagonals ${geometryFormat(d1)} and ${geometryFormat(d2)}, the side should be approximately ${geometryFormat(expectedSide)} units.`
      );
      return;
    }

    shapeName = "Rhombus";
    area = 0.5 * d1 * d2;
    perimeter = 4 * first;

    steps = [
      `Side = ${geometryFormat(first)} units.`,
      `First diagonal = ${geometryFormat(d1)} units and second diagonal = ${geometryFormat(d2)} units.`,
      "Area = ½ × diagonal 1 × diagonal 2.",
      `Area = ½ × ${geometryFormat(d1)} × ${geometryFormat(d2)} = ${geometryFormat(area)} square units.`,
      "Perimeter = 4 × side.",
      `Perimeter = 4 × ${geometryFormat(first)} = ${geometryFormat(perimeter)} units.`
    ];
  }

  else if (shape === "trapezium") {
    const second = geometryNumber("quadWidth");
    const third = geometryNumber("quadSideC");
    const fourth = geometryNumber("quadSideD");
    const height = geometryNumber("quadHeight");

    if ([second, third, fourth, height].some(
      value => value === null || value <= 0
    )) {
      geometryError(
        quadResult,
        "Enter positive values for both parallel sides, the other two sides and the height."
      );
      return;
    }

    if (height > third || height > fourth) {
      geometryError(
        quadResult,
        "The perpendicular height cannot be greater than either of the non-parallel side lengths."
      );
      return;
    }

    shapeName = "Trapezium";
    area = 0.5 * (first + second) * height;
    perimeter = first + second + third + fourth;

    steps = [
      `Parallel sides = ${geometryFormat(first)} and ${geometryFormat(second)} units.`,
      `Other sides = ${geometryFormat(third)} and ${geometryFormat(fourth)} units.`,
      `Perpendicular height = ${geometryFormat(height)} units.`,
      "Area = ½ × (sum of parallel sides) × height.",
      `Area = ½ × (${geometryFormat(first)} + ${geometryFormat(second)}) × ${geometryFormat(height)} = ${geometryFormat(area)} square units.`,
      "Perimeter = sum of all four sides.",
      `Perimeter = ${geometryFormat(first)} + ${geometryFormat(second)} + ${geometryFormat(third)} + ${geometryFormat(fourth)} = ${geometryFormat(perimeter)} units.`
    ];
  }

  geometryShowSteps(
    quadResult,
    `${shapeName.toUpperCase()} CALCULATION`,
    `Area = ${geometryFormat(area)} square units | Perimeter = ${geometryFormat(perimeter)} units`,
    steps,
    `The formulas for a ${shapeName.toLowerCase()} have been applied. Check that the entered dimensions describe a possible shape.`
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
    quadSideC.value = 5;
    quadSideD.value = 5;
    quadHeight.value = 4;

    updateQuadrilateralFields();

    quadResult.textContent =
      "Your shape calculations will appear here.";
  });

/* ---------- INITIAL SETUP ---------- */

updateQuadrilateralFields();
                   
