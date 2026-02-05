# BunnyEra HQ Discord Bot — Human Setup Checklist

## ⚠️ Important: Manual Setup Required

The BunnyEra HQ Discord Bot will **NOT** perform any automated content publishing until you complete the initial manual setup steps below.

All automated systems, including scheduled announcements, automated publishing, and content distribution, are **DISABLED** by default.

## Setup Steps

Follow these steps in order to properly initialize the BunnyEra HQ Discord Bot:

### Step 1: Create Discord Server
- [ ] Create a new Discord server for BunnyEra HQ
- [ ] Ensure you are the server owner
- [ ] Configure server privacy and moderation settings

### Step 2: Configure Server Name and Icon
- [ ] Set the server name to "BunnyEra HQ" (or your preferred name)
- [ ] Upload a server icon/logo
- [ ] Configure server description and welcome screen
- [ ] Set up server banner (if available)

### Step 3: Publish the First Official BunnyEra HQ Announcement Manually
- [ ] Create your announcement channel (e.g., #announcements)
- [ ] Write and publish the first official BunnyEra HQ announcement **manually**
- [ ] This establishes the tone and format for future automated announcements
- [ ] Review and verify the announcement is correct

### Step 4: Run `/complete-initial-setup`
- [ ] Ensure the bot is online and connected to your server
- [ ] Run the `/complete-initial-setup` slash command
- [ ] Verify you see the success message
- [ ] **Only the server owner can run this command**

### Step 5: AI Automation Begins
- [ ] Verify automated systems are now enabled
- [ ] Monitor bot activity and logs
- [ ] Automated announcements and publishing will now proceed

## After Setup

Once you complete Step 4, all automated systems will be activated:
- ✅ Automated content publishing
- ✅ Scheduled announcements
- ✅ Channel management
- ✅ Automated tasks

## Verification

After running `/complete-initial-setup`, check the bot logs for:
```
[INITIALIZATION] Human initialization marked as COMPLETE. Automated systems are now ENABLED.
```

This confirms that the manual setup is complete and the bot is ready for automated operations.

## Troubleshooting

**Bot won't respond to `/complete-initial-setup`:**
- Verify you are the server owner
- Check that the bot has the required permissions
- Ensure the bot is online and connected

**Command not showing up:**
- Wait a few minutes for Discord to sync slash commands
- Try restarting your Discord client
- Check bot permissions in Server Settings → Integrations

## Need Help?

If you encounter any issues during setup, check:
1. Bot logs for error messages
2. Bot permissions in server settings
3. Discord API status

---

**Remember:** The bot will remain in a safe, non-automated state until you manually complete all steps above and run `/complete-initial-setup`.
