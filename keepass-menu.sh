#!/bin/bash
# Check if keepass file exists
# check if drive is mounted

# 1. List all Titles

# 2. keepassxc-cli locate /media/veracrypt7/Passwortdatenbank.kdbx TERM
#    > PATHS

# 3. keepassxc-cli show /media/veracrypt7/Passwortdatenbank.kdbx PATH

rofiMenu() { rofi -theme "/home/christian/.scripts/keepass-menu/bar-input.rasi" -dmenu -i "$@"; }
copyToClipBoard() {
    echo $1 | xclip -sel clip
}
db="/media/veracrypt7/Passwortdatenbank.kdbx"
CACHE=$HOME/.cache/rofi-keepassxc
mkdir -p "$CACHE"

# Get password
dbpass=$(rofiMenu -p "Enter your database password" -l 0 -password)
[ ! "$dbpass" ] && exit

error_pass='Insert password to unlock'
echo "$dbpass" | keepassxc-cli extract "$db" >"$CACHE/tmp5"
check_pass=$(cat "$CACHE/tmp5")

if [[ $check_pass =~ $error_pass ]]; then
    echo "It's there!"
fi

node ~/.scripts/keepass-menu/index.js -pw $dbpass >"$CACHE/tmp4"
selected=$(less "$CACHE/tmp4" "$CACHE/tmp4" | rofi -theme "/usr/share/rofi/themes/my-theme" -dmenu -i -markup-rows -p "Select: ")
[ ! "$selected" ] && exit
path=$(node ~/.scripts/keepass-menu/locate-paths.js -pw $dbpass -term $selected | sed '/^$/d' | rofi -theme "/usr/share/rofi/themes/my-theme" -dmenu -i -markup-rows -auto-select -p "Select: ")

[ ! "$path" ] && exit

title=$(echo "$dbpass" | keepassxc-cli show $db $path | grep -oP '(?<=Title: ).+')
selected=$(echo "Copy UserName
Copy Password" | rofi -theme "/usr/share/rofi/themes/my-theme" -dmenu -i -markup-rows -p "$title: ")
[ ! "$selected" ] && exit

echo "$dbpass" | keepassxc-cli show $db $path >"$CACHE/tmp7"

case $selected in
"Copy UserName")
    userName=$(echo "$dbpass" | keepassxc-cli show $db $path | grep -oP '(?<=UserName: ).+')
    copyToClipBoard $userName
    ;;
"Copy Password")
    password=$(echo "$dbpass" | keepassxc-cli show $db $path | grep -oP '(?<=Password: ).+')
    echo "$dbpass" | keepassxc-cli clip $db $path 5
    ;;
esac

rm -r "$CACHE"
