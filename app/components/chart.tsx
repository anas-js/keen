import {
  Chart as ChartJs,
  LineElement,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler,
  Legend,
  Title,
} from "chart.js";

ChartJs.register(
  LineElement,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler,
  Legend,
  Title
);

import { useEffect, useRef, useState } from "react";

export default function Chart({ row, column, total, compare }) {
  const [color] = useState(
    total === compare ? "#077a7d" : total > compare ? "#06202B" : "#f31260"
  );
  const chartRef = useRef(null!);
  const [chartObject, setChartObject] = useState<ChartJs>(null!);

  useEffect(() => {
    setChartObject(
      new ChartJs(chartRef.current, {
        type: "line",
        data: {
          labels: row,
          datasets: [
            {
              data: column,

              backgroundColor: color,
              borderColor: color,

              pointBackgroundColor: "transparent",
              pointBorderColor: "transparent",
              pointHoverBackgroundColor: color,
              pointHoverBorderColor: color,
              tension: 0.4,

              pointHoverRadius: 7,
            },
          ],
        },
        options: {
          maintainAspectRatio: false,

          responsive: true,
          hover: {
            mode: "index",
            intersect: false,
          },
          scales: {
            x: {
              ticks: {
                display: false,
              },
              grid: {
                display: false,
              },
              border: {
                display: false,
              },
            },
            y: {
              ticks: {
                display: false,
              },
              grid: {
                display: false,
              },
              border: {
                display: false,
              },
            },
          },
          layout: {
            padding: 0,
          },
          plugins: {
            legend: {
              display: false,
            },

            tooltip: {
              mode: "index",
              intersect: false,
              enabled: true,
              backgroundColor: "#06202B",
              displayColors: false,
              bodyFont: {
                family: '"Baloo Bhaijaan 2"',
                size: 13,
              },
              titleFont: {
                family: '"Baloo Bhaijaan 2"',
                size: 15,
              },
            },
          },
        },
      })
    );
  }, []);

  useEffect(() => {
    const datasets = chartObject?.data?.datasets?.[0];
    if(!datasets) {
        return;
    }

    const color =  total === compare ? "#077a7d" : total > compare ? "#3FDCAA" : "#f31260";
    // console.log("run");
    // setColor(
    //   total === compare ? "#077a7d" : total > compare ? "#3FDCAA" : "#F26A81"
    // );

   

    datasets.backgroundColor = color;
    datasets.borderColor = color;

    datasets.hoverBackgroundColor = color;
    datasets.hoverBorderColor = color;
    //@ts-expect-error just
    datasets.pointHoverBorderColor = color;

    //@ts-expect-error just
    datasets.pointHoverBackgroundColor = color;
    datasets.borderColor = color;

    datasets.data = column;
    chartObject.data.labels = row;

    chartObject.update();
  }, [row, column, compare, total]);

  return <canvas ref={chartRef}></canvas>;
}
