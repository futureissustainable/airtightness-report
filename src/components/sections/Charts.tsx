'use client';

import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { useReportStore } from '@/store/reportStore';
import { Section } from '@/components/ui';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Charts() {
  const { measurementRows, getCalculatedResults } = useReportStore();
  const { totalVolume } = getCalculatedResults();

  const chartData = useMemo(() => {
    const depData: { x: number; y: number }[] = [];
    const preData: { x: number; y: number }[] = [];

    measurementRows.forEach((row) => {
      const depFlow = row.depAch * totalVolume;
      const preFlow = row.preAch * totalVolume;

      if (row.depPressure > 0 && depFlow > 0) {
        depData.push({ x: row.depPressure, y: depFlow });
      }
      if (row.prePressure > 0 && preFlow > 0) {
        preData.push({ x: row.prePressure, y: preFlow });
      }
    });

    depData.sort((a, b) => a.x - b.x);
    preData.sort((a, b) => a.x - b.x);

    return { depData, preData };
  }, [measurementRows, totalVolume]);

  const logLogData = useMemo(() => {
    const depLogData = chartData.depData
      .filter((d) => d.x > 0 && d.y > 0)
      .map((d) => ({ x: Math.log(d.x), y: Math.log(d.y) }));

    const preLogData = chartData.preData
      .filter((d) => d.x > 0 && d.y > 0)
      .map((d) => ({ x: Math.log(d.x), y: Math.log(d.y) }));

    return { depLogData, preLogData };
  }, [chartData]);

  const passivhausLine = useMemo(() => {
    if (totalVolume <= 0) return [];
    const targetFlowAt50 = 0.6 * totalVolume;
    const slope = targetFlowAt50 / 50;
    const allPressures = [...chartData.depData, ...chartData.preData].map((d) => d.x);
    const maxPressure = allPressures.length > 0 ? Math.max(...allPressures) : 70;
    const chartXMax = Math.ceil((maxPressure + 10) / 10) * 10;

    return [
      { x: 0, y: 0 },
      { x: chartXMax, y: slope * chartXMax },
    ];
  }, [totalVolume, chartData]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 16,
          font: { family: 'Poppins', size: 11 },
        },
      },
      tooltip: {
        backgroundColor: '#14171c',
        titleFont: { family: 'Poppins', size: 11 },
        bodyFont: { family: 'Poppins', size: 10 },
        padding: 10,
        cornerRadius: 6,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Pressure (Pa)',
          font: { family: 'Poppins', size: 11, weight: 500 as const },
          color: '#14171c',
        },
        grid: { color: '#f0f1f2' },
        ticks: { font: { family: 'Poppins', size: 10 }, color: '#737579' },
      },
      y: {
        title: {
          display: true,
          text: 'Flow (m³/h)',
          font: { family: 'Poppins', size: 11, weight: 500 as const },
          color: '#14171c',
        },
        grid: { color: '#f0f1f2' },
        ticks: { font: { family: 'Poppins', size: 10 }, color: '#737579' },
      },
    },
  };

  const logChartOptions = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      x: { ...chartOptions.scales.x, title: { ...chartOptions.scales.x.title, text: 'Log(P)' } },
      y: { ...chartOptions.scales.y, title: { ...chartOptions.scales.y.title, text: 'Log(V)' } },
    },
  };

  const flowChartData = {
    datasets: [
      {
        label: 'Dep.',
        data: chartData.depData,
        backgroundColor: '#14171c',
        borderColor: '#14171c',
        showLine: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 1.5,
      },
      {
        label: 'Pres.',
        data: chartData.preData,
        backgroundColor: '#737579',
        borderColor: '#737579',
        showLine: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 1.5,
      },
      {
        label: 'Target (0.6)',
        data: passivhausLine,
        backgroundColor: 'transparent',
        borderColor: '#d1d5db',
        borderWidth: 1,
        borderDash: [4, 4],
        pointRadius: 0,
        showLine: true,
      },
    ],
  };

  const logChartData = {
    datasets: [
      {
        label: 'Dep.',
        data: logLogData.depLogData,
        backgroundColor: '#14171c',
        borderColor: '#14171c',
        showLine: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 1.5,
      },
      {
        label: 'Pres.',
        data: logLogData.preLogData,
        backgroundColor: '#737579',
        borderColor: '#737579',
        showLine: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 1.5,
      },
    ],
  };

  const hasData = chartData.depData.length > 0 || chartData.preData.length > 0;

  return (
    <Section title="Graphs" sectionNumber={6}>
      {!hasData ? (
        <p className="text-[var(--color-muted)] py-8 text-center">
          Enter measurement data to generate charts.
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-[var(--color-border)] rounded-lg p-4">
            <p className="text-sm font-medium text-[var(--color-title)] mb-3 text-center">
              Flow vs Pressure
            </p>
            <div className="aspect-square max-h-[320px]">
              <Scatter data={flowChartData} options={chartOptions} />
            </div>
          </div>
          <div className="border border-[var(--color-border)] rounded-lg p-4">
            <p className="text-sm font-medium text-[var(--color-title)] mb-3 text-center">
              Log-Log Plot
            </p>
            <div className="aspect-square max-h-[320px]">
              <Scatter data={logChartData} options={logChartOptions} />
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}
