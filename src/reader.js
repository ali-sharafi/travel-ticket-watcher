const City = require("./models/City");
const Travel = require("./models/Travel");
const alibaba = require("./sites/alibaba");

module.exports.GetAll = async () => {
    let cities = await City.find();
    let travels = await Travel.find({ is_completed: false });
    try {
        for (let i = 0; i < travels.length; i++) {
            let travel = travels[i];
            addTravelAttributes(travel, cities);

            await alibaba(travel);
        }
    } catch (error) {
        logger(error);
    }
}

function addTravelAttributes(travel, cities) {
    let origin = cities.find(city => city.id == travel.origin);
    let destination = cities.find(city => city.id == travel.destination);
    travel.origin_code = origin.code;
    travel.destination_code = destination.code;
    travel.origin_name = destination.name;
    travel.destination_name = destination.name;
}