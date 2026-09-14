create or replace function public.delete_own_account()
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    raise exception 'Not authenticated';
  end if;

  delete from public.user_favorites where user_id = current_user_id;
  delete from public.lesson_completions where user_id = current_user_id;
  delete from public.quran_state where user_id = current_user_id;
  delete from public.prayer_daily_log where user_id = current_user_id;
  delete from public.user_notification_prefs where user_id = current_user_id;
  delete from public.user_preferences where user_id = current_user_id;
  delete from public.worship_tools where user_id = current_user_id;
  delete from public.profiles where id = current_user_id;
  delete from auth.users where id = current_user_id;
end;
$$;

revoke all on function public.delete_own_account() from public;
grant execute on function public.delete_own_account() to authenticated;
