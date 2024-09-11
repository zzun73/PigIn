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
    private String password;

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

    @Column(nullable = false)
    private String salt;

    @Column(nullable = false)
    private String refreshToken;

    @Builder
    public Members(String email, String password, String name, String phoneNumber,
        WithDrawalStatus status, String userKey, String birth, String salt) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.status = status;
        this.userKey = userKey;
        this.birth = birth;
        this.salt = salt;
    }

    public void updateUserKey(String userKey) {
        this.userKey = userKey;
    }

    public void updateSalt(String salt) {
        this.salt = salt;
    }

    public void updatePassword(String password) {
        this.password = password;
    }
}
