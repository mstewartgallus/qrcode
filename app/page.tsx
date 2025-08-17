import type { Metadata } from "next";
import Form from "./_ui/Form";

const IndexPage = async () => {
    return <>
        <h1>Agit-Prop Generator</h1>
        <Form />
      </>;
};

export default IndexPage;

export const metadata: Metadata = {
  title: "Agit-Prop Generator"
};
