// prettier-ignore
import {
    ChapterUnit,
    TextUnit, AnimateUnit, SystemUnit,
    BranchUnit, ChoiceUnit, FlagUnit, JumpUnit,
    Directive,
} from '../core';
import { flagTable } from './labelTable';

type Nodefn<T = any> = (this: RewriteParser, unit: ChapterUnit & { type: T }) => boolean | void;

type NodeType = ChapterUnit['type'];

export type IRNode = SceneBlock | BranchUnit | ChoiceUnit | FlagUnit | JumpUnit;

export class SceneBlock {
    type: 'tick' = 'tick';
    text: TextUnit[] = [];
    animate: AnimateUnit[] = [];
    system: SystemUnit[] = [];
    meta: Record<string, any> = {};
}

export class RewriteParser {
    cache: Map<string, IRNode[]> = new Map();

    ctx = {
        name: '',
        ir: new SceneBlock(),
        irs: [] as IRNode[],
    };

    private beforeNode: Map<string, Nodefn> = new Map();
    private onNode: Map<string, Nodefn> = new Map();
    private afterNode: Map<string, Nodefn> = new Map();

    setBeforeNode<K extends NodeType>(key: K, fn: Nodefn<K>) {
        this.beforeNode.set(key, fn);
    }

    setOnNode<K extends NodeType>(key: K, fn: Nodefn<K>) {
        this.onNode.set(key, fn);
    }

    setAfterNode<K extends NodeType>(key: K, fn: Nodefn<K>) {
        this.afterNode.set(key, fn);
    }

    isblankIR() {
        return this.ctx.ir.text.length === 0 && this.ctx.ir.animate.length === 0 && this.ctx.ir.system.length === 0;
    }

    pushIR() {
        if (this.isblankIR()) return;
        this.ctx.irs.push(this.ctx.ir);
        this.ctx.ir = new SceneBlock();
    }

    dump() {
        return this.cache;
    }

    solveSome(some: Record<string, ChapterUnit[]>) {
        Object.entries(some).forEach(([key, value]) => {
            this.solveOne(key, value);
        });
    }

    solveOne(name: string, units: ChapterUnit[]) {
        this.ctx.name = name;

        // function isUnitLike(unit: ChapterUnit): unit is UnitLike {
        //     return (unit as UnitLike).args !== undefined;
        // }

        for (const unit of units) {
            const type = unit.type;

            if (this.beforeNode.has(type)) {
                const result = this.beforeNode.get(type)!.call(this, unit);
                if (result === false) continue;
            }

            if (this.onNode.has(type)) {
                const result = this.onNode.get(type)!.call(this, unit);
                if (result === false) continue;
            }

            if (this.afterNode.has(type)) {
                const result = this.afterNode.get(type)!.call(this, unit);
                if (result === false) continue;
            }
        }

        this.pushIR();

        this.cache.set(name, this.ctx.irs);
        this.ctx = {
            name: '',
            ir: new SceneBlock(),
            irs: [] as SceneBlock[],
        };
    }
}

export const rewriteParser = new RewriteParser();

// text
rewriteParser.setBeforeNode('text', function () {
    this.pushIR();
});
rewriteParser.setOnNode('text', function (unit: TextUnit) {
    this.ctx.ir.text.push(unit);
});

// animate
rewriteParser.setOnNode('animate', function (unit: AnimateUnit) {
    this.ctx.ir.animate.push(unit);
});

// system
rewriteParser.setBeforeNode('system', function (unit: SystemUnit) {
    const c = unit.content;
    if (c.length === 0) return false; // no content, skip
});

rewriteParser.setOnNode('system', function (unit: SystemUnit) {
    this.ctx.ir.system.push(unit);
});

// Flow

rewriteParser.setOnNode('branch', function (unit: BranchUnit) {
    this.pushIR();
    this.ctx.irs.push(unit);
});

rewriteParser.setOnNode('choice', function (unit: ChoiceUnit) {
    this.pushIR();
    this.ctx.irs.push(unit);
});

rewriteParser.setOnNode('flag', function (unit: FlagUnit) {
    this.pushIR();
    flagTable.add(unit.name, this.ctx.name);
    this.ctx.irs.push(unit);
});

rewriteParser.setOnNode('jump', function (unit: JumpUnit) {
    this.pushIR();
    this.ctx.irs.push(unit);
});

// Directive

rewriteParser.setOnNode('directive', function (unit: Directive) {
    const name = unit.name;
    if (name == 'scene-boundary') {
        this.pushIR();
    } else if (name == 'scene-bind-next') {
        this.ctx.ir.meta.bindNext = true;
    } else {
        console.warn(`Unknown directive: ${name}`);
    }
});
