bun run build

rsync -avz -e ssh ./mise.toml $zxc:/root/khoshghadam/
rsync -avz --delete -e ssh ./.output/ $zxc:/root/khoshghadam/.output/

ssh $zxc <<'EOF'

  set -e

  cd /root/khoshghadam/
  mise install

  systemctl restart khoshghadam
  systemctl is-active khoshghadam

EOF
