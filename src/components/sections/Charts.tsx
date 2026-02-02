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
import { Section, Card } from '@/components/ui';
import { ChartLine } from '@phosphor-icons/react';

// Register ChartJS components
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
  const { measurementRows, getCalculatedResults, results } = useReportStore();
  const { totalVolume } = getCalculatedResults();

  // Calculate chart data
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

    // Sort data by pressure
    depData.sort((a, b) => a.x - b.x);
    preData.sort((a, b) => a.x - b.x);

    return { depData, preData };
  }, [measurementRows, totalVolume]);

  // Calculate log-log data
  const logLogData = useMemo(() => {
    const depLogData = chartData.depData
      .filter((d) => d.x > 0 && d.y > 0)
      .map((d) => ({ x: Math.log(d.x), y: Math.log(d.y) }));

    const preLogData = chartData.preData
      .filter((d) => d.x > 0 && d.y > 0)
      .map((d) => ({ x: Math.log(d.x), y: Math.log(d.y) }));

    return { depLogData, preLogData };
  }, [chartData]);

  // Calculate Passivhaus target line
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

  const flowChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            family: 'Poppins',
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: '#14171c',
        titleFont: { family: 'Poppins', size: 12 },
        bodyFont: { family: 'Poppins', size: 11 },
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Pressure (Pa)',
          font: { family: 'Poppins', size: 12, weight: 500 },
          color: '#14171c',
        },
        grid: {
          color: '#f0f1f2',
        },
        ticks: {
          font: { family: 'Poppins', size: 11 },
          color: '#737579',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Flow Rate (m³/h)',
          font: { family: 'Poppins', size: 12, weight: 500 },
          color: '#14171c',
        },
        grid: {
          color: '#f0f1f2',
        },
        ticks: {
          font: { family: 'Poppins', size: 11 },
          color: '#737579',
        },
      },
    },
  };

  const logChartOptions = {
    ...flowChartOptions,
    scales: {
      ...flowChartOptions.scales,
      x: {
        ...flowChartOptions.scales.x,
        title: {
          ...flowChartOptions.scales.x.title,
          text: 'Log(Pressure)',
        },
      },
      y: {
        ...flowChartOptions.scales.y,
        title: {
          ...flowChartOptions.scales.y.title,
          text: 'Log(Flow Rate)',
        },
      },
    },
  };

  const flowChartData = {
    datasets: [
      {
        label: 'Depressurization',
        data: chartData.depData,
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
        borderColor: 'rgba(239, 68, 68, 1)',
        showLine: true,
        pointRadius: 6,
        pointHoverRadius: 8,
        borderWidth: 2,
      },
      {
        label: 'Pressurization',
        data: chartData.preData,
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        showLine: true,
        pointRadius: 6,
        pointHoverRadius: 8,
        borderWidth: 2,
      },
      {
        label: 'Passivhaus Target (n₅₀ = 0.6)',
        data: passivhausLine,
        backgroundColor: 'transparent',
        borderColor: '#9ca3af',
        borderWidth: 2,
        borderDash: [6, 6],
        pointRadius: 0,
        showLine: true,
      },
    ],
  };

  const logChartData = {
    datasets: [
      {
        label: 'Depressurization (Log)',
        data: logLogData.depLogData,
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
        borderColor: 'rgba(239, 68, 68, 1)',
        showLine: true,
        pointRadius: 6,
        pointHoverRadius: 8,
        borderWidth: 2,
      },
      {
        label: 'Pressurization (Log)',
        data: logLogData.preLogData,
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        showLine: true,
        pointRadius: 6,
        pointHoverRadius: 8,
        borderWidth: 2,
      },
    ],
  };

  const hasData = chartData.depData.length > 0 || chartData.preData.length > 0;

  return (
    <Section title="Graphs" sectionNumber={7}>
      {!hasData ? (
        <Card className="bg-[var(--color-surface)] text-center py-12">
          <div className="w-16 h-16 rounded-full bg-white mx-auto mb-4 flex items-center justify-center">
            <ChartLine weight="light" className="w-8 h-8 text-[var(--color-muted)]" />
          </div>
          <p className="text-[var(--color-muted)]">No measurement data available.</p>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            Enter measurement data in Section 5 to generate charts.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h4 className="mb-4 text-center">Flow Rate vs. Pressure</h4>
            <div className="aspect-square max-h-[400px]">
              <Scatter data={flowChartData} options={flowChartOptions} />
            </div>
          </Card>
          <Card>
            <h4 className="mb-4 text-center">Log(Flow Rate) vs. Log(Pressure)</h4>
            <div className="aspect-square max-h-[400px]">
              <Scatter data={logChartData} options={logChartOptions} />
            </div>
          </Card>
        </div>
      )}
    </Section>
  );
}
