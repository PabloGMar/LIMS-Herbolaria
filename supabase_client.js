/**
 * SUPABASE CLIENT CONFIGURATION
 * This file replaces ConexionSupabase.gs for frontend usage.
 */

// These should ideally be environment variables, but for this standalone migration,
// we'll keep them here as they were in the original code.
const SUPABASE_URL = "https://lbemzbaytsrtbmkskder.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiZW16YmF5dHNydGJta3NrZGVyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzQwMjM2MywiZXhwIjoyMDkyOTc4MzYzfQ.GTwONBiJFNsU7gEYSonT-EfcI95E0Swq3iaRGDGD8u0";

// Initialize the Supabase client as 'sb' to avoid naming conflicts
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

console.log("Supabase Client Initialized");
