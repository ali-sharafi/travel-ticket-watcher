import fs from 'fs';
import { getDate, getDateTime } from './tools';

const logger = (message: string, filename = '', showInConsole = true) => {
    const logText = `${getDateTime()}     ` + message + '\r\n';
    if (showInConsole)
        console.log(logText);

    const file = `./logs/${getDate()}${filename ? '-' + filename : ''}.log`

    fs.appendFile(file, logText, 'utf8', (error) => {
        if (error) {
            console.log(getDateTime() + ' -> ' + error);
        }
    });
}

export default logger;