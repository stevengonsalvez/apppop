SELECT id, raw_user_meta_data FROM auth.users ORDER BY created_at DESC LIMIT 1;

SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';