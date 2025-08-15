"use client";

import type { ChangeEvent, MouseEvent, FormEvent } from "react";
import type { FrameHandle } from "../Frame";
import Frame from "../Frame";
import QrCode from "../QrCode";
import { useCallback, useRef, useState } from "react";

import styles from "./Form.module.css";

const labelPlaceholder = "Example Web Site";
const valuePlaceholder = "https://example.org";

const style = `
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
`;

const Form = () => {
    const ref = useRef<FrameHandle>(null);

    const [label, setLabel] = useState("");
    const [value, setValue] = useState("");

    const onChangeLabel = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setLabel(event.target.value);
    }, []);
    const onChangeValue = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setValue(event.target.value);
    }, []);

    const onSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        ref.current!.save('agitprop');
    }, []);

    const onClickPrint = useCallback((event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        ref.current!.print();
    }, []);

    // FIXME... add image file picker..
    return <form onSubmit={onSubmit}>
        <fieldset>
           <div>
              <label>Label</label>
        <input className={styles.input} required type="text" name="label" placeholder={labelPlaceholder} value={label} onChange={onChangeLabel} />
           </div>
           <div>
              <label>Value</label>
              <input className={styles.input} required type="url" name="value" placeholder={valuePlaceholder} value={value} onChange={onChangeValue}  />
           </div>
           <div>
              <button value="save">Save</button>
           </div>
           <div>
              <button value="print" onClick={onClickPrint}>Print</button>
           </div>
        </fieldset>
        <output className={styles.output}>
           <Frame ref={ref} width={800} height={800} head={<style>{style}</style>}>
                <QrCode label={label === '' ? labelPlaceholder : label}
                value={value === '' ? valuePlaceholder : value} />
            </Frame>
        </output>
   </form>
};

export default Form;
