'use client';

import OneSignal from 'react-onesignal';
import { useEffect } from "react";
import { env } from '~/env';

export const useOneSignal = (id: string) => {
  useEffect(() => {

    // Ensure this code runs only on the client side
    if (typeof window === 'undefined') return

    OneSignal.init({
      appId: env.NEXT_PUBLIC_ONE_SIGNAL_APP_ID,

      notifyButton: {
        text: {
          "dialog.blocked.message": "We noticed you have notifications blocked",
          "dialog.blocked.title": "Notifications Blocked",
          "dialog.main.button.subscribe": "Allow Notifications",
          "dialog.main.button.unsubscribe": "Block Notifications",
          "dialog.main.title": "Stay Updated",
          "message.action.resubscribed": "You have successfully subscribed to notifications",
          "message.action.subscribed": "You have successfully subscribed to notifications",
          "message.action.unsubscribed": "You have successfully unsubscribed from notifications",
          "message.action.subscribing": "Subscribing you to notifications...",
          "message.prenotify": 'We will send you notifications when we have updates',
          "tip.state.blocked": "You have blocked notifications",
          "tip.state.subscribed": "You are subscribed to notifications",
          "tip.state.unsubscribed": "You are not subscribed to notifications",
        },
        enable: true,
        prenotify: true,
        showCredit: true,
      },
      // You can add other initialization options here
      // notifyButton: {
      //   enable: true,
      // },
      // Uncomment the below line to run on localhost. See: https://documentation.onesignal.com/docs/local-testing
      allowLocalhostAsSecureOrigin: true
    }).then(async () => {
      await OneSignal.login(id)
      // OneSignal.User.externalId = id
    })


    return () => {
      // OneSignal.
    }
  }, [id]);

}
