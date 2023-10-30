"use client"
import { Admin, Resource, ListGuesser, EditGuesser, ShowGuesser } from 'react-admin';
import AccountList from './Moradores/AccountList';

export default function Backoffice() {
  return (
    <Admin>
+   <Resource name="/pessoas" list={ListGuesser} />
<Resource name="/moradores" list={AccountList} />
<Resource name="/aa" list={ListGuesser} />
<Resource name="/asa" list={ListGuesser} />
  </Admin>
  );
}
