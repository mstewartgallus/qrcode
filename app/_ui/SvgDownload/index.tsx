"use client";

import type { ReactNode } from "react";
import svgUri from "@/lib/svgUri";
import { useLayoutEffect, useRef, useState } from "react";

interface Props {
    children: ReactNode;
    download: string;
}

const SvgDownload = ({ children, download }: Props) => {
    const [src, setSrc] = useState<string | null>(null);
    const ref = useRef<HTMLAnchorElement>(null);
    useLayoutEffect(() => {
        const svg = (ref.current!.lastChild as HTMLElement).outerHTML;
        const newSrc = svgUri(svg);
        if (src !== newSrc) {
            setSrc(newSrc);
        }
    });
    return <a ref={ref} href={src ?? undefined} download={download}>{children}</a>;
}

export default SvgDownload;
