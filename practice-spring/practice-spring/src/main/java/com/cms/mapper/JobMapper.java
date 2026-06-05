package com.cms.mapper;

import com.cms.dto.CreateJobDto;
import com.cms.dto.JobResponseDto;
import com.cms.entity.Job;
import org.springframework.stereotype.Component;

@Component
public class JobMapper {
    public Job mapDtoToEntity(CreateJobDto   dto) {
        Job job = new Job();
        job.setTitle(dto.title());
        job.setDescription(dto.description());
        job.setLocation(dto.location());
        job.setSalary(dto.salary());
        return job;
    }

    public JobResponseDto  mapEntityToDto(Job job) {
        return new JobResponseDto(
                job.getId(),
                job.getTitle(),
                job.getLocation(),
                job.getSalary(),
                job.getEmployee().getCompanyName()
        );
    }
}
