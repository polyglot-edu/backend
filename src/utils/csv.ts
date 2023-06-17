import fs from "fs";
import Papa from "papaparse";


export const readCsv = <T>(filePath: string) => {
  console.log("open filesystem");
  const file = fs.readFileSync(filePath, "utf8")
  console.log("finish open filesystem");
  const {data: rows, errors} = Papa.parse<T>(file , {
    skipEmptyLines: true,
    header: true
  })

  if (errors.length > 0) {
    console.error(errors)
  }

  return rows
}

export const readBigCsv = async <T>(filePath: string, onChunk: (data: T[]) => Promise<void>) => {
  return new Promise<void>((resolve,reject) => {
    const fileStream = fs.createReadStream(filePath)

    Papa.parse<T>(fileStream , {
      skipEmptyLines: true,
      header: true,
      complete() {
        resolve()
      },
      error: (error) => reject(error),
      async chunk(results, parser) {
        if (results.errors.length) {
          console.log("error parser")
          //reject(results.errors);
          //return;
        }
        parser.pause()
        fileStream.pause();
        onChunk(results.data);
        fileStream.resume();
        parser.resume();
      },
    })
  });
}

export const removeColumnsCsv = async (columnIndexes: string[], oldFilePath: string, newFilePah: string) => {
  const file = fs.openSync(newFilePah, "w");

  const onChunk = async (res: any[]) => {
    const csvString= Papa.unparse(res.map(r => {
      columnIndexes.forEach((index) => delete r[index]);
      return r;
    }),{header: false, skipEmptyLines: true});
    
    fs.writeSync(file,csvString+"\r\n");
    
  }
  await readBigCsv<any>(oldFilePath, onChunk);

  fs.close(file);
}