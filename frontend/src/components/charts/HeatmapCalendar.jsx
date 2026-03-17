import React from "react";
import Plot from "react-plotly.js";

const HeatmapCalendar = ({ points = [] }) => {
  const x = points.map((item) => item.date);
  const y = points.map(() => "Mood");
  const z = [points.map((item) => item.mood)];

  return (
    <Plot
      data={[
        {
          x,
          y: ["Mood"],
          z,
          type: "heatmap",
          colorscale: [
            [0, "#ef4444"],
            [0.25, "#f59e0b"],
            [0.5, "#facc15"],
            [0.75, "#22c55e"],
            [1, "#0891b2"],
          ],
          zmin: 1,
          zmax: 5,
          hovertemplate: "Date: %{x}<br>Mood: %{z:.2f}<extra></extra>",
        },
      ]}
      layout={{
        title: "Emotion Heatmap",
        autosize: true,
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        font: { color: "#334155" },
        margin: { l: 50, r: 20, b: 80, t: 50 },
      }}
      config={{ responsive: true, displayModeBar: false }}
      style={{ width: "100%", height: "260px" }}
      useResizeHandler
    />
  );
};

export default HeatmapCalendar;
