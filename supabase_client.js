/**
 * SUPABASE CLIENT CONFIGURATION
 */

const SUPABASE_URL = "https://lbemzbaytsrtbmkskder.supabase.co";
// Usando la Anon Public Key (JWT) proporcionada
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiZW16YmF5dHNydGJta3NrZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0MDIzNjMsImV4cCI6MjA5Mjk3ODM2M30.dykIfpX7gBmcIvv88GqxRfJU-ac_mzhlynQ6HWKQvk0";

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

console.log("Supabase Client Initialized with Clean Anon Key");
