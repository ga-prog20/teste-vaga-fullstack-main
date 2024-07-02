import fs from "fs";

function deleteFileIfExists(path: any) {
  fs.access(path, fs.constants.F_OK, (err) => {
    if (!err) {
      // file exists, delete it
      fs.unlink(path, (err) => {
        if (err) throw err;
        // console.log(`Tmp file ${path} was deleted.`);
      });
    }
  });
}

export default deleteFileIfExists;
