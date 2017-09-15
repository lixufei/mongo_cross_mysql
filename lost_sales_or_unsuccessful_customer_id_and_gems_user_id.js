function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

var customerIdsWithGemsUserId = [];
db.person.find({$or: [{"leads.status": "LOST_SALES"}, {"leads.status": "UNSUCCESSFUL"}]}).forEach(function(person) {
	var leadStatusList = person.leads.map(function(lead) {return lead.status;});
	var uniqueLeadStatusList = leadStatusList.filter(onlyUnique);
	var lostOrUnsuccessfulStatusList = uniqueLeadStatusList.filter(function(status) {
		return status === 'LOST_SALES' || status === 'UNSUCCESSFUL';
	});
	if (uniqueLeadStatusList.length === lostOrUnsuccessfulStatusList.length) {
		person.leads.forEach(function(lead) {
			if (lead.ownerSalesConsultantId !== undefined) {
				customerIdsWithGemsUserId.push({'customer_id':person._id.valueOf(), 'gems_user_id': lead.ownerSalesConsultantId});
			}
		})
	}
})

function getCustomerIdAndLostTimeStringWithBrace(lostSalesLeadWithIdAndLostTime) {
	return lostSalesLeadWithIdAndLostTime.map(function(item) {
		return ('(' + '\'' + item.customer_id + '\'' + ',' + '\'' + item.gems_user_id + '\'' + ')' + ',');
	});
}

function reduceCustomerIdAndLostTime(total, currentString) {
	return total + currentString;
}

function getResultString(reduceString) {
	return reduceString.substring(0, reduceString.length - 1);
}

var customerIdAnGemsUserId = getCustomerIdAndLostTimeStringWithBrace(customerIdsWithGemsUserId);
var reducedResult = (customerIdAnGemsUserId.length === 0) ? "" : customerIdAnGemsUserId.reduce(reduceCustomerIdAndLostTime);

print(getResultString(reducedResult));
