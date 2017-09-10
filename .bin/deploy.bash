export $(cat .env | grep -v ^# | xargs)
echo 'Deploy Momoka to '$DEPLOY_TARGET
yarn jest
rm -rf ./dist
mkdir -p dist
tar --exclude='.git' --exclude='.env' --exclude='./dist/artifact.tar' --exclude='./node_modules' --exclude='./.vscode' -czf ./dist/artifact.tar ./
rsync -avz ./dist/artifact.tar $DEPLOY_TARGET:/root/momoka-release.tar
ssh -t $DEPLOY_TARGET 'cd /root && mkdir -p momoka && tar -xvf momoka-release.tar -C /root/momoka && cd momoka && yarn install'
