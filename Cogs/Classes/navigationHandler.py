import discord

class Navigation(discord.ui.View):
    def __init__(self, api, search, page, data, index=0):
        super().__init__(timeout=None)
        self.api = api
        self.search = search
        self.page = page
        self.data = data
        self.index = index

        post = self.data['posts'][self.index]
        self.add_item(discord.ui.Button(
            label="🔗 View Post",
            style=discord.ButtonStyle.link,
            url=f"https://e621.net/posts/{post['id']}"
        ))

    def createEmbed(self):
        def truncate_tags(tags):
            text = ', '.join(tag.replace('_', '\\_') for tag in tags)
            return text if len(text) <= 256 else text[:253] + "..."

        post = self.data['posts'][self.index]
        fileURL = post['file']['url']

        embed = discord.Embed(
            title=f"Post {self.index + 1} of {len(self.data['posts'])} | Page {self.page}",
            url=f"https://e621.net/posts/{post['id']}"
        )

        embed.set_author(
            name="e621.net",
            url="https://e621.net",
            icon_url="https://e621.net/favicon.ico"
        )

        embed.add_field(
            name="Post Information",
            value=(
                f">>> **Artist:** {truncate_tags(post['tags']['artist'])}\n"
                f"**Characters:** {truncate_tags(post['tags']['character'])}\n"
                f"**General Tags:** {truncate_tags(post['tags']['general'])}\n"
                f"**Rating:** {post['rating']}"
            ),
            inline=True
        )

        embed.add_field(
            name="File Information",
            value=(
                f">>> **Size:** {round(post['file']['size'] / 1024, 2)} KB\n"
                f"**Extension:** {post['file']['ext']}\n"
                f"**Resolution:** {post['file']['width']}x{post['file']['height']}"
            ),
            inline=True
        )

        if fileURL.endswith((".mp4", ".webm", ".apng", "swf")):
            embed.add_field(
                name="Invalid Format",
                value="This file could not be embedded as it is not supported by Discord.",
                inline=True
            )
        else:
            embed.set_image(url=fileURL)

        return embed

    async def update_link_button(self):
        # Remove existing link button (if any)
        for item in self.children:
            if isinstance(item, discord.ui.Button) and item.style == discord.ButtonStyle.link:
                self.remove_item(item)
                break
        
        # Add updated link button with current post URL
        post = self.data['posts'][self.index]
        self.add_item(discord.ui.Button(
            label="🔗 View Post",
            style=discord.ButtonStyle.link,
            url=f"https://e621.net/posts/{post['id']}"
        ))

    @discord.ui.button(label='🞀', style=discord.ButtonStyle.blurple)
    async def prevPost(self, interaction: discord.Interaction, button: discord.ui.Button):
        self.index -= 1
        if self.index < 0:
            if self.page > 1:
                self.page -= 1
                new_data = await self.api.fetchPosts(search=self.search, page=self.page)
                if not new_data['posts']:
                    self.page += 1
                    self.index = 0
                    return await interaction.response.send_message("No previous posts found.", ephemeral=True)
                self.data = new_data
                self.index = len(self.data['posts']) - 1
            else:
                self.index = 0  # stay at the first post if already on page 1

        await self.update_link_button()
        await interaction.response.edit_message(embed=self.createEmbed(), view=self)

    @discord.ui.button(label='🞂', style=discord.ButtonStyle.blurple)
    async def nextPost(self, interaction: discord.Interaction, button: discord.ui.Button):
        self.index += 1
        if self.index >= len(self.data['posts']):
            self.page += 1
            new_data = await self.api.fetchPosts(search=self.search, page=self.page)
            if not new_data['posts']:
                self.index -= 1  # stay on last valid post
                self.page -= 1
                return await interaction.response.send_message("No more posts found.", ephemeral=True)
            self.data = new_data
            self.index = 0

        await self.update_link_button()
        await interaction.response.edit_message(embed=self.createEmbed(), view=self)

    @discord.ui.button(label='🔁 Restart', style=discord.ButtonStyle.secondary)
    async def restartPost(self, interaction: discord.Interaction, button: discord.ui.Button):
        self.page = 1
        self.index = 0
        self.data = await self.api.fetchPosts(search=self.search, page=self.page)

        await self.update_link_button()
        await interaction.response.edit_message(embed=self.createEmbed(), view=self)
