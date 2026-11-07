
"use strict";

/* =========================================
   MATHLAB - CORE MATHEMATICS LABS
   ========================================= */


/* ---------- GENERAL UTILITIES ---------- */

function getNumber(id) {
    const value = document.getElementById(id).value.trim();

    if (value === "") {
        return null;
    }

    const number = Number(value);

    return Number.isFinite(number) ? number : null;
}

function round(value, places = 4) {
    const factor = Math.pow(10, places);
    return Math.round((value + Number.EPSILON) * factor) / factor;
}

function formatNumber(value) {
    if (!Number.isFinite(value)) {
        return "Undefined";
    }

    return String(round(value));
}

function displayResult(id, html) {
    document.getElementById(id).innerHTML = html;
}

function showError(id, message) {
    displayResult(
        id,
        `<p class="error">${message}</p>`
    );
}

function showToast(message) {
    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.style.display = "block";

    clearTimeout(window.mathLabToastTimer);

    window.mathLabToastTimer = setTimeout(() => {
        toast.style.display = "none";
    }, 2500);
}


/* ---------- LAB NAVIGATION ---------- */

const labInformation = {
    algebra: {
        title: "Algebra Laboratory",
        description: "Explore polynomials and solve linear equations."
    },

    geometry: {
        title: "Geometry Laboratory",
        description: "Calculate triangle measurements and explore geometric properties."
    },

    coordinates: {
        title: "Coordinate Geometry Laboratory",
        description: "Plot points and explore the Cartesian coordinate plane."
    }
};

function openLab(labName) {
    const info = labInformation[labName];

    if (!info) {
        showToast("This laboratory is not available.");
        return;
    }

    document.querySelectorAll(".lab-panel").forEach(panel => {
        panel.classList.remove("active");
    });

    document.getElementById(`${labName}-panel`).classList.add("active");

    document.getElementById("workspace-title").textContent = info.title;
    document.getElementById("workspace-description").textContent =
        info.description;

    document.getElementById("workspace").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    if (labName === "coordinates") {
        requestAnimationFrame(drawGraph);
    }
}

function closeLab() {
    document.querySelectorAll(".lab-panel").forEach(panel => {
        panel.classList.remove("active");
    });

    document.getElementById("workspace-title").textContent =
        "Select a Mathematics Lab";

    document.getElementById("workspace-description").textContent =
        "Choose one of the laboratories above to begin.";

    document.getElementById("labs").scrollIntoView({
        behavior: "smooth"
    });
}


/* =========================================
   1. ALGEBRA LAB
   ========================================= */


/* ---------- POLYNOMIAL EXPLORER ---------- */

function calculatePolynomial() {
    const a = getNumber("poly-a");
    const b = getNumber("poly-b");
    const c = getNumber("poly-c");
    const x = getNumber("poly-x");

    if ([a, b, c, x].some(value => value === null)) {
        showError("poly-result", "Please enter valid numbers in every field.");
        return;
    }

    const value = a * x * x + b * x + c;

    let degree;
    let zeroInformation = "";

    if (a !== 0) {
        degree = "2 (Quadratic Polynomial)";

        const discriminant = b * b - 4 * a * c;

        zeroInformation += `
            <p class="result-line">
                Discriminant: ${formatNumber(discriminant)}
            </p>
        `;

        if (discriminant > 0) {
            const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
            const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);

            zeroInformation += `
                <p class="result-line">
                    Two distinct real zeroes:
                    ${formatNumber(root1)} and ${formatNumber(root2)}
                </p>
            `;
        } else if (discriminant === 0) {
            const root = -b / (2 * a);

            zeroInformation += `
                <p class="result-line">
                    Two equal real zeroes:
                    ${formatNumber(root)}
                </p>
            `;
        } else {
            zeroInformation += `
                <p class="result-line">
                    No real zeroes.
                </p>
            `;
        }

    } else if (b !== 0) {
        degree = "1 (Linear Polynomial)";

        zeroInformation = `
            <p class="result-line">
                Zero: ${formatNumber(-c / b)}
            </p>
        `;

    } else if (c !== 0) {
        degree = "0 (Constant Polynomial)";
        zeroInformation = `
            <p class="result-line">
                This non-zero constant polynomial has no zero.
            </p>
        `;
    } else {
        degree = "Undefined (Zero Polynomial)";
        zeroInformation = `
            <p class="result-line">
                Every real number is a zero of the zero polynomial.
            </p>
        `;
    }

    const polynomialText =
        `${formatNumber(a)}x² + ${formatNumber(b)}x + ${formatNumber(c)}`;

    displayResult("poly-result", `
        <p class="result-title">Polynomial Analysis</p>
        <p class="result-line"><strong>Polynomial:</strong> ${polynomialText}</p>
        <p class="result-line"><strong>Degree:</strong> ${degree}</p>
        <p class="result-line">
            <strong>Value at x = ${formatNumber(x)}:</strong>
            ${formatNumber(value)}
        </p>
        ${zeroInformation}
    `);
}


/* ---------- LINEAR EQUATION SOLVER ---------- */

function solveEquation() {
    const a = getNumber("eq-a");
    const b = getNumber("eq-b");
    const c = getNumber("eq-c");

    if ([a, b, c].some(value => value === null)) {
        showError("equation-result", "Please enter valid numbers.");
        return;
    }

    const rightSide = c - b;

    if (a === 0) {
        if (rightSide === 0) {
            displayResult("equation-result", `
                <p class="result-title">Equation Analysis</p>
                <p class="result-line">The equation is an identity.</p>
                <p class="success">Every real value of x is a solution.</p>
            `);
        } else {
            displayResult("equation-result", `
                <p class="result-title">Equation Analysis</p>
                <p class="result-line">The equation is inconsistent.</p>
                <p class="error">There is no solution.</p>
            `);
        }

        return;
    }

    const x = rightSide / a;

    displayResult("equation-result", `
        <p class="result-title">Step-by-Step Solution</p>
        <p class="result-line">Original equation: ${formatNumber(a)}x + ${formatNumber(b)} = ${formatNumber(c)}</p>
        <p class="result-line">Step 1: Subtract ${formatNumber(b)} from both sides.</p>
        <p class="result-line">${formatNumber(a)}x = ${formatNumber(rightSide)}</p>
        <p class="result-line">Step 2: Divide both sides by ${formatNumber(a)}.</p>
        <p class="result-line success">
            Final answer: x = ${formatNumber(x)}
        </p>
    `);
}


/* =========================================
   2. GEOMETRY LAB
   ========================================= */


/* ---------- TRIANGLE CALCULATOR ---------- */

function calculateTriangle() {
    const a = getNumber("side-a");
    const b = getNumber("side-b");
    const c = getNumber("side-c");

    if ([a, b, c].some(value => value === null)) {
        showError("triangle-result", "Please enter all three side lengths.");
        return;
    }

    if (a <= 0 || b <= 0 || c <= 0) {
        showError("triangle-result", "All side lengths must be greater than zero.");
        return;
    }

    // Triangle inequality theorem
    if (
        a + b <= c ||
        a + c <= b ||
        b + c <= a
    ) {
        showError(
            "triangle-result",
            "These lengths cannot form a triangle. The sum of any two sides must be greater than the third side."
        );
        return;
    }

    const perimeter = a + b + c;
    const semiPerimeter = perimeter / 2;

    // Heron's formula
    const area = Math.sqrt(
        semiPerimeter *
        (semiPerimeter - a) *
        (semiPerimeter - b) *
        (semiPerimeter - c)
    );

    let triangleType;

    if (a === b && b === c) {
        triangleType = "Equilateral Triangle";
    } else if (a === b || b === c || a === c) {
        triangleType = "Isosceles Triangle";
    } else {
        triangleType = "Scalene Triangle";
    }

    displayResult("triangle-result", `
        <p class="result-title">Triangle Analysis</p>
        <p class="result-line success">Valid triangle!</p>
        <p class="result-line"><strong>Type:</strong> ${triangleType}</p>
        <p class="result-line"><strong>Perimeter:</strong> ${formatNumber(perimeter)} units</p>
        <p class="result-line"><strong>Semi-perimeter:</strong> ${formatNumber(semiPerimeter)} units</p>
        <p class="result-line"><strong>Area:</strong> ${formatNumber(area)} square units</p>
        <p class="result-line">
            <strong>Heron's formula:</strong>
            √[s(s-a)(s-b)(s-c)]
        </p>
    `);
}


/* ---------- TRIANGLE ANGLE SUM ---------- */

function calculateAngles() {
    const a = getNumber("angle-a");
    const b = getNumber("angle-b");
    const c = getNumber("angle-c");

    if ([a, b, c].some(value => value === null)) {
        showError("angle-result", "Please enter all three angles.");
        return;
    }

    if (
        a <= 0 || b <= 0 || c <= 0 ||
        a >= 180 || b >= 180 || c >= 180
    ) {
        showError(
            "angle-result",
            "Each interior angle must be greater than 0° and less than 180°."
        );
        return;
    }

    const sum = a + b + c;

    if (Math.abs(sum - 180) < 0.000001) {
        displayResult("angle-result", `
            <p class="result-title">Angle Analysis</p>
            <p class="result-line">Angle A: ${formatNumber(a)}°</p>
            <p class="result-line">Angle B: ${formatNumber(b)}°</p>
            <p class="result-line">Angle C: ${formatNumber(c)}°</p>
            <p class="result-line"><strong>Total: ${formatNumber(sum)}°</strong></p>
            <p class="success">Valid triangle angles! Their sum is 180°.</p>
        `);
    } else {
        displayResult("angle-result", `
            <p class="result-title">Angle Analysis</p>
            <p class="result-line">Sum of angles: ${formatNumber(sum)}°</p>
            <p class="error">
                These angles cannot be the interior angles of a triangle.
                The sum must be 180°.
            </p>
        `);
    }
}


/* ---------- QUADRILATERAL EXPLORER ---------- */

function calculateQuadrilateral() {
    const a = getNumber("quad-a");
    const b = getNumber("quad-b");
    const c = getNumber("quad-c");
    const d = getNumber("quad-d");

    if ([a, b, c, d].some(value => value === null)) {
        showError("quad-result", "Please enter all four side lengths.");
        return;
    }

    if ([a, b, c, d].some(value => value <= 0)) {
        showError("quad-result", "Every side length must be greater than zero.");
        return;
    }

    const perimeter = a + b + c + d;

    displayResult("quad-result", `
        <p class="result-title">Quadrilateral Analysis</p>
        <p class="result-line"><strong>Side lengths:</strong> ${formatNumber(a)}, ${formatNumber(b)}, ${formatNumber(c)}, ${formatNumber(d)}</p>
        <p class="result-line"><strong>Perimeter:</strong> ${formatNumber(perimeter)} units</p>
        <p class="result-line"><strong>Interior angle sum:</strong> 360°</p>
        <p class="muted">
            Note: Four side lengths alone do not determine the shape,
            angles or area of every quadrilateral.
        </p>
    `);
}


/* =========================================
   3. COORDINATE GEOMETRY LAB
   ========================================= */

const graphState = {
    points: [],
    connected: false,
    line: null
};


/* ---------- GRAPH COORDINATE HELPERS ---------- */

function getGraphCanvas() {
    return document.getElementById("coordinate-canvas");
}

function graphToPixel(x, y, width, height) {
    return {
        x: ((x + 10) / 20) * width,
        y: ((10 - y) / 20) * height
    };
}

function pixelToGraph(x, y, width, height) {
    return {
        x: (x / width) * 20 - 10,
        y: 10 - (y / height) * 20
    };
}


/* ---------- DRAW COORDINATE PLANE ---------- */

function drawGraph() {
    const canvas = getGraphCanvas();

    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();

    if (rect.width === 0 || rect.height === 0) return;

    const ratio = window.devicePixelRatio || 1;

    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(rect.height * ratio);

    const ctx = canvas.getContext("2d");

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    const width = rect.width;
    const height = rect.height;

    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = "#091323";
    ctx.fillRect(0, 0, width, height);

    // Grid
    for (let i = -10; i <= 10; i++) {
        const vertical = graphToPixel(i, 0, width, height);
        const horizontal = graphToPixel(0, i, width, height);

        ctx.beginPath();
        ctx.strokeStyle = "#243750";
        ctx.lineWidth = 1;

        ctx.moveTo(vertical.x, 0);
        ctx.lineTo(vertical.x, height);

        ctx.moveTo(0, horizontal.y);
        ctx.lineTo(width, horizontal.y);

        ctx.stroke();
    }

    const origin = graphToPixel(0, 0, width, height);

    // Axes
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(0, origin.y);
    ctx.lineTo(width, origin.y);

    ctx.moveTo(origin.x, 0);
    ctx.lineTo(origin.x, height);

    ctx.stroke();

    // Axis arrowheads
    ctx.fillStyle = "#cbd5e1";

    ctx.beginPath();
    ctx.moveTo(width - 2, origin.y);
    ctx.lineTo(width - 10, origin.y - 5);
    ctx.lineTo(width - 10, origin.y + 5);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(origin.x, 2);
    ctx.lineTo(origin.x - 5, 10);
    ctx.lineTo(origin.x + 5, 10);
    ctx.fill();

    // Axis labels and numbers
    ctx.font = "11px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#94a3b8";

    for (let i = -10; i <= 10; i++) {
        if (i === 0) continue;

        const xPos = graphToPixel(i, 0, width, height).x;
        const yPos = graphToPixel(0, i, width, height).y;

        ctx.fillText(String(i), xPos, origin.y + 13);
        ctx.fillText(String(i), origin.x - 13, yPos);
    }

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 13px Arial";

    ctx.fillText("X", width - 12, origin.y - 14);
    ctx.fillText("Y", origin.x + 13, 12);
    ctx.fillText("O", origin.x - 12, origin.y + 14);

    // Draw straight line if enabled
    if (graphState.line) {
        drawLineOnCanvas(ctx, width, height);
    }

    // Draw connected points
    if (graphState.connected && graphState.points.length >= 2) {
        ctx.beginPath();

        graphState.points.forEach((point, index) => {
            const pixel = graphToPixel(point.x, point.y, width, height);

            if (index === 0) {
                ctx.moveTo(pixel.x, pixel.y);
            } else {
                ctx.lineTo(pixel.x, pixel.y);
            }
        });

        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // Draw plotted points
    graphState.points.forEach((point, index) => {
        const pixel = graphToPixel(point.x, point.y, width, height);

        ctx.beginPath();
        ctx.arc(pixel.x, pixel.y, 5, 0, Math.PI * 2);

        ctx.fillStyle = "#38bdf8";
        ctx.fill();

        ctx.strokeStyle = "#e0f2fe";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.font = "bold 12px Arial";
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom";
        ctx.fillStyle = "#e0f2fe";

        ctx.fillText(
            `P${index + 1} (${formatNumber(point.x)}, ${formatNumber(point.y)})`,
            pixel.x + 8,
            pixel.y - 7
        );
    });
}


/* ---------- ADD A POINT ---------- */

function addPoint(xValue, yValue) {
    const x = xValue === undefined ? getNumber("point-x") : xValue;
    const y = yValue === undefined ? getNumber("point-y") : yValue;

    if (x === null || y === null) {
        showError("point-result", "Please enter valid X and Y coordinates.");
        return;
    }

    if (x < -10 || x > 10 || y < -10 || y > 10) {
        showError(
            "point-result",
            "Coordinates must be between -10 and 10."
        );
        return;
    }

    graphState.points.push({ x, y });
    graphState.connected = false;

    let quadrant;

    if (x > 0 && y > 0) {
        quadrant = "Quadrant I";
    } else if (x < 0 && y > 0) {
        quadrant = "Quadrant II";
    } else if (x < 0 && y < 0) {
        quadrant = "Quadrant III";
    } else if (x > 0 && y < 0) {
        quadrant = "Quadrant IV";
    } else if (x === 0 && y === 0) {
        quadrant = "Origin";
    } else if (x === 0) {
        quadrant = "On the Y-axis";
    } else {
        quadrant = "On the X-axis";
    }

    displayResult("point-result", `
        <p class="result-title">Point Plotted Successfully</p>
        <p class="result-line">Coordinates: (${formatNumber(x)}, ${formatNumber(y)})</p>
        <p class="result-line">Location: ${quadrant}</p>
    `);

    updatePointList();
    drawGraph();
}


/* ---------- UPDATE POINT LIST ---------- */

function updatePointList() {
    const list = document.getElementById("point-list");

    if (graphState.points.length === 0) {
        list.innerHTML = "<li>No points plotted yet.</li>";
        return;
    }

    list.innerHTML = graphState.points.map((point, index) => `
        <li>
            P${index + 1}: (${formatNumber(point.x)}, ${formatNumber(point.y)})
        </li>
    `).join("");
}


/* ---------- CONNECT POINTS ---------- */

function connectPoints() {
    if (graphState.points.length < 2) {
        showToast("Plot at least two points first.");
        return;
    }

    graphState.connected = true;
    drawGraph();

    showToast("Points connected successfully.");
}


/* ---------- CLEAR GRAPH ---------- */

function clearPoints() {
    graphState.points = [];
    graphState.connected = false;

    displayResult(
        "point-result",
        "All plotted points have been cleared."
    );

    updatePointList();
    drawGraph();
}


/* ---------- DRAW STRAIGHT LINE ---------- */

function drawLine() {
    const m = getNumber("line-m");
    const c = getNumber("line-c");

    if (m === null || c === null) {
        showError("line-result", "Please enter a valid slope and intercept.");
        return;
    }

    graphState.line = { m, c };

    displayResult("line-result", `
        <p class="result-title">Straight Line</p>
        <p class="result-line">Equation: y = ${formatNumber(m)}x + ${formatNumber(c)}</p>
        <p class="result-line">Slope: ${formatNumber(m)}</p>
        <p class="result-line">Y-intercept: ${formatNumber(c)}</p>
        <p class="success">The line has been drawn on the graph.</p>
    `);

    drawGraph();
}

function drawLineOnCanvas(ctx, width, height) {
    const { m, c } = graphState.line;

    const first = graphToPixel(-10, m * -10 + c, width, height);
    const second = graphToPixel(10, m * 10 + c, width, height);

    ctx.save();

    // Keep the line inside the graph area
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.clip();

    ctx.beginPath();
    ctx.moveTo(first.x, first.y);
    ctx.lineTo(second.x, second.y);

    ctx.strokeStyle = "#fb7185";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.restore();
}


/* ---------- REMOVE STRAIGHT LINE ---------- */

function clearLine() {
    graphState.line = null;

    displayResult(
        "line-result",
        "The straight line has been removed."
    );

    drawGraph();
}


/* ---------- TAP GRAPH TO PLOT ---------- */
function handleCanvasClick(event) {
    const canvas = getGraphCanvas();
    const rect = canvas.getBoundingClientRect();

    const pixelX = event.clientX - rect.left;
    const pixelY = event.clientY - rect.top;

    const graphPoint = pixelToGraph(
        pixelX,
        pixelY,
        rect.width,
        rect.height
    );

    // Snap to the nearest whole-number coordinate
    const x = Math.round(graphPoint.x);
    const y = Math.round(graphPoint.y);

    addPoint(x, y);
}


/* =========================================
   INITIALISATION
   ========================================= */

function initializeMathLab() {
    const canvas = getGraphCanvas();
  canvas.addEventListener("click", handleCanvasClick);

    window.addEventListener("resize", () => {
        drawGraph();
    });

    updatePointList();

    console.log("MathLab Core Labs loaded successfully.");
}

document.addEventListener("DOMContentLoaded", initializeMathLab);
