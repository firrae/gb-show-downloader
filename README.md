# gb-show-downloader

## This is BETA, don't expect perfection

Currently there is a settings file. Set your settings there. Currently only supports the Endurance Run, will add more shows as I verify things work and know the limitations of the API.

Requirements:
- Some CLI knowledege
- NodeJS: https://nodejs.org/en/
- Some JSON knowledege

How to run:
- Download the code
- Ensure NodeJS is installed
- Open a CLI (console, bash, etc) and navigate to where you downloaded the code.
- Edit the `settings.json` file as you need it (API key, indicate if you are a paid member, where to put downloads, etc)
- run `npm install`
- run `npm start`

It will try to download the highest quality of the video available (HD > HQ > LQ). YouTube only videos (if there are any) are not supported.

I will be looking to bundle it into an Electron app that is easier to use at some point.
