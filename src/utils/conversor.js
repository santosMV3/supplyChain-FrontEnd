export const toReal = (value) => {
    if (value) {
        const valueToFloat = parseFloat(value)
        return valueToFloat.toLocaleString("pt-BR", {style: "currency", currency: "BRL"})
    }

    return null;
}

export const formatDate = (date) => {
    if (date) {
        if (date.indexOf('-') > -1) {
            if (date.indexOf('T') === -1) {
                date = date.split(' ');
                date = date[0].split('-');
                date = `${date[2]}/${date[1]}/${date[0]}`;
            } else {
                date = date.split('T');
                date = date[0].split('-');
                date = `${date[2]}/${date[1]}/${date[0]}`;
            }
        };
    }

    return date;
}

export const formatDateTime = (date) => {
    if (date) {
        if (date.indexOf('-') === -1) return date;
        date = date.split('T');
        let time = date[1].split('.');
        date = date[0].split('-');
        time = time[0].split(':');
        return `${date[2]}/${date[1]}/${date[0]} ${time[0]}:${time[1]}`;
    }

    return false;
}

export const formatDateAmerican = (date) => {
    if (date) {
        const day = (date.getDate()).toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }
    return false;
}