import City from "../models/city";

export default class BaseEntity {
    declare cities: Array<City>;

    async readCities() {
        this.cities = await City.findAll();
    }

    getCityByID(cityID: number) {
        return this.cities.find(item => item.id == cityID);
    }
}