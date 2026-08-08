-- ==============================================================================
-- SETUP SINKRONISASI USER (auth.users -> public.profiles)
-- Jalankan skrip ini di SQL Editor Supabase Anda
-- ==============================================================================

-- 1. Buat Tabel Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'Guest',
    avatar_url TEXT,
    department TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Aktifkan Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Siapa pun yang login bisa melihat profil pengguna (dibutuhkan untuk tabel Admin)
CREATE POLICY "Public profiles are viewable by authenticated users" 
ON public.profiles FOR SELECT 
TO authenticated 
USING (true);

-- Super Admin dan Administrator bisa mengubah profil (role, dll)
CREATE POLICY "Admins can update profiles" 
ON public.profiles FOR UPDATE 
TO authenticated 
USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('Administrator', 'Super Admin')
);

-- Pengguna bisa update profilnya sendiri
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

-- 4. Fungsi & Trigger untuk sinkronisasi otomatis saat Register
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, avatar_url, department)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_app_meta_data->>'role', 'Guest'),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'department'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5. Konfigurasi Realtime (Agar UI langsung update saat ada pengguna baru/perubahan role)
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;

-- 6. Backfill Data Pengguna yang Sudah Ada
-- Script ini akan menyalin user yang sudah terdaftar di auth.users ke public.profiles
INSERT INTO public.profiles (id, email, full_name, role, avatar_url, department)
SELECT 
    id, 
    email, 
    raw_user_meta_data->>'full_name',
    COALESCE(raw_app_meta_data->>'role', 'Guest'),
    raw_user_meta_data->>'avatar_url',
    raw_user_meta_data->>'department'
FROM auth.users
ON CONFLICT (id) DO NOTHING;
