export const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

export const TEN_MINUTES = 10 * 60 * 1000;

export const FIVE_MINUTES = 5 * 60 * 1000;

/** 1 GB storage quota aligned with Pinata Free Tier (in bytes). */
export const DEFAULT_STORAGE_LIMIT = 1024 * 1024 * 1024;

/** Legacy 15 GB default used before aligning with Pinata Free Tier. */
export const LEGACY_DEFAULT_STORAGE_LIMIT = 16105174016;

/** Pinata v3 single-POST signed upload limit (100 MB in bytes). */
export const MAX_SINGLE_UPLOAD_BYTES = 100 * 1024 * 1024;
