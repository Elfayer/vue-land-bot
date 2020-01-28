import { Task, TaskStore, KlasaGuild } from 'klasa'
import { TextChannel, MessageEmbed, Role } from 'discord.js'
import { formatDistanceToNow } from 'date-fns'

import ReleaseService, { Release } from '@services/ReleaseService'
import { ReleaseSettings } from '@settings/ReleaseSettings'
import createVueTemplate from '@templates/VueTemplate'
import { I18n } from '@libraries/types/I18n'
import { warnOwner, dumpToFile } from '@utilities/miscellaneous'
import { ReleaseEntry } from '@libraries/types/ReleaseTypes'
import { ValidVueRepositories } from '@libraries/types/MiscTypes'

/**
 * The ReleaseCheckTask is responsible for refreshing the RFCs from the Github API.
 */
export default class ReleaseCheckTask extends Task {
  service: ReleaseService

  constructor(store: TaskStore, file: string[], directory: string) {
    super(store, file, directory, {
      name: 'ReleaseCheckTask',
      enabled: true,
    })
  }

  async init() {
    if (!this.client.schedule.get('ReleaseCheckTask')) {
      this.client.schedule.create('ReleaseCheckTask', '*/15 * * * *', {
        id: 'ReleaseCheckTask',
      })
    }

    this.service = this.client.services.get('ReleaseService') as ReleaseService
  }

  /**
   * Announces new releases of Github repos.
   */
  async run(metadata: any) {
    this.log('Task running.')

    const currentTime = Date.now()
    const reposToCheck = this.service.getEnabledRepositories()

    if (reposToCheck.size === 0) {
      return this.log(
        'No guilds have release announcements enabled - nothing to check.'
      )
    }

    const allReleases = await this.service.getAllReleases(reposToCheck)

    this.verbose(
      `Guilds are: ${this.service
        .getEnabledGuilds()
        .map(guild => guild.name)
        .join(', ')}`
    )

    for (const [id, guild] of this.service.getEnabledGuilds()) {
      try {
        const role = this.getRole(guild) ?? null
        const schedule = this.getSchedule(guild)
        const channel = this.getChannel(guild)
        const lastRelease = this.getLastRelease(guild)
        const enabledRepos = this.getRepoList(guild)

        if (!this.shouldAnnounce(lastRelease, schedule)) {
          this.log(`Not time to announce a new version yet for ${guild.name}.`)
          continue
        }

        this.verbose(`Time to announce a new version for ${guild.name}.`)

        await guild.settings.update(
          ReleaseSettings.Guild.LAST_RELEASE,
          currentTime
        )

        if (!channel) {
          this.verbose(
            `No channel for guild ${guild.name}, yet task is enabled?`
          )
          warnOwner(guild, I18n.Tasks.Release.WARN_NO_CHANNEL, [guild.name])
          continue
        }

        if (!schedule) {
          this.verbose(
            `No schedule set for guild ${guild.name}, yet task is enabled?`
          )
          warnOwner(guild, I18n.Tasks.Release.WARN_NO_SCHEDULE, [guild.name])
          continue
        }

        if (!enabledRepos) {
          this.verbose(
            `No enabled repos for guild ${guild.name}, yet task is enabled?`
          )
          warnOwner(guild, I18n.Tasks.Release.WARN_NO_REPOS, [guild.name])
          continue
        }

        const guildReleases = this.service.filterGuildReleases(
          allReleases,
          guild
        )

        if (!Object.values(guildReleases).length) {
          this.verbose(`No guild releases releases for ${guild.name}?`)
          continue
        }

        this.verbose(
          `Got ${
            Object.values(guildReleases).length
          } filtered releases for guild ${guild.name}.`
        )

        for (const [repoName, releases] of Object.entries(guildReleases)) {
          channel.sendEmbed(this.buildEmbed(repoName, releases, guild), role)
        }

        await this.updateReleaseEntries(guildReleases, guild, currentTime)
      } catch (error) {
        this.error(error)
      }
    }
  }

  /**
   * Write which versions of which repos we announced and at what times to the guild settings.
   */
  private async updateReleaseEntries(
    guildReleases: { [key: string]: Release[] },
    guild: KlasaGuild,
    currentTime: number
  ) {
    for (const [repoName, releases] of Object.entries(guildReleases)) {
      this.verbose(`(${guild.name}) Updating release entry for ${repoName}.`)

      const latestRelease = releases[0]
      const newReleaseEntry = {
        repo: latestRelease.repo as ValidVueRepositories,
        version: latestRelease.tag_name,
        announced: currentTime,
      }
      const oldReleaseEntryIndex = guild.settings
        .get(ReleaseSettings.Guild.VERSIONS)
        .findIndex(release => {
          return release.repo === repoName
        })

      if (oldReleaseEntryIndex === -1) {
        this.verbose(`(${guild.name}) Adding entry for ${repoName}.`)
        await guild.settings.update(
          ReleaseSettings.Guild.VERSIONS,
          newReleaseEntry,
          {
            arrayAction: 'add',
          }
        )
      } else {
        this.verbose(`(${guild.name}) Updating entry for ${repoName}.`)
        await guild.settings.update(
          ReleaseSettings.Guild.VERSIONS,
          newReleaseEntry,
          {
            arrayAction: 'overwrite',
            arrayIndex: oldReleaseEntryIndex,
          }
        )
      }
    }

    this.verbose(`(${guild.name}) Updated release entries.`)
  }

  private buildEmbed(repoName: string, releases: Release[], guild: KlasaGuild) {
    const latestRelease = releases[0]
    const embed = createVueTemplate({ addAuthor: false })
      .setTitle(`${repoName} ${latestRelease.tag_name}`)
      .setURL(latestRelease.url)
      .setAuthor(
        latestRelease.author.login,
        latestRelease.author.avatar_url,
        latestRelease.author.url
      )
      .addField(
        guild.language.get(I18n.Misc.RELEASED_AT),
        new Date(latestRelease.created_at).toUTCString(),
        true
      )
      .addField(
        guild.language.get(I18n.Misc.ANNOUNCED_AT),
        new Date().toUTCString(),
        true
      )

    if (releases.length === 1) {
      embed.setDescription(latestRelease.body)
    } else {
      const otherReleases = releases.length - 1
      embed.setDescription(
        `Plus ${otherReleases} other new release(s) since last announcement.`
      )
    }

    return embed
  }

  /**
   * Determine whether or not it is time to announce any releases.
   */
  private shouldAnnounce(lastRelease: number, schedule: number) {
    return Date.now() > lastRelease + schedule * 60 * 1000
  }

  /**
   * Return a guild's `role` setting as a `Role` instance.
   */
  private getRole(guild: KlasaGuild) {
    return guild.roles.get(guild.settings.get(ReleaseSettings.Guild.ROLE))
  }

  /**
   * Return a guild's `channel` setting as a `TextChannel` instance.
   */
  private getChannel(guild: KlasaGuild) {
    return guild.channels.get(
      guild.settings.get(ReleaseSettings.Guild.CHANNEL)
    ) as TextChannel
  }

  /**
   * Return a guild's `schedule` setting.
   */
  private getSchedule(guild: KlasaGuild) {
    return guild.settings.get(ReleaseSettings.Guild.SCHEDULE)
  }

  /**
   * Return a guild's `lastRelease` setting.
   */
  private getLastRelease(guild: KlasaGuild) {
    return guild.settings.get(ReleaseSettings.Guild.LAST_RELEASE)
  }

  /**
   * Return a guild's enabled `repos` setting as a `ValidVueRepositories[]`.
   */
  private getRepoList(guild: KlasaGuild) {
    return guild.settings.get(ReleaseSettings.Guild.REPOS)
  }
}
