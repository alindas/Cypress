# 前端自动化测试：Cypress 篇

## 简介

`Cypress` 是基于 `JavaScript` 的下一代前端测试工具。能对浏览器中运行的任何内容进行快速、简单和可靠的测试，并且覆盖了测试金字塔的所有测试类型。

`Cypress` 具有 **All In One** 特性，集成了测试运行器（Test Runner），单元测试框架（Mocha），断言库。此外，`Cypress` 具有八大特性：

+ 时间穿梭

  测试运行时会自动拍摄快照，在测试结束后能在命令日志中查看运行时情况动图。

+ 实时重新加载

+ Spies、Stubs 和 Clock

  `Cypress` 允许用户验证并控制函数行为，Mock 服务器响应或者更改系统时间（单测狂喜）

+ 运行结果一致性

  `Cypress` 架构不基于 `Selenium` 和 `WebDriver`，在运行速度、可靠性和测试结果一致性上都有良好保障。

+ 可调试性

  基于自带的 pause、debug 调试 API 能直接像业务开发一样进行错误排查。

+ 自动等待

  `Cypress` 能自动等待元素的可操作状态才执行命令或断言，无需手动 `await` 或 `sleep`

+ 网络流量控制

  使用 Mock 服务器模拟实际接口结果。

+ 截图和视频

  `Cypress` 在测试运行失败时自动截图

此外，`Cypress` 也存在一些局限性。

+ 目前支持的浏览器类型只包括 `Chrome`，`Firefox`，`Microsoft Edge` 和 `Electron`

+ **不支持移动端应用测试**



## 初体验

### 安装

```shell
// npm 安装
npm install cypress --save-dev

// yarn 安装
yarn add cypress --dev
```

### 运行

``` shell
// 进入到安装目录下
yarn run cypress open
```

运行后，通过 cypress 的 GUI 图形操作面板，便能看到当前的所有测试用例文件。

### 演示

```shell
// 克隆官网演示项目
git clone https://github.com/cypress-io/cypress-example-recipes.git
npm install
// 在这里以登录表单为例
// cypress-example-recipes 测试项目放在 example 文件夹下
cd .\example\
cd .\logging-in__html-web-form\
// 运行后本地访问 localhost: [port: 终端显示] 查看对应的登录演示页面
yarn start
```

### 测试

cypress 的测试项目放在 `integration` 下，新建 `cypress-example-recipes` 目录，在此目录下添加登录页面的测试用例。

```js
// loginInWebForm.spec.js
describe('登录', () => {
  // 此用户名和密码为例子默认正确访问
  const userName = 'jane.lane';
  const password = 'password123';
  context('loginInWebForm 登录测试', () => {
    it('期待登录成功', () => {
      cy.visit('http://localhost:7077/login');
      cy.get('input[name=username').type(userName);
      cy.get('input[name=password]').type(password);
      cy.get('form').submit();
      // 登录成功则跳转至 dashboard 页面，并且显示当前登录用户
      cy.url().should('include', '/dashboard');
      cy.get('h1').should('contain', 'jane.lane');
    })
  })
})
```

保存后返回 cypress 的 GUI 图形操作面板，点击新添加的 `loginInWebForm.spec.js` 测试文件，便能看到对应的测试运行效果。



## 核心

### 文件结构

#### fixtures

用来储存测试用例的外部数据，通常为某个网络请求对应的响应数据。目录位置默认为 `fixtures`，也可以通过配置文件自定义。

#### integration

用来储存测试用例。在该目录下所有后缀为 `.js` ，`.jsx` ，`.coffee` ，`.cjsx` 的文件都默认视为测试文件。

#### plugins

尽管 `cypress` 目前存在不足之处，但可以使用插件对其功能局限性进行填补。位于该目录下的 `index.js` 文件储存配置的插件，其在每个测试运行前都会自动加载。

#### support

支持文件目录是放置可重用配置例如底层通用函数或全局默认配置的地方。同样的，位于该目录下的 `index.js` 文件储存配置的支持内容，其在每个测试运行前都会自动加载。

```js
// 在 beforeEach 钩子里添加自定义支持内容
beforeEach(() => {
	cy.log(`当前环境变量：${JSON.stringify(Cypress.env())}`)
})
```

### 配置文件

`cypress.json` 用于自定义 Cypress 的各项配置。

```json
// cypress.json
{
    // 前缀 URL，使用 cy.visit 或 cy.request 时应用
    "baseUrl": null,
    "env": {},
    "ignoreTestFiles": "*.hot-update.js",
    // 保留在内存中的测试用例数量（主要为快照和命令数据）条数
    "numTestsKeptInMemory": 50,
    // Cypress 占用的端口号，默认随机生成
    "port": null,
    "reporter": "sepc",
    "reporterOptions": null,
    "restFiles": "**/*.*",
    // 是否开启自动检测文件变化而重新运行受到影响的测试用例
    "watchForFileChanges": true,
    // 以下超时时间单位都是 ms
    // 命令默认
    "defaultCommandTimeout": 4000,
    // 在 cy.exec 期间，等待系统命令完成执行
    "execTimeout": 60000,
    // 在 cy.task 期间，等待任务完成
    "taskTimeout": 60000,
    // 使用 cy.visit | cy.go | cy.reload 触发页面加载，等待页面加载
    "pageLoadTimeoutpage": 60000,
    // 等待 cy.wait 命令中的 XHR 请求
    "requestTimeout": 5000,
    // cy.request | cy.wait | cy.fixture | cy.getCookie | cy.getCookies
    // cy.setCookie | cy.clearCookie | cy.clearCookies | cy.screenShot 的超时时间
    "responseTimeout": 30000,
    // 项目根目录
    "fileSeverFolder": "/",
    "fixturesFolder": "cypress/fixtures",
    "integrationFolder": "cypress/integration",
    "pluginsFile": "cypress/plugins/index.js",
    "supportFile": "cypress/support/index.js",
    // 运行期间的视频保存位置
    "videosFolder": "cypress/videos",
    // 失败测试的截图
    "screenshotsFolder": "cypress/screenshots",
    // 被测应用程序视图默认宽高
    "viewportHeight": 660,
    "viewportWidth": 1000
}
```

当在测试用例中需要用到配置项时，使用 `Cypress.config()` 进行获取。

```js
// 获取所有配置信息
Cypress.config();
// 获取指定配置项
Cypress.config(name);
// 更改单个指定配置项
Cypress.config(name, value);
// 更改多个个指定配置项
Cypress.config(object: {name, value});
```

 ### 重试机制

前面提到，`cypress` 具有自动等待的特性。这主要得益于 `cypress` 的重试机制。`cypress` 在查询获取某个 DOM 元素（get 命令）的后续断言失败，则 cypress 会重新进行 get 获取操作，直到断言成功或者 `cy.get` 命令**超时为止**。

在进行多重断言时（单个命令后跟多个断言），进行每个断言都会对前面的断言进行重复操作。

事实上，cypress 并不会重试所有命令，如果命令是可能改变被测应用程序状态的，则这些命令将不会被重试。cypress 重试的命令有：`cy.get` `find` `contains` 等。[所有会重试的特定命令](https://docs.cypress.io/guides/references/assertions)

### 测试报告

cypress 提供 `spec` , `json` , `junit` 和自定义测试报告。

```shell
// 需要生成 spec | json | junit 格式的测试报告，只需要在运行 cypress 服务时，命令后面接上对应的报告格式
yarn run cypress open --reporter=spec
```

### 组织和编写

一条可执行的测试套件，由两个必要部分组成。

1. **describe**

   测试套件。用于包括多个测试用例，也可以在里面嵌套 `context` (describe 的别名)。

2. **it**

   用于描述测试用例。

在测试套件里可以使用钩子函数设置测试的**先决条件**，cypress 提供四个钩子函数：

+ before 所有测试用例执行前运行
+ after 所有测试用例执行前运行
+ beforeEach 每个测试用例执行前运行
+ afterEach 每个测试用例执行后运行

如果希望在测试套件中排除或指定运行某个测试用例，则可以分别使用 `skip` 和 `only` 进行设置。在对应的`describe` 或 `it` 后面加上该关键字即可生效。

> 在同一个测试套件下同时使用多个 only，则最后一个 only 会生效。
>
> 在测试用例中使用 this.skip() , 则后面的语句不会被执行。

#### 动态决策

```js
it('动态忽略', () => {
	if(Cypress.env('runFlag') === 1) {
		/** code */
	}
	else {
		/** otherCode */
	}
})

// shell，设置 runFlag = 0
yarn run cypress open -env runFlag = 0
```

在实际项目测试中，有时候多条测试之间只是个别变量不相同，此时便可以根据数据动态生成测试用例。

```js
// 以前面表单登录演示为例，需要测试账密匹配和不匹配两个变量下的登录结果
const LoginUser = [
    {
        summary: 'login pass',
        username: 'jane.lane',
        password: 'passowrd123'
    },
    {
    	summary: 'login fail',
    	username: 'test',
    	password: 'test'
    }
];

describe('动态生成测试', () => {
	for(const user of LoginUser) {
		it(user.summary, () => {
			/** test code */
		})
	}
})
```



### 断言

cypress 的断言基于 [`Chai` 断言库](https://www.chaijs.com/api/assert/)，并且增加了对 `Sinon-Chai` 和 `Chai-jQuery` 断言库的支持。

+ 隐式断言

  `should` 或者 `and`

+ 显示断言

  `expect`

常用断言：

```
should('have.length', 3);
should('not.have.class', 'disabled');
should('have.value', 'iTesting');
// 针对文本内容
should('not.contain', 'click me');
should('be.visible');
should('not.exist');
// 针对元素状态
should('be.checked');
// 针对 css 断言
should('have.css', 'color', 'background-color');
// 针对回调, 接受一个函数，其返回断言的内容
should(() => {
	expect()
})
```

BDD 式断言：

```
// 语法
expect(target).to.*
// 常例
not
deep
nested
ordered
any
all
indclude
ok
true
false
null
undefined
exist
empty
```

TDD 式断言：

```
// 语法
assert.*
// 常例
.isOk(obj, [message])
.isNotOk(obj, [message])
.equal(actual, expected, [message])
.notEqual(actual, expected, [message])
.strictEqual(actual, expected, [message])
.notStrictEqual(actual, expected, [message])
.deepEqual(actual, expected, [message])
.isTrue(value, [message])
```



### 元素交互

#### 选择器

cypress 查找元素的选择器有以下几种：

+ 专有选择器

  `data-cy` 	`data-test`	 `data-testid`

+ 常规选择器

  `#id` 	`.class` 	`attribues`	 `:nth-child(n)`	 `Cypress.$()`

#### 查找方法

+ find(selector)

  查找被定位元素的后代

+ get(selector)

  查找对应的元素

+ contains(selector)

  获取包含文本的元素

#### 辅助方法

+ children(selector)

  查找定位元素的所有后代

+ parents(selector)

  查找定位元素的所有父元素

+ parent(selector)

  查找定位元素的上一级父元素

+ siblings(sel)

  定位元素的所有同级元素

+ first()

  匹配给定 DOM 对象的第一个元素

+ last()

  匹配给定 DOM 对象的最后一个元素

+ next()

  匹配给定 DOM 对象的下一个同级元素

+ nextAll()

  匹配给定 DOM 对象之后的所有同级元素

+ nextUtil(sel，[filter])

  匹配给定 DOM 对象之后的所有同级元素直到遇到 sel 匹配的元素为止

+ prev()

  匹配给定 DOM 对象的上一个同级元素

+ prevAll()

  匹配给定 DOM 对象前面的所有同级元素

+ prevUtil(sel，[filter])

  匹配给定 DOM 对象前面的所有同级元素直到遇到 sel 匹配的元素为止

+ each()

+ eq()

  获取数组元素集对应位置的元素

#### 操作命令

+ .click()
+ .dbclick()
+ .rightclick()
+ .type()
+ .clear()
+ .check()
+ .uncheck()
+ .select()
+ .trigger()

### 注意项

1. Cypress 命令是异步的

   ```js
   // Cypress 在调用时不会马上执行，而是会把所有命令排队，然后再执行
   const Ids = cy.get('#id');
   Ids.click(); // 失败，Ids 为 undefined

   // Cypress 虽然是异步的，但不同于 Promise，Cypress 不支持使用 async 和 await
   ```

### 特异性

1. 闭包

   cypress 能使用 `then` 对上一个命令的值或引用进行保存。

   ```js
   cy.get("btn").then(btn => {
   	const txt = btn.text();
   	// 假设比较表单会更改 btn 的文本
   	cy.get("form").submit();
   	cy.get("btn").then(_btn => {
   		expect(_btn.text()).not.to.eq(txt);
   	})
   })
   ```



2. 变量和别名

   使用 wrap 储存变量。

   使用 as 分配别名。

3. 引用外部资源 fixture

   如果测试中需要访问外部文件的变量，可以通过 `fixture` 进行引用

   ```js
   // filePath 为默认外部路径下的文件，encoding 为支持的编码格式，支持 ASCII，Unicode，UTF-8 和 // // Base64
   cy.fixture(filePath, [encoding], [options])

   cy.fixture('users.json').as('userData');
   cy.get('@userData').then(() => {
       // code
   })
   ```

## 进阶

### 最佳实践

#### 设置全局 URL

`Cypress` 为了绕过同源策略，刚开始运行测试时，会在 local host 上打开一个随机端口进行初始化，直到遇到第一个 `cy.visit` 命令才进行匹配引用程序的 URL。手动设置 `baseUrl` 可以节省 cypress 匹配被测应用程序 url 的时间，还能作为前缀直接忽略掉后面的路径。

#### 自定义截图

在以 cypress run 的方式运行测试时，如果测试发生错误，则 Cypress 会自动截图并保存在 `cypress/screenshots` 文件夹下。另外，也可以手动指定截图的时机。

```js
// 语法
.screenshot([fileName, options])
// 直接截图
cy.screenshot();
// 只截图某个元素
cy.get('#login').screenshot();
```

```js
// options 配置项
{
    // 在命令日志中显示
    Log: true,
    blackout: [],
    // 此参数仅跟在 cy. 后面使用时生效, 失败时的截屏默认为 runner
    capture: 'fullPage' | 'viewport' | 'runner',
    // 最终屏幕截图图像的位置和尺寸，格式：{x: 0, y: 0, width: 100, height: 100}
    clip: null,
    disableTimersAndAnimations: true,
    padding: null,
    // 是否缩放应用程序以适应浏览器窗口，当 capture 为 runner 时，强制为 true
    scale: false,
    timeout: responseTimeout,
    // 非失败测试截图前的回调函数
    onBeforeScreenshot: null,
    // 非失败测试截图后的回调函数
    onAfterScreenshot: null,
}
```

#### 自定义命令（封装函数）

使用 `custom commands` 可以创建自定义命令和替换现有命令。其默认储存在  cypress/support/command.js 文件中，在任何测试文件被导入前加载。

```js
// 语法格式
// name 自定义命令的名称
// options 可选参数——prevSubject：true | false | optional，默认值为 false
// callback 自定义命令的回调函数
Cypress.Commands.add(name, [options], callback)
Cypress.Commands.overwrite(name, callback) // 对 Cypress 的内置命令进行重写，eg: visit, get

// commands.js
Cypress.Commands.add('login', (username, password) => {
    cy.get('input[name=username]').type(username);
    cy.get('input[name=password]').type(password);
})

// login.spec.js
cy.login(username, password);

// 重写 visit 命令
Cypress.Commands.overwrite('visit', (origin, url) => {
    console.log('新添加项');
    return origin(url);
})
```

#### 动态指定环境变量

```js
// cypress.json
"targetEnv": "dev",
"env": {
    "dev": {
		"username": 'jane.lane',
		"password": 'password123',
		"url": "http://localhost: 7077"
    },
    "testDev": {
        "username": 'testName',
		"password": 'testPawd',
		"url": "http://testhost: 7077"
    }
}

// support>index.js
beforeEach(() => {
	// 接受用户参数 userEnv, 如果没有指定则使用 targetEnv
    const targetEnv = Cypress.env('userEnv') || Cypress.env('targetEnv');
    // 根据 env 重写 url
    Cypress.config('baseUrl', Cypress.env(targetEnv).url);
})

// shell
yarn cypress open --env userEnv=testDev
```

#### 运行失败自动重试

由于各种不可抗力，偶尔会发生测试用例失败的情况，此时可以设置测试用例自动重试。

```
// 安装 cypress-plugin-retires 插件
yarn add cypress-plugin-retires --dev

// cypress>support>index.js 下增加如下代码
require('cypress-plugin-retires');

// pageage.json 添加添加快捷命令
"script": {
	"retryCases": "CYPRESS_RETRIES=2 cypress run"
}
```

### 接口测试

Cypress 发起 HTTP 请求需要用到 `cy.request()`

```js
// url 为访问的接口地址，如果配置了 baseUrl 则可以总结编写后面部分
// method 有 GET POST PUT DELETE 四种

cy.request([method], url, [body]);
cy.request(options)

// options 可选项用来改变 cy.request 的默认行为
{
	log: true,
	url: null,
	method: GET,
	// 添加鉴权标头
	auth: null,
	body: null,
	// 返回的不是 2XX 或 3XX 时，是否直接返回失败
	failOnStatusCode: true,
	// 是否自动重定向
	followRedirect: true,
	// 是否将 body 的值转换为 url encoded 并设置 x-www-form-urlencoded 标头
	form: false,
	// 是否接受 gzip 编码
	gzip: true,
	// 要发送的额外请求头
	headers: null,
	// 把查询参数追加到 url 后面
	qs: null,
	// status 引发的失败是否自动重试，开启后默认重试 4 次
	retryOnStatusCodeFailture: false,
	// 网络问题引发的失败是否自动重试，开启后默认重试 4 次
	retryOnNetworkFailture: null,
	timeout: responseTimeout
}
```

 `cy.request` 常与 `as` 搭配使用，用来进行接口返回值的断言。

```js
cy.request('https:// www.baidu.com').as('baidu');
cy.get('@baidu').should(res => {
	expect(res.body).to.have.length(500);
	expect(res).to.have.property('headers');
	expect(res).to.have.property('duration');
})
```

### Mock Server

#### json-server

以 `json-server` 为例，快速搭建一套 `REST API` 格式的 Mock Server.

```
// 安装
npm install json-server -g
// 创建目录
mkdir mockServer
// 在根目录下创建 db.json 文件
{
	"users": [{
		"id": 1,
		"name": "lili",
		"gender": "girl"
	}],
	"books": [{
        "id": 1,
        "name": "前端自动化测试"
	}]
}
// 在根目录下启动 json server
json-server --watch db.json

// 启动成功后，访问对应的地址便是对应的资源
http://localhost:3000/users
http://localhost:3000/books
```

#### server&router

Cypress 也可以通过自带命令 `cy.server` 和 `cy.router` 模拟接口请求的各种返回及路由跳转。

```
// 用于启动服务器，响应路由到 cy.route 和 cy.request
cy.server([options])

// options
{
    // 设置 stubbed 返回的延迟时间
	Delay: 0,
	headers: null,
	method: 'GET',
	// 当一个 XHR 被终止时调用
	onAbort: undefined,
	// 设定请求被发送时的回调函数
	onRequest: undefined,
	// 设定服务器返回时的回调函数
	onResponse: undefined,
	// 设定 stubbed 路由的返回 body
	response: null,
	// 设定 stubbed 路由的返回状态码
	status: 200
}
```

`cy.serve` 通常与 `cy.route` 搭配使用，`cy.route` 用来管理整个控制网络，其 url 参数遵循 [minimatch](https://github.com/isaacs/minimatch) 模式

```
// cy.route 语法
cy.route([method], url, [response])
cy.route(callbackFn)
cy.route(options)

// url 代表要请求的地址，遵循 minimatch 模式
cy.route('**.users.*')
// 将匹配
http://host1/users/1
http://host2/users/2

cy.route('**.users.**')
// 将匹配
http://host1/users/edit/1
http://host2/users/edit/2
```

截获接口返回值

```js
// 截获所有包括 /users 的请求返回值，如果未传递 responese，则使用真实的服务器返回
cy.server();
cy.route('**/users/').as('getUsers');
cy.visit('/users');
cy.wait('@getUsers').then(xhr => {
	expect(xhr.status).to.eq(200);
})

// 更改接口返回值
describe('测试 Cypress 自带 Mock', () => {
	it('正常登录，Mock 报 503', () => {
		cy.serve();
		cy.route({
			method: 'POST',
			url: '/login',
			status: 503,
			responese: {
				success: false,
				data: 'Not Success'
			}
		}).as('login');
		cy.visit('/login');
		cy.get('@login').then(res => {
			expect(res.status).to.eq(503);
			expect(res.responseBody.data).to.equal('Not Success');
		})
	})
})
```

## 高级





## 参考资料

[前端自动化测试——Cypress 从入门到精通](https://book.douban.com/subject/35048017/)

[Cypress 官方文档](https://docs.cypress.io/guides/overview/why-cypress)





























