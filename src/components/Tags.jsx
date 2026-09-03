import { urgencyOf, formatStamp } from '../lib/date.js';
import { housemateColor, CURRENT_USER } from '../data.js';
import Icon from './Icon.jsx';

export function ownerLabel(name) {
  return name === CURRENT_USER ? 'You' : name;
}

export function UrgencyStamp({ expiry, size = 'sm' }) {
  const u = urgencyOf(expiry);
  return <span className={`stamp stamp--${u.tone} stamp--${size}`}>{u.label}</span>;
}

export function ShareTag({ shared, size = 'sm' }) {
  return shared ? (
    <span className={`tag tag--shared tag--${size}`}>Shared</span>
  ) : (
    <span className={`tag tag--private tag--${size}`}>
      <Icon name="lock" size={size === 'md' ? 13 : 11} />
      Private
    </span>
  );
}

export function OwnerDot({ name, size = 18 }) {
  return (
    <span
      className="owner-dot"
      style={{ background: housemateColor(name), width: size, height: size, fontSize: Math.round(size * 0.52) }}
      aria-hidden="true"
    >
      {name.charAt(0)}
    </span>
  );
}

export function DateStamp({ iso }) {
  return (
    <span className="datestamp" title="Best before">
      {formatStamp(iso)}
    </span>
  );
}
