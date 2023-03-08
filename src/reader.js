const alibaba = require("./sites/alibaba");

module.exports.GetAll = async () => {
    try {
        await alibaba();
    } catch (error) {
        logger(error);
    }
}