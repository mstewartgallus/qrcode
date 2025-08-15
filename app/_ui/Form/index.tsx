"use client";

import type { ReactNode, ChangeEvent, MouseEvent, FormEvent } from "react";
import Sticker from "../Sticker";
import { useCallback, useMemo, useId, useState } from "react";
import { createRoot } from "react-dom/client";

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
   size: 2.4in 3.4in;
   margin: 0.1in;
}
@media screen {
   main {
      overflow: hidden;
      width: 2.4in;
      height: 3.4in;
      padding: 0.1in;
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

const schedule = async () => {
     await new Promise<void>(res => setTimeout(() => res(), 0));
};

const renderString = async (children: ReactNode) => {
    const iframe = document.createElement('iframe');
    iframe.hidden = true;
    const body = document.body;
    body.appendChild(iframe);

    const doc = iframe.contentDocument!;
    doc.location = '';
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
    iframe.hidden = true;
    const body = document.body;
    body.appendChild(iframe);

    const doc = iframe.contentDocument!;
    doc!.location = '';
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

const chooseFile = async (accept: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    await new Promise<void>((res) => {
        input.onchange = () => {
            res();
        };
        input.click();
    });
    const files = input.files;
    if (!files) {
        return [];
    }
    return [...files];
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
    const [name, setName] = useState<string | null>(null);
    const [image, setImage] = useState<string | null>(null);

    const sticker = useMemo(() => {
        return <Sticker
       image={image ?? undefined}
       title={title ?? titlePlaceholder}
       author={author ?? authorPlaceholder}
        href={href ?? hrefPlaceholder} />;
    }, [image, title, author, href]);

    const stickerDoc = useMemo(() => {
        return <>
           <head>
              <style>{stickerStyle}</style>
           </head>
           <body>
               {sticker}
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

    const onSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        download('agitprop.html', await renderString(stickerDoc));
    }, [stickerDoc]);

    const onClickPrint = useCallback((event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        print(stickerDoc);
    }, [stickerDoc]);

    const uploadAction = useCallback(async () => {
        const file = (await chooseFile(accept))[0];
        const name = file.name;

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
        setName(name);
    }, []);

    const stickerHeading = useId();
    // FIXME create a hidden iframe in the background to save and print
    return <form onSubmit={onSubmit}>
        <fieldset className={styles.inputs}>
           <label>Title</label>
           <input className={styles.input} required maxLength={25} type="text" name="title" placeholder={titlePlaceholder} value={title ?? ''} onChange={onChangeTitle} />
           <label>Author</label>
           <input className={styles.input} required maxLength={25} type="text" name="author" placeholder={authorPlaceholder} value={author ?? ''} onChange={onChangeAuthor} />
           <label>Url</label>
           <input className={styles.input} required maxLength={78} type="url" name="value" placeholder={hrefPlaceholder} value={href ?? ''} onChange={onChangeValue}  />
           <label>{name ? name : 'No Selection'}</label>
           <button className={styles.inputButton} onClick={uploadAction}>Select Image</button>
        </fieldset>
        <section className={styles.output} aria-labelledby={stickerHeading}>
           <h2 id={stickerHeading}>Sticker Format 2.4&quot;×3.4&quot;</h2>
           <fieldset className={styles.buttons}>
              <div>
                 <button value="save">Download Sticker</button>
              </div>
              <div>
                 <button value="print" onClick={onClickPrint}>Print Sticker</button>
              </div>
           </fieldset>
           <output>
               <div className={styles.sticker}>
                  {sticker}
               </div>
            </output>
        </section>
   </form>
};

export default Form;
