const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./Routes/Admin');
const shopRoutes = require('./Routes/Shop');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'Views', '404.html'));
});

app.listen(3000);