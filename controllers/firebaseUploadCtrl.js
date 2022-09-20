import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import config from './../config/firebaseConfig.js'

export const filesUploadCtrl = async (req, res, next) => {
    try {
        const app = initializeApp(config.firebaseConfig);
        const storage = getStorage();

        const fileExtension = req.files.filename.name.slice((req.files.filename.name.lastIndexOf(".")));
        const uploadPath = `videos/${req.body.username}/${req.body.videoTitle}_${Date.now()+fileExtension}`;

        const mountainsRef = ref(storage, uploadPath);

        const firebaseUploadResponds = await uploadBytes(mountainsRef, req.files.filename.data, {
            md5Hash: req.files.filename.md5,
            contentEncoding: req.files.filename.encoding,
            contentType: req.files.filename.mimetype,
            customMetadata: {
                name: req.files.filename.name,
                size: req.files.filename.size,
                encoding: req.files.filename.encoding,
                truncated: req.files.filename.truncated,
                mimetype: req.files.filename.mimetype,
                md5: req.files.filename.md5,
            }
        });

        const gcRefPath = firebaseUploadResponds.ref.toString();

        if (gcRefPath) {
            const fileUrlPath = await getDownloadURL(mountainsRef);
            
            if (fileUrlPath) {
                return res.status(200).json({
                    statusCode: 200,
                    fileUrlPath,
                    gcRefPath,
                    request: req.body
                });
            };
        };

        return res.status(502).json({
            statusCode: 502,
            msg: "Ooops an error occured"
        });
        
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}
