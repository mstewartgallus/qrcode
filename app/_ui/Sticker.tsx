"use client";

import QrCode from "./QrCode";

interface Props {
    image?: string;
    title: string;
    author: string;
    href: string;
}

const Sticker = ({ image, title, author, href }: Props) => {
    return <main>
        <header style={{ marginBottom: '0.05in' }}>
        { image && <img style={{width: '0.47in', height: '0.47in', float: 'right' }} alt="" src={image} width={40} height={40} /> }
           <hgroup style={{ wordBreak: 'break-all' }}>
               <h1 style={{all: 'unset', display: 'block', fontStyle: 'italic'}}>{title}</h1>
               <p style={{all: 'unset', display: 'block'}}>{author}</p>
               <p style={{all: 'unset', display: 'block', clear: 'both'}}>{href}</p>
           </hgroup>
        </header>
        <QrCode value={href} />
        </main>;
};

export default Sticker;
