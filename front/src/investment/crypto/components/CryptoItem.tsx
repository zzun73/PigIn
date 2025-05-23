import React from 'react';
import { AreaChart, XAxis, YAxis, ResponsiveContainer, Area } from 'recharts';
import { MdArrowDropUp, MdArrowDropDown } from 'react-icons/md';

interface CryptoItemProps {
  name: string;
  price: number;
  priceChange: number;
  weeklyPrices: number[];
  monthlyPrices: number[];
  yearlyPrices: number[];
}

const CryptoItem: React.FC<CryptoItemProps> = ({
  name,
  price,
  weeklyPrices,
}) => {
  const latestValue = weeklyPrices.length
    ? weeklyPrices[weeklyPrices.length - 1]
    : 0;
  const previousValue =
    weeklyPrices.length > 1 ? weeklyPrices[weeklyPrices.length - 2] || 0 : 0;
  const percentageChange = previousValue
    ? (((latestValue - previousValue) / previousValue) * 100).toFixed(2)
    : '0.00';
  const formattedPercentageChange =
    Number(percentageChange) >= 0
      ? `+${percentageChange}%`
      : `${percentageChange}%`;

  const isPositiveChange = Number(percentageChange) > 0;
  const chartData = [...weeklyPrices].reverse().map((value, index) => ({
    name: `Day ${index + 1}`,
    value,
  }));

  const minValue = Math.min(...weeklyPrices);
  const maxValue = Math.max(...weeklyPrices);
  const padding = (maxValue - minValue) * 0.1;

  return (
    <div className="bg-customDarkGreen rounded-xl p-4 w-50 h-60 mt-8 shadow-md flex-shrink-0">
      <div className="flex justify-between items-center">
        <h3 className="text-white font-bold text-lg">{name}</h3>
        <span
          className={`flex items-center justify-center text-xs rounded-full px-2 py-1 ${
            isPositiveChange
              ? 'bg-green-900 text-white'
              : 'bg-green-100 text-customDarkGreen'
          }`}
        >
          {isPositiveChange ? <MdArrowDropUp /> : <MdArrowDropDown />}
          {formattedPercentageChange}
        </span>
      </div>
      <div className="text-white font-bold text-2xl mb-2">
        {Number(price).toLocaleString()}
      </div>

      {/* 그래프 */}
      <ResponsiveContainer width="100%" height={80}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorCrypto" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#32CD32" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#32CD32" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" hide />
          <YAxis domain={[minValue - padding, maxValue + padding]} hide />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#32CD32"
            fill="url(#colorCrypto)"
            strokeWidth={2}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CryptoItem;
