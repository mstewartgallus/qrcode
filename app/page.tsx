import type { Metadata } from "next";
import Form from "./_ui/Form";

const IndexPage = async () => {
    return <>
        <h1>Flier/Sticker Generator</h1>
        <Form />
      </>;
};

export default IndexPage;

export const metadata: Metadata = {
  title: "Flier/Sticker Generator"
};
