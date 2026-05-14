/**
 * SUPABASE CLIENT CONFIGURATION
 * This file replaces ConexionSupabase.gs for frontend usage.
 */

// These should ideally be environment variables, but for this standalone migration,
// we'll keep them here as they were in the original code.
const SUPABASE_URL = "https://lbemzbaytsrtbmkskder.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiZW16YmF5dHNydGJta3NrZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0MDIzNjMsImV4cCI6MjA5Mjk3ODM2M30.dykIfpX7gBmcIvv88GqxRfJU-ac_mzhlynQ6HWKQvk0.GTwONBiJFNsU7gEYSonT-EfcI95E0Swq3iaRGDGD8u0";

// Initialize the Supabase client as 'sb' to avoid naming conflicts
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

console.log("Supabase Client Initialized");
