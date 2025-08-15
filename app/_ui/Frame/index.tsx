"use client";

import type { Ref, ReactNode } from "react";
import { useImperativeHandle, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import styles from "./Frame.module.css";

export interface FrameHandle {
    save(name: string): void;
    print(): void;
}

interface Props {
    ref: Ref<FrameHandle>;
    head: ReactNode;
    children: ReactNode;
    width: number;
    height: number;
}

const Frame = ({ ref: frameRef, width, height, head, children }: Props) => {
    const ref = useRef<HTMLIFrameElement>(null);

    useImperativeHandle(frameRef, () => ({
        save: (name: string) => {
            const html = ref.current?.contentDocument?.documentElement.outerHTML ?? '';
            const url = URL.createObjectURL(new Blob([html]));
            try {
                const anchor = document.createElement('a');
                anchor.href = url;
                anchor.download = `${name}.html`;
                anchor.click();
            } finally {
                URL.revokeObjectURL(url);
            }
        },
        print: () => {
            ref.current?.contentWindow?.print();
        }
    }), []);

    const [body, setBody] = useState<HTMLElement | null>(null);
    useEffect(() => {
        setBody(ref.current?.contentDocument?.body ?? null);
        return () => setBody(null);
    }, []);

    const [headElem, setHead] = useState<HTMLElement | null>(null);
    useEffect(() => {
        setHead(ref.current?.contentDocument?.head ?? null);
        return () => setHead(null);
    }, []);

    return <>
        <iframe className={styles.frame} ref={ref} width={width} height={height} />
        {
            headElem && createPortal(head, headElem)
        }
        {
            body && createPortal(children, body)
        }
        </>;
};

export default Frame;
