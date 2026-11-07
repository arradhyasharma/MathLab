"use strict";

/* =========================================================
   MATHLAB — GEOMETRY LAB
   Experiments 01–05
   ========================================================= */


/* ---------- Shared utility functions ---------- */

function getNumber(id) {
  const element = document.getElementById(id);

  if (!element || element.value.trim() === "") {
    return null;
  }

  const value = Number(element.value);

  if (!Number.isFinite(value)) {
    return null;
  }

  return value;
}


function formatNumber(value) {
  if (!Number.isFinite(value)) {
    return "Not defined";
  }

  return Number(value.toFixed(6)).toString();
}


function getElement(id) {
  return document.getElementById(id);
}


function showError(element, message) {
  element.innerHTML = `
    <div class="result-error">
      <strong>Unable to calculate</strong>
      <p>${message}</p>
    </div>
  `;
}


function showPlaceholder(element, message) {
  element.innerHTML = `
    <p class="result-placeholder">${message}</p>
  `;
}


function positiveValues(values) {
  return values.every(value => value !== null && value > 0);
}


function triangleIsValid(a, b, c) {
  return (
    a > 0 &&
    b > 0 &&
    c > 0 &&
    a + b > c &&
    a + c > b &&
    b + c > a
  );
}


/*
  Displays a calculation in stages.
  The user can reveal one step at a time or show all steps.
*/

function showSteps(element, heading, answer, steps, note = "") {
  const resultId = `steps-${Math.random().toString(36).slice(2, 10)}`;

  element.innerHTML = `
    <div class="result-success">
      <div class="result-heading">${heading}</div>

      <div class="result-answer">
        ${answer}
      </div>

      <div class="working-area" id="${resultId}">
        <div class="working-title">STEP-BY-STEP WORKING</div>
        <div class="working-steps"></div>
        <div class="working-controls">
          <button type="button" class="secondary-button show-next-step">
            Show next step
          </button>
          <button type="button" class="secondary-button show-all-steps">
            Show all steps
          </button>
        </div>
      </div>

      ${note ? `<p class="result-note">${note}</p>` : ""}
    </div>
  `;

  const container = getElement(resultId);
  const stepArea = container.querySelector(".working-steps");
  const nextButton = container.querySelector(".show-next-step");
  const allButton = container.querySelector(".show-all-steps");

  let visibleSteps = 0;

  function renderSteps() {
    stepArea.innerHTML = steps
      .slice(0, visibleSteps)
      .map((step, index) => `
        <div class="working-step">
          <span class="step-number">${index + 1}</span>
          <span>${step}</span>
        </div>
      `)
      .join("");

    nextButton.disabled = visibleSteps >= steps.length;
    allButton.disabled = visibleSteps >= steps.length;

    nextButton.textContent =
      visibleSteps >= steps.length ? "All steps shown" : "Show next step";
  }

  nextButton.addEventListener("click", () => {
    if (visibleSteps < steps.length) {
      visibleSteps++;
      renderSteps();
    }
  });

  allButton.addEventListener("click", () => {
    visibleSteps = steps.length;
    renderSteps();
  });

  renderSteps();
}


/* =========================================================
   EXPERIMENT 01 — TRIANGLE ANGLE EXPLORER
   ========================================================= */

const angleResult = getElement("angleResult");

getElement("calculateAngles").addEventListener("click", calculateAngles);
getElement("resetAngles").addEventListener("click", resetAngles);


function calculateAngles() {
  const a = getNumber("angleA");
  const b = getNumber("angleB");
  const c = getNumber("angleC");

  if (a === null || b === null || c === null) {
    showError(angleResult, "Enter all three angles before calculating.");
    return;
  }

  if (a <= 0 || b <= 0 || c <= 0) {
    showError(angleResult, "Every interior angle must be greater than 0°.");
    return;
  }

  if (a >= 180 || b >= 180 || c >= 180) {
    showError(angleResult, "An interior angle of a triangle must be less than 180°.");
    return;
  }

  const total = a + b + c;

  if (Math.abs(total - 180) > 0.000001) {
    showError(
      angleResult,
      `The angles add up to ${formatNumber(total)}°, not 180°. These values cannot form a triangle.`
    );
    return;
  }

  let classification = "Acute-angled triangle";

  if (a === 90 || b === 90 || c === 90) {
    classification = "Right-angled triangle";
  } else if (a > 90 || b > 90 || c > 90) {
    classification = "Obtuse-angled triangle";
  }

  const isEquilateral =
    Math.abs(a - 60) < 0.000001 &&
    Math.abs(b - 60) < 0.000001 &&
    Math.abs(c - 60) < 0.000001;

  if (isEquilateral) {
    classification = "Equilateral triangle";
  }

  const steps = [
    `First angle = ${formatNumber(a)}°`,
    `Second angle = ${formatNumber(b)}°`,
    `Third angle = ${formatNumber(c)}°`,
    `Add the angles: ${formatNumber(a)} + ${formatNumber(b)} + ${formatNumber(c)} = ${formatNumber(total)}°`,
    `The angle sum is 180°, so the values satisfy the triangle angle-sum property.`
  ];

  showSteps(
    angleResult,
    "Triangle angle investigation",
    `<strong>${classification}</strong><br>Total angle = ${formatNumber(total)}°`,
    steps,
    "Property verified: the sum of the three interior angles of a triangle is 180°."
  );
}


function resetAngles() {
  ["angleA", "angleB", "angleC"].forEach(id => {
    getElement(id).value = "";
  });

  showPlaceholder(angleResult, "Your angle investigation will appear here.");
}


/* =========================================================
   EXPERIMENT 02 — TRIANGLE AREA AND PERIMETER
   ========================================================= */

const triangleResult = getElement("triangleResult");

getElement("calculateTriangle").addEventListener("click", calculateTriangle);
getElement("resetTriangle").addEventListener("click", resetTriangle);


function calculateTriangle() {
  const base = getNumber("triangleBase");
  const height = getNumber("triangleHeight");

  const a = getNumber("triangleSideA");
  const b = getNumber("triangleSideB");
  const c = getNumber("triangleSideC");

  const measurements = [base, height, a, b, c];

  if (measurements.some(value => value === null)) {
    showError(
      triangleResult,
      "Enter the base, perpendicular height and all three side lengths."
    );
    return;
  }

  if (!positiveValues(measurements)) {
    showError(triangleResult, "All measurements must be greater than zero.");
    return;
  }

  if (!triangleIsValid(a, b, c)) {
    showError(
      triangleResult,
      "The three side lengths do not satisfy the triangle inequality. The sum of any two sides must be greater than the third."
    );
    return;
  }

  const area = 0.5 * base * height;
  const perimeter = a + b + c;

  const steps = [
    `Area formula: A = ½ × base × height`,
    `Substitute: A = ½ × ${formatNumber(base)} × ${formatNumber(height)}`,
    `Area = ${formatNumber(area)} square units`,
    `Perimeter formula: P = a + b + c`,
    `Substitute: P = ${formatNumber(a)} + ${formatNumber(b)} + ${formatNumber(c)}`,
    `Perimeter = ${formatNumber(perimeter)} units`
  ];

  showSteps(
    triangleResult,
    "Triangle measurements",
    `Area: <strong>${formatNumber(area)} square units</strong><br>
     Perimeter: <strong>${formatNumber(perimeter)} units</strong>`,
    steps,
    "The area calculation uses the supplied perpendicular height. The side lengths are checked separately for triangle validity."
  );
}


function resetTriangle() {
  [
    "triangleBase",
    "triangleHeight",
    "triangleSideA",
    "triangleSideB",
    "triangleSideC"
  ].forEach(id => {
    getElement(id).value = "";
  });

  showPlaceholder(triangleResult, "Triangle measurements will appear here.");
}


/* =========================================================
   EXPERIMENT 03 — HERON'S FORMULA
   ========================================================= */

const heronResult = getElement("heronResult");

getElement("calculateHeron").addEventListener("click", calculateHeron);
getElement("resetHeron").addEventListener("click", resetHeron);


function calculateHeron() {
  const a = getNumber("heronA");
  const b = getNumber("heronB");
  const c = getNumber("heronC");

  if (a === null || b === null || c === null) {
    showError(heronResult, "Enter all three side lengths.");
    return;
  }

  if (!triangleIsValid(a, b, c)) {
    showError(
      heronResult,
      "These side lengths cannot form a triangle. Check that the sum of any two sides is greater than the remaining side."
    );
    return;
  }

  const s = (a + b + c) / 2;

  const radicand =
    s * (s - a) * (s - b) * (s - c);

  if (radicand <= 0 || !Number.isFinite(radicand)) {
    showError(heronResult, "The supplied measurements do not produce a valid area.");
    return;
  }

  const area = Math.sqrt(radicand);
  const perimeter = a + b + c;

  const steps = [
    `Given sides: a = ${formatNumber(a)}, b = ${formatNumber(b)}, c = ${formatNumber(c)}`,
    `Semi-perimeter formula: s = (a + b + c) / 2`,
    `s = (${formatNumber(a)} + ${formatNumber(b)} + ${formatNumber(c)}) / 2`,
    `s = ${formatNumber(s)}`,
    `Heron's formula: A = √[s(s − a)(s − b)(s − c)]`,
    `A = √[${formatNumber(s)} × ${formatNumber(s - a)} × ${formatNumber(s - b)} × ${formatNumber(s - c)}]`,
    `A = √${formatNumber(radicand)}`,
    `Area = ${formatNumber(area)} square units`
  ];

  showSteps(
    heronResult,
    "Heron's formula result",
    `Area: <strong>${formatNumber(area)} square units</strong><br>
     Semi-perimeter: <strong>${formatNumber(s)} units</strong><br>
     Perimeter: <strong>${formatNumber(perimeter)} units</strong>`,
    steps,
    "Heron's formula calculates a triangle's area using only its three side lengths."
  );
}


function resetHeron() {
  ["heronA", "heronB", "heronC"].forEach(id => {
    getElement(id).value = "";
  });

  showPlaceholder(heronResult, "Heron's formula solution will appear here.");
}


/* =========================================================
   EXPERIMENT 04 — EQUILATERAL TRIANGLE
   ========================================================= */

const equilateralResult = getElement("equilateralResult");

getElement("calculateEquilateral").addEventListener("click", calculateEquilateral);
getElement("resetEquilateral").addEventListener("click", resetEquilateral);


function calculateEquilateral() {
  const side = getNumber("equilateralSide");

  if (side === null || side <= 0) {
    showError(equilateralResult, "Enter a side length greater than zero.");
    return;
  }

  const perimeter = 3 * side;
  const height = (Math.sqrt(3) / 2) * side;
  const area = (Math.sqrt(3) / 4) * side * side;

  const steps = [
    `Each side has length a = ${formatNumber(side)} units.`,
    `All three interior angles are equal.`,
    `Each angle = 180° / 3 = 60°`,
    `Perimeter formula: P = 3a`,
    `P = 3 × ${formatNumber(side)} = ${formatNumber(perimeter)} units`,
    `Height formula: h = (√3 / 2) × a`,
    `h = (√3 / 2) × ${formatNumber(side)} = ${formatNumber(height)} units`,
    `Area formula: A = (√3 / 4) × a²`,
    `A = (√3 / 4) × ${formatNumber(side)}²`,
    `Area = ${formatNumber(area)} square units`
  ];

  showSteps(
    equilateralResult,
    "Equilateral triangle properties",
    `Area: <strong>${formatNumber(area)} square units</strong><br>
     Height: <strong>${formatNumber(height)} units</strong><br>
     Perimeter: <strong>${formatNumber(perimeter)} units</strong><br>
     Each angle: <strong>60°</strong>`,
    steps,
    "An equilateral triangle has three equal sides and three equal interior angles."
  );
}


function resetEquilateral() {
  getElement("equilateralSide").value = "";

  showPlaceholder(
    equilateralResult,
    "Equilateral triangle properties will appear here."
  );
}


/* =========================================================
   EXPERIMENT 05 — QUADRILATERAL EXPLORER
   ========================================================= */

const quadType = getElement("quadType");
const quadResult = getElement("quadrilateralResult");
const quadHint = getElement("quadHint");

const quadFields = {
  first: getElement("quadFirstField"),
  second: getElement("quadSecondField"),
  third: getElement("quadThirdField"),
  fourth: getElement("quadFourthField"),
  height: getElement("quadHeightField")
};


const quadLabels = {
  length: getElement("quadLengthLabel"),
  width: getElement("quadWidthLabel"),
  sideC: getElement("quadSideCLabel"),
  sideD: getElement("quadSideDLabel"),
  height: getElement("quadHeightLabel")
};


const quadInputs = [
  "quadLength",
  "quadWidth",
  "quadSideC",
  "quadSideD",
  "quadHeight"
];


getElement("calculateQuadrilateral").addEventListener(
  "click",
  calculateQuadrilateral
);

getElement("resetQuadrilateral").addEventListener(
  "click",
  resetQuadrilateral
);

quadType.addEventListener("change", updateQuadrilateralFields);


/*
  Each field wrapper is shown or hidden as a whole.
  This keeps the input grid from reserving empty spaces.
*/

function updateQuadrilateralFields() {
  const shape = quadType.value;

  Object.values(quadFields).forEach(field => {
    field.hidden = true;
  });

  switch (shape) {

    case "square":
      quadFields.first.hidden = false;

      quadLabels.length.textContent = "Side length";

      quadHint.textContent =
        "Enter the length of one side. All four sides of a square are equal.";
      break;


    case "rectangle":
      quadFields.first.hidden = false;
      quadFields.second.hidden = false;

      quadLabels.length.textContent = "Length";
      quadLabels.width.textContent = "Width";

      quadHint.textContent =
        "Enter the length and width of the rectangle.";
      break;


    case "parallelogram":
      quadFields.first.hidden = false;
      quadFields.second.hidden = false;
      quadFields.height.hidden = false;

      quadLabels.length.textContent = "Base";
      quadLabels.width.textContent = "Adjacent side";
      quadLabels.height.textContent = "Perpendicular height";

      quadHint.textContent =
        "Enter the base, adjacent side and perpendicular height.";
      break;


    case "rhombus":
      quadFields.first.hidden = false;
      quadFields.third.hidden = false;
      quadFields.fourth.hidden = false;

      quadLabels.length.textContent = "Side length";
      quadLabels.sideC.textContent = "Diagonal 1";
      quadLabels.sideD.textContent = "Diagonal 2";

      quadHint.textContent =
        "Enter the side length and both diagonals. The diagonals of a rhombus bisect each other at right angles.";
      break;


    case "trapezium":
      quadFields.first.hidden = false;
      quadFields.second.hidden = false;
      quadFields.third.hidden = false;
      quadFields.fourth.hidden = false;
      quadFields.height.hidden = false;

      quadLabels.length.textContent = "Parallel side 1";
      quadLabels.width.textContent = "Parallel side 2";
      quadLabels.sideC.textContent = "Non-parallel side 1";
      quadLabels.sideD.textContent = "Non-parallel side 2";
      quadLabels.height.textContent = "Perpendicular height";

      quadHint.textContent =
        "Enter both parallel sides, both non-parallel sides and the perpendicular height.";
      break;
  }

  quadInputs.forEach(id => {
    getElement(id).value = "";
  });

  showPlaceholder(
    quadResult,
    "Enter the required measurements and calculate the shape."
  );
}


function calculateQuadrilateral() {
  const shape = quadType.value;

  const first = getNumber("quadLength");
  const second = getNumber("quadWidth");
  const third = getNumber("quadSideC");
  const fourth = getNumber("quadSideD");
  const height = getNumber("quadHeight");

  let area = 0;
  let perimeter = 0;
  let steps = [];
  let heading = "";
  let note = "";

  switch (shape) {

    /* ---------- SQUARE ---------- */

    case "square": {
      if (first === null || first <= 0) {
        showError(quadResult, "Enter a valid side length greater than zero.");
        return;
      }

      const side = first;

      area = side * side;
      perimeter = 4 * side;

      heading = "Square calculation";

      steps = [
        `Side length = ${formatNumber(side)} units.`,
        `Area formula: A = side × side`,
        `A = ${formatNumber(side)} × ${formatNumber(side)}`,
        `Area = ${formatNumber(area)} square units`,
        `Perimeter formula: P = 4 × side`,
        `P = 4 × ${formatNumber(side)}`,
        `Perimeter = ${formatNumber(perimeter)} units`
      ];

      note = "A square has four equal sides and four right angles.";
      break;
    }


    /* ---------- RECTANGLE ---------- */

    case "rectangle": {
      if (!positiveValues([first, second])) {
        showError(quadResult, "Enter a valid length and width.");
        return;
      }

      const length = first;
      const width = second;

      area = length * width;
      perimeter = 2 * (length + width);

      heading = "Rectangle calculation";

      steps = [
        `Length = ${formatNumber(length)} units.`,
        `Width = ${formatNumber(width)} units.`,
        `Area formula: A = length × width`,
        `A = ${formatNumber(length)} × ${formatNumber(width)}`,
        `Area = ${formatNumber(area)} square units`,
        `Perimeter formula: P = 2(length + width)`,
        `P = 2(${formatNumber(length)} + ${formatNumber(width)})`,
        `Perimeter = ${formatNumber(perimeter)} units`
      ];

      note = "Opposite sides of a rectangle are equal and all four angles are right angles.";
      break;
    }


    /* ---------- PARALLELOGRAM ---------- */

    case "parallelogram": {
      if (!positiveValues([first, second, height])) {
        showError(
          quadResult,
          "Enter a positive base, adjacent side and perpendicular height."
        );
        return;
      }

      const base = first;
      const side = second;

      if (height > side) {
        showError(
          quadResult,
          "The perpendicular height cannot be greater than the adjacent side."
        );
        return;
      }

      area = base * height;
      perimeter = 2 * (base + side);

      heading = "Parallelogram calculation";

      steps = [
        `Base = ${formatNumber(base)} units.`,
        `Adjacent side = ${formatNumber(side)} units.`,
        `Perpendicular height = ${formatNumber(height)} units.`,
        `Area formula: A = base × height`,
        `A = ${formatNumber(base)} × ${formatNumber(height)}`,
        `Area = ${formatNumber(area)} square units`,
        `Perimeter formula: P = 2(base + side)`,
        `P = 2(${formatNumber(base)} + ${formatNumber(side)})`,
        `Perimeter = ${formatNumber(perimeter)} units`
      ];

      note = "The height must be perpendicular to the base; it is not necessarily equal to the slanting side.";
      break;
    }


    /* ---------- RHOMBUS ---------- */

    case "rhombus": {
      if (!positiveValues([first, third, fourth])) {
        showError(
          quadResult,
          "Enter a positive side length and two positive diagonal lengths."
        );
        return;
      }

      const side = first;
      const diagonal1 = third;
      const diagonal2 = fourth;

      /*
        In a rhombus, diagonals bisect each other at right angles.
        Each half-diagonal and one side form a right triangle.
      */

      const expectedSideSquared =
        Math.pow(diagonal1 / 2, 2) +
        Math.pow(diagonal2 / 2, 2);

      const actualSideSquared = side * side;

      const difference = Math.abs(
        actualSideSquared - expectedSideSquared
      );

      const tolerance = Math.max(
        0.000001,
        expectedSideSquared * 0.000001
      );

      if (difference > tolerance) {
        showError(
          quadResult,
          "These measurements are inconsistent. For a rhombus, side² must equal (diagonal 1 ÷ 2)² + (diagonal 2 ÷ 2)². Check your values."
        );
        return;
      }

      area = 0.5 * diagonal1 * diagonal2;
      perimeter = 4 * side;

      heading = "Rhombus calculation";

      steps = [
        `Side length = ${formatNumber(side)} units.`,
        `First diagonal = ${formatNumber(diagonal1)} units.`,
        `Second diagonal = ${formatNumber(diagonal2)} units.`,
        `Area formula: A = ½ × d₁ × d₂`,
        `A = ½ × ${formatNumber(diagonal1)} × ${formatNumber(diagonal2)}`,
        `Area = ${formatNumber(area)} square units`,
        `Perimeter formula: P = 4 × side`,
        `P = 4 × ${formatNumber(side)}`,
        `Perimeter = ${formatNumber(perimeter)} units`
      ];

      note = "A rhombus has four equal sides. Its diagonals bisect each other at right angles.";
      break;
    }


    /* ---------- TRAPEZIUM ---------- */

    case "trapezium": {
      if (!positiveValues([first, second, third, fourth, height])) {
        showError(
          quadResult,
          "Enter all five measurements. Every measurement must be greater than zero."
        );
         return;
      }

      const parallel1 = first;
      const parallel2 = second;
      const side1 = third;
      const side2 = fourth;

      if (height > side1 || height > side2) {
        showError(
          quadResult,
          "The perpendicular height cannot be greater than either non-parallel side."
        );
        return;
      }

      area = 0.5 * (parallel1 + parallel2) * height;
      perimeter = parallel1 + parallel2 + side1 + side2;

      heading = "Trapezium calculation";

      steps = [
        `First parallel side = ${formatNumber(parallel1)} units.`,
        `Second parallel side = ${formatNumber(parallel2)} units.`,
        `First non-parallel side = ${formatNumber(side1)} units.`,
        `Second non-parallel side = ${formatNumber(side2)} units.`,
        `Perpendicular height = ${formatNumber(height)} units.`,
        `Area formula: A = ½ × (a + b) × h`,
        `A = ½ × (${formatNumber(parallel1)} + ${formatNumber(parallel2)}) × ${formatNumber(height)}`,
        `Area = ${formatNumber(area)} square units`,
        `Perimeter formula: P = a + b + c + d`,
        `P = ${formatNumber(parallel1)} + ${formatNumber(parallel2)} + ${formatNumber(side1)} + ${formatNumber(side2)}`,
        `Perimeter = ${formatNumber(perimeter)} units`
      ];

      note = "The two bases are parallel. The height is the perpendicular distance between them. Check that the measurements describe a possible trapezium.";
      break;
    }
        default:
      showError(quadResult, "Select a valid quadrilateral.");
      return;
  }


  showSteps(
    quadResult,
    heading,
    `Area: <strong>${formatNumber(area)} square units</strong><br>
     Perimeter: <strong>${formatNumber(perimeter)} units</strong>`,
    steps,
    note
  );
}


function resetQuadrilateral() {
  quadInputs.forEach(id => {
    getElement(id).value = "";
  });

  showPlaceholder(
    quadResult,
    "Enter the required measurements and calculate the shape."
  );
}


/* ---------- Initial page setup ---------- */
updateQuadrilateralFields();
