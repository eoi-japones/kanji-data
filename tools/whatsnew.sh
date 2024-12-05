DIR=${1-.}
OUT=${2-output.txt}

cd $DIR && git ls-tree -r --name-only HEAD -z | TZ=UTC xargs -0n1 -I_ git --no-pager log -1 --date=iso-local --format="%ad _" -- _ | sort > $OUT
