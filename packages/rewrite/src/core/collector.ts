import { ChapterUnit } from './chapter';

export class Collector {
    id = Math.random();
    chapters: Map<string, ChapterUnit[]> = new Map();
    contentCache: ChapterUnit[] = [];

    newChapter(name: string) {
        if (name === '') return false;

        if (this.chapters.has(name)) return false;

        this.contentCache = [];

        return this.chapters.set(name, this.contentCache);
    }

    push(unit: ChapterUnit) {
        this.contentCache.push(unit);
    }
}

export const collector = new Collector();
