package com.minicalgary.gtfsdatafrontendservice.Mappers;

import com.minicalgary.gtfsdatafrontendservice.Entities.Route;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Component;

@Mapper
@Component
public interface RouteMapper {
    void insert(Route route);

    Route getBusesInfoByID(String tripID);
}
