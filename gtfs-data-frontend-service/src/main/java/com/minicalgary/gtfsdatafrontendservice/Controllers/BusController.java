package com.minicalgary.gtfsdatafrontendservice.Controllers;

import com.google.gson.JsonObject;
import com.minicalgary.gtfsdatafrontendservice.Entities.Result;
import com.minicalgary.gtfsdatafrontendservice.Services.BusService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
@Slf4j
@CrossOrigin
public class BusController {
    private final BusService busService;

    public BusController (BusService busService) {
        this.busService = busService;
    }

    @PostMapping("")
    public Result<JsonObject> passBusInfo() throws Exception {
        log.info("passing bus info");
        JsonObject busInfo = busService.getBus();
        return Result.success(busInfo);
    }
}
