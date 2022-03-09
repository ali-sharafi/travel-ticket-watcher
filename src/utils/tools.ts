import moment from 'moment-jalaali';

const sleep: Function = async (millis: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, millis));
}

const getDate = (): string => {
    return moment().format('YYYY-MM-DD');
}

const getDateTime = (): string => {
    return moment().format('YYYY-MM-DD HH:mm:ss');
}

export {
    sleep,
    getDate,
    getDateTime
}