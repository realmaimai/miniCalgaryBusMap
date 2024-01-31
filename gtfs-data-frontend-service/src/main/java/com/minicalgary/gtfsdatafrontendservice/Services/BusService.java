package com.minicalgary.gtfsdatafrontendservice.Services;

import com.google.gson.JsonObject;

public interface BusService{
    JsonObject getBus() throws Exception;
}
