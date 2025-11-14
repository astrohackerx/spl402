/*
  # Add anonymous access policies for server registration

  1. Policy Changes
    - Add policy for anon role to insert into `api_servers` table
    - Add policy for anon role to insert into `verification_logs` table
    - These policies allow the registration server to write data without service role key

  2. Security Notes
    - Anon role can only INSERT, not UPDATE or DELETE
    - Data validation happens in application layer before insertion
    - RLS still protects data access based on existing policies
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'api_servers' 
    AND policyname = 'Anon can register servers'
  ) THEN
    CREATE POLICY "Anon can register servers"
      ON api_servers
      FOR INSERT
      TO anon
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'verification_logs' 
    AND policyname = 'Anon can create verification logs'
  ) THEN
    CREATE POLICY "Anon can create verification logs"
      ON verification_logs
      FOR INSERT
      TO anon
      WITH CHECK (true);
  END IF;
END $$;
