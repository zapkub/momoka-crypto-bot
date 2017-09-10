export $(cat .env | grep -v ^# | xargs)
ssh -t $DEPLOY_TARGET 'cd /root/momoka&&pm2 delete momoka&&pm2 start --name momoka npm --run dev'