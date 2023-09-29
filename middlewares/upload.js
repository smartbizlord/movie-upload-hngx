const multer = require("multer");

const pictureStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads/pictures/')
    },
    filename: function (req, file, cb) {
        const mext = file.mimetype.split('/')
        const ext = `.${mext[1]}`
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + ext)
    }
})

const movieStorage = multer.diskStorage({
  destination: 'public/',
  filename: function (req, file, cb) {
      const mext = file.mimetype.split('/')
      const ext = `.${mext[1]}`
    const uniqueSuffix = Date.now()
    let nFieldname = (((file.originalname).split(ext)[0]).replace(' ', '_')).replace(/\./g, '_')
    cb(null, nFieldname + '_' + uniqueSuffix + ext)
  }
})

// const movieStorage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './public/')
//     },
//     filename: function (req, file, cb) {
//         const mext = file.mimetype.split('/')
//         const ext = `.${mext[1]}`
//       const uniqueSuffix = Date.now()
//       let nFieldname = (((file.originalname).split(ext)[0]).replace(' ', '_')).replace(/\./g, '_')
//       cb(null, nFieldname + '_' + uniqueSuffix + ext)
//     }
// })

// const movieStorage = multer.memoryStorage()




const movieFilter = (req, file, cb) =>    {

  // The function should call `cb` with a boolean
  // to indicate if the file should be accepted

  const allowedMimes = ['video/mp4', 'video/x-m4v', 'video/quicktime'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only MP4, M4V, and QuickTime videos are allowed.'));
  }

}




const thumbNailStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/pictures/')
  },
  filename: function (req, file, cb) {
      const mext = file.mimetype.split('/')
      const ext = `.${mext[1]}`
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + ext)
  }
})







const movieWithThumbNailFilter = (req, file, cb) =>    {

  // The function should call `cb` with a boolean
  // to indicate if the file should be accepted

  switch (file.fieldname) {
    case 'movie':
      const mallowedMimes = ['video/mp4', 'video/x-m4v', 'video/quicktime'];
    if (mallowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only MP4, M4V, and QuickTime videos are allowed.'));
    }
      break;
    case 'thumbNail':
      const tallowedMimes = ['image/bmp', 'image/jpeg', 'image/x-png', 'image/png', 'image/gif'];
      if (tallowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only Bitmap, JPG, PNG, X-PNG, and GIF videos are allowed.'));
      }
      break;
  }

}




const movieWithThumbNailStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    switch (file.fieldname) {
      case 'movie':
        cb(null, './public/uploads/movies/');
        break;
      case 'thumbNail':
        cb(null, './public/uploads/pictures/');
        break;
    }
    // cb(null, './public/uploads/pictures/')
  },
  filename: function (req, file, cb) {
    switch (file.fieldname) {
      case 'movie':
        const mmext = file.mimetype.split('/')
        const moext = `.${mmext[1]}`
        const muniqueSuffix = Date.now()
        let nFieldname = (((file.originalname).split(moext)[0]).replace(' ', '_')).replace(/\./g, '_')
        cb(null, nFieldname + '_' + muniqueSuffix + moext);
        break;
      case 'thumbNail':
        const tmext = file.mimetype.split('/')
        const thext = `.${tmext[1]}`
        const tuniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + tuniqueSuffix + thext);
        break;
    }   
  }
})






const uploadPicture = multer({ storage: pictureStorage })
const uploadMovie = multer({ storage: movieStorage, fileFilter: movieFilter, })
// const uploadMovie = multer({ storage: movieStorage, })
const uploadThumbNail = multer({ storage: thumbNailStorage })
const uploadMovieWithThumbNail = multer({ storage: movieWithThumbNailStorage, fileFilter: movieWithThumbNailFilter })









const fileFilter = (req, file, cb) =>    {

    // The function should call `cb` with a boolean
    // to indicate if the file should be accepted
  
    // To reject this file pass `false`, like so:
    cb(null, false)
  
    // To accept the file pass `true`, like so:
    cb(null, true)
  
    // You can always pass an error if something goes wrong:
    cb(new Error('I don\'t have a clue!'))
  
  }

  module.exports = {
    uploadPicture,
    uploadMovie,
    uploadThumbNail,
    uploadMovieWithThumbNail,
  }