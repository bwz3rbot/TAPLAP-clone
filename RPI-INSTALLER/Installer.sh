#!/bin/bash
mkdir ../database &
process_id=$!
mkdir ../backups &
wait $process_id
echo Job 1 exited with status $?
wait $!
echo Job 2 exited with status $?
#mkdir ../database && mkdir ../backups/ && npm i && node ../src/install/WikiPagesInstaller.js