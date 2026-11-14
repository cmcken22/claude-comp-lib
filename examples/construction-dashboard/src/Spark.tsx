// Tiny trend line with an area fill and an emphasized endpoint.
export function Spark({ values, tone = 'accent', label }: { values: number[]; tone?: 'accent' | 'success' | 'warning'; label: string }) {
  const w = 120, h = 36, pad = 3;
  const min = Math.min(...values), max = Math.max(...values);
  const x = (i: number) => pad + (i * (w - pad * 2)) / (values.length - 1);
  const y = (v: number) => h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2);
  const line = values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('');
  const area = `${line}L${x(values.length - 1)},${h}L${x(0)},${h}Z`;
  const last = values.length - 1;
  return (
    <svg className={`cd-spark cd-spark--${tone}`} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={label} preserveAspectRatio="none">
      <path className="cd-spark__area" d={area} />
      <path className="cd-spark__line" d={line} />
      <circle className="cd-spark__dot" cx={x(last)} cy={y(values[last])} r="3" />
    </svg>
  );
}
