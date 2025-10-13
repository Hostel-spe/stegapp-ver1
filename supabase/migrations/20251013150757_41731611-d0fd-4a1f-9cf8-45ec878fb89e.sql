-- Add passphrase_hash column to files table for record keeping
ALTER TABLE public.files 
ADD COLUMN passphrase_hash text;