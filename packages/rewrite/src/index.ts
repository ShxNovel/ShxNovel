export * from './core';
export * from './parser';

// global

import { useChapter as _useChapter } from './core';

declare global {
    const useChapter: typeof _useChapter;
}
