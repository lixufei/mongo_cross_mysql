#!/bin/bash

echo "start to find owner of lost sales and unsuccessful lead......"
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

mongo lead-management --quiet "$DIR/count.js" > count.json || { echo "count failed"; exit 1;}
echo "count success!"

mongo lead-management --quiet "$DIR/generate_update_task_for_lost_and_successful.js" > generate_update_task_for_lost_and_successful.sql || { echo "write generate_update_task_for_lost_and_successful.sql failed!"; exit 1;}
echo "write generate_update_task_for_lost_and_successful.sql success!"

mongo lead-management --quiet "$DIR/generate_customer_task_for_lost_and_successful.js" > generate_customer_task_for_lost_and_successful.sql || { echo "write generate_customer_task_for_lost_and_successful.sql failed!"; exit 1;}
echo "write generate_customer_task_for_lost_and_successful.sql success!"

echo "wait for remove owner......"
