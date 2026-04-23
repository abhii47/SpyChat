import multer from "multer";
import AppError from "../utils/appError";

const ALLOWED_MIMETYPE = [
    'image/jpg',
    'image/png',
    'image/jpeg',
    'image/gif',
    "image/webp",
    'application/pdf',
    'application/msword',
    'application/zip'
]

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {fileSize: 10 * 1024 * 1024}, //10MB;
    fileFilter:(req,file,cb) => {
        if(ALLOWED_MIMETYPE.includes(file.mimetype)){
            cb(null,true);
        }else{
            cb(new AppError(`File type ${file.mimetype} is not allowed`, 400));
        }
    }
});

export const uploadSingle = (fieldName:string) => upload.single(fieldName);
export const uploadMultiple = (fieldName:string) => upload.array(fieldName,10);