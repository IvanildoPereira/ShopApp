const Queue = require('../lib/Queue');

const sendFeedback = async (req, res, next) => {
    const { email, subject, message } = req.body;
    
    Queue.add('feedbackMail', { email, subject, message });
    res.json({message: "Thank's for your feedback!"})
}

exports.sendFeedback = sendFeedback;
