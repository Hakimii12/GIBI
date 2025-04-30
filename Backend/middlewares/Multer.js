/* Updating or adding code to this section is not permitted for any stakeholders
   but if it happen or it have to happen please report the about the change to me &
    make sure to add the comment to which part 
you have add or make a change on the top of this comment!!!!!!!!
*/
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