// import * as fs from 'fs';
import * as path from 'path';
import { createDirectoryLink } from './createDirectoryLink';

export async function useCLI() {
    const from = process.argv[3] ? process.argv[3] : '';
    const to = process.argv[4] ? process.argv[4] : '../../shxnovel/public';

    function solveVN() {
        const fromPath = path.resolve(process.cwd(), from, './.vn');
        const toPath = path.resolve(process.cwd(), to, './game');

        try {
            createDirectoryLink(fromPath, toPath);
            console.log('目录链接创建完成！');
        } catch (error) {
            console.error('错误:', error);
            process.exit(1);
        }
    }

    function solveAssets() {
        const fromPath = path.resolve(process.cwd(), from, './assets');
        const toPath = path.resolve(process.cwd(), to, './assets');

        try {
            createDirectoryLink(fromPath, toPath);
            console.log('资源目录链接创建完成！');
        } catch (error) {
            console.error('错误:', error);
            process.exit(1);
        }
    }

    solveVN();
    solveAssets();
}
