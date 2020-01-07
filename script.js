const textArea = document.querySelector("textarea");
const currentText = document.getElementById("current-text");

const createSpanElement = (event) => {
    let span = document.createElement("span");
    span.appendChild(document.createTextNode(event.target.value))
    currentText.appendChild(span);
}

document.addEventListener("click", function (event) {
    if (event.target.matches(".num")) {
        createSpanElement(event)
    }
})