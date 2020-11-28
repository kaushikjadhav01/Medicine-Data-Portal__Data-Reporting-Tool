export const initRowData = (data) => {
    let rowValueList = [...data]
    for (let i = 0; i < 500; i++) {
        rowValueList.push({})
    }
    return rowValueList
}

export const suppressEnter = (params) => {
    var KEY_ENTER = 13;
    var event = params.event;
    var key = event.which;
    var suppress = key === KEY_ENTER;
    return suppress;
}

export const getReportHeight = () => {
    return window.innerHeight - 230
}