/**
 * Service layer type definitions
 *
 * Type definitions for service classes including SearchService and MessageService.
 */

/**
 * Label information returned from API
 */
export interface Label {
  value: string;
  label: string;
}

/**
 * Message template variables
 * Variables that can be interpolated into message templates
 */
export interface MessageVars {
  [key: string]: string | number;
}

/**
 * Supported language codes for MessageService
 */
export type LanguageCode =
  | 'en'
  | 'ja'
  | 'zh'
  | 'tw'
  | 'ko'
  | 'cs'
  | 'da'
  | 'de'
  | 'es'
  | 'fr'
  | 'it'
  | 'hu'
  | 'nl'
  | 'no'
  | 'pl'
  | 'pt'
  | 'fi'
  | 'sv'
  | 'tr'
  | 'ru'
  | 'ar'
  | 'bg'
  | 'ca'
  | 'hr'
  | 'fil'
  | 'el'
  | 'he'
  | 'hi'
  | 'id'
  | 'lv'
  | 'lt'
  | 'ro'
  | 'sr'
  | 'sk'
  | 'sl'
  | 'th'
  | 'uk'
  | 'vi';

/**
 * Message key type
 * All possible message keys used in the application
 */
export type MessageKey =
  | 'form.search.button'
  | 'form.input.placeholder'
  | 'error.fess_unavailable'
  | 'error.fess_not_found'
  | 'error.fess_unsupported_version'
  | 'result.status'
  | 'result.status_over'
  | 'result.number'
  | 'result.second'
  | 'result.label'
  | 'result.label.all'
  | 'result.order'
  | 'result.order.asc'
  | 'result.order.desc'
  | 'result.order.score'
  | 'result.order.filename'
  | 'result.order.created'
  | 'result.order.content_length'
  | 'result.order.last_modified'
  | 'result.order.click_count'
  | 'result.order.favorite_count'
  | 'result.pagination.prev'
  | 'result.pagination.next'
  | 'result.did_not_match'
  | 'result.related_query_label'
  | 'result.size'
  | 'result.created';

/**
 * Message dictionary for a single language
 */
export type MessageDictionary = Record<MessageKey, string>;

/**
 * All messages organized by language
 */
export type Messages = Record<LanguageCode, MessageDictionary>;
