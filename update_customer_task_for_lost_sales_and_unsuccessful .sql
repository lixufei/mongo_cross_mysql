#in otr_account database, where condition is from `lost_sales_or_unsuccessful_lead_id.json`, update done_time as now and status as 'DONE' and comments as '线索失销，任务自动完成'
-- update otr_account.todo_task set done_time = (NOW() + INTERVAL 8 hour), status = 'DONE', comments = '线索失销，任务自动完成' where related_lead_id in (
-- 	"La6eeaec1-7df4-4713-809c-799e4b1c5992",
-- 	"L5f35aa7d-aca1-4551-94f4-9606c440cc50",
-- 	"Lf82ed977-58a5-45a3-b27a-19e9901a6caf",
-- 	"L2669acfc-7833-436f-974f-9942dd511f52",
-- 	"L1e5bb4f8-986b-46f9-93a6-743a56bce84e",
-- 	"L4db8bc6b-1100-466e-99a8-a7221183239c",
-- 	"La41073b1-0272-4594-826a-189892555017",
-- 	"L33b9375a-5835-483b-9372-11332020800c",
-- 	"L15945602-0d20-481e-ad17-0622a0cd17bd",
-- 	"L31b37c1a-5d80-4f53-850d-8f8f4a72c254",
-- 	"L4be111df-931c-4e0b-b0eb-9a6a6e252fd8",
-- 	"L02d7d47a-6915-47c1-baac-ca319aed4000",
-- 	"L6af32de8-8766-4c43-84d7-ef936c6f712b",
-- 	"Ldceff85f-890b-4622-bc83-378c16bb17e5",
-- 	"L4c8053a4-7754-460e-8060-0954fc0d9aeb",
-- 	"La64d45ef-63f4-4f79-abb4-eca61e5b757f",
-- 	"Lc19b281e-dfdb-4e8b-a48c-0b819697d7cc",
-- 	"L93988d9f-5e90-4809-ae5a-9769df726f3a",
-- 	"L4d2f5fb9-a288-45ef-ad18-113fbd5dd6e7",
-- 	"L97aff66a-46df-4e06-8154-f96080a64fdf",
-- 	"La5f51fe8-5607-4341-9fe0-15a701f3448e",
-- 	"Lc0686056-0e9b-41b2-95a3-bc489c954766",
-- 	"L921964c5-ef9e-42fe-8ede-d54615bb5adc"
-- );

create table otr_customer.temp_undone_customer_task (customer_id varchar(30), gems_user_id varchar(8));

# values to insert come from `lost_sales_or_unsuccessful_customer_id_and_gems_user_id.json`
insert into temp_undone_customer_task values
('593f97f0d6043912ff4b1bb5','D8JILIA2'),('59409192d6043912ff4b1bb6','D8JILIA2'),('58fb1bf81c1870000e509bb7','D8DANDYA'),('59715dd2f8720e12bb216d1b','D8JILIA2'),('597161eef8720e12bb216d1c','D8JILIA2'),('5979b626002b8b1d1c72e563','D8JILIA2'),('5983e78b68afc42023b7515d','D8JILIA2'),('59b73d42096349555c42544f','D8JILIA2');

create table otr_customer.undone_task_id as (select id from customer_task join (select customer_id, id user_id from otr_customer.temp_undone_customer_task temp_customer left join (select id, gems_user_id from otr_account.user where gems_user_id in ("D8JILIA2")) tem_user on tem_user.gems_user_id = temp_customer.gems_user_id) undone_task on customer_task.customer_id = undone_task.customer_id and customer_task.user_id = undone_task.user_id);

update customer_task, undone_task_id set done_time = (NOW() + INTERVAL 8 hour), status = 'DONE', comments = '线索失销，任务自动完成' where customer_task.id in (select id from undone_task_id);

drop table otr_customer.temp_undone_customer_task;
drop table otr_customer.undone_task_id;