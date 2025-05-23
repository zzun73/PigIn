import React from 'react';
import StockList from '../components/StockList'; // 주식 목록 컴포넌트
import CryptoList from '../components/CryptoList'; // 가상화폐 목록 컴포넌트

const FavoritePage: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center">
      <div className="flex justify-between items-center w-screen pt-10 bg-customDarkGreen">
        <h1 className="text-2xl font-bold text-white absolute left-1/2 transform -translate-x-1/2 pb-2">
          찜 목록
        </h1>
      </div>
      {/* 주식 목록을 5개만 렌더링*/}
      <div className="mt-6">
        <StockList limit={5} showTitle={true} />
      </div>
      {/* 가상화폐 목록을 5개만 렌더링*/}
      <div className="mt-7">
        <CryptoList limit={5} showTitle={true} />
      </div>
    </div>
  );
};

export default FavoritePage;
