cd domains/sextoyslovers.com/nodejs
/opt/alt/alt-nodejs22/root/usr/bin/node server.js &
SERVER_PID=$!
sleep 3
curl -s -I http://localhost:3000
kill -9 $SERVER_PID
