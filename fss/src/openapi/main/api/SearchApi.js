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
import ListLabels200Response from '../model/ListLabels200Response';
import SearchDocuments200Response from '../model/SearchDocuments200Response';

/**
* Search service.
* @module api/SearchApi
* @version 14.8.0
*/
export default class SearchApi {

    /**
    * Constructs a new SearchApi. 
    * @alias module:api/SearchApi
    * @class
    * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
    * default to {@link module:ApiClient#instance} if unspecified.
    */
    constructor(apiClient) {
        this.apiClient = apiClient || ApiClient.instance;
    }



    /**
     * List labels
     * Returns available labels
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/ListLabels200Response} and HTTP response
     */
    listLabelsWithHttpInfo() {
      let postBody = null;

      let pathParams = {
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = ListLabels200Response;
      return this.apiClient.callApi(
        '/labels', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null
      );
    }

    /**
     * List labels
     * Returns available labels
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/ListLabels200Response}
     */
    listLabels() {
      return this.listLabelsWithHttpInfo()
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }


    /**
     * Finds all documents by query
     * Finds all documents by search conditions
     * @param {Object} opts Optional parameters
     * @param {String} [q] Search words
     * @param {Number} [num = 20)] The number of returned documents as a search result
     * @param {String} [sort] Sorted field name
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link String} and HTTP response
     */
    searchAllDocumentsWithHttpInfo(opts) {
      opts = opts || {};
      let postBody = null;

      let pathParams = {
      };
      let queryParams = {
        'q': opts['q'],
        'num': opts['num'],
        'sort': opts['sort']
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/x-ndjson', 'application/json'];
      let returnType = 'String';
      return this.apiClient.callApi(
        '/documents/all', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null
      );
    }

    /**
     * Finds all documents by query
     * Finds all documents by search conditions
     * @param {Object} opts Optional parameters
     * @param {String} opts.q Search words
     * @param {Number} opts.num The number of returned documents as a search result (default to 20)
     * @param {String} opts.sort Sorted field name
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link String}
     */
    searchAllDocuments(opts) {
      return this.searchAllDocumentsWithHttpInfo(opts)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }


    /**
     * Finds documents by query
     * Finds documents by search conditions
     * @param {Object} opts Optional parameters
     * @param {String} [q] Search words
     * @param {Number} [start = 0)] Start position
     * @param {Number} [offset = 0)] Offset from a start position
     * @param {Number} [num = 20)] The number of returned documents as a search result
     * @param {String} [sort] Sorted field name
     * @param {Array.<String>} [fieldsLabel] Filtered label name
     * @param {Array.<String>} [facetField] Facet field name
     * @param {Array.<String>} [facetQuery] Facet query
     * @param {Number} [facetSize = 10)] Item size in facets returned by facet.field
     * @param {Number} [facetMinDocCount = 0)] Minumum document size in facets
     * @param {String} [geoLocationPoint] Latitude and Longitude for Geo search
     * @param {String} [geoLocationDistance] Distance for Geo search
     * @param {String} [lang] Language
     * @param {String} [preference] String to specify a shard for searching
     * @param {String} [callback] Callback name for using JSONP
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/SearchDocuments200Response} and HTTP response
     */
    searchDocumentsWithHttpInfo(opts) {
      opts = opts || {};
      let postBody = null;

      let pathParams = {
      };
      let queryParams = {
        'q': opts['q'],
        'start': opts['start'],
        'offset': opts['offset'],
        'num': opts['num'],
        'sort': opts['sort'],
        'fields.label': this.apiClient.buildCollectionParam(opts['fieldsLabel'], 'multi'),
        'facet.field': this.apiClient.buildCollectionParam(opts['facetField'], 'multi'),
        'facet.query': this.apiClient.buildCollectionParam(opts['facetQuery'], 'multi'),
        'facet.size': opts['facetSize'],
        'facet.minDocCount': opts['facetMinDocCount'],
        'geo.location.point': opts['geoLocationPoint'],
        'geo.location.distance': opts['geoLocationDistance'],
        'lang': opts['lang'],
        'preference': opts['preference'],
        'callback': opts['callback']
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = SearchDocuments200Response;
      return this.apiClient.callApi(
        '/documents', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null
      );
    }

    /**
     * Finds documents by query
     * Finds documents by search conditions
     * @param {Object} opts Optional parameters
     * @param {String} opts.q Search words
     * @param {Number} opts.start Start position (default to 0)
     * @param {Number} opts.offset Offset from a start position (default to 0)
     * @param {Number} opts.num The number of returned documents as a search result (default to 20)
     * @param {String} opts.sort Sorted field name
     * @param {Array.<String>} opts.fieldsLabel Filtered label name
     * @param {Array.<String>} opts.facetField Facet field name
     * @param {Array.<String>} opts.facetQuery Facet query
     * @param {Number} opts.facetSize Item size in facets returned by facet.field (default to 10)
     * @param {Number} opts.facetMinDocCount Minumum document size in facets (default to 0)
     * @param {String} opts.geoLocationPoint Latitude and Longitude for Geo search
     * @param {String} opts.geoLocationDistance Distance for Geo search
     * @param {String} opts.lang Language
     * @param {String} opts.preference String to specify a shard for searching
     * @param {String} opts.callback Callback name for using JSONP
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/SearchDocuments200Response}
     */
    searchDocuments(opts) {
      return this.searchDocumentsWithHttpInfo(opts)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }


}
