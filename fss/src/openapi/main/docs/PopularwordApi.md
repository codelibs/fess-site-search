# PopularwordApi

All URIs are relative to *http://localhost:8080/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**listPopularWords**](#listpopularwords) | **GET** /popular-words | List popular words|

# **listPopularWords**
> ListPopularWords200Response listPopularWords()

Returns available labels

### Example

```typescript
import {
    PopularwordApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PopularwordApi(configuration);

let seed: string; //Random seed to return popular words (optional) (default to undefined)
let label: Array<string>; //Filtered label name (optional) (default to undefined)
let field: Array<string>; //Field name to generate suggest words (optional) (default to undefined)

const { status, data } = await apiInstance.listPopularWords(
    seed,
    label,
    field
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **seed** | [**string**] | Random seed to return popular words | (optional) defaults to undefined|
| **label** | **Array&lt;string&gt;** | Filtered label name | (optional) defaults to undefined|
| **field** | **Array&lt;string&gt;** | Field name to generate suggest words | (optional) defaults to undefined|


### Return type

**ListPopularWords200Response**

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

