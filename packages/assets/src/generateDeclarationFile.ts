import { AssetList } from '.';

export function generateDeclarationFile(assetList: AssetList): string {
    const formatType = (files: string[]): string => {
        if (files.length === 0) return '    type Key = never;';
        return `    type Key =\n${files.map((f) => `      | '${f}'`).join('\n')};`;
        // return `    type Key =\n${files.map((f) => `      | '${f.replace(/\.[^.]+$/, '')}'`).join('\n')};`;
    };

    const sections: string[] = [];

    if (assetList.texture.length > 0) {
        sections.push(`  namespace Texture {\n${formatType(assetList.texture)}\n  }`);
    } else {
        sections.push(`  namespace Texture {\n    type Key = never;\n  }`);
    }

    if (assetList.audio.length > 0) {
        sections.push(`  namespace Audio {\n${formatType(assetList.audio)}\n  }`);
    } else {
        sections.push(`  namespace Audio {\n    type Key = never;\n  }`);
    }

    return `export declare namespace Assets {\n${sections.join('\n\n')}\n}\n`;
}
