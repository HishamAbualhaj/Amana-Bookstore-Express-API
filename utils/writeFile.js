import fetchData from "./fetchData.js";
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
const _fileName = fileURLToPath(import.meta.url);
const _pathName = path.dirname(_fileName);
function writeFile(newData, url, fileName) {
  const data = fetchData(url, fileName);
  const filePath = path.join(_pathName, url);
  const books = [...data, newData];

  writeFileSync(filePath, JSON.stringify({ books }));
}
export default writeFile;
