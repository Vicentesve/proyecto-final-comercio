import { collection, getDocs, query } from "firebase/firestore";
import { getSession } from "next-auth/react";
import React from "react";
import Header from "../components/Header";
import { db } from "../firebase/initFirebase";
import CarouselFuturos from "../components/CarouselFuturos";

function misfuturos({ entriesData }) {
  function groupArrayOfObjects(list, key) {
    return list.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }
  var groupedFuturos = groupArrayOfObjects(entriesData, "nombre");

  return (
    <div>
      <Header />
      <div className="bg-white">
        <h1 className="font-semibold text-xl p-2 text-center mt-2 sm:text-2xl sm:font-bold">
          {entriesData.length > 0 ? "Mis futuros" : "No tienes futuros"}
        </h1>
        {entriesData.length > 0 ? (
          <div className="p-10 w-full justify-center flex flex-wrap">
            {Object.keys(groupedFuturos).map((obj, i) => {
              return (
                <div key={i} className="w-[30%] relative mb-10">
                  <CarouselFuturos nombre={obj} valores={groupedFuturos[obj]} />
                </div>
              );
            })}
          </div>
        ) : (
          <img
            className="object-contain sm:w-[60%] md:w-[50%] lg:w-[40%] xl:w-[30%] m-auto"
            src="noStock.jpg"
            alt=""
          />
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const querySnapshot = await getDocs(
    collection(db, "users", session.user.email, "futuros")
  );
  const entriesData = querySnapshot.docs.map((entry) => ({
    id: entry.id,
    ...entry.data(),
  }));

  return {
    props: { session, entriesData },
  };
}

export default misfuturos;
