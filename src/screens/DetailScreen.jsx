import { useState } from 'react';
import { categoryEmoji, CURRENT_USER } from '../data.js';
import { formatLong } from '../lib/date.js';
import ScreenHeader from '../components/ScreenHeader.jsx';
import Icon from '../components/Icon.jsx';
import { UrgencyStamp, ShareTag, OwnerDot, DateStamp, ownerLabel } from '../components/Tags.jsx';

export default function DetailScreen({ item, onBack, onEdit, onRemove }) {
  const [confirming, setConfirming] = useState(false);
  const isOwner = item.owner === CURRENT_USER;

  return (
    <div className="screen">
      <ScreenHeader onBack={onBack} title="Food details" />

      <main className="screen-body">
        <div className="detail-hero">
          <span className="detail-hero__tile" aria-hidden="true">
            {categoryEmoji(item.category)}
          </span>
          <h2 className="detail-hero__name">{item.name}</h2>
          <p className="detail-hero__cat">{item.category}</p>
          <DateStamp iso={item.expiry} />
        </div>

        <dl className="info-card">
          <div className="info-row">
            <dt>Owner</dt>
            <dd>
              <OwnerDot name={item.owner} size={20} />
              {isOwner ? (
                <span>
                  {CURRENT_USER} <span className="muted">(you)</span>
                </span>
              ) : (
                ownerLabel(item.owner)
              )}
            </dd>
          </div>
          <div className="info-row">
            <dt>Sharing status</dt>
            <dd>
              <ShareTag shared={item.shared} size="md" />
            </dd>
          </div>
          <div className="info-row">
            <dt>Expiry date</dt>
            <dd>{formatLong(item.expiry)}</dd>
          </div>
          <div className="info-row">
            <dt>Urgency</dt>
            <dd>
              <UrgencyStamp expiry={item.expiry} size="md" />
            </dd>
          </div>
          <div className="info-row">
            <dt>Storage</dt>
            <dd>{item.storage || <span className="muted">Not set</span>}</dd>
          </div>
        </dl>

        {isOwner ? (
          <>
            <p className="notice notice--owner">
              <Icon name="info" size={16} />
              You own this item. Housemates can see it, but only you can change it.
            </p>
            {confirming ? (
              <div className="confirm" role="alertdialog" aria-label="Confirm removal">
                <p>
                  Remove <strong>{item.name}</strong> from the fridge?
                </p>
                <div className="btn-row">
                  <button type="button" className="btn btn--ghost" onClick={() => setConfirming(false)}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn--danger" onClick={() => onRemove(item.id)}>
                    Yes, remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="btn-row">
                <button type="button" className="btn btn--secondary" onClick={() => onEdit(item.id)}>
                  <Icon name="edit" size={18} />
                  Edit
                </button>
                <button type="button" className="btn btn--ghost-danger" onClick={() => setConfirming(true)}>
                  <Icon name="trash" size={18} />
                  Remove
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="notice">
            <Icon name="lock" size={16} />
            Only the owner can edit or remove this item.
          </p>
        )}
      </main>
    </div>
  );
}
