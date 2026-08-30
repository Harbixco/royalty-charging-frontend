import React from 'react';
import Card from '../ui/Card.jsx';

// Small trailing "charge bars" glyph used as the card's visual accent —
// reinforces the signature motif at a glance without competing with the number.
const ChargeGlyph = ({ tone }) => (
  <div className={`charge-bars ${tone}`}>
    <span className="h-2" />
    <span className="h-3.5" />
    <span className="h-5" />
  </div>
);

const TONES = {
  core: { icon: 'bg-core-100 text-core-700', glyph: 'text-core-300' },
  spark: { icon: 'bg-spark-100 text-spark-600', glyph: 'text-spark-300' },
  success: { icon: 'bg-emerald-100 text-emerald-700', glyph: 'text-emerald-300' },
};

const StatCard = ({ label, value, icon: Icon, tone = 'core', hint }) => {
  const t = TONES[tone] || TONES.core;
  return (
    <Card className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-core-400">{label}</p>
        <p className="mt-2 font-display text-2xl font-semibold text-core-800 sm:text-[28px]">{value}</p>
        {hint && <p className="mt-1 text-xs text-core-400">{hint}</p>}
      </div>
      <div className="flex flex-col items-end gap-3">
        <div className={`rounded-xl p-2.5 ${t.icon}`}>
          <Icon size={18} />
        </div>
        <ChargeGlyph tone={t.glyph} />
      </div>
    </Card>
  );
};

export default StatCard;
