
'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState, useCallback } from 'react';
import { format, subDays } from 'date-fns';

const chartConfig = {
  steps: {
    label: 'Steps',
    color: 'hsl(var(--chart-1))',
  },
  heartRate: {
    label: 'Avg. Heart Rate',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export interface HealthData {
  date: string; // YYYY-MM-DD
  bp_systolic: number;
  bp_diastolic: number;
  sugar: number;
  heartRate: number;
  steps: number;
}

export function HealthMetricsChart() {
  const { user } = useAuth();
  const [chartData, setChartData] = useState<any[]>([]);

  const loadChartData = useCallback(() => {
    if (user) {
      const savedData: HealthData[] = JSON.parse(localStorage.getItem(`healthMetrics_${user.uid}`) || '[]');
      
      const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const d = subDays(new Date(), i);
        return format(d, 'yyyy-MM-dd');
      }).reverse();
      
      const processedData = last7Days.map(day => {
        const dataForDay = savedData.find(d => d.date === day);
        return {
          day: format(new Date(day), 'EEE'),
          steps: dataForDay?.steps || 0,
          heartRate: dataForDay?.heartRate || 0,
        };
      });

      setChartData(processedData);
    }
  }, [user]);

  useEffect(() => {
    loadChartData();
    
    // Add event listener to update chart when local storage changes
    const handleStorageChange = () => {
      loadChartData();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user, loadChartData]);

  if (chartData.length === 0) {
    return <p className="text-muted-foreground text-center py-8">Log your daily metrics to see your chart.</p>;
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <ResponsiveContainer>
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <XAxis
            dataKey="day"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis
            yAxisId="left"
            orientation="left"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
          />
          <Tooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Bar dataKey="steps" fill="var(--color-steps)" radius={4} yAxisId="left" />
          <Bar dataKey="heartRate" fill="var(--color-heartRate)" radius={4} yAxisId="right" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
