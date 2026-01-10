class LabelTable {
    table = new Map<string, string>();

    add(label: string, where: string) {
        if (this.table.has(label)) {
            const place = this.table.get(label);
            throw new Error(`Label "${label}" already exists: ${place} <-- ${where}(this)`);
        }
        this.table.set(label, where);
    }
}

export const labelTable = new LabelTable();
