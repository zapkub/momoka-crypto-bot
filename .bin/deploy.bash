export $(cat .env | grep -v ^# | xargs)
echo 'Deploy Metano to '$DEPLOY_TARGET
rm -rf ./dist
mkdir -p dist
tar --exclude='.git' --exclude='.env' --exclude='./dist/artifact.tar' --exclude='./.db' --exclude='./node_modules' --exclude='./.vscode' -czf ./dist/artifact.tar ./
rsync -avz ./dist/artifact.tar $DEPLOY_TARGET:/root/metano-release.tar
ssh -t $DEPLOY_TARGET 'cd /root && mkdir -p metano && tar -xvf metano-release.tar -C /root/metano && cd metano && npm install'
