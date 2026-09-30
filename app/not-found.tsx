import { redirect } from 'next/navigation';

// Unknown routes fall back to the default route; LayoutWrapper sends
// logged-out users on to `/login`
export default function NotFound() {
  redirect('/home');
}
