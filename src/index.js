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
            throw new Error(error.message);
        });

    fileWriterStream
        .on("error", (error) => {
            console.error(`Could not write file to system: ${error.message}`);
            throw new Error(error.message);
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

    let showId;

    switch(settings.show) {
        case 'endurance_run':
        case 'Endurance Run':
        case 'EnduranceRun':
            showId = 2;
            break;
        case 'mario_party_party':
        case 'Mario Party Party':
        case 'MarioPartyParty':
            showId = 6;
            break;
        case 'demo_derby':
        case 'Demo Derby':
        case 'DemoDerby':
            showId = 12;
            break;
        case 'ranking_of_fighters':
        case 'Ranking of Fighters':
        case 'RankingOfFighters':
            showId = 13;
            break;
        case 'beast_in_the_east':
        case 'Beast in the East':
        case 'BeastInTheEast':
            showId = 14;
            break;
        case `this_aint_no_game`:
        case `This Ain't No Game`:
        case 'ThisAintNoGame':
            showId = 15;
            break;
        case `project_beast`:
        case `Kerbal: Project B.E.A.S.T`:
        case `Project Beast`:
        case 'ProjectBeast':
            showId = 15;
            break;
        case `this_is_the_run`:
        case `This Is the Run`:
        case 'ThisIsTheRun':
            showId = 17;
            break;
        case `vinnyvania`:
        case `VinnyVania`:
            showId = 19;
            break;
        case `game_tapes`:
        case `Game Tapes`:
        case 'GameTapes':
            showId = 20;
            break;
        case `steal_my_sunshine`:
        case `Steal My Sunshine`:
        case 'StealMySunshine':
            showId = 25;
            break;
        case `the_exquisite_corps`:
        case `The Exquisite Corps`:
        case 'TheExquisiteCorps':
            showId = 26;
            break;
        case `kingdom_heartache`:
        case `Kingdom Heartache`:
        case 'KingdomHeartache':
            showId = 27;
            break;
        case `metal_gear_scanlon`:
        case `Metal Gear Scanlon`:
        case 'MetalGearScanlon':
            showId = 29;
            break;
        case `game_of_the_year`:
        case `Game of the Year`:
        case 'GameOfTheYear':
            showId = 33;
            break;
        case `thirteen_deadly_sims`:
        case `Thirteen Deadly Sims`:
        case 'ThirteenDeadlySims':
            showId = 35;
            break;
        case `whos_the_big_boss`:
        case `Who's The Big Boss`:
        case 'WhosTheBigBoss':
            showId = 36;
            break;
        case `mass_alex`:
        case `Mass Alex`:
        case 'MassAlex':
            showId = 39;
            break;
        case `e3_vs_gb`:
        case `E3 vs. GB`:
        case 'E3vsGB':
            showId = 40;
            break;
        case `all_systems_goku`:
        case `All Systems Goku`:
        case 'AllSystemsGoku':
            showId = 48;
            break;
        case `extra_life`:
        case `Extra Life`:
        case 'ExtraLife':
            showId = 52;
            break;
        case `bombin_the_am_with_scoops_the_wolf`:
        case `Bombin' the A.M. With Scoops & the Wolf!`:
        case 'BombinTheAMWithScoopsTheWolf':
            showId = 56;
            break;
        case `i_love_mondays`:
        case `I Love Mondays`:
        case 'ILoveMondays':
            showId = 58;
            break;
        case `breaking_brad`:
        case `Breaking Brad`:
        case 'BreakingBrad':
            showId = 62;
            break;
        case `the_binding_of_patrick`:
        case `The Binding of Patrick`:
        case 'TheBindingOfPatrick':
            showId = 66;
            break;
        case `jeff_gerstmanns_pro_skater`:
        case `Jeff Gerstmann's Pro Skater`:
        case 'JeffGerstmannsProSkater':
            showId = 68;
            break;
        case `we_talk_over`:
        case `We Talk Over`:
        case 'WeTalkOver':
            showId = 71;
            break;
        case `pax`:
        case `PAX`:
            showId = 73;
            break;
        case `vlogs_and_travelogues`:
        case `Vlogs and Travelogues`:
        case 'VlogsAndTravelogues':
            showId = 77;
            break;
        case `burgle_my_bananas`:
        case `Burgle My Bananas`:
        case 'BurgleMyBananas':
            showId = 82;
            break;
        case `clue_crew`:
        case `Clue Crew`:
        case 'ClueCrew':
            showId = 83;
            break;
        case `giant_bomb_makes_mario`:
        case `Giant Bomb Makes Mario`:
        case 'GiantBombMakesMario':
            showId = 88;
            break;
        case `lets_minecraft_together`:
        case `Let's Minecraft Together!`:
        case 'LetsMinecraftTogether':
            showId = 90;
            break;
        case `astroneering_with_brad_and_vinny`:
        case `Astroneering with Brad and Vinny`:
        case 'AstroneeringWithBradAndVinny':
            showId = 94;
            break;
        default:
            console.log('No show selected!');
            return;
    }

    let videoFeedUrlRoot = `https://www.giantbomb.com/api/videos/?api_key=${settings.api_key}&format=json&sort=id:as&filter=video_show:${showId}`;
    let videoFeedUrl;

    if(settings.premium !== true) {
        videoFeedUrlRoot = `${videoFeedUrlRoot},premium:false`;
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
