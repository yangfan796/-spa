import ajax from "../ajax";
export const reqProductList = data => ajax("/manage/product/list", data);
export const reqSearchProductList = ({
  pageNum,
  pageSize,
  searchName,
  searchType
}) =>
  ajax("/manage/product/search", {
    pageNum,
    pageSize,
    [searchType]: searchName
  });
  export const reqAddGood = data => ajax("/manage/product/"+(data._id?'update':'add'), data, "POST");
  // export const reqUpdateGood = data => ajax("/manage/product/update", data, "POST");
  export const reqUpdateStatus = data => ajax("/manage/product/updateStatus", data, "POST");
  export const reqDelImg = data => ajax("/manage/img/delete", data, "POST");
