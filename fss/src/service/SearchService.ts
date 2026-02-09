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
   * Get Fess version from server
   * @returns Promise resolving to version string
   */
  async getFessVersion(): Promise<string> {
    const url = `${this.fessUrl}/json`;
    try {
      const res: AxiosResponse = await axios.get(url);
      return res.data.response.version as string;
    } catch (e) {
      throw new Error(`Failed to get Fess version: ${e}`);
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
      state.pageInfo.pageNumbers = (response.page_numbers ?? []).map((n) => parseInt(n, 10));
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
      throw new Error(`Search failed: ${e}`);
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
    } catch (error) {
      throw new Error(`Failed to get labels: ${error}`);
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
      throw new Error(`Suggest failed: ${e}`);
    }
  }
}
