"use client";

import React, { useEffect, useState } from "react";
import { getAuthHeaders } from "../../utils/users-auth";

declare global {
  interface Window {
    ApexCharts?: any;
    _: any;
    buildChart?: (
      selector: string,
      optionsFn: (mode: string) => any,
      lightThemeOverrides: any,
      darkThemeOverrides: any
    ) => void;
    buildTooltip?: (props: any, options: any) => string;
  }
}

interface ApiDataItem {
  month: string;
  avg_progress: number;
  project_count: number;
}

interface ChartData {
  months: string[];
  avgProgress: number[];
  projectCounts: number[];
}

const Graph = () => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/project-progress/", getAuthHeaders());
        if (!response.ok) throw new Error("Failed to fetch data");
        const data: ApiDataItem[] = await response.json();

        // Transform API data to chart data
        const months = data.map((item) => item.month);
        const avgProgress = data.map((item) => item.avg_progress);
        const projectCounts = data.map((item) => item.project_count);

        setChartData({ months, avgProgress, projectCounts });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching chart data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!chartData) return;

    const loadScript = (src: string): Promise<void> =>
      new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script ${src}`));
        document.body.appendChild(script);
      });

    const loadChartScriptsAndBuild = async () => {
      try {
        await loadScript("https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js");
        await loadScript("https://cdn.jsdelivr.net/npm/apexcharts");
        await loadScript("https://preline.co/assets/js/hs-apexcharts-helpers.js");

        if (window.buildChart && window._ && window.ApexCharts) {
          window.buildChart(
            "#hs-multiple-bar-charts",
            (mode: string) => ({
              chart: {
                type: "bar",
                height: 300,
                toolbar: { show: false },
                zoom: { enabled: false },
                foreColor: mode === "dark" ? "#ffffff" : "#000000",
              },
              series: [
                {
                  name: "Average Progress",
                  data: chartData.avgProgress,
                },
                {
                  name: "Project Count",
                  data: chartData.projectCounts,
                },
              ],
              plotOptions: {
                bar: {
                  horizontal: false,
                  columnWidth: "14px",
                  borderRadius: 0,
                },
              },
              legend: { show: true },
              dataLabels: { enabled: false },
              stroke: {
                show: true,
                width: 2,
                colors: [mode === "dark" ? "#ffffff" : "#000000"],
              },
              xaxis: {
                categories: chartData.months,
                axisBorder: { show: false },
                axisTicks: { show: false },
                crosshairs: { show: false },
                labels: {
                  style: {
                    colors: mode === "dark" ? "#ffffff" : "#000000",
                    fontSize: "13px",
                    fontFamily: "Inter, ui-sans-serif",
                    fontWeight: 400,
                  },
                  offsetX: -2,
                },
                title: {
                  text: "Monthly Performance",
                  style: {
                    color: mode === "dark" ? "#ffffff" : "#000000",
                    fontSize: "14px",
                    fontWeight: 600,
                  },
                },
              },
              yaxis: [
                {
                  seriesName: "Average Progress",
                  min: 0,
                  max: 100,
                  labels: {
                    formatter: (value: number) => `${value}%`,
                    style: {
                      colors: mode === "dark" ? "#ffffff" : "#000000",
                      fontSize: "13px",
                      fontFamily: "Inter, ui-sans-serif",
                      fontWeight: 400,
                    },
                  },
                  title: {
                    text: "Avg Progress (%)",
                    style: {
                      color: mode === "dark" ? "#ffffff" : "#000000",
                      fontSize: "14px",
                      fontWeight: 600,
                    },
                  },
                },
                {
                  seriesName: "Project Count",
                  opposite: true,
                  min: 0,
                  labels: {
                    style: {
                      colors: mode === "dark" ? "#ffffff" : "#000000",
                      fontSize: "13px",
                      fontFamily: "Inter, ui-sans-serif",
                      fontWeight: 400,
                    },
                  },
                  title: {
                    text: "Project Count",
                    style: {
                      color: mode === "dark" ? "#ffffff" : "#000000",
                      fontSize: "14px",
                      fontWeight: 600,
                    },
                  },
                },
              ],
              tooltip: {
                shared: true,
                intersect: false,
                y: [
                  {
                    formatter: (val: number) => `${val}% progress`,
                  },
                  {
                    formatter: (val: number) => `${val} projects`,
                  },
                ],
              },
            }),
            {
              colors: ["#FFD700", "#006400"],
              xaxis: {
                labels: { style: { colors: "#000000" } },
              },
              yaxis: [
                {
                  labels: { style: { colors: "#000000" } },
                },
                {
                  labels: { style: { colors: "#000000" } },
                },
              ],
              grid: {
                borderColor: "#e5e7eb",
                strokeDashArray: 4,
              },
            },
            {
              colors: ["#FFD700", "#006400"],
              xaxis: {
                labels: { style: { colors: "#ffffff" } },
              },
              yaxis: [
                {
                  labels: { style: { colors: "#ffffff" } },
                },
                {
                  labels: { style: { colors: "#ffffff" } },
                },
              ],
              grid: {
                borderColor: "#404040",
                strokeDashArray: 4,
              },
            }
          );
        }
      } catch (error) {
        console.error("Failed to load chart scripts:", error);
      }
    };

    loadChartScriptsAndBuild();
  }, [chartData]);

  if (loading) return <div>Loading chart data...</div>;
  if (!chartData) return <div>Failed to load chart data.</div>;

  return (
    <>
      <div className="flex justify-center sm:justify-end items-center gap-x-4 mb-3 sm:mb-6">
        <div className="inline-flex items-center">
          <span className="size-2.5 inline-block bg-[#FFD700] rounded-sm me-2"></span>
          <span className="text-[13px] text-gray-900 dark:text-dark">Average Progress</span>
        </div>
        <div className="inline-flex items-center">
          <span className="size-2.5 inline-block bg-[#006400] rounded-sm me-2"></span>
          <span className="text-[13px] text-gray-900 dark:text-dark">Project Count</span>
        </div>
      </div>
      <div id="hs-multiple-bar-charts" />
    </>
  );
};

export default Graph;
