/**
 * Fess - User API
 * This is a Fess Server based on the OpenAPI 3.0 specification.  
 *
 * The version of the OpenAPI document: 14.8.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */


import ApiClient from "../ApiClient";
import Error from '../model/Error';
import FindSuggestWords200Response from '../model/FindSuggestWords200Response';

/**
* Suggest service.
* @module api/SuggestApi
* @version 14.8.0
*/
export default class SuggestApi {

    /**
    * Constructs a new SuggestApi. 
    * @alias module:api/SuggestApi
    * @class
    * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
    * default to {@link module:ApiClient#instance} if unspecified.
    */
    constructor(apiClient) {
        this.apiClient = apiClient || ApiClient.instance;
    }



    /**
     * Finds suggest words
     * Returns words for suggest
     * @param {String} q Inputting characters for search
     * @param {Object} opts Optional parameters
     * @param {Number} [num = 10)] The number of suggest words
     * @param {Array.<String>} [label] Filtered label name
     * @param {Array.<String>} [field] Field name to generate suggest words
     * @param {Array.<String>} [lang] Target language
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/FindSuggestWords200Response} and HTTP response
     */
    findSuggestWordsWithHttpInfo(q, opts) {
      opts = opts || {};
      let postBody = null;
      // verify the required parameter 'q' is set
      if (q === undefined || q === null) {
        throw new Error("Missing the required parameter 'q' when calling findSuggestWords");
      }

      let pathParams = {
      };
      let queryParams = {
        'q': q,
        'num': opts['num'],
        'label': this.apiClient.buildCollectionParam(opts['label'], 'multi'),
        'field': this.apiClient.buildCollectionParam(opts['field'], 'multi'),
        'lang': this.apiClient.buildCollectionParam(opts['lang'], 'multi')
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = FindSuggestWords200Response;
      return this.apiClient.callApi(
        '/suggest-words', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null
      );
    }

    /**
     * Finds suggest words
     * Returns words for suggest
     * @param {String} q Inputting characters for search
     * @param {Object} opts Optional parameters
     * @param {Number} opts.num The number of suggest words (default to 10)
     * @param {Array.<String>} opts.label Filtered label name
     * @param {Array.<String>} opts.field Field name to generate suggest words
     * @param {Array.<String>} opts.lang Target language
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/FindSuggestWords200Response}
     */
    findSuggestWords(q, opts) {
      return this.findSuggestWordsWithHttpInfo(q, opts)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }


}
