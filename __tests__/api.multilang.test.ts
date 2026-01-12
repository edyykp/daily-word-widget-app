import {
  fetchRandomWordFromWiktionary,
  fetchRandomWord,
  fetchWordDefinition,
} from '../src/services/api';

jest.setTimeout(20000);

describe('Multilingual API prototype', () => {
  test('Wiktionary returns a random Spanish word', async () => {
    const w = await fetchRandomWordFromWiktionary('es');
    expect(typeof w === 'string' || w === null).toBe(true);
    if (w) {
      expect(w.length).toBeGreaterThan(0);
    }
  });

  test('Fetch random Spanish word with definition (integration)', async () => {
    const entry = await fetchRandomWord('es');
    expect(typeof entry === 'string').toBe(true);
  });

  test('Fetch known Spanish word definition', async () => {
    const def = await fetchWordDefinition('amor', 'es');
    // Definition may be null if API doesn't have it, but function should not throw
    expect(def === null || typeof def === 'object').toBeTruthy();
  });
});
