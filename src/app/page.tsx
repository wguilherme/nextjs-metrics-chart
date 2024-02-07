'use client'
import { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';

export default function Home() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const generateRandomData = () => {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const daysInMonth = new Date(currentYear, currentDate.getMonth() + 1, 0).getDate();

      const data = [];
      for (let day = 1; day <= daysInMonth; day++) {
        const randomCount = Math.floor(Math.random() * 1000); // Números aleatórios até 1000 para simular visitas
        data.push(randomCount);
      }

      return data;
    };

    const newData = generateRandomData();
    setChartData(newData);
  }, []);

  const options = {
    grid: { top: 8, right: 8, bottom: 24, left: 36 },
    xAxis: {
      type: 'category',
      data: Array.from({ length: 31 }, (_, i) => (i + 1).toString()), // Dias do mês como string
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: chartData,
        type: 'bar',
        smooth: false,
      },
    ],
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        const day = params[0].axisValue;
        const count = params[0].value;
        const date = new Date();
        date.setDate(day);
        const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const dayName = dayNames[date.getDay()];

        return `${dayName}, dia ${day} - ${count} visitas`;
      },
    },
  };

  return (
    <div>
      <ReactECharts option={options} />
    </div>
  )
}
