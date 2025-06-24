const User = require('./models/user');
const bcrypt = require('bcryptjs');

const seedUsers = async () => {
    for(let i = 1; i<=50; i++){
        const user = new User({
            name: `User ${i}`,
            email: `User${i}@example.com`,
            password: await bcrypt.hash('123456', 10),
            role: i%5===0 ? 'admin' : 'user'
        });
        await user.save();
    }
    console.log('Seeded 50 users');

}

module.exports = seedUsers;