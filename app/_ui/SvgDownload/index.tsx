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
    const [svg, setSvg] = useState(null);
    // FIXME... seems very ick
    useLayoutEffect(() => {
        const newSvg = (ref.current!.lastChild as HTMLElement).outerHTML;
        if (svg === newSvg) {
            return;
        }
        setSvg(newSvg);
        layoutAction?.(newSvg);
    });
    return <div ref={ref} style={{display: 'contents'}}>{children}</div>;
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
        if (src === newSrc) {
            return;
        }
        startTransition(() => setSrc(newSrc));
    }, [src]);
    return <a href={src ?? undefined} download={download}>
           <Wrap layoutAction={layoutAction}>{children}</Wrap>
        </a>;
}

export default SvgDownload;
