# Web Development Fundamentals for Blake

*A tactical guide to everything you need to know*

---

## CHAPTER 1: The Big Picture

### How Websites Work (The Restaurant Analogy)

Imagine you're ordering food at a restaurant:

1. **You (Browser)** look at the menu and decide what you want
2. **You tell the waiter (Internet/DNS)** your order
3. **The waiter brings it to the kitchen (Server)** where the chef prepares it
4. **The food comes back** to your table

Websites work the same way:

- **Browser** (Chrome, Safari) = You looking at the menu
- **Internet/DNS** = The waiter who knows where the kitchen is
- **Server** = The kitchen that actually makes the food
- **Website files** = The ingredients and recipes

```
You type: blake.com
    ↓
Browser asks DNS: "Where is blake.com?"
    ↓
DNS says: "It's at 192.168.1.100" (server address)
    ↓
Browser asks that server: "Give me the homepage"
    ↓
Server sends back HTML/CSS/JS files
    ↓
Browser displays the website
```

**Why this matters:** Understanding this flow helps you debug. If the site won't load, is it your browser, the internet, the DNS, or the server?

---

### Hosting vs VPS vs Shared Hosting

Think of housing:

| Type | Analogy | What You Get |
|------|---------|--------------|
| **Shared Hosting** | Apartment building | One big server split into many small apartments. Cheap, but you share walls (resources) with neighbors. If one person throws a party, everyone hears it. |
| **VPS (Virtual Private Server)** | Townhouse | Your own dedicated space with your own walls. More control, more responsibility. You can paint the walls (configure the server) however you want. |
| **Dedicated Server** | Single-family house | The entire building is yours. Expensive, total control. |

**Why we use a VPS:**

- **Control:** You can install whatever software you want
- **Cost:** ~$5-20/month vs $50+ for dedicated
- **Learning:** You understand how everything actually works
- **Performance:** No noisy neighbors slowing you down

**The trade-off:** With great power comes great responsibility. You have to maintain it yourself (security updates, configurations, backups).

---

## CHAPTER 2: The Terminal (Command Line)

### Terminal vs GUI (Finder)

You know how to use **Finder** on your Mac — clicking folders, dragging files, double-clicking to open things. That's a **GUI** (Graphical User Interface).

The **Terminal** is the same thing, but you type commands instead of clicking.

| Finder Action | Terminal Command |
|---------------|------------------|
| Double-click a folder | `cd foldername` |
| Look at folder contents | `ls` |
| Create new folder | `mkdir newfolder` |
| Move file | `mv file.txt destination/` |
| Delete file | `rm file.txt` |

**Analogy:** Finder is like a restaurant with pictures on the menu. Terminal is ordering by name — faster once you know the names, intimidating if you don't.

**Why this matters:** Servers don't have screens. You can't click anything. Everything is done through the terminal. Learning this unlocks the ability to control any server anywhere.

---

### Basic Commands You Need to Know

#### `cd` — Change Directory (Open a folder)

```bash
cd projects          # Enter the "projects" folder
cd ..                # Go up one level (to parent folder)
cd ~                 # Go to your home folder
cd /var/www          # Go to absolute path /var/www
```

**Think of it like:** Clicking into a folder in Finder.

---

#### `ls` — List (See what's in the folder)

```bash
ls                   # Basic list
ls -la               # Detailed list with hidden files
ls -lah              # Human-readable file sizes
```

**What you'll see:**

```
drwxr-xr-x  5 blake staff   160 Feb  5 14:30 .
drwxr-xr-x  3 blake staff    96 Feb  5 14:00 ..
-rw-r--r--  1 blake staff   234 Feb  5 14:30 README.md
drwxr-xr-x  2 blake staff    64 Feb  5 14:15 src
```

**Reading the colors and symbols:**

- **Blue** = folder (directory)
- **White** = regular file
- **Green** = executable (program/script)
- **Dot (.)** = current folder
- **Dot-dot (..)** = parent folder
- **Hidden files** (start with `.`) = configuration files

---

#### `mkdir` — Make Directory (Create folder)

```bash
mkdir my-project     # Create folder "my-project"
mkdir -p path/to/nested/folder  # Create nested folders
```

---

#### `rm` — Remove (Delete)

```bash
rm file.txt          # Delete a file
rm -r foldername     # Delete a folder and everything inside
rm -rf foldername    # FORCE delete (DANGEROUS!)
```

⚠️ **WARNING:** There is no Trash/Recycle Bin in the terminal. When you `rm`, it's gone forever. No undo.

**Safety tip:** Use `rm -i` to prompt before each deletion, or move to trash instead:
```bash
mv file.txt ~/.trash/  # Safer — move instead of delete
```

---

#### `cp` — Copy

```bash
cp file.txt backup.txt           # Copy file
cp -r folder/ backup/            # Copy folder (recursive)
```

---

#### `mv` — Move (or rename)

```bash
mv oldname.txt newname.txt       # Rename
mv file.txt /destination/folder/ # Move to folder
```

---

### Common Mistakes and How to Recover

| Mistake | What Happened | How to Fix |
|---------|---------------|------------|
| `command not found` | Typo or command not installed | Check spelling; install if needed |
| `Permission denied` | You don't have rights to do that | Use `sudo` (if you should) or check permissions |
| `No such file or directory` | Wrong path | Check where you are with `pwd`, use `ls` to see files |
| `rm -rf /` (DON'T DO THIS) | Deleted everything | Pray you have backups. Never run this. |

**Stuck in a command?** Try:
- `Ctrl + C` — Cancel the current command
- `Ctrl + D` — Exit (like typing "exit")
- `q` — Quit (for programs like `less` or `man`)

---

## CHAPTER 3: SSH (Secure Shell)

### What is SSH?

**SSH** = Secure Shell. It's how you remotely control a server from your computer.

**Analogy:** SSH is like having a secure phone line to your server. You can talk to it, give it commands, and it responds — all encrypted so no one can eavesdrop.

Without SSH, you'd need to physically plug a keyboard and monitor into the server. SSH lets you do it from anywhere.

**Why this matters:** Your VPS lives in a data center somewhere. SSH is how you reach it.

---

### Public vs Private Keys (The Lock and Key Analogy)

Imagine a special kind of lock:

- **Public Key** = The lock itself. You can give copies to anyone. They can use it to lock things for you.
- **Private Key** = The only key that opens that lock. You keep this secret. Never share it.

```
Your Computer                    Server
┌─────────────┐                ┌─────────────┐
│ Private Key │───unlocks──→│  Public Key │
│  (secret)   │                │  (visible)  │
└─────────────┘                └─────────────┘
```

**How it works:**
1. Server says: "Prove you're you"
2. Your computer uses your **private key** to sign a message
3. Server checks against your **public key** (which it has)
4. If they match → you're in!

**Why this matters:** Passwords can be guessed. Keys are virtually impossible to crack. Plus, you don't have to type a password every time.

---

### SSH in Practice

```bash
# Connect to your server
ssh username@server-ip

# Example:
ssh blake@192.168.1.100

# With a specific key file
ssh -i ~/.ssh/my_key blake@192.168.1.100
```

**Your `~/.ssh` folder:**

```
~/.ssh/
├── id_rsa          # Your private key (SECRET!)
├── id_rsa.pub      # Your public key (can share)
├── known_hosts     # Servers you've connected to
└── config          # SSH shortcuts/settings
```

**Protect your private key:**
- Never copy it to another computer unnecessarily
- Never paste it anywhere public
- Set proper permissions: `chmod 600 ~/.ssh/id_rsa`

---

## CHAPTER 4: Git & GitHub

### What is Version Control?

Imagine writing a novel. You save versions:
- `novel-draft1.docx`
- `novel-draft2-FINAL.docx`
- `novel-draft2-FINAL-REALLY.docx`
- `novel-draft2-FINAL-REALLY-ACTUALLY.docx`

**Git** replaces this chaos. It's like "Save As" but:
- You can see exactly what changed between versions
- You can go back to any previous version instantly
- Multiple people can work on it simultaneously
- It knows WHO changed WHAT and WHEN

**Analogy:** Git is like a time machine for your code. Plus a detailed journal of every change.

**Why this matters:** When you break something (and you will), Git lets you undo it. When you forget why you did something, Git shows you.

---

### Key Concepts Explained

#### Repository (Repo)

A **repository** is a folder that Git is watching. It's like a project folder with superpowers.

```bash
git init              # Turn current folder into a repo
git clone <url>       # Download a repo from somewhere
```

---

#### Commit

A **commit** is a snapshot of your files at a specific moment. Like saving a checkpoint in a video game.

```bash
git add .             # Stage changes (prepare them)
git commit -m "Fixed the login bug"  # Save the snapshot
```

Each commit has:
- A unique ID (hash)
- An author (you)
- A timestamp
- A message explaining what changed

**Good commit messages:**
- ✅ "Add user authentication"
- ✅ "Fix navbar styling on mobile"
- ❌ "fix"
- ❌ "asdfghjkl"

---

#### Push & Pull

```
Your Computer ←──────→ GitHub (Remote)
     ↑                      ↑
   push                   pull
   (upload)              (download)
```

```bash
git push origin main    # Upload your commits to GitHub
git pull origin main    # Download latest changes from GitHub
```

**Why this matters:** Push = share your work. Pull = get updates from teammates.

---

#### Branch

A **branch** is a parallel timeline. You can experiment without breaking the main code.

```
main:     ●────●────●────●────●
               \
feature:        ●────●────●
```

```bash
git branch feature-login      # Create new branch
git checkout feature-login    # Switch to it
git checkout -b feature-login # Create AND switch (shortcut)
```

**Why this matters:** Work on a feature without breaking the live site. When it's done, merge it back.

---

### GitHub is "The Cloud" for Code

**Git** = the tool (on your computer)  
**GitHub** = a website that stores Git repositories

GitHub adds:
- **Backup** — your code lives in the cloud
- **Collaboration** — teammates can contribute
- **Issues** — track bugs and tasks
- **Pull Requests** — review code before merging
- **Actions** — automate testing/deployment

**Why this matters:** Your laptop could die. GitHub won't. It's your safety net.

---

### .gitignore (What NOT to Save)

Some files shouldn't be committed:
- Passwords/secrets
- Large files (videos, databases)
- Dependencies (can be reinstalled)
- Temporary files
- Build outputs

Example `.gitignore` file:
```
# Secrets
.env
config/secrets.yml

# Dependencies
node_modules/
vendor/

# Temporary files
*.log
.DS_Store
tmp/
```

**Why this matters:** Committing secrets is like posting your password on Twitter. .gitignore prevents accidents.

---

## CHAPTER 5: Web Servers (Nginx)

### What Does a Web Server Do?

A **web server** is like a librarian:

1. Browser asks: "Can I have the homepage?"
2. Server checks: "Do I have that file?"
3. If yes → sends the file
4. If no → sends a 404 ("not found")

**Its job:** Take HTTP requests and serve files.

**Why this matters:** Without a web server, your website files just sit there. The server makes them accessible to the world.

---

### Nginx vs Apache

| Feature | Nginx | Apache |
|---------|-------|--------|
| Speed | Faster for static files | Slower |
| Memory | Uses less RAM | Uses more |
| Configuration | Simpler | More complex |
| Concurrent users | Handles more | Fewer |

**Why we use Nginx:**
- Faster
- Lower resource usage (important on VPS with limited RAM)
- Easier configuration
- Modern standard

---

### Configuration Files and "sites-enabled"

Nginx config lives in `/etc/nginx/`:

```
/etc/nginx/
├── nginx.conf          # Main config
├── sites-available/    # All possible site configs
│   ├── default
│   └── mywebsite
└── sites-enabled/      # Active configs (symlinks)
    └── mywebsite → ../sites-available/mywebsite
```

**The sites-available vs sites-enabled pattern:**

Think of it like having recipes (sites-available) but only cooking certain ones (sites-enabled).

```bash
# Enable a site (create symlink)
sudo ln -s /etc/nginx/sites-available/mywebsite /etc/nginx/sites-enabled/

# Disable a site (remove symlink)
sudo rm /etc/nginx/sites-enabled/mywebsite

# Test config before reloading
sudo nginx -t

# Reload Nginx to apply changes
sudo systemctl reload nginx
```

**Why this matters:** You can prepare configs without activating them. If something breaks, just remove the symlink.

---

### Static vs Dynamic Content

| Type | What it is | Example |
|------|------------|---------|
| **Static** | Files that don't change | HTML, CSS, images, JavaScript |
| **Dynamic** | Generated on-the-fly | PHP, Node.js apps, databases |

Nginx excels at **static** content. For **dynamic** content, it passes requests to another program:

```
Browser → Nginx → Node.js app → Response
```

**Why this matters:** Your VPS might run both. Nginx serves the images/CSS, then hands off API requests to your app.

---

## CHAPTER 6: Files & File Systems

### Linux File Structure

Unlike Mac/Windows, Linux has one unified filesystem. Everything starts at `/` (root).

```
/                    # Root — everything lives here
├── /bin             # Essential programs (binaries)
├── /etc             # Configuration files
├── /home            # User folders (like /Users on Mac)
│   └── /home/blake  # Your personal stuff
├── /var             # Variable data (logs, websites)
│   └── /var/www     # Web files often live here
├── /usr             # User programs (applications)
├── /tmp             # Temporary files
└── /root            # Root user's home
```

**Key locations for web dev:**

| Path | Purpose |
|------|---------|
| `/var/www/html` | Traditional web root |
| `/var/www/myapp` | Your app files |
| `/etc/nginx/` | Nginx configuration |
| `/var/log/nginx/` | Web server logs |
| `/home/username` | Your personal files |

**Why this matters:** Knowing where things go helps you navigate and troubleshoot.

---

### Permissions (Read/Write/Execute)

Every file has three permission levels:

| Level | Who it applies to |
|-------|-------------------|
| **User** (u) | The file's owner |
| **Group** (g) | Users in the file's group |
| **Other** (o) | Everyone else |

And three permission types:

| Permission | File | Folder |
|------------|------|--------|
| **Read** (r) | View contents | List contents |
| **Write** (w) | Modify contents | Add/remove files |
| **Execute** (x) | Run as program | Enter the folder |

**Reading `ls -l` output:**

```
-rw-r--r--  1 blake staff  1234 Feb 5 14:00 file.txt
│└┬┘└┬┘└┬┘
│ │  │  └── Other permissions (r--)
│ │  └───── Group permissions (r--)
│ └──────── User permissions (rw-)
└────────── File type (- = file, d = directory)
```

**Common permission numbers:**

```bash
chmod 644 file.txt    # rw-r--r-- (owner can edit, others read)
chmod 755 folder/     # rwxr-xr-x (owner full control, others can enter)
chmod 600 secret.key  # rw------- (only owner can read)
```

**Why this matters:** Wrong permissions = security vulnerabilities or "permission denied" errors.

---

### Paths: Absolute vs Relative

**Absolute path:** Starts with `/`, full address from root
```
/var/www/html/index.html
/home/blake/projects/myapp
```

**Relative path:** From where you currently are
```
./file.txt        # In current folder
../config.json    # Up one level, then config.json
images/logo.png   # In "images" folder inside current
```

**Shortcuts:**
- `.` = current directory
- `..` = parent directory
- `~` = your home directory

**Why this matters:** Using the wrong path type is a common source of "file not found" errors.

---

### Best Practices: Where Things Should Go

| What | Where | Why |
|------|-------|-----|
| Web files | `/var/www/project` | Standard location, Nginx expects it |
| App code | `/home/user/apps` or `/opt` | Separate from web root for security |
| Logs | `/var/log` | Standard location, log rotation works |
| Configs | `/etc` | System standard, backed up |
| Backups | `/var/backups` or offsite | Safe from main data |
| Temp files | `/tmp` | Auto-cleaned |

---

## CHAPTER 7: Deployment Process

### Step-by-Step: What Happens When You Deploy

**The Big Picture:**
```
Your Mac (development)
       ↓
   git push
       ↓
GitHub (repository)
       ↓
Server pulls / webhook
       ↓
VPS (production)
       ↓
Restart services
       ↓
Live website!
```

**Detailed flow:**

1. **You write code** on your Mac
2. **You commit** changes (`git commit`)
3. **You push** to GitHub (`git push`)
4. **Server fetches** the new code (`git pull`)
5. **Dependencies install** (`npm install`, etc.)
6. **Build runs** (if needed) — compile, bundle, minify
7. **Services restart** — Nginx, your app, etc.
8. **Site is live** with new changes

**Why this matters:** Understanding the flow helps you debug when deployments fail.

---

### Why We Use Git for Deployment

**The old way:**
```bash
# Edit file on your computer
# Upload via FTP
# Oh no, you overwrote something
# No way to undo
```

**The Git way:**
```bash
# Edit file
# Commit with message
# Push to GitHub
# Server pulls
# Can rollback instantly if broken
```

**Benefits:**
- **History** — know what changed and when
- **Rollback** — undo any change
- **Collaboration** — multiple people can deploy
- **Automation** — hooks can run tests, send notifications

---

### Build vs Runtime

**Build** (happens on your Mac or CI server):
- Compile TypeScript → JavaScript
- Bundle modules together
- Minify/optimize files
- Generate static assets

**Runtime** (happens on the VPS):
- Run the compiled code
- Serve requests
- Access database
- Handle user traffic

```
DEVELOPMENT              BUILD               PRODUCTION
┌─────────┐           ┌─────────┐          ┌─────────┐
│ src/    │  ───→    │ dist/   │  ───→   │ Server  │
│ .ts     │  compile │ .js     │  deploy │ runs    │
│ .scss   │  ───→    │ .css    │  ───→   │ the app │
└─────────┘           └─────────┘          └─────────┘
```

**Why this matters:** You don't put source files on the server. You put the *built* files.

---

### Rolling Back When Things Break

**Scenario:** You deployed, and the site is broken.

**Git rollback:**
```bash
# See what you deployed
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Deploy the fix
git push --force  # Careful! Rewrites history
```

**Safer rollback:**
```bash
# On server - go back to previous version
git log --oneline          # Find working commit hash
git checkout abc1234       # Go to that commit
# Or
git revert HEAD            # Create new commit that undoes last
```

**Why this matters:** Things will break. Knowing how to recover quickly is essential.

---

## CHAPTER 8: Common Commands Cheat Sheet

### Navigation

| Command | What it does | When to use |
|---------|--------------|-------------|
| `pwd` | Print working directory | "Where am I?" |
| `cd ~` | Go home | Return to your home folder |
| `cd ..` | Go up one level | Navigate out of a folder |
| `ls -la` | List all files detailed | See what's here, including hidden files |

### File Operations

| Command | What it does | Warning |
|---------|--------------|---------|
| `mkdir name` | Create folder | — |
| `touch file.txt` | Create empty file | — |
| `cp file newfile` | Copy file | Overwrites without asking |
| `mv file dest/` | Move file | Can overwrite destination |
| `rm file` | Delete file | **NO UNDO!** |
| `rm -r folder/` | Delete folder | **NO UNDO!** |
| `rm -rf /` | Delete everything | **NEVER RUN THIS** |

### Viewing Files

| Command | What it does | Best for |
|---------|--------------|----------|
| `cat file.txt` | Show entire file | Small files |
| `less file.txt` | Scroll through file | Large files |
| `head -20 file.txt` | Show first 20 lines | Checking top of logs |
| `tail -20 file.txt` | Show last 20 lines | Checking recent logs |
| `tail -f file.txt` | Watch file live | Monitoring logs in real-time |

### System

| Command | What it does | When to use |
|---------|--------------|-------------|
| `top` | Show running processes | "What's using CPU?" |
| `df -h` | Disk space usage | "Am I running out of space?" |
| `free -h` | Memory usage | "Do I need more RAM?" |
| `uptime` | How long server has been up | Quick health check |

### Git

| Command | What it does | When to use |
|---------|--------------|-------------|
| `git status` | See what changed | Before committing |
| `git add .` | Stage all changes | Prepare to commit |
| `git commit -m "msg"` | Save a snapshot | Record your work |
| `git push` | Upload to GitHub | Share your work |
| `git pull` | Download from GitHub | Get latest changes |
| `git log --oneline` | See commit history | Find old versions |

### Nginx

| Command | What it does | When to use |
|---------|--------------|-------------|
| `sudo nginx -t` | Test config | Before reloading |
| `sudo systemctl reload nginx` | Reload config | After config changes |
| `sudo systemctl restart nginx` | Full restart | If reload doesn't work |
| `sudo systemctl status nginx` | Check if running | Troubleshooting |

### SSH

| Command | What it does | When to use |
|---------|--------------|-------------|
| `ssh user@ip` | Connect to server | Remote management |
| `ssh -i key.pem user@ip` | Connect with key file | AWS, specific keys |
| `scp file user@ip:/path` | Copy file to server | Upload files |
| `exit` | Close SSH session | Done working |

---

### ⚠️ WARNING SIGNS — When NOT to Run Something

**STOP and think if you see:**

| Red Flag | Why it's dangerous |
|----------|-------------------|
| `rm -rf /` or `rm -rf /*` | Deletes EVERYTHING on the system |
| `sudo` + command you don't understand | Runs as root — can break system |
| `>` in a command | Overwrites files without asking |
| `chmod -R 777` | Gives everyone full access — security risk |
| `dd if=` | Low-level disk operations — can erase drives |
| Pasting commands from the internet | Could be malicious |

**Golden rule:** If you don't know what it does, don't run it. Look it up first.

---

## Quick Reference: Reading the Terminal

### Color Meanings (in `ls`)

| Color | Meaning |
|-------|---------|
| White | Regular file |
| Blue | Directory (folder) |
| Green | Executable program |
| Cyan | Symbolic link (shortcut) |
| Yellow | Device file |
| Red | Archive/compressed |

### Common Error Messages

| Error | What it means | Fix |
|-------|---------------|-----|
| `Permission denied` | You can't do that | Check ownership, use `sudo` if appropriate |
| `No such file or directory` | Wrong path | Check `pwd`, use `ls` |
| `Command not found` | Typo or not installed | Check spelling, install package |
| `Connection refused` | SSH/service not running | Check server status, firewall |
| `Disk full` | Out of space | `df -h`, clean up files |

---

## Remember These Principles

1. **Terminal has no undo.** Be careful with `rm`, `>`, and `sudo`.

2. **Absolute paths start with `/`.** Relative paths depend on where you are.

3. **Git is your safety net.** Commit often, push regularly.

4. **Test before deploying.** `nginx -t` for configs, test locally for code.

5. **Backups save lives.** If it's important, have a copy somewhere else.

6. **Google is your friend.** Everyone looks things up. Even experts.

7. **One thing at a time.** Make one change, test it, then move on.

---

## You're Ready

You now understand:
- ✅ How websites actually work
- ✅ How to use the terminal
- ✅ How to connect to servers with SSH
- ✅ How to manage code with Git
- ✅ How web servers serve your site
- ✅ How Linux organizes files
- ✅ How to deploy changes safely

**Next steps:**
- Practice the commands
- Break things (on a test server)
- Fix them
- Repeat

You've got this, Blake. 🚀

---

*Last updated: February 2026*
