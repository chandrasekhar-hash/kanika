const DEFAULT_WIDTH = 240;
const DEFAULT_HEIGHT = 56;

/**
 * Generates SVG path commands for a sparkline visualization.
 * @param {number[]} points Numeric data points.
 * @param {number} [width=DEFAULT_WIDTH] Width of the sparkline viewbox.
 * @param {number} [height=DEFAULT_HEIGHT] Height of the sparkline viewbox.
 * @returns {{linePath: string, areaPath: string}}
 */
export function buildSparklinePath(points, width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT) {
  if (!Array.isArray(points) || points.length === 0) {
    return { linePath: '', areaPath: '' };
  }

  if (points.length === 1) {
    const y = height - height * 0.5;
    const line = `M0 ${y} L${width} ${y}`;
    return {
      linePath: line,
      areaPath: `${line} L${width} ${height} L0 ${height} Z`,
    };
  }

  const max = Math.max(...points);
  const min = Math.min(...points);
  const verticalRange = max === min ? 1 : max - min;
  const step = width / (points.length - 1);

  const coordinates = points.map((value, index) => {
    const x = index * step;
    const normalized = (value - min) / verticalRange;
    const y = height - normalized * (height - 8) - 4;
    return { x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) };
  });

  const moveTo = coordinates[0];
  const lineSegments = coordinates
    .slice(1)
    .map((point) => `L${point.x} ${point.y}`)
    .join(' ');

  const linePath = `M${moveTo.x} ${moveTo.y} ${lineSegments}`;

  const areaPath = `${linePath} L${coordinates[coordinates.length - 1].x} ${height} L${moveTo.x} ${height} Z`;

  return { linePath, areaPath };
}

export const SPARKLINE_BOUNDS = {
  width: DEFAULT_WIDTH,
  height: DEFAULT_HEIGHT,
};
