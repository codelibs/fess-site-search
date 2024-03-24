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
 * The FindSuggestWords200ResponseDataInner model module.
 * @module model/FindSuggestWords200ResponseDataInner
 * @version 14.8.0
 */
class FindSuggestWords200ResponseDataInner {
    /**
     * Constructs a new <code>FindSuggestWords200ResponseDataInner</code>.
     * @alias module:model/FindSuggestWords200ResponseDataInner
     */
    constructor() { 
        
        FindSuggestWords200ResponseDataInner.initialize(this);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj) { 
    }

    /**
     * Constructs a <code>FindSuggestWords200ResponseDataInner</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/FindSuggestWords200ResponseDataInner} obj Optional instance to populate.
     * @return {module:model/FindSuggestWords200ResponseDataInner} The populated <code>FindSuggestWords200ResponseDataInner</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new FindSuggestWords200ResponseDataInner();

            if (data.hasOwnProperty('text')) {
                obj['text'] = ApiClient.convertToType(data['text'], 'String');
            }
            if (data.hasOwnProperty('labels')) {
                obj['labels'] = ApiClient.convertToType(data['labels'], ['String']);
            }
        }
        return obj;
    }

    /**
     * Validates the JSON data with respect to <code>FindSuggestWords200ResponseDataInner</code>.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @return {boolean} to indicate whether the JSON data is valid with respect to <code>FindSuggestWords200ResponseDataInner</code>.
     */
    static validateJSON(data) {
        // ensure the json data is a string
        if (data['text'] && !(typeof data['text'] === 'string' || data['text'] instanceof String)) {
            throw new Error("Expected the field `text` to be a primitive type in the JSON string but got " + data['text']);
        }
        // ensure the json data is an array
        if (!Array.isArray(data['labels'])) {
            throw new Error("Expected the field `labels` to be an array in the JSON data but got " + data['labels']);
        }

        return true;
    }


}



/**
 * @member {String} text
 */
FindSuggestWords200ResponseDataInner.prototype['text'] = undefined;

/**
 * @member {Array.<String>} labels
 */
FindSuggestWords200ResponseDataInner.prototype['labels'] = undefined;






export default FindSuggestWords200ResponseDataInner;

