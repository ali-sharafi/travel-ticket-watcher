const City = require("./models/City");
const Travel = require("./models/Travel");
const alibaba = require("./sites/alibaba");

module.exports.GetAll = async () => {
    let cities = await City.find();
    let travels = await Travel.find();
    try {
        await alibaba(travels, cities);
    } catch (error) {
        logger(error);
    }
}