import ajax from '../ajax'
export const reqCategoryList = (data) => ajax('/manage/category/list',data)
export const reqAddCategory = (data) => ajax('/manage/category/add',data,'POST')
export const reqUpdateCategory = (data) => ajax('/manage/category/update',data,'POST')
export const reqCategoryInfo = (data) => ajax('/manage/category/info',data)