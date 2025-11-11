import type { JSX } from "react";
import { Form } from "react-router-dom";

export default function Settings() {
  return (
    <div>
      <div>
        <AvatarUpdate />
        <BioUpdate />
        <UsernameUpdate />
        <PasswordUpdate />
      </div>
    </div>
  );
}

function AvatarUpdate(): JSX.Element {
  return (
    <Form method="POST">
      <input
        type="file"
        accept="images"
        name="avatar"
        placeholder="new Username"
      />
    </Form>
  );
}

function BioUpdate(): JSX.Element {
  return <Form method="POST"></Form>;
}

function UsernameUpdate(): JSX.Element {
  return <Form method="POST"></Form>;
}

function PasswordUpdate(): JSX.Element {
  return <Form method="POST"></Form>;
}

export async function settingHandler({ request }) {
  return null;
}
