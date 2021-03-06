import { isUrl } from '../utils/utils';
import { getIntlContent } from '../utils/IntlUtils'

export const menuData = [
  {
    name: getIntlContent('SHENYU.MENU.PLUGIN.LIST'),
    icon: 'dashboard',
    path: 'plug',
    locale: 'SHENYU.MENU.PLUGIN.LIST',
    children: [
      {
        name: 'hystrix',
        path: 'hystrix',
        id: 'hystrix9',
        locale: 'SHENYU.MENU.PLUGIN.HYSTRIX'
      }
    ],
  },
  {
    name: getIntlContent('SHENYU.MENU.SYSTEM.MANAGMENT'),
    icon: 'setting',
    path: 'system',
    locale: 'SHENYU.MENU.SYSTEM.MANAGMENT',
    children: [
      {
        name: getIntlContent('SHENYU.MENU.SYSTEM.MANAGMENT.ROLE'),
        path: 'role',
        locale: 'SHENYU.MENU.SYSTEM.MANAGMENT.ROLE'
      },
      {
        name: getIntlContent('SHENYU.MENU.SYSTEM.MANAGMENT.USER'),
        path: 'manage',
        locale: 'SHENYU.MENU.SYSTEM.MANAGMENT.USER'
      },
      {
        name: getIntlContent('SHENYU.MENU.SYSTEM.MANAGMENT.RESOURCE'),
        path: 'resource',
        locale: 'SHENYU.MENU.SYSTEM.MANAGMENT.RESOURCE'
      }
    ],
  },
  {
    name: getIntlContent('SHENYU.MENU.CONFIG.MANAGMENT'),
    icon: 'setting',
    path: 'config',
    locale: 'SHENYU.MENU.CONFIG.MANAGMENT',
    children: [
      {
        name: getIntlContent('SHENYU.MENU.SYSTEM.MANAGMENT.PLUGIN'),
        path: 'plugin',
        locale: 'SHENYU.MENU.SYSTEM.MANAGMENT.PLUGIN'
      },
      {
        name: getIntlContent('SHENYU.PLUGIN.PLUGINHANDLE'),
        path: 'pluginhandle',
        locale: 'SHENYU.PLUGIN.PLUGINHANDLE'
      },
      {
        name: getIntlContent('SHENYU.MENU.SYSTEM.MANAGMENT.AUTHEN'),
        path: 'auth',
        locale: 'SHENYU.MENU.SYSTEM.MANAGMENT.AUTHEN'
      },
      {
        name: getIntlContent('SHENYU.MENU.SYSTEM.MANAGMENT.METADATA'),
        path: 'metadata',
        locale: 'SHENYU.MENU.SYSTEM.MANAGMENT.METADATA'
      },
      {
        name: getIntlContent('SHENYU.MENU.SYSTEM.MANAGMENT.DICTIONARY'),
        path: 'dict',
        locale: 'SHENYU.MENU.SYSTEM.MANAGMENT.DICTIONARY'
      }
    ],
  },
];
function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }

    return result;
  });
}

export const getMenuData = () => formatter(menuData);
