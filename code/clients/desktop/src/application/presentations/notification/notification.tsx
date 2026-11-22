'use client';

import React from 'react';

import type { NotificationViewProps } from '@sellgar/app/next';
import { Notification } from '@sellgar/kit';

import s from './default.module.css';

export const NotificationView: React.FC<NotificationViewProps> = ({ notification, close }) => (
  <div className={s.wrapper} role={notification.status === 'destructive' ? 'alert' : 'status'}>
    <Notification.Default
      status={notification.status}
      title={notification.title}
      description={notification.description}
      slot={notification.slot}
      onClose={close}
    />
  </div>
);
