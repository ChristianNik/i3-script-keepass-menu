#!/bin/bash

IS_MOUNTED=$(mount | egrep "veracrypt" | wc -l)

if [ $IS_MOUNTED -gt 0 ]; then
    echo '[-] Already mounted...exiting'
    exit
fi

VOLUME_PATH="/home/christian/MEGAsync/DataVault"
MOUNT_DIRECTORY="/media/veracrypt7"

if sudo veracrypt $VOLUME_PATH $MOUNT_DIRECTORY; then
    echo '[+] Successfully mounted.'
    exit
fi
