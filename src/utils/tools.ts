const sleep: Function = async (millis: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, millis));
}

export {
    sleep
}