/**
 * ============================================================
 *  EduCore — Database Service
 *  File: js/db.service.js
 *  Purpose: Single abstraction layer for ALL database calls.
 *           Reads DB_CONFIG.provider and routes to Supabase
 *           OR local REST API automatically. Switch provider
 *           in config/db.config.js — zero code changes here.
 * ============================================================
 */

import DB_CONFIG from '../config/db.config.js';

/* ── SUPABASE CLIENT (lazy init) ──────────────────────────── */
let _sb = null;

function getSupabase() {
  if (_sb) return _sb;
  const { createClient } = window.supabase;
  _sb = createClient(DB_CONFIG.supabase.url, DB_CONFIG.supabase.anonKey);
  return _sb;
}

/* ── GENERIC FETCH WRAPPER (local REST) ───────────────────── */
async function localFetch(endpoint, options = {}) {
  const url  = DB_CONFIG.local.apiBase + endpoint;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), DB_CONFIG.local.timeout);
  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      signal: ctrl.signal,
      ...options,
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

/* ── UNIFIED DB API ───────────────────────────────────────── */
const DB = {

  /**
   * SELECT all rows from a table.
   * @param {string} table - table name key from DB_CONFIG.tables
   * @param {object} opts  - { orderBy, ascending, limit, filters }
   */
  async getAll(table, opts = {}) {
    const t = DB_CONFIG.tables[table] || table;

    if (DB_CONFIG.provider === 'supabase') {
      let q = getSupabase().from(t).select('*');
      if (opts.orderBy)   q = q.order(opts.orderBy, { ascending: opts.ascending ?? false });
      if (opts.limit)     q = q.limit(opts.limit);
      if (opts.filters)   opts.filters.forEach(f => { q = q.eq(f.col, f.val); });
      const { data, error } = await q;
      if (error) throw error;
      return data;
    }

    // Local REST
    const params = new URLSearchParams();
    if (opts.orderBy) params.set('orderBy', opts.orderBy);
    if (opts.limit)   params.set('limit', opts.limit);
    return localFetch(`/${t}?${params}`);
  },

  /**
   * SELECT a single row by ID.
   */
  async getById(table, id) {
    const t = DB_CONFIG.tables[table] || table;

    if (DB_CONFIG.provider === 'supabase') {
      const { data, error } = await getSupabase().from(t).select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    }
    return localFetch(`/${t}/${id}`);
  },

  /**
   * INSERT a new row. Returns the inserted row.
   */
  async insert(table, payload) {
    const t = DB_CONFIG.tables[table] || table;

    if (DB_CONFIG.provider === 'supabase') {
      const { data, error } = await getSupabase().from(t).insert([payload]).select().single();
      if (error) throw error;
      return data;
    }
    return localFetch(`/${t}`, { method: 'POST', body: JSON.stringify(payload) });
  },

  /**
   * UPDATE an existing row by ID. Returns the updated row.
   */
  async update(table, id, payload) {
    const t = DB_CONFIG.tables[table] || table;

    if (DB_CONFIG.provider === 'supabase') {
      const { data, error } = await getSupabase().from(t).update(payload).eq('id', id).select().single();
      if (error) throw error;
      return data;
    }
    return localFetch(`/${t}/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  },

  /**
   * DELETE a row by ID.
   */
  async delete(table, id) {
    const t = DB_CONFIG.tables[table] || table;

    if (DB_CONFIG.provider === 'supabase') {
      const { error } = await getSupabase().from(t).delete().eq('id', id);
      if (error) throw error;
      return true;
    }
    return localFetch(`/${t}/${id}`, { method: 'DELETE' });
  },

  /**
   * SEARCH rows where a column contains a string.
   */
  async search(table, column, query) {
    const t = DB_CONFIG.tables[table] || table;

    if (DB_CONFIG.provider === 'supabase') {
      const { data, error } = await getSupabase()
        .from(t).select('*').ilike(column, `%${query}%`);
      if (error) throw error;
      return data;
    }
    return localFetch(`/${t}?search=${encodeURIComponent(query)}&col=${column}`);
  },

  /* ── STORAGE ─────────────────────────────────────────────── */

  /**
   * Upload a file to storage. Returns public URL.
   */
  async uploadFile(bucket, path, file) {
    if (DB_CONFIG.provider === 'supabase') {
      const sb = getSupabase();
      const { error: upErr } = await sb.storage.from(bucket).upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data } = sb.storage.from(bucket).getPublicUrl(path);
      return data.publicUrl;
    }
    // Local: send multipart form
    const form = new FormData();
    form.append('file', file);
    form.append('path', path);
    const res = await fetch(`${DB_CONFIG.local.apiBase}/upload/${bucket}`, { method: 'POST', body: form });
    const json = await res.json();
    return json.url;
  },

  /* ── AUTH ────────────────────────────────────────────────── */

  async signIn(email, password) {
    if (DB_CONFIG.provider === 'supabase') {
      const { data, error } = await getSupabase().auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    }
    return localFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  },

  async signOut() {
    if (DB_CONFIG.provider === 'supabase') {
      await getSupabase().auth.signOut();
      return;
    }
    return localFetch('/auth/logout', { method: 'POST' });
  },

  async getSession() {
    if (DB_CONFIG.provider === 'supabase') {
      const { data: { session } } = await getSupabase().auth.getSession();
      return session;
    }
    const token = localStorage.getItem('edu_token');
    return token ? { token } : null;
  },
};

export default DB;
