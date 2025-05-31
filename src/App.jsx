import "./styles.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Dot,
  ReferenceLine,
  ReferenceArea,
} from "recharts";

import { data } from "./mock-data";
import { findMaxValue, findMinValue } from "./utils";
import { calculateMeanAndStdDev, calculateZScore, calculateZone } from "./calculate-utils";

const COLORS = {
  RED: "#ff4d4f",
  PV_COLOR: "#8884d8",
  UV_COLOR: "#82ca9d"
}

// Cчитаем Z-оценку
const dataWithZScore = calculateZScore(data);

// Считаем "среднее значение" и "стандартное отклонение"
const [mean_uv, stdDev_uv] = calculateMeanAndStdDev(data, "uv");
const [mean_pv, stdDev_pv] = calculateMeanAndStdDev(data, "pv");

// Считаем координаты для pv
const max_pv = findMaxValue(data, "pv")
const min_pv = findMinValue(data, "pv")
const topCoordZ_pv = (mean_pv + stdDev_pv).toFixed(2);
const botCoordZ_pv = (mean_pv - stdDev_pv).toFixed(2);

// Считаем координаты для uv
const max_uv = findMaxValue(data, "uv")
const min_uv = findMinValue(data, "uv")
const topCoordZ_uv = (mean_uv + stdDev_uv).toFixed(2);
const botCoordZ_uv = (mean_uv - stdDev_uv).toFixed(2);

// Вычесляем ширину зоны Z- оценки
const [topZone_pv, botZone_pv] = calculateZone(max_pv, min_pv, topCoordZ_pv, botCoordZ_pv);
const [topZone_uv, botZone_uv] = calculateZone(max_uv, min_uv, topCoordZ_uv, botCoordZ_uv);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const pv_value = payload[0].value;
    const uv_value = payload[1].value;
    const redIndicate_pv = pv_value > botCoordZ_pv && pv_value < topCoordZ_pv;
    const redIndicate_uv = uv_value > botCoordZ_uv && uv_value < topCoordZ_uv;
    return (
      <div className="custom-tooltip">
        <p className="label">{`${label}`}</p>
        <p style={{color: redIndicate_pv ? COLORS.PV_COLOR : COLORS.RED }} className="label">{`PV: ${pv_value}`}</p>
        <p style={{color: redIndicate_uv ? COLORS.UV_COLOR : COLORS.RED }} className="label">{`UV: ${uv_value}`}</p>
      </div>
    );
  }

  return null;
};

export default function App() {
  return (
    <LineChart
      width={1000}
      height={500}
      data={dataWithZScore}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <defs>
        <linearGradient id="pv" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{stopColor: COLORS.RED, stopOpacity: 1}}/>
          <stop offset={topZone_pv} style={{stopColor: COLORS.RED, stopOpacity: 1}}/>
          <stop offset={topZone_pv} style={{stopColor: COLORS.PV_COLOR, stopOpacity: 1}}/>
          <stop offset={botZone_pv} style={{stopColor: COLORS.PV_COLOR, stopOpacity: 1}}/>
          <stop offset={botZone_pv} style={{stopColor: COLORS.RED, stopOpacity: 1}}/>
          <stop offset="100%" style={{stopColor: COLORS.RED, stopOpacity: 1}}/>
        </linearGradient>
      </defs>
      <defs>
        <linearGradient id="uv" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{stopColor: COLORS.RED, stopOpacity: 1}}/>
          <stop offset={topZone_uv} style={{stopColor: COLORS.RED, stopOpacity: 1}}/>
          <stop offset={topZone_uv} style={{stopColor: COLORS.UV_COLOR, stopOpacity: 1}}/>
          <stop offset={botZone_uv} style={{stopColor: COLORS.UV_COLOR, stopOpacity: 1}}/>
          <stop offset={botZone_uv} style={{stopColor: COLORS.RED, stopOpacity: 1}}/>
          <stop offset="100%" style={{stopColor: COLORS.RED, stopOpacity: 1}}/>
        </linearGradient>
      </defs>
      <XAxis dataKey="name" padding={{ left: 20, right: 20 }} />
      <YAxis />
      <Tooltip content={<CustomTooltip />}/>
      <Legend payload={[{value: 'PV', type: "line", color: COLORS.PV_COLOR}, {value: 'UV', type: "line", color: COLORS.UV_COLOR}]}/>
      <Line
        type="monotone"
        name="# PV"
        dataKey="pv"
        stroke="url(#pv)"
        dot={({ payload, cx, cy }) => (
          <Dot
            cx={cx}
            key={cx}
            cy={cy}
            r={2}
            fill={Math.abs(payload.pv_zscore) > 1 ? COLORS.RED : COLORS.PV_COLOR}
            stroke={Math.abs(payload.pv_zscore) > 1 ? COLORS.RED : COLORS.PV_COLOR}
            strokeWidth={3}
          />
        )}
        activeDot={({ payload, cx, cy }) => (
          <Dot
            cx={cx}
            key={cx}
            cy={cy}
            r={3}
            fill={Math.abs(payload.pv_zscore) > 1 ? COLORS.RED : COLORS.PV_COLOR}
            stroke={Math.abs(payload.pv_zscore) > 1 ? COLORS.RED : COLORS.PV_COLOR}
            strokeWidth={3}
          />
        )}
      />
      <ReferenceLine y={mean_pv} stroke={COLORS.PV_COLOR} strokeDasharray="10 20" />
      <ReferenceArea y1={10000} y2={mean_pv + stdDev_pv} fill={COLORS.PV_COLOR} fillOpacity={0.2} />
      <ReferenceArea y1={0} y2={mean_pv - stdDev_pv} fill={COLORS.PV_COLOR} fillOpacity={0.2} />
      <Line type="monotone" 
        dataKey="uv" 
        name="# UV"
        stroke="url(#uv)"
        dot={({ payload, cx, cy }) => (
          <Dot
            cx={cx}
            key={cx}
            cy={cy}
            r={2}
            fill={Math.abs(payload.uv_zscore) > 1 ? COLORS.RED : COLORS.UV_COLOR}
            stroke={Math.abs(payload.uv_zscore) > 1 ? COLORS.RED : COLORS.UV_COLOR}
            strokeWidth={2}
          />
        )}
        activeDot={({ payload, cx, cy }) => (
          <Dot
            cx={cx}
            key={cx}
            cy={cy}
            r={3}
            fill={Math.abs(payload.uv_zscore) > 1 ? COLORS.RED : COLORS.UV_COLOR}
            stroke={Math.abs(payload.uv_zscore) > 1 ? COLORS.RED : COLORS.UV_COLOR}
            strokeWidth={3}
          />
        )}/>
      <ReferenceLine y={mean_uv} stroke={COLORS.UV_COLOR} strokeDasharray="10 20" />
      <ReferenceArea y1={10000} y2={mean_uv + stdDev_uv} fill={COLORS.UV_COLOR} fillOpacity={0.2} />
      <ReferenceArea y1={0} y2={mean_uv - stdDev_uv} fill={COLORS.UV_COLOR} fillOpacity={0.2} />
    </LineChart>
  );
}
