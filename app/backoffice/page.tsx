"use client"
import { Admin, Resource, ListGuesser, EditGuesser, ShowGuesser } from 'react-admin';
import MoradorList from './Moradores/MoradorList';

export default function Backoffice() {
  return (
    <Admin>
+   <Resource name="/pessoas" list={ListGuesser} />
<Resource name="/moradores" list={MoradorList} />
<Resource name="/aa" list={ListGuesser} />
<Resource name="/asa" list={ListGuesser} />
  </Admin>
  );
}
