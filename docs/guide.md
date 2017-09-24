
## Invoke command
``` 
โมโมกะ ${command}
```
## Command
- **Price** `โมโมกะ {prefix}{prefix}`
  - Momoka will take a look in data pool and send you an information
    - `โมโมกะ omgthb`

- **Margin price** `โมโมกะ margin {prefix}`
  - Momoka will check a margin cost of crypto currency between THB and USD for you
    - `โมโมกะ margin omg`
    - `โมโมกะ margin dash`

- **Notification subscribe** `โมโมกะ เตือน {command} เมื่อ (มากกว่า|น้อยกว่า) {result}`
  - Register Momoka alert for command result eg. 
    - `โมโมกะ เตือน omgthb เมื่อ มากกว่า 300`
    - `โมโมกะ เตือน margin omg เมื่อ มากกว่า 5`

- **Notification list** `โมโมกะ มีเตือนอะไรไว้มั่ง`
  - Momoka will show your subscribe list


- **Remove notification** `โมโมกะ เลิกเตือน {notification_id}`
  - Remove notification by give Momoka notification ref id

## Shortcut Command list
- call for price `${currency}${compare}` eg. `omgthb`
- call for top coin margin price `compare`


