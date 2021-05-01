const {AuditTrail} = require('../models')
const InsertAudit = (StoreId,UserId, action,value) => {
    AuditTrail.create({
        StoreId,
        UserId,
        action,
        value
    })
}

module.exports = InsertAudit