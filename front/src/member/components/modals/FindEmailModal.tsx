import React, { useState, useEffect } from 'react';
import { useMemberStore } from '../../../store/memberStore'; // Zustand로 관리되는 상태를 가져옴
import axiosInstance from '../../../api/axiosInstance';
import SuccessModal from './SuccessModal'; // 성공 모달 컴포넌트
import FailModal from './FailModal'; // 실패 모달 컴포넌트
import SubmissionCompleteModal from './SubmissionCompleteModal'; // 새로운 모달 추가
import { X } from 'lucide-react';
import { CgChevronLeft } from 'react-icons/cg'; // 뒤로 가기 아이콘
import { FaCheckCircle } from 'react-icons/fa'; // 확인 아이콘 및 일치하지 않을 때 빨간 체크 아이콘
const FindEmailModal: React.FC = () => {
  const {
    isFindEmailModalOpen,
    openLoginModal,
    closeFindEmailModal,
    formData,
    setFormData,
  } = useMemberStore();

  // 상태 관리
  const [isCodeSent, setIsCodeSent] = useState(false); // 인증번호 전송 상태
  const [authenticationNumber, setAuthenticationNumber] = useState(''); // 인증번호
  const [isPhoneNumberVerified, setIsPhoneNumberVerified] = useState(false); // 인증번호 확인 여부
  const [showSuccessModal, setShowSuccessModal] = useState(false); // 성공 모달
  const [successMessage, setSuccessMessage] = useState(''); // 성공 메시지
  const [showFailModal, setShowFailModal] = useState(false); // 실패 모달
  const [failMessage, setFailMessage] = useState(''); // 실패 메시지
  const [isSubmissionComplete, setIsSubmissionComplete] = useState(false); // 제출 완료 상태

  useEffect(() => {
    if (isFindEmailModalOpen) {
      // formData 초기화
      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
      });
    }
  }, [isFindEmailModalOpen, setFormData]);

  if (!isFindEmailModalOpen) return null; // 모달이 닫혀있으면 렌더링하지 않음

  // 뒤로 가기 버튼 클릭 시 호출되는 함수
  const handleBackClick = () => {
    closeFindEmailModal(); // 회원가입 모달 닫기
    openLoginModal(); // 로그인 모달 열기
  };

  // 입력 필드가 변경될 때 호출되는 핸들러 함수
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // 전화번호 입력 시 하이픈 자동 추가
    if (name === 'phoneNumber') {
      const formattedValue = value
        .replace(/[^0-9]/g, '') // 숫자만 입력받기
        .replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'); // 하이픈 추가
      setFormData({ ...formData, phoneNumber: formattedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // 전화번호에서 하이픈 제거하는 함수
  const removeHyphenFromPhoneNumber = (phoneNumber: string): string => {
    return phoneNumber.replace(/-/g, ''); // 하이픈(-)을 제거
  };

  // SMS 인증 요청 핸들러
  const requestVerificationCode = async () => {
    try {
      const sanitizedPhoneNumber = removeHyphenFromPhoneNumber(
        formData.phoneNumber
      );

      const requestData = {
        name: formData.name,
        phoneNumber: sanitizedPhoneNumber,
      };

      const response = await axiosInstance.post(
        `api/member/mms-number-generate`,
        requestData
      );

      console.log('requestData: ', requestData);

      if (response.status === 200) {
        setIsCodeSent(true);
        setSuccessMessage('인증번호 요청이 성공하였습니다.');
        setShowSuccessModal(true);
      } else {
        setFailMessage('인증번호 요청이 실패하였습니다.');
        setShowFailModal(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setFailMessage('인증번호 요청이 실패하였습니다.');
      setShowFailModal(true);
    }
  };

  // SMS 인증번호 검증 핸들러
  const verifyAuthenticationCode = async () => {
    try {
      const sanitizedPhoneNumber = removeHyphenFromPhoneNumber(
        formData.phoneNumber
      );

      const requestData = {
        phoneNumber: sanitizedPhoneNumber,
        authenticationNumber: authenticationNumber,
      };

      const response = await axiosInstance.post(
        `api/member/mms-number-compare`,
        requestData
      );

      if (response.status === 200) {
        setIsPhoneNumberVerified(true);
        setSuccessMessage('인증에 성공했습니다.');
        setShowSuccessModal(true);
      } else {
        setFailMessage('인증번호가 일치하지 않습니다.');
        setShowFailModal(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setFailMessage('인증번호 검증에 실패했습니다.');
      setShowFailModal(true);
    }
  };

  // 인증번호 입력 변경 핸들러
  const handleAuthNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthenticationNumber(e.target.value);
  };

  // 이메일 찾기 API 요청 핸들러
  const findEmailByPhoneNumber = async () => {
    try {
      const sanitizedPhoneNumber = removeHyphenFromPhoneNumber(
        formData.phoneNumber
      );

      // 전달할 데이터 설정
      const data = {
        name: formData.name,
        phoneNumber: sanitizedPhoneNumber,
      };

      console.log('제출 데이터 : ', data);

      // POST 요청 시, 데이터는 쿼리 파라미터로 전달
      const response = await axiosInstance.post(
        'api/member/find-id',
        data // 데이터를 request body로 전송
      );
      if (response.status === 200) {
        setSuccessMessage(`찾은 이메일 : ${response.data}`);
        formData.email = response.data;
        setIsSubmissionComplete(true); // 제출 완료 상태 설정
      } else {
        console.log('이메일 찾기 실패!');
        setFailMessage('이메일을 찾을 수 없습니다.');
        setShowFailModal(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setFailMessage('이메일 찾기 요청이 실패했습니다.');
      setShowFailModal(true);
    }
  };

  const handleSuccessModalClose = () => {
    openLoginModal(); // 로그인 모달 열기
    closeFindEmailModal();
  };

  // 모든 입력 필드가 올바르게 채워졌는지 확인하는 함수
  const isFormValid = () => {
    return (
      formData.name &&
      formData.phoneNumber.length === 13 &&
      authenticationNumber.length === 6 &&
      isPhoneNumberVerified
    );
  };

  // 폼 제출 시 호출되는 핸들러 함수
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지
    findEmailByPhoneNumber(); // 이메일 찾기 API 호출
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-20"
      onClick={closeFindEmailModal}
    >
      {/* 모달 본체 */}
      <div
        className="modal-content relative bg-white rounded-lg shadow-lg w-full max-w-md p-6 animate-slide-up"
        onClick={(e) => e.stopPropagation()} // 이벤트 전파 방지
      >
        {/* 뒤로가기 버튼 */}
        <p
          onClick={handleBackClick}
          className="absolute top-6 left-4 text-gray-400 hover:text-gray-600"
        >
          <CgChevronLeft size={32} />
        </p>
        {/* 제목 */}
        <h2 className="text-xl font-bold mb-6 text-center">아이디 찾기</h2>
        {/* 닫기 버튼 */}
        <X
          onClick={closeFindEmailModal}
          className="absolute top-6 right-5 w-8 h-8 text-gray-400 hover:text-gray-600"
        />
        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-3 w-full"
        >
          {/* 이름 입력 필드 */}
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="이름"
            className="flex-1 p-2 border-b border-gray-300 focus:outline-none focus:border-green-300"
          />

          {/* 전화번호 입력 필드와 인증 버튼 */}
          <div className="relative flex space-x-2 items-center">
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="전화번호 (예: 01012345678)"
              className="flex-1 p-2 border-b border-gray-300 focus:outline-none focus:border-green-300"
              maxLength={13}
            />
            {isPhoneNumberVerified && (
              <FaCheckCircle className="absolute right-[6.5rem] top-1/2 transform -translate-y-1/2 text-green-500" />
            )}
            <button
              type="button"
              onClick={requestVerificationCode}
              className={`p-2 rounded ml-2 text-md ${
                formData.phoneNumber.length === 13 && !isCodeSent
                  ? 'bg-[#9CF8E1] text-gray-900 hover:bg-[#9CF8E1]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={formData.phoneNumber.length !== 13 || isCodeSent}
            >
              {isCodeSent ? '요청 완료' : '인증 요청'}
            </button>
          </div>

          {/* 인증번호 입력 필드 */}
          {isCodeSent && (
            <div className="relative flex space-x-2 items-center">
              <input
                type="text"
                value={authenticationNumber} // authenticationNumber 상태를 사용
                onChange={handleAuthNumberChange} // 입력 변경 시 상태 업데이트
                placeholder="인증번호 입력"
                className="flex-1 p-2 border-b border-gray-300 focus:outline-none focus:border-green-300"
                maxLength={6} // 인증번호는 6자리로 제한
              />
              {/* 인증이 완료되었을 때 체크 아이콘 표시 */}
              {isPhoneNumberVerified && (
                <FaCheckCircle className="absolute right-[6.5rem] top-1/2 transform -translate-y-1/2 text-green-500" />
              )}
              <button
                type="button"
                onClick={verifyAuthenticationCode} // 인증번호 검증 핸들러 호출
                className={`p-2 ml-2 rounded ${
                  isPhoneNumberVerified
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' // 인증 완료 시 비활성화
                    : 'bg-customAqua text-gray-700'
                }`}
                disabled={isPhoneNumberVerified} // 인증 완료 시 버튼 비활성화
              >
                {isPhoneNumberVerified ? '인증 완료' : '인증 확인'}
              </button>
            </div>
          )}

          <button
            type="submit"
            className={`w-full py-2 rounded ${
              isFormValid()
                ? 'bg-[#9CF8E1] text-gray-900 font-semibold hover:bg-[#9CF8E1]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!isFormValid()}
          >
            아이디 찾기
          </button>
        </form>

        {/* 성공 모달 */}
        {showSuccessModal && (
          <SuccessModal
            setShowModal={setShowSuccessModal}
            title={successMessage}
            buttonText="확인"
            buttonColor="bg-customAqua"
            buttonHoverColor="hover:bg-[#7ee9ce]"
          />
        )}

        {/* 실패 모달 */}
        {showFailModal && (
          <FailModal
            setShowModal={setShowFailModal}
            title={failMessage}
            buttonText="확인"
            buttonColor="bg-customRed"
            buttonHoverColor="hover:bg-[#FF2414]"
          />
        )}
      </div>

      {/* 제출 성공 모달 */}
      {isSubmissionComplete && (
        <SubmissionCompleteModal
          onConfirm={handleSuccessModalClose}
          title={successMessage}
        />
      )}
    </div>
  );
};

export default FindEmailModal;
