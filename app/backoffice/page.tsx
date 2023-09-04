"use client"
import { Admin, Resource, ListGuesser, EditGuesser, ShowGuesser } from 'react-admin';

export default function Backoffice() {
  return (
    <Admin>
+   <Resource name="pessoas" list={ListGuesser} />
  </Admin>
  );
}
