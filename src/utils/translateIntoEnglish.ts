export async function translateToEnglish(
  word: string,
  fromLang: string = 'en',
): Promise<string | null> {
  if (fromLang == 'en') {
    return word;
  }
  const url =
    `https://${fromLang}.wiktionary.org/w/api.php` +
    `?action=query` +
    `&format=json` +
    `&titles=${encodeURIComponent(word)}` +
    `&prop=extracts` +
    `&explaintext=1`;

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'MyApp/1.0',
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data;
}
