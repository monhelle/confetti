const moment = require('moment');
const Completion = require('../models/completion');
const checkRequirements = require('../utils/requirementsCheck');

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
    }

    const targetTime = moment('10:10', 'HH:mm');
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