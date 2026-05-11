package com.pknu26.talent.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.pknu26.talent.model.Application;
import com.pknu26.talent.model.TalentService;

@Mapper
public interface ServiceMapper {
    List<TalentService> findAllServices();
    TalentService findServiceById(Long id);
    void insertService(TalentService service);
    void insertApplication(Application application);
}
