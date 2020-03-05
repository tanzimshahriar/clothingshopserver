const fs = require('fs');
const util = require('util');
const readdir = util.promisify(fs.readdir);
const unlink = util.promisify(fs.unlink);
const directory = './uploads';

module.exports = {
    deleteAllUploads: async(req,res,next) => {
        try {
            const files = await readdir(directory);
            const unlinkPromises = files.map(filename => unlink(`${directory}/${filename}`));
            return Promise.all(unlinkPromises);
          } catch(err) {
            console.log(err);
          }
      }
}