let a = '';
let b;
let eventSaver;
let operator;
const currentText = document.getElementById("current-text");

const createOperandElement = (event) => {
    let span = document.createElement("span");
    span.setAttribute('class', 'operand selector');
    span.appendChild(document.createTextNode(event.target.value))
    currentText.appendChild(span);
}

const createAnswerElement = (answer) => {
    let span = document.createElement('span');
    span.setAttribute('class', 'answer selector');
    span.appendChild(document.createTextNode(answer));
    currentText.appendChild(span);
}

const setVar = () => {
    let temp = document.querySelectorAll('.selector');
    let concat = ''
    for (item of temp) {
        concat += item.textContent;
    }
    concat = parseInt(concat, 10);
    return concat
}

const multiply = (a) => {
    let b = setVar();
    return a * b;
}

document.addEventListener("click", function (event) {
    if (event.target.matches(".num")) {
        if (eventSaver === '=') {
            currentText.textContent = ''
            eventSaver = ''
            a = '';
        }
        createOperandElement(event)
    } else if (event.target.matches('.multiply')) {
        if (currentText.textContent !== '') {
            eventSaver = ''
            operator = '*';
            a = setVar();
            currentText.innerHTML = ''
        }
    } else if (event.target.matches('.equals')) {
        if (a !== '' && currentText.innerHTML !== '') {
            switch (operator) {
                case '*':
                    b = multiply(a).toString();
                    currentText.innerHTML = '';
                    createAnswerElement(b);
                    eventSaver = event.target.textContent;
                case '+':
                    //
                case '-':
                    //
                case '/':
                    //
            }
            
        }
    }
})