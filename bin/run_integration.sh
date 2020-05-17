#!/bin/bash
#
# This script is used to run the acceptance tests against the serverless local stack
echo "Starting Serverless Application"

rm -rf out.log
rm -rf buckets
yarn serve >> out.log &

# Wait for service to start; this is an invalid request which should always return 400 when service is running
RETRY=40
INCREMENT=0
while [ -z $(grep "Serverless: Offline listening on http://localhost:3000" out.log) ];
do 
    # Add timeout to exit after N seconds/iterations
    printf '.'
    ((INCREMENT++))
    sleep 1
    if [ $INCREMENT -ge $RETRY ]; then echo "RETRY EXCEEDED" && exit 1; fi;
done

echo "Serverless Application running. Sarting acceptance tests."

# Upload the can data to the local bucket and delete the content.
yarn delete-canned

# Execute Acceptance Tests
ENV=dev S3_HOST=0.0.0.0 S3_PORT=8001 yarn cucumber

# Capture the PID of the serverless process
read pid <<< $(ps | grep ".bin/sls offline" | grep -v grep | awk '{print $1}')

# Kill the serverless process
echo "Tearing down Serverless Application [" $pid "]"
kill $pid
exit 0
