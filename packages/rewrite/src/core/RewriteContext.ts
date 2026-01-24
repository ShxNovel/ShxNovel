import { ChapterUnit } from './Chapter';

export class RewriteContext {
    chapters: Map<string, ChapterUnit[]> = new Map();
    contentCache: ChapterUnit[] = [];

    newChapter(name: string) {
        if (name === '') {
            throw new Error('Chapter name cannot be empty');
        }

        if (this.chapters.has(name)) {
            throw new Error(`Chapter ${name} already exists`);
        }

        this.contentCache = [];

        return this.chapters.set(name, this.contentCache);
    }

    push(unit: ChapterUnit) {
        this.contentCache.push(unit);
    }
}

export const rewriteContext = new RewriteContext();
