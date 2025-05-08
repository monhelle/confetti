const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function checkRequirements() {
    try {
        const results = {
            ip: false,
            node: false,
            mongodb: false,
            pm2: false
        };

        // Check IP
        const { stdout: ipOutput } = await execPromise("ifconfig | grep 'inet ' | grep -v 127.0.0.1 | awk '{print $2}'");
        const ip = ipOutput.trim();
        results.ip = /^10\.12\.[0-9]+\.244$/.test(ip);

        // Check Node version
        const { stdout: nodeVersion } = await execPromise('node -v');
        const version = parseInt(nodeVersion.slice(1).split('.')[0]);
        results.node = version >= 19;

        // Check MongoDB is not installed
        try {
            await execPromise('which mongod');
            results.mongodb = false; // MongoDB is installed (we don't want this)
        } catch {
            results.mongodb = true; // MongoDB is not installed (this is what we want)
        }

        // Check PM2
        try {
            const { stdout: pm2List } = await execPromise('pm2 list');
            results.pm2 = pm2List.toLowerCase().includes('server') || pm2List.toLowerCase().includes('app');
        } catch {
            results.pm2 = false;
        }

        return {
            success: Object.values(results).every(result => result),
            results
        };
    } catch (error) {
        console.error('Error checking requirements:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

module.exports = checkRequirements; 