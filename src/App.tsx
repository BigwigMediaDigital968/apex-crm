import { RouterProvider } from "react-router";

import Providers from "./providers";
import { router } from "./router";
import AuthBootstrap from "@/providers/AuthBootstrap";
import { ActiveCallPopup } from "./features/dialer/components/ActiveCallPopup";

function App() {
  return (
    <>
      <Providers>
        <AuthBootstrap>

          <RouterProvider router={router} />
        </AuthBootstrap>
      </Providers>
    </>

  );
}

export default App;