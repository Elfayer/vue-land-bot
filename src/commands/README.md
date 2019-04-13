# Commands

### Template

```js
module.exports = {
  name: String, // should match file name
  description: String, // for maintainers understanding
  args: Boolean, // true if the execute function uses args
  isAvailable: Boolean, // if false, won't be used
  usage: '<user> <role>', // if using args, to show users right args usage
  execute (message, args) {
    message.channel.send(String)
  }
}
```
