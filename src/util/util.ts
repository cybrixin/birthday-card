type bucketType = string | string[];

type getUrlType = string | {
    error: boolean,
    code: string | number,
    message: string
};

type getUrlPropsType = {
    storage: any, 
    bucket: bucketType, 
    callback?: Function
}


export async function getUrl({ storage, bucket, callback } : getUrlPropsType) : Promise<getUrlType> {
    
    if( storage === null ) {
        throw new Error("The storage reference for GCP cannot be null");
    }
    
    if(typeof bucket === 'string'){
        if(bucket.trim().length === 0) {
            throw new Error("Sorry the bucket to point cannot be empty on GCP");
        }else {
            bucket = bucket.trim();
        }
        bucket = [bucket];
    }

    bucket = bucket.join('/');

    const { ref, getDownloadURL } = await import("firebase/storage");
    const storageRef = ref(storage, bucket);
    
    let url: string | null = null;

    try {

        url = await getDownloadURL(storageRef);
        return url;
    }catch (error: any) {

        const err : getUrlType = {
            error: true,
            code: error?.code,
            message: ''
        };

        switch(error?.code) {
            case 'storage/unknown': 
                err.message = "An unknown error occurred."; 
                break;
            case 'storage/object-not-found': 
                err.message = "No object exists at the desired reference."; 
                break;
            case 'storage/bucket-not-found': 
                err.message = "No bucket is configured for Cloud Storage"; 
                break;
            case 'storage/project-not-found': 
                err.message = "No project is configured for Cloud Storage."; 
                break;
            case 'storage/quota-exceeded': 
                err.message = "Quota on your Cloud Storage bucket has been exceeded. If you're on the no-cost tier, upgrade to a paid plan. If you're on a paid plan, reach out to Firebase support."; 
                break;
            case 'storage/unauthenticated': 
                err.message = "User is unauthenticated, please authenticate and try again."; 
                break;
            case 'storage/unauthorized': 
                err.message = "User is not authorized to perform the desired action, check your security rules to ensure they are correct."; 
                break;
            case 'storage/retry-limit-exceeded': 
                err.message = 'The maximum time limit on an operation (upload, download, delete, etc.) has been excceded. Try uploading again.'; 
                break;
            case 'storage/invalid-checksum': 
                err.message = 'TFile on the client does not match the checksum of the file received by the server. Try uploading again.'; 
                break;
            case 'storage/invalid-event-name': 
                err.message = 'nvalid event name provided. Must be one of [`running`, `progress`, `pause`]'; 
                break;
            case 'storage/invalid-url': 
                err.message = 'Invalid URL provided to refFromURL(). Must be of the form: gs://bucket/object or https://firebasestorage.googleapis.com/v0/b/bucket/o/object?token=<TOKEN>'; 
                break;
            case 'storage/invalid-argument': 
                err.message = 'The argument passed to put() must be `File`, `Blob`, or `UInt8` Array. The argument passed to putString() must be a raw, `Base64`, or `Base64URL` string.'; 
                break;
            case 'storage/no-default-bucket': 
                err.message = 'No bucket has been set in your config\'s storageBucket property.'; 
                break;
            case 'storage/cannot-slice-blob': 
                err.message = 'Commonly occurs when the local file has changed (deleted, saved again, etc.). Try uploading again after verifying that the file hasn\'t changed.'; 
                break;
            case 'storage/server-file-wrong-size': 
                err.message = 'File on the client does not match the size of the file recieved by the server. Try uploading again.'; 
                break;
            default: 
                err.code = 'error/unknown-error'; err.message = '☹ Unknown reason'; 
                break;
        }

        return err;
    }finally {
        
        if(url !== null && callback != null) {
            callback(url);
        }
    }
}