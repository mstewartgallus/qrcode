import qrcode from "qrcode-generator";
import svgUri from "./svgUri";

type Quality = 'L' | 'M' | 'H';

const qrCodeUri = (value: string, quality: Quality) => {
    const qr = qrcode(4, quality)
    qr.addData(value);
    qr.make();

    // FIXME fix scaling
    const svg = qr.createSvgTag(6.4, 0);
    return svgUri(svg);
};

export default qrCodeUri;
