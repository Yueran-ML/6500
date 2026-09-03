import { useEffect, useRef } from 'react';
import { categoryEmoji } from '../data.js';
import { UrgencyStamp, ShareTag, OwnerDot, ownerLabel } from './Tags.jsx';

export default function FoodCard({ item, onOpen, highlight = false, onHighlightDone }) {
  const ref = useRef(null);

  // A freshly saved item is scrolled into view and pulses once, so the
  // "verify it appeared" step of the add task has something to find.
  useEffect(() => {
    if (!highlight) return undefined;
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const t = setTimeout(() => onHighlightDone?.(), 2400);
    return () => clearTimeout(t);
  }, [highlight, onHighlightDone]);

  return (
    <button
      ref={ref}
      type="button"
      className={`food-card${highlight ? ' food-card--new' : ''}`}
      onClick={() => onOpen(item.id)}
    >
      <span className="food-card__tile" aria-hidden="true">
        {categoryEmoji(item.category)}
      </span>
      <span className="food-card__name">{item.name}</span>
      <span className="food-card__urgency">
        <UrgencyStamp expiry={item.expiry} />
      </span>
      <span className="food-card__meta">
        <OwnerDot name={item.owner} size={16} />
        <span className="food-card__owner">{ownerLabel(item.owner)}</span>
        {item.storage && (
          <>
            <span className="dot-sep" aria-hidden="true">
              ·
            </span>
            <span>{item.storage}</span>
          </>
        )}
      </span>
      <span className="food-card__share">
        <ShareTag shared={item.shared} />
      </span>
    </button>
  );
}
