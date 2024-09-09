package com.ssafy.c203.domain.members.repository;

import com.ssafy.c203.domain.members.entity.Members;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MembersRepository extends JpaRepository<Members, Integer> {

}
