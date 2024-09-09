package com.ssafy.c203.domain.members.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Members {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String phoneNumber;

    @Column(nullable = false)
    private WithDrawalStatus status;

    @Column(nullable = false)
    private String userKey;

    @Column(nullable = false)
    private String birth;

    @Builder
    public Members(String email, String name, String phoneNumber, WithDrawalStatus status,
        String userKey, String birth) {
        this.email = email;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.status = status;
        this.userKey = userKey;
        this.birth = birth;
    }
}
