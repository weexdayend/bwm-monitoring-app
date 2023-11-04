import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { PostgrestError, createClient } from '@supabase/supabase-js'
import { Database } from './type'

const supabaseUrl = "https://opjfwqrwssdclbmybhso.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wamZ3cXJ3c3NkY2xibXliaHNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYxMzk2OTksImV4cCI6MjAxMTcxNTY5OX0.V2K6qHQHm-Grg-O185yApv-LCoWri5AbK5fKMCE_Hc0"

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

export type DbResult<T> = T extends PromiseLike<infer U> ? U : never
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never
export type DbResultErr = PostgrestError