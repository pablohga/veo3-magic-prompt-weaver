// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://utypfdcnprkhjvcyoqdc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0eXBmZGNucHJraGp2Y3lvcWRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2ODY2NjUsImV4cCI6MjA2NjI2MjY2NX0.rXRSp4x64ZtTstpSwuUEVeqOcxdpEV6E-aa-YEbU4hY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);