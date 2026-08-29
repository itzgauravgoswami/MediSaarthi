// Medical Translation Prompt (Hindi <-> English)

const TRANSLATION_PROMPT_TEMPLATE = `
You are a Medical Translation Assistant for Indian healthcare.
Translate the text while accurately preserving clinical medical terminology.

Source Language: {{sourceLang}}
Target Language: {{targetLang}}
Text to Translate:
"""{{text}}"""

OUTPUT SCHEMA (Must be valid JSON):
{
  "translatedText": "Translation",
  "detectedMedicalTerms": []
}
`;

module.exports = {
  TRANSLATION_PROMPT_TEMPLATE
};
