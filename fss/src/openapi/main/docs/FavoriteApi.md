# FavoriteApi

All URIs are relative to *http://localhost:8080/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**listFavorites**](#listfavorites) | **GET** /favorites | List favorites|
|[**setFavorite**](#setfavorite) | **POST** /documents/{docId}/favorite | Set a favorite mark|

# **listFavorites**
> ListFavorites200Response listFavorites()

Returns favorited document IDs

### Example

```typescript
import {
    FavoriteApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FavoriteApi(configuration);

let queryId: string; //Query ID where the document is contained (default to undefined)

const { status, data } = await apiInstance.listFavorites(
    queryId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **queryId** | [**string**] | Query ID where the document is contained | defaults to undefined|


### Return type

**ListFavorites200Response**

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

# **setFavorite**
> SetFavorite201Response setFavorite()

Set a favorite mark to the document

### Example

```typescript
import {
    FavoriteApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FavoriteApi(configuration);

let docId: string; //Document ID to be favorited (default to undefined)
let queryId: string; //Query ID where the document is contained (default to undefined)

const { status, data } = await apiInstance.setFavorite(
    docId,
    queryId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **docId** | [**string**] | Document ID to be favorited | defaults to undefined|
| **queryId** | [**string**] | Query ID where the document is contained | defaults to undefined|


### Return type

**SetFavorite201Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Successful operation |  -  |
|**400** | Bad request |  -  |
|**401** | Unauthorized request |  -  |
|**404** | Page not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

