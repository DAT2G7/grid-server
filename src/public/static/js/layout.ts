/// <reference lib="DOM" />

const liveAlertPlaceholder = document.getElementById("liveAlertPlaceholder");

const customAlert = (message: string, type: string) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        "</div>"
    ].join("");

    liveAlertPlaceholder?.append(wrapper);
};

const counter = document.getElementById("taskCounter");
if (counter) {
    counter.innerHTML = "0";
}
const updateTaskCounter = (taskCounter: string) => {
    if (counter) {
        counter.innerHTML = taskCounter;
    }
};

const setComputeButtonText = (newComputeButtonText: string) => {
    const computeButtonText = document.getElementById("computeButtonText");
    if (computeButtonText) {
        computeButtonText.innerHTML = newComputeButtonText;
    }
};

const setComputeButtonClass = (newComputeButtonClass: string) => {
    const computeButtonClass = document.getElementById("computeButton");
    if (computeButtonClass) {
        computeButtonClass.className = newComputeButtonClass;
    }
};

window.addEventListener("onload", () => {
    if (quiet === true) {
        computeState = true;
        run();
        newComputeButtonText = "Stop computing";
        setComputeButtonClass("btn btn-primary btn-lg m-3 bs-danger");
    } else newComputeButtonText = "Start computing";
});

newComputeButtonText = "Start computing";
setComputeButtonText(newComputeButtonText);
