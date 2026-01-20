import { VisualIR } from '@shxnovel/world';
import JsonToTs from 'json-to-ts';

// declare module '@shxnovel/rewrite' {
//     namespace Animate {
//         interface VisualMap {
//             // _test: 'a' | 'b' | 'c';
//         }
//     }

//     namespace GameData {
//         interface InGame {}

//         interface Global {}
//     }
// }

export function solveDeclare(
    context: Map<string, VisualIR>,
    inGame: Record<string, any>,
    global: Record<string, any>
): string {
    const ArtSections = solveA(context);

    const gameDataSections = solveG(inGame, global);

    return (
        `import '@shxnovel/rewrite';\n\n` +
        `declare module "@shxnovel/rewrite" {\n\n` +
        `  namespace Animate {\n` +
        `    interface VisualMap {\n` +
        `${ArtSections.join('\n')}\n` +
        `    }\n` +
        `  }\n\n` +
        `  namespace GameData {\n` +
        `${gameDataSections.join('\n\n')}\n` +
        `  }\n` +
        `}\n`
    );
}

function solveA(context: Map<string, VisualIR>) {
    const formatType = (item: VisualIR): string => {
        const expressionKeys = Object.keys(item.expressions || {});

        if (expressionKeys.length === 0) return `    ${item.name}: never;`;

        const unionType = expressionKeys.map((k) => `'${k}'`).join(' | ');
        return `      '${item.name}': ${unionType};`;
    };

    const sections: string[] = [];

    context.forEach((item, _name) => {
        sections.push(`${formatType(item)}`);
    });

    return sections;
}

function solveG(inGame: Record<string, any>, global: Record<string, any>) {
    const sections: string[] = [];

    const inGameDefinitions = JsonToTs(inGame, { rootName: `InGame` });
    const globalDefinitions = JsonToTs(global, { rootName: `Global` });

    sections.push(...inGameDefinitions);
    sections.push(...globalDefinitions);

    sections.forEach((line, index) => {
        if (line.trim() !== '') {
            sections[index] = '    ' + line.replace(/\n/g, '\n    ');
        }
    });

    return sections;
}
