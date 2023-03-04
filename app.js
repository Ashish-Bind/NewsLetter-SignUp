const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const app = express();
const port = 80;

// Using Public folder to server css and images
app.use(express.static('public'));

// Using Body-parser 
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
})

app.post('/failure', (req, res) => {
    res.redirect('/')
})

app.post('/', (req, res) => {
    const name = req.body.name;
    const surname = req.body.surname;
    const email = req.body.letteremail;

    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: name,
                    LNAME: surname
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = 'https://us13.api.mailchimp.com/3.0/lists/754a79c747';
    const options = {
        method: "POST",
        auth: "ashish1:a3227685d6fcf5018342c9d4daae5e44-us13"
    }

    const request = https.request(url, options, (response) => {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + '/success.html')
        } else {
            res.sendFile(__dirname + '/failure.html')
        }
        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
})


app.listen(process.env.PORT || port, () => {
    console.log("Server Started");
})

//* API Key
//* a3227685d6fcf5018342c9d4daae5e44-us13

//* List Id
//* 754a79c747