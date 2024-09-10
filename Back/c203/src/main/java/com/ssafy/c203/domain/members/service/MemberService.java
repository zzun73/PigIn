package com.ssafy.c203.domain.members.service;

import com.ssafy.c203.domain.members.dto.RequestDto.SignUpDto;
import com.ssafy.c203.domain.members.entity.Members;
import java.security.NoSuchAlgorithmException;

public interface MemberService {

    void singUp(Members members) throws NoSuchAlgorithmException;
}
