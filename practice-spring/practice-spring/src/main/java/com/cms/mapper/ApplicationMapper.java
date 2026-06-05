package com.cms.mapper;

import com.cms.dto.ApplicationResponseDto;
import com.cms.entity.Application;
import org.springframework.stereotype.Component;

@Component

public class ApplicationMapper {
    public ApplicationResponseDto mapEntityToDto(Application application) {
        return new ApplicationResponseDto(
                application.getId(),
                application.getAppliedAt(),
                application.getJob().getTitle(),
                application.getJob().getEmployee().getCompanyName()
        );
    }
}

