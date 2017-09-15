create table otr_customer.temp_undone_customer_task (customer_id varchar(30), gems_user_id varchar(8));

# values to insert come from `lost_sales_or_unsuccessful_customer_id_and_gems_user_id.json`
insert into temp_undone_customer_task values
('593f97f0d6043912ff4b1bb5','D8JILIA2'),('59409192d6043912ff4b1bb6','D8JILIA2'),('58fb1bf81c1870000e509bb7','D8DANDYA'),('59715dd2f8720e12bb216d1b','D8JILIA2'),('597161eef8720e12bb216d1c','D8JILIA2'),('5979b626002b8b1d1c72e563','D8JILIA2'),('5983e78b68afc42023b7515d','D8JILIA2'),('59b73d42096349555c42544f','D8JILIA2')

create table otr_customer.gems_user_id (user_id int(11), gems_user_id varchar(8));

#values to insert come from `lost_sales_or_unsuccessful_user_id.sql`
INSERT INTO otr_customer.gems_user_id VALUES (32, 'D8JILIA2'),(1297, 'D8DANDYA');
	
select customer_id, user_id from otr_customer.temp_undone_customer_task temp_customer left join otr_customer.gems_user_id tem_user on tem_user.gems_user_id = temp_customer.gems_user_id;

create table undone_task_id as (select id from customer_task join (select customer_id, user_id from otr_customer.temp_undone_customer_task temp_customer left join otr_customer.gems_user_id tem_user on tem_user.gems_user_id = temp_customer.gems_user_id) temp_task on customer_task.user_id = temp_task.user_id and customer_task.customer_id = temp_task.customer_id where customer_task.task_type = 'Customer follow up');

update customer_task, undone_task_id set done_time = (NOW() + INTERVAL 8 hour), status = 'DONE', comments = '线索失销，任务自动完成' where customer_task.id in (select id from undone_task_id);

drop table temp_undone_customer_task;
drop table gems_user_id;
drop table undone_task_id;
