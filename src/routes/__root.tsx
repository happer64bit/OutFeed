import { Outlet, createRootRoute } from '@tanstack/react-router'
import '@fontsource-variable/inter';

export const Route = createRootRoute({
  component: () => {
    return (
      <Outlet />
    )
  }
})
