var lostSalesOrUnsuccessfulLeadIds = [];
var SPLIT_UNIT = 1000;
db.person.find({$or: [{"leads.status": "LOST_SALES"}, {"leads.status": "UNSUCCESSFUL"}]}).forEach(function(person) {
	person.leads.forEach(function(lead) {
		if ((lostSalesOrUnsuccessfulLeadIds.indexOf(lead._id) <= -1) && ((lead.status === 'LOST_SALES') || (lead.status === 'UNSUCCESSFUL'))) {
			lostSalesOrUnsuccessfulLeadIds.push(lead._id);
		}
	})
})

function getUnitUpdateSql(leadIds) {
	return 'update otr_account.todo_task set done_time = (NOW() + INTERVAL 8 hour), status = "DONE", comments = "线索失销，任务自动完成" where related_lead_id in ' + leadIds + ';';
}

function getBatchUpdateSql(lostSalesOrUnsuccessfulLeadIds) {
	var batchUpdateSql = '';
	var leadIdsWithBrace = '(';
	var leftLeadIdsWithBrace = '(';
	var splittedGroups = Math.floor(lostSalesOrUnsuccessfulLeadIds.length / SPLIT_UNIT);
	var leftLeadIds = lostSalesOrUnsuccessfulLeadIds.length - (SPLIT_UNIT * splittedGroups);
	var lastIndexOfGroupedLeadIds = 0;
	for (var i = 0; i < splittedGroups; i++) {
		var indexOfAThousandLeadIds = i * SPLIT_UNIT;
		lastIndexOfGroupedLeadIds = indexOfAThousandLeadIds + SPLIT_UNIT;
		var eachIds = '(';
		for (var j = indexOfAThousandLeadIds; j < lastIndexOfGroupedLeadIds ; j++) {
			eachIds = eachIds + '\'' + lostSalesOrUnsuccessfulLeadIds[j] + '\'' + ',';
		}
		batchUpdateSql = batchUpdateSql + getUnitUpdateSql(format(eachIds)) + '\n';
	}

	if (leftLeadIds.length > 0) {
		for(var k = lastIndexOfGroupedLeadIds; k < lostSalesOrUnsuccessfulLeadIds.length; k++) {
			leftLeadIdsWithBrace = leftLeadIdsWithBrace + '\'' + lostSalesOrUnsuccessfulLeadIds[k] + '\'' + ',';
		}
		batchUpdateSql = batchUpdateSql + getUnitUpdateSql(format(leftLeadIdsWithBrace)) + '\n';
	}

	return batchUpdateSql;
}

function format(leadIdsWithBrace) {
	return leadIdsWithBrace.substring(0, leadIdsWithBrace.length - 1) + ')';

}

print(getBatchUpdateSql(lostSalesOrUnsuccessfulLeadIds));


