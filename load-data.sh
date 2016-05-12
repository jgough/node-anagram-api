#! /bin/bash
wget -N -P downloads http://parlvid.mysociety.org/os/ONSPD_FEB_2016_csv.zip
docker-compose run web node /app/src/load_data.js
