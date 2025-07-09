import discord
from discord.ext import commands

import os
from dotenv import load_dotenv
load_dotenv()

import logging
handler = logging.FileHandler(filename='discord.log', encoding='utf-8', mode='w')

intents = discord.Intents.all()

client = commands.Bot(command_prefix='!', intents=intents)
client.owner_id = 769723790078640168

@client.event
async def on_ready():
    print("The faggot is online.")
    
@client.command(name='load')
async def load(ctx):
    cogs = []

    for file in os.listdir('./Cogs'):
        if file.endswith('.py'):
            cogs.append(f"Cogs.{file}"[:-3])

    for cog in cogs:
        if cog not in client.extensions:
            try:
                await client.load_extension(cog)
                print(f"{cog} has been loaded successfully.")
            except Exception as e:
                print(f"Failed to load cog\n\n{e}")
        else:
            try:
                await client.reload_extension(cog)
                print(f"{cog} has been reloaded successfully.")
            except Exception as e:
                print(f"Failed to reload cog\n\n{e}")
    
    await ctx.send(f"Loaded {len(cogs)} cogs.")
    await client.tree.sync()
    await ctx.send("Synced.")

@client.command(name='unload')
async def unload(ctx):
    cogs = []

    for file in os.listdir('./Cogs'):
        if file.endswith('.py'):
            cogs.append(f"Cogs.{file}"[:-3])

    for cog in cogs:
        if cog in client.extensions:
            try:
                await client.unload_extension(cog)
                print(f"{cog} has been unloaded successfully.")
            except Exception as e:
                print(f"Failed to unload cog\n\n{e}")
    
    await ctx.send(f"Unloaded {len(cogs)} cogs.")
    await client.tree.sync()
    await ctx.send("Synced.")

client.run(os.getenv("TOKEN"), log_handler=handler, log_level=logging.DEBUG)