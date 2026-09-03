import { HOUSEHOLD } from '../data.js';
import { formatLong } from '../lib/date.js';
import Icon from '../components/Icon.jsx';
import { UrgencyStamp, ShareTag, OwnerDot, ownerLabel } from '../components/Tags.jsx';

export default function SuccessScreen({ item, onViewInFridge, onAddAnother }) {
  return (
    <div className="screen">
      <main className="screen-body success">
        <div className="success__mark" aria-hidden="true">
          <Icon name="check" size={34} />
        </div>
        <h1 className="success__title">Saved to the fridge</h1>
        <p className="success__lead">
          <strong>{item.name}</strong>{' '}
          {item.shared ? <>is now shared with {HOUSEHOLD}.</> : <>is in the fridge and marked as yours.</>}
        </p>

        <dl className="info-card info-card--compact">
          <div className="info-row">
            <dt>Category</dt>
            <dd>{item.category}</dd>
          </div>
          <div className="info-row">
            <dt>Owner</dt>
            <dd>
              <OwnerDot name={item.owner} size={18} />
              {ownerLabel(item.owner)}
            </dd>
          </div>
          <div className="info-row">
            <dt>Sharing</dt>
            <dd>
              <ShareTag shared={item.shared} />
            </dd>
          </div>
          <div className="info-row">
            <dt>Expiry</dt>
            <dd>
              <span>{formatLong(item.expiry)}</span>
              <UrgencyStamp expiry={item.expiry} />
            </dd>
          </div>
          <div className="info-row">
            <dt>Storage</dt>
            <dd>{item.storage || <span className="muted">Not set</span>}</dd>
          </div>
        </dl>

        <div className="success__actions">
          <button type="button" className="btn btn--primary btn--block" onClick={onViewInFridge}>
            View in Fridge
          </button>
          <button type="button" className="btn btn--ghost btn--block" onClick={onAddAnother}>
            Add another item
          </button>
        </div>
      </main>
    </div>
  );
}
