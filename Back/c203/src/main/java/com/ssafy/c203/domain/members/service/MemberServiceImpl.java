package com.ssafy.c203.domain.members.service;

import com.ssafy.c203.domain.account.entity.SavingsAccount;
import com.ssafy.c203.domain.account.repository.SavingsAccountRepository;
import com.ssafy.c203.domain.members.dto.RequestDto.MMSDto;
import com.ssafy.c203.domain.members.dto.ResponseDto.AccountNoDto;
import com.ssafy.c203.domain.members.dto.ResponseDto.UserKeyDto;
import com.ssafy.c203.domain.members.entity.MMSAuthentication;
import com.ssafy.c203.domain.members.entity.Members;
import com.ssafy.c203.domain.members.repository.MMSAuthenticationRepository;
import com.ssafy.c203.domain.members.repository.MembersRepository;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {

    private final MembersRepository membersRepository;
    private final PasswordEncrypt passwordEncrypt;
    private final RestTemplate restTemplate;
    private final SavingsAccountRepository savingsAccountRepository;
    private final MMSAuthenticationRepository authenticationRepository;

    private static final String MMS_MESSAGE_HEADER = "본인인증을 위해 다음 인정 번호를 입력 바랍니다.\n";
    @Value("123.123.123.123")
    private String MY_SSAFYDATA_BASE_URL;


    @Override
    public void singUp(Members members) throws NoSuchAlgorithmException {
        //솔트값 generate
        String salt = passwordEncrypt.generateSalt();

        //패스워드 암호화
        String password = passwordEncrypt.encrypt(members.getPassword(), salt);

        //members에 salt값, password 지성
        members.updatePassword(password);
        members.updateSalt(salt);

        //userkey 지정
        Map<String, String> requestBody = new HashMap<String, String>();
        requestBody.put("userId", members.getEmail());

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<UserKeyDto> UserKeyResponse = restTemplate.exchange(
            MY_SSAFYDATA_BASE_URL,
            HttpMethod.POST,
            entity,
            UserKeyDto.class
        );

        String userKey = UserKeyResponse.getBody().getUserKey();
        //Todo : getUserKey가 NULL일때 처리 필요
        members.updateUserKey(userKey);
        Members member = membersRepository.save(members);

        //계좌 개설
        requestBody = new HashMap<>();
        requestBody.put("userKey", userKey);

        entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<AccountNoDto> AccountNoResponse = restTemplate.exchange(
            MY_SSAFYDATA_BASE_URL,
            HttpMethod.POST,
            entity,
            AccountNoDto.class
        );

        String accountNo = AccountNoResponse.getBody().getAccountNo();
        //Todo : accountNo가 Null일때 처리 필요
        savingsAccountRepository.save(SavingsAccount
            .builder()
            .accountNo(accountNo)
            .member(member)
            .build());
    }

    @Override
    public boolean MMSGenerate(MMSDto mmsDto) throws Exception {
        MMSService mmsService = new MMSService(restTemplate);

        //6자리 인증번호 만들기
        Random generator = new Random();
        generator.setSeed(System.currentTimeMillis());
        String authenticationNumber = String.valueOf(generator.nextInt(1000000) % 1000000);

        //메시지 보내기
        String message = MMS_MESSAGE_HEADER + "[" + authenticationNumber + ']';
        boolean isSend = mmsService.sendMMS(message, mmsDto.getPhoneNumber());

        if (isSend) {
            authenticationRepository.save(MMSAuthentication
                .builder()
                .num(authenticationNumber)
                .phoneNumber(mmsDto.getPhoneNumber())
                .build());
            return true;
        }
        return false;
    }
}
