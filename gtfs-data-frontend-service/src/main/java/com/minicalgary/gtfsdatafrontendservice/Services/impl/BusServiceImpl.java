package com.minicalgary.gtfsdatafrontendservice.Services.impl;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.minicalgary.gtfsdatafrontendservice.Entities.Route;
import com.minicalgary.gtfsdatafrontendservice.Mappers.RouteMapper;
import com.minicalgary.gtfsdatafrontendservice.Services.BusService;
import com.minicalgary.gtfsdatafrontendservice.Utils.Utils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;


@Service
@Slf4j
public class BusServiceImpl implements BusService {

    private final RouteMapper routeMapper;

    public BusServiceImpl (RouteMapper routeMapper) {
        this.routeMapper = routeMapper;
    }

    @Override
    public JsonObject getBus() throws Exception {
        String busInfo= Utils.getGtfsData("vehicle");
        Gson gson = new Gson();
        JsonElement jsonElement = gson.fromJson(busInfo, JsonElement.class);
        // original info json
        JsonObject busInfoJson= jsonElement.getAsJsonObject();
        JsonArray entities = (JsonArray) busInfoJson.get("entity");

        // return geoJson
        JsonObject busGeoJson = new JsonObject();
        busGeoJson.addProperty("type", "FeatureCollection");
        busGeoJson.addProperty("features", "");

        // features array list
        JsonArray features = new JsonArray();

        for (JsonElement entity: entities) {
            JsonObject busJsonObject = (JsonObject) entity.getAsJsonObject().get("vehicle");
            JsonObject busTrip = (JsonObject) busJsonObject.get("trip");
            JsonObject busPosition = (JsonObject) busJsonObject.get("position");

            // get bus information
            String tripID=  busTrip.get("tripId").getAsString();
            double busLong =  busPosition.get("longitude").getAsDouble();
            double busLat =  busPosition.get("latitude").getAsDouble();
            JsonArray coordinatesArray = new JsonArray();
            coordinatesArray.add(busLong);
            coordinatesArray.add(busLat);

            long busUpdateTimestamp= busJsonObject.get("timestamp").getAsLong();
            Date busUpdateTime = new Date(busUpdateTimestamp*1000);
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String busUpdateTimeStr = sdf.format(busUpdateTime);

            // Create geometry object
            JsonObject geometry = new JsonObject();
            geometry.addProperty("type", "Point");
            geometry.add("coordinates", coordinatesArray);

            // properties
            JsonObject properties = new JsonObject();
            properties.addProperty("update_time", busUpdateTimeStr);

            Route busByID = routeMapper.getBusesInfoByID(tripID);
            if (busByID != null) {
                properties.addProperty("route_short_name", busByID.getRouteShortName());
                properties.addProperty("route_long_name", busByID.getRouteLongName());
                properties.addProperty("direction", busByID.getDirection());
                // feature
                JsonObject feature = new JsonObject();
                feature.addProperty("type", "Feature");
                feature.add("properties", properties);
                feature.add("geometry", geometry);

                features.add(feature);
            }
        }

        busGeoJson.add("features", features);
        log.info(String.valueOf(busGeoJson));

        return busGeoJson;
    }
}
