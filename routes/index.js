var express = require('express');
var exec = require('child_process').exec, child;
var router = express.Router();
var Slack = require('slack-node');

var webhookUri = 'https://hooks.slack.com/services/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';
slack = new Slack();
slack.setWebhook(webhookUri);


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/ico', function(req, res) {
    var command = req.body.command;
    var project = req.body.text;

    if (command && project) {
        console.log('Generating details for ico %s', project);

        // prevents timeout by first sending an empty response
        // res.sendStatus(200);
        res.send(`Processing ${project}...`);
        // sendSlackResponse(`Processing ${project}...`);

        var path = `${__dirname}/../jar/ico-detail-generator-jar-with-dependencies.jar`;
        var javaCommand = `java -jar ${path} ${project}`;

        child = exec(javaCommand, function(error, stdout, stderr) {
            console.log(stdout);
            var message;
            if (error !== null) {
                // message = `${project} was not successfully added.`;
                sendSlackResponse(`${project} was not successfully added.`);
            }
            else {
                // message = `Added ${project} to Google Sheet.`;
                sendSlackResponse(`Added ${project} to Google Sheet.`);
            }

            var data = {
                response_type: 'in_channel',
                text: message
            };
        });
    }

    // response.render('index', { title: 'Express' });
});

function sendSlackResponse(message) {
    slack.webhook({
        username: 'ico-detail-bot',
        text: message,
        response_type: 'in_channel'
    }, function(err, response) {
        console.log(response);
    });
}

module.exports = router;
