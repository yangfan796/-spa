import ajax from '../ajax'
export const reqRoles = data => ajax('/manage/role/list',data)
export const reqAddRole = data => ajax('/manage/role/add',data,'POST')
export const reqUpdateRole = data => ajax('/manage/role/update',data,'POST')