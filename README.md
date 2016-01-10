# winston-sns-sumo-logic

[![Circle CI](https://circleci.com/gh/Battlefy/winston-sns-sumo-logic.svg?style=shield)](https://circleci.com/gh/Battlefy/winston-sns-sumo-logic)

An [Amazon SNS][0] transport for [winston][1] specialized for JSON logs in [Sumo Logic][2].

[Sumo Logic][2] is not required to use this package if you only want to send nicely formatted JSON messages to [Amazon SNS][0].

Requires [Node.js v4.2.x][9] or greater.

## Usage
``` js
const winston = require('winston');
const WinstonSnsSumoLogic = require('winston-sns-sumo-logic');
const AWS = require('aws-sdk');

const sns = new AWS.SNS({
  region: '..',
  accessKeyId: '..',
  secretAccessKey: '..'
});

const options = {
  level: 'error',
  sns,
  topicArn: '..'
};

winston.add(WinstonSnsSumoLogic, options);
```
### Options
* `level`: Level of messages that should be logged.  Defaults to `info`.
* `sns` (**required**): The [AWS.SNS][3] instance to log to.
* `topicArn` (**required**): The [Amazon SNS topic ARN][4] where the messages to be sent.
* `body`: The base JSON message body.  Should not contain `timestamp`, `level`, `message`, or `meta`.  Forbidden fields will be overwritten.

### Example
Let's say `options.body` was configured to be
``` js
{
  model: 'Falcon 9',
  flight: 20
}
```
When the the following message is logged
``` js
const landingDetails = {
  location: {
    latitude: 28.4859,
    longitude: -80.5444
  },
  fuel: 'nominal'
}
winston.info('successful landing', landingDetails);
```
Then the resulting [Amazon SNS][0] message body would be
``` json
{
  "model": "Falcon 9",
  "flight": 20,
  "timestamp": 1450748385666,
  "level": "info",
  "message": "successful landing",
  "meta": {
    "location": {
      "latitude": 28.4859,
      "longitude": -80.5444
    },
    "fuel": "nominal"
  }
}
```
Where `timestamp` is the Unix Epoch in milliseconds when the message was logged.

## Justification
There is another [winston-sns][5] transport, but it does not work well with [Sumo Logic][2].  That transport is focused on sending text based messaged to [Amazon SNS][0], where as this transport focuses on sending JSON based messages with [Sumo Logic][2] compatible timestamps.

## Installation
``` bash
$ npm install winston-sns-sumo-logic --save
```

## Sumo Logic Setup
1. [Create a Sumo Logic HTTP Collector][6]
2. Create a [Amazon SNS][0] topic
3. Add Sumo Logic HTTP Collector endpoint as an HTTPS subscriber to the new topic
4. [Subscribe to SNS Notifications][7]
5. [Enable Raw Message Delivery][8]
6. Add winston-sns-sumo-logic as a new transport
7. Configure with topic ARN
8. Ensure AWS Access Key has permission to publish messages to [Amazon SNS][0]

#### Author: [Ronald Chen](https://github.com/Pyrolistical)

#### License: MIT

[0]: https://aws.amazon.com/sns/
[1]: https://github.com/winstonjs/winston
[2]: https://www.sumologic.com
[3]: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SNS.html
[4]: http://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html#arn-syntax-sns
[5]: https://github.com/jesseditson/winston-sns
[6]: https://service.sumologic.com/help/Default.htm#Setting_up_a_Hosted_Collector.htm
[7]: https://service.sumologic.com/help/#Collecting_logs_for_AWS_Config.htm
[8]: http://docs.aws.amazon.com/sns/latest/dg/large-payload-raw-message.html
[9]: https://nodejs.org/en/blog/release/v4.2.0/
