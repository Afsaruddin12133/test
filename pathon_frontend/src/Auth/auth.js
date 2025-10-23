const AUTH_STORAGE_KEY = "auth";
const AUTH_META_KEY = "authMeta";

const canUseStorage = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const safeParse = (raw) => {
  if (!raw || typeof raw !== "string") return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const coerceString = (value) => {
  if (value == null) return null;
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  return null;
};

const pickFromCandidates = (candidates = []) => {
  for (const candidate of candidates) {
    const str = coerceString(candidate);
    if (str) return str;
  }
  return null;
};

const pickToken = (auth) => {
  if (!auth || typeof auth !== "object") {
    return coerceString(auth);
  }

  const direct = pickFromCandidates([
    auth.token,
    auth.accessToken,
    auth.authToken,
  ]);
  if (direct) return direct;

  const fromUser = pickFromCandidates([
    auth.user?.token,
    auth.user?.accessToken,
    auth.user?.authToken,
  ]);
  if (fromUser) return fromUser;

  const fromData = pickFromCandidates([
    auth.data?.token,
    auth.data?.accessToken,
    auth.data?.authToken,
    auth.data?.user?.token,
    auth.data?.user?.accessToken,
  ]);
  if (fromData) return fromData;

  if (typeof auth.token === "object" && auth.token) {
    const nested = pickToken(auth.token);
    if (nested) return nested;
  }

  return null;
};

const pickUserId = (auth) => {
  if (!auth || typeof auth !== "object") return null;

  return (
    pickFromCandidates([
      auth.user?.id,
      auth.user?.user_id,
      auth.user?.uid,
      auth.user_id,
      auth.uid,
      auth.id,
      auth.data?.user_id,
      auth.data?.id,
      auth.data?.user?.id,
      auth.data?.user?.user_id,
    ]) || null
  );
};

export const refreshAuthSnapshot = () => {
  if (!canUseStorage()) return { token: null, userId: null };

  const authRaw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  const auth = safeParse(authRaw) || {};

  const summary = {
    token: pickToken(auth),
    userId: pickUserId(auth),
  };

  if (summary.token || summary.userId) {
    window.localStorage.setItem(AUTH_META_KEY, JSON.stringify(summary));
  } else {
    window.localStorage.removeItem(AUTH_META_KEY);
  }

  return summary;
};

const readMeta = () => {
  if (!canUseStorage()) return { token: null, userId: null };
  return safeParse(window.localStorage.getItem(AUTH_META_KEY)) || { token: null, userId: null };
};

export const getUserToken = () => {
  const cached = readMeta();
  if (cached.token) return cached.token;
  const { token } = refreshAuthSnapshot();
  return token;
};

export const getUserId = () => {
  const cached = readMeta();
  if (cached.userId) return cached.userId;
  const { userId } = refreshAuthSnapshot();
  return userId;
};
