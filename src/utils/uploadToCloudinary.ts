import { UploadApiResponse } from "cloudinary";
import cloudinary from "../config/cloudinary";

type RES_TYPE = 'image' | 'raw'; 

const RAW_FILES = [
    'application/pdf',
    'application/msword',
    'application/zip'
]

export const uploadFile = (
    file:Express.Multer.File,
    folder:string,
    resourceType:RES_TYPE,
):Promise<UploadApiResponse> => {
    return new Promise((resolve,reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder, resource_type:resourceType },
            (error, result) => {
                if(error || !result) return reject(error);
                resolve(result);
            }
        );
        stream.end(file.buffer);
    });
}

//if one fail -> All Failed
export const uploadMultipleFiles = (
    files:Express.Multer.File[],
    folder:string,
):Promise<UploadApiResponse[]> => {
    return Promise.all(
        files.map((file) => {
            const resourceType = file.mimetype.startsWith("image/")?'image':'raw';
            return uploadFile(file,folder,resourceType)
        }
    ));
};

// if some file failed to uploads then some are uploaded 
// export const uploadMultipleFiles = async(
//     files:Express.Multer.File[],
//     folder:string,
//     resourceType:RES_TYPE
// ) => {
//     const results = await Promise.allSettled(
//         files.map((file) => uploadFile(file,folder,resourceType))
//     );
//     const success:UploadApiResponse[] = [];
//     const failed:{file:string; error:any}[] = [];

//     results.forEach((r, idx)=>{
//         r.status === 'fulfilled'
//             ? success.push(r.value)
//             : failed.push({ file:files[idx].originalname, error:r.reason });
//     });

//     return { success, failed }
// };