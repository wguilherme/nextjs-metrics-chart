'use client'
import { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';

export default function Home() {
  const [chartData, setChartData] = useState([]);
  const [clickData, setClickData] = useState([]);
  const [monthName, setMonthName] = useState('');

  useEffect(() => {
    const currentDate = new Date();
    const month = currentDate.getMonth(); // Mês atual (0-11)
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    const monthName = monthNames[month];

    setMonthName(monthName);

    // Função para gerar dados de visitas
    const generateRandomVisitData = () => {
      const currentYear = currentDate.getFullYear();
      const daysInMonth = new Date(currentYear, month + 1, 0).getDate();

      const data = [];
      for (let day = 1; day <= daysInMonth; day++) {
        const randomCount = Math.floor(Math.random() * 1000); // Números aleatórios até 1000 para simular visitas
        data.push(randomCount);
      }

      return data;
    };

    // Função para gerar dados de cliques
    const generateRandomClickData = () => {
      const currentYear = currentDate.getFullYear();
      const daysInMonth = new Date(currentYear, month + 1, 0).getDate();

      const clickDataArray = [];

      // Mock de array de URLs
      const urls = ['https://example.com/url1', 'https://example.com/url2', 'https://example.com/url3'];

      urls.forEach(url => {
        const clicksArray = [];
        for (let day = 1; day <= daysInMonth; day++) {
          const randomClicks = Math.floor(Math.random() * 500); // Números aleatórios de cliques até 500 por dia
          clicksArray.push(randomClicks);
        }
        clickDataArray.push({ url, data: clicksArray });
      });

      return clickDataArray;
    };

    const newVisitData = generateRandomVisitData();
    const newClickData = generateRandomClickData();

    setChartData(newVisitData);
    setClickData(newClickData);
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
        type: 'line',
        smooth: true,
        name: 'Visitas'
      },
      ...clickData.map((click, index) => ({
        data: click.data,
        type: 'bar',
        name: `Cliques - ${click.url}`,
        stack: 'cliques',
      })),
    ],
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        const day = params[0].axisValue;
        const tooltipTitle = `Dia ${day} de ${monthName}`; // Título do tooltip
        let tooltip = `<strong>${tooltipTitle}</strong><br>`;
        params.forEach(param => {
          const seriesName = param.seriesName;
          const value = param.value;
          const seriesType = param.seriesType;
          const url = clickData.find(item => item.url === seriesName.split(' - ')[1])?.url;

          if (seriesType === 'line') {
            tooltip += `${seriesName}: ${value} visitas<br>`;
          } else {
            tooltip += `Clique - ${url}: ${value}<br>`;
          }
        });
        return tooltip;
      },
    },
  };

  return (
    <div>
      <ReactECharts option={options} />
    </div>
  )
}
