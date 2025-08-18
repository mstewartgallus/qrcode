"use client";

import type { ReactNode } from "react";
import svgUri from "@/lib/svgUri";
import { useTransition, useCallback, useLayoutEffect, useRef, useState } from "react";

interface WrapProps {
    children: ReactNode;
    layoutAction?: (svg: string) => Promise<void>;
}

const Wrap = ({ children, layoutAction }: WrapProps) => {
    const ref = useRef<HTMLDivElement>(null);
    // FIXME... seems very ick
    useLayoutEffect(() => {
        const svg = (ref.current!.lastChild as HTMLElement).outerHTML;
        layoutAction?.(svg);
    });
    return <div ref={ref}>{children}</div>;
}

interface Props {
    children: ReactNode;
    download: string;
}

const SvgDownload = ({ children, download }: Props) => {
    const [, startTransition] = useTransition();
    const [src, setSrc] = useState<string | null>(null);
    const layoutAction = useCallback(async (svg: string) => {
        const newSrc = svgUri(svg);
        if (src !== newSrc) {
            startTransition(() => setSrc(newSrc));
        }
    }, [src]);
    return <a href={src ?? undefined} download={download}>
           <Wrap layoutAction={layoutAction}>{children}</Wrap>
        </a>;
}

export default SvgDownload;
