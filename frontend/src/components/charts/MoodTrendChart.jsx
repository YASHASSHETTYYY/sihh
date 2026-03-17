import React from "react";
import Plot from "react-plotly.js";

const MoodTrendChart = ({ weeklyTrend = [], monthlyTrend = [] }) => {
  const weeklyX = weeklyTrend.map((item) => item.week);
  const weeklyY = weeklyTrend.map((item) => item.mood);

  const monthlyX = monthlyTrend.map((item) => item.month);
  const monthlyY = monthlyTrend.map((item) => item.mood);

  return (
    <Plot
      data={[
        {
          x: weeklyX,
          y: weeklyY,
          type: "scatter",
          mode: "lines+markers",
          name: "Weekly",
          line: { color: "#0891b2", width: 3 },
        },
        {
          x: monthlyX,
          y: monthlyY,
          type: "scatter",
          mode: "lines+markers",
          name: "Monthly",
          line: { color: "#7c3aed", width: 3 },
        },
      ]}
      layout={{
        title: "Mood Trend",
        autosize: true,
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        font: { color: "#334155" },
        xaxis: { title: "Time" },
        yaxis: { title: "Mood (1-5)", range: [1, 5] },
        margin: { l: 50, r: 20, b: 50, t: 50 },
        legend: { orientation: "h" },
      }}
      config={{ responsive: true, displayModeBar: false }}
      style={{ width: "100%", height: "360px" }}
      useResizeHandler
    />
  );
};

export default MoodTrendChart;
