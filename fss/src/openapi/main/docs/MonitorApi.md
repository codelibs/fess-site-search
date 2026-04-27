# MonitorApi

All URIs are relative to *http://localhost:8080/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**ping**](#ping) | **GET** /health | Check a server status|

# **ping**
> Ping200Response ping()

Returns status

### Example

```typescript
import {
    MonitorApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MonitorApi(configuration);

const { status, data } = await apiInstance.ping();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Ping200Response**

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
|**503** | Service unavailable |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

