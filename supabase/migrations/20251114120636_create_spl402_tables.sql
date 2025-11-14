/*
  # SPL402 Database Schema - API Server Registry and Attestations

  ## Overview
  This migration creates the database structure for the SPL402 decentralized API network,
  storing verified API servers, their attestations, and transaction history.

  ## New Tables

  ### `api_servers`
  Stores registered API servers in the SPL402 network
  - `id` (uuid, primary key) - Unique server identifier
  - `wallet_address` (text, unique, not null) - Solana wallet address of the server operator
  - `api_endpoint` (text, not null) - URL endpoint of the API server
  - `description` (text) - Description of the API service
  - `contact` (text) - Contact information for the server operator
  - `is_verified` (boolean, default false) - Whether server has valid SAS attestation
  - `attestation_address` (text) - On-chain SAS attestation PDA address
  - `schema_version` (integer, default 1) - SAS schema version used
  - `created_at` (timestamptz, default now()) - Registration timestamp
  - `updated_at` (timestamptz, default now()) - Last update timestamp
  - `last_verified_at` (timestamptz) - Last attestation verification timestamp

  ### `server_stats`
  Tracks usage statistics for API servers
  - `id` (uuid, primary key) - Unique stat record identifier
  - `server_id` (uuid, foreign key) - References api_servers.id
  - `total_requests` (bigint, default 0) - Total API requests processed
  - `total_payments` (bigint, default 0) - Total payments received in lamports
  - `unique_clients` (integer, default 0) - Number of unique client wallets
  - `last_request_at` (timestamptz) - Timestamp of last API request
  - `updated_at` (timestamptz, default now()) - Last update timestamp

  ### `verification_logs`
  Audit trail for attestation verifications
  - `id` (uuid, primary key) - Unique log entry identifier
  - `server_id` (uuid, foreign key) - References api_servers.id
  - `verification_status` (text, not null) - Status: 'success', 'failed', 'pending'
  - `attestation_data` (jsonb) - Full attestation data from SAS
  - `error_message` (text) - Error details if verification failed
  - `verified_by` (text) - Wallet address that triggered verification
  - `created_at` (timestamptz, default now()) - Verification attempt timestamp

  ## Security

  ### Row Level Security (RLS)
  - All tables have RLS enabled
  - Public read access for verified servers and stats
  - Write access restricted to authenticated server operators
  - Server operators can only modify their own records

  ## Indexes
  - Fast lookups by wallet address
  - Efficient queries on verification status
  - Optimized timestamp-based queries
*/

-- Create api_servers table
CREATE TABLE IF NOT EXISTS api_servers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text UNIQUE NOT NULL,
  api_endpoint text NOT NULL,
  description text DEFAULT '',
  contact text DEFAULT '',
  is_verified boolean DEFAULT false,
  attestation_address text,
  schema_version integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_verified_at timestamptz
);

-- Create server_stats table
CREATE TABLE IF NOT EXISTS server_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id uuid NOT NULL REFERENCES api_servers(id) ON DELETE CASCADE,
  total_requests bigint DEFAULT 0,
  total_payments bigint DEFAULT 0,
  unique_clients integer DEFAULT 0,
  last_request_at timestamptz,
  updated_at timestamptz DEFAULT now()
);

-- Create verification_logs table
CREATE TABLE IF NOT EXISTS verification_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id uuid NOT NULL REFERENCES api_servers(id) ON DELETE CASCADE,
  verification_status text NOT NULL,
  attestation_data jsonb,
  error_message text,
  verified_by text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_api_servers_wallet ON api_servers(wallet_address);
CREATE INDEX IF NOT EXISTS idx_api_servers_verified ON api_servers(is_verified);
CREATE INDEX IF NOT EXISTS idx_server_stats_server_id ON server_stats(server_id);
CREATE INDEX IF NOT EXISTS idx_verification_logs_server_id ON verification_logs(server_id);
CREATE INDEX IF NOT EXISTS idx_verification_logs_created_at ON verification_logs(created_at DESC);

-- Enable Row Level Security
ALTER TABLE api_servers ENABLE ROW LEVEL SECURITY;
ALTER TABLE server_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for api_servers

-- Anyone can view verified servers
CREATE POLICY "Public can view verified servers"
  ON api_servers FOR SELECT
  USING (is_verified = true);

-- Authenticated users can view all servers
CREATE POLICY "Authenticated users can view all servers"
  ON api_servers FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can insert their own server
CREATE POLICY "Users can register their server"
  ON api_servers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Server operators can update their own records
CREATE POLICY "Users can update own server"
  ON api_servers FOR UPDATE
  TO authenticated
  USING (wallet_address = (SELECT raw_user_meta_data->>'wallet_address' FROM auth.users WHERE id = auth.uid()))
  WITH CHECK (wallet_address = (SELECT raw_user_meta_data->>'wallet_address' FROM auth.users WHERE id = auth.uid()));

-- RLS Policies for server_stats

-- Anyone can view stats for verified servers
CREATE POLICY "Public can view stats for verified servers"
  ON server_stats FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM api_servers
      WHERE api_servers.id = server_stats.server_id
      AND api_servers.is_verified = true
    )
  );

-- Authenticated users can view all stats
CREATE POLICY "Authenticated users can view all stats"
  ON server_stats FOR SELECT
  TO authenticated
  USING (true);

-- Server operators can update their own stats
CREATE POLICY "Users can update own server stats"
  ON server_stats FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM api_servers
      WHERE api_servers.id = server_stats.server_id
      AND api_servers.wallet_address = (SELECT raw_user_meta_data->>'wallet_address' FROM auth.users WHERE id = auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM api_servers
      WHERE api_servers.id = server_stats.server_id
      AND api_servers.wallet_address = (SELECT raw_user_meta_data->>'wallet_address' FROM auth.users WHERE id = auth.uid())
    )
  );

-- RLS Policies for verification_logs

-- Anyone can view logs for verified servers
CREATE POLICY "Public can view verification logs for verified servers"
  ON verification_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM api_servers
      WHERE api_servers.id = verification_logs.server_id
      AND api_servers.is_verified = true
    )
  );

-- Authenticated users can view all logs
CREATE POLICY "Authenticated users can view all verification logs"
  ON verification_logs FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can create verification logs
CREATE POLICY "Authenticated users can create verification logs"
  ON verification_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_api_servers_updated_at
  BEFORE UPDATE ON api_servers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_server_stats_updated_at
  BEFORE UPDATE ON server_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
