'use strict';

const expect = require('chai').expect;
const WinstonSnsSumoLogic = require('../index');

describe('winston-sns-sumo-logic', () => {
  it('should default log level to info', () => {
    const sns = {};
    const transport = new WinstonSnsSumoLogic({
      topicArn: 'irrelevant',
      sns
    });

    expect(transport.level).to.equal('info');
  });

  it('should fail if sns is not provided', () => {
    expect(() => new WinstonSnsSumoLogic({
      topicArn: 'irrelevant'
    })).to.throw(Error);
  });

  it('should fail if topicArn is not provided', () => {
    const sns = {};
    expect(() => new WinstonSnsSumoLogic({
      sns
    })).to.throw(Error);
  });

  it('should send message to sns', () => {
    const sns = {
      publish(parameters) {
        expect(parameters.TopicArn).to.equal('some topic arn');
        expect(parameters.Subject).to.equal('Winston Log');
        const message = JSON.parse(parameters.Message);
        expect(message.timestamp).to.be.an('number');
        delete message.timestamp;
        expect(message).to.eql({
          model: 'Falcon 9',
          flight: 20,
          level: 'info',
          message: 'successful landing',
          meta: {
            location: {
              latitude: 28.4859,
              longitude: -80.5444
            },
            fuel: 'nominal'
          }
        });
      }
    };
    const transport = new WinstonSnsSumoLogic({
      topicArn: 'some topic arn',
      sns,
      body: {
        model: 'Falcon 9',
        flight: 20
      }
    });

    transport.log('info', 'successful landing', {
      location: {
        latitude: 28.4859,
        longitude: -80.5444
      },
      fuel: 'nominal'
    });
  });
});
