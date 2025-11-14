/*
  # Remove anonymous access policies

  1. Policy Changes
    - Drop anon INSERT policies from `api_servers` table
    - Drop anon INSERT policies from `verification_logs` table
    - Server will use service role key which bypasses RLS

  2. Security Notes
    - Service role key has full access and bypasses RLS
    - Only use service role key in trusted server environments
    - Never expose service role key in client code
*/

DROP POLICY IF EXISTS "Anon can register servers" ON api_servers;
DROP POLICY IF EXISTS "Anon can create verification logs" ON verification_logs;
