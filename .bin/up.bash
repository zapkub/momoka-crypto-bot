export $(cat .env | grep -v ^# | xargs)
ssh -t $DEPLOY_TARGET 'cd /root/metano&&pm2 delete metano&&pm2 start --name metano npm --run dev'