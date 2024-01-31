package com.minicalgary.gtfsdatafrontendservice.Utils;

import com.google.protobuf.util.JsonFormat;
import com.google.transit.realtime.GtfsRealtime;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;

@Slf4j
public class Utils {

    public static String getGtfsData(String type) throws Exception {

        if (type.equals("vehicle")) {
            URL vehicleUrl = new URL("https://data.calgary.ca/download/am7c-qe3u/application%2Foctet-stream");
            InputStream vehicleStream = vehicleUrl.openStream();
            GtfsRealtime.FeedMessage vehicleFeed = GtfsRealtime.FeedMessage.parseFrom(vehicleStream);
            String vehicleJsonString= JsonFormat.printer().print(vehicleFeed);

            return vehicleJsonString;
        } else if (type.equals("trip")) {
            URL tripUrl = new URL("https://data.calgary.ca/download/gs4m-mdc2/application%2Foctet-stream");
            InputStream tripStream = tripUrl.openStream();
            GtfsRealtime.FeedMessage tripFeed= GtfsRealtime.FeedMessage.parseFrom(tripStream);
            String tripJsonString= JsonFormat.printer().print(tripFeed);

            return tripJsonString;
        }

        return null;

//        for (GtfsRealtime.FeedEntity entity : vehicleFeed.getEntityList()) {
//            // FeedEntity can represent 3 things:
//            // Trip updates, Service Alerts, and Vehicle Position
//            if (entity.hasVehicle()) {
//                GtfsRealtime.VehiclePosition vp = entity.getVehicle();
//                String json = JsonFormat.printer().print(vp);
//            }
//        }

//        for (GtfsRealtime.FeedEntity entity : tripFeed.getEntityList()) {
//            if (entity.hasTripUpdate()) {
//                GtfsRealtime.TripUpdate tu= entity.getTripUpdate();
//                System.out.println(tu);
//                System.out.println("======");
//            }
//        }
    }

}
