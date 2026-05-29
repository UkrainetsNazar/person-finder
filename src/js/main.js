import { fetchPersons }                    from './api/personsApi.js';
import { subscribe, setLoading, setPersons, setSort, setFilter, getState } from './state/appState.js';
import { renderCards, renderEmptyState, renderNoMatchState, renderErrorState } from './ui/renderCards.js';
import { renderSkeleton }                  from './ui/renderSkeleton.js';
import { showToast }                       from './ui/toast.js';
import { validateDateRange }               from './utils/validate.js';
import { getTodayISO, yearsAgoISO }        from './utils/dateUtils.js';
import { debounce }                        from './utils/debounce.js';

/* ── DOM refs ────────────────────────────────────────────────── */
const inputStart   = (document.getElementById('date-start'));
const inputEnd     = (document.getElementById('date-end'));
const hintStart    = (document.getElementById('hint-start'));
const hintEnd      = (document.getElementById('hint-end'));
const btnSearch    = (document.getElementById('btn-search'));
const selectQty    = (document.getElementById('qty'));
const selectGender = (document.getElementById('gender-select'));
const selectLocale = (document.getElementById('locale-select'));
const controlsBar  = (document.getElementById('controls-bar'));
const resultCount  = (document.getElementById('result-count'));
const filterInput  = (document.getElementById('filter-input'));
const outputEl     = (document.getElementById('output'));
const clockEl      = (document.getElementById('clock'));

const updateClock = () => {
  clockEl.textContent = new Date().toLocaleTimeString('uk-UA', { hour12: false });
};
updateClock();
setInterval(updateClock, 1_000);

const today = getTodayISO();
inputEnd.value   = today;
inputEnd.max     = today;
inputStart.max   = today;
inputStart.value = yearsAgoISO(30);

const setFieldError = (inputEl, hintEl, message) => {
  hintEl.textContent = message;
  hintEl.classList.toggle('is-visible', !!message);
  inputEl.classList.toggle('is-error', !!message);
};

const clearErrors = () => {
  setFieldError(inputStart, hintStart, '');
  setFieldError(inputEnd,   hintEnd,   '');
};

const handleSearch = async () => {
  if (getState().isLoading) return;

  clearErrors();

  const { valid, startError, endError } = validateDateRange(
    inputStart.value,
    inputEnd.value,
    today,
  );

  if (!valid) {
    if (startError) setFieldError(inputStart, hintStart, startError);
    if (endError)   setFieldError(inputEnd,   hintEnd,   endError);
    return;
  }

  const quantity = Number(selectQty.value);

  setLoading(true);
  filterInput.value = '';
  setFilter('');
  renderSkeleton(outputEl, Math.min(quantity, 6));

  try {
    const persons = await fetchPersons({
      quantity,
      birthdayStart: inputStart.value,
      birthdayEnd:   inputEnd.value,
      gender:        selectGender.value,
      locale:        selectLocale.value,
    });

    setPersons(persons);

    const msg = persons.length === 0
      ? 'No results found for this range'
      : `Loaded ${persons.length} person${persons.length !== 1 ? 's' : ''}`;
    showToast(msg);

  } catch (err) {
    renderErrorState(outputEl, err.message);
    showToast(`⚠ ${err.message}`, 5_000);
    controlsBar.setAttribute('aria-hidden', 'true');
    controlsBar.classList.remove('is-visible');
  } finally {
    setLoading(false);
  }
};

subscribe((state) => {
  btnSearch.disabled = state.isLoading;
  btnSearch.classList.toggle('is-loading', state.isLoading);

  if (state.isLoading) return;

  const { allPersons, visiblePersons } = state;

  if (allPersons.length === 0) return;

  controlsBar.removeAttribute('aria-hidden');
  controlsBar.classList.add('is-visible');

  const total = allPersons.length;
  const shown = visiblePersons.length;
  resultCount.innerHTML = shown < total
    ? `Showing <strong>${shown}</strong> of <strong>${total}</strong> persons`
    : `Found <strong>${total}</strong> person${total !== 1 ? 's' : ''}`;

  if (visiblePersons.length === 0) {
    renderNoMatchState(outputEl);
  } else {
    renderCards(outputEl, visiblePersons);
  }
});

document.querySelectorAll('.sort-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const key = btn.dataset.sort;

    document.querySelectorAll('.sort-btn').forEach((b) => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });

    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');

    setSort(key);
  });
});

filterInput.addEventListener(
  'input',
  debounce((e) => setFilter(e.target.value), 220),
);

btnSearch.addEventListener('click', handleSearch);

[inputStart, inputEnd].forEach((el) => {
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSearch();
  });
});

renderEmptyState(outputEl);