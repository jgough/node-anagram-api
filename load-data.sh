#! /bin/bash
wget -N -P downloads http://parlvid.mysociety.org/os/ONSPD_FEB_2016_csv.zip
docker-compose run web node /src/app/bin/www/load_data.js
