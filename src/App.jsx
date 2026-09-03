import { useCallback, useEffect, useRef, useState } from 'react';
import { seedItems } from './data.js';
import { loadItems, saveItems, clearItems } from './lib/storage.js';
import HomeScreen from './screens/HomeScreen.jsx';
import DetailScreen from './screens/DetailScreen.jsx';
import AddFoodScreen from './screens/AddFoodScreen.jsx';
import SuccessScreen from './screens/SuccessScreen.jsx';
import HousematesScreen from './screens/HousematesScreen.jsx';
import SettingsScreen from './screens/SettingsScreen.jsx';

// Routes are plain state, not URLs: { name: 'home' | 'detail' | 'add' | 'success' | 'housemates' | 'settings', id?, editId? }
const HOME = { name: 'home' };

export default function App() {
  const [items, setItems] = useState(() => loadItems() ?? seedItems());
  const [route, setRoute] = useState(HOME);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [highlightId, setHighlightId] = useState(null);
  const [draft, setDraft] = useState(null); // unsaved Add Food form, kept if the user steps back

  useEffect(() => {
    saveItems(items);
  }, [items]);

  const back = useCallback(() => {
    setRoute((r) => {
      if (r.name === 'add' && r.editId) return { name: 'detail', id: r.editId };
      if (r.name === 'home') return r;
      return HOME;
    });
  }, []);

  // When the prototype is opened as a page of its own (not embedded), map the
  // device/browser Back button to in-app back so Android users don't fall out
  // of the app mid-task.
  const backRef = useRef(back);
  backRef.current = back;
  useEffect(() => {
    if (window.self !== window.top) return undefined;
    try {
      window.history.pushState({ sharefridge: true }, '');
    } catch {
      return undefined;
    }
    const onPop = () => {
      try {
        window.history.pushState({ sharefridge: true }, '');
      } catch {
        /* ignore */
      }
      backRef.current();
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const onNav = (name) => setRoute({ name });
  const open = (id) => setRoute({ name: 'detail', id });
  const startAdd = () => setRoute({ name: 'add' });
  const startEdit = (id) => setRoute({ name: 'add', editId: id });

  const addItem = (data) => {
    const id = `item-${Date.now().toString(36)}`;
    setItems((prev) => [...prev, { id, ...data }]);
    setDraft(null);
    setRoute({ name: 'success', id });
  };

  const updateItem = (id, data) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...data } : i)));
    setRoute({ name: 'detail', id });
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setRoute(HOME);
  };

  const viewInFridge = (id) => {
    setFilter('all');
    setQuery('');
    setHighlightId(id);
    setRoute(HOME);
  };

  const clearHighlight = useCallback(() => setHighlightId(null), []);

  const reset = () => {
    clearItems();
    setItems(seedItems());
    setDraft(null);
    setFilter('all');
    setQuery('');
    setHighlightId(null);
    setRoute(HOME);
  };

  const find = (id) => items.find((i) => i.id === id);

  const home = (
    <HomeScreen
      items={items}
      filter={filter}
      onFilter={setFilter}
      query={query}
      onQuery={setQuery}
      onOpen={open}
      onAdd={startAdd}
      onNav={onNav}
      highlightId={highlightId}
      onHighlightDone={clearHighlight}
    />
  );

  let screen = home;
  switch (route.name) {
    case 'detail': {
      const item = find(route.id);
      if (item) screen = <DetailScreen item={item} onBack={back} onEdit={startEdit} onRemove={removeItem} />;
      break;
    }
    case 'add': {
      const editing = route.editId ? find(route.editId) : null;
      screen = (
        <AddFoodScreen
          mode={editing ? 'edit' : 'add'}
          initial={
            editing
              ? { name: editing.name, category: editing.category, shared: editing.shared, expiry: editing.expiry, storage: editing.storage || '' }
              : draft
          }
          onChange={editing ? undefined : setDraft}
          onSave={(data) => (editing ? updateItem(editing.id, data) : addItem(data))}
          onBack={back}
        />
      );
      break;
    }
    case 'success': {
      const item = find(route.id);
      if (item) screen = <SuccessScreen item={item} onViewInFridge={() => viewInFridge(item.id)} onAddAnother={startAdd} />;
      break;
    }
    case 'housemates':
      screen = <HousematesScreen items={items} onNav={onNav} />;
      break;
    case 'settings':
      screen = <SettingsScreen onNav={onNav} onReset={reset} itemCount={items.length} />;
      break;
    default:
      break;
  }

  // Keying the frame on the route remounts the screen, which resets scroll and
  // replays the short enter animation on every navigation.
  const screenKey = `${route.name}:${route.id || route.editId || ''}`;

  return (
    <div className="stage">
      <div className="phone" key={screenKey}>
        {screen}
      </div>
      <p className="stage-caption">ShareFridge · React prototype v2 · DECO6500 Team 9</p>
    </div>
  );
}
