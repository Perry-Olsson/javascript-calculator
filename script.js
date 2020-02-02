let operands = []; //stores operation
let eventSaver; //Store last event when needed
let previousAnswer;

const evaluate = (op='') => {
    let ans;
    let operandArr = operands.map((item) => {
        if (item.length > 1 && item.length !== undefined) {
            return parseFloat(item.slice(0, item.indexOf('*')), 10) ** 2;
        } else { return item; }
    });
    for (let i = 0; i < operandArr.length; i++) {
        if (operandArr[i] === 'x') {
            ans = operandArr[i - 1] * operandArr[i + 1];
            operandArr.splice(i - 1, 3, ans);
            i--;
        } else if (operandArr[i] === '/') {
            ans = operandArr[i - 1] / operandArr[i + 1];
            operandArr.splice(i - 1, 3, ans);
            i--;
        }
    }
    while (operandArr.length > 1) {
        switch (operandArr[1]) {
            case '+':
                ans = operandArr[0] + operandArr[2];
                operandArr = operandArr.slice(3);
                operandArr.unshift(ans);
                break;
            case '-':
                ans = operandArr[0] - operandArr[2];
                operandArr = operandArr.slice(3);
                operandArr.unshift(ans);
                break;
        }
    
    }
    setAns(operandArr[0]);
}

//html element where numbers entered are displayed
const currentText = document.getElementById("current-text");
const history = document.getElementById('history');
currentText.textContent = ''

//creates and displays (in currentText element) an element when a digit or decimal is pressed
const createOperandElement = (text) => {
    let span = document.createElement("span");
    span.setAttribute('class', 'operand selector');
    span.appendChild(document.createTextNode(text))
    currentText.appendChild(span);
}

//creates and displays and element for an answer to a calculation
//different class from previous function so that backspace funciton doesn't work on it
const createAnswerElement = (answer) => {
    let span = document.createElement('span');
    span.setAttribute('class', 'answer selector');
    span.appendChild(document.createTextNode(answer));
    currentText.appendChild(span);
}

/*const createHistoryElement = (num, sign = '') => {
    history.textContent = '';
    let span = document.createElement('span');
    span.setAttribute('class', 'history-child');
    span.appendChild(document.createTextNode(`${num} ${sign}`));
    history.appendChild(span);
}*/
//deletes most recently entered digit or decimal point
const backSpace = () => {
    let temp1 = document.querySelectorAll('.operand');
    temp1[temp1.length - 1].remove();    
}

//turns entry into a number to be operated on
const parseEntry = () => {
    let temp = document.querySelectorAll('.selector');
    let concat = ''
    for (item of temp) {
        concat += item.textContent;
    }
    concat = parseFloat(concat, 10)/*.toFixed(2)*/;
    return concat
}

//saves first entry and/or operator when an operator key is pressed
const setVar = (op) => {
    if (currentText.textContent !== '') {
        /*if (currentText.firstChild.matches('.answer') && eventSaver === 'chain') {
            operands[operands.length - 1] = op
        } else {*/
        if (eventSaver === '=') { operands = [] }
        operands.push(parseEntry(), op);
        eventSaver = 'operator';
        currentText.textContent = '';
        history.textContent = operands.join(' ');
        //}
    } else {
        changeOperator(op);
    }
}

const numCompressor = (op) => {
    //checks to see if compressed chain equation can fit in text box
    // removes answer and checks again then converts to sci notation if needed
    if (eventSaver === 'chain') {
        history.textContent = `${ans}`;
    } else if (operator === '**' && eventSaver !== '**') {
        history.textContent = `${a} ${op} ${currentText.textContent}**2`;
    } else if (operator === '**' && eventSaver === '**') {
        history.textContent = history.textContent.replace(ans, '');
        if (history.textContent.length >= 21) {
            history.textContent = `${a.toExponential(2)}**2 =`;
        }
        return;
    } else {
        //compresses the chain equation history
        history.textContent = `${a} ${operator} ${b} = ${ans}`
        if (history.textContent.length >= 21) {
            history.textContent = `${a} ${operator} ${b} =`;
        }
    }
    
    if (history.textContent.length >= 21) {
        let arr = [a, b];
        let index;
        if (arr[0] >= arr[1]) {
            arr[0] = arr[0].toExponential(2);
            history.textContent = `${arr[0]} ${operator} ${arr[1]} =`;
            index = 1;
        }
        else {
            arr[1] = arr[1].toExponential(2);
            history.textContent = `${arr[0]} ${operator} ${arr[1]} =`;
            index = 0;
        }
        if (history.textContent.length >= 21) {
            arr[index] = arr[index].toExponential(2);
            history.textContent = `${arr[0]} ${operator} ${arr[1]} =`
        } 
    }
}

//displays answer in currentText element
const setAns = (ans, op) => {
    if (eventSaver !== 'chain') {
        history.textContent += ` = ${ans}`;
    }
    /*if (history.textContent.length >= 19) {
        numCompressor(op);
    } */
    currentText.textContent = '';
    if (ans.toString().length > 11) {
        if (ans / 100000000 < 1) {
            createAnswerElement(ans.toFixed(2));
        } else {
            createAnswerElement(ans.toExponential(2));
        }
    }
    else { createAnswerElement(ans.toString()); }
}


/*allows chain calculations e.g. 2 x 3 x 5 while displaying each answer as more 
numbers and operators are entered*/
const chainCalculate = (op) => {
    if (eventSaver !== '**') {
        operands.push(parseEntry());
    }
    eventSaver = 'chain';
    if (op === 'x' || op === '/') {
        if (operands.indexOf('+') !== -1 || operands.indexOf('-') !== -1) {
            currentText.textContent = '';
        }
    } else { evaluate(); }
    operands.push(op);
    history.textContent = operands.join(' ');
}

const changeOperator = (op) => {
    operands[operands.length - 1] = op;
    history.textContent = operands.join(' ');
}

document.addEventListener("click", function (event) {
    if (event.target.matches(".num") && currentText.childElementCount < 11) {
        if (eventSaver === '=' || eventSaver === '**') {
            currentText.textContent = '';
            history.textContent = '';
            eventSaver = '';
            operands = [];
        } else if (eventSaver === 'chain') {
            currentText.textContent = '';
            eventSaver = 'operator';
        }
        if (event.target.textContent !== '.' && currentText.textContent === '0') {
            currentText.textContent = '';
            createOperandElement(event.target.textContent);
        } else if (event.target.matches('.zero')) {
            if (currentText.textContent === '' || currentText.firstChild.textContent !== '0' || currentText.textContent.indexOf('.') !== -1) {
                createOperandElement(event.target.textContent);
            }
        } else if (event.target.matches('.decimal')) {
            if (currentText.textContent === '') {
                createOperandElement('0');
            }
            if (currentText.textContent.indexOf('.') === -1) {
                createOperandElement(event.target.textContent);
            }
        } else { createOperandElement(event.target.textContent); }
    } else if (event.target.matches('.clear-all')) {
        history.textContent = '';
        currentText.textContent = '';
        a = '';
        eventSaver = '';
        operands = [];
    } else if (currentText.textContent !== '' || eventSaver === 'operator') {
        if (currentText.textContent !== '' && event.target.matches('.back-space') && currentText.firstChild.matches('.operand')) {
            backSpace();
        } else if (currentText.textContent !== '' && event.target.matches('.clear') && currentText.firstChild.matches('.operand')) {
            currentText.textContent = '';
        } else if (event.target.matches('.multiply')) {
            if (currentText.textContent !== '' && operands[0] !== undefined && currentText.firstChild.matches('.operand') || eventSaver === '**') {               
                    chainCalculate('x');
            } else {
                if (eventSaver === 'chain') {
                    changeOperator('x');
                } else {
                    setVar('x');
                }
            }
        } else if (event.target.matches('.add')) {
            if (currentText.textContent !== '' && operands[0] !== undefined && currentText.firstChild.matches('.operand') || eventSaver === '**') {
                chainCalculate('+'); 
            } else {
                if (eventSaver === 'chain') {
                    changeOperator('+');
                } else {
                    setVar('+');
                }
            }
        } else if (event.target.matches('.subtract')) {
            if (currentText.textContent !== '' && operands[0] !== undefined && currentText.firstChild.matches('.operand') || eventSaver === '**') {
                chainCalculate('-');
            } else {
                if (eventSaver === 'chain') {
                    changeOperator('-');
                } else {
                    setVar('-');
                }
            }
        } else if (event.target.matches('.divide')) {
            if (currentText.textContent !== '' && operands[0] !== undefined && currentText.firstChild.matches('.operand') || eventSaver === '**') {
                chainCalculate('/');
            } else {
                if (eventSaver === 'chain') {
                    changeOperator('/');
                } else {
                    setVar('/');
                }
            }
        } else if (event.target.matches('.squared') && currentText.textContent !== '' && eventSaver !== 'chain') { 
            if (eventSaver === '**') {
                if (operands.length < 2) {
                    operands = [];
                }
                else {
                    operands.pop();
                }
            }
            operands.push(`${parseEntry()}**2`) 
            history.textContent = operands.join(' ');
            if (eventSaver === 'chain' || eventSaver === 'operator' || eventSaver === '**' && operands.length > 1) {
                let tempAns = parseEntry() ** 2;
                currentText.textContent = '';
                createAnswerElement(tempAns.toString());
            } else { evaluate(); }
            eventSaver = '**'; 
        } else if (event.target.matches('.equals') && operands != [] && currentText.textContent !== '' && eventSaver !== 'chain') {
            let temp = parseEntry();
            if (eventSaver === '=') {
                if (operands.length < 2) {
                    operands = [`${temp}**2`]
                } else {
                    operands = operands.slice(-2);
                    operands.unshift(temp);
                }
            } else if (eventSaver === '**') { 
                if (operands.length < 2) {
                    operands = [`${temp}**2`]
                } 
            } else { operands.push(temp); }
            history.textContent = operands.join(' ');
            evaluate(operands);
            eventSaver = '=';
        }
    }
})