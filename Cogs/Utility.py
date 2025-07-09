import discord
from discord import app_commands
from discord.ext import commands 
import aiohttp
from datetime import datetime

class Utility(commands.Cog):
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @commands.command()
    async def info(self, ctx):
        ping = f"{round(self.bot.latency*1000)}ms"
        data = []

        async with aiohttp.ClientSession() as session:
            async with session.get("https://discordstatus.com/api/v2/status.json") as response:
                data = await response.json()
                
        updated_at = datetime.fromisoformat(data['page']['updated_at'])
        formatted_updated_at = updated_at.strftime("%b %d, %y @ %H:%M:%S")
        
        embed = discord.Embed(title="Bot Information",
                      description="Information about the bot and its statistics.")

        embed.add_field(name="General Information",
                        value=f"Owner: <@{self.bot.owner_id}>",
                        inline=True)
        embed.add_field(name="Network",
                        value=f"Bot Latency: {ping}\n\nServer Status: {data['status']['description']}\nLast updated: {formatted_updated_at}",
                        inline=True)

        await ctx.send(embed=embed)

async def setup(bot):
    await bot.add_cog(Utility(bot))