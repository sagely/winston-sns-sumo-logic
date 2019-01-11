'use strict';

const WinstonSnsSumoLogic = require('./index');

describe('winston-sns-sumo-logic', () => {
  it('should default log level to info', () => {
    const sns = {};
    const transport = new WinstonSnsSumoLogic({
      topicArn: 'irrelevant',
      sns
    });

    expect(transport.level).toEqual('info');
  });

  it('should fail if sns is not provided', () => {
    expect(() => new WinstonSnsSumoLogic({
      topicArn: 'irrelevant'
    })).toThrow(Error);
  });

  it('should fail if topicArn is not provided', () => {
    const sns = {};
    expect(() => new WinstonSnsSumoLogic({
      sns
    })).toThrow(Error);
  });

  it('should send message to sns', () => {
    const sns = {
      publish(parameters) {
        expect(parameters.TopicArn).toEqual('some topic arn');
        expect(parameters.Subject).toEqual('Winston Log');
        const message = JSON.parse(parameters.Message);
        expect(typeof message.timestamp).toEqual('number');
        delete message.timestamp;
        expect(message).toEqual({
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

    transport.log({
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
  });
});
