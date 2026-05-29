const state = {
  allPersons:     [],
  visiblePersons: [],
  sortKey:        'name',
  sortAsc:        true,
  filterText:     '',
  isLoading:      false,
};

const subscribers = new Set();

export const subscribe = (fn) => {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
};

const notify = () => {
  const snapshot = Object.freeze({ ...state });
  subscribers.forEach((fn) => fn(snapshot));
};

const applySortFilter = (persons, key, asc, text) => {
  const q = text.trim().toLowerCase();
  const filtered = q
    ? persons.filter(
        (p) =>
          `${p.firstname} ${p.lastname}`.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          p.phone.includes(q),
      )
    : [...persons];

  filtered.sort((a, b) => {
    let va, vb;
    switch (key) {
      case 'name':
        va = `${a.firstname} ${a.lastname}`.toLowerCase();
        vb = `${b.firstname} ${b.lastname}`.toLowerCase();
        break;
      case 'birthday':
        va = a.birthday;
        vb = b.birthday;
        break;
      case 'gender':
        va = a.gender;
        vb = b.gender;
        break;
    }
    if (va < vb) return asc ? -1 : 1;
    if (va > vb) return asc ? 1  : -1;
    return 0;
  });

  return filtered;
};

export const setLoading = (value) => {
  state.isLoading = value;
  notify();
};

export const setPersons = (persons) => {
  state.allPersons     = persons;
  state.visiblePersons = applySortFilter(persons, state.sortKey, state.sortAsc, state.filterText);
  notify();
};

export const setSort = (key) => {
  if (state.sortKey === key) {
    state.sortAsc = !state.sortAsc;
  } else {
    state.sortKey = key;
    state.sortAsc = true;
  }
  state.visiblePersons = applySortFilter(state.allPersons, state.sortKey, state.sortAsc, state.filterText);
  notify();
};

export const setFilter = (text) => {
  state.filterText     = text;
  state.visiblePersons = applySortFilter(state.allPersons, state.sortKey, state.sortAsc, text);
  notify();
};

export const getState = () => Object.freeze({ ...state });
