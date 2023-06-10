export function hasPermission(permission) {
  permission = permission.trim()
  let userData = JSON.parse(localStorage.getItem('userData'))
  let userPermissions = userData.permissionList
  return userPermissions.indexOf(permission) > -1
}
