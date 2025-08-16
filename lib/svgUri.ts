const svgUri = (svg: string) => {
    const data = btoa(svg);
    return `data:image/svg+xml;base64,${data}`;
};

export default svgUri;
