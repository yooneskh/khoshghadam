bun run build

rsync -avz -e ssh ./mise.toml $zxc:/apps/khoshghadam/
rsync -avz --delete -e ssh ./.output/ $zxc:/apps/khoshghadam/.output/

ssh $zxc <<'EOF'

  set -e

  cd /apps/khoshghadam/
  mise install

  systemctl restart khoshghadam
  systemctl is-active khoshghadam

EOF
