const express = require('express');
const router = express.Router();
const CompletionTracker = require('../models/completionTracker');

// Simple middleware to check admin IP
const checkAdminIp = async (req, res, next) => {
    const { exec } = require('child_process');
    const util = require('util');
    const execPromise = util.promisify(exec);

    try {
        const { stdout: ipOutput } = await execPromise('hostname -I');
        const ips = ipOutput.trim().split(' ').filter(ip => ip);
        const currentIp = ips.find(ip => /^10\.12\.[0-9]+\.244$/.test(ip)) || ips[0];
        
        // Replace this with your admin IP
        const adminIp = process.env.ADMIN_IP;
        
        if (currentIp === adminIp) {
            next();
        } else {
            res.status(403).send('Unauthorized');
        }
    } catch (error) {
        res.status(500).send('Error checking authorization');
    }
};

// Get completion data (protected by admin IP check)
router.get('/completions', checkAdminIp, async (req, res) => {
    try {
        const completions = await CompletionTracker.find()
            .sort({ completionTime: -1 }) // Most recent first
            .select('-__v');
        
        res.json(completions);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching completion data' });
    }
});

module.exports = router; 