const fs = require('fs')
const Discord = require('discord.js')
const client = require('./client.js')
const { prefix, token } = require('./config.json')

// Init commands
client.commands = new Discord.Collection()

const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
  const command = require(`./commands/${file}`)

  if (command.isAvailable) {
    client.commands.set(command.name, command)
  }
}

// Init jobs
client.jobs = new Discord.Collection()

const jobFiles = fs.readdirSync('./src/jobs').filter(file => file.endsWith('.js'))

for (const file of jobFiles) {
  const job = require(`./jobs/${file}`)

  if (job.isAvailable) {
    client.jobs.set(job.name, job)
  }
}

client.once('ready', () => {
  console.log('Ready!')
})

client.on('message', message => {
  // If the message was sent by a bot, exit early
  if (message.author.bot) {
    return
  }

  // If commands
  if (message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).split(/ +/)
    const commandName = args.shift().toLowerCase()
    const command = client.commands.get(commandName)

    if (!client.commands.has(commandName)) {
      return message.channel.send(`There is no \`${prefix}${commandName}\` command!`)
    }

    if (command.args && !args.length) {
      let reply = `You didn't provide any arguments, ${message.author}!`

      if (command.usage) {
        reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``
      }

      return message.channel.send(reply)
    }

    try {
      command.execute(message, args)
    } catch (error) {
      console.error(error)
      message.reply(`There was an error trying to execute "${commandName}" command!`)
    }
  }
  // Read all by jobs
  client.jobs.forEach(job => job.execute(message))
})

client.login(token)
