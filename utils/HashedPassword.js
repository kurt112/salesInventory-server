const bcrypt = require('bcrypt')

const EncryptPassword = async (data) => {
    return await bcrypt.hash(data,10)
}

module.exports = EncryptPassword