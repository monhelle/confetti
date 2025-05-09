const moment = require('moment');
const Completion = require('../models/completion');
const CompletionTracker = require('../models/completionTracker');
const checkRequirements = require('../utils/requirementsCheck');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// Get completion status and time
exports.getStatus = async (req, res) => {
  try {
    const requirements = await checkRequirements();
    
    if (!requirements.success) {
      return res.render('index', { 
        isCompleted: false,
        requirementsFailed: true,
        timeTaken: null
      });
    }

    // If requirements are met but completion not marked, mark it
    let completion = await Completion.findOne({ isCompleted: true });
    if (!completion && requirements.success) {
      completion = await Completion.create({
        isCompleted: true,
        completionTime: new Date()
      });

      // Get IP address using hostname -I
      const { stdout: ipOutput } = await execPromise('hostname -I');
      const ips = ipOutput.trim().split(' ').filter(ip => ip);
      const userIp = ips.find(ip => /^10\.12\.[0-9]+\.244$/.test(ip)) || ips[0];

      const targetTime = moment('10:30', 'HH:mm');
      const completionTime = moment(completion.completionTime);
      const timeDiff = completionTime.diff(targetTime, 'minutes');
      
      let formattedTime = '';
      if (timeDiff >= 60) {
        const hours = Math.floor(timeDiff / 60);
        const minutes = timeDiff % 60;
        formattedTime = `${hours} timer og ${minutes} minutter`;
      } else {
        formattedTime = `${timeDiff} minutter`;
      }

      // Store in tracker database
      await CompletionTracker.create({
        ipAddress: userIp,
        completionTime: completion.completionTime,
        timeTaken: formattedTime
      });
    }

    const targetTime = moment('10:30', 'HH:mm');
    let timeDiff = null;
    let formattedTime = '';

    if (completion) {
      const completionTime = moment(completion.completionTime);
      timeDiff = completionTime.diff(targetTime, 'minutes');
      
      if (timeDiff >= 60) {
        const hours = Math.floor(timeDiff / 60);
        const minutes = timeDiff % 60;
        formattedTime = `${hours} timer og ${minutes} minutter`;
      } else {
        formattedTime = `${timeDiff} minutter`;
      }
    }

    res.render('index', { 
      isCompleted: true,  // If we got here, requirements are met
      requirementsFailed: false,
      timeTaken: formattedTime
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Mark completion
exports.markComplete = async (req, res) => {
  try {
    const requirements = await checkRequirements();
    
    if (!requirements.success) {
      return res.json({ 
        success: false, 
        message: 'Fyll ut alle kravene først' 
      });
    }

    await Completion.findOneAndUpdate(
      {},
      { isCompleted: true, completionTime: new Date() },
      { upsert: true }
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
}; 