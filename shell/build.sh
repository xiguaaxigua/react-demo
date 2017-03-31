#!/usr/bin/env bash

SILLY_PHONE=/Users/go_songs/Documents/go_workspace/src/silly-phone
PHONE_WEB=/Users/go_songs/Documents/go_workspace/src/phone-web

cd ${PHONE_WEB}
rm -rf static
mkdir static

cd ${SILLY_PHONE}
npm run deploy
cp -rf app/assets/* build/assets
cp -rf build/* ${PHONE_WEB}/static/