# ─── Discord ──────────────────────────────────────── 
import discord
from discord.ext import commands
from discord import app_commands

class Navigation(discord.ui.View):
    def __init__(self, data, index=0):
        super().__init__()

        self.data = data
        self.index = index 

    def createEmbed(self):
        def escape_underscores(tags):
            return [tag.replace("_", "\\_") for tag in tags]


        post = self.data['posts'][self.index]
        fileURL = post['file']['url']

        if fileURL.endswith((".mp4", ".webm", ".apng", "swf")):
            embed = discord.Embed(title=f"Post {self.index + 1} of {len(self.data['posts'])}",
                                url=f"https://e621.net/posts/{post['id']}")

            embed.set_author(name="e621.net",
                            url="https://e621.net",
                            icon_url="https://e621.net/favicon.ico")

            embed.add_field(name="Post Information",
                            value=f">>> **Artist:** {', '.join(escape_underscores(post['tags']['artist']))}\n**Characters:** {', '.join(escape_underscores(post['tags']['character']))}\n**General Tags:** {', '.join(escape_underscores(post['tags']['general']))}\n**Rating:** {post['rating']}",
                            inline=True)
            embed.add_field(name="File Information",
                            value=f">>> **Size (KB):** {(str(post['file']['size']))}\n **Extension:** {(post['file']['ext'])}\n**Resolution:** {(str(post['file']['width']))}x{(str(post['file']['height']))}",
                            inline=True)
            embed.add_field(name="Invalid Format",
                            value="This file could not be embedded as it is not supported by Discord.",
                            inline=False)

        else:
            embed = discord.Embed(title=f"Post {self.index + 1} of {len(self.data['posts'])}",
                                url=f"https://e621.net/posts/{post['id']}")

            embed.set_author(name="e621.net",
                            url="https://e621.net",
                            icon_url="https://e621.net/favicon.ico")

            embed.add_field(name="Post Information",
                            value=f">>> **Artist:** {', '.join(escape_underscores(post['tags']['artist']))}\n**Characters:** {', '.join(escape_underscores(post['tags']['character']))}\n**General Tags:** {', '.join(escape_underscores(post['tags']['general']))}\n**Rating:** {post['rating']}",
                            inline=True)
            embed.add_field(name="File Information",
                            value=f">>> **Size (KB):** {(str(post['file']['size']))}\n **Extension:** {(post['file']['ext'])}\n**Resolution:** {(str(post['file']['width']))}x{(str(post['file']['height']))}",
                            inline=True)

            embed.set_image(url=f"{fileURL}")

        return embed

        
    
    @discord.ui.button(label='🞀', style=discord.ButtonStyle.blurple)
    async def prevPost(self, interaction: discord.Interaction, button: discord.ui.Button):
        if self.index <= 0:
            self.index = len(self.data['posts']) - 1
        else:
            self.index -= 1

        await interaction.response.edit_message(
            embed=self.createEmbed(),
            view=self
        )

        
    @discord.ui.button(label='🞂', style=discord.ButtonStyle.blurple)
    async def nextPost(self, interaction: discord.Interaction, button: discord.ui.Button):
        if self.index >= len(self.data['posts']) - 1:
            self.index = 0
        else:
            self.index += 1

        await interaction.response.edit_message(
            embed=self.createEmbed(),
            view=self
        )
