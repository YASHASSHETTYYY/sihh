import React from "react";
import Plot from "react-plotly.js";

const CorrelationMatrix = ({ matrix = [[1]], labels = ["mood_score"] }) => {
  return (
    <Plot
      data={[
        {
          z: matrix,
          x: labels,
          y: labels,
          type: "heatmap",
          zmin: -1,
          zmax: 1,
          colorscale: "RdBu",
          reversescale: true,
          hovertemplate: "%{y} vs %{x}: %{z:.2f}<extra></extra>",
        },
      ]}
      layout={{
        title: "Correlation Matrix",
        autosize: true,
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        font: { color: "#334155" },
        margin: { l: 70, r: 20, b: 60, t: 50 },
      }}
      config={{ responsive: true, displayModeBar: false }}
      style={{ width: "100%", height: "320px" }}
      useResizeHandler
    />
  );
};

export default CorrelationMatrix;
