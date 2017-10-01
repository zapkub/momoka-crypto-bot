# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="2.6.0"></a>
# [2.6.0](https://github.com/zapkub/momoka-crypto-bot/compare/v2.5.0...v2.6.0) (2017-10-01)


### Bug Fixes

* **changelog:** fix stylesheet not working ([e1aab6a](https://github.com/zapkub/momoka-crypto-bot/commit/e1aab6a))
* **notification:** fix notification should not be added if it already exist ([70b7bf9](https://github.com/zapkub/momoka-crypto-bot/commit/70b7bf9)), closes [#3](https://github.com/zapkub/momoka-crypto-bot/issues/3)
* **notification:** remove ref id from price strategy notification ([f2523a1](https://github.com/zapkub/momoka-crypto-bot/commit/f2523a1))


### Features

* **facebook:** add facebook handshake verify token ([762e6e5](https://github.com/zapkub/momoka-crypto-bot/commit/762e6e5))
* **facebook:** add facebook handshake verify token ([cd88dfa](https://github.com/zapkub/momoka-crypto-bot/commit/cd88dfa))
* **facebook:** add momoka chatbot to facebook messager api ([5f8a2c8](https://github.com/zapkub/momoka-crypto-bot/commit/5f8a2c8))
* **facebook:** add momoka chatbot to facebook messager api ([923fdc5](https://github.com/zapkub/momoka-crypto-bot/commit/923fdc5))
* **notification:** add link to dissmiss notification ([7086df6](https://github.com/zapkub/momoka-crypto-bot/commit/7086df6))



<a name="2.5.0"></a>
# [2.5.0](https://github.com/zapkub/momoka-crypto-bot/compare/v2.3.0...v2.5.0) (2017-09-25)


### Bug Fixes

* **arbitage:** ผลลัพธ์ของค่าเงิน thbusd กลายเป็น undefined เพราะว่า refactor ไป ([1400976](https://github.com/zapkub/momoka-crypto-bot/commit/1400976))
* **line:** handle user profile get errror ([c9cfc14](https://github.com/zapkub/momoka-crypto-bot/commit/c9cfc14))
* **messenger-adapter:** bug in action require file name ([17e7d89](https://github.com/zapkub/momoka-crypto-bot/commit/17e7d89))
* **notification:** fix bug on margin notification (typo) ([d73c38c](https://github.com/zapkub/momoka-crypto-bot/commit/d73c38c))
* **notification:** fix notification receptionid must check groupid first ([c5b3b3a](https://github.com/zapkub/momoka-crypto-bot/commit/c5b3b3a))
* **parser:** support dash with 4 char ([f037182](https://github.com/zapkub/momoka-crypto-bot/commit/f037182))


### Features

* **notification:** Momoka can alert you for a price at any value ! ([38fc5f2](https://github.com/zapkub/momoka-crypto-bot/commit/38fc5f2))
* **notification:** เพิ่ม margin notification ([1f13466](https://github.com/zapkub/momoka-crypto-bot/commit/1f13466))
* **notification:** เพิ่ม เรียกดู notification list ([8aa866b](https://github.com/zapkub/momoka-crypto-bot/commit/8aa866b))



<a name="2.4.0"></a>
# [2.4.0](https://github.com/zapkub/momoka-crypto-bot/compare/v2.3.0...v2.4.0) (2017-09-24)


### Bug Fixes

* **line:** handle user profile get errror ([c9cfc14](https://github.com/zapkub/momoka-crypto-bot/commit/c9cfc14))
* **messenger-adapter:** bug in action require file name ([17e7d89](https://github.com/zapkub/momoka-crypto-bot/commit/17e7d89))
* **notification:** fix bug on margin notification (typo) ([d73c38c](https://github.com/zapkub/momoka-crypto-bot/commit/d73c38c))
* **notification:** fix notification receptionid must check groupid first ([c5b3b3a](https://github.com/zapkub/momoka-crypto-bot/commit/c5b3b3a))
* **parser:** support dash with 4 char ([f037182](https://github.com/zapkub/momoka-crypto-bot/commit/f037182))


### Features

* **notification:** Momoka can alert you for a price at any value ! ([38fc5f2](https://github.com/zapkub/momoka-crypto-bot/commit/38fc5f2))
* **notification:** เพิ่ม margin notification ([1f13466](https://github.com/zapkub/momoka-crypto-bot/commit/1f13466))
* **notification:** เพิ่ม เรียกดู notification list ([8aa866b](https://github.com/zapkub/momoka-crypto-bot/commit/8aa866b))



<a name="2.3.0"></a>
# [2.3.0](https://github.com/zapkub/momoka-crypto-bot/compare/v2.2.0...v2.3.0) (2017-09-23)


### Features

* **caching:** momoka will cache url at singleton in memory and purge every 20 sec ([f890084](https://github.com/zapkub/momoka-crypto-bot/commit/f890084))



<a name="2.2.0"></a>
# 2.2.0 (2017-09-20)


### Bug Fixes

* **parser:** bug เกิดจาก ปรับ space ออกจาก คำสั่งเทียบราคา ทำให้แบบเดิมใช้ไม่ได้ (regression) ([03dd2ba](https://github.com/zapkub/momoka-crypto-bot/commit/03dd2ba))


### Features

* **parser:** add compare shortcut and dash coin ([3d3c6f1](https://github.com/zapkub/momoka-crypto-bot/commit/3d3c6f1))
* **parser:** remove space for get price expression ([293c0d4](https://github.com/zapkub/momoka-crypto-bot/commit/293c0d4))



<a name="2.1.0"></a>
# 2.1.0 (2017-09-18)


### Features

* **parser:** remove space for get price expression ([fd876ef](https://github.com/zapkub/momoka-crypto-bot/commit/fd876ef))
