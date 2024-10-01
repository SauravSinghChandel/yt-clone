/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
/* eslint-disable */
import * as logger from "firebase-functions/logger";
import * as functions from "firebase-functions/v2";
import { initializeApp } from "firebase-admin/app";
//import { Firestore } from "firebase-admin/firestore";
//import { Storage } from "@google-cloud/storage";
import { onCall } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { beforeUserCreated } from "firebase-functions/v2/identity";

initializeApp();

const firestore = getFirestore();

const storage = getStorage();

const rawVideoBucketName = "jb527-yt-raw-videos";

const videoCollectionId = "videos";

export interface Video {
    id?: string,
    uid?: string,
    filename?: string,
    status?: "processing" | "processed",
    title?: string,
    description?: string,
}

export const createUser = beforeUserCreated(async (event) => {
    const user = event.data;
    const userInfo = {
        uid: user.uid,
        email: user.email,
        photoUrl: user.photoURL,
    };
    
    console.log(event)
    console.log(userInfo)

    try {
        
        await firestore.collection("users").doc(user.uid).set(userInfo)
        logger.info("User created successfully");
        logger.info(`User Created: ${JSON.stringify(userInfo)}`);

    } catch (err) {
        logger.error(`Error creating user: ${err}`);
        throw new Error("Failed to create user document")
    };
});



export const generateUploadUrl = onCall({maxInstances: 1}, async (request) => {
    // Check if the user is authenticated

    if (!request.auth) {
        throw new functions.https.HttpsError(
            "failed-precondition",
            "The function must be called while authenticated."
        );
    }

    const auth = request.auth;
    const data = request.data;
    const bucket = storage.bucket(rawVideoBucketName);

    // Generate a unique filename

    const fileName = `${auth.uid}-${Date.now()}.${data.fileExtension}`;

    // Get a v4 signed URL for uploading file

    const [url] = await bucket.file(fileName).getSignedUrl({
        version: "v4",
        action: "write",
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    });

    return { url, fileName };
});

export const getVideos = onCall({maxInstances: 1}, async () => {
    const querySnapshot = await firestore.collection(videoCollectionId).limit(10).get();

    return querySnapshot.docs.map((doc) => doc.data());

})
