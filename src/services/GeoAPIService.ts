import { Injectable } from "@nestjs/common";
import { Client } from "@googlemaps/google-maps-services-js";
import * as process from "process";

const client = new Client({});
@Injectable()
export class GeoAPIService {
    test() {
        client
            .elevation({
                params: {
                    locations: [{ lat: 45, lng: -110 }],
                    key: process.env.API_KEY,
                },
                timeout: 1000, // milliseconds
            })
            .then((r) => {
                console.log(r.data.results[0].elevation);
            })
            .catch((e) => {
                console.log(e.response.data.error_message);
            });
    }

    async getLatLong(address: string) {
        const geoData = await client.geocode({
            params: {
                address,
                key: process.env.API_KEY,
            },
        });

        const loc = geoData.data.results[0].geometry.location;
        return {
            latitude: loc.lat,
            longitude: loc.lng,
        };
    }
}
