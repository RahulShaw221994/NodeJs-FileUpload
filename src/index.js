const express = require('express');
const app = express();
const debug = require('debug')('myapp:server');
const path = require('path');
const multer = require('multer');
const logger = require('morgan');
const serveIndex = require('serve-index')


var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

// file upload
const upload = multer({ storage: storage });

app.use(logger('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use('/ftp', express.static('public'), serveIndex('public', { 'icons': true }));

app.get('/', function (req, res) {
    return res.send("express server!")
})

app.post('/fileUpload', upload.single('file'), function (req, res) {
    debug(req.file);
    console.log('storage location is ', req.hostname + '/' + req.file.path);
    return res.send(req.file);
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    debug('Server is up and running on port ', port);
})