# Supabase Migrations

This directory contains SQL migration files for the SPL402 database schema.

## How to Apply Migrations

### Option 1: Using Supabase CLI

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Apply all migrations
supabase db push
```

### Option 2: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of the migration file
4. Execute the SQL

### Option 3: Using the MCP Tool (in Claude Code)

The migrations in this directory were originally applied using:
```
mcp__supabase__apply_migration
```

## Migration Files

- `20251114120636_create_spl402_tables.sql` - Initial schema for SPL402 API server registry, stats, and verification logs

## Schema Overview

### Tables Created

1. **api_servers** - Registry of verified API servers
2. **server_stats** - Usage metrics for each server
3. **verification_logs** - Audit trail for attestation verifications

All tables have Row Level Security (RLS) enabled with appropriate policies.
