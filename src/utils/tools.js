const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const convertStringToDateTime = (relativeTime) => {
    const timeUnits = {
        hours: 60 * 60 * 1000,
        hour: 60 * 60 * 1000,
        minutes: 60 * 1000,
        seconds: 1000,
    };
    const now = new Date();
    const timestamp = now.getTime();
    const match = /(\d+)\s+(\w+)\s+ago/.exec(relativeTime);
    const value = parseInt(match[1]);
    const unit = match[2];

    const msAgo = value * timeUnits[unit];
    const adjustedTimestamp = timestamp - msAgo;
    const datetime = new Date(adjustedTimestamp);
    return datetime.toISOString().replace(/T|Z/g, ' ').trim();

}

module.exports = {
    sleep,
    convertStringToDateTime
}