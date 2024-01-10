import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
	statusCode: string;
}

const ErrorPage = ({ statusCode }: Props) => {
	const navigate = useNavigate();
	useEffect(() => {
		var canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
		if (!canvas) {
			return;
		}

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		var ctx = canvas.getContext("2d");
		if (!ctx) {
			return;
		}

		var ballRadius = 15;
		var x = canvas.width / 3;
		var y = canvas.height - 40;
		var dx = 5;
		var dy = -5;

		var x2 = 701;
		var y2 = 20;
		var dx2 = 5;
		var dy2 = -5;

		function drawBall() {
			if (!ctx) {
				return;
			}
			ctx.beginPath();
			ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
			ctx.fillStyle = "#f67539";
			ctx.fill();
			ctx.closePath();
		}

		function drawBall2() {
			if (!ctx) {
				return;
			}
			ctx.beginPath();
			ctx.arc(x2, y2, ballRadius, 0, Math.PI * 2);
			ctx.fillStyle = "#0e7490";
			ctx.fill();
			ctx.closePath();
		}

		var buttons = Array.from(document.querySelectorAll("#border"));
		var buttonCoords = buttons.map((button) => {
			var rect = button.getBoundingClientRect();
			return {
				x: rect.left - canvas.offsetLeft,
				y: rect.top - canvas.offsetTop,
				width: rect.width,
				height: rect.height,
			};
		});

		function draw() {
			ctx?.clearRect(0, 0, canvas.width, canvas.height);
			drawBall();
			drawBall2();

			buttonCoords.forEach((coords) => {
				if (
					x <= coords.x &&
					x + dx > coords.x &&
					y + dy > coords.y &&
					y + dy < coords.y + coords.height
				) {
					dx = -dx;
				} else if (
					x >= coords.x + coords.width &&
					x + dx < coords.x + coords.width &&
					y + dy > coords.y &&
					y + dy < coords.y + coords.height
				) {
					dx = -dx;
				}
				if (
					y <= coords.y &&
					y + dy > coords.y &&
					x + dx > coords.x &&
					x + dx < coords.x + coords.width
				) {
					dy = -dy;
				}
				if (
					y >= coords.y + coords.height &&
					y + dy < coords.y + coords.height &&
					x + dx > coords.x &&
					x + dx < coords.x + coords.width
				) {
					dy = -dy;
				}
				if (
					x2 <= coords.x &&
					x2 + dx2 > coords.x &&
					y2 + dy2 > coords.y &&
					y2 + dy2 < coords.y + coords.height
				) {
					dx2 = -dx2;
				}
				if (
					x2 >= coords.x + coords.width &&
					x2 + dx2 < coords.x + coords.width &&
					y2 + dy2 > coords.y &&
					y2 + dy2 < coords.y + coords.height
				) {
					dx2 = -dx2;
				}
				if (
					y2 <= coords.y &&
					y2 + dy2 > coords.y &&
					x2 + dx2 > coords.x &&
					x2 + dx2 < coords.x + coords.width
				) {
					dy2 = -dy2;
				}
				if (
					y2 >= coords.y + coords.height &&
					y2 + dy2 < coords.y + coords.height &&
					x2 + dx2 > coords.x &&
					x2 + dx2 < coords.x + coords.width
				) {
					dy2 = -dy2;
				}
			});

			if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
				dx = -dx;
			}
			if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
				dy = -dy;
			}

			if (x2 + dx2 > canvas.width - ballRadius || x2 + dx2 < ballRadius) {
				dx2 = -dx2;
			}
			if (y2 + dy2 > canvas.height - ballRadius || y2 + dy2 < ballRadius) {
				dy2 = -dy2;
			}

			x += dx;
			y += dy;

			x2 += dx2;
			y2 += dy2;
		}

		var interval = setInterval(draw, 10);

		// Nettoyer l'intervalle lorsque le composant est démonté
		return () => {
			clearInterval(interval);
		};
	}, []);
	return (
		<>
			<div className="pt-24 pb-20 pr-16 pl-16 bg-cyan-900 h-screen w-screen flex flex-col text-white">
				<canvas
					id="myCanvas"
					className="absolute top-0 left-0 w-full h-full"
				></canvas>
				<div className="h-full w-full grow flex flex-col justify-center  items-center z-10">
					<div
						id="border"
						className="min-w-fit w-96 flex flex-col border-2 border-white rounded-md p-20 gap-4"
					>
						<h1 className="text-9xl font-bold text-[#f67539]">{statusCode}</h1>
						<h2 className="text-4xl font-bold text-[#f67539]">
							Page Not Found
						</h2>
						<button
							onClick={() => navigate("/")}
							className="py-2 px-4 bg-cyan-700  text-white rounded-md hover:bg-[#f67539]"
						>
							Retour à l'accueil
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default ErrorPage;
