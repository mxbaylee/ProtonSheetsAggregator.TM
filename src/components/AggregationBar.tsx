import React, { useEffect, useRef, useState } from 'react';
import { generateValues, AggregateResult } from '../lib/aggregator';
import { getSelectedRange, isMultiCellRange, getRawSelectedValues } from '../lib/cellExtractor';

const POLL_INTERVAL_MS = 300;

export const AggregationBar: React.FC = () => {
  const [metrics, setMetrics] = useState<AggregateResult>({});
  const lastRangeRef = useRef<string>('');

  useEffect(() => {
    const tick = async () => {
      const range = getSelectedRange();
      if (range === lastRangeRef.current) return;
      lastRangeRef.current = range;

      if (!range || !isMultiCellRange(range)) {
        setMetrics({});
        return;
      }

      try {
        const cells = await getRawSelectedValues();
        setMetrics(generateValues(cells));
      } catch (err) {
        console.error('[ProtonSheetsAggregator] extraction failed:', err);
      }
    };

    const id = setInterval(tick, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const hasMetrics = Object.keys(metrics).length > 0;

  if (!hasMetrics) return null;

  return (
    <div className="proton-aggregation-bar">
      {metrics.count !== undefined && <span>Count: {metrics.count}</span>}
      {metrics.sum !== undefined && <span>Sum: {metrics.sum}</span>}
      {metrics.average !== undefined && <span>Average: {metrics.average}</span>}
    </div>
  );
};
