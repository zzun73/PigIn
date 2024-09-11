package com.ssafy.c203.domain.members.repository;

import com.ssafy.c203.domain.members.entity.MMSAuthentication;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MMSAuthenticationRepository extends JpaRepository<MMSAuthentication, Long> {

}
