import { Command } from 'discord.js-commando'
import {
  getVersion,
  getVersions,
  getNewReleases,
  getAllNewReleases,
  isValidRepo,
  getRepos,
  ANNOUNCEMENT_CHANNEL,
  NOTIFICATION_ROLE,
} from '../../services/version-checker'
import { inlineCode } from '../../utils/string'
import { cleanupInvocation } from '../../utils/messages'
import { createDefaultEmbed } from '../../utils/embed'

module.exports = class AnnouncementsReleasesCommand extends Command {
  constructor(client) {
    super(client, {
      args: [
        {
          key: 'repo',
          type: 'string',
          prompt: `which repo to check (${['all']
            .concat(getRepos())
            .join(', ')})?`,
          validate(value) {
            return value === 'all' || isValidRepo(value)
          },
          default: 'all',
        },
        {
          key: 'automated',
          type: 'boolean',
          prompt: 'n/a',
          default: false,
        },
      ],
      name: 'release',
      aliases: ['releases'],
      examples: [
        inlineCode('!release'),
        inlineCode('!release all'),
        inlineCode('!release vuex'),
      ],
      group: 'announcements',
      guildOnly: false,
      memberName: 'release',
      description:
        'Check for new releases of official Vue repos and announce them (if they are new).',
    })
  }

  hasPermission() {
    return true
  }

  async run(msg, args) {
    const { repo, automated } = args

    const notifyRole = msg.guild.roles.find(
      role => role.name.toLowerCase() === NOTIFICATION_ROLE.toLowerCase()
    )
    const announceChannel = msg.guild.channels.find(
      channel => channel.name === ANNOUNCEMENT_CHANNEL
    )

    try {
      if (!announceChannel) {
        throw new Error(`Could not find channel ${ANNOUNCEMENT_CHANNEL}!`)
      }

      let results =
        repo === 'all'
          ? await getAllNewReleases(true)
          : await getNewReleases(repo, true)

      if (results.length === 0) {
        if (!automated) {
          msg.channel.send(this.buildAlreadyReleasedEmbed(msg, repo))
        }
        return
      } else if (results.length === 1) {
        announceChannel.send(notifyRole, {
          embed: this.buildSingleReleaseEmbed(msg, repo, results[0]),
        })
      } else {
        announceChannel.send(notifyRole, {
          embed: this.buildMultipleReleaseEmbed(msg, repo, results),
        })
      }

      if (!automated) {
        msg.channel.send(
          createDefaultEmbed(msg)
            .setTitle('Release Notifications')
            .setDescription(
              'I have announced the latest version(s) as requested.'
            )
        )
        cleanupInvocation(msg)
      }
    } catch (error) {
      console.error(error)
      msg.channel.send(this.buildErrorEmbed(msg, error))
      if (!automated) {
        cleanupInvocation(msg)
      }
    }
  }

  buildAlreadyReleasedEmbed(msg, repo) {
    let error =
      repo === 'all'
        ? 'All vuejs repo releases have already been announced.'
        : `The latest release of vuejs/${repo} (${getVersion(
            repo
          )}) has already been announced.`

    const embed = this.buildErrorEmbed(msg, error).setTitle(
      'Release Notifications'
    )

    if (repo === 'all') {
      for (const [repo, version] of Object.entries(getVersions())) {
        embed.addField(repo, version, true)
      }
    }

    return embed
  }

  buildErrorEmbed(msg, error) {
    return createDefaultEmbed(msg)
      .setDescription(error.message ? error.message : error)
      .setColor('ORANGE')
  }

  buildSingleReleaseEmbed(msg, repo, release) {
    const embed = createDefaultEmbed(msg)
      .setURL(release.url)
      .setAuthor(
        release.author.login,
        release.author.avatar_url,
        release.author.html_url
      )
      .setTitle(`New Release - vuejs/${repo} ${release.version}`)
      .setFooter(`Released at ${release.created_at}`)

    if (release.body) {
      embed.setDescription(release.body)
    }

    if (release.prelease) {
      embed.addField('NOTICE', 'This is a prerelease!')
    }

    return embed
  }

  buildMultipleReleaseEmbed(msg, repo, releases) {
    const latestRelease = releases[releases.length - 1]
    const embed = createDefaultEmbed(msg)
      .setURL(latestRelease.url)
      .setAuthor(
        latestRelease.author.login,
        latestRelease.author.avatar_url,
        latestRelease.author.html_url
      )

    if (repo === 'all') {
      embed.setTitle('Multiple New Releases')
    } else {
      embed.setTitle(`Multiple New Releases - vuejs/${repo}`)
    }

    for (const release of releases) {
      embed.addField(`${release.repo} ${release.version}`, release.url)
    }

    return embed
  }
}
