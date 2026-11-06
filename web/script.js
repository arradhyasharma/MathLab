
function openLab(labName) {
    showToast(labName + " will be available in an upcoming update.");
}

function showToast(message) {
    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.style.display = "block";

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(function () {
        toast.style.display = "none";
    }, 2500);
}

console.log("MathLab has loaded successfully.");
