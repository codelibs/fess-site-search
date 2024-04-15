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
import Ping200ResponseData from './Ping200ResponseData';

/**
 * The Ping200Response model module.
 * @module model/Ping200Response
 * @version 14.8.0
 */
class Ping200Response {
    /**
     * Constructs a new <code>Ping200Response</code>.
     * @alias module:model/Ping200Response
     */
    constructor() { 
        
        Ping200Response.initialize(this);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj) { 
    }

    /**
     * Constructs a <code>Ping200Response</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/Ping200Response} obj Optional instance to populate.
     * @return {module:model/Ping200Response} The populated <code>Ping200Response</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new Ping200Response();

            if (data.hasOwnProperty('data')) {
                obj['data'] = Ping200ResponseData.constructFromObject(data['data']);
            }
        }
        return obj;
    }

    /**
     * Validates the JSON data with respect to <code>Ping200Response</code>.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @return {boolean} to indicate whether the JSON data is valid with respect to <code>Ping200Response</code>.
     */
    static validateJSON(data) {
        // validate the optional field `data`
        if (data['data']) { // data not null
          Ping200ResponseData.validateJSON(data['data']);
        }

        return true;
    }


}



/**
 * @member {module:model/Ping200ResponseData} data
 */
Ping200Response.prototype['data'] = undefined;






export default Ping200Response;
