/**
 * Search-related type definitions
 *
 * This file contains all type definitions related to search functionality,
 * including search conditions, results, and pagination information.
 */

/**
 * Additional search options
 */
export interface SearchAddition {
  scrollTop?: boolean;
}

/**
 * Search condition parameters
 */
export interface SearchCondition {
  q: string;
  sort?: string;
  label?: string;
  page: number;
  pageSize: number;
  addition?: SearchAddition;
}

/**
 * Individual search result item
 */
export interface SearchResultItem {
  doc_id: string;
  content_title: string;
  url_link: string;
  content_description: string;
  content_length: number;
  site_path: string;
  created: string;
  last_modified: string;
}

/**
 * Related content (HTML string to be rendered)
 *
 * This type represents HTML content returned by the Fess API
 * that is displayed as related content in search results.
 * The content is rendered using v-html in the UI.
 */
export type RelatedContent = string;

/**
 * Pagination information
 */
export interface PageInfo {
  pageNumbers: number[];
  currentPageNumber: number;
  prevPage: boolean;
  nextPage: boolean;
}

/**
 * Overall search state
 */
export interface SearchState {
  recordCount: number;
  recordCountRelation: 'EQUAL_TO' | 'GREATER_THAN';
  startRecordNumber: number;
  endRecordNumber: number;
  execTime: number;
  q: string;
  queryId: string;
  items: SearchResultItem[];
  relatedQueries: string[];
  relatedContents: RelatedContent[];
  pageInfo: PageInfo;
  searching?: boolean;
  show?: boolean;
  searchCond?: SearchCondition;
}

/**
 * Sort order options
 */
export type SortOrder = 'score.desc' | 'created.desc' | 'updated.desc';

/**
 * Record count relation types
 */
export type RecordCountRelation = 'EQUAL_TO' | 'GREATER_THAN';
