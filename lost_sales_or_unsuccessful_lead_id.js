var lostSalesOrUnsuccessfulLeadIds = [];
db.person.find({$or: [{"leads.status": "LOST_SALES"}, {"leads.status": "UNSUCCESSFUL"}]}).forEach(function(person) {
	person.leads.forEach(function(lead) {
		if ((lostSalesOrUnsuccessfulLeadIds.indexOf(lead._id) <= -1) && ((lead.status === 'LOST_SALES') || (lead.status === 'UNSUCCESSFUL'))) {
			lostSalesOrUnsuccessfulLeadIds.push(lead._id);
		}
	})
})

printjson(lostSalesOrUnsuccessfulLeadIds);
