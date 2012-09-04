describe("JLog", function() {
  var logger = null;

  beforeEach(function() {
    logger = new JLog('LoggerName');
  });

  it('should be able to get and set the name of the logger', function() {
    expect(logger.getName()).toEqual('LoggerName');

    logger.setName('NewName');
    expect(logger.getName()).toEqual('NewName');
  });

  it('should be able to turn the logger on and off and test its state', function() {
    expect(logger.isOn()).toBe(true);

    logger.turnOff();
    expect(logger.isOn()).toBe(false);

    logger.turnOn();
    expect(logger.isOn()).toBe(true);
  });

  it('the default level should be ALL', function() {
    expect(logger.getLevel()).toBe(JLog.ALL);
  });

  it('should be able to set and get the level of the logger', function() {
    logger.setLevel();
    expect(logger.getLevel()).toBe(JLog.NONE);
    logger.setLevel('nonsense');
    expect(logger.getLevel()).toBe(JLog.NONE);
    logger.setLevel('all');
    expect(logger.getLevel()).toBe(JLog.ALL);
    logger.setLevel('debug');
    expect(logger.getLevel()).toBe(JLog.DEBUG);
    logger.setLevel('info');
    expect(logger.getLevel()).toBe(JLog.INFO);
    logger.setLevel('error');
    expect(logger.getLevel()).toBe(JLog.ERROR);
    logger.setLevel('fatal');
    expect(logger.getLevel()).toBe(JLog.FATAL);
    logger.setLevel('warn');
    expect(logger.getLevel()).toBe(JLog.WARN);
  });

  it('should be able to get the list of appenders', function() {
    expect(Object.prototype.toString.call(logger.getAppenders())).toBe('[object Array]');
  });

  it('should only have ConsoleAppender by default', function() {
    expect(logger.getAppenders().length).toBe(1);
    expect(logger.getAppenders()[0].name).toEqual('ConsoleAppender');
  });

  it('should be able to add appender', function() {
    expect(logger.getAppenders().length).toBe(1);
    var newAppender = new JLog.ConsoleAppender;
    newAppender.name = 'NewAppender';
    logger.addAppender(newAppender);
    expect(logger.getAppenders().length).toBe(2);
    expect(logger.getAppenders()[1].name).toEqual('NewAppender');
  });

  it('should be able to remove appender', function() {
    expect(logger.getAppenders().length).toBe(1);
    logger.removeAppender('ConsoleAppender');
    expect(logger.getAppenders().length).toBe(0);
  });

  it('should be calling log() on all available appenders', function() {
    var consoleAppender1 = logger.getAppender('ConsoleAppender'),
        consoleAppender2 = new JLog.ConsoleAppender,
        consoleAppender3 = new JLog.ConsoleAppender,
        testString = 'This is test warning string';

    consoleAppender2.name = 'ConsoleAppender2';
    consoleAppender3.name = 'ConsoleAppender3';
    logger.addAppender(consoleAppender2);
    logger.addAppender(consoleAppender3);

    spyOn(consoleAppender1, 'log');
    spyOn(consoleAppender2, 'log');
    spyOn(consoleAppender3, 'log');

    logger.warn(testString);
    expect(consoleAppender1.log).toHaveBeenCalled();
    expect(consoleAppender2.log).toHaveBeenCalled();
    expect(consoleAppender3.log).toHaveBeenCalled();
  });

  it('should not be logging when turned off', function() {
    var appender = logger.getAppender('ConsoleAppender');

    spyOn(appender, 'log');

    logger.turnOff();
    logger.warn('some string, whatever');

    expect(appender.log.calls.length).toBe(0);
  });

  it('should only log at or below the set level', function() {
    var appender = logger.getAppender('ConsoleAppender');

    spyOn(appender, 'log');
    logger.setLevel('warn');

    logger.debug('something');
    logger.info('something');
    logger.warn('something');
    logger.error('something');
    logger.fatal('something');

    expect(appender.log.calls.length).toBe(3);

    logger.setLevel('fatal');

    logger.debug('something');
    logger.info('something');
    logger.warn('something');
    logger.error('something');
    logger.fatal('something');

    expect(appender.log.calls.length).toBe(4);
  });
});