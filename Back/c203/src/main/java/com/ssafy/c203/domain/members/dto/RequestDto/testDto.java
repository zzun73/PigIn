package com.ssafy.c203.domain.members.dto.RequestDto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Builder
public class testDto {

    private String email;
    private String name;
    private String phoneNumber;
    private String userKey;
    private String birth;
}
