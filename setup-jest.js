const {JUnitXmlReporter} = require('jasmine-reporters');

if (process.env.CIRCLECI) {
  jasmine.getEnv().addReporter(new JUnitXmlReporter({
    consolidateAll: false,
    savePath: 'CIRCLE_TEST_REPORTS/jest/'
  }));
}
