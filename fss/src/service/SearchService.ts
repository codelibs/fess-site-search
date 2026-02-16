import axios, { type AxiosResponse } from 'axios';
import { Configuration, SearchApi, SuggestApi } from '@/openapi/main';
import type {
  SearchDocuments200Response,
  ListLabels200Response,
  FindSuggestWords200Response,
} from '@/openapi/main';
import type { SearchCondition, SearchState } from '@/types/search.types';
import type { Label } from '@/types/service.types';

/**
 * SearchService
 *
 * This module provides search functions.
 */
export default class SearchService {
  private fessUrl: string;
  private configuration: Configuration;

  constructor(fessUrl: string) {
    // Remove trailing slash if present
    this.fessUrl = fessUrl.endsWith('/') ? fessUrl.substring(0, fessUrl.length - 1) : fessUrl;

    // Configure OpenAPI client
    this.configuration = new Configuration({
      basePath: `${this.fessUrl}/api/v1`,
    });
  }

  /**
   * Handle Axios errors with structured logging and user-friendly error messages.
   * This method centralizes error handling logic to avoid code duplication.
   *
   * @param operation - Name of the operation that failed (e.g., 'search', 'getFessVersion')
   * @param error - The error object caught from axios
   * @param context - Additional context information for debugging
   * @throws Error with user-friendly message
   */
  private _handleAxiosError(
    operation: string,
    error: unknown,
    context?: Record<string, unknown>
  ): never {
    // Build base error information for logging
    const errorInfo = {
      operation,
      timestamp: new Date().toISOString(),
      ...context,
    };

    if (axios.isAxiosError(error)) {
      // Extract detailed information from Axios error
      const statusCode = error.response?.status;
      const statusText = error.response?.statusText;
      const responseData = error.response?.data;
      const requestUrl = error.config?.url;

      // Log structured error information
      console.error(`${operation} failed`, {
        ...errorInfo,
        errorType: 'AxiosError',
        statusCode,
        statusText,
        requestUrl,
        responseData,
        message: error.message,
        code: error.code,
        stack: error.stack,
      });

      // Generate user-friendly error messages based on error type
      let errorMessage = `${operation} failed`;
      if (statusCode === 404) {
        errorMessage = `${operation} endpoint not found. Please check Fess URL configuration.`;
      } else if (statusCode === 401 || statusCode === 403) {
        errorMessage = `Access denied to ${operation} endpoint. Please check authentication settings.`;
      } else if (statusCode && statusCode >= 500) {
        errorMessage = `${operation} server error. Please try again later.`;
      } else if (statusCode) {
        errorMessage = `${operation} failed: HTTP ${statusCode} ${statusText}`;
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = `${operation} request timeout. Please try again.`;
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = `Network error. Please check your connection and Fess URL.`;
      } else {
        errorMessage = `${operation} failed: ${error.message}`;
      }

      throw new Error(errorMessage);
    } else {
      // Handle non-Axios errors (unexpected errors)
      console.error(`${operation} failed with unexpected error`, {
        ...errorInfo,
        errorType: 'UnknownError',
        error,
      });

      throw new Error(`${operation} failed: ${error}`);
    }
  }

  /**
   * Get Fess version from server
   * @returns Promise resolving to version string
   */
  async getFessVersion(): Promise<string> {
    const url = `${this.fessUrl}/json`;
    try {
      const res: AxiosResponse = await axios.get(url);
      return res.data.response.version as string;
    } catch (e) {
      this._handleAxiosError('Get Fess version', e, { url });
    }
  }

  /**
   * Execute search query
   * @param searchCond - Search conditions
   * @param state - Search state to be updated with results
   * @returns Promise resolving to search response
   */
  async search(searchCond: SearchCondition, state: SearchState): Promise<SearchDocuments200Response> {
    const searchApi = new SearchApi(this.configuration);

    // Build query parameters
    const q = searchCond.q || '*:*';
    const start = (searchCond.page - 1) * searchCond.pageSize;
    const num = searchCond.pageSize;
    const sort = searchCond.sort;
    const fieldsLabel = searchCond.label ? [searchCond.label] : undefined;

    try {
      const axiosResponse = await searchApi.searchDocuments(
        q,
        start,
        undefined, // offset
        num,
        sort,
        fieldsLabel
      );
      const response = axiosResponse.data;

      // Update state with response data
      state.recordCount = response.record_count ?? -1;
      state.recordCountRelation = 'EQUAL_TO'; // Default value (not provided by API)
      state.startRecordNumber = response.start_record_number ?? 0;
      state.endRecordNumber = response.end_record_number ?? 0;
      state.execTime = response.exec_time ?? 0;
      state.relatedQueries = response.related_query ?? [];
      state.relatedContents = response.related_contents ?? [];
      state.q = response.q ?? '';
      state.queryId = response.query_id ?? '';
      // Convert string array to number array efficiently using Number constructor
      state.pageInfo.pageNumbers = (response.page_numbers ?? []).map(Number);
      state.pageInfo.currentPageNumber = response.page_number ?? 1;
      state.pageInfo.prevPage = response.prev_page ?? false;
      state.pageInfo.nextPage = response.next_page ?? false;

      // Update items array
      state.items = [];
      if (response.data) {
        response.data.forEach((item) => {
          state.items.push({
            doc_id: item.doc_id ?? '',
            content_title: item.content_title ?? '',
            url_link: item.url_link ?? '',
            content_description: item.content_description ?? '',
            content_length: parseInt(item.content_length ?? '0', 10),
            site_path: item.site_path ?? '',
            created: item.created ?? '',
            last_modified: item.last_modified ?? '',
          });
        });
      }

      return response;
    } catch (e) {
      this._handleAxiosError('Search', e, {
        query: searchCond.q,
        page: searchCond.page,
        pageSize: searchCond.pageSize,
        label: searchCond.label,
        sort: searchCond.sort,
      });
    }
  }

  /**
   * Get available labels from server
   * @returns Promise resolving to list of labels
   */
  async getLabels(): Promise<Label[]> {
    const searchApi = new SearchApi(this.configuration);
    try {
      const axiosResponse = await searchApi.listLabels();
      const response: ListLabels200Response = axiosResponse.data;
      const labels: Label[] = [];

      if (response.record_count && response.record_count > 0 && response.data) {
        response.data.forEach((label) => {
          labels.push({
            value: label.value ?? '',
            label: label.label ?? '',
          });
        });
      }

      return labels;
    } catch (e) {
      this._handleAxiosError('Get labels', e);
    }
  }

  /**
   * Get suggest words for autocomplete
   * @param keyword - Search keyword
   * @param num - Number of suggestions to return
   * @param labels - Label filters
   * @param langs - Language filters
   * @param fields - Field filters
   * @returns Promise resolving to list of suggested words
   */
  async suggest(
    keyword: string,
    num: number,
    labels: string[],
    langs: string[],
    fields: string[]
  ): Promise<string[]> {
    const suggestApi = new SuggestApi(this.configuration);

    try {
      const axiosResponse = await suggestApi.findSuggestWords(
        keyword,
        num,
        labels.length > 0 ? labels : undefined,
        fields.length > 0 ? fields : undefined,
        langs.length > 0 ? langs : undefined
      );
      const response: FindSuggestWords200Response = axiosResponse.data;
      const words: string[] = [];

      if (response.record_count && response.record_count > 0 && response.data) {
        response.data.forEach((word) => {
          if (word.text) {
            words.push(word.text);
          }
        });
      }

      return words;
    } catch (e) {
      this._handleAxiosError('Suggest', e, {
        keyword,
        num,
        labels: labels.length > 0 ? labels : undefined,
        fields: fields.length > 0 ? fields : undefined,
        langs: langs.length > 0 ? langs : undefined,
      });
    }
  }
}
