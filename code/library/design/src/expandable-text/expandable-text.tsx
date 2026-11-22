'use client';

import React from 'react';

import { ButtonLink } from '@sellgar/kit';
import { ArrowDownSLineIcon, ArrowUpSLineIcon } from '@sellgar/kit/icons';

import s from './default.module.css';

interface IProps {
  children: React.ReactNode;
  open: boolean;
  onOpen: (open: boolean) => void;
}

export const ExpandableText: React.FC<IProps> = (props) => {
  const contentId = React.useId();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = React.useState(false);

  React.useEffect(() => {
    const content = contentRef.current;

    if (!content || props.open) {
      return;
    }

    const measure = () => setOverflowing(content.scrollHeight > content.clientHeight);
    const observer = new ResizeObserver(measure);

    measure();
    observer.observe(content);

    return () => observer.disconnect();
  }, [props.children, props.open]);

  return (
    <div className={s.wrapper}>
      <div id={contentId} ref={contentRef} className={s.content} data-open={props.open}>
        {props.children}
      </div>
      {overflowing || props.open ? (
        <div className={s.control}>
          <ButtonLink
            type="button"
            size="sm"
            aria-controls={contentId}
            aria-expanded={props.open}
            tailIcon={props.open ? <ArrowUpSLineIcon /> : <ArrowDownSLineIcon />}
            onClick={() => props.onOpen(!props.open)}
          >
            {props.open ? 'Свернуть' : 'Читать полностью'}
          </ButtonLink>
        </div>
      ) : null}
    </div>
  );
};
