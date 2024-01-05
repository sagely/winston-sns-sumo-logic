'use strict';

const winston = require('winston');
const { PublishCommand } = require('@aws-sdk/client-sns');

module.exports = class WinstonSnsSumoLogic extends winston.Transport {
  constructor(options) {
    super();
    this.name = 'sns sumo logic transport';
    this.level = options.level || 'info';
    if (!options.sns) {
      throw new Error('options.sns is required');
    }
    this.sns = options.sns;
    if (!options.topicArn) {
      throw new Error('options.topicArn is required');
    }
    this.topicArn = options.topicArn;
    this.body = options.body || {};
  }

  log(level, message, meta, callback) {
    // this is the required sumo logic timestamp for json logs
    const timestamp = Date.now();
    const body = Object.assign({}, this.body, {
      timestamp,
      level,
      message,
      meta
    });
    // this.sns.publish({
    //   TopicArn: this.topicArn,
    //   Subject: 'Winston Log',
    //   Message: JSON.stringify(body)
    // }, callback);

    const publishCommand = new PublishCommand({
      TopicArn: this.topicArn,
      Subject: 'Winston Log',
      Message: JSON.stringify(body)
    });
    this.sns.send(publishCommand).then(() => {
      console.log('cb: ', callback);
      console.log('message: ', message);
      return callback();
    });
  }
};
