package com.minicalgary.gtfsdatafrontendservice.Entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Route {
    private String routeID;
    private String routeShortName;
    private String routeLongName;
    private String tripID;
    private String direction;
}
