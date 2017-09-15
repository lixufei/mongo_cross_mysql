#!/bin/bash

echo "start to find owner of lost sales and unsuccessful lead......"
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

mongo lead-management --quiet "$DIR/test_mongo.js" > test.json || { echo "test mongo failed"; exit 1;}
echo "test mongo success!"

echo "wait for remove owner......"
