import { formatDate, calcAge } from '../utils/dateUtils.js';

const ICONS = {
  email: `<svg class="field-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M2.5 5.5l7.5 5 7.5-5M3 4h14a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1z"/></svg>`,
  phone: `<svg class="field-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M3.5 3.5l2.5 4.5-1.5 1.5c.8 1.6 2 2.9 3.5 3.7l1.5-1.5 4.5 2.5c0 2-1.5 3-3 3-5 0-10-5-10-10 0-1.5 1-3 3-3.7z"/></svg>`,
  web: `<svg class="field-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="10" cy="10" r="8"/><path d="M2 10h16M10 2c-2 4-2 12 0 16M10 2c2 4 2 12 0 16"/></svg>`,
};

const safeHostname = (raw) => {
  try {
    const href = raw.startsWith('http') ? raw : `https://${raw}`;
    return new URL(href).hostname;
  } catch {
    return raw;
  }
};

const initials = (firstname, lastname) =>
  `${firstname[0] ?? ''}${lastname[0] ?? ''}`.toUpperCase();

const personCardHTML = (person, index) => {
  const { firstname, lastname, email, phone, birthday, gender, website } = person;
  const fullName = `${firstname} ${lastname}`;
  const g        = (gender ?? 'other').toLowerCase();
  const age      = calcAge(birthday);
  const href     = website.startsWith('http') ? website : `https://${website}`;
  const host     = safeHostname(website);

  return `
    <article
      class="person-card"
      data-gender="${g}"
      style="animation-delay: ${index * 55}ms"
      aria-label="Person: ${fullName}"
    >
      <div class="card-header">
        <div class="card-avatar" aria-hidden="true">${initials(firstname, lastname)}</div>
        <div class="card-name-block">
          <p class="card-name">${fullName}</p>
          <p class="card-birthday">
            ${formatDate(birthday)}
            <span class="age-chip">${age} yrs</span>
          </p>
        </div>
        <span class="gender-badge">${g}</span>
      </div>

      <div class="card-divider" role="separator"></div>

      <div class="card-fields">
        <div class="card-field">
          ${ICONS.email}
          <span class="field-key">Email</span>
          <span class="field-val">
            <a href="mailto:${email}">${email}</a>
          </span>
        </div>
        <div class="card-field">
          ${ICONS.phone}
          <span class="field-key">Phone</span>
          <span class="field-val">
            <a href="tel:${phone}">${phone}</a>
          </span>
        </div>
        <div class="card-field">
          ${ICONS.web}
          <span class="field-key">Web</span>
          <span class="field-val">
            <a href="${href}" target="_blank" rel="noopener noreferrer">${host}</a>
          </span>
        </div>
      </div>
    </article>`;
};

export const renderCards = (container, persons) => {
  const grid = document.createElement('div');
  grid.className = 'cards-grid';
  grid.innerHTML  = persons.map(personCardHTML).join('');
  container.innerHTML = '';
  container.appendChild(grid);
};

export const renderEmptyState = (container) => {
  container.innerHTML = `
    <div class="state-box" role="status">
      <span class="state-icon" aria-hidden="true">◎</span>
      <p class="state-title">Ready to search</p>
      <p class="state-desc">Select a birth date range and click Search.</p>
    </div>`;
};

export const renderNoMatchState = (container) => {
  container.innerHTML = `
    <div class="state-box" role="status">
      <span class="state-icon" aria-hidden="true">🔍</span>
      <p class="state-title">No results found</p>
      <p class="state-desc">Try changing the filter or the date range.</p>
    </div>`;
};

export const renderErrorState = (container, message) => {
  container.innerHTML = `
    <div class="state-box state-box--error" role="alert">
      <span class="state-icon" aria-hidden="true">⚠</span>
      <p class="state-title">Request error</p>
      <p class="state-desc">${message}</p>
    </div>`;
};
