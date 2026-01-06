import { ChapterUnit } from './chapter';

export class ChapterSystem {
    chapters: Map<string, ChapterUnit[]> = new Map();
    contentCache: ChapterUnit[] = [];

    newChapter(name: string) {
        if (name === '') return false;

        if (this.chapters.has(name)) return false;

        this.chapters.set(name, this.contentCache);

        this.contentCache = [];

        return this.contentCache;
    }
}

export const chapterSystem = new ChapterSystem();
