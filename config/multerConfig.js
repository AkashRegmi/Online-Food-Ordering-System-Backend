import path from "path";
import fs from "fs";
import multer from "multer";
import { maxSize } from "zod";
import { fileURLToPath } from "url";
import { dirname } from "path";
//her is the reference of the file that is expected to come when uploaded
// {
//   fieldname: 'cv',
//   originalname: 'resume.pdf',
//   encoding: '7bit',
//   mimetype: 'application/pdf',
//   destination: 'uploads/cv',
//   filename: '1722333445-123456.pdf',
//   path: 'uploads/cv/1722333445-123456.pdf',
//   size: 254321
// }
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const createUploader = ({ allowedTypes = [], maxSize = 5 }) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, "..", "uploads", file.fieldname);
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const extName = path.extname(file.originalname);
      cb(null, file.fieldname + "-" + uniqueSuffix + extName);
    },
  });
  //managing the file filter
  const fileFilter = (req, file, cb) => {
    const imageTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    const documentTypes = [
      "application/pdf",

      // .doc
      "application/msword",

      // .docx
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const allowedMimeTypes = [];

    if (allowedTypes.includes("image")) {
      allowedMimeTypes.push(...imageTypes);
      console.log(allowedMimeTypes);
    }
    if (allowedTypes.includes("document")) {
      allowedMimeTypes.push(...documentTypes);
    }
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`${file.fieldname} has invalid file type`), false);
    }
  };
  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSize * 1024 * 1024,
    },
  });
};

//how to use
// const uploadCV = createUploader({
//   allowedTypes: ["document"],
//   maxSize: 2,
// });
// router.post(
//   "/apply-job",
//   uploadCV.single("cv"),
