package com.minicalgary.gtfsdatafrontendservice.Mappers;

import com.minicalgary.gtfsdatafrontendservice.Entities.Route;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Component;

@Mapper
@Component
public interface RouteMapper {
    Route getBusesInfoByID(String tripID);
}
