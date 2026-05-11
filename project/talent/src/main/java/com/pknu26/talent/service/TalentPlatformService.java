package com.pknu26.talent.service;

import com.pknu26.talent.mapper.ServiceMapper;
import com.pknu26.talent.model.Application;
import com.pknu26.talent.model.TalentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TalentPlatformService {

    private final ServiceMapper serviceMapper;

    public List<TalentService> getAllServices() {
        return serviceMapper.findAllServices();
    }

    public TalentService getServiceById(Long id) {
        return serviceMapper.findServiceById(id);
    }

    @Transactional
    public void registerService(TalentService service) {
        serviceMapper.insertService(service);
    }

    @Transactional
    public void applyForService(Application application) {
        serviceMapper.insertApplication(application);
    }
}
