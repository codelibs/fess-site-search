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

import ApiClient from '../ApiClient';

/**
 * The ListLPopularWords200Response model module.
 * @module model/ListLPopularWords200Response
 * @version 14.8.0
 */
class ListLPopularWords200Response {
    /**
     * Constructs a new <code>ListLPopularWords200Response</code>.
     * @alias module:model/ListLPopularWords200Response
     */
    constructor() { 
        
        ListLPopularWords200Response.initialize(this);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj) { 
    }

    /**
     * Constructs a <code>ListLPopularWords200Response</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/ListLPopularWords200Response} obj Optional instance to populate.
     * @return {module:model/ListLPopularWords200Response} The populated <code>ListLPopularWords200Response</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new ListLPopularWords200Response();

            if (data.hasOwnProperty('record_count')) {
                obj['record_count'] = ApiClient.convertToType(data['record_count'], 'Number');
            }
            if (data.hasOwnProperty('data')) {
                obj['data'] = ApiClient.convertToType(data['data'], ['String']);
            }
        }
        return obj;
    }

    /**
     * Validates the JSON data with respect to <code>ListLPopularWords200Response</code>.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @return {boolean} to indicate whether the JSON data is valid with respect to <code>ListLPopularWords200Response</code>.
     */
    static validateJSON(data) {
        // ensure the json data is an array
        if (!Array.isArray(data['data'])) {
            throw new Error("Expected the field `data` to be an array in the JSON data but got " + data['data']);
        }

        return true;
    }


}



/**
 * @member {Number} record_count
 */
ListLPopularWords200Response.prototype['record_count'] = undefined;

/**
 * @member {Array.<String>} data
 */
ListLPopularWords200Response.prototype['data'] = undefined;






export default ListLPopularWords200Response;

