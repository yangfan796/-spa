import ajax from '../ajax'
export const reqUserList = (data) =>ajax('/manage/user/list',data)
export const reqAddUpdateUser = (data) =>ajax("/manage/user/"+(data._id?'update':'add'),data,"POST")
export const reqDeleteUser = (data) =>ajax('/manage/user/delete',data,'POST')
