package com.cms.dto;

public record CreateJobDto (
     String title,
    String description,
    String location,
    Double salary
){}
