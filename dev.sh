pm2 start ./ecosystem.dev.config.js

while true; do
  read -p "Enter input (q to quit): " input
  if [ "$input" = "q" ]; then
    break
  fi
done

pm2 delete all
