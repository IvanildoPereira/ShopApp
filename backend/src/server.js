const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const app = express();
require('dotenv/config');
require('./database')
const HttpError = require('./models/http-error');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products')
const cartRoutes = require('./routes/cart')
const orderRoutes = require('./routes/orders')
const feedbackController = require('./controllers/feedbackController')
const BullBoard = require('bull-board');
const Queue = require('./lib/Queue');

// Path Images
app.use('/uploads/images', express.static(path.join('uploads', 'images')));

// Passing the body to json
app.use(express.json());

// Config cors
BullBoard.setQueues(Queue.queues.map(queue => queue.bull));
app.use(cors());

// Routes
app.use('/users/', userRoutes);
app.use('/product/', productRoutes);
app.use('/cart/', cartRoutes);
app.use('/order/', orderRoutes);
app.post('/feedback', feedbackController.sendFeedback)
app.use('/admin/queues', BullBoard.UI);


// Route doesn't exist
app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
});

// General errors
app.use((error, req, res, next) => {
    // Delete files
    if (req.file) {
        fs.unlink(req.file.path, err => {
            if(err){
                const error = new HttpError('Somethinh goes wrong on file system.', 500);
                throw error;
            }
        });
    }
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred!' });
});

const server = app.listen(process.env.PORT || 8000);
const io = require('./config/socket').init(server);
