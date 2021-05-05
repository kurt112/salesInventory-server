const bcrypt  = require('bcrypt')
const compare = async (currentPassword, getPassword) => {
    return await bcrypt.compare(currentPassword,getPassword)
}

module.exports = compare
