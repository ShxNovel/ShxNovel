import { ChapterUnit, AnimateUnit, SysUnit, TextUnit, UnitLike } from '../core';
import { FlagUnit } from '../core/Flag';
import { flagTable } from './labelTable';

export class RewriteIR {
    text: TextUnit[] = [];
    animate: AnimateUnit[] = [];
    sys: SysUnit[] = [];
}

export class RewriteParser {
    cache: Map<string, RewriteIR[]> = new Map();

    ctx = {
        name: '',
        ir: new RewriteIR(),
        irs: [] as RewriteIR[],
    };

    isblankIR() {
        return this.ctx.ir.text.length === 0 && this.ctx.ir.animate.length === 0 && this.ctx.ir.sys.length === 0;
    }

    pushIR() {
        if (this.isblankIR()) return;
        this.ctx.irs.push(this.ctx.ir);
        this.ctx.ir = new RewriteIR();
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

        function isUnitLike(unit: ChapterUnit): unit is UnitLike {
            return (unit as UnitLike).args !== undefined;
        }

        for (const unit of units) {
            if (unit.type === 'text' && !isUnitLike(unit)) {
                if (this.beforeText(unit) === false) continue;
                if (this.onText(unit) === false) continue;
            } else if (unit.type === 'animate' && !isUnitLike(unit)) {
                if (this.onAnimate(unit) === false) continue;
            } else if (unit.type === 'sys' && !isUnitLike(unit)) {
                if (this.beforeSys(unit) === false) continue;
                if (this.onSys(unit) === false) continue;
            } else if (unit.type === 'label' && !isUnitLike(unit)) {
                this.onLabel(unit);
            } else {
                if (this.onOthers(unit as UnitLike) === false) continue;
            }
        }

        this.pushIR();

        this.cache.set(name, this.ctx.irs);
        this.ctx = {
            name: '',
            ir: new RewriteIR(),
            irs: [] as RewriteIR[],
        };
    }

    /* Text */

    beforeText(unit: TextUnit): boolean | void {
        unit;
        this.pushIR();
    }
    onText(unit: TextUnit): boolean | void {
        this.ctx.ir.text.push(unit);
    }

    /* Animate */

    onAnimate(unit: AnimateUnit): boolean | void {
        this.ctx.ir.animate.push(unit);
    }

    /* Sys */

    beforeSys(unit: SysUnit): boolean | void {
        const c = unit.content;
        if (c.length === 0) return false; // no content, skip

        if (c[0].type === 'cut') {
            if (this.isblankIR()) return false;
            this.pushIR();
            return false;
        }
    }
    onSys(unit: SysUnit): boolean | void {
        this.ctx.ir.sys.push(unit);
    }

    /* Label */

    onLabel(unit: FlagUnit): boolean | void {
        flagTable.add(unit.name, this.ctx.name);
    }

    /* Others */

    onOthers(unit: UnitLike): boolean | void {
        unit;
    }
}

export const rewriteParser = new RewriteParser();
