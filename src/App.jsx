import { useState, useEffect } from "react";
import "./App.css";
import Home from "./components/Home/Home";
import ManagePlaylist from "./components/ManagePlaylist/ManagePlaylist";
import NotFound from "./components/NotFound/NotFound";
import LayOut from "./components/LayOut/LayOut";
import ActivateDevices from "./components/ActivateDevices/ActivateDevices";
import SwitchMac from "./components/SwitchMac/SwitchMac";
import ParentPin from "./components/ParentPin/ParentPin";
import AccountDetails from "./components/AccountDetails/AccountDetails";
import AddPlayList from "./components/AddPlayList/AddPlayList";
import EditPlaylist from "./components/EditPlaylist/EditPlaylist";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ManagePlaylistRouting from "./components/ManagePlaylistRouting/ManagePlaylistRouting";
import TermsCondition from "./components/TermsCondition/TermsCondition.jsx";
import PrivacyPolicy from "./components/PrivacyPolicy/PrivacyPolicy.jsx";
import { ToastContainer } from "react-toastify";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ProtectedRoutes from "./components/ProtectedRoutes/ProtectedRoutes.jsx";

function App() {
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    const getStripeKey = async () => {
      try {
        const response = await fetch(
          "https://shplayer.onrender.com/apiKey/getPublishableKey",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        if (response.ok) {
          setStripePromise(loadStripe(data.key));
        }
      } catch (error) {
        console.error("Error fetching Stripe key:", error);
      }
    };

    getStripeKey();

    let dir = localStorage.getItem("lang") || "en";
    dir = dir === "en" ? "ltr" : "rtl";
    window.document.dir = dir;
    if (
      localStorage.getItem("lang") === "English" ||
      localStorage.getItem("lang") === "Arabic"
    ) {
      localStorage.removeItem("lang");
    }
  }, []);

  const routes = createBrowserRouter([
    {
      path: "/",
      element:
        <LayOut />,
      children: [
        { index: true, element: <Home /> },
        {
          path: "manageplaylist",
          element:
            <ProtectedRoutes>
              <ManagePlaylistRouting />
            </ProtectedRoutes>,
          children: [
            {
              index: true,
              element:
                <ProtectedRoutes>
                  <ManagePlaylist />
                </ProtectedRoutes>
            },
            {
              path: "addplaylist",
              element:
                <ProtectedRoutes>
                  <AddPlayList />
                </ProtectedRoutes>
            },
            {
              path: "editplaylist/:id",
              element:
                <ProtectedRoutes>
                  <EditPlaylist />
                </ProtectedRoutes>
            },
            {
              path: "activatedevices",
              element:
                <ProtectedRoutes>
                  <ActivateDevices />
                </ProtectedRoutes>
            },
            {
              path: "switchmac",
              element:
                <ProtectedRoutes>
                  <SwitchMac />
                </ProtectedRoutes>
            },
            {
              path: "parentpin",
              element:
                <ProtectedRoutes>
                  <ParentPin />
                </ProtectedRoutes>
            },
            {
              path: "accountdetails",
              element:
                <ProtectedRoutes>
                  <AccountDetails />
                </ProtectedRoutes>
            },
          ],
        },
        { path: "termsCondition", element: <TermsCondition /> },
        { path: "privacyPolicy", element: <PrivacyPolicy /> },
        { path: "*", element: <NotFound /> },
      ],
    },
  ]);


  return (
    <Elements stripe={stripePromise}>
      <RouterProvider router={routes}></RouterProvider>
      <ToastContainer />
    </Elements>
  );
}

export default App;
