import discord
from discord.ext import commands
import os
import asyncio
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Logging setup
handler = logging.FileHandler(filename='discord.log', encoding='utf-8', mode='w')

# Set up intents and bot
intents = discord.Intents.all()
client = commands.Bot(command_prefix='!', intents=intents)
client.owner_id = 769723790078640168

# Function to get cog list
def get_cogs():
    return [f"Cogs.{f[:-3]}" for f in os.listdir('./Cogs') if f.endswith('.py')]

# Async load/unload functions
async def load_cogs():
    cogs = get_cogs()
    for cog in cogs:
        if cog not in client.extensions:
            try:
                await client.load_extension(cog)
                print(f"{cog} has been loaded successfully.")
            except Exception as e:
                print(f"Failed to load {cog}: {e}")
        else:
            try:
                await client.reload_extension(cog)
                print(f"{cog} has been reloaded successfully.")
            except Exception as e:
                print(f"Failed to reload {cog}: {e}")
    return cogs

async def unload_cogs():
    cogs = get_cogs()
    for cog in cogs:
        if cog in client.extensions:
            try:
                await client.unload_extension(cog)
                print(f"{cog} has been unloaded successfully.")
            except Exception as e:
                print(f"Failed to unload {cog}: {e}")
    return cogs

# Command versions
@client.command(name='load')
async def load_command(ctx):
    cogs = await load_cogs()
    await ctx.send(f"Loaded {len(cogs)} cogs.")
    await client.tree.sync()
    await ctx.send("Synced.")

@client.command(name='unload')
async def unload_command(ctx):
    cogs = await unload_cogs()
    await ctx.send(f"Unloaded {len(cogs)} cogs.")
    await client.tree.sync()
    await ctx.send("Synced.")

@client.event
async def on_ready():
    print("I'm online!")
    cogs = await load_cogs()
    print(f"Loaded {len(cogs)} cogs on startup.")
    await client.tree.sync()

# Start bot
client.run(os.getenv("TOKEN"), log_handler=handler, log_level=logging.DEBUG)