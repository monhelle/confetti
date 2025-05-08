const checkRequirements = require('../utils/requirementsCheck');

exports.getInstructions = async (req, res) => {
    try {
        const requirementsCheck = await checkRequirements();
        res.render('instructions', { 
            title: 'Krav Sjekkliste',
            requirements: requirementsCheck.results || {
                ip: false,
                node: false,
                mongodb: false,
                pm2: false
            }
        });
    } catch (err) {
        console.error('Error checking requirements:', err);
        res.render('instructions', { 
            title: 'Krav Sjekkliste',
            requirements: {
                ip: false,
                node: false,
                mongodb: false,
                pm2: false
            }
        });
    }
}; 