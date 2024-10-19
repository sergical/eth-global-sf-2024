import { AppHeader } from "@/components/app-header";
import LandingPage from "@/components/landing-page";
import getFileFromWalrusAction from "@/server/get-file-from-walrus-action";

export default async function Main() {
  const response = await getFileFromWalrusAction(
    "YKTt1Z-iei12VmI7qWzEeqzsu_w4by1EgXydSy2mI7U"
  );
  console.log(response);

  // render the image
  return (
    <>
      <AppHeader />
      <LandingPage />
    </>
  );
}
