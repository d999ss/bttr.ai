# 🗄️ Vercel Postgres Setup Guide

## Quick Setup (5 minutes)

### Step 1: Go to your Vercel Dashboard
1. Visit [vercel.com](https://vercel.com) and log in
2. Select your **bttr-ai** project

### Step 2: Add Postgres Storage
1. Click on the **Storage** tab in your project
2. Click **Create Database**
3. Select **Postgres** 
4. Choose a database name (e.g., "bttr-conversations")
5. Select your region (closest to you)
6. Click **Create**

### Step 3: Connect to Your Project
1. Vercel will automatically add these environment variables:
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`
   - `POSTGRES_USER`
   - `POSTGRES_HOST`
   - `POSTGRES_PASSWORD`
   - `POSTGRES_DATABASE`

2. Click **Connect** to link the database to your project

### Step 4: Pull Environment Variables Locally
Run this command in your terminal:
```bash
vercel env pull .env.local
```

### Step 5: Initialize Database Tables
After deployment, visit this URL once to create the tables:
```
https://bttr-ai.com/api/init-database
```

(You can also test locally first at http://localhost:3001/api/init-database)

## 🎉 That's it! 

Your conversations will now be permanently stored and survive all deployments.

## 📊 What You Get:

✅ **Permanent Storage** - Never lose conversation data again
✅ **Unlimited History** - Store millions of conversations
✅ **Advanced Analytics** - Query and analyze user patterns
✅ **Fast Performance** - Optimized indexes for quick retrieval
✅ **Automatic Backups** - Vercel handles all backups

## 💰 Pricing:

- **Hobby (Free)**: 60 hours/month compute time
- **Pro ($20/month)**: Unlimited for most businesses
- Your usage will likely stay in the free tier!

## 🔍 Viewing Your Data:

1. In Vercel Dashboard, go to Storage → Your Database
2. Click **Query** to run SQL queries
3. Example queries:
   ```sql
   -- See all conversations
   SELECT * FROM conversations ORDER BY created_at DESC LIMIT 10;
   
   -- Today's conversations
   SELECT COUNT(*) FROM conversations WHERE DATE(created_at) = CURRENT_DATE;
   
   -- Most active users
   SELECT session_id, COUNT(*) as message_count 
   FROM messages 
   GROUP BY session_id 
   ORDER BY message_count DESC 
   LIMIT 10;
   ```

## 🚨 Troubleshooting:

If you see "Database not configured":
1. Make sure you've connected the database in Vercel
2. Pull the environment variables: `vercel env pull .env.local`
3. Restart your dev server

## 🔐 Security:

- All data is encrypted at rest
- SSL/TLS encryption in transit
- Automatic backups every 24 hours
- GDPR compliant infrastructure

---

Need help? The database setup is the same for all Vercel projects, so their [official docs](https://vercel.com/docs/storage/vercel-postgres) have lots of examples!