class Logger {
  info(message) {
    console.log(`ℹ️  [INFO] ${message}`);
  }

  success(message) {
    console.log(`✅ [SUCCESS] ${message}`);
  }

  error(message, error) {
    console.error(`❌ [ERROR] ${message}`, error || '');
  }

  warn(message) {
    console.warn(`⚠️  [WARNING] ${message}`);
  }
}

module.exports = new Logger();
