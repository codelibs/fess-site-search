# SearchApi

All URIs are relative to *http://localhost:8080/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**listLabels**](#listlabels) | **GET** /labels | List labels|
|[**searchAllDocuments**](#searchalldocuments) | **GET** /documents/all | Finds all documents by query|
|[**searchDocuments**](#searchdocuments) | **GET** /documents | Finds documents by query|

# **listLabels**
> ListLabels200Response listLabels()

Returns available labels

### Example

```typescript
import {
    SearchApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SearchApi(configuration);

const { status, data } = await apiInstance.listLabels();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ListLabels200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful operation |  -  |
|**400** | Bad request |  -  |
|**401** | Unauthorized request |  -  |
|**404** | Page not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **searchAllDocuments**
> string searchAllDocuments()

Finds all documents by search conditions

### Example

```typescript
import {
    SearchApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SearchApi(configuration);

let q: string; //Search words (optional) (default to undefined)
let num: number; //The number of returned documents as a search result (optional) (default to 20)
let sort: string; //Sorted field name (optional) (default to undefined)

const { status, data } = await apiInstance.searchAllDocuments(
    q,
    num,
    sort
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **q** | [**string**] | Search words | (optional) defaults to undefined|
| **num** | [**number**] | The number of returned documents as a search result | (optional) defaults to 20|
| **sort** | [**string**] | Sorted field name | (optional) defaults to undefined|


### Return type

**string**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/x-ndjson, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful operation |  -  |
|**400** | Bad request |  -  |
|**401** | Unauthorized request |  -  |
|**404** | Page not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **searchDocuments**
> SearchDocuments200Response searchDocuments()

Finds documents by search conditions

### Example

```typescript
import {
    SearchApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SearchApi(configuration);

let q: string; //Search words (optional) (default to undefined)
let start: number; //Start position (optional) (default to 0)
let offset: number; //Offset from a start position (optional) (default to 0)
let num: number; //The number of returned documents as a search result (optional) (default to 20)
let sort: string; //Sorted field name (optional) (default to undefined)
let fieldsLabel: Array<string>; //Filtered label name (optional) (default to undefined)
let facetField: Array<string>; //Facet field name (optional) (default to undefined)
let facetQuery: Array<string>; //Facet query (optional) (default to undefined)
let facetSize: number; //Item size in facets returned by facet.field (optional) (default to 10)
let facetMinDocCount: number; //Minumum document size in facets (optional) (default to 0)
let geoLocationPoint: string; //Latitude and Longitude for Geo search (optional) (default to undefined)
let geoLocationDistance: string; //Distance for Geo search (optional) (default to undefined)
let lang: string; //Language (optional) (default to undefined)
let preference: string; //String to specify a shard for searching (optional) (default to undefined)
let callback: string; //Callback name for using JSONP (optional) (default to undefined)

const { status, data } = await apiInstance.searchDocuments(
    q,
    start,
    offset,
    num,
    sort,
    fieldsLabel,
    facetField,
    facetQuery,
    facetSize,
    facetMinDocCount,
    geoLocationPoint,
    geoLocationDistance,
    lang,
    preference,
    callback
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **q** | [**string**] | Search words | (optional) defaults to undefined|
| **start** | [**number**] | Start position | (optional) defaults to 0|
| **offset** | [**number**] | Offset from a start position | (optional) defaults to 0|
| **num** | [**number**] | The number of returned documents as a search result | (optional) defaults to 20|
| **sort** | [**string**] | Sorted field name | (optional) defaults to undefined|
| **fieldsLabel** | **Array&lt;string&gt;** | Filtered label name | (optional) defaults to undefined|
| **facetField** | **Array&lt;string&gt;** | Facet field name | (optional) defaults to undefined|
| **facetQuery** | **Array&lt;string&gt;** | Facet query | (optional) defaults to undefined|
| **facetSize** | [**number**] | Item size in facets returned by facet.field | (optional) defaults to 10|
| **facetMinDocCount** | [**number**] | Minumum document size in facets | (optional) defaults to 0|
| **geoLocationPoint** | [**string**] | Latitude and Longitude for Geo search | (optional) defaults to undefined|
| **geoLocationDistance** | [**string**] | Distance for Geo search | (optional) defaults to undefined|
| **lang** | [**string**] | Language | (optional) defaults to undefined|
| **preference** | [**string**] | String to specify a shard for searching | (optional) defaults to undefined|
| **callback** | [**string**] | Callback name for using JSONP | (optional) defaults to undefined|


### Return type

**SearchDocuments200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful operation |  -  |
|**400** | Bad request |  -  |
|**401** | Unauthorized request |  -  |
|**404** | Page not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

