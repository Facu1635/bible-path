'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type SubscriptionStatus = 'loading' | 'trial' | 'active' | 'expired' | 'free';

export function useSubscription() {
  const [status, setStatus] = useState<SubscriptionStatus>('loading');
  const [daysLeft, setDaysLeft] = useState(0);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setStatus('free');
      return;
    }

    const { data: sub } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    setSubscription(sub);

    if (!sub) {
      setStatus('free');
      return;
    }

    if (sub.status === 'active') {
      setStatus('active');
      return;
    }

    if (sub.status === 'trial' && sub.trial_ends_at) {
      const endDate = new Date(sub.trial_ends_at);
      const now = new Date();
      const diffTime = endDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 0) {
        setStatus('trial');
        setDaysLeft(diffDays);
      } else {
        setStatus('expired');
      }
    } else if (sub.status === 'canceled') {
      setStatus('expired');
    }
  };

  return { status, daysLeft, subscription, refresh: checkSubscription };
}