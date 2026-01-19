import { VisualIR } from '@shxnovel/world';

// declare module '@shxnovel/rewrite' {
//     interface VisualMap {
//         // _test: 'a' | 'b' | 'c';
//     }
// }

// declare module '@shxnovel/rewrite' {
//     namespace Animate {
//         interface VisualMap {
//             // _test: 'a' | 'b' | 'c';
//         }
//     }
// }

export function solveVisualMap(context: Map<string, VisualIR>): string {
    const formatType = (item: VisualIR): string => {
        const expressionKeys = Object.keys(item.expressions || {});

        if (expressionKeys.length === 0) return `    ${item.name}: never;`;

        const unionType = expressionKeys.map((k) => `'${k}'`).join(' | ');
        return `      '${item.name}': ${unionType};`;
    };

    const sections: string[] = [];

    sections.push(`    interface VisualMap {`);

    context.forEach((item, _name) => {
        sections.push(`${formatType(item)}`);
    });

    sections.push(`    }`);

    return `import '@shxnovel/rewrite';\n\ndeclare module "@shxnovel/rewrite" {\n  namespace Animate {\n\n${sections.join('\n\n')}\n\n  }\n}\n`;
}
