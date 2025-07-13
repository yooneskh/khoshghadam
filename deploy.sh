ssh $zxc mkdir -p /home/yooneskh/khoshghadam && \
  cd ./frontend/ && bun run build && rsync -rvzh --delete ./.output/* $zxc:/home/yooneskh/khoshghadam/frontend/ && cd ../ && \
  scp ./ecosystem.prod.config.js $zxc:/home/yooneskh/khoshghadam/ && \
  ssh $zxc "cd /home/yooneskh/khoshghadam && pm2 restart /home/yooneskh/khoshghadam/ecosystem.prod.config.js --update-env"
