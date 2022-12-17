import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import { auth } from './firebase';
import { PrivateRoute } from 'components/PrivateRoute';
import { AuthProvider } from 'contexts/AuthContext';
import { Login, Logout } from 'views';
import {
  CreateInvoice,
  InvoiceDetails,
  Invoices,
  InvoiceLayout,
} from 'views/invoices';

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URI,
});

const authLink = setContext(async (_, { headers }) => {
  const token = await auth.currentUser?.getIdToken(true);

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    <AuthProvider>
      <Toaster position='top-right' toastOptions={{ duration: 2000 }} />
      <ApolloProvider client={apolloClient}>
        <BrowserRouter>
          <Routes>
            <Route path='login' element={<Login />} />
            <Route path='logout' element={<Logout />} />
            <Route
              path='/'
              element={
                <PrivateRoute>
                  <InvoiceLayout>
                    <Invoices />
                  </InvoiceLayout>
                </PrivateRoute>
              }
            />
            <Route
              path='invoices'
              element={
                <PrivateRoute>
                  <InvoiceLayout>
                    <Invoices />
                  </InvoiceLayout>
                </PrivateRoute>
              }
            />
            <Route
              path='invoices/create'
              element={
                <PrivateRoute>
                  <InvoiceLayout>
                    <CreateInvoice />
                  </InvoiceLayout>
                </PrivateRoute>
              }
            />
            <Route
              path='invoices/:invoice_number'
              element={
                <PrivateRoute>
                  <InvoiceLayout>
                    <InvoiceDetails />
                  </InvoiceLayout>
                </PrivateRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </ApolloProvider>
    </AuthProvider>
  );
}
