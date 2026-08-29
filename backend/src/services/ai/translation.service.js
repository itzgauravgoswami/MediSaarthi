// Medical Translation Service
const { generateStructuredJson } = require('./gemini.client');
const { TRANSLATION_PROMPT_TEMPLATE } = require('./prompts/translation.prompt');

async function translateText(text, sourceLang = 'hi-IN', targetLang = 'en-IN') {
  if (!text) return { translatedText: '' };
  if (sourceLang === targetLang) return { translatedText: text };

  const prompt = TRANSLATION_PROMPT_TEMPLATE
    .replace('{{sourceLang}}', sourceLang)
    .replace('{{targetLang}}', targetLang)
    .replace('{{text}}', text);

  const fallback = () => {
    // Quick dictionary mapping for key clinical phrases
    if (text.includes('सीने में दर्द')) {
      return { translatedText: 'Chest pain', detectedMedicalTerms: ['Chest pain / Angina'] };
    }
    if (text.includes('सांस लेने में तकलीफ')) {
      return { translatedText: 'Difficulty breathing / Dyspnea', detectedMedicalTerms: ['Dyspnea'] };
    }
    return { translatedText: text, detectedMedicalTerms: [] };
  };

  return await generateStructuredJson(prompt, fallback);
}

module.exports = {
  translateText
};
