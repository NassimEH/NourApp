import { isSupabaseConfigured, supabase } from "./client";

/** ID utilisateur connecté, ou null (invité / non configuré). */
export async function getAuthenticatedUserId(): Promise<string | null> {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) return null;
  return data.session?.user?.id ?? null;
}

export type FavoriteKind = "quran" | "hadith" | "dua";

export async function replaceFavorites(
  userId: string,
  kind: FavoriteKind,
  items: { refKey: string; metadata: Record<string, unknown>; addedAt?: string | number }[]
): Promise<void> {
  const { error: delError } = await supabase
    .from("user_favorites")
    .delete()
    .eq("user_id", userId)
    .eq("kind", kind);
  if (delError) throw delError;

  if (items.length === 0) return;

  const rows = items.map((item) => ({
    user_id: userId,
    kind,
    ref_key: item.refKey,
    metadata: item.metadata,
    added_at:
      item.addedAt != null
        ? typeof item.addedAt === "number"
          ? new Date(item.addedAt).toISOString()
          : item.addedAt
        : new Date().toISOString(),
  }));

  const { error } = await supabase.from("user_favorites").insert(rows);
  if (error) throw error;
}

export async function fetchFavorites(
  userId: string,
  kind: FavoriteKind
): Promise<{ ref_key: string; metadata: Record<string, unknown>; added_at: string }[]> {
  const { data, error } = await supabase
    .from("user_favorites")
    .select("ref_key, metadata, added_at")
    .eq("user_id", userId)
    .eq("kind", kind)
    .order("added_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as {
    ref_key: string;
    metadata: Record<string, unknown>;
    added_at: string;
  }[];
}

export async function upsertUserPreferences(
  userId: string,
  prefs: Record<string, unknown>
): Promise<void> {
  const { error } = await supabase.from("user_preferences").upsert(
    {
      user_id: userId,
      prefs,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );
  if (error) throw error;
}

export async function fetchUserPreferences(
  userId: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase
    .from("user_preferences")
    .select("prefs")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return (data?.prefs as Record<string, unknown>) ?? {};
}

export async function fetchLessonCompletions(
  userId: string,
  courseId: string
): Promise<string[]> {
  const { data, error } = await supabase
    .from("lesson_completions")
    .select("lesson_id")
    .eq("user_id", userId)
    .eq("course_id", courseId);
  if (error) throw error;
  return (data ?? []).map((r) => r.lesson_id as string);
}

export async function upsertLessonCompletion(
  userId: string,
  courseId: string,
  lessonId: string
): Promise<void> {
  const { error } = await supabase.from("lesson_completions").upsert(
    {
      user_id: userId,
      course_id: courseId,
      lesson_id: lessonId,
      completed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,course_id,lesson_id" }
  );
  if (error) throw error;
}

export async function replaceLessonCompletions(
  userId: string,
  courseId: string,
  lessonIds: string[]
): Promise<void> {
  await supabase
    .from("lesson_completions")
    .delete()
    .eq("user_id", userId)
    .eq("course_id", courseId);

  if (lessonIds.length === 0) return;

  const { error } = await supabase.from("lesson_completions").insert(
    lessonIds.map((lesson_id) => ({
      user_id: userId,
      course_id: courseId,
      lesson_id,
    }))
  );
  if (error) throw error;
}

export type QuranStateRow = {
  last_read: Record<string, unknown> | null;
  last_listen: Record<string, unknown> | null;
  recent_suras: number[];
};

export async function fetchQuranState(userId: string): Promise<QuranStateRow | null> {
  const { data, error } = await supabase
    .from("quran_state")
    .select("last_read, last_listen, recent_suras")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    last_read: data.last_read as Record<string, unknown> | null,
    last_listen: data.last_listen as Record<string, unknown> | null,
    recent_suras: Array.isArray(data.recent_suras)
      ? (data.recent_suras as number[])
      : [],
  };
}

export async function upsertQuranState(
  userId: string,
  state: Partial<QuranStateRow>
): Promise<void> {
  const { error } = await supabase.from("quran_state").upsert(
    {
      user_id: userId,
      ...state,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );
  if (error) throw error;
}

export type WorshipToolsRow = {
  dhikr_count: number;
  dhikr_daily_goal: number;
  sadaqa_monthly_goal: number | null;
  sadaqa_month_done: Record<string, unknown> | null;
  weekly_learning: Record<string, unknown> | null;
};

export async function fetchWorshipTools(userId: string): Promise<WorshipToolsRow | null> {
  const { data, error } = await supabase
    .from("worship_tools")
    .select(
      "dhikr_count, dhikr_daily_goal, sadaqa_monthly_goal, sadaqa_month_done, weekly_learning"
    )
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return data as WorshipToolsRow;
}

export async function upsertWorshipTools(
  userId: string,
  row: Partial<WorshipToolsRow>
): Promise<void> {
  const { error } = await supabase.from("worship_tools").upsert(
    {
      user_id: userId,
      ...row,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );
  if (error) throw error;
}

export async function fetchPrayerLog(
  userId: string,
  logDate: string
): Promise<Record<string, boolean>> {
  const { data, error } = await supabase
    .from("prayer_daily_log")
    .select("prayers")
    .eq("user_id", userId)
    .eq("log_date", logDate)
    .maybeSingle();
  if (error) throw error;
  return (data?.prayers as Record<string, boolean>) ?? {};
}

export async function upsertPrayerLog(
  userId: string,
  logDate: string,
  prayers: Record<string, boolean>
): Promise<void> {
  const { error } = await supabase.from("prayer_daily_log").upsert(
    {
      user_id: userId,
      log_date: logDate,
      prayers,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,log_date" }
  );
  if (error) throw error;
}

export type NotificationPrefsRow = {
  prayer_enabled: boolean;
  hadith_reminder_enabled: boolean;
  lesson_reminder_enabled: boolean;
};

export async function fetchNotificationPrefs(
  userId: string
): Promise<NotificationPrefsRow | null> {
  const { data, error } = await supabase
    .from("user_notification_prefs")
    .select("prayer_enabled, hadith_reminder_enabled, lesson_reminder_enabled")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data as NotificationPrefsRow | null;
}

export async function upsertNotificationPrefs(
  userId: string,
  prefs: NotificationPrefsRow
): Promise<void> {
  const { error } = await supabase.from("user_notification_prefs").upsert(
    {
      user_id: userId,
      ...prefs,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );
  if (error) throw error;
}

export async function upsertProfile(
  userId: string,
  patch: { display_name?: string; avatar_url?: string }
): Promise<void> {
  const { error } = await supabase.from("profiles").upsert(
    {
      id: userId,
      ...patch,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );
  if (error) throw error;
}

export async function uploadAvatar(
  userId: string,
  localUri: string
): Promise<string | null> {
  try {
    const response = await fetch(localUri);
    const blob = await response.blob();
    const path = `${userId}/avatar.jpg`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, blob, { upsert: true, contentType: "image/jpeg" });
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    const publicUrl = data.publicUrl;
    await upsertProfile(userId, { avatar_url: publicUrl });
    return publicUrl;
  } catch (e) {
    console.warn("uploadAvatar", e);
    return null;
  }
}
