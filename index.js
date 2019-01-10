'use strict';

const winston = require('winston');

module.exports = class WinstonSnsSumoLogic extends winston.Transport {
  constructor(options) {
    super(options);

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

  log(info, callback) {
    // this is the required sumo logic timestamp for json logs
    const body = Object.assign({}, this.body, {
      timestamp: Date.now(),
      level: info.level,
      message: info.message,
      meta: info.meta
    });

    this.sns.publish({
      TopicArn: this.topicArn,
      Subject: 'Winston Log',
      Message: JSON.stringify(body)
    }, callback);
  }
};
