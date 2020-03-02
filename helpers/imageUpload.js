var multer = require('multer');
module.exports = {
    Uploader: async (req, res, next) => {
        console.log("Uploader Called")
        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'uploads');
            },
            filename: function (req, file, cb) {
                cb(null, file.originalname)
            }
        });

        var upload = multer({
            storage: storage
        }).single('image:0');

        return upload;
    }
}