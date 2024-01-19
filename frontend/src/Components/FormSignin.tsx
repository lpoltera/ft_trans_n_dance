import axios from "axios";
import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import AvatarRadioSelect from "./AvatarRadioSelect";

const FormSignin = () => {
	const navigate = useNavigate();
	const [qrLink, setQrLink] = useState<string | undefined>(undefined);
	const [showEditModal, setShowEditModal] = useState(false);
	const [passwordConfirmed, setPasswordConfirmed] = useState(false);
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

	const createUser = async (e: FormEvent) => {
		e?.preventDefault();
		if (passwordConfirmed === false) {
			return alert("Les mots de passe ne correspondent pas");
		}
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
		} else if (e.target.name === "confirmPassword") {
			if (e.target.value === form.password) {
				setPasswordConfirmed(true);
			} else {
				setPasswordConfirmed(false);
			}
		} else if (e.target.name === "avatar") {
			setForm({ ...form, avatar: e.target.value });
		} else if (e.target.name === "twoFaEnable") {
			setForm({ ...form, twoFaEnable: e.target.checked });
			if (e.target.checked) {
				getQRCode();
				setShowEditModal(true);
			}
		}
	};

	const handleAvatarChange = (avatar: string) => {
		setForm({
			...form,
			avatar,
		});
	};

	const checkScan = () => {
		if (window.confirm("Es-tu sûr d'avoir scanner le QR Code ?")) {
			setShowEditModal(false);
		}
	}


	return (
		<>
			<form className="min-w-fit w-96 flex flex-col border-white border-2 rounded-md p-20 gap-4 z-10" name="loginForm"
				onSubmit={(e) => createUser(e)}
			>
				{
					<>
						<div className="flex flex-row gap-4">
							<AvatarRadioSelect
								onChange={(e) => handleAvatarChange(e)}
							></AvatarRadioSelect>
						</div>
						<div className="flex flex-col gap-2 border border-x-0 border-t-0 border-gray-400 py-4">
							<input
								type="text"
								name="username"
								className="border-2 border-[#f67539] px-3 py-2 bg-transparent text-white rounded-md custom-input"
								placeholder="Pseudo"
								onChange={(e) => handleFormChange(e)}
							/>
							<input
								type="password"
								name="password"
								autoComplete="on"
								className="border-2 border-[#f67539] px-3 py-2 bg-transparent text-white rounded-md custom-input"
								placeholder="Mot de passe (*)"
								onChange={(e) => handleFormChange(e)}
							/>
							<input
								type="password"
								name="confirmPassword"
								autoComplete="on"
								className={`border-2 border-[#f67539] px-3 py-2 bg-transparent rounded-md custom-input ${passwordConfirmed ? "text-white border-[#f67539]" : "custom-input-confirm"}`}
								placeholder="Confirmer le mot de passe"
								onChange={(e) => handleFormChange(e)}
							/>
							<div className="flex flex-row items-center italic text-xs"><sup className=" pr-1">*</sup>8 caractères min, 1 majuscule, 1 chiffre, 1 caractère spécial
							</div>
							<div className="flex gap-3 items-center py-6">
								<input
									type="checkbox"
									id="twoFaEnable"
									name="twoFaEnable"
									onChange={(e) => handleFormChange(e)}
								/>
								<label htmlFor="twoFaEnable" className="ml-2">
									Activer la double authentification
								</label>
							</div>
							{form.twoFaEnable && showEditModal && (
								<div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center bg-black/60">
									<div className="relative p-8 bg-grey w-full max-w-2xl mx-auto rounded-md shadow-lg bg-neutral-800">
										<div className="flex flex-col space-y-4">
											<h3 className="text-2xl font-semibold text-center mb-4">
												Assure-toi d'avoir bien scanné le QR Code
												<span className="animate-pulse" style={{ fontSize: "70px" }}> 🤳</span>
											</h3>
											<div className="flex justify-center items-center py-6">
												<img
													src={qrLink}
													alt="QR Code for Two-Factor Authentication"
												/>
											</div>
											<div className="flex justify-around mt-7">
												<div className="flex justify-end gap-4 text-sm">
													<button
														type="button"
														className="mt-5 py-2 px-4 bg-cyan-700  text-white rounded-md hover:bg-[#f67539] cursor-pointer"
														onClick={() => checkScan()}													>
														Suivant
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					</>
				}
				<div className="flex flex-row mt-4 justify-between items-center">
					{
						<button
							type="submit"
							// onSubmit={() => createUser()}
							className="py-2 px-4 bg-cyan-700  text-white rounded-md hover:bg-[#f67539]"
						>
							Terminer l'inscription
						</button>
					}
					<a href="/login" className="text-gray-400 hover:text-[#f67539]">
						J'ai déjà un compte !
					</a>
				</div>
			</form>
		</>
	);
};

export default FormSignin;
