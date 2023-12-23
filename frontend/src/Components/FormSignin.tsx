import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AvatarRadioSelect from "./AvatarRadioSelect";

const FormSignin = () => {
	const navigate = useNavigate();
	const [qrLink, setQrLink] = useState<string | undefined>(undefined);
	const [form, setForm] = useState({
		username: "",
		password: "",
		avatar: "",
		twoFaEnable: false,
	});


	const getQRCode = async () => {
		await axios
			.get<string>("/api/qrcode")
			.then((response) => setQrLink(response.data))
			.finally(() => console.log(`QR CODE = ${qrLink}`));
	}

	const createUser = async () => {
		await axios
			.post("/api/signup", form, {
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			})
			.then((response) => {
				setForm({
					username: "",
					password: "",
					avatar: "",
					twoFaEnable: false,
				});
				console.log("response : " + response);
				console.log(`User Created + tfa: ${form.twoFaEnable}`);

				if (form.twoFaEnable) navigate("/twofa-verify");
				else {
					navigate("/accueil");
				}
			})
			.catch((err) => {
				if (err.response && err.response.data && err.response.data.message) {
					const errorMessage = err.response.data.message;
					return alert("Error: " + errorMessage);
				} else {
					return alert("Error: " + err.message);
				}
			});
	};

	// const handleFormChange = (event: ChangeEvent<HTMLInputElement>) => {
	//   setForm({
	//     ...form,
	//     [event.target.name]: event.target.value,
	//   });
	// };

	const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.name === "username") {
			setForm({ ...form, username: e.target.value });
			console.log("username state : " + form.username);
		} else if (e.target.name === "password") {
			setForm({ ...form, password: e.target.value });
		} else if (e.target.name === "avatar") {
			setForm({ ...form, avatar: e.target.value });
		} else if (e.target.name === "twoFaEnable") {
			setForm({ ...form, twoFaEnable: e.target.checked });
			if (e.target.checked) {
				getQRCode();
			}
		}
	};

	const handleAvatarChange = (avatar: string) => {
		setForm({
			...form,
			avatar,
		});
	};


	return (
		<>
			<form className="min-w-fit w-96 flex flex-col" name="loginForm">
				{
					<>
						<div className="flex flex-row gap-4">
							<AvatarRadioSelect
								onChange={handleAvatarChange}
							></AvatarRadioSelect>
						</div>
						<div className="flex flex-col gap-2 border border-x-0 border-t-0 border-gray-400 py-4">
							<input
								type="text"
								name="username"
								className="border border-white px-3 py-2 bg-transparent text-white rounded-md"
								placeholder="Pseudo"
								onChange={handleFormChange}
							/>
							<input
								type="password"
								name="password"
								className="border border-white px-3 py-2 bg-transparent text-white rounded-md"
								placeholder="Mot de passe"
								onChange={handleFormChange}
							/>
							<div className="flex gap-3 items-center py-6">
								<input
									type="checkbox"
									id="twoFaEnable"
									name="twoFaEnable"
									onChange={handleFormChange}
								/>
								<label htmlFor="twoFaEnable" className="ml-2">
									Activer la double authentification
								</label>
							</div>
							{form.twoFaEnable && (
								<div className="flex justify-center items-center py-6">
									<img
										src={qrLink}
										alt="QR Code for Two-Factor Authentication"
									/>
								</div>
							)}
						</div>
					</>
				}
				<div className="flex flex-row mt-4 justify-between items-center">
					{
						<button
							type="button"
							onClick={() => createUser()}
							className="bg-white text-black py-2 px-4 rounded-md border border-white"
						>
							Terminer l'inscription
						</button>
					}
					<a href="/login" className="text-gray-400 hover:text-white">
						J'ai déjà un compte !
					</a>
				</div>
			</form>
		</>
	);
};

export default FormSignin;
