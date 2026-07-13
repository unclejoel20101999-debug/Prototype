import path from "path";
import del from "del";
import fs from 'fs-extra';

function removeEmptyDirs(dir, exceptions = []) {
	if (!fs.existsSync(dir)) return;

	const files = fs.readdirSync(dir);
	if (files.length === 0) {
		const shouldSkip = exceptions.some(ex => path.resolve(ex) === path.resolve(dir));
		if (!shouldSkip) {
			fs.rmdirSync(dir);
		}
	}
}

export default async function cleanFiles(deletedFile, extension, reload) {
	const parsed = path.parse(deletedFile);
	const baseName = parsed.name;

	const patterns = [];
	extension.map(extension => patterns.push(`${parsed.dir.replace("app", "dist")}/${baseName}.${extension}`));

	await del(patterns);
	
	const dirToCheck = parsed.dir.replace("app", "dist");
	removeEmptyDirs(dirToCheck, ['dist/img', 'dist/css', 'dist/js']);

	reload && reload();
}