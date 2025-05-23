import React, { useEffect, useCallback, useState } from 'react';
import { CgClose } from 'react-icons/cg';
import { sellStock } from '../../../../api/investment/stock/StockSell';
import { getStockQuantity } from '../../../../api/investment/stock/StockQuantity';

interface StockSellModalProps {
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  onClose: () => void;
  stockId: string;
  stockPrice: number;
}

const StockSellModal: React.FC<StockSellModalProps> = ({
  inputValue,
  setInputValue,
  onClose,
  stockId,
  stockPrice,
}) => {
  const [stockQuantity, setStockQuantity] = useState<number>(0);
  const [profitRate, setProfitRate] = useState<number>(0);

  const handleKeypadClick = (number: string) => {
    setInputValue((prev) => {
      if (prev.length > 4) {
        return prev;
      }
      // input 비어있으면 0, 00 입력 방지
      // 빈칸에 숫자 더해지면 숫자 + 00 추가(100원 단위 투자 가능하도록)

      if (prev === '00') {
        return number === '0' || number === '00' ? prev : number + '00';
      }
      return prev.slice(0, -2) + number + '00';
    });
  };

  const handleBackspace = useCallback(() => {
    setInputValue((prev) => {
      if (prev === '00' || prev.length === 3) {
        return '00';
      }
      return prev.slice(0, -3) + '00';
    });
  }, [setInputValue]);

  const handleAddAmount = (amount: number) => {
    setInputValue((prev) => {
      const newValue = parseInt(prev || '0') + amount;
      return newValue.toString();
    });
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Backspace') {
        handleBackspace();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleBackspace]);

  const inputAmount = parseFloat(inputValue) || 0;
  const percentage =
    inputAmount === 0 || stockQuantity === 0
      ? 0.0
      : ((inputAmount / stockQuantity) * 100).toFixed(2);
  const sendPercentage =
    inputAmount === 0 || stockPrice === 0
      ? 0.0
      : (inputAmount / stockPrice) * 100;

  const handleSellClick = async () => {
    try {
      console.log(stockId, Number(sendPercentage) * 0.01);
      const response = await sellStock(stockId, Number(sendPercentage) * 0.01);
      console.log('매도 성공핑:', response);
      onClose();
    } catch (error) {
      console.error('매도 실패핑:', error);
    }
  };

  useEffect(() => {
    const fetchStockQuantity = async () => {
      try {
        const response = await getStockQuantity(stockId);
        console.log(response);
        setStockQuantity(Number(Number(response.price).toFixed(2)));
        setProfitRate(response.profitRate);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStockQuantity();
  }, [stockId]);

  const isTradingTime = () => {
    const now = new Date();
    const day = now.getDay();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    const isWeekday = day >= 1 && day <= 5;
    const isTradingHours =
      hours >= 9 && (hours < 15 || (hours === 15 && minutes <= 30));

    return isWeekday && isTradingHours;
  };

  return (
    <div className="modal-content fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-end z-50">
      <div className="bg-white w-full h-3/4 rounded-t-3xl p-6 relative">
        {/* 모달 상단 */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-black flex justify-center">
            얼마를 매도하시겠어요?
          </h1>
          <div onClick={onClose} className="text-black">
            <CgClose size={24} />
          </div>
        </div>

        <div className="text-lg text-center text-black mb-4">
          현재 보유 금액 :{' '}
          <span
            className="text-2xl"
            onClick={() => setInputValue(stockQuantity.toString())}
          >
            {stockQuantity}
          </span>{' '}
          원 <span className="text-sm">({profitRate} %)</span>
        </div>

        {/* 가격 표시 칸 */}
        <div className="relative flex justify-center mb-6">
          <input
            type="text"
            value={inputValue === '00' ? '' : inputValue}
            readOnly
            className={`bg-transparent text-center text-black text-3xl w-6/7 p-2 transition-all ${
              inputValue && inputValue !== '00' ? 'border-b border-black' : ''
            }`}
          />
          {inputValue && inputValue !== '00' && (
            <div className="absolute right-4 mt-4 flex items-center space-x-1 text-black">
              <span className="text-xl">원 ({percentage}%)</span>
            </div>
          )}
        </div>

        {/* 100, 1000, 3000, 5000원 추가 버튼 */}
        <div className="flex justify-center space-x-4 mb-6">
          {[
            { label: '+500원', value: 500 },
            { label: '+1000원', value: 1000 },
            { label: '+3000원', value: 3000 },
            { label: '+5000원', value: 5000 },
          ].map((button) => (
            <button
              key={button.value}
              className="bg-customDarkGreen p-2 text-sm rounded-full text-white transition-colors"
              onClick={() => handleAddAmount(button.value)}
            >
              {button.label}
            </button>
          ))}
        </div>

        {/* 키패드 */}
        <div className="grid grid-cols-3 gap-4 justify-center">
          {[
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '00',
            '0',
            'backspace',
          ].map((key) => (
            <button
              key={key}
              className="bg-transparent text-black text-2xl p-4 rounded-lg transition-colors w-full h-20"
              onClick={() =>
                key === 'backspace' ? handleBackspace() : handleKeypadClick(key)
              }
            >
              {key === 'backspace' ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6 ml-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 12H5M12 19l-7-7 7-7"
                  />
                </svg>
              ) : (
                key
              )}
            </button>
          ))}
        </div>

        {/* 매도하기 버튼 */}
        <div className="flex justify-center">
          <button
            className={`w-full py-3 rounded-md text-lg font-bold ${
              inputValue === '00'
                ? 'bg-gray-300 text-white cursor-not-allowed'
                : 'bg-red-500 text-white'
            }`}
            disabled={inputValue === '00'}
            onClick={handleSellClick}
          >
            {isTradingTime() ? '매도하기' : '매도 예약'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockSellModal;
