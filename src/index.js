const got = require("got");
// const PProgress = require('p-progress');
const { createWriteStream, existsSync, mkdirSync } = require("fs");
const stream = require("stream");
const { promisify } = require("util");
const pipeline = promisify(stream.pipeline);

const settings = require("../settings.json");

const fileDownload = async (url, name) => {
    const keyedUrl = `${url}?api_key=${settings.api_key}`;
    const downloadStream = got.stream(keyedUrl);
    const fileWriterStream = createWriteStream(`${settings.download_target}/${name}.${get_url_extension(url)}`);

    // progress(1/10);

    downloadStream
        .on("downloadProgress", ({ transferred, total, percent }) => {
            const percentage = Math.round(percent * 100);
            // console.log(percent);
            // progress(transferred/total);
            console.error(`${name} progress: ${transferred}/${total} (${percentage}%)`);
        })
        .on("error", (error) => {
            console.error(`Download failed: ${error.message}`);
            throw new Error(`Download Failed: ${error.message}`);
        });

    fileWriterStream
        .on("error", (error) => {
            console.error(`Could not write file to system: ${error.message}`);
            throw new Error(`File Writing Failed: ${error.message}`);
        })
        .on("finish", () => {
            console.log(`File downloaded to ${name}`);
            return true;
        });

    await pipeline(downloadStream, fileWriterStream);
};

function get_url_extension(url) {
    return url.split(/[#?]/)[0].split('.').pop().trim();
}

async function downloadLoop(videoLoop) {
    let videoDownloadUrl = "";

    try{
        for(const video of videoLoop) {
            const videoName = video.name;
            if(video.hd_url) {
                console.log('Getting HD version.')
                videoDownloadUrl = video.hd_url;
            } else if(video.high_url) {
                console.log('Getting HQ version.')
                videoDownloadUrl = video.high_url;
            } else if(video.low_url) {
                console.log('Getting LQ version.')
                videoDownloadUrl = video.low_url;
            } else {
                console.log('No downloadable version.');
            }

            await fileDownload(videoDownloadUrl, videoName);
        }
    } catch(err) {
        console.log(err);
    }

    return true;
}

(async () => {
	if (!existsSync(settings.download_target)){
        mkdirSync(settings.download_target);
    }

    if(!settings.api_key) {
        throw new Error('No API Key provided in settings.json');
    }

    let videoFeedUrl, videoFeedUrlRoot;

    switch(settings.show) {
        case 'endurance_run':
        case 'Endurance Run':
            videoFeedUrlRoot = `https://www.giantbomb.com/api/videos/?api_key=${settings.api_key}&format=json&sort=id:as&filter=video_show:2`;
            if(settings.premium !== true) {
                videoFeedUrlRoot = `${videoFeedUrlRoot},premium:false`;
            }
            break;
    }

    if(settings.start_point !== 0) {
        videoFeedUrl = `${videoFeedUrlRoot}&offset=${settings.start_point}`;
    } else {
        videoFeedUrl = videoFeedUrlRoot;
    }

    try {
        let response = await got(videoFeedUrl, {responseType: 'json'});
        let videoLoop = response.body.results;

        while(videoLoop.length < response.body.number_of_total_results) {
            videoFeedUrl = `${videoFeedUrlRoot}&offset=${videoLoop.length}`;
            response = await got(videoFeedUrl, {responseType: 'json'});
            videoLoop = videoLoop.concat(response.body.results);
        }

        console.log(videoLoop.length);

        // let videoDownloadUrl = "";

        // for(const video of videoLoop) {
        //     const videoName = video.name;
        //     if(video.hd_url) {
        //         console.log('Getting HD version.')
        //         videoDownloadUrl = video.hd_url;
        //     } else if(video.high_url) {
        //         console.log('Getting HQ version.')
        //         videoDownloadUrl = video.high_url;
        //     } else if(video.low_url) {
        //         console.log('Getting LQ version.')
        //         videoDownloadUrl = video.low_url;
        //     } else {
        //         console.log('No downloadable version.');
        //     }

        //     await fileDownload(videoDownloadUrl, videoName);
        // }

        await downloadLoop(videoLoop);
    } catch(err) {
        console.log(err);
    }
})();