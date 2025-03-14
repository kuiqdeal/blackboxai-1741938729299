const { asyncHandler } = require('./errorMiddleware');
const logger = require('../utils/logger');

// Supported languages
const SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'ar', 'zh'];
const DEFAULT_LANGUAGE = 'en';

const languageMiddleware = asyncHandler(async (req, res, next) => {
  try {
    // Extract language preference from header
    let language = req.headers['accept-language'] || DEFAULT_LANGUAGE;
    
    // Get the primary language code (e.g., 'en-US' -> 'en')
    language = language.split(',')[0].split('-')[0].toLowerCase();

    // Validate if language is supported
    if (!SUPPORTED_LANGUAGES.includes(language)) {
      logger.debug('Unsupported language requested, falling back to default', {
        requested: language,
        default: DEFAULT_LANGUAGE
      });
      language = DEFAULT_LANGUAGE;
    }

    // Attach language preference to request object
    req.language = language;

    // Add language to response headers
    res.setHeader('Content-Language', language);

    logger.debug('Language middleware processed', {
      language,
      path: req.path,
      method: req.method
    });

    next();
  } catch (error) {
    logger.error('Error in language middleware', { error });
    req.language = DEFAULT_LANGUAGE;
    next();
  }
});

// Helper function to get translated message
const getTranslatedMessage = (key, language = DEFAULT_LANGUAGE) => {
  try {
    const translations = require(`../locales/${language}.json`);
    return translations[key] || key;
  } catch (error) {
    logger.error('Translation error', { key, language, error });
    return key;
  }
};

module.exports = { 
  languageMiddleware,
  getTranslatedMessage,
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE
};
