let express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

let app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000);

function jsonReader(filePath, cb) {
    //Read data file and return parsed array
    fs.readFile(filePath, 'utf-8', (err, jsonString) => {
        if (err) {
            return cb && cb(err);
        } 
        
        try {
            const data = JSON.parse(jsonString);
            return cb && cb(null, data);
        } catch (err) {
            return cb && cb(err);
        }
    });
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.get('/data', (req, res) => {
    // Get contents of data file
    jsonReader('./data.json', (err, data) => {
        if (err) {
            console.log('Error parsing JSON', err);
            return [];
        } else {
            console.log(data);
            return res.json(data)
        }
    })
})

// Get tweet info by ID
app.get('/:id', (req, res) => {
    jsonReader('./data.json', (err, data) => {
        if (err) {
            console.log('Error parsing JSON', err);
            return [];
        } else {

            // Search array for ID match
            data.find((tweetData, index) => {
                if(tweetData.id == req.params.id) {
                    console.log('DETAIL!!!');
                    console.log(data[index]);

                    return res.json(data[index]);
                }
            });

            return res.json(data)
        }
    })
})

// Create Tweet
app.post('/create', (req, res) => {
    console.log('CREATING TWEET!!!');
    console.log(req.body);

    jsonReader('./data.json', (err, data) => {
        if (err) {
            console.log('Error parsing JSON', err);
        } else {
            // Add new object to data file
            data.push({
                text: req.body.text,
                id: parseInt(req.body.tweet_id),
                user: {
                    name: 'john doe',
                    screen_name: 'johndoe'
                },
                created_at: new Date()
            })

            // Write to data file
            fs.writeFile('./data.json', JSON.stringify(data, null, 2), err => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('SUCCESS!!!');
                }
            })
            
        }
    })

})

// Update Tweet
app.post('/update', (req, res) => {
    console.log('UPDATING!!!');
    console.log(req.body);

    jsonReader('./data.json', (err, data) => {
        if (err) {
            console.log('Error parsing JSON', err);
            return [];
        } else {
            console.log(data);

            // Search array for user ID match
            data.find((tweetData, index) => {
                if(tweetData.user.name == req.body.name) {
                    console.log('SEARCHING!!!');
                    console.log(data[index].user.screen_name);

                    data[index].user.screen_name = req.body.screen_name;

                    // Write to data file
                    fs.writeFile('./data.json', JSON.stringify(data, null, 2), err => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('UPDATED!!!');
                        }
                    })
                }
            });
        }
    })

})

// Delete Tweet
app.post('/delete', (req, res) => {
    console.log('UPDATING!!!');
    console.log(req.body);

    jsonReader('./data.json', (err, data) => {
        if (err) {
            console.log('Error parsing JSON', err);
            return [];
        } else {
            console.log(data);

            // Search array for user ID match
            data.find((tweetData, index) => {
                if(tweetData.id == parseInt(req.body.tweet_id)) {
                    console.log('FOUND!!!');

                    // Delete tweet
                    data.splice(index, 1);

                    // Write back new to data file
                    fs.writeFile('./data.json', JSON.stringify(data, null, 2), err => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('DELETED!!!');
                        }
                    })
                }
            });
        }
    })

})

