-- Tabel OIDC Clients
CREATE TABLE public.oidc_clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    client_id TEXT NOT NULL UNIQUE,
    client_secret TEXT NOT NULL,
    redirect_uri TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    last_used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Mengaktifkan RLS untuk oidc_clients
ALTER TABLE public.oidc_clients ENABLE ROW LEVEL SECURITY;

-- Policy: Hanya user dengan role Administrator yang bisa akses oidc_clients
CREATE POLICY "Admins can manage OIDC clients" 
ON public.oidc_clients 
FOR ALL 
TO authenticated 
USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('Administrator', 'Super Admin')
);

-- Tabel Webhooks
CREATE TABLE public.webhooks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    events TEXT[] NOT NULL,
    status TEXT DEFAULT 'active',
    last_fired_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Mengaktifkan RLS untuk webhooks
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;

-- Policy: Hanya user dengan role Administrator yang bisa akses webhooks
CREATE POLICY "Admins can manage Webhooks" 
ON public.webhooks 
FOR ALL 
TO authenticated 
USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('Administrator', 'Super Admin')
);
