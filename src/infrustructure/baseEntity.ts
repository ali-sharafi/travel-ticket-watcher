import City from "../models/city";
import Travel from "../models/travel";

export default class BaseEntity {
    declare cities: Array<City>;

    async readCities() {
        this.cities = await City.findAll();
    }

    getCityByID(cityID: number) {
        return this.cities.find(item => item.id == cityID);
    }

    protected addTravelAttributes(travel: Travel) {
        let origin: City = this.getCityByID(travel.origin)!;
        let destination: City = this.getCityByID(travel.destination)!;
        travel.origin_code = origin.code;
        travel.destination_code = destination.code;
        travel.origin_name = destination.name;
        travel.destination_name = destination.name;
        return travel;
    }
}