import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// FCM Server Key (получите из Firebase Console)
const FCM_SERVER_KEY = Deno.env.get('FCM_SERVER_KEY') || 'AIzaSyAx9bS5wZ7ryuV73gcWKDbUu8-ZyRlJx6M';

interface NotificationRequest {
  title: string;
  message: string;
  userId: string;
  type: string;
  habitId?: string;
  data?: Record<string, any>;
}

// Функция отправки FCM уведомления
async function sendFCMNotification(token: string, notification: NotificationRequest) {
  const fcmMessage = {
    to: token,
    notification: {
      title: notification.title,
      body: notification.message,
    },
    data: {
      type: notification.type || 'general',
      habitId: notification.habitId || '',
      ...notification.data,
    },
    priority: 'high',
  };

  const response = await fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers: {
      'Authorization': `key=${FCM_SERVER_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(fcmMessage),
  });

  if (!response.ok) {
    throw new Error(`FCM request failed: ${response.status}`);
  }

  return await response.json();
}

interface UserToken {
  id: string;
  user_id: string;
  push_token: string;
  platform: string;
  updated_at: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { title, message, userId, type, habitId }: NotificationRequest = await req.json()

    if (!title || !message || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get user's push tokens
    const { data: tokens, error: tokensError } = await supabaseClient
      .from('user_tokens')
      .select('push_token, platform')
      .eq('user_id', userId)
      .not('push_token', 'is', null)

    if (tokensError) {
      console.error('Error fetching user tokens:', tokensError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch user tokens' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!tokens || tokens.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No push tokens found for user' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Send notifications to all user's devices
    const notificationResults = await Promise.allSettled(
      tokens.map(async (tokenData) => {
        const notificationPayload = {
          to: tokenData.push_token,
          title,
          body: message,
          data: {
            type,
            habitId,
            userId,
            timestamp: new Date().toISOString(),
          },
          sound: 'default',
          priority: 'high',
        }

        // For Android (FCM)
        if (tokenData.platform === 'android') {
          const fcmResponse = await fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'POST',
            headers: {
              'Authorization': `key=${FCM_SERVER_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(notificationPayload),
          })

          if (!fcmResponse.ok) {
            throw new Error(`FCM error: ${fcmResponse.status}`)
          }

          return await fcmResponse.json()
        }

        // For iOS (APNs) - если понадобится в будущем
        if (tokenData.platform === 'ios') {
          // Здесь можно добавить логику для APNs
          console.log('iOS notification would be sent:', notificationPayload)
          return { success: true, platform: 'ios' }
        }

        return { success: false, error: 'Unsupported platform' }
      })
    )

    // Log results
    const successful = notificationResults.filter(result => 
      result.status === 'fulfilled' && result.value.success !== false
    ).length

    const failed = notificationResults.filter(result => 
      result.status === 'rejected' || result.value?.success === false
    ).length

    console.log(`Notifications sent: ${successful} successful, ${failed} failed`)

    // Log notification to database
    const { error: logError } = await supabaseClient
      .from('notification_logs')
      .insert({
        user_id: userId,
        title,
        message,
        type,
        habit_id: habitId,
        sent_at: new Date().toISOString(),
        success_count: successful,
        failure_count: failed,
      })

    if (logError) {
      console.error('Error logging notification:', logError)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        sent: successful, 
        failed,
        message: 'Notifications processed' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in send-notification function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
