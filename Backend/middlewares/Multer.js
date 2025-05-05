import multer from "multer";
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.fieldname+"_"+Date.now()+"_"+file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 
    'image/png', 
    'application/pdf', 
    'video/mp4',

    'application/vnd.ms-powerpoint', // .ppt
    'application/vnd.openxmlformats-officedocument.presentationml.presentation' // .pptx
  ];
  
  allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(new Error('Invalid file type'));
};
const Upload = multer({ storage: storage, fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 500 }
});
export default Upload;