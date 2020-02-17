const spruceUp = () => {
    const operandMakeOver = operands.map((item, index) => {
        if (item.length !== undefined) {
            if (item.indexOf('r') !== -1) {
                if (index === 0) {
                    return `<img src='https://image.flaticon.com/icons/svg/43/43743.svg' style='left: 0px'width='50px' height='50px'><span style='right:15px; margin-right: 0'>${(item.slice(item.indexOf('r') + 1))}</span>`;
                }
                return `<img src='https://image.flaticon.com/icons/svg/43/43743.svg' width='50px' height='50px'><span>${(item.slice(item.indexOf('r') + 1))}</span>`;
            } else { return item; }
        } else { return item; }
    })
    return operandMakeOver;
}