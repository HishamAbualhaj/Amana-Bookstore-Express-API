import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
const _fileName = fileURLToPath(import.meta.url);
const _pathName = path.dirname(_fileName);

function fetchData(url, key) {
  const filePath = path.join(_pathName, url);
  const file = readFileSync(filePath, "utf-8");
  const arr = JSON.parse(file)[key];

  return arr;
}

export default fetchData;
