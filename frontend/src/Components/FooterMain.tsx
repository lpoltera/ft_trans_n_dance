const FooterMain = () => {
	const url = window.location.href;
	const urlSegments = url.split("/");
	let idURL: string | any = urlSegments[urlSegments.length - 1];


	return (
		<>
			<div className="-z-10 fixed bottom-0 flex justify-center items-center w-full text-white"> Made with ❤️ and ☕️ by lucie, laurent, raph, bryan and lucas </div>
			<div className={`fixed bottom-0 right-0 left-0 flex items-center justify-between pl-6 pr-6 h-16 text-sm text-neutral-400 ${idURL === "accueil" || idURL === "" || idURL === "login" || idURL === "signin" ? "" : "bg-cyan-900"}`}>
				<span>© 2023</span>
				<a href="https://github.com/lpoltera/ft_trans_n_dance" target="_blank" className="hover:text-white">
					Github
				</a>
			</div>
		</>
	);
};

export default FooterMain;
