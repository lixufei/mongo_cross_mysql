var SPLIT_UNIT = 2;
var customerIdsWithGemsUserIds = [];

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

db.person.find({$or: [{"leads.status": "LOST_SALES"}, {"leads.status": "UNSUCCESSFUL"}]}).forEach(function(person) {
	var leadStatusList = person.leads.map(function(lead) {return lead.status;});
	var uniqueLeadStatusList = leadStatusList.filter(onlyUnique);
	var lostOrUnsuccessfulStatusList = uniqueLeadStatusList.filter(function(status) {
		return status === 'LOST_SALES' || status === 'UNSUCCESSFUL';
	});
	if (uniqueLeadStatusList.length === lostOrUnsuccessfulStatusList.length) {
		person.leads.forEach(function(lead) {
			if (lead.ownerSalesConsultantId !== undefined) {
				customerIdsWithGemsUserIds.push({'customer_id':person._id.valueOf(), 'gems_user_id': lead.ownerSalesConsultantId});
			}
		})
	}
})

function getUnitInsertSql(customerIdsGemsUserIds) {
	return 'insert into otr_customer.temp_undone_customer_task values \n' + customerIdsGemsUserIds;
}

function getBatchInsertSql(customerIdsWithGemsUserIds) {
	var batchInsertSql = '';
	var leftLeadIdsWithBrace = '';
	var splittedGroups = Math.floor(customerIdsWithGemsUserIds.length / SPLIT_UNIT);
	var leftLeadIds = customerIdsWithGemsUserIds.length - (SPLIT_UNIT * splittedGroups);
	var lastIndexOfGroupedLeadIds = 0;
	for (var i = 0; i < splittedGroups; i++) {
		var indexOfAThousandLeadIds = i * SPLIT_UNIT;
		lastIndexOfGroupedLeadIds = indexOfAThousandLeadIds + SPLIT_UNIT;
		var eachIds = '';
		for (var j = indexOfAThousandLeadIds; j < lastIndexOfGroupedLeadIds ; j++) {
			eachIds = eachIds + '(' + '\'' + customerIdsWithGemsUserIds[j].customer_id + '\'' + ',' + '\'' + customerIdsWithGemsUserIds[j].gems_user_id + '\'' + ')' + ',' + '\n';
		}
		batchInsertSql = batchInsertSql + format(getUnitInsertSql(eachIds)) + '\n';
	}

	if (leftLeadIds > 0) {
		for(var k = lastIndexOfGroupedLeadIds; k < customerIdsWithGemsUserIds.length; k++) {
			leftLeadIdsWithBrace = leftLeadIdsWithBrace + '(' + '\'' + customerIdsWithGemsUserIds[k].customer_id + '\'' + ',' + '\'' + customerIdsWithGemsUserIds[k].gems_user_id + '\'' + ')' + ',' + '\n';
		}
		batchInsertSql = batchInsertSql + format(getUnitInsertSql(leftLeadIdsWithBrace)) + '\n';
	}

	return batchInsertSql;
}

function format(leadIdsWithBrace) {
	return leadIdsWithBrace.substring(0, leadIdsWithBrace.length - 2) + ';';

}

function createTempUndoneCustomerTaskTable() {
	return 'create table otr_customer.temp_undone_customer_task (customer_id varchar(30), gems_user_id varchar(8));';
}

function createUndoneTaskIdTable() {
	return 'create table otr_customer.undone_task_id as (select id from customer_task join (select customer_id, id user_id from otr_customer.temp_undone_customer_task temp_customer left join (select id, gems_user_id from otr_account.user where gems_user_id in ("D8JILIA2")) tem_user on tem_user.gems_user_id = temp_customer.gems_user_id) undone_task on customer_task.customer_id = undone_task.customer_id and customer_task.user_id = undone_task.user_id);';
}

function updateCustomerTaskTable() {
	return 'update otr_customer.customer_task customer_task, otr_customer.undone_task_id undone_task_id set done_time = (NOW() + INTERVAL 8 hour), status = "DONE", comments = "线索失销，任务自动完成" where customer_task.id in (select id from undone_task_id);';
}

function dropTempUndoneCustomerTaskTable() {
	return 'drop table if exists otr_customer.temp_undone_customer_task;';
}

function dropTempUndoneTaskIdTable() {
	return 'drop table if exists otr_customer.undone_task_id;';
}

print(createTempUndoneCustomerTaskTable());
print(getBatchInsertSql(customerIdsWithGemsUserIds));
print(createUndoneTaskIdTable());
print(updateCustomerTaskTable());
print(dropTempUndoneCustomerTaskTable());
print(dropTempUndoneTaskIdTable());
