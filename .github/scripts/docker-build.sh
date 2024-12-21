#!/bin/bash

set -e

# docker build -t quick-campaigns-ui --platform=linux/amd64 .
docker build --build-arg REACT_APP_BACKEND_API_URL=https://backend.quickcampaigns.io \
             --build-arg REACT_APP_FACEBOOK_ADS_API_URL=https://fbbackend.quickcampaigns.io \
             -t quick-campaigns-ui --platform=linux/amd64 .

docker tag quick-campaigns-ui nas415/quick-campaigns-ui:latest
docker push nas415/quick-campaigns-ui:latest

echo "Built and pushed!!!"
