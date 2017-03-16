# lb-api
负载均衡设备的api


## CHANGELOG

### v1.3

- 将request日志记录到MQ中
- 增加API
  - /server-lb/lb-policy
  - /server-lb/lb-class
  - /server-lb/lb-action

### v1.2

- 处理未认证时抛出的异常
- 增加API
  - /server-lb/real-server
  - /server-lb/server-farm
  - /server-lb/virtual-server

### v1.1

- 增加基于jwt的token验证
- 增加API
  - /device/fan
  - /device/power
  - /device/environment
  - /interface
  - /interface/counters/inbound
  - /interface/counters/outbound

### v1.0

- 完成device两个API
  - /device/cpu-usage
  - /device/memory
