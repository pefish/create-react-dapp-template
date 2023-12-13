#!/bin/bash

cat package.json | sed "s/app-name/${APP_NAME}/g" > temp && rm -rf package.json && mv temp package.json

npm install