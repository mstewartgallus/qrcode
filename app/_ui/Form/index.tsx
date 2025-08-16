"use client";

import type { ReactNode, ChangeEvent } from "react";
import Sticker from "../Sticker";
import { useCallback, useMemo, useId, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import qrcode from "qrcode-generator";

import styles from "./Form.module.css";

const titlePlaceholder = "The Art of War";
const authorPlaceholder = "Sun Tzu";
const hrefPlaceholder = "https://www.gutenberg.org/ebooks/132";

const stickerStyle = `
html,
body {
    display: block;
    padding: 0;
    margin: 0;
    font-family: system-ui, sans-serif;
}

* {
    box-sizing: border-box;
}
@page {
   size: 2.4in 3.9in;
   margin: 0.1in;
}
@media screen {
   main {
      width: 2.4in;
      height: 3.9in;
      padding: 0.1in;
  }
}
@media screen {
   main {
      overflow: hidden;
   }
   body {
      background-color: grey;
   }
   main {
      background-color: Canvas;
   }
}
body {
   display: flex;
   justify-content: center;
   align-items: center;
}
`;

const schedule = async (timeout: number = 500) => {
    // FIXME... ugly hack
    await new Promise<void>(res => setTimeout(() => res(), timeout));
};

const renderDoc = async (children: ReactNode) => {
    const iframe = document.createElement('iframe');
    iframe.style.visibility = "hidden";

    const body = document.body;
    body.appendChild(iframe);

    await schedule();

    const doc = iframe.contentDocument!;
    try {
        const root = createRoot(doc.documentElement);
        try {
            root.render(children);

            await schedule();

            return doc.documentElement.outerHTML;
        } finally {
            root.unmount();
        }
    } finally {
        body.removeChild(iframe);
    }
};

const print = async (children: ReactNode) => {
    const iframe = document.createElement('iframe');
    // work on Chrome
    iframe.style.visibility = "hidden";
    const body = document.body;
    body.appendChild(iframe);

    await schedule();

    const doc = iframe.contentDocument!;
    try {
        const root = createRoot(doc.documentElement);
        try {
            root.render(children);

            await schedule();

            iframe.contentWindow?.print();
        } finally {
            root.unmount();
        }
    } finally {
        body.removeChild(iframe);
    }
};

// FIXME... use data uri?
const download = (name: string, content: string) => {
    const url = URL.createObjectURL(new Blob([content]));
    try {
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = name;
        anchor.click();
    } finally {
        URL.revokeObjectURL(url);
    }
};

const accept = `image/*`;

const Form = () => {
    const [title, setTitle] = useState<string | null>(null);
    const [author, setAuthor] = useState<string | null>(null);
    const [href, setHref] = useState<string | null>(null);
    const [image, setImage] = useState<string | null>(null);

    const url = useMemo(() => {
        // FIXME.. handle malformed url better.
        const url = href ?? hrefPlaceholder;
        try {
            return new URL(url);
        } catch (e) {
            console.warn(e);
            return new URL(hrefPlaceholder);
        }
    }, [href]).href;

    const qr = useMemo(() => {
        const qr = qrcode(0, 'L')
        qr.addData(url);
        qr.make();
        return qr;
    }, [url]);

    // FIXME... track height for downloading/printing

    const sticker = useMemo(() => {
        return <Sticker
        qr={qr}
        image={image ?? undefined}
        title={title ?? titlePlaceholder}
        author={author ?? authorPlaceholder}
        href={url} />;
    }, [image, title, author, url, qr]);

    const stickerDoc = useMemo(() => {
        return <>
           <head>
              <style>{stickerStyle}</style>
           </head>
            <body>
              <main>
                {sticker}
              </main>
           </body>
            </>;
    }, [sticker]);

    const onChangeTitle = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setTitle(event.target.value);
    }, []);
    const onChangeAuthor = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setAuthor(event.target.value);
    }, []);
    const onChangeValue = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setHref(event.target.value);
    }, []);

    const downloadAction = useCallback(async () => {
        download('agitprop.html', await renderDoc(stickerDoc));
    }, [stickerDoc]);

    const printAction = useCallback(() => {
        print(stickerDoc);
    }, [stickerDoc]);

    const fileRef = useRef<HTMLInputElement>(null);

    const onChangeFile = useCallback(async () => {
        const file = fileRef.current!.files![0];

        const data = await new Promise<string>(res => {
            const reader = new FileReader();
            reader.addEventListener(
                'load',
                () => {
                    // convert image file to base64 string
                    res(reader.result as string);
                },
                false,
            );
            reader.readAsDataURL(file);
        });
        setImage(data);
    }, []);

    const stickerHeading = useId();

    return <form action={printAction}>
        <fieldset className={styles.inputs}>
           <label>Title</label>
           <input className={styles.input} required maxLength={80} type="text" name="title" placeholder={titlePlaceholder} value={title ?? ''} onChange={onChangeTitle} />
           <label>Author</label>
           <input className={styles.input} required maxLength={40} type="text" name="author" placeholder={authorPlaceholder} value={author ?? ''} onChange={onChangeAuthor} />
           <label>Url</label>
           <input className={styles.input} required maxLength={160} type="url" name="value" placeholder={hrefPlaceholder} value={href ?? ''} onChange={onChangeValue}  />
           <label>Tracker Square</label>
           <input accept={accept} ref={fileRef} required type="file" onChange={onChangeFile} />
        </fieldset>
        <section className={styles.output} aria-labelledby={stickerHeading}>
           <h2 id={stickerHeading}>Sticker Format 2.4&quot;×3.9&quot;</h2>
           <fieldset className={styles.buttons}>
              <div>
                 <button value="print">Print Sticker</button>
              </div>
              <div>
                 <button value="download" formAction={downloadAction}>Download Sticker</button>
              </div>
           </fieldset>
              <section className={styles.sticker}>
                 {sticker}
               </section>
        </section>
   </form>
};

export default Form;
