-- Add DELETE policies for stego-files storage bucket
CREATE POLICY "Users can delete their own stego files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'stego-files' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can delete any stego files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'stego-files' AND
  public.has_role(auth.uid(), 'admin'::app_role)
);