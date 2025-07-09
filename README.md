# Introduction
This is an NSFW Discord bot developed for personal use. Below are instructions for setting it up.

## Table of Contents
1. [Discord Token](#discord-token)
2. [API Key](#api-key)

## Discord Token
To use the bot, you need a Discord token.

### Create a Discord Application
1. **Create a New Application**
    - Go to the [Discord Developer Portal](https://discord.com/developers/).
    - Click on the **'New Application'** button in the top right corner.
    - The name is irrelevant, we only need to focus on the settings.

2. **Configure Installation Settings**
    - Click on the newly created application.
    - Navigate to the **'Installation'** tab.
    - Set the **Install Link** section to **'Discord Provided Link'**.
    - Under **Default Install Settings**, add the following scopes:
        - `application.commands`
        - `bot`
    - Copy the generated link to invite the bot.

3. **Generate the Bot Token**
    - Go to the **'Bot** section.
    - Click on **'Reset Token'** to generate your token.
    - Copy the token and store it in the `sample.env` file, then rename it to `.env` for simplicity.
    - Ensure **'Public Bot'** and all **Privileged Gateway Intents** are enabled.

## API Key
You will also need API keys for e621.net and rule34.xxx.

**e621.net**
1. **Create an Account**
    - Visit [e621](https://e621.net/session/new) to log in or sign up.
    - Verify your email if prompted.

2. **Obtain Your API Key**
    - Click on **'More'** and select **'Settings'** under the **Users** category.
    - Click the **view** button for the API key and enter your password if prompted.
    - If you don't have an API key, generate a new one.
    - Copy the API key and place it in the `.env` file.

3. **Create a User-Agent**
    - Enter a user-agent string like: `Bot/1.0 (by Your Username on e621)`.

**rule34.xxx**
1. **Create an Account**
    - Go to [rule34](https://rule34.xxx/index.php?page=account&s=home) and click **'Login'** or **'Sign Up'**.
    - Verify your email if necessary.

2. **Generate API Access Credentials**
    - Once logged in, navigate to the account page and click on **Options**.
    - Find **'API Access Credentials'** and click on **'Generate New Key?'**.
    - Click **Save** at the bottom of the page.**

3. **Store the API Key**
    - Copy the generated key and input it into the `.env` file.
    - No user-agent is needed as your identifier is included in the credentials.
