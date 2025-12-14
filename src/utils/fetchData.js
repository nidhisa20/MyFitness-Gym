export const EXERCISES_API_URL = 'https://exercisedb-api.vercel.app/api/v1/exercises';

export const exerciseOptions = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
};

export const fetchData = async (url, options, { raw = false } = {}) => {
  const res = await fetch(url, options);
  if (!res.ok) {
    const errorMessage = await res.text();
    throw new Error(`Request failed: ${res.status} ${errorMessage}`);
  }

  const data = await res.json();

  return raw ? data : data?.data ?? data;
};

export const youtubeOptions = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Host': 'youtube-search-and-download.p.rapidapi.com',
    'X-RapidAPI-Key': '2f89a97a6bmsh69415cd83e4d192p197eefjsnea1bcd5685c6',
  },
};

export const normalizeExercises = (payload = []) => {
  if (!Array.isArray(payload)) return [];

  return payload.map((item) => {
    const bodyPart = item.bodyPart || item.bodyParts?.[0] || '';
    const target = item.target || item.targetMuscles?.[0] || '';
    const equipment = item.equipment || item.equipments?.[0] || '';

    return {
      id:
        item.id ||
        item.exerciseId ||
        item._id ||
        item.slug ||
        `${item.name}-${bodyPart}`,
      name: item.name || '',
      gifUrl: item.gifUrl || '',
      bodyPart,
      target,
      equipment,
      bodyParts: item.bodyParts || (bodyPart ? [bodyPart] : []),
      targetMuscles: item.targetMuscles || (target ? [target] : []),
      equipments: item.equipments || (equipment ? [equipment] : []),
      secondaryMuscles: item.secondaryMuscles || [],
      instructions: item.instructions || [],
    };
  });
};

export const fetchAllExercises = async (limit = 1500) => {
  const perPage = 100;
  let offset = 0;
  let all = [];
  let hasMore = true;

  while (hasMore && all.length < limit) {
    const page = await fetchData(
      `${EXERCISES_API_URL}?limit=${perPage}&offset=${offset}`,
      exerciseOptions,
      { raw: true }
    );
    const normalized = normalizeExercises(page?.data ?? page ?? []);
    all = all.concat(normalized);

    const nextPage = page?.metadata?.nextPage;
    hasMore = Boolean(nextPage) && normalized.length > 0;
    offset += perPage;
  }

  return all.slice(0, limit);
};


