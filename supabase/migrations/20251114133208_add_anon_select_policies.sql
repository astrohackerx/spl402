/*
  # Add anonymous SELECT policies for frontend

  1. Policy Changes
    - Add anon SELECT policy on `api_servers` table (frontend needs to read server list)
    - Add anon SELECT policy on `verification_logs` table (frontend may need to read logs)

  2. Security Notes
    - Anon can only SELECT (read) data, not modify
    - Server uses service role key for INSERT/UPDATE/DELETE operations
*/

CREATE POLICY "Anon can read servers"
  ON api_servers
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anon can read verification logs"
  ON verification_logs
  FOR SELECT
  TO anon
  USING (true);
