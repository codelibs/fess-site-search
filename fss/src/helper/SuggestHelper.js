import axios from "axios";

export default function () {
  const adjustBox = (suggestState, targetElement) => {
    console.log(targetElement);
    if (targetElement === null) {
      return;
    }
    suggestState.left = _suggestFormLeft(targetElement);
    suggestState.top = _suggestFormTop(targetElement);
    suggestState.width = _suggestFormWidth(targetElement);
  };

  //TODO client rectはカーソル位置とか考慮する必要があるというか要検討
  const _suggestFormLeft = (targetElement) => {
    const rect = targetElement.getBoundingClientRect();
    console.log("clientLeft:" + rect.left);
    return rect.left + 'px';
  };

  const _suggestFormTop = (targetElement) => {
    const rect = targetElement.getBoundingClientRect();
    console.log("clientTop:" + rect.top);
    console.log("clientHeight:" + rect.height);
    return (rect.top + rect.height) + 'px';
  };

  const _suggestFormWidth = (targetElement) => {
    const rect = targetElement.getBoundingClientRect();
    console.log("clientWidth:" + rect.width);
    return rect.width + 'px';
  };

  const doSuggest = async (
    apiUrl,
    keyword,
    num,
    label) => {
    const response = await axios.get(apiUrl, {
      params: {
        query: keyword,
        fields: "_default,content,title",
        num: num,
        label: label
      }
    });

    const resultList = [];
    response.data.response.result.hits.forEach((hit) => {
      resultList.push(hit.text);
    });

    return resultList;
  };

  return {
    adjustBox,
    doSuggest
  };
}