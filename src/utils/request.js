import axios from 'axios';

const request = options => {
  // return axios.request({
  //   url: options.url,
  //   method: options.method,

  // })
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        roles: [
          // m1 p2
          {
            typeid: 1, // 1 maintenance 维保单位  2 property 使用单位  3 government 质检单位
            userRoleId: 1 // 1 主管理员 2 子管理员 3 普通员工
          },
          {
            typeid: 2, // 1 maintenance 维保单位  2 property 使用单位  3 government 质检单位
            userRoleId: 2 // 1 主管理员 2 子管理员 3 普通员工
          }
        ]
      });
    }, 3000);
  });
};

export default request;
