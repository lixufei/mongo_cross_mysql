function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

var gemsUserIds = [];
db.person.find({$or: [{"leads.status": "LOST_SALES"}, {"leads.status": "UNSUCCESSFUL"}]}).forEach(function(person) {
	var leadStatusList = person.leads.map(function(lead) {return lead.status;});
	var uniqueLeadStatusList = leadStatusList.filter(onlyUnique);
	var lostOrUnsuccessfulStatusList = uniqueLeadStatusList.filter(function(status) {
		return status === 'LOST_SALES' || status === 'UNSUCCESSFUL';
	});
	if (uniqueLeadStatusList.length === lostOrUnsuccessfulStatusList.length) {
		person.leads.forEach(function(lead) {
			if (lead.ownerSalesConsultantId !== undefined && (gemsUserIds.indexOf(lead.ownerSalesConsultantId) <= -1)) {
				gemsUserIds.push(lead.ownerSalesConsultantId);
			}
		})
	}
})
printjson(gemsUserIds);
