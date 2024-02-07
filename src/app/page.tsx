// use client
'use client';
import { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';

export default function Home() {
    const [chartData, setChartData] = useState([]);
    const [clickData, setClickData] = useState([]);
    const [monthName, setMonthName] = useState('');

    useEffect(() => {
        const mockData = generateMockData();
        setChartData(mockData);

        // Extrair dados de cliques das URLs do mock de dados
        const clickDataArray = extractClickData(mockData);
        setClickData(clickDataArray);

        const currentDate = new Date();
        const month = currentDate.getMonth(); // Mês atual (0-11)
        const monthNames = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        const monthName = monthNames[month];
        setMonthName(monthName);
    }, []);

   const generateMockData = () => {
    // Mock de dados no formato especificado
    const mockData = {
        '2024': { count: 10 },
        '2024_02': { count: 10 },
        '2024_02_06': {
            count: 10,
            history: [
                { date: new Date('2024-02-06T03:32:26.363Z') },
                { date: new Date('2024-02-06T03:32:31.369Z') },
                { date: new Date('2024-02-06T03:33:08.752Z') },
                { date: new Date('2024-02-06T03:33:45.836Z') },
                { date: new Date('2024-02-06T03:35:27.012Z') },
                { date: new Date('2024-02-06T03:35:28.391Z') },
                { date: new Date('2024-02-06T03:36:04.016Z') },
                { date: new Date('2024-02-06T03:36:10.808Z') }
            ]
        },
        '2024_02_06_00_33': { count: 2 },
        '2024_02_06_00_35': { count: 2 },
        '2024_02_06_00_36': { count: 2 },
        'http://google_com': {
            '2024': { count: 1 },
            '2024_02': { count: 1 },
            '2024_02_06': {
                count: 1,
                history: [{ date: new Date('2024-02-06T03:36:05.146Z') }]
            },
            '2024_02_06_00_36': { count: 1 }
        }
    };

    // Adicionando mais dados ao mock
    for (let i = 7; i <= 10; i++) {
        const date = `2024_02_0${i}`;
        mockData[date] = { count: Math.floor(Math.random() * 20) }; // Adiciona dados de contagem
        const history = [];
        for (let j = 1; j <= 5; j++) {
            history.push({ date: new Date(`2024-02-0${i}T03:3${j}:00.000Z`) }); // Adiciona histórico de datas
        }
        mockData[date].history = history;
    }

    // Adicionando mais links ao mock
    for (let i = 2; i <= 5; i++) {
        const link = `http://example_${i}.com`;
        mockData[link] = {};
        for (let j = 7; j <= 10; j++) {
            const date = `2024_02_0${j}`;
            mockData[link][date] = { count: Math.floor(Math.random() * 5) }; // Adiciona dados de contagem para cada link
            const history = [];
            for (let k = 1; k <= 3; k++) {
                history.push({ date: new Date(`2024-02-0${j}T03:3${k}:00.000Z`) }); // Adiciona histórico de datas para cada link
            }
            mockData[link][date].history = history;
        }
    }

    return mockData;
};
    const extractClickData = (data) => {
        const clickDataArray = [];
        for (const key in data) {
            if (key.startsWith('http')) {
                const url = key;
                const clickData = data[key];
                const clicksArray = clickData['2024_02_06']?.history.map(entry => ({
                    date: new Date(entry.date),
                    count: clickData['2024_02_06'].count
                })) || [];
                clickDataArray.push({ url, data: clicksArray });
            }
        }
        return clickDataArray;
    };

      // Série de visitas
const visitSeriesData = Array.from({ length: 31 }, () => 0); // Inicializa com zeros

for (const key in chartData) {
    if (chartData[key].history) {
        chartData[key].history.forEach(entry => {
            const day = new Date(entry.date).getDate();
            visitSeriesData[day - 1] += entry.count; // Acumula a contagem do dia
        });
    }
}




     // Série de cliques
const clickSeriesData = clickData.map(click => {
  const data = Array.from({ length: 31 }, () => 0); // Inicializa com zeros
  click.data.forEach(entry => {
      const day = new Date(entry.date).getDate();
      data[day - 1] += entry.count;
  });
  return {
      name: `Cliques - ${click.url}`,
      type: 'bar',
      stack: 'cliques',
      data: data,
  };
});

    const series = [
        {
            data: visitSeriesData,
            type: 'bar',
            smooth: true,
            name: 'Visitas'
        },
        ...clickSeriesData,
    ];

    const options = {
        grid: { top: 8, right: 8, bottom: 24, left: 36 },
        xAxis: {
            type: 'category',
            data: Array.from({ length: 31 }, (_, i) => (i + 1).toString()), // Dias do mês como string
        },
        yAxis: {
            type: 'value',
        },
        series: series,
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

                    if (seriesType === 'line') {
                        tooltip += `${seriesName}: ${value} visitas<br>`;
                    } else {
                        const url = seriesName.split(' - ')[1];
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
