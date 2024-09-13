import express from "express";
import { convertVideo, deleteProcessedVideo, deleteRawVideo, downloadRawVideo, setupDirectories, uploadProcessedVideo } from "./storage";
import { isVideoNew, setVideo } from "./firestore";

setupDirectories();

const app = express();
app.use(express.json());

app.post("/process-video", async (req, res) => {
    // Local code for testing
    /**
*    const inputFilePath = req.body.inputFilePath;
*    const outputFilePath = req.body.outputFilePath;
*
*    if (!inputFilePath) {
*        res.status(400).send("Bad Request: Missing input file path")
*    }
*
*    if (!outputFilePath) {
*        res.status(400).send("Bad Request: Missing output file path")
*    }
*
*    ffmpeg(inputFilePath)
*        .outputOptions("-vf", "scale=-1:360")
*        .on("end", () => {
*            res.status(200).send("Processing finished successfully");
*        })
*        .on("error", (err) => {
*            console.log(`An error has occurred: ${err.message}`);
*            res.status(500).send(`Internal Serer Error: ${err.message}`);
*        })
*        .save(outputFilePath);
*/

    // Pub/Sub code

    let data;
    try {

        const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');
        data = JSON.parse(message);

        if (!data.name) {
            throw new Error('Invalid message payload received');
        }

    } catch (error) {
        console.error(error);
        return res.status(400).send('Bad Request: missing filename.');
    }

    const inputFileName = data.name; // Format of <UID>-<DATE>.<EXTENSION>
    const outputFileName = `processed-${inputFileName}`;

    const videoId = inputFileName.split(".")[0];

    if (!isVideoNew(videoId)) {
        return res.status(400).send("Bad request: video already processing or processed");
    } else {
        await setVideo(videoId, {
            id: videoId,
            uid: videoId.split('-')[0],
            status: "processing",
        })
    }


    // Download the raw video from Cloud Strorage

    await downloadRawVideo(inputFileName);

    // Process the video

    try {
        await convertVideo(inputFileName, outputFileName);
    } catch (err) {

        await Promise.all([
            deleteRawVideo(inputFileName),
            deleteProcessedVideo(outputFileName)
        ]);

        console.error(err);
        return res.status(500).send('Internal Server Error: video processing failed.');
    }

    // Upload the processed video to Cloud Storage

    await uploadProcessedVideo(outputFileName)

    await setVideo(videoId, {
        status: "processed",
        filename: outputFileName,
    })

    await Promise.all([
        deleteRawVideo(inputFileName),
        deleteProcessedVideo(outputFileName)
    ]);

    return res.status(200).send("Processing completed successfully")

});



const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(
        `Video Processing service listening at http://localhost:${port}`);
});
