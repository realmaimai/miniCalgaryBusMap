package com.minicalgary.gtfsdatafrontendservice.Entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Bus implements Serializable {
    private Integer id;
    private String trip;
    private String timeStamp;
    private int[] position;
}
