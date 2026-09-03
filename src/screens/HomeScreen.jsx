import { useEffect, useMemo, useRef, useState } from 'react';
import { HOUSEHOLD, CURRENT_USER } from '../data.js';
import { daysLeft } from '../lib/date.js';
import FoodCard from '../components/FoodCard.jsx';
import BottomNav from '../components/BottomNav.jsx';
import Icon from '../components/Icon.jsx';
import { OwnerDot } from '../components/Tags.jsx';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'soon', label: 'Use Soon' },
  { id: 'shared', label: 'Shared' },
  { id: 'mine', label: 'Mine' },
];

function matches(item, filter) {
  switch (filter) {
    case 'soon':
      return daysLeft(item.expiry) <= 3;
    case 'shared':
      return item.shared;
    case 'mine':
      return item.owner === CURRENT_USER;
    default:
      return true;
  }
}

const EMPTY = {
  all: ['The fridge is empty', 'Add something to get started.'],
  soon: ['Nothing needs using soon', 'Everything has more than three days left.'],
  shared: ['No shared items', 'Items marked Shared will show here.'],
  mine: ['Nothing of yours yet', 'Items you add appear here.'],
  search: ['No matches', 'Try a different name, owner or category.'],
};

export default function HomeScreen({
  items,
  filter,
  onFilter,
  query,
  onQuery,
  onOpen,
  onAdd,
  onNav,
  highlightId,
  onHighlightDone,
}) {
  const [searching, setSearching] = useState(Boolean(query));
  const inputRef = useRef(null);

  useEffect(() => {
    if (searching) inputRef.current?.focus();
  }, [searching]);

  const counts = useMemo(
    () => Object.fromEntries(FILTERS.map((f) => [f.id, items.filter((i) => matches(i, f.id)).length])),
    [items]
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter((i) => matches(i, filter))
      .filter((i) => !q || [i.name, i.owner, i.category, i.storage].some((v) => v?.toLowerCase().includes(q)))
      .sort((a, b) => a.expiry.localeCompare(b.expiry) || a.name.localeCompare(b.name));
  }, [items, filter, query]);

  const emptyKey = query.trim() ? 'search' : filter;

  return (
    <div className="screen">
      <header className="screen-header screen-header--home">
        {searching ? (
          <div className="searchbar">
            <Icon name="search" size={18} />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="Search food, owner or category"
              aria-label="Search the fridge"
              autoComplete="off"
            />
            <button
              type="button"
              className="text-btn"
              onClick={() => {
                onQuery('');
                setSearching(false);
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <div className="screen-header__titles">
              <h1 className="screen-header__title">My Fridge</h1>
              <p className="screen-header__subtitle">{HOUSEHOLD}</p>
            </div>
            <div className="screen-header__right">
              <button type="button" className="icon-btn" onClick={() => setSearching(true)} aria-label="Search">
                <Icon name="search" size={22} />
              </button>
              <span className="avatar" title={`Signed in as ${CURRENT_USER}`}>
                <OwnerDot name={CURRENT_USER} size={34} />
              </span>
            </div>
          </>
        )}
      </header>

      <div className="filters" aria-label="Filter items">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`chip${filter === f.id ? ' is-active' : ''}`}
            aria-pressed={filter === f.id}
            onClick={() => onFilter(f.id)}
          >
            {f.label}
            <span className="chip__count">{counts[f.id]}</span>
          </button>
        ))}
      </div>

      <main className="screen-body">
        <button type="button" className="btn btn--primary btn--block" onClick={onAdd}>
          <Icon name="plus" size={20} />
          Add Food
        </button>

        {visible.length === 0 ? (
          <div className="empty">
            <p className="empty__title">{EMPTY[emptyKey][0]}</p>
            <p className="empty__hint">{EMPTY[emptyKey][1]}</p>
          </div>
        ) : (
          <ul className="food-list">
            {visible.map((item) => (
              <li key={item.id}>
                <FoodCard
                  item={item}
                  onOpen={onOpen}
                  highlight={item.id === highlightId}
                  onHighlightDone={onHighlightDone}
                />
              </li>
            ))}
          </ul>
        )}
      </main>

      <BottomNav active="home" onNav={onNav} />
    </div>
  );
}
