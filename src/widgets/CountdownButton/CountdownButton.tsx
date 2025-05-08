'use client'

import type { ButtonProps } from "@cybercore/ui/Button";
import { Button } from "@cybercore/ui/Button"
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import { set } from "zod";
import { useTRPC } from "~/trpc/client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ACTIONS = ['hacking', 'posting', 'fixingChip'] as const
type Action = typeof ACTIONS[number]

type CountdownButtonProps = ButtonProps & {
  action: Action;
}

export const CountdownButton = ({ action, text, onClick, ...props }: CountdownButtonProps) => {
  const trpc = useTRPC()
  const { data: gameSettingsData } = useSuspenseQuery(trpc.gameSettings.getData.queryOptions());

  const [actionTime, setActionTime] = useState<Date | null>(() => {
    const actionTime = localStorage.getItem(`action-${action}`);
    if (actionTime) return new Date(parseInt(actionTime))

    return null
  });

  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isActionDisabled, setIsActionDisabled] = useState(true);

  useEffect(() => {
    if (actionTime) {
      const lastActionTIme = new Date(actionTime).getTime();
      const toDate = new Date(lastActionTIme + gameSettingsData.timerSettings[action] * 60 * 1000)

      const diff = Math.floor((toDate.getTime() - Date.now()) / 1000);

      if (diff > 0) {
        setIsActionDisabled(true);
        setTimeLeft(diff);
      } else {
        setIsActionDisabled(false);
        setTimeLeft(0);
      }
    } else {
      setIsActionDisabled(false)
    }
  }, [action, actionTime, gameSettingsData.timerSettings]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActionDisabled) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (interval) clearInterval(interval);
            setIsActionDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActionDisabled]);

  const handleClick = useCallback<NonNullable<ButtonProps['onClick']>>((e) => {
    const time = new Date()
    localStorage.setItem(`action-${action}`, time.getTime().toString());
    setActionTime(time);
    setIsActionDisabled(true);

    if (onClick) onClick(e)
  }, [action, onClick])

  return <Button
    {...props}
    text={isActionDisabled ? `Wait ${timeLeft}s` : text}
    onClick={handleClick}
    disabled={isActionDisabled}
  />
}