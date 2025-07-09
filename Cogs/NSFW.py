import discord
from discord import app_commands
from discord.ext import commands
import aiohttp

class NSFW(commands.Cog):
    def __init__(self, bot: commands.Bot):
        self.bot = bot


    def is_nsfw_channel(interaction: discord.Interaction):
        return interaction.channel and interaction.channel.is_nsfw()

    @app_commands.command(name="test", description="test")
    @app_commands.check(is_nsfw_channel)
    async def test(self, interaction: discord.Interaction):
        await interaction.response.send_message("Test")

    @test.error
    async def test_error(self, interaction: discord.Interaction, error: app_commands.AppCommandError):
        if isinstance(error, app_commands.CheckFailure):
            await interaction.response.send_message("This command can only be used in NSFW channels.", ephemeral=True)

async def setup(bot):
    await bot.add_cog(NSFW(bot))