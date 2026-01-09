class LabelTable {
    table = new Map<string, string>();

    add(label: string, where: string) {
        if (this.table.has(label)) {
            throw new Error(`Label "${label}" already exists`);
        }
        this.table.set(label, where);
    }
}

export const labelTable = new LabelTable();
