#!/bin/bash

echo "start to find owner of lost sales and unsuccessful lead......"
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

mongo lead-management --quiet "$DIR/count.js" > count.json || { echo "count failed"; exit 1;}
echo "count success!"

mongo lead-management --quiet "$DIR/lost_sales_or_unsuccessful_lead_id.js" > lost_sales_or_unsuccessful_lead_id.json || { echo "write lost_sales_or_unsuccessful_lead_id.json failed!"; exit 1;}
echo "write lost_sales_or_unsuccessful_lead_id.json success!"

mongo lead-management --quiet "$DIR/lost_sales_or_unsuccessful_customer_id_and_gems_user_id.js" > lost_sales_or_unsuccessful_customer_id_and_gems_user_id.json || { echo "write lost_sales_or_unsuccessful_customer_id_and_gems_user_id.json failed!"; exit 1;}
echo "write lost_sales_or_unsuccessful_customer_id_and_gems_user_id.json success!"

mongo lead-management --quiet "$DIR/lost_sales_or_unsuccessful_gems_user_id.js" > lost_sales_or_unsuccessful_gems_user_id.json || { echo "write lost_sales_or_unsuccessful_gems_user_id.json failed!"; exit 1;}
echo "write lost_with_gems_user_id.json success!"

echo "wait for remove owner......"
