const BASE_URL    = 'https://fakerapi.it/api/v2/persons';
const TIMEOUT_MS  = 12_000;

export const fetchPersons = async ({
  quantity,
  birthdayStart,
  birthdayEnd,
  gender = '',
  locale = 'en_US',
}) => {
  const url = new URL(BASE_URL);
  url.searchParams.set('_quantity',       String(quantity));
  url.searchParams.set('_birthday_start', birthdayStart);
  url.searchParams.set('_birthday_end',   birthdayEnd);
  url.searchParams.set('_locale',         locale);

  if (gender) {
    url.searchParams.set('_gender', gender);
  }

  const controller = new AbortController();
  const timeoutId  = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url.toString(), {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const json = await response.json();

    if (json.status !== 'OK') {
      throw new Error(json.message ?? 'Unknown API error');
    }

    return (json.data ?? []);

  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('The request exceeded the time limit. Please try again.');
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
};
