import React from 'react';

// SuccessModal 컴포넌트의 props 타입을 정의
interface SuccessModalProps {
  setShowModal: (show: boolean) => void; // 모달을 닫기 위한 상태 변경 함수
  title: string; // 모달의 제목을 표시할 문자열
  buttonText: string; // 버튼에 표시할 텍스트
  buttonColor?: string; // 버튼 색상 (선택 사항, 기본값 있음)
  buttonHoverColor?: string; // 버튼 hover 색상 (선택 사항, 기본값 있음)
  onConfirm?: () => void; // 확인 버튼 클릭 시 실행될 함수 (선택 사항)
}

// SuccessModal 컴포넌트를 정의
const SuccessModal: React.FC<SuccessModalProps> = ({
  setShowModal, // 부모 컴포넌트에서 전달받은 모달을 닫기 위한 함수
  title, // 모달의 제목 텍스트
  buttonText, // 버튼에 표시할 텍스트
  buttonColor = 'bg-customAqua', // 기본값으로 customAqua 색상을 버튼 배경으로 설정
  buttonHoverColor = 'hover:bg-[#7ee9ce]', // 기본 hover 색상 customAqua (#7ee9ce)
  onConfirm, // 확인 버튼 클릭 시 실행될 함수
}) => {
  return (
    // 모달의 배경 (화면 전체를 덮는 검은 반투명 배경)
    <div className="modal-content fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
      {/* 모달 본체: 흰색 배경에 그림자와 패딩, 둥근 모서리 스타일 */}
      <div
        className="modal-content bg-white p-6 rounded-lg shadow-lg w-80 animate-slide-up"
        onClick={(e) => e.stopPropagation()} // 이벤트 전파 방지
      >
        {/* 모달의 제목을 표시, 줄바꿈을 허용하는 스타일 적용 */}
        <h2
          className="text-xl font-bold text-black mt-5 mb-10 text-center"
          style={{ whiteSpace: 'pre-wrap' }} // 텍스트 내에서 줄바꿈을 유지
        >
          {title} {/* 부모로부터 전달받은 제목 표시 */}
        </h2>

        {/* 모달을 닫는 버튼 */}
        <button
          onClick={() => {
            setShowModal(false); // 모달 닫기
            if (onConfirm) onConfirm(); // onConfirm 함수가 있을 경우 호출
          }} // 버튼을 클릭하면 모달을 닫고 onConfirm 호출
          className={`w-full py-2 text-black rounded ${buttonColor} ${buttonHoverColor}`} // 버튼 스타일 (배경색과 hover 색상은 props로 설정)
        >
          {buttonText} {/* 부모로부터 전달받은 버튼 텍스트 */}
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
