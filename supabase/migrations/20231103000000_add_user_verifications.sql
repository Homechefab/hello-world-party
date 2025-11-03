-- Create user_verifications table
create table user_verifications (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null,
    email_verified boolean default false,
    phone_verified boolean default false,
    identity_verified boolean default false,
    business_verified boolean default false,
    two_factor_enabled boolean default false,
    identity_document_url text,
    business_id text,
    business_documents text[],
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    
    constraint user_verifications_user_id_key unique (user_id)
);

-- Enable RLS
alter table user_verifications enable row level security;

-- Create policies
create policy "Users can view their own verification status"
    on user_verifications for select
    using (auth.uid() = user_id);

create policy "Users can update their own verification status"
    on user_verifications for update
    using (auth.uid() = user_id);

-- Create function to handle user_verification creation on user signup
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
    insert into public.user_verifications (user_id)
    values (new.id);
    return new;
end;
$$;

-- Create trigger for new user signup
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

-- Update types.ts
comment on table user_verifications is '@supabase:types User verification status and documents';