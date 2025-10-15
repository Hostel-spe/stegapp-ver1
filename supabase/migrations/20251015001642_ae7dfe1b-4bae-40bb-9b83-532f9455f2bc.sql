-- Add UPDATE policy for files table to allow users to update their own files
CREATE POLICY "Users can update their own files"
ON public.files
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add admin UPDATE policy for files table
CREATE POLICY "Admins can update any files"
ON public.files
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::app_role));