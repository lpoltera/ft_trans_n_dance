import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import PageLayout from "../Components/PageLayout";
import { useNavigate } from "react-router-dom";

const TfaPage = () => {
  const navigate = useNavigate();
  const [qrLink, setQrLink] = useState<string | undefined>(undefined);
  const [authCode, setAuthCode] = useState<string>("");
  useEffect(() => {
    const getTfaLink = async () => {
      try {
        const response = await axios.get("/api/qrcode");
        console.log(`Response TfaPage = ${response.data}`);
        setQrLink(response.data);
      } catch (error) {
        setQrLink(undefined);
      }
    };

    getTfaLink();
  }, []);

  const onChangeForm = (e: ChangeEvent<HTMLInputElement>) => {
    setAuthCode(e.target.value);
  };

  console.log("test");
  const handleOnSubmit = async (e: any) => {
    e.preventDefault();
    if (authCode) {
      console.log(`4uthCode = ${authCode}`);
      const requestData = { token: authCode };
      try {
        await axios.post(`api/twofacheck`, requestData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        navigate("/accueil");
      } catch (error) {
        return alert("Le code d'authentification est invalide");
      }
    }
  };

  return (
    <>
      <PageLayout>
        <div className="w-full h-full grow flex flex-col items-center justify-center gap-12 pb-12">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-xl ">Double authentification</h1>
            </div>
            <img src={qrLink} />
            <form onSubmit={handleOnSubmit} className="flex flex-col gap-2">
              <label htmlFor="twoFaCode" className="text-sm">
                Code de vérification :
              </label>
              <input
                type="text"
                name="twoFaCode"
                id="twoFaCode"
                value={authCode}
                onChange={(e) => onChangeForm(e)}
                className="text-black"
              />
              <button type="submit">confirmer</button>
            </form>
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export default TfaPage;
