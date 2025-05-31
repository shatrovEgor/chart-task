// Функция для вычисления среднего и стандартного отклонения
export const calculateMeanAndStdDev = (data, key) => {
    const values = data.map(item => item[key]);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;

    const squaredDifferences = values.map(val => Math.pow(val - mean, 2));
    const variance = squaredDifferences.reduce((sum, val) => sum + val, 0) / values.length;
    const stdDev = Math.sqrt(variance);

    return [ mean, stdDev ];
};

// Функция для вычисления Z-оценки
export const calculateZScore = (data) => {
    const [uv_mean, uv_stdDev] = calculateMeanAndStdDev(data, "uv");
    const [pv_mean, pv_stdDev] = calculateMeanAndStdDev(data, "pv");
    return data.map(item => ({
        ...item,
        [`uv_zscore`]: uv_stdDev !== 0 ? (item["uv"] - uv_mean) / uv_stdDev : 0, // избегаем деления на 0
        [`pv_zscore`]: pv_stdDev !== 0 ? (item["pv"] - pv_mean) / pv_stdDev : 0, // избегаем деления на 0
    }));
};

// Функция для зоны Z-оценки
export const calculateZone = (maxCoord, minCoord, topCoordZ, botCoordZ) => {
    const topZoneValue = (maxCoord - topCoordZ) / (maxCoord - minCoord);
    const topZone = (topZoneValue * 100).toFixed(1) + "%"

    const botZoneValue = (botCoordZ - minCoord) / (maxCoord - minCoord);
    const botZone = (100 - botZoneValue * 100).toFixed(1) + "%";

    return [topZone, botZone]
}