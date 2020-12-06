# Soul DashBoard

![build](https://github.com/dromara/soul-dashboard/workflows/build/badge.svg)


## Overview
Soul DashBoard is frontend of a management background for [soul](https://github.com/dromara/soul).

### ui

#### divide plugin
![index](./doc/img/index.jpg)

#### add rules
![add rules](./doc/img/add-rules.png)

#### Plugin Management
![Plugin Management](./doc/img/plugin-management.jpg)

### Soul Admin Backend
soul-admin is a standard spring boot project。click [here](https://github.com/dromara/soul/tree/master/soul-admin) for more information;




## Prerequisite
- node v8.0+

## How Build

### Configuration

modify the api url for different environment, eg: `http://192.168.1.100:8000`
![index.ejs](./doc/img/index.ejs.png)


### develop environment

```shell
# install dependencies in this project root path.
npm install
# start
npm start
```

### production environment

```shell
# install dependencies in this project root path.
npm install
# build for production
npm run build
```