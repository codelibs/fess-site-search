# SearchDocuments200Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**q** | **string** |  | [optional] [default to undefined]
**query_id** | **string** |  | [optional] [default to undefined]
**exec_time** | **number** |  | [optional] [default to undefined]
**query_time** | **number** |  | [optional] [default to undefined]
**page_size** | **number** |  | [optional] [default to undefined]
**page_number** | **number** |  | [optional] [default to undefined]
**record_count** | **number** |  | [optional] [default to undefined]
**page_count** | **number** |  | [optional] [default to undefined]
**highlight_params** | **string** |  | [optional] [default to undefined]
**next_page** | **boolean** |  | [optional] [default to undefined]
**prev_page** | **boolean** |  | [optional] [default to undefined]
**start_record_number** | **number** |  | [optional] [default to undefined]
**end_record_number** | **number** |  | [optional] [default to undefined]
**page_numbers** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**partial** | **boolean** |  | [optional] [default to undefined]
**search_query** | **string** |  | [optional] [default to undefined]
**requested_time** | **number** |  | [optional] [default to undefined]
**related_query** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**related_contents** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**data** | [**Array&lt;SearchDocuments200ResponseDataInner&gt;**](SearchDocuments200ResponseDataInner.md) |  | [optional] [default to undefined]

## Example

```typescript
import { SearchDocuments200Response } from './api';

const instance: SearchDocuments200Response = {
    q,
    query_id,
    exec_time,
    query_time,
    page_size,
    page_number,
    record_count,
    page_count,
    highlight_params,
    next_page,
    prev_page,
    start_record_number,
    end_record_number,
    page_numbers,
    partial,
    search_query,
    requested_time,
    related_query,
    related_contents,
    data,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
