import { useEffect, type PropsWithChildren } from "react";
import { Provider, useDispatch } from "react-redux";
import type { RootStore } from "../../store/rootStore";
import { checkSessionAsync } from "auth_mfe/authSlice";

function SessionBootstrap({ children }: PropsWithChildren) {
  const dispatch = useDispatch<any>();

  useEffect(() => {
    void dispatch(checkSessionAsync());
  }, [dispatch]);

  return <>{children}</>;
}

interface AppProvidersProps extends PropsWithChildren {
  store: RootStore;
}

export function AppProviders({ children, store }: AppProvidersProps) {
  return (
    <Provider store={store}>
      <p>Hello I am here to listenTesting</p>
      <SessionBootstrap>{children}</SessionBootstrap>
    </Provider>
  );
}
