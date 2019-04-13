module.exports = {
  name: 'ban',
  description: 'Rules to ban',
  isAvailable: false,
  execute (message) {
    if (message.content.includes('http://discord.amazingsexdating.com')) {
      const user = message.author
      const member = message.guild.member(user)

      // If the member is in the guild
      if (member) {
        /**
         * Ban the member
         * Make sure you run this on a member, not a user!
         * There are big differences between a user and a member
         */
        member.ban('[BOT] ad-block-ban').then(() => {
          console.log(`Banned ${user.username}#${user.discriminator}`)
          console.log(`Due to message: "${message.content}"`)
        }).catch(err => {
          // An error happened
          // This is generally due to the bot not being able to ban the member,
          // either due to missing permissions or role hierarchy
          console.log('I was unable to kick the member')
          // Log the error
          console.error(err)
        })
      } else {
        // The mentioned user isn't in this guild
        console.log('I was unable to kick the member, user isn\'t in this guild')
      }
    }
  }
}
