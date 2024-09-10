package com.ssafy.c203.domain.members.controller;

import com.ssafy.c203.domain.members.dto.RequestDto.SignUpDto;
import com.ssafy.c203.domain.members.entity.Members;
import com.ssafy.c203.domain.members.entity.WithDrawalStatus;
import com.ssafy.c203.domain.members.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
@Slf4j
public class MemberController {

    private final MemberService memberService;

    @PostMapping("sign-up")
    public ResponseEntity<?> signUp(@ModelAttribute SignUpDto signUpDto) {
        memberService.singUp(Members
            .builder()
            .name(signUpDto.getName())
            .email(signUpDto.getEmail())
            .birth(signUpDto.getBirth())
            .phoneNumber(signUpDto.getPhoneNumber())
            .status(WithDrawalStatus.ACTIVE)
            .password(signUpDto.getPassword())
            .build());
        return null;
    }
}
