import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../Components/PageLayout";

const TfaPage = () => {
	const navigate = useNavigate();
	// const [qrLink, setQrLink] = useState<string | undefined>(undefined);
	const [authCode, setAuthCode] = useState<string>("");
	// const [isLoading, setIsLoading] = useState<boolean>(false);
	// const [error, setError] = useState<string | undefined>(undefined);

	// useEffect(() => {
	// 	let isMounted = true; // Flag to handle component unmount

	// 	const getTfaLink = async () => {
	// 		try {
	// 			setIsLoading(true);
	// 			const response = await axios.get("/api/qrcode");
	// 			console.log(`QR Code : ${response.data}`);
	// 			if (isMounted) {
	// 				setQrLink(response.data);
	// 			}
	// 		} catch (error) {
	// 			if (isMounted) {
	// 				setError('Failed to load QR code. Please try again.');
	// 				console.error(error);
	// 			}
	// 		} finally {
	// 			if (isMounted) {
	// 				setIsLoading(false);
	// 			}
	// 		}
	// 	};

	// 	getTfaLink();

	// 	//Cleanup function to set the flag when component unmounts
	// 	return () => {
	// 		isMounted = false;
	// 	};
	// }, []);

	const onChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAuthCode(e.target.value);
	};

	const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!authCode) {
			return alert("Please enter the authentication code.");
		}
		// setIsLoading(true);
		const requestData = { token: authCode };
		try {
			await axios.post("api/twofacheck", requestData, {
				headers: {
					"Content-Type": "application/json",
				},
			});
			navigate("/accueil");
		} catch (error) {
			alert("Le code d'authentification est invalide.");
			console.error(error);
			// } finally {
			// 	setIsLoading(true);
		}
	};

	// 	return (
	// 		<PageLayout>
	// 			{
	// 				// isLoading ? (
	// 				// <div>Loading...</div>
	// 				// )
	// 				//  :
	// 				(
	// 					<div className="w-full h-full grow flex flex-col items-center justify-center gap-12 pb-12">
	// 						{error && <div className="text-red-500">{error}</div>}
	// 						<div className="flex flex-col gap-4">
	// 							<h1 className="text-xl">Double authentification</h1>
	// 							{/* <img src={qrLink} alt="QR Code for Two-Factor Authentication" /> */}
	// 							<form onSubmit={handleOnSubmit} className="flex flex-col gap-2">
	// 								<label htmlFor="twoFaCode" className="text-sm">
	// 									Code de vérification :
	// 								</label>
	// 								<input
	// 									type="text"
	// 									name="twoFaCode"
	// 									id="twoFaCode"
	// 									value={authCode}
	// 									onChange={onChangeForm}
	// 									className="text-black"
	// 								/>
	// 								<button type="submit" disabled={isLoading}>confirmer</button>
	// 							</form>
	// 						</div>
	// 					</div>
	// 				)}
	// 		</PageLayout>
	// 	);
	// };

	// export default TfaPage;

	// import { ChangeEvent, useEffect, useState } from "react";
	// import axios from "axios";
	// import PageLayout from "../Components/PageLayout";
	// import { useNavigate } from "react-router-dom";

	// const TfaPage = () => {
	// 	const navigate = useNavigate();
	// 	const [qrLink, setQrLink] = useState<string | undefined>(undefined);
	// 	const [authCode, setAuthCode] = useState<string>("");
	// 	const [displayQR, setdisplayQR] = useState<boolean>(true);

	// 	console.log("****** TFAPage called ***********")
	// 	// useEffect(() => {
	// 	const getTfaLink = async () => {
	// 		if (displayQR) {
	// 			try {
	// 				// const user = await axios.get("api/user")
	// 				// console.log(`user = ${user.data.secret2fa}`);
	// 				// if (user.data.secret2fa) {

	// 				//const username = await axios.get("/api/qrcode"); 
	// 				const response = await axios.get("/api/qrcode"); // post username
	// 				console.log(`Response TfaPage = ${response.data}`);
	// 				setQrLink(response.data);
	// 				setdisplayQR(false)
	// 				// }
	// 			} catch (error) {
	// 				setQrLink(undefined);
	// 			}
	// 			finally {
	// 				setdisplayQR(false);
	// 			}
	// 		}
	// 	};
	// 	getTfaLink();
	// 	// }, []);


	// 	const onChangeForm = (e: ChangeEvent<HTMLInputElement>) => {
	// 		setAuthCode(e.target.value);
	// 	};

	// 	const handleOnSubmit = async (e: any) => {
	// 		e.preventDefault();
	// 		if (authCode) {
	// 			console.log(`4uthCode = ${authCode}`);
	// 			const requestData = { token: authCode };
	// 			try {
	// 				await axios.post(`api/twofacheck`, requestData, {
	// 					headers: {
	// 						"Content-Type": "application/json",
	// 					},
	// 				});
	// 				navigate("/accueil");
	// 			} catch (error) {
	// 				return alert("Le code d'authentification est invalide");
	// 			}
	// 		}
	// 	};

	return (
		<>
			<PageLayout>
				<div className="w-full h-full grow flex flex-col items-center justify-center gap-12 pb-12">
					<div className="flex flex-col gap-4">
						<div>
							<h1 className="text-xl ">Double authentification</h1>
						</div>
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
