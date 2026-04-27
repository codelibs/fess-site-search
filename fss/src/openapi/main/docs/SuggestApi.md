# SuggestApi

All URIs are relative to *http://localhost:8080/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**findSuggestWords**](#findsuggestwords) | **GET** /suggest-words | Finds suggest words|

# **findSuggestWords**
> FindSuggestWords200Response findSuggestWords()

Returns words for suggest

### Example

```typescript
import {
    SuggestApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SuggestApi(configuration);

let q: string; //Inputting characters for search (default to undefined)
let num: number; //The number of suggest words (optional) (default to 10)
let label: Array<string>; //Filtered label name (optional) (default to undefined)
let field: Array<string>; //Field name to generate suggest words (optional) (default to undefined)
let lang: Array<string>; //Target language (optional) (default to undefined)

const { status, data } = await apiInstance.findSuggestWords(
    q,
    num,
    label,
    field,
    lang
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **q** | [**string**] | Inputting characters for search | defaults to undefined|
| **num** | [**number**] | The number of suggest words | (optional) defaults to 10|
| **label** | **Array&lt;string&gt;** | Filtered label name | (optional) defaults to undefined|
| **field** | **Array&lt;string&gt;** | Field name to generate suggest words | (optional) defaults to undefined|
| **lang** | **Array&lt;string&gt;** | Target language | (optional) defaults to undefined|


### Return type

**FindSuggestWords200Response**

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

