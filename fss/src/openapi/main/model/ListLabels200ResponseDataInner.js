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
 * The ListLabels200ResponseDataInner model module.
 * @module model/ListLabels200ResponseDataInner
 * @version 14.8.0
 */
class ListLabels200ResponseDataInner {
    /**
     * Constructs a new <code>ListLabels200ResponseDataInner</code>.
     * @alias module:model/ListLabels200ResponseDataInner
     */
    constructor() { 
        
        ListLabels200ResponseDataInner.initialize(this);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj) { 
    }

    /**
     * Constructs a <code>ListLabels200ResponseDataInner</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/ListLabels200ResponseDataInner} obj Optional instance to populate.
     * @return {module:model/ListLabels200ResponseDataInner} The populated <code>ListLabels200ResponseDataInner</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new ListLabels200ResponseDataInner();

            if (data.hasOwnProperty('label')) {
                obj['label'] = ApiClient.convertToType(data['label'], 'String');
            }
            if (data.hasOwnProperty('value')) {
                obj['value'] = ApiClient.convertToType(data['value'], 'String');
            }
        }
        return obj;
    }

    /**
     * Validates the JSON data with respect to <code>ListLabels200ResponseDataInner</code>.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @return {boolean} to indicate whether the JSON data is valid with respect to <code>ListLabels200ResponseDataInner</code>.
     */
    static validateJSON(data) {
        // ensure the json data is a string
        if (data['label'] && !(typeof data['label'] === 'string' || data['label'] instanceof String)) {
            throw new Error("Expected the field `label` to be a primitive type in the JSON string but got " + data['label']);
        }
        // ensure the json data is a string
        if (data['value'] && !(typeof data['value'] === 'string' || data['value'] instanceof String)) {
            throw new Error("Expected the field `value` to be a primitive type in the JSON string but got " + data['value']);
        }

        return true;
    }


}



/**
 * @member {String} label
 */
ListLabels200ResponseDataInner.prototype['label'] = undefined;

/**
 * @member {String} value
 */
ListLabels200ResponseDataInner.prototype['value'] = undefined;






export default ListLabels200ResponseDataInner;

