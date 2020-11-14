export $(egrep -v '^#' ./.env | xargs)

shopt -s expand_aliases
alias mongoexport='docker run --rm -it -v "$(pwd)":/mnt/workdir -w /mnt/workdir -u "$(id -u)":"$(id -g)" mongo:4.2.3-bionic mongoexport'

mkdir -p ./backups
isodate_now=$(node -e "console.log(new Date().toISOString())")
out_filepath=backups/graphs-"$isodate_now".json
mongoexport --uri "$MONGODB_BACKUP_URI" -c graphs --type json --out "$out_filepath"
